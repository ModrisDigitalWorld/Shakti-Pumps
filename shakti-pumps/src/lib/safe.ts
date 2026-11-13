/**
 * Run a DB read. During `next build`, or when DATABASE_URL is missing (first local run),
 * return the fallback so pages still render; at runtime real errors propagate.
 */
export async function safe<T>(fn: () => Promise<T>, fallback: T): Promise<T> {
  const building = process.env.NEXT_PHASE === "phase-production-build";
  if (building || !process.env.DATABASE_URL) {
    if (!building) console.warn("[db] DATABASE_URL is not set — rendering with empty data.");
    return fallback;
  }
  return fn();
}
