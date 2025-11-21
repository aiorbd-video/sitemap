export async function onRequest(context) {
  const { sport, id } = context.params;

  const FIREBASE_URL =
    "https://ratul-liv-default-rtdb.asia-southeast1.firebasedatabase.app/matches.json";

  const MAIN_DOMAIN = "https://bd71.vercel.app";

  const res = await fetch(FIREBASE_URL);
  const data = await res.json();

  const match = data?.[sport]?.[id];

  if (!match) {
    return new Response("<h2 style='color:white'>Match Not Found</h2>", {
      headers: { "Content-Type": "text/html" }
    });
  }

  const title = `${match.team1?.name} vs ${match.team2?.name} | ${match.title}`;
  const url = `${MAIN_DOMAIN}/match/${sport}/${id}`;
  const description = `Watch ${match.team1?.name} vs ${match.team2?.name} live. ${match.title}. Multiple servers, HD, DRM supported.`;
  const ogImage = match.team1?.logo || match.team2?.logo || `${MAIN_DOMAIN}/thumbnail.png`;

  const html = `
<!DOCTYPE html>
<html lang="en">
<head>
<title>${title}</title>
<meta name="description" content="${description}">
<link rel="canonical" href="${url}">

<meta property="og:title" content="${title}">
<meta property="og:description" content="${description}">
<meta property="og:image" content="${ogImage}">
<meta property="og:url" content="${url}">
<meta property="og:type" content="video.other">

<meta name="twitter:card" content="summary_large_image">
<meta name="twitter:title" content="${title}">
<meta name="twitter:description" content="${description}">
<meta name="twitter:image" content="${ogImage}">

<script type="application/ld+json">
{
  "@context": "https://schema.org",
  "@type": "SportsEvent",
  "name": "${title}",
  "startDate": "${match.startTime}",
  "endDate": "${match.endTime}",
  "description": "${description}",
  "url": "${url}",
  "homeTeam": {
      "@type": "SportsTeam",
      "name": "${match.team1?.name}",
      "logo": "${match.team1?.logo}"
  },
  "awayTeam": {
      "@type": "SportsTeam",
      "name": "${match.team2?.name}",
      "logo": "${match.team2?.logo}"
  }
}
</script>

<style>
body { background:#020202; color:white; font-family:Arial; padding:20px; }
iframe { width:100%; height:360px; border:0; border-radius:12px; margin-top:20px; }
</style>
</head>

<body>
<h2>${match.team1?.name} vs ${match.team2?.name}</h2>
<p>${match.title}</p>

<iframe src="${MAIN_DOMAIN}/?autoplay=1&match=${sport}:${id}"></iframe>

</body>
</html>
`;

  return new Response(html, {
    headers: { "Content-Type": "text/html" }
  });
}
