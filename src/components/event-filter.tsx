"use client";
import { useState, type ReactNode } from "react";

type Item = { id: string; type: "tech" | "social"; card: ReactNode };

export function EventFilter({
  upcoming,
  emptyUpcoming,
}: {
  upcoming: Item[];
  emptyUpcoming: ReactNode;
}) {
  const [filter, setFilter] = useState("all");
  const next = upcoming.filter((item) => filter === "all" || item.type === filter);
  return (
    <>
      <div className="filter-bar" role="group" aria-label="Filter events">
        {["all", "tech", "social"].map((value) => (
          <button key={value} aria-pressed={filter === value} onClick={() => setFilter(value)}>
            {value === "all" ? "All events" : value === "tech" ? "Tech" : "Social"}
          </button>
        ))}
      </div>
      <p className="sr-only" role="status">
        {next.length} upcoming events shown.
      </p>
      <section className="section-block">
        <div className="section-title">
          <h2>Coming up</h2>
          <span className="eyebrow">{next.length} events</span>
        </div>
        {next.length ? (
          <div className="event-grid">
            {next.map((item) => (
              <div key={item.id}>{item.card}</div>
            ))}
          </div>
        ) : (
          emptyUpcoming
        )}
      </section>
    </>
  );
}
