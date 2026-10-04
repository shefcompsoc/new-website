import type { CommitteeMember } from "@/types/content";
import records from "./committee.generated.json";

export const committee: CommitteeMember[] = records.map((record): CommitteeMember => ({
  id: record.id, name: record.Name, role: record.Role, imageUrl: record.Photo,
  year: "", socials: record["Social Media Link"] ? { Profile: record["Social Media Link"] } : {},
}));
