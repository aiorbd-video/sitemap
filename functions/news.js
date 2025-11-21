export async function onRequest(context) {
  const firebaseURL =
    "https://ratul-liv-default-rtdb.asia-southeast1.firebasedatabase.app/matches.json";

  const domain = "https://bd71.vercel.app";

  let rss = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0">
<channel>
  <title>BD71 Live Sports Updates</title>
  <link>${domain}</link>
  <description>Live match updates and streaming links</description>
`;

  const res = await fetch(firebaseURL);
  const data = await res.json();

  for (const sport of Object.keys(data)) {
    for (const id of Object.keys(data[sport])) {
      const m = data[sport][id];

      rss += `
<item>
  <title>${m.team1?.name} vs ${m.team2?.name} | ${m.title}</title>
  <link>${domain}/match/${sport}/${id}</link>
  <guid isPermaLink="true">${domain}/match/${sport}/${id}</guid>
  <description>Live streaming available for ${m.team1?.name} vs ${m.team2?.name}</description>
</item>`;
    }
  }

  rss += `</channel></rss>`;

  return new Response(rss, {
    headers: { "Content-Type": "application/rss+xml" },
  });
}
