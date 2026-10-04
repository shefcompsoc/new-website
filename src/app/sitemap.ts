import type { MetadataRoute } from "next";
import { events } from "@/data/events";
import { partnerProjects } from "@/data/partner-projects";
import { calendarOrigin } from "@/lib/calendar";
export default function sitemap(): MetadataRoute.Sitemap {
  return [
    ...["", "/events", "/calendar", "/about", "/committee", "/sponsors", "/our-awards", "/photos", "/sign-up", "/benefits", "/social-media", "/projects", "/contact", "/constitution", "/faqs"].map((path) => ({ url: calendarOrigin + path })),
    ...events.map((event) => ({ url: `${calendarOrigin}/events/${event.id}`, lastModified: event.updatedAt })),
    ...partnerProjects.map((project) => ({ url: `${calendarOrigin}/projects/${project.id}` })),
  ];
}

