import { PageHeading } from "@/components/page-heading";
import { RecognitionGrid } from "@/components/recognition-grid";
import { awards } from "@/data/awards";

export const metadata = {
  title: "Awards",
  description: "Sheffield CompSoc won Best Academic Society of the Year at the Activity Awards in 2024 and 2026.",
};

export default function AwardsPage() {
  return (
    <div className="site-width page-wrap">
      <PageHeading
        label="Recognition"
        title="Awards"
        description="Best Academic Society of the Year at the Activity Awards in 2024 and 2026."
      />
      <RecognitionGrid records={awards} kind="Award" />
    </div>
  );
}
