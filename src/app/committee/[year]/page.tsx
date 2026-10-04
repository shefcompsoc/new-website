import Link from "next/link";
import { notFound } from "next/navigation";
import { CommitteeGrid } from "@/components/committee-grid";
import { PageHeading } from "@/components/page-heading";
import { findPastCommittee, formatYear, pastCommittees } from "@/data/past-committees";

export const dynamicParams = false;

export function generateStaticParams() {
  return pastCommittees.map(({ year }) => ({ year }));
}

export async function generateMetadata({ params }: PageProps<"/committee/[year]">) {
  const { year } = await params;
  if (!findPastCommittee(year)) notFound();
  return {
    title: `${formatYear(year)} Committee`,
    description: `The Sheffield CompSoc committee for ${formatYear(year)}.`,
  };
}

export default async function PastCommitteePage({ params }: PageProps<"/committee/[year]">) {
  const { year } = await params;
  const committee = findPastCommittee(year);
  if (!committee) notFound();

  return (
    <div className="site-width page-wrap">
      <Link href="/about#previous-committees" className="text-link back-link">
        &#8592; Previous committees
      </Link>
      <PageHeading label="Previous committee" title={formatYear(year)} />
      <CommitteeGrid members={committee.members} />
    </div>
  );
}
