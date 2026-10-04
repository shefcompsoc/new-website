import { contact } from "@/data/contact";
import { ExternalLink } from "./external-link";
import { marks } from "./social-marks";

const channels = [
  { name: "Discord", url: contact.discord },
  { name: "Instagram", url: contact.instagram },
  { name: "Facebook", url: contact.facebook },
  { name: "LinkedIn", url: contact.linkedin },
  { name: "Students' Union", url: contact.membership, initials: "SU" },
] as const;

export function SocialRow() {
  return (
    <ul className="social-row">
      {channels.map((channel) => (
        <li key={channel.name}>
          <ExternalLink href={channel.url} aria-label={channel.name} title={channel.name}>
            {"initials" in channel ? (
              <span className="social-initials" aria-hidden="true">
                {channel.initials}
              </span>
            ) : (
              <svg viewBox="0 0 24 24" width="24" height="24" aria-hidden="true" focusable="false">
                <path fill="currentColor" d={marks[channel.name]} />
              </svg>
            )}
          </ExternalLink>
        </li>
      ))}
    </ul>
  );
}
