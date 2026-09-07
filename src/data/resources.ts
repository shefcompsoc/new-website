import type { Resource } from "@/types/content";

/**
 * Files live in the committee Drive folder, not in this repo.
 * Upload the file, set sharing to "anyone with the link", then add an entry.
 */
export const resources: Resource[] = [
  {
    id: "com1001-notes",
    title: "COM1001 Lecture Notes",
    url: "https://drive.google.com/file/d/placeholder/view",
    owner: "Placeholder Name",
    type: "notes",
    year: "COM1001",
    dateOfUpload: "2026-01-12",
    lastUpdated: "2026-01-12",
  },
  {
    id: "example-cv",
    title: "Example CV - Software Engineering Placement",
    url: "https://drive.google.com/file/d/placeholder/view",
    owner: "Placeholder Name",
    type: "cv",
    year: "2025",
    dateOfUpload: "2026-02-03",
    lastUpdated: "2026-02-03",
  },
];
