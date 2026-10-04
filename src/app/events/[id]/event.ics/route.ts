import { findEvent } from "@/data/events";
import { calendarOrigin } from "@/lib/calendar";
import { buildCalendar } from "../../../../../scripts/lib/ics.mts";
export async function GET(_request: Request, { params }: RouteContext<"/events/[id]/event.ics">) {
  const event = findEvent((await params).id);
  if (!event) return new Response("Event not found", { status: 404 });
  return new Response(buildCalendar([event], calendarOrigin, new Date(event.updatedAt)), {
    headers: { "Content-Type": "text/calendar; charset=utf-8", "Content-Disposition": `attachment; filename="${event.id}.ics"`, "Cache-Control": "public, max-age=3600" },
  });
}
