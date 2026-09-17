import { kv } from "@vercel/kv";

export default async function handler(req, res) {
  if (req.method === "GET") {
    const items = (await kv.get("merch")) || [];
    return res.status(200).json({ items });
  }

  if (req.method === "POST") {
    const { password, items } = req.body || {};

    if (!password || password !== process.env.ADMIN_PASSWORD) {
      return res.status(401).json({ error: "Invalid password" });
    }

    if (!Array.isArray(items)) {
      return res.status(400).json({ error: "items must be an array" });
    }

    await kv.set("merch", items);
    return res.status(200).json({ success: true });
  }

  res.setHeader("Allow", ["GET", "POST"]);
  return res.status(405).json({ error: `Method ${req.method} not allowed` });
}
