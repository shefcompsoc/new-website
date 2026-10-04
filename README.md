# Sheffield CompSoc website

The new site for [shefcompsoc.uk](https://shefcompsoc.uk). Built with Next.js, Tailwind and TypeScript, hosted on Vercel.

## Running it

```bash
npm install
npm run dev
```

Then open http://localhost:3000.

## Content

Events and sponsors are managed in Notion. To pull the latest:

```bash
npm run sync:content
```

This needs `NOTION_TOKEN` in `.env.local` (see `.env.example`). It updates the JSON in `src/data`, downloads images into `public`, and rebuilds `public/calendar.ics`. Commit the changes to publish them.

An event only shows up if it is a Tech or Social Event with Publish ticked and a start time. If an event gets cancelled, tick Cancelled instead of unticking Publish so it stays in people's calendars.

Committee, awards, FAQs and partner projects are edited directly in `src/data`.

## Other commands

```bash
npm test             # run tests
npm run lint         # lint
npm run build        # production build
npm run test:routes  # check every page loads, after a build
```

See [TESTING.md](TESTING.md) for what the tests cover.
