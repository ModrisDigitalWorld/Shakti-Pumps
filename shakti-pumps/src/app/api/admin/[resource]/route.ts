import { NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { and, eq } from "drizzle-orm";
import { db } from "@/lib/db";
import { getAdmin } from "@/lib/auth";
import { buildSchema } from "@/lib/admin-config";
import { getEntry, pgCode } from "@/lib/crud";
import { slugify } from "@/lib/utils";

type Ctx = { params: Promise<{ resource: string }> };

export async function GET(_req: Request, { params }: Ctx) {
  if (!(await getAdmin())) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const entry = getEntry((await params).resource);
  if (!entry) return NextResponse.json({ error: "Not found" }, { status: 404 });
  const items = await db().select().from(entry.table).where(entry.where).orderBy(...entry.orderBy);
  return NextResponse.json({ items });
}

export async function POST(req: Request, { params }: Ctx) {
  if (!(await getAdmin())) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const entry = getEntry((await params).resource);
  if (!entry) return NextResponse.json({ error: "Not found" }, { status: 404 });

  const parsed = buildSchema(entry.config.fields).safeParse(await req.json().catch(() => null));
  if (!parsed.success) {
    return NextResponse.json({ error: "Please fix the highlighted fields.", fields: parsed.error.flatten().fieldErrors }, { status: 400 });
  }
  const values: Record<string, unknown> = { ...parsed.data, ...entry.fixed };

  if (entry.config.slugFrom) {
    const base = slugify(String(values[entry.config.slugFrom])) || "item";
    let slug = base;
    for (let i = 2; i < 200; i++) {
      const [hit] = await db().select({ id: entry.table.id }).from(entry.table).where(and(eq(entry.table.slug, slug))).limit(1);
      if (!hit) break;
      slug = `${base}-${i}`;
    }
    values.slug = slug;
  }

  try {
    const [item] = await db().insert(entry.table).values(values).returning();
    revalidatePath("/", "layout");
    return NextResponse.json({ item }, { status: 201 });
  } catch (e) {
    if (pgCode(e) === "23505") return NextResponse.json({ error: "An item with this name already exists." }, { status: 409 });
    console.error("[admin create]", e);
    return NextResponse.json({ error: "Could not save. Please try again." }, { status: 500 });
  }
}
