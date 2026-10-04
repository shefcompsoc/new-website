import type { CommitteeMember } from "@/types/content";
import records from "./past-committees.json";

export interface PastCommittee {
  year: string;
  members: CommitteeMember[];
}

export const pastCommittees: PastCommittee[] = records.map((record) => ({
  year: record.year,
  members: record.members.map((member) => ({
    ...member,
    year: record.year,
    socials: member.socials as Record<string, string>,
  })),
}));

export function findPastCommittee(year: string) {
  return pastCommittees.find((committee) => committee.year === year);
}

export function formatYear(year: string) {
  return year.replace("-", "/");
}
