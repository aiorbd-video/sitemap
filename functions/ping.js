export async function onRequest() {
  const sitemap = "https://sitemap-cvs.pages.dev/sitemap";

  await fetch(`https://www.google.com/ping?sitemap=${sitemap}`);
  await fetch(`https://www.bing.com/ping?sitemap=${sitemap}`);

  return new Response("Pings sent");
}
