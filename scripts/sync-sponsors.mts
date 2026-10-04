import { readConfig } from "./lib/notion.mts";
import { syncSponsors } from "./lib/sponsors.mts";

syncSponsors(readConfig()).catch((error: unknown) => {
  console.error(error instanceof Error ? error.message : error);
  process.exitCode = 1;
});
