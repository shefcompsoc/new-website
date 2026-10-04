import { PageHeading } from "@/components/page-heading";
import { ExternalLink } from "@/components/external-link";
import { contact } from "@/data/contact";

export const metadata = {
  title: "Join CompSoc",
  description: "Join Sheffield CompSoc through the Students' Union and meet the community.",
};

export default function JoinPage() {
  return (
    <div className="site-width page-wrap">
      <PageHeading
        label="Join CompSoc"
        title="Make yourself at home."
        description="Meet people, build things and get involved in student life beyond your lectures."
      />
      <section className="calendar-banner">
        <div>
          <h2>Get your membership.</h2>
          <p>
            See the Students&apos; Union website for current membership options, prices and terms.
          </p>
        </div>
        <ExternalLink className="button button-primary" href={contact.membership}>
          Join through the SU
        </ExternalLink>
      </section>
      <section className="editorial-split section-block">
        <h2>Start with a hello.</h2>
        <div>
          <p>Find the community on Discord, ask a question, or come along to an upcoming event.</p>
          <ExternalLink className="text-link" href={contact.discord}>
            Join our Discord
          </ExternalLink>
        </div>
      </section>
    </div>
  );
}
