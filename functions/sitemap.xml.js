export const onRequest = async () => {
  const firebaseURL =
    "https://ratul-liv-default-rtdb.asia-southeast1.firebasedatabase.app/matches.json";

  const domain = "https://bd71.vercel.app";

  // escape XML unsafe characters
  const esc = (str = "") =>
    String(str)
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&apos;");

  let urls = [];

  try {
    const res = await fetch(firebaseURL);
    const data = await res.json();

    // No data = empty sitemap
    if (!data || typeof data !== "object") {
      throw new Error("Invalid Firebase JSON");
    }

    Object.keys(data).forEach((sport) => {
      const group = data[sport] || {};

      Object.keys(group).forEach((id) => {
        const match = group[id];
        if (!match) return;

        const loc = `${domain}/match/${sport}/${id}`;
        const lastmod = match.startTime || new Date().toISOString();

        urls.push(`
  <url>
    <loc>${esc(loc)}</loc>
    <lastmod>${esc(lastmod)}</lastmod>
    <changefreq>hourly</changefreq>
    <priority>0.9</priority>
  </url>`);
      });
    });
  } catch (err) {
    console.error("Sitemap Error:", err);
  }

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls.join("\n")}
</urlset>`;

  return new Response(xml, {
    headers: {
      "Content-Type": "application/xml; charset=UTF-8",
      "Cache-Control": "public, max-age=3600", // refresh every 1 hour
    },
  });
};
