import Image from "next/image";

import { feedUrl, webcalUrl } from "@/lib/calendar";
import { PageHeading } from "@/components/page-heading";
import { CopyFeed } from "@/components/copy-feed";
import { MembershipBanner } from "@/components/membership-banner";
import { ExternalLink } from "@/components/external-link";

export const metadata = {
  title: "Calendar",
  description:
    "Subscribe to the Sheffield CompSoc calendar. Every workshop and social, updated automatically.",
};

export default function CalendarPage() {
  const googleUrl = `https://calendar.google.com/calendar/render?cid=${encodeURIComponent(
    webcalUrl,
  )}`;

  return (
    <div className="site-width page-wrap">
      <PageHeading
        label="One calendar. Every event."
        title="Keep us in your calendar."
        description="The next workshop. The next social. All in one place."
      />
      <section className="subscription-stage">
        <div className="calendar-decoration" aria-hidden="true">
          <span>COMPSOC</span>
          <Image src="/brand/kevin-transparent.png" alt="" width={96} height={96} />
          <span>YOU&apos;RE INVITED</span>
        </div>
        <div className="glass-panel subscription-panel">
          <div className="glass-content">
            <span className="eyebrow">Set it once</span>
            <h2>Your plans, kept up to date.</h2>
            <p>
              Subscribing adds a self-updating CompSoc calendar. It leaves your existing events
              alone, and you can remove it any time.
            </p>
            <div className="button-row">
              <a className="button button-primary" href={webcalUrl}>
                Subscribe to calendar <span aria-hidden="true">+</span>
              </a>
              <ExternalLink className="button button-secondary" href={googleUrl}>
                Add to Google Calendar
              </ExternalLink>
            </div>
            <CopyFeed url={feedUrl} />
          </div>
        </div>
      </section>
      <MembershipBanner />
    </div>
  );
}
