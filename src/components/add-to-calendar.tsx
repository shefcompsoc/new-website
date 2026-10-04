import type { Event } from "@/types/content";
import { googleEventUrl } from "@/lib/calendar";
import { ExternalLink } from "./external-link";

export function AddToCalendar({ event }: { event: Event }) {
  return (
    <details className="calendar-control">
      <summary className="button button-secondary">
        Add to calendar <span aria-hidden="true">+</span>
      </summary>
      <div className="calendar-options">
        {event.status === "cancelled" && (
          <p>This event is cancelled. Download the updated calendar entry.</p>
        )}
        <ExternalLink href={googleEventUrl(event)}>Google Calendar</ExternalLink>
        <a href={`/events/${event.id}/event.ics`} download>
          Download .ics <span aria-hidden="true">&#8595;</span>
        </a>
      </div>
    </details>
  );
}
