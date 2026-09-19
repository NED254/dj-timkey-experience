# Run from inside dj-timkey-experience\

# ---------- api/upload.js: add addRandomSuffix on the SERVER side ----------
@'
import { handleUpload } from "@vercel/blob/client";

export default async function handler(request, response) {
  const body = request.body;

  try {
    const jsonResponse = await handleUpload({
      body,
      request,
      onBeforeGenerateToken: async (pathname, clientPayload) => {
        const parsed = clientPayload ? JSON.parse(clientPayload) : {};
        if (parsed.password !== process.env.ADMIN_PASSWORD) {
          throw new Error("Unauthorized");
        }
        return {
          allowedContentTypes: ["image/jpeg", "image/png", "image/webp", "image/gif", "video/mp4", "video/quicktime", "video/webm"],
          addRandomSuffix: true,
        };
      },
      onUploadCompleted: async () => {},
    });

    return response.status(200).json(jsonResponse);
  } catch (error) {
    return response.status(400).json({ error: error.message });
  }
}
'@ | Set-Content -Path ".\api\upload.js" -Encoding UTF8

# ---------- src/pages/Admin.jsx: remove addRandomSuffix from CLIENT calls (not allowed there) ----------
$path = ".\src\pages\Admin.jsx"
$content = Get-Content -Raw $path
$content = $content.Replace("    addRandomSuffix: true,`n", "")
[System.IO.File]::WriteAllText((Resolve-Path $path), $content, (New-Object System.Text.UTF8Encoding $false))

Write-Host "Fixed properly: addRandomSuffix now set server-side in api/upload.js, removed from client calls." -ForegroundColor Green
Write-Host "Next: npm run build" -ForegroundColor Cyan
