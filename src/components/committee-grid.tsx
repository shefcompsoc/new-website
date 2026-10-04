import Image from "next/image";
import type { CommitteeMember } from "@/types/content";
import { committee } from "@/data/committee";
import { ExternalLink } from "./external-link";

export function CommitteeGrid({ members = committee }: { members?: CommitteeMember[] }) {
  return (
    <div className="committee-grid">
      {members.map((member) => (
        <article className="committee-card" key={member.id}>
          <div className="committee-portrait">
            {member.imageUrl ? (
              <Image
                src={member.imageUrl}
                alt={member.name}
                width={500}
                height={500}
                sizes="(max-width: 760px) 50vw, 280px"
              />
            ) : (
              <span aria-hidden="true">
                {member.name
                  .split(" ")
                  .map((word) => word[0])
                  .join("")}
              </span>
            )}
          </div>
          <span className="eyebrow">{member.role}</span>
          <h3>{member.name}</h3>
          <div className="committee-links">
            {Object.entries(member.socials)
              .filter(([, url]) => /^https?:\/\//i.test(url))
              .map(([label, url]) => (
                <ExternalLink href={url} key={label} className="text-link">
                  {label}
                </ExternalLink>
              ))}
          </div>
        </article>
      ))}
    </div>
  );
}
