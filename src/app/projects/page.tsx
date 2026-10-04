import Image from "next/image";
import Link from "next/link";
import { PageHeading } from "@/components/page-heading";
import { ExternalLink } from "@/components/external-link";
import { contact } from "@/data/contact";

export const metadata = {
  title: "Partner projects",
  description:
    "Work with Sheffield CompSoc on student projects, technical workshops and industry collaboration.",
};

export default function ProjectsPage() {
  return (
    <div className="site-width page-wrap">
      <PageHeading
        label="For partners & companies"
        title="Bring a challenge. Meet the people."
        description="Connect with students who enjoy making things. Talk to us about a practical project, a technical session or a problem worth exploring."
      />
      <Image
        className="wide-photo"
        src="/photos/hackathon-demo.webp"
        alt="Students demonstrating their work to visitors at a hackathon"
        width={1600}
        height={1067}
        sizes="(max-width: 760px) 100vw, 1160px"
      />
      <div className="editorial-split section-block">
        <h2>
          Good partnerships
          <br />
          start with a conversation.
        </h2>
        <div>
          <p>
            Tell us what you have in mind, what students would work on, and what support your team
            can offer. We can discuss a format that fits the society and the academic calendar.
          </p>
          <p>
            Technical mentoring, a workshop, or a collaborative project: the useful part is giving
            students a real problem and someone to learn from.
          </p>
          <Link href="/contact" className="button button-primary">
            Talk to the committee
          </Link>
        </div>
      </div>
      <section className="section-block">
        <div className="section-title">
          <h2>Partner projects</h2>
          <span className="eyebrow">Working together</span>
        </div>
        <p>
          Keep an eye on{" "}
          <ExternalLink className="text-link" href={contact.instagram}>
            Instagram
          </ExternalLink>
          . Projects will be introduced soon!
        </p>
      </section>
    </div>
  );
}
