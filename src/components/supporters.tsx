import Image from "next/image";
import Link from "next/link";
import { sponsors } from "@/data/sponsors";
import { awards } from "@/data/awards";
import { ExternalLink } from "./external-link";

export function Supporters({ sponsorsOnly = false }: { sponsorsOnly?: boolean }) {
  return (
    <section className="supporters section-block">
      <div className="section-title">
        <h2>{sponsorsOnly ? "Our Sponsors" : "Sponsors & Partners"}</h2>
        {!sponsorsOnly && <span className="eyebrow">Partners &amp; recognition</span>}
      </div>
      <div className="supporter-grid">
        {sponsors.map((sponsor) => (
          <div className="supporter" key={sponsor.id}>
            {sponsor.imageUrl ? (
              sponsor.link ? (
                <ExternalLink href={sponsor.link}>
                  <Image src={sponsor.imageUrl} alt={sponsor.name} width={220} height={128} />
                </ExternalLink>
              ) : (
                <Image src={sponsor.imageUrl} alt={sponsor.name} width={220} height={128} />
              )
            ) : sponsor.link ? (
              <ExternalLink href={sponsor.link}>{sponsor.name}</ExternalLink>
            ) : (
              <span>{sponsor.name}</span>
            )}
          </div>
        ))}
        {!sponsorsOnly &&
          awards.map((award) => (
            <div key={award.id} className="supporter award">
              {award.imageUrl && <Image src={award.imageUrl} alt="" width={80} height={80} />}
              <span>
                <small>Recognition</small>
                {award.name}
              </span>
            </div>
          ))}
      </div>
      <div className="button-row supporter-links">
        <Link href="/sponsors" className="text-link">
          Our sponsors
        </Link>
        {!sponsorsOnly && (
          <Link href="/our-awards" className="text-link">
            Our awards
          </Link>
        )}
      </div>
    </section>
  );
}
