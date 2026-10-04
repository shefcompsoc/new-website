import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { events, findEvent } from "@/data/events";
import { dateLabel, timeLabel } from "@/lib/dates";
import { excerpt } from "@/lib/excerpt";
import { formatPrice } from "@/lib/price";
import { AddToCalendar } from "@/components/add-to-calendar";
import { ExternalLink } from "@/components/external-link";

export const dynamicParams = false;

export function generateStaticParams() {
  return events.map(({ id }) => ({ id }));
}

export async function generateMetadata({ params }: PageProps<"/events/[id]">) {
  const event = findEvent((await params).id);
  if (!event) notFound();
  const title = `${event.status === "cancelled" ? "Cancelled: " : ""}${event.name}`;
  const description = excerpt(event.description) ?? `${event.name} with Sheffield CompSoc.`;
  return {
    title,
    description,
    openGraph: {
      title,
      description,
      images: [{ url: event.images[0] ?? "/brand/cover.png", alt: event.name }],
    },
    twitter: {
      card: "summary_large_image" as const,
      title,
      description,
      images: [event.images[0] ?? "/brand/cover.png"],
    },
  };
}

export default async function EventPage({ params }: PageProps<"/events/[id]">) {
  const event = findEvent((await params).id);
  if (!event) notFound();
  const cancelled = event.status === "cancelled";
  const endsLater = event.endsAt && dateLabel(event.endsAt) !== dateLabel(event.startsAt);
  const endLabel = event.endsAt
    ? ` to ${endsLater ? `${dateLabel(event.endsAt)}, ` : ""}${timeLabel(event.endsAt)}`
    : "";
  return (
    <article className="site-width page-wrap event-detail">
      <Link href="/events" className="text-link back-link">
        &#8592; All events
      </Link>
      <div className="detail-layout">
        <div>
          <div className="meta-line">
            <span className="badge">{event.type}</span>
            {cancelled && <strong className="cancelled-label">Cancelled</strong>}
          </div>
          <h1>{event.name}</h1>
          {cancelled && (
            <p className="notice">
              This event has been cancelled. You can still download its updated calendar entry.
            </p>
          )}
          <div className={`event-art detail-art ${event.type}`}>
            {event.images[0] ? (
              <Image src={event.images[0]} alt={event.name} width={1000} height={650} priority />
            ) : (
              <>
                <span className="art-grid" />
                <span className="event-glyph glyph-word">
                  {event.type === "tech" ? "Tech" : "Social"}
                </span>
                <span className="art-caption">SHEFFIELD COMPSOC</span>
              </>
            )}
          </div>
          <section className="event-description">
            <h2>What&apos;s happening</h2>
            {event.description ? (
              event.description.split(/\n\s*\n/).map((paragraph, i) => <p key={i}>{paragraph}</p>)
            ) : (
              <p>More details will be added here when they are available.</p>
            )}
          </section>
          {event.images.slice(1).map((image, index) => (
            <Image
              className="gallery-image"
              key={image}
              src={image}
              alt={`${event.name}, image ${index + 2}`}
              width={1000}
              height={700}
            />
          ))}
        </div>
        <aside className="event-sidebar">
          <span className="eyebrow">The details</span>
          <dl>
            <dt>When</dt>
            <dd>
              <time dateTime={event.startsAt}>
                {dateLabel(event.startsAt, { weekday: "long", year: "numeric" })}
                <br />
                {timeLabel(event.startsAt)}
                {endLabel}
              </time>
              <small>UK local time</small>
            </dd>
            <dt>Where</dt>
            <dd>{event.location}</dd>
            <dt>Price</dt>
            <dd>{formatPrice(event.price)}</dd>
          </dl>
          {!cancelled && event.ticketLink && (
            <ExternalLink className="button button-primary" href={event.ticketLink}>
              Get tickets
            </ExternalLink>
          )}
          <AddToCalendar event={event} />
          <Link href="/calendar" className="text-link">
            Subscribe to all events
          </Link>
        </aside>
      </div>
    </article>
  );
}
