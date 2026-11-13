import "server-only";
import { v2 as cloudinary } from "cloudinary";

export function cloudinaryConfigured() {
  return Boolean(
    process.env.CLOUDINARY_URL ||
      (process.env.CLOUDINARY_CLOUD_NAME && process.env.CLOUDINARY_API_KEY && process.env.CLOUDINARY_API_SECRET),
  );
}

function configure() {
  if (process.env.CLOUDINARY_URL) {
    cloudinary.config({ secure: true });
  } else {
    cloudinary.config({
      cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
      api_key: process.env.CLOUDINARY_API_KEY,
      api_secret: process.env.CLOUDINARY_API_SECRET,
      secure: true,
    });
  }
}

export async function uploadBuffer(buf: Buffer, opts: { folder: string; resourceType: "image" | "raw"; filename?: string }) {
  configure();
  return new Promise<{ url: string; publicId: string; bytes: number }>((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      {
        folder: `shakti-pumps/${opts.folder}`,
        resource_type: opts.resourceType,
        use_filename: Boolean(opts.filename),
        filename_override: opts.filename,
        unique_filename: true,
      },
      (err, res) => {
        if (err || !res) return reject(err ?? new Error("Upload failed"));
        resolve({ url: res.secure_url, publicId: res.public_id, bytes: res.bytes });
      },
    );
    stream.end(buf);
  });
}
