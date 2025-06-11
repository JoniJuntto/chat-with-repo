import type { NextRequest } from "next/server";

export function GET(request: NextRequest) {
  const baseUrl = request.nextUrl.origin;
  const body = `User-agent: *\nAllow: /\nSitemap: ${baseUrl}/sitemap.xml`;
  return new Response(body, { headers: { "Content-Type": "text/plain" } });
}
