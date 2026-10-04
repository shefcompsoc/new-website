import Image from "next/image";
import { PageHeading } from "@/components/page-heading";
import { ExternalLink } from "@/components/external-link";
import { photoAlbums } from "@/data/photos";

export const metadata = {
  title: "Photos",
  description: "Photos from Sheffield CompSoc events, including the Summer Ball and hackathon.",
};

export default function PhotosPage() {
  return (
    <div className="site-width page-wrap">
      <PageHeading
        label="Life at CompSoc"
        title="Photos"
        description="Browse the full albums on Google Drive. Use your university account to access them."
      />
      <div className="event-grid project-grid">
        {photoAlbums.map((album) => (
          <article className="event-card" key={album.id}>
            <ExternalLink href={album.driveUrl} className="project-card-link">
              <div className="event-art">
                <Image
                  src={album.cover.src}
                  alt={album.cover.alt}
                  width={800}
                  height={533}
                  sizes="(max-width: 760px) 100vw, 33vw"
                />
              </div>
              <div className="event-card-body">
                <span className="eyebrow">Google Drive album</span>
                <h2>{album.name}</h2>
                <span className="text-link">Open in Google Drive</span>
              </div>
            </ExternalLink>
          </article>
        ))}
      </div>
    </div>
  );
}
