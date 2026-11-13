import "server-only";
import { cache } from "react";
import { eq } from "drizzle-orm";
import { db } from "./db";
import { settings } from "./db/schema";
import { DEFAULT_SETTINGS, type SiteSettings } from "./site-defaults";
import { safe } from "./safe";

export const getSettings = cache(async (): Promise<SiteSettings> =>
  safe(async () => {
    const [row] = await db().select().from(settings).where(eq(settings.key, "site")).limit(1);
    return { ...DEFAULT_SETTINGS, ...((row?.value as Partial<SiteSettings>) ?? {}) };
  }, DEFAULT_SETTINGS),
);

export async function saveSettings(value: Partial<SiteSettings>) {
  await db()
    .insert(settings)
    .values({ key: "site", value: value as Record<string, unknown> })
    .onConflictDoUpdate({ target: settings.key, set: { value: value as Record<string, unknown> } });
}
