import Image from "next/image";
import type { Sponsor } from "@/types/content";
import { ExternalLink } from "./external-link";

export function SponsorWall({ records }: { records: Sponsor[] }) {
  return (
    <ul className="logo-wall">
      {records.map((record) => {
        const mark = record.imageUrl ? (
          <Image
            src={record.imageUrl}
            alt={record.name}
            width={320}
            height={160}
            sizes="(max-width: 760px) 45vw, 240px"
          />
        ) : (
          <span className="logo-wordmark">{record.name}</span>
        );
        return (
          <li className="logo-tile" key={record.id}>
            {record.link ? <ExternalLink href={record.link}>{mark}</ExternalLink> : mark}
          </li>
        );
      })}
    </ul>
  );
}
