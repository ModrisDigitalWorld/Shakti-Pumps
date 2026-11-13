import { NextResponse } from "next/server";
import { getAdmin } from "@/lib/auth";
import { cloudinaryConfigured, uploadBuffer } from "@/lib/cloudinary";

export const runtime = "nodejs";
export const maxDuration = 60;

const IMAGE_TYPES = new Set(["image/jpeg", "image/png", "image/webp", "image/avif"]);
const DOC_TYPES = new Set([
  "application/pdf",
  "application/msword",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
  "application/vnd.ms-excel",
  "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
]);

export async function POST(req: Request) {
  if (!(await getAdmin())) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  if (!cloudinaryConfigured()) {
    return NextResponse.json(
      { error: "Cloudinary is not configured. Set CLOUDINARY_CLOUD_NAME / API_KEY / API_SECRET, or paste a URL instead." },
      { status: 503 },
    );
  }

  const form = await req.formData().catch(() => null);
  const file = form?.get("file");
  const kind = form?.get("kind") === "file" ? "file" : "image";
  if (!(file instanceof File)) return NextResponse.json({ error: "No file received." }, { status: 400 });

  const isImage = kind === "image";
  if (isImage ? !IMAGE_TYPES.has(file.type) : !DOC_TYPES.has(file.type)) {
    return NextResponse.json(
      { error: isImage ? "Images must be JPG, PNG, WebP or AVIF." : "Documents must be PDF, Word or Excel files." },
      { status: 415 },
    );
  }
  const max = isImage ? 10 * 1024 * 1024 : 25 * 1024 * 1024;
  if (file.size > max) return NextResponse.json({ error: `File is too large (max ${max / 1024 / 1024} MB).` }, { status: 413 });

  try {
    const buf = Buffer.from(await file.arrayBuffer());
    const safeName = file.name.replace(/[^\w.\-]+/g, "_").slice(0, 80);
    const out = await uploadBuffer(buf, {
      folder: isImage ? "images" : "documents",
      resourceType: isImage ? "image" : "raw",
      filename: isImage ? undefined : safeName,
    });
    return NextResponse.json(out);
  } catch (e) {
    console.error("[upload]", e);
    return NextResponse.json({ error: "Upload failed. Check your Cloudinary credentials." }, { status: 502 });
  }
}
