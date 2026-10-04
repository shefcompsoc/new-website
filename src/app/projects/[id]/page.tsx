import Link from "next/link";
import { notFound } from "next/navigation";
import { partnerProjects } from "@/data/partner-projects";
import { excerpt } from "@/lib/excerpt";
import { ExternalLink } from "@/components/external-link";

export const dynamicParams = false;

export function generateStaticParams() {
  return partnerProjects.map(({ id }) => ({ id }));
}

export async function generateMetadata({ params }: PageProps<"/projects/[id]">) {
  const { id } = await params;
  const project = partnerProjects.find((project) => project.id === id);
  if (!project) notFound();
  return {
    title: project.name,
    description: excerpt(project.description) ?? `${project.name} with ${project.org}.`,
  };
}

export default async function ProjectPage({ params }: PageProps<"/projects/[id]">) {
  const { id } = await params;
  const project = partnerProjects.find((project) => project.id === id);
  if (!project) notFound();

  return (
    <article className="site-width page-wrap event-detail">
      <Link href="/projects" className="text-link back-link">
        &#8592; All partner projects
      </Link>
      <div className="detail-layout">
        <div>
          <span className="eyebrow">{project.org}</span>
          <h1>{project.name}</h1>
          {project.id === "sample-project" && (
            <p className="placeholder-note">
              Sample project with placeholder copy and founder contact details.
            </p>
          )}
          <div className="event-art detail-art tech" aria-hidden="true">
            <span className="art-grid" />
            <span className="event-glyph">&#123; &#125;</span>
            <span className="art-caption">SHEFFIELD COMPSOC / PARTNER PROJECT</span>
          </div>
          <section className="event-description">
            <h2>About the project</h2>
            {project.description?.split(/\n\s*\n/).map((paragraph, index) => (
              <p key={index}>{paragraph}</p>
            ))}
            {project.founderContact && (
              <p>
                For more information,{" "}
                <ExternalLink className="text-link" href={project.founderContact}>
                  contact the project founder
                </ExternalLink>
                {project.founderContact === "mailto:founder@example.com" &&
                  " (placeholder contact)"}
                .
              </p>
            )}
            {project.applicationUrl && (
              <p>
                Interested in joining?{" "}
                <ExternalLink className="text-link" href={project.applicationUrl}>
                  Apply for a position via Google Forms
                </ExternalLink>
              </p>
            )}
          </section>
        </div>
        <aside className="event-sidebar">
          <span className="eyebrow">Get involved</span>
          <dl>
            <dt>Partner organisation</dt>
            <dd>{project.org}</dd>
          </dl>
          {project.applicationUrl && (
            <ExternalLink className="button button-primary" href={project.applicationUrl}>
              Apply for a position
            </ExternalLink>
          )}
          {project.founderContact && (
            <ExternalLink className="text-link" href={project.founderContact}>
              Contact the founder
            </ExternalLink>
          )}
          {project.founderContact === "mailto:founder@example.com" && (
            <p className="muted">Founder contact is a placeholder.</p>
          )}
          {project.link && (
            <ExternalLink className="text-link" href={project.link}>
              Project website
            </ExternalLink>
          )}
        </aside>
      </div>
    </article>
  );
}
