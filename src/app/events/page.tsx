import { upcomingEvents } from "@/data/events";
import { EventCard, EmptyEvents } from "@/components/event-card";
import { EventFilter } from "@/components/event-filter";
import { PageHeading } from "@/components/page-heading";
import { MembershipBanner } from "@/components/membership-banner";

export const revalidate = 3600;
export const metadata = {
  title: "Events",
  description:
    "Workshops, talks and socials with Sheffield CompSoc. Find dates, places, prices and event details.",
};

export default function EventsPage() {
  const items = upcomingEvents().map((event) => ({
    id: event.id,
    type: event.type,
    card: <EventCard event={event} />,
  }));
  return (
    <div className="site-width page-wrap">
      <PageHeading
        label="Away from the keyboard. Sometimes."
        title="Our Events"
        description="Build something. Learn something. Meet your people. Find your next CompSoc event."
      />
      <EventFilter upcoming={items} emptyUpcoming={<EmptyEvents />} />
      <MembershipBanner />
    </div>
  );
}
