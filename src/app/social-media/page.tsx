import { PageHeading } from "@/components/page-heading";
import { ExternalLink } from "@/components/external-link";
import { contact } from "@/data/contact";

export const metadata = {
  title: "Social media",
  description: "Find Sheffield CompSoc on Discord, Instagram and LinkedIn.",
};

export default function SocialMediaPage() {
  return (
    <div className="site-width page-wrap">
      <PageHeading
        label="Stay connected"
        title="See you online."
        description="Find the community, follow our events and keep up with what's happening."
      />
      <section className="social-links">
        {[
          ["Discord", contact.discord, "Chat with the community"],
          ["Instagram", contact.instagram, "Photos and society updates"],
          ["LinkedIn", contact.linkedin, "Projects, careers and partnerships"],
        ].map(([name, url, copy]) => (
          <ExternalLink href={url} key={name}>
            <span>
              <strong>{name}</strong>
              <small>{copy}</small>
            </span>
          </ExternalLink>
        ))}
      </section>
    </div>
  );
}
