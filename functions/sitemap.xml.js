export const onRequest = async () => {
  const firebaseURL =
    "https://ratul-liv-default-rtdb.asia-southeast1.firebasedatabase.app/matches.json";

  let xml = "";

  try {
    const res = await fetch(firebaseURL);
    const data = await res.json();

    const domain = "https://bd71.vercel.app";

    let urls = [];

    Object.keys(data || {}).forEach((sport) => {
      const group = data[sport] || {};
      Object.keys(group).forEach((id) => {
        urls.push(
          `<url>
            <loc>${domain}/match/${sport}/${id}</loc>
            <changefreq>hourly</changefreq>
            <priority>0.9</priority>
          </url>`
        );
      });
    });

    xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="https://www.sitemaps.org/schemas/sitemap/0.9">
${urls.join("\n")}
</urlset>`;
  } catch (e) {
    xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="https://www.sitemaps.org/schemas/sitemap/0.9"></urlset>`;
  }

  return new Response(xml, {
    headers: {
      "Content-Type": "application/xml",
    },
  });
};
