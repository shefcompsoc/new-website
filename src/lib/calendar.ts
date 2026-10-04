import type { Event } from "@/types/content";
import { siteUrl } from "@/lib/env";
import { endOf, formatUtc } from "../../scripts/lib/ics.mts";

const origin = new URL(siteUrl);
export const calendarOrigin = ["localhost", "127.0.0.1"].includes(origin.hostname) ? "https://shefcompsoc.uk" : `https://${origin.host}`;
export const feedUrl = `${calendarOrigin}/calendar.ics`;
export const webcalUrl = feedUrl.replace("https:", "webcal:");
export function googleEventUrl(event: Event) {
  const cancelled = event.status === "cancelled";
  const query = new URLSearchParams({
    action: "TEMPLATE",
    text: `${cancelled ? "CANCELLED: " : ""}${event.name}`,
    dates: `${formatUtc(event.startsAt)}/${formatUtc(endOf(event))}`,
    details: [cancelled ? "This event has been cancelled." : "", event.description, `${calendarOrigin}/events/${event.id}`].filter(Boolean).join("\n\n"),
    location: event.location,
  });
  return `https://calendar.google.com/calendar/render?${query}`;
}
