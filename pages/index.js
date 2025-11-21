import Head from "next/head";
import { useEffect, useState } from "react";

export default function Home() {
  const [matches, setMatches] = useState({ cricket: [], football: [] });
  const [loading, setLoading] = useState(true);

  const firebaseURL =
    "https://ratul-liv-default-rtdb.asia-southeast1.firebasedatabase.app/matches.json";

  useEffect(() => {
    async function load() {
      try {
        const res = await fetch(firebaseURL);
        const data = await res.json();

        const out = { cricket: [], football: [] };

        Object.keys(data || {}).forEach((sport) => {
          const group = data[sport] || {};
          Object.keys(group).forEach((key) => {
            const m = group[key];
            if (!m) return;
            m.id = key;
            m.sport = sport;
            m.streams = (m.streams || []).filter(Boolean);
            out[sport].push(m);
          });
        });

        setMatches(out);
      } catch (e) {
        console.error("Match load error:", e);
      }
      setLoading(false);
    }

    load();
  }, []);

  function isLive(m) {
    const now = Date.now();
    const start = new Date(m.startTime).getTime();
    const end = new Date(m.endTime).getTime();
    return now >= start && now <= end;
  }

  function isEnded(m) {
    const now = Date.now();
    const end = new Date(m.endTime).getTime();
    return now > end;
  }

  function formatStatus(m) {
    if (isLive(m)) return "LIVE";
    if (isEnded(m)) return "ENDED";

    const start = new Date(m.startTime).getTime();
    const diff = start - Date.now();

    if (diff <= 0) return "LIVE SOON";

    const sec = Math.floor(diff / 1000);
    const h = Math.floor(sec / 3600);
    const m2 = Math.floor((sec % 3600) / 60);
    return `Starts in ${h}h ${m2}m`;
  }

  return (
    <>
      {/* SEO */}
      <Head>
        <title>BD71 Live Sports – Cricket & Football Streaming</title>
        <meta
          name="description"
          content="Watch Live Cricket, Football, T20, Test, FIFA, EPL and more. Multiple servers, fast streaming and HD quality."
        />
        <link rel="canonical" href="https://bd71.vercel.app/" />

        {/* OG */}
        <meta property="og:title" content="BD71 Live Sports" />
        <meta
          property="og:description"
          content="Watch Live Cricket and Football. Fast servers and HD quality."
        />
        <meta property="og:image" content="/logo.png" />
        <meta property="og:url" content="https://bd71.vercel.app/" />
        <meta property="og:type" content="website" />

        {/* Twitter */}
        <meta name="twitter:card" content="summary_large_image" />
      </Head>

      <div
        style={{
          padding: "20px",
          maxWidth: "900px",
          margin: "0 auto",
          color: "#e6edf3",
          fontFamily: "Arial, sans-serif",
        }}
      >
        <h1 style={{ textAlign: "center" }}>BD71 – Live Matches</h1>

        {loading && (
          <p style={{ textAlign: "center", marginTop: "20px" }}>
            Loading matches...
          </p>
        )}

        {!loading && (
          <>
            {/* Cricket */}
            <h2 style={{ marginTop: "25px" }}>Cricket</h2>
            {matches.cricket.length === 0 && <p>No cricket matches available.</p>}

            {matches.cricket.map((m) => (
              <a
                key={m.id}
                href={`/match/${m.sport}/${m.id}`}
                style={{
                  display: "block",
                  padding: "12px",
                  background: "#11181f",
                  borderRadius: "10px",
                  marginBottom: "12px",
                  textDecoration: "none",
                  color: "#fff",
                }}
              >
                <div style={{ display: "flex", justifyContent: "space-between" }}>
                  <div style={{ textAlign: "center" }}>
                    <img
                      src={m.team1?.logo}
                      width="45"
                      height="45"
                      style={{ borderRadius: "50%" }}
                      alt=""
                    />
                    <div>{m.team1?.name}</div>
                  </div>

                  <div style={{ textAlign: "center", paddingTop: "10px" }}>
                    <div
                      style={{
                        background: isLive(m)
                          ? "red"
                          : isEnded(m)
                          ? "#555"
                          : "#0d6efd",
                        padding: "4px 10px",
                        borderRadius: "20px",
                        fontSize: "12px",
                        color: "#fff",
                      }}
                    >
                      {formatStatus(m)}
                    </div>
                  </div>

                  <div style={{ textAlign: "center" }}>
                    <img
                      src={m.team2?.logo}
                      width="45"
                      height="45"
                      style={{ borderRadius: "50%" }}
                      alt=""
                    />
                    <div>{m.team2?.name}</div>
                  </div>
                </div>
                <p style={{ textAlign: "center", marginTop: "10px" }}>
                  {m.title}
                </p>
              </a>
            ))}

            {/* Football */}
            <h2 style={{ marginTop: "25px" }}>Football</h2>
            {matches.football.length === 0 && <p>No football matches available.</p>}

            {matches.football.map((m) => (
              <a
                key={m.id}
                href={`/match/${m.sport}/${m.id}`}
                style={{
                  display: "block",
                  padding: "12px",
                  background: "#11181f",
                  borderRadius: "10px",
                  marginBottom: "12px",
                  textDecoration: "none",
                  color: "#fff",
                }}
              >
                <div style={{ display: "flex", justifyContent: "space-between" }}>
                  <div style={{ textAlign: "center" }}>
                    <img
                      src={m.team1?.logo}
                      width="45"
                      height="45"
                      style={{ borderRadius: "50%" }}
                      alt=""
                    />
                    <div>{m.team1?.name}</div>
                  </div>

                  <div style={{ textAlign: "center", paddingTop: "10px" }}>
                    <div
                      style={{
                        background: isLive(m)
                          ? "red"
                          : isEnded(m)
                          ? "#555"
                          : "#0d6efd",
                        padding: "4px 10px",
                        borderRadius: "20px",
                        fontSize: "12px",
                        color: "#fff",
                      }}
                    >
                      {formatStatus(m)}
                    </div>
                  </div>

                  <div style={{ textAlign: "center" }}>
                    <img
                      src={m.team2?.logo}
                      width="45"
                      height="45"
                      style={{ borderRadius: "50%" }}
                      alt=""
                    />
                    <div>{m.team2?.name}</div>
                  </div>
                </div>
                <p style={{ textAlign: "center", marginTop: "10px" }}>
                  {m.title}
                </p>
              </a>
            ))}
          </>
        )}
      </div>
    </>
  );
}
