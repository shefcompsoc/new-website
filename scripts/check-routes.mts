import { spawn } from "node:child_process";
import path from "node:path";

const port = 3100;
const base = `http://localhost:${port}`;
const next = path.resolve(import.meta.dirname, "../node_modules/next/dist/bin/next");
const server = spawn(process.execPath, [next, "start", "-p", String(port)], { stdio: "ignore" });

const failures: string[] = [];
const fail = (message: string) => failures.push(message);

async function waitForServer() {
  for (let i = 0; i < 60; i++) {
    try {
      await fetch(base);
      return;
    } catch {
      await new Promise((resolve) => setTimeout(resolve, 1000));
    }
  }
  throw new Error("server did not start");
}

async function crawl(start: string[]) {
  const seen = new Set(start);
  const queue = [...start];
  while (queue.length > 0) {
    const route = queue.shift()!;
    const res = await fetch(base + route);
    if (res.status !== 200) {
      fail(`${route} returned ${res.status}`);
      continue;
    }
    if (!res.headers.get("content-type")?.includes("text/html")) continue;
    const html = await res.text();
    for (const [, href] of html.matchAll(/href="(\/(?!\/|_next)[^"#?]*)/g)) {
      if (/\.(png|jpe?g|webp|svg|ico|css|js|woff2?)$/.test(href) || seen.has(href)) continue;
      seen.add(href);
      queue.push(href);
    }
  }
  return seen;
}

try {
  await waitForServer();

  const sitemap = await (await fetch(`${base}/sitemap.xml`)).text();
  const routes = [...sitemap.matchAll(/<loc>(.*?)<\/loc>/g)].map(([, url]) => new URL(url).pathname);
  if (routes.length === 0) fail("sitemap is empty");

  const eventIcs = routes.filter((route) => /^\/events\/[^/]+$/.test(route)).map((route) => `${route}/event.ics`);
  const checked = await crawl([...routes, ...eventIcs, "/robots.txt"]);

  for (const route of ["/calendar.ics", ...eventIcs]) {
    const body = await (await fetch(base + route)).text();
    if (!body.startsWith("BEGIN:VCALENDAR")) fail(`${route} is not a calendar`);
  }

  for (const route of ["/events/this-event-does-not-exist", "/no-such-page"]) {
    const res = await fetch(base + route);
    if (res.status !== 404) fail(`${route} returned ${res.status}, expected 404`);
  }

  console.log(`Checked ${checked.size} routes`);
} catch (error) {
  fail(String(error));
} finally {
  server.kill();
}

if (failures.length > 0) {
  console.error(failures.map((message) => `  ${message}`).join("\n"));
  process.exit(1);
}
