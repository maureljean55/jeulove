import { list, get } from "@vercel/blob";

export async function GET(request) {
  const pass = request.headers.get("x-password");
  if (!process.env.ADMIN_PASSWORD || pass !== process.env.ADMIN_PASSWORD) {
    return Response.json({ error: "Mot de passe incorrect" }, { status: 401 });
  }
  const { blobs } = await list({ prefix: "reponses/", limit: 1000 });
  const entries = await Promise.all(blobs.map(async b => {
    const r = await get(b.pathname, { access: "private", useCache: false });
    if (!r || r.statusCode !== 200) return null;
    return JSON.parse(await new Response(r.stream).text());
  }));
  entries.sort((a, b) => (b?.date || "").localeCompare(a?.date || ""));
  return Response.json({ entries: entries.filter(Boolean) }, { headers: { "cache-control": "no-store" } });
}
