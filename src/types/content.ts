/** Shapes for site content. Entries live in `src/data`, files live in Drive. */

export type ResourceType = "cv" | "notes";

export type EventType = "workshop" | "talk" | "social" | "hackathon" | "other";

export interface Event {
  id: string;
  name: string;
  type: EventType;
  location: string;
  tagline: string | null;
  description: string | null;
  /** ISO 8601. */
  startsAt: string;
  endsAt: string | null;
  imageUrl: string | null;
  /** Price in pence. 0 means free. */
  paid: number;
  ticketLink: string | null;
  /** Workshop repo, slides, etc. */
  resourcesLink: string | null;
}

export interface CommitteeMember {
  id: string;
  name: string;
  role: string;
  /** Academic year, e.g. "2025/26". */
  year: string;
  imageUrl: string | null;
  socials: Record<string, string>;
}

export interface Sponsor {
  id: string;
  name: string;
  imageUrl: string | null;
  link: string | null;
}

export interface Award {
  id: string;
  name: string;
  imageUrl: string | null;
}

export interface Resource {
  id: string;
  title: string;
  /** Shareable link to the file in the committee Drive folder. */
  url: string;
  /** Display name of whoever submitted it. Not a user reference. */
  owner: string;
  type: ResourceType;
  /** Module code for notes, graduation year for CVs. */
  year: string;
  /** YYYY-MM-DD. */
  dateOfUpload: string;
  lastUpdated: string;
}

export interface PartnerProject {
  id: string;
  name: string;
  /** The organisation the project is with. */
  org: string;
  description: string | null;
  link: string | null;
}
