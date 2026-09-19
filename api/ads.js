import { kv } from "@vercel/kv";

export default async function handler(req, res) {
  if (req.method === "GET") {
    const ads = (await kv.get("ads")) || [];
    return res.status(200).json({ ads });
  }

  if (req.method === "POST") {
    const { password, ads } = req.body || {};

    if (!password || password !== process.env.ADMIN_PASSWORD) {
      return res.status(401).json({ error: "Invalid password" });
    }

    if (!Array.isArray(ads)) {
      return res.status(400).json({ error: "ads must be an array" });
    }

    await kv.set("ads", ads);
    return res.status(200).json({ success: true });
  }

  res.setHeader("Allow", ["GET", "POST"]);
  return res.status(405).json({ error: `Method ${req.method} not allowed` });
}
