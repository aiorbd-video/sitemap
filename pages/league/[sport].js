export const onRequest = async ({ params, request }) => {
  const { sport } = params;

  const firebaseURL =
    "https://ratul-liv-default-rtdb.asia-southeast1.firebasedatabase.app/matches.json";

  let matches = [];
  let domain = (request.headers.get("host") || "").startsWith("localhost")
    ? "http://localhost:8788"
    : `https://${request.headers.get("host")}`;

  try {
    const res = await fetch(firebaseURL);
    const data = await res.json();
    matches = Object.keys(data?.[sport] || {}).map((id) => ({
      id,
      ...data[sport][id],
    }));
  } catch (e) {
    matches = [];
  }

  const leagueName =
    sport === "cricket"
      ? "Cricket Live & Upcoming Matches"
      : sport === "football"
      ? "Football Live & Upcoming Matches"
      : `${sport} Matches`;

  const description = `Watch all ${leagueName} with HD streaming, multiple servers, auto-quality and DRM supported video playback.`;

  const url = `${domain}/league/${sport}`;

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    name: leagueName,
    description,
    url,
  };

  const html = `
<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<title>${leagueName}</title>
<meta name="description" content="${description}">
<link rel="canonical" href="${url}">

<!-- OG Tags -->
<meta property="og:title" content="${leagueName}" />
<meta property="og:description" content="${description}" />
<meta property="og:url" content="${url}" />
<meta property="og:type" content="website" />

<!-- Twitter -->
<meta name="twitter:card" content="summary_large_image" />
<meta name="twitter:title" content="${leagueName}" />
<meta name="twitter:description" content="${description}" />

<!-- JSON-LD -->
<script type="application/ld+json">
${JSON.stringify(jsonLd)}
</script>

<style>
body { background:#0b0f15; color:#e6edf3; font-family:Arial; margin:0; padding:20px; }
h1 { text-align:center; }
.card {
  background:#111826; padding:16px;
  margin:12px auto; border-radius:12px;
  max-width:700px;
  border:1px solid rgba(0,255,120,0.15);
  cursor:pointer;
}
.card:hover { background:#151d2c; }
.logo { width:60px; height:60px; object-fit:cover; border-radius:50%; }
.row { display:flex; align-items:center; justify-content:space-between; }
.title { font-size:18px; font-weight:600; }
.status { font-size:13px; opacity:0.8; padding-top:4px; }
</style>
</head>

<body>
<h1>${leagueName}</h1>

${matches
  .map((m) => {
    return `
<div class="card" onclick="location.href='${domain}/match/${sport}/${m.id}'">
  <div class="row">
    <img src="${m.team1?.logo}" class="logo">
    <div style="text-align:center;flex:1">
      <div class="title">${m.team1?.name} vs ${m.team2?.name}</div>
      <div class="status">${m.title}</div>
    </div>
    <img src="${m.team2?.logo}" class="logo">
  </div>
</div>`;
  })
  .join("")}

</body>
</html>
`;

  return new Response(html, {
    headers: { "Content-Type": "text/html; charset=UTF-8" },
  });
};
