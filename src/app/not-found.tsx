import Link from "next/link";

export const metadata = {
  title: "Page not found",
  description: "This page could not be found. Find your way back to Sheffield CompSoc.",
};

export default function NotFound() {
  return (
    <section className="not-found site-width">
      <span className="eyebrow">Error 404 / Page not found</span>
      <div className="error-code" aria-hidden="true">
        404<span>_</span>
      </div>
      <h1>Page not found</h1>
      <p>Check the address, or use the links below to return to the site.</p>
      <div className="button-row">
        <Link className="button button-primary" href="/events">
          Explore events
        </Link>
        <Link className="button button-secondary" href="/">
          Back to home
        </Link>
      </div>
    </section>
  );
}
