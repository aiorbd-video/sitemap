export async function onRequest(context) {
  const FIREBASE_URL =
    "https://ratul-liv-default-rtdb.asia-southeast1.firebasedatabase.app/matches.json";

  const MAIN_DOMAIN = "https://bd71.vercel.app";

  try {
    const res = await fetch(FIREBASE_URL);
    const data = await res.json();

    let urls = [];

    // Static pages
    const staticPages = ["", "/legal.html", "/terms-of-service.html", "/content-policy.html"];
    staticPages.forEach(p => urls.push(`${MAIN_DOMAIN}${p}`));

    // Dynamic pages
    Object.keys(data || {}).forEach(sport => {
      Object.keys(data[sport] || {}).forEach(id => {
        urls.push(`${MAIN_DOMAIN}/match/${sport}/${id}`);
      });
    });

    // Build XML
    const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="https://www.sitemaps.org/schemas/sitemap/0.9">
${urls
  .map(u => `<url><loc>${u}</loc><changefreq>hourly</changefreq><priority>0.9</priority></url>`)
  .join("\n")}
</urlset>`;

    return new Response(xml, {
      headers: { "Content-Type": "application/xml" }
    });
  } catch (err) {
    return new Response("Sitemap generation failed", { status: 500 });
  }
}
