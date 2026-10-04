import { createHash } from "node:crypto";
import { mkdir, readdir, rename, unlink, writeFile } from "node:fs/promises";
import { queryAll, type NotionConfig } from "./notion.mts";

type SponsorPage = {
  id: string;
  properties: {
    Name?: { title?: { plain_text: string }[] };
    Publish?: { checkbox?: boolean };
    Hide?: { checkbox?: boolean };
    URL?: { url?: string | null };
    "Company Logo"?: { files?: { file?: { url: string }; external?: { url: string } }[] };
  };
};

export function mapSponsor(page: SponsorPage) {
  const properties = page.properties;
  if (!properties.Publish?.checkbox || properties.Hide?.checkbox) return null;
  const name = properties.Name?.title?.map((part) => part.plain_text).join("").trim();
  if (!name) throw new Error("Published sponsor is missing Name. Existing snapshot preserved.");
  const file = properties["Company Logo"]?.files?.[0];
  return {
    id: page.id,
    Name: name,
    URL: /^https?:\/\//i.test(properties.URL?.url || "") ? properties.URL!.url! : null,
    imageUrl: file?.file?.url || file?.external?.url || null,
  };
}

export async function syncSponsors(config: NotionConfig) {
  const databaseId = process.env.NOTION_SPONSORS_DB_ID || "3608a4ec-2ff0-803c-9f1d-c9474fd37cd4";
  const pages = await queryAll(config, databaseId, { property: "Publish", checkbox: { equals: true } });
  const sponsors = pages.map(mapSponsor).filter((record) => record !== null);
  const directory = new URL("../../public/sponsors/notion/", import.meta.url);
  await mkdir(directory, { recursive: true });
  const extensions: Record<string, string> = { "image/png": "png", "image/jpeg": "jpg", "image/webp": "webp", "image/svg+xml": "svg", "image/avif": "avif", "image/gif": "gif" };
  const keep = new Set<string>();
  const records = [];
  for (const sponsor of sponsors) {
    let image: string | null = null;
    if (sponsor.imageUrl) {
      const response = await fetch(sponsor.imageUrl, { signal: AbortSignal.timeout(30000) });
      if (!response.ok) throw new Error(`Logo download failed for ${sponsor.Name}: HTTP ${response.status}. Snapshot preserved.`);
      const extension = extensions[response.headers.get("content-type")?.split(";")[0] || ""];
      if (!extension) throw new Error(`Unsupported logo format for ${sponsor.Name}. Snapshot preserved.`);
      const bytes = Buffer.from(await response.arrayBuffer());
      const filename = `${createHash("sha256").update(bytes).digest("hex")}.${extension}`;
      await writeFile(new URL(filename, directory), bytes);
      keep.add(filename);
      image = `/sponsors/notion/${filename}`;
    }
    records.push({ id: sponsor.id, Name: sponsor.Name, Image: image, URL: sponsor.URL });
  }
  records.sort((a, b) => a.Name.localeCompare(b.Name));
  const target = new URL("../../src/data/sponsors.generated.json", import.meta.url);
  const temporary = new URL(`${target.href}.tmp`);
  await writeFile(temporary, JSON.stringify(records, null, 2) + "\n");
  await rename(temporary, target);
  for (const entry of await readdir(directory, { withFileTypes: true })) {
    if (entry.isFile() && /^[a-f0-9]{64}\.(png|jpg|webp|svg|avif|gif)$/.test(entry.name) && !keep.has(entry.name)) await unlink(new URL(entry.name, directory));
  }
  console.log(`Synced ${records.length} published sponsors with local logos.`);
}
