import { kv } from "@vercel/kv";

export default async function handler(req, res) {
  if (req.method === "POST") {
    const { email } = req.body || {};
    const trimmed = (email || "").trim().toLowerCase();
    const isValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(trimmed);

    if (!isValid) {
      return res.status(400).json({ error: "Please enter a valid email address" });
    }

    const existing = (await kv.get("subscribers")) || [];
    if (!existing.includes(trimmed)) {
      existing.push(trimmed);
      await kv.set("subscribers", existing);
    }

    return res.status(200).json({ success: true });
  }

  if (req.method === "GET") {
    const { password } = req.query || {};
    if (!password || password !== process.env.ADMIN_PASSWORD) {
      return res.status(401).json({ error: "Invalid password" });
    }
    const subscribers = (await kv.get("subscribers")) || [];
    return res.status(200).json({ subscribers });
  }

  res.setHeader("Allow", ["GET", "POST"]);
  return res.status(405).json({ error: `Method ${req.method} not allowed` });
}
