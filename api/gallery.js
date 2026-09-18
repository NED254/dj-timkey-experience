import { kv } from "@vercel/kv";

export default async function handler(req, res) {
  if (req.method === "GET") {
    const gallery = (await kv.get("gallery")) || { photoSessions: [], videoSessions: [] };
    return res.status(200).json(gallery);
  }

  if (req.method === "POST") {
    const { password, photoSessions, videoSessions } = req.body || {};

    if (!password || password !== process.env.ADMIN_PASSWORD) {
      return res.status(401).json({ error: "Invalid password" });
    }

    if (!Array.isArray(photoSessions) || !Array.isArray(videoSessions)) {
      return res.status(400).json({ error: "photoSessions and videoSessions must be arrays" });
    }

    await kv.set("gallery", { photoSessions, videoSessions });
    return res.status(200).json({ success: true });
  }

  res.setHeader("Allow", ["GET", "POST"]);
  return res.status(405).json({ error: `Method ${req.method} not allowed` });
}
