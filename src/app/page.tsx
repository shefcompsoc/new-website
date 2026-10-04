import Image from "next/image";
import Link from "next/link";
import { upcomingEvents } from "@/data/events";
import { contact } from "@/data/contact";
import { dateLabel, timeLabel } from "@/lib/dates";
import { formatPrice } from "@/lib/price";
import { KevinHero } from "@/components/kevin-hero";
import { EventCard, EmptyEvents } from "@/components/event-card";
import { Supporters } from "@/components/supporters";
import { CommunityCarousel } from "@/components/community-carousel";
import { MembershipBanner } from "@/components/membership-banner";
import { ExternalLink } from "@/components/external-link";

export const revalidate = 3600;
export const metadata = {
  title: "Sheffield CompSoc",
  description:
    "Sheffield CompSoc is the University of Sheffield's student-run Computer Science Society. Find workshops, hackathons and socials.",
};

export default function HomePage() {
  const upcoming = upcomingEvents();
  const next = upcoming[0];
  return (
    <>
      <section className="home-hero">
        <div className="hero-grid site-width">
          <div className="hero-copy">
            <p className="eyebrow">
              <span className="status-dot" /> University of Sheffield / CompSoc
            </p>
            <h1>
              <span>Computer Science</span> <br /> Society
            </h1>
            <p className="hero-description">Workshops. Hackathons. Night outs.</p>
            <div className="button-row hero-actions">
              <ExternalLink href={contact.membership} className="button button-primary">
                Buy membership
              </ExternalLink>
              <Link href="/events" className="button button-secondary">
                See what&apos;s on
              </Link>
            </div>
            <div className="hero-awards" aria-label="Activity Awards">
              {[2024, 2026].map((year) => (
                <Link href="/our-awards" className="hero-award" key={year}>
                  <span className="eyebrow">Activity Awards</span>
                  <strong>{year}</strong>
                  <span>
                    Best Academic Society
                    <br />
                    of the Year
                  </span>
                </Link>
              ))}
            </div>
          </div>
          <div className="hero-visual">
            <div className="orbit orbit-one" aria-hidden="true" />
            <div className="orbit orbit-two" aria-hidden="true" />
            <KevinHero />
            <span className="kevin-label eyebrow" aria-hidden="true">
              Hello, I&apos;m Kevin.
            </span>
            <div className="glass-panel next-event">
              <div className="glass-content">
                <div className="meta-line">
                  <span className="eyebrow">Next on the calendar</span>
                  {next && <span className="badge">{formatPrice(next.price)}</span>}
                </div>
                {next ? (
                  <>
                    <h2>
                      <Link href={`/events/${next.id}`}>{next.name}</Link>
                    </h2>
                    {next.status === "cancelled" && (
                      <strong className="cancelled-label">Cancelled</strong>
                    )}
                    <p className="next-when">
                      <time dateTime={next.startsAt}>
                        {dateLabel(next.startsAt, { weekday: "short" })}{" "}
                        <span aria-hidden="true">/</span> {timeLabel(next.startsAt)}
                      </time>
                    </p>
                    <p className="next-location">{next.location}</p>
                    <Link className="next-link" href={`/events/${next.id}`}>
                      Details &amp; how to join
                    </Link>
                  </>
                ) : (
                  <>
                    <h2>Something good is on its way.</h2>
                    <p>New dates will land here when they are announced.</p>
                    <Link className="next-link" href="/calendar">
                      Subscribe for new events
                    </Link>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>
      <CommunityCarousel />
      <div className="site-width">
        <MembershipBanner />
        <Supporters sponsorsOnly />
        <section className="section-block">
          <div className="section-title">
            <div>
              <h2>Our events</h2>
            </div>
            <Link href="/events" className="text-link">
              All events
            </Link>
          </div>
          {upcoming.length ? (
            <div className="event-grid">
              {upcoming.slice(0, 3).map((event) => (
                <EventCard key={event.id} event={event} />
              ))}
            </div>
          ) : (
            <EmptyEvents />
          )}
        </section>
        <section className="community-section section-block">
          <div className="community-photo">
            <Image
              src="/photos/summer-ball-group.webp"
              alt="CompSoc members gathered outside the venue at the 2026 Summer Ball"
              width={1600}
              height={1067}
              sizes="(max-width: 760px) 100vw, 60vw"
            />
            <span className="photo-caption">CompSoc / Summer Ball 2026</span>
          </div>
          <div className="community-copy">
            <p className="eyebrow">More than your course</p>
            <h2>
              Find your
              <br />
              kind of people.
            </h2>
            <Link href="/about" className="text-link">
              Get to know us
            </Link>
          </div>
        </section>
        <section className="calendar-banner home-calendar-banner">
          <div>
            <p className="eyebrow">Subscribe to our events calendar</p>
            <h2>
              Add our calendar.
              <br />
              Come to our events.
            </h2>
            <p>
              Subscribe to the CompSoc calendar to see upcoming events in your own calendar, with
              new dates and changes added automatically.
            </p>
          </div>
          <div className="calendar-actions">
            <Link className="button button-primary" href="/calendar">
              Add our calendar
            </Link>
            <Link className="button button-secondary" href="/benefits">
              Your Benefits
            </Link>
          </div>
        </section>
      </div>
    </>
  );
}
