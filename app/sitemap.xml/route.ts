import type { NextRequest } from "next/server";

const routes = [
  "",
  "/login",
  "/dashboard",
  "/pricing",
  "/privacy",
  "/terms",
  "/chat",
];

export function GET(request: NextRequest) {
  const baseUrl = request.nextUrl.origin;
  const urls = routes
    .map((route) => `<url><loc>${baseUrl}${route}</loc></url>`) 
    .join("");
  const sitemap = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">${urls}</urlset>`;
  return new Response(sitemap, {
    headers: { "Content-Type": "application/xml" },
  });
}
