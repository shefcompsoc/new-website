import Image from "next/image";
import Link from "next/link";
import { CommitteeGrid } from "@/components/committee-grid";
import { PageHeading } from "@/components/page-heading";
import { Supporters } from "@/components/supporters";
import { formatYear, pastCommittees } from "@/data/past-committees";

export const metadata = {
  title: "About",
  description:
    "Meet Sheffield CompSoc: the student-run computer science society at the University of Sheffield.",
};

export default function AboutPage() {
  return (
    <div className="site-width page-wrap">
      <PageHeading
        label="University of Sheffield"
        title="About CompSoc"
        description="We're the student-run Computer Science Society at the University of Sheffield. We organise workshops, hackathons, sports and socials."
      />
      <Image
        className="wide-photo"
        src="/photos/summer-ball-group.webp"
        alt="CompSoc members at the 2026 Summer Ball"
        width={1600}
        height={1067}
        priority
        sizes="(max-width: 760px) 100vw, 1160px"
      />
      <div className="editorial-split section-block">
        <h2>The main society in the Computer Science Department.</h2>
        <div>
          <p>
            We arrange activities including bar socials, quizzes, our annual hackathon, sports
            events, guest lectures from industry plus much more.
          </p>
        </div>
      </div>
      <div className="photo-pair">
        <figure>
          <Image
            src="/photos/hackathon-collaboration.webp"
            alt="A team collaborating around a laptop at a hackathon"
            width={1600}
            height={1067}
            sizes="(max-width: 760px) 100vw, 50vw"
          />
          <figcaption>Students working together at a hackathon.</figcaption>
        </figure>
        <figure>
          <Image
            src="/photos/summer-ball-band.webp"
            alt="Musicians performing at the Summer Ball"
            width={1600}
            height={1067}
            sizes="(max-width: 760px) 100vw, 50vw"
          />
          <figcaption>Live music at the Summer Ball.</figcaption>
        </figure>
      </div>
      <section className="section-block">
        <div className="section-title">
          <h2>Committee</h2>
          <span className="eyebrow">Your committee</span>
        </div>
        <CommitteeGrid />
        <Link href="/committee" className="text-link">
          Meet the committee
        </Link>
      </section>
      <Supporters />
      <section className="section-block" id="previous-committees">
        <div className="section-title">
          <h2>Previous committees</h2>
          <span className="eyebrow">Since 2016</span>
        </div>
        <ul className="year-list">
          {pastCommittees.map(({ year, members }) => {
            const president = members.find((member) => member.role === "President");
            return (
              <li key={year}>
                <Link href={`/committee/${year}`}>
                  <strong>{formatYear(year)}</strong>
                  <span>
                    {president ? `President: ${president.name}` : "Committee"} &middot; {members.length}{" "}
                    members
                  </span>
                </Link>
              </li>
            );
          })}
        </ul>
      </section>
    </div>
  );
}
