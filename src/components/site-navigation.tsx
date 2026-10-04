"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useRef, useState } from "react";

const links = [
  ["/events", "Events"],
  ["/about", "About"],
  ["/photos", "Photos"],
  ["/projects", "Projects"],
  ["/contact", "Contact"],
  ["/calendar", "Calendar"],
] as const;

export function SiteNavigation() {
  const pathname = usePathname();
  const [openPath, setOpenPath] = useState<string | null>(null);
  const toggle = useRef<HTMLButtonElement>(null);
  const aboutToggle = useRef<HTMLButtonElement>(null);
  const [aboutOpen, setAboutOpen] = useState(false);
  const open = openPath === pathname;
  return (
    <div
      className="navigation"
      onKeyDown={(event) => {
        if (event.key === "Escape" && aboutOpen) {
          event.stopPropagation();
          setAboutOpen(false);
          aboutToggle.current?.focus();
          return;
        }
        if (event.key === "Escape" && open) {
          setOpenPath(null);
          toggle.current?.focus();
        }
      }}
      onBlur={(event) => {
        if (!event.currentTarget.contains(event.relatedTarget)) {
          setOpenPath(null);
          setAboutOpen(false);
        }
      }}
    >
      <button
        ref={toggle}
        type="button"
        className="menu-toggle"
        aria-expanded={open}
        aria-controls="primary-navigation"
        onClick={() => setOpenPath(open ? null : pathname)}
      >
        {open ? "Close" : "Menu"}
        <span aria-hidden="true">{open ? "-" : "+"}</span>
      </button>
      <nav
        id="primary-navigation"
        aria-label="Main"
        className={`nav-links${open ? " is-open" : ""}`}
      >
        {links.map(([href, label]) =>
          href === "/about" ? (
            <div
              className="about-navigation"
              key={href}
              onPointerEnter={(event) => {
                if (event.pointerType === "mouse") setAboutOpen(true);
              }}
              onPointerLeave={(event) => {
                if (event.pointerType === "mouse") setAboutOpen(false);
              }}
              onBlur={(event) => {
                if (!event.currentTarget.contains(event.relatedTarget)) setAboutOpen(false);
              }}
            >
              <button
                ref={aboutToggle}
                className="about-toggle"
                aria-expanded={aboutOpen}
                aria-controls="about-submenu"
                onClick={() => setAboutOpen(!aboutOpen)}
                onKeyDown={(event) => {
                  if (event.key === "ArrowDown") {
                    event.preventDefault();
                    setAboutOpen(true);
                    requestAnimationFrame(() =>
                      document.querySelector<HTMLAnchorElement>("#about-submenu a")?.focus(),
                    );
                  }
                }}
              >
                About
                <svg aria-hidden="true" width="12" height="12" viewBox="0 0 12 12">
                  <path d="m3 4.5 3 3 3-3" fill="none" stroke="currentColor" strokeWidth="1.5" />
                </svg>
              </button>
              <div id="about-submenu" className="about-submenu" hidden={!aboutOpen}>
                {[
                  ["/about", "About CompSoc"],
                  ["/our-awards", "Our Awards"],
                  ["/sponsors", "Our Partners"],
                  ["/constitution", "Our Constitution"],
                ].map(([url, text]) => (
                  <Link
                    href={url}
                    key={url}
                    aria-current={pathname === url ? "page" : undefined}
                    onClick={() => {
                      setAboutOpen(false);
                      setOpenPath(null);
                    }}
                  >
                    {text}
                  </Link>
                ))}
              </div>
            </div>
          ) : (
            <Link
              key={href}
              href={href}
              aria-current={
                pathname === href || pathname.startsWith(`${href}/`) ? "page" : undefined
              }
              onClick={() => setOpenPath(null)}
            >
              {label}
            </Link>
          ),
        )}
      </nav>
    </div>
  );
}
