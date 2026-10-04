import type { MetadataRoute } from "next";
import { calendarOrigin } from "@/lib/calendar";
export default function robots(): MetadataRoute.Robots { return { rules: { userAgent: "*", allow: "/" }, sitemap: `${calendarOrigin}/sitemap.xml` }; }
