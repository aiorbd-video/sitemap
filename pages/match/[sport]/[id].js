export const onRequest = async ({ params, request }) => {
  const { sport, id } = params;

  const firebaseURL =
    "https://ratul-liv-default-rtdb.asia-southeast1.firebasedatabase.app/matches.json";

  let match = null;
  let domain = (request.headers.get("host") || "").startsWith("localhost")
    ? "http://localhost:8788"
    : `https://${request.headers.get("host")}`;

  try {
    const res = await fetch(firebaseURL);
    const data = await res.json();
    match = data?.[sport]?.[id] || null;
  } catch (e) {
    match = null;
  }

  if (!match) {
    return new Response(
      `
      <html><body style="font-family:Arial;padding:40px;color:#eee;background:#111">
      <h2>Match Not Found</h2>
      <p>The match you are looking for doesn't exist or was removed.</p>
      </body></html>
      `,
      { headers: { "Content-Type": "text/html; charset=UTF-8" } }
    );
  }

  const title = `${match.team1?.name} vs ${match.team2?.name} | ${match.title}`;
  const description = `Watch ${match.team1?.name} vs ${match.team2?.name}. ${match.title}. Multiple servers, DRM streaming, HD quality and no lag.`;
  const url = `${domain}/match/${sport}/${id}`;
  const ogImg = match.team1?.logo || match.team2?.logo || `${domain}/thumbnail.png`;

  // JSON-LD
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "SportsEvent",
    name: title,
    startDate: match.startTime,
    endDate: match.endTime,
    description,
    url,
    homeTeam: {
      "@type": "SportsTeam",
      name: match.team1?.name,
      logo: match.team1?.logo,
    },
    awayTeam: {
      "@type": "SportsTeam",
      name: match.team2?.name,
      logo: match.team2?.logo,
    },
  };

  const html = `
<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8" />
<title>${title}</title>
<meta name="description" content="${description}" />

<link rel="canonical" href="${url}" />

<!-- OG Tags -->
<meta property="og:title" content="${title}" />
<meta property="og:description" content="${description}" />
<meta property="og:image" content="${ogImg}" />
<meta property="og:url" content="${url}" />
<meta property="og:type" content="video.other" />

<!-- Twitter -->
<meta name="twitter:card" content="summary_large_image" />
<meta name="twitter:title" content="${title}" />
<meta name="twitter:description" content="${description}" />
<meta name="twitter:image" content="${ogImg}" />

<!-- JSON-LD -->
<script type="application/ld+json">
${JSON.stringify(jsonLd)}
</script>

<style>
body { background:#0b0f15; color:#e6edf3; font-family:Arial; padding:20px; }
.card { max-width:650px; margin:auto; background:#111826; padding:20px; border-radius:12px; }
.logo { width:80px; height:80px; border-radius:50%; object-fit:cover; }
.center { text-align:center; }
.frame { width:100%; height:350px; border:none; margin-top:16px; border-radius:12px; }
</style>

</head>

<body>
<div class="card">
  <h2 class="center">${match.team1?.name} vs ${match.team2?.name}</h2>
  <p class="center">${match.title}</p>

  <div class="center">
    <img src="${match.team1?.logo}" class="logo" /> 
    <img src="${match.team2?.logo}" class="logo" />
  </div>

  <!-- Load your main player -->
  <iframe class="frame" src="${domain}/?autoplay=1&match=${sport}:${id}"></iframe>
</div>
</body>
</html>
`;

  return new Response(html, {
    headers: {
      "Content-Type": "text/html; charset=UTF-8",
    },
  });
};
