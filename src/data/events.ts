import type { Event } from "@/types/content";

import generated from "./events.generated.json";

export const events: Event[] = generated as Event[];

export function upcomingEvents(now: Date = new Date()): Event[] {
  return events.filter((event) => new Date(event.endsAt ?? event.startsAt) >= now);
}

export function pastEvents(now: Date = new Date()): Event[] {
  return events
    .filter((event) => new Date(event.endsAt ?? event.startsAt) < now)
    .reverse();
}

export function findEvent(id: string): Event | undefined {
  return events.find((event) => event.id === id);
}
