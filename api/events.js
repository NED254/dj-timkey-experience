import { kv } from "@vercel/kv";

export default async function handler(req, res) {
  if (req.method === "GET") {
    const events = (await kv.get("events")) || [];
    return res.status(200).json({ events });
  }

  if (req.method === "POST") {
    const { password, events } = req.body || {};

    if (!password || password !== process.env.ADMIN_PASSWORD) {
      return res.status(401).json({ error: "Invalid password" });
    }

    if (!Array.isArray(events)) {
      return res.status(400).json({ error: "events must be an array" });
    }

    await kv.set("events", events);
    return res.status(200).json({ success: true });
  }

  res.setHeader("Allow", ["GET", "POST"]);
  return res.status(405).json({ error: `Method ${req.method} not allowed` });
}
