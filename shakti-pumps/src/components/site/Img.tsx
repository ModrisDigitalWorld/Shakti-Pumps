import Image from "next/image";
import { cn } from "@/lib/utils";
import { PlaceholderArt } from "./Art";

/** Fixed-ratio image box. Falls back to a neutral illustration when no image is set. */
export function Img({
  src,
  alt,
  ratio = "4/3",
  fit = "cover",
  sizes = "(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw",
  priority,
  className,
}: {
  src?: string | null;
  alt: string;
  ratio?: string;
  fit?: "cover" | "contain";
  sizes?: string;
  priority?: boolean;
  className?: string;
}) {
  return (
    <div className={cn("relative w-full overflow-hidden bg-surface", className)} style={{ aspectRatio: ratio }}>
      {src ? (
        <Image
          src={src}
          alt={alt}
          fill
          sizes={sizes}
          priority={priority}
          className={fit === "cover" ? "object-cover" : "object-contain p-4"}
        />
      ) : (
        <PlaceholderArt />
      )}
    </div>
  );
}
