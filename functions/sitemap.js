export async function onRequest(context) {
  const firebaseURL =
    "https://ratul-liv-default-rtdb.asia-southeast1.firebasedatabase.app/matches.json";

  const domain = "https://bd71.vercel.app";

  let xml = `<?xml version="1.0" encoding="UTF-8"?> 
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
        xmlns:image="http://www.google.com/schemas/sitemap-image/1.1">`;

  try {
    const res = await fetch(firebaseURL);
    const data = await res.json();

    for (const sport of Object.keys(data)) {
      for (const key of Object.keys(data[sport])) {
        const m = data[sport][key];
        if (!m) continue;

        const link = `${domain}/match/${sport}/${key}`;
        const img = m.team1?.logo || m.team2?.logo || "";

        xml += `
<url>
  <loc>${link}</loc>
  <changefreq>hourly</changefreq>
  <priority>0.90</priority>
  <image:image>
    <image:loc>${img}</image:loc>
  </image:image>
</url>`;
      }
    }

    xml += "</urlset>";

    return new Response(xml, {
      headers: { "Content-Type": "application/xml" },
    });
  } catch (e) {
    return new Response("Error generating sitemap", { status: 500 });
  }
}
