import type { Event } from "@/types/content";

export const events: Event[] = [
  {
    id: "intro-to-git",
    name: "Intro to Git",
    type: "workshop",
    location: "Diamond, Computer Room 4",
    tagline: "Stop emailing yourself zip files.",
    description:
      "A hands-on session covering branching, merging and pull requests.",
    startsAt: "2026-10-08T18:00:00Z",
    endsAt: "2026-10-08T20:00:00Z",
    imageUrl: null,
    paid: 0,
    ticketLink: null,
    resourcesLink: "https://github.com/shefcompsoc",
  },
  {
    id: "autumn-social",
    name: "Autumn Social",
    type: "social",
    location: "Interval",
    tagline: "Meet the committee.",
    description: "Drinks, pool and introductions for the new cohort.",
    startsAt: "2026-10-15T19:00:00Z",
    endsAt: null,
    imageUrl: null,
    paid: 300,
    ticketLink: null,
    resourcesLink: null,
  },
];
