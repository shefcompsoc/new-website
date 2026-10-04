export type ResourceType = "cv" | "notes";

export type EventType = "social" | "tech";

export type EventStatus = "published" | "cancelled";

export interface Event {
  id: string;
  uid: string;
  name: string;
  type: EventType;
  status: EventStatus;
  location: string;
  description: string | null;
  startsAt: string;
  endsAt: string | null;
  images: string[];
  price: number;
  ticketLink: string | null;
  updatedAt: string;
}

export interface CommitteeMember {
  id: string;
  name: string;
  role: string;
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
  url: string;
  owner: string;
  type: ResourceType;
  year: string;
  dateOfUpload: string;
  lastUpdated: string;
}

export interface VenueDeal {
  id: string;
  venue: string;
  summary: string;
  condition?: string;
  deals: string[];
  footnote?: string;
}

export interface PartnerProject {
  id: string;
  name: string;
  org: string;
  description: string | null;
  link: string | null;
}
