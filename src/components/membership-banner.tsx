import Link from "next/link";
import { contact } from "@/data/contact";
import { ExternalLink } from "./external-link";

export function MembershipBanner() {
  return (
    <section className="calendar-banner membership-banner">
      <div>
        <p className="eyebrow">Membership</p>
        <h2>Buy your membership.</h2>
        <p>
          Membership is handled by the Students&apos; Union, where you&apos;ll find current options,
          prices and terms.
        </p>
      </div>
      <div className="calendar-actions">
        <ExternalLink className="button button-primary" href={contact.membership}>
          Buy membership
        </ExternalLink>
        <Link className="button button-secondary" href="/benefits">
          Your benefits
        </Link>
      </div>
    </section>
  );
}
