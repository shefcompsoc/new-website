import Link from "next/link";
import { faqs } from "@/data/faqs";
import { PageHeading } from "@/components/page-heading";

export const metadata = {
  title: "FAQs",
  description:
    "Questions about joining Sheffield CompSoc, attending events and subscribing to the calendar.",
};

export default function FaqsPage() {
  return (
    <div className="site-width page-wrap">
      <PageHeading
        label="Before you ask"
        title="A few useful answers."
        description="New here? Start here. And if your question isn't covered, talk to us."
      />
      <div className="document-layout">
        <nav aria-label="FAQ topics" className="document-toc">
          <span className="eyebrow">Jump to a question</span>
          {faqs.map((faq) => (
            <a href={`#${faq.id}`} key={faq.id}>
              {faq.question}
            </a>
          ))}
        </nav>
        <div className="document-body">
          {faqs.map((faq) => (
            <details className="faq-item" id={faq.id} key={faq.id}>
              <summary>{faq.question}</summary>
              <p>{faq.answer}</p>
            </details>
          ))}
          <p className="section-block">
            Something else on your mind? <Link href="/contact">Contact the committee.</Link>
          </p>
        </div>
      </div>
    </div>
  );
}
