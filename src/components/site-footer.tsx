import Link from "next/link";
import { Brand } from "./brand";

export function SiteFooter() {
  return (
    <footer className="site-footer">
      <div className="site-width footer-top">
        <div>
          <Brand />
          <p className="footer-description">
            The University of Sheffield
            <br />
            Computer Science Society.
          </p>
        </div>
        <nav aria-label="Society" className="footer-links">
          <span className="eyebrow">Get involved</span>
          <Link href="/sign-up">Join CompSoc</Link>
          <Link href="/events">Our events</Link>
          <Link href="/calendar">Subscribe to calendar</Link>
          <Link href="/contact">Contact us</Link>
        </nav>
        <nav aria-label="Information" className="footer-links">
          <span className="eyebrow">Good to know</span>
          <Link href="/about">About CompSoc</Link>
          <Link href="/committee">Committee</Link>
          <Link href="/faqs">FAQs</Link>
        </nav>
      </div>
      <div className="site-width footer-bottom">
        <span>Student-run. Sheffield-based.</span>
        <span className="footer-signoff">See you at the next one.</span>
      </div>
    </footer>
  );
}
