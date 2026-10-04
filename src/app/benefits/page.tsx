import Link from "next/link";
import { PageHeading } from "@/components/page-heading";
import { venueDeals } from "@/data/benefits";

export const metadata = {
  title: "Your Benefits",
  description:
    "Explore the community, learning, project and career opportunities at Sheffield CompSoc.",
};

export default function BenefitsPage() {
  return (
    <div className="site-width page-wrap">
      <PageHeading
        label="Being part of CompSoc"
        title="Your Benefits"
        description="More ways to learn, meet people and make the most of your time at Sheffield."
      />
      <ul className="benefits-list">
        <li>
          <strong>Workshops and technical talks.</strong> Explore tools, learn practical skills and
          hear from guest speakers.
        </li>
        <li>
          <strong>Hackathons and collaborative projects.</strong> Put your ideas into practice and
          meet people to build with.
        </li>
        <li>
          <strong>Socials and nights out.</strong> Get to know other students outside your course
          and lectures.
        </li>
        <li>
          <strong>A student community.</strong> Connect with fellow members on Discord and at
          society events.
        </li>
        <li>
          <strong>Shared study and career resources.</strong> Find course notes and CV examples in
          our resource library.
        </li>
        <li>
          <strong>Industry connections.</strong> Meet partners and explore opportunities through
          technical events and partner projects.
        </li>
        <li>
          <strong>Ways to get involved.</strong> Contribute to society activities, share your skills
          and support other students.
        </li>
      </ul>
      <section className="section-block">
        <div className="section-title">
          <h2>Member discounts</h2>
          <span className="eyebrow">Bars and nights out</span>
        </div>
        <p className="muted">
          Deals the committee has negotiated for CompSoc members. Bring your membership, and check
          each venue for conditions.
        </p>
        <div className="deal-list">
          {venueDeals.map((deal) => (
            <details className="deal-item" id={deal.id} key={deal.id}>
              <summary>
                {deal.venue}: {deal.summary}
              </summary>
              {deal.condition && <p className="deal-condition">{deal.condition}</p>}
              <ul>
                {deal.deals.map((line) => (
                  <li key={line}>{line}</li>
                ))}
              </ul>
              {deal.footnote && <p>{deal.footnote}</p>}
            </details>
          ))}
        </div>
      </section>
      <p className="muted">
        Event availability, entry requirements and any member pricing are listed for each event.
        Current membership options and terms are available through the Students&apos; Union.
      </p>
      <div className="button-row">
        <Link href="/sign-up" className="button button-primary">
          Join CompSoc
        </Link>
        <Link href="/events" className="button button-secondary">
          Explore events
        </Link>
      </div>
    </div>
  );
}
