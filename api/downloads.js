import { kv } from "@vercel/kv";

export default async function handler(req, res) {
  if (req.method === "GET") {
    const downloads = (await kv.get("downloads")) || [];
    return res.status(200).json({ downloads });
  }

  if (req.method === "POST") {
    const { password, downloads } = req.body || {};

    if (!password || password !== process.env.ADMIN_PASSWORD) {
      return res.status(401).json({ error: "Invalid password" });
    }

    if (!Array.isArray(downloads)) {
      return res.status(400).json({ error: "downloads must be an array" });
    }

    await kv.set("downloads", downloads);
    return res.status(200).json({ success: true });
  }

  res.setHeader("Allow", ["GET", "POST"]);
  return res.status(405).json({ error: `Method ${req.method} not allowed` });
}
