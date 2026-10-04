import records from "./photos.generated.json";
export const photoAlbums = records.map((record) => ({
  id: record.id, name: record.Name,
  cover: record.Cover, driveUrl: record["Drive Link"],
}));
