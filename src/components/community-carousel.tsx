"use client";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";

const photos = [
  ["summer-ball-group", "CompSoc together at the Summer Ball"],
  ["hackathon-collaboration", "Students collaborating at a hackathon"],
  ["summer-ball-band", "Live music at the Summer Ball"],
  ["hackathon-demo", "Sharing ideas at a hackathon"],
  ["summer-ball-dancing", "Celebrating on the dance floor"],
];

export function CommunityCarousel() {
  const [index, setIndex] = useState(0);
  const [paused, setPaused] = useState(false);
  const ref = useRef<HTMLElement>(null);
  useEffect(() => {
    const motion = matchMedia("(prefers-reduced-motion: reduce)");
    let visible = false;
    const observer = new IntersectionObserver(([entry]) => {
      visible = entry.isIntersecting;
    });
    if (ref.current) observer.observe(ref.current);
    const timer = setInterval(() => {
      if (visible && !paused && !motion.matches && !document.hidden)
        setIndex((value) => (value + 1) % photos.length);
    }, 4500);
    return () => {
      clearInterval(timer);
      observer.disconnect();
    };
  }, [paused]);
  return (
    <section
      ref={ref}
      className="community-carousel section-block"
      aria-label="Community photographs"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      onFocus={() => setPaused(true)}
      onBlur={(event) => {
        if (!event.currentTarget.contains(event.relatedTarget)) setPaused(false);
      }}
    >
      <div className={`carousel-window desktop-photo-carousel${paused ? " is-paused" : ""}`}>
        <div className="carousel-track">
          {[0, 1].map((copy) => (
            <div className="carousel-group" key={copy} aria-hidden={copy === 1 ? true : undefined}>
              {photos.map(([src, alt]) => (
                <Image
                  key={src}
                  src={`/photos/${src}.webp`}
                  alt={copy === 1 ? "" : alt}
                  width={540}
                  height={360}
                  sizes="360px"
                />
              ))}
            </div>
          ))}
        </div>
      </div>
      <div className="single-photo-stage">
        {photos.map(([src, alt], i) => (
          <Image
            key={src}
            src={`/photos/${src}.webp`}
            alt={alt}
            width={1600}
            height={1067}
            sizes="(max-width: 760px) 100vw, 1160px"
            hidden={i !== index}
          />
        ))}
      </div>
      <div className="carousel-footer site-width">
        <Link href="/photos" className="text-link">
          View all photos
        </Link>
        <div className="carousel-dots" aria-label="Choose photo">
          {photos.map(([, alt], i) => (
            <button
              key={alt}
              aria-label={`Show photo ${i + 1}: ${alt}`}
              aria-pressed={i === index}
              onClick={() => setIndex(i)}
            >
              <span />
            </button>
          ))}
        </div>
      </div>
    </section>
  );
}
