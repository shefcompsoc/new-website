import type { Sponsor } from "@/types/content";
import records from "./sponsors.generated.json";

const additionalPartners: Sponsor[] = [
  { id: "school-of-computer-science", name: "School of Computer Science", imageUrl: "/sponsors/school-of-computer-science.png", link: null },
  { id: "emerge", name: "Emerge", imageUrl: "/sponsors/emerge.png", link: null },
  { id: "bcs", name: "BCS, The Chartered Institute for IT", imageUrl: "/sponsors/bcs.png", link: null },
];
export const sponsors: Sponsor[] = [
  ...records.map((record) => ({ id: record.id, name: record.Name, imageUrl: record.Image, link: record.URL })),
  ...additionalPartners.filter((partner) => !records.some((record) => record.Name.toLowerCase() === partner.name.toLowerCase())),
];
