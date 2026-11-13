/** Global next/image loader. Cloudinary URLs get automatic format/quality/width; others pass through. */
export default function cloudinaryLoader({ src, width, quality }: { src: string; width: number; quality?: number }) {
  if (src.includes("res.cloudinary.com") && src.includes("/image/upload/")) {
    return src.replace("/image/upload/", `/image/upload/f_auto,q_${quality ?? "auto"},w_${width},c_limit/`);
  }
  return src;
}
