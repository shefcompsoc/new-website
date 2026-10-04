# Testing

The tests are there to catch code changes that break the site. They don't check content; anything published from Notion is reviewed before it goes live.

## Running them

```bash
npm test             # unit tests, a few seconds
npm run build
npm run test:routes  # needs a build first
```

`npm run lint` and `npm run build` also count as checks: if either fails, the change shouldn't be merged.

## When they run

| Where | What runs |
|---|---|
| Every pull request and push to `main` (`ci.yml`) | `npm test`, `npm run lint`, `npm run build`, `npm run test:routes` |
| Hourly Notion sync (`sync.yml`) | The same four, but only when the sync found changes. If any fail, nothing is committed |
| Pull requests (`lighthouse.yml`) | Lighthouse scores for the home, events, calendar and about pages. Accessibility below 95 fails, the rest only warn |

Don't merge a pull request with a failing check.

## Route check

`scripts/check-routes.mts` starts the production build on port 3100 and requests:

- every page in the sitemap, plus every internal link found on those pages
- `/calendar.ics` and each event's `/events/<id>/event.ics`
- `/robots.txt`
- two URLs that don't exist, which must return 404

Any page that doesn't return 200, or a calendar that isn't a calendar, fails the run. This is the main check that the site still works.

## Unit tests

### Calendar feed (`scripts/lib/ics.test.mts`)

A broken feed doesn't show up on any page, but it breaks the calendar of everyone subscribed to it.

| Test | Why |
|---|---|
| foldLine never splits a multi-byte character | Splitting one corrupts the file for some calendar apps |
| formatUtc rejects an unparseable date | Stops a broken feed being written |
| buildCalendar uses CRLF throughout | Required by the iCalendar spec; some apps reject the file otherwise |
| buildCalendar keys the entry on the Notion id | Renaming an event mustn't create a duplicate in people's calendars |
| a cancelled event stays in the feed | Removing it leaves the old entry in subscribers' calendars forever |

### Notion sync (`scripts/lib/notion.test.mts`)

These cover mistakes that wouldn't crash anything but would put wrong information on the live site.

| Test | Why |
|---|---|
| mapEvent converts a local time to UTC | Otherwise every event is an hour out during British Summer Time |
| an event publishes only when Publish is ticked and Hide is not | Unfinished events mustn't go live |
| a renamed column fails loudly | A renamed Notion column should stop the sync, not publish blanks |
| mapEvent refuses a row that should have been skipped | Second guard against publishing unready rows |
| a repeated name gives every clashing event a date | Two events with the same name would otherwise share a URL and one would disappear |

## Adding tests

Add a test when a bug could break a page, the calendar feed or the sync. Don't add tests for wording or layout.

Unit tests use Node's built-in runner (`node:test`). Put them next to the code as `*.test.mts`; `npm test` picks up anything matching `scripts/**/*.test.mts` or `src/**/*.test.mts`.
