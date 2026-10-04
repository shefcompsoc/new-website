import type { PartnerProject } from "@/types/content";

type ProjectListing = PartnerProject & {
  founderContact?: string;
  applicationUrl?: string;
};

export const partnerProjects: ProjectListing[] = [];
