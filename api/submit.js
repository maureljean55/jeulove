import { put } from "@vercel/blob";

export async function POST(request) {
  let data;
  try { data = await request.json(); } catch { return Response.json({ error: "JSON invalide" }, { status: 400 }); }
  if (!data || typeof data.answers !== "object") return Response.json({ error: "Réponses manquantes" }, { status: 400 });

  const entry = {
    pour: String(data.pour || "").slice(0, 60),
    answers: Object.fromEntries(
      Object.entries(data.answers).slice(0, 30).map(([k, v]) => [String(k).slice(0, 40), String(v).slice(0, 2000)])
    ),
    date: new Date().toISOString()
  };
  const id = `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
  await put(`reponses/${id}.json`, JSON.stringify(entry), {
    access: "private", contentType: "application/json", addRandomSuffix: false
  });
  return Response.json({ ok: true });
}
