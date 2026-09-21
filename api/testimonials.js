import { kv } from "@vercel/kv";

export default async function handler(req, res) {
  if (req.method === "GET") {
    const testimonials = (await kv.get("testimonials")) || [];
    return res.status(200).json({ testimonials });
  }

  if (req.method === "POST") {
    const { password, testimonials } = req.body || {};

    if (!password || password !== process.env.ADMIN_PASSWORD) {
      return res.status(401).json({ error: "Invalid password" });
    }

    if (!Array.isArray(testimonials)) {
      return res.status(400).json({ error: "testimonials must be an array" });
    }

    await kv.set("testimonials", testimonials);
    return res.status(200).json({ success: true });
  }

  res.setHeader("Allow", ["GET", "POST"]);
  return res.status(405).json({ error: `Method ${req.method} not allowed` });
}
