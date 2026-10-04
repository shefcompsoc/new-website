import sections from "@/data/constitution.json";
import { PageHeading } from "@/components/page-heading";

export const metadata = {
  title: "Constitution",
  description:
    "The published constitution of the University of Sheffield Students' Computer Science Society, dated 1 November 2021.",
};

export default function ConstitutionPage() {
  return (
    <div className="site-width page-wrap">
      <PageHeading
        label="How the society works"
        title="Our constitution."
        description="The aims, responsibilities and rules that guide Sheffield CompSoc."
      />
      <div className="document-layout">
        <nav className="document-toc" aria-label="Constitution sections">
          <span className="eyebrow">On this page</span>
          {sections.map((section, i) => (
            <a href={`#${section.id}`} key={section.id}>
              {i + 1}. {section.title}
            </a>
          ))}
        </nav>
        <div className="document-body">
          {sections.map((section, i) => (
            <section id={section.id} key={section.id}>
              <h2>
                {i + 1}. {section.title}
              </h2>
              <div dangerouslySetInnerHTML={{ __html: section.html }} />
            </section>
          ))}
        </div>
      </div>
    </div>
  );
}
