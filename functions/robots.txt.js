export const onRequest = async ({ request }) => {
  // Auto-detect domain
  const host = request.headers.get("host") || "example.com";
  const protocol = host.includes("localhost") ? "http" : "https";
  const sitemapUrl = `${protocol}://${host}/sitemap.xml`;

  const robots = `
User-agent: *
Allow: /

Sitemap: ${sitemapUrl}
`;

  return new Response(robots.trim(), {
    headers: {
      "Content-Type": "text/plain; charset=UTF-8",
      "Cache-Control": "public, max-age=3600"
    }
  });
};
