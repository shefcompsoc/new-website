import Image from "next/image";
import Link from "next/link";
import type { Event } from "@/types/content";
import { dateLabel, timeLabel } from "@/lib/dates";
import { formatPrice } from "@/lib/price";
import { excerpt } from "@/lib/excerpt";
import { AddToCalendar } from "./add-to-calendar";

export function EventCard({ event, calendar = false }: { event: Event; calendar?: boolean }) {
  const cancelled = event.status === "cancelled";
  return (
    <article className={`event-card ${cancelled ? "is-cancelled" : ""}`}>
      <Link
        href={`/events/${event.id}`}
        className={`event-art ${event.type}`}
        tabIndex={-1}
        aria-hidden="true"
      >
        {event.images[0] ? (
          <Image src={event.images[0]} alt="" width={720} height={420} />
        ) : (
          <>
            <span className="art-grid" />
            <span className="event-glyph glyph-word">
              {event.type === "tech" ? "Tech" : "Social"}
            </span>
            <span className="art-caption">SHEFFIELD COMPSOC / {event.type.toUpperCase()}</span>
          </>
        )}
      </Link>
      <div className="event-card-body">
        <div className="meta-line">
          <span className="badge">{event.type === "tech" ? "Tech" : "Social"}</span>
          <span>{formatPrice(event.price)}</span>
          {cancelled && <strong className="cancelled-label">Cancelled</strong>}
        </div>
        <h3>
          <Link href={`/events/${event.id}`}>{event.name}</Link>
        </h3>
        <p className="event-date">
          <time dateTime={event.startsAt}>
            {dateLabel(event.startsAt, { weekday: "short" })} / {timeLabel(event.startsAt)}
          </time>
        </p>
        <p className="event-location">{event.location}</p>
        <p className="event-excerpt">{excerpt(event.description)}</p>
        {calendar ? (
          <AddToCalendar event={event} />
        ) : (
          <Link href={`/events/${event.id}`} className="text-link">
            Event details
          </Link>
        )}
      </div>
    </article>
  );
}

export function EmptyEvents({ past = false }: { past?: boolean }) {
  return (
    <div className="empty-state">
      <span className="eyebrow">{past ? "The archive" : "A little breathing room"}</span>
      <h3>{past ? "No past events here yet." : "The next one is in the works."}</h3>
      <p>
        {past
          ? "Finished events will appear here."
          : "New dates will appear here when the committee publishes them. Subscribe to the calendar to keep up."}
      </p>
      {!past && (
        <Link className="text-link" href="/calendar">
          Get the calendar
        </Link>
      )}
    </div>
  );
}
