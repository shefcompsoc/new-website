import Link from "next/link";
import { PageHeading } from "@/components/page-heading";
import { SponsorWall } from "@/components/sponsor-wall";
import { sponsors } from "@/data/sponsors";

export const metadata = {
  title: "Sponsors",
  description: "The partners supporting Sheffield CompSoc and how to get involved.",
};

export default function SponsorsPage() {
  return (
    <div className="site-width page-wrap">
      <PageHeading label="Partners" title="Our partners." />
      <SponsorWall records={sponsors} />
      <section className="calendar-banner">
        <div>
          <h2>Become a partner.</h2>
          <p>Talk to the committee about supporting the society.</p>
        </div>
        <Link href="/contact" className="button button-primary">
          Get in touch
        </Link>
      </section>
    </div>
  );
}
