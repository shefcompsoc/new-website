import { PageHeading } from "@/components/page-heading";
import { SocialRow } from "@/components/social-row";
import { ExternalLink } from "@/components/external-link";
import { contact } from "@/data/contact";

export const metadata = {
  title: "Contact",
  description:
    "Contact the Sheffield CompSoc committee, find our Discord, or talk to us about a partnership.",
};

export default function ContactPage() {
  return (
    <div className="site-width page-wrap">
      <PageHeading
        label="Say hello"
        title="Let's talk."
        description="A question, an idea, or something you want to build with us. Here's where to find us."
      />
      <div className="contact-layout">
        <section className="contact-main">
          <p className="eyebrow">Straight to the committee</p>
          <h2>Our inbox is open.</h2>
          <a className="email-link" href={`mailto:${contact.email}`}>
            {contact.email}
            <span className="link-arrow" aria-hidden="true">
              &#8599;
            </span>
            <span className="sr-only"> (opens your email app)</span>
          </a>
          <p>
            For event questions, accessibility needs, sponsorship or a project proposal, send us an
            email.
          </p>
          <p className="muted">
            We&apos;re a student committee. We&apos;ll get back to you when we can.
          </p>
        </section>
        <section className="social-links">
          <h2>Social media</h2>
          <SocialRow />
        </section>
      </div>
      <section className="calendar-banner">
        <div>
          <p className="eyebrow">Make it official</p>
          <h2>Join Sheffield CompSoc.</h2>
          <p>Membership options and current prices are on the Students&apos; Union website.</p>
        </div>
        <ExternalLink href={contact.membership} className="button button-primary">
          View membership
        </ExternalLink>
      </section>
    </div>
  );
}
