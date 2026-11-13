import { NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { and, eq } from "drizzle-orm";
import { db } from "@/lib/db";
import { getAdmin } from "@/lib/auth";
import { buildSchema } from "@/lib/admin-config";
import { getEntry, pgCode } from "@/lib/crud";

type Ctx = { params: Promise<{ resource: string; id: string }> };

async function resolve(ctx: Ctx) {
  if (!(await getAdmin())) return { error: NextResponse.json({ error: "Unauthorized" }, { status: 401 }) } as const;
  const { resource, id } = await ctx.params;
  const entry = getEntry(resource);
  const n = Number(id);
  if (!entry || !Number.isInteger(n)) return { error: NextResponse.json({ error: "Not found" }, { status: 404 }) } as const;
  return { entry, id: n, match: and(eq(entry.table.id, n), entry.where) } as const;
}

export async function GET(_req: Request, ctx: Ctx) {
  const r = await resolve(ctx);
  if ("error" in r) return r.error;
  const [item] = await db().select().from(r.entry.table).where(r.match).limit(1);
  return item ? NextResponse.json({ item }) : NextResponse.json({ error: "Not found" }, { status: 404 });
}

export async function PUT(req: Request, ctx: Ctx) {
  const r = await resolve(ctx);
  if ("error" in r) return r.error;
  const parsed = buildSchema(r.entry.config.fields).safeParse(await req.json().catch(() => null));
  if (!parsed.success) {
    return NextResponse.json({ error: "Please fix the highlighted fields.", fields: parsed.error.flatten().fieldErrors }, { status: 400 });
  }
  try {
    const set: Record<string, unknown> = { ...parsed.data };
    if (r.entry.hasUpdatedAt) set.updatedAt = new Date();
    const [item] = await db().update(r.entry.table).set(set).where(r.match).returning();
    if (!item) return NextResponse.json({ error: "Not found" }, { status: 404 });
    revalidatePath("/", "layout");
    return NextResponse.json({ item });
  } catch (e) {
    if (pgCode(e) === "23505") return NextResponse.json({ error: "An item with this name already exists." }, { status: 409 });
    console.error("[admin update]", e);
    return NextResponse.json({ error: "Could not save. Please try again." }, { status: 500 });
  }
}

export async function DELETE(_req: Request, ctx: Ctx) {
  const r = await resolve(ctx);
  if ("error" in r) return r.error;
  const rows = await db().delete(r.entry.table).where(r.match).returning({ id: r.entry.table.id });
  if (!rows.length) return NextResponse.json({ error: "Not found" }, { status: 404 });
  revalidatePath("/", "layout");
  return NextResponse.json({ ok: true });
}
