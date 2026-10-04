import type { Award } from "@/types/content";
import records from "./awards.generated.json";

const activityAwards = "/brand/activities-awards.png";

export const awards: Award[] = records.map((record) => ({
  id: record.id, name: record.Name, imageUrl: record.Img ?? activityAwards,
}));
