import Head from "next/head";

export async function getServerSideProps({ params }) {
  const { sport, id } = params;

  const firebaseURL =
    "https://ratul-liv-default-rtdb.asia-southeast1.firebasedatabase.app/matches.json";

  const res = await fetch(firebaseURL);
  const data = await res.json();
  const match = data?.[sport]?.[id] || null;

  return {
    props: {
      sport,
      id,
      match,
      domain: "https://bd71.vercel.app",
    },
  };
}

export default function Page({ match, sport, id, domain }) {
  if (!match) return <h2>Match Not Found</h2>;

  const title = `${match.team1?.name} vs ${match.team2?.name} | ${match.title}`;
  const desc = `Watch ${match.team1?.name} vs ${match.team2?.name} live stream. ${match.title}. Multi-server HD streaming.`;

  const url = `${domain}/match/${sport}/${id}`;
  const image = match.team1?.logo || match.team2?.logo;

  return (
    <>
      <Head>
        <title>{title}</title>
        <meta name="description" content={desc} />
        <link rel="canonical" href={url} />

        {/* OG */}
        <meta property="og:title" content={title} />
        <meta property="og:description" content={desc} />
        <meta property="og:image" content={image} />
        <meta property="og:url" content={url} />
        <meta property="og:type" content="video.other" />

        {/* Twitter */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={title} />
        <meta name="twitter:description" content={desc} />
        <meta name="twitter:image" content={image} />

        {/* Schema */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "SportsEvent",
              name: title,
              startDate: match.startTime,
              endDate: match.endTime,
              homeTeam: { "@type": "SportsTeam", name: match.team1?.name },
              awayTeam: { "@type": "SportsTeam", name: match.team2?.name },
              image,
              url,
            }),
          }}
        />
      </Head>

      <h2>{match.team1.name} vs {match.team2.name}</h2>
      <p>{match.title}</p>

      <iframe
        src={`${domain}/?match=${sport}:${id}&autoplay=1`}
        style={{ width: "100%", height: "380px", border: "0" }}
      />
    </>
  );
}
