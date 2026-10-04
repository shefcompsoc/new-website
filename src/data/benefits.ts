import type { VenueDeal } from "@/types/content";

export const venueDeals: VenueDeal[] = [
  {
    id: "mixr",
    venue: "Cavendish & MiXR venues",
    summary: "App Discounts",
    condition: "Applies anywhere that takes MiXR, including Slug and Lettuce.",
    deals: ["Special discounts with the CompSoc code on the MiXR app"],
  },
  {
    id: "mollys",
    venue: "Molly's",
    summary: "Free Shots",
    condition: "Barcrawl attendance required.",
    deals: ["Free shots at barcrawls"],
  },
  {
    id: "wsl",
    venue: "WSL",
    summary: "Discounted Drinks",
    deals: [
      "£2.50 triples (vodka, rum, fruity)",
      "£3 pints",
      "£5 round",
    ],
  },
  {
    id: "steinhaus",
    venue: "Steinhaus",
    summary: "Drinks Deals & Free Entry",
    deals: [
      "Free entry to selected events",
      "Double vodka mixer £3*",
      "Triple vodka mixer £4*",
      "Quad vodka mixer £5",
      "£6 Cherry Bakewell stein",
      "£6 steins (Stein on the Beach / Heisenberg)*",
      "£6 haus beer stein*",
      "£3 haus beer pints*",
      "£2 J-Bomb",
      "Bombs £3/4/5*",
      "£1 shots*",
      "Brunch every Saturday, 4-8pm, £20 for 90 minutes",
    ],
    footnote: "*Included in the £1 round deal on Wednesdays.",
  },
  {
    id: "corp",
    venue: "Corp",
    summary: "Cheap Entry & Free Trebles",
    condition: "Barcrawl attendance required.",
    deals: [
      "Free treble at pres (usually one per person)",
      "£2.50 entry before midnight, in a group of 10 or more. Excludes Halloween, Freshers, New Year's Eve, special events and special hire events.",
      "Entry into Corp's monthly society giveaways",
    ],
  },
];
