import { PageHeading } from "@/components/page-heading";
import { CommitteeGrid } from "@/components/committee-grid";

export const metadata = {
  title: "Committee",
  description: "Meet the students who run Sheffield CompSoc.",
};

export default function CommitteePage() {
  return (
    <div className="site-width page-wrap">
      <PageHeading
        label="Student-run"
        title="Committee"
        description="Meet the committee organising our events, supporting our members and keeping the society running."
      />
      <CommitteeGrid />
    </div>
  );
}
