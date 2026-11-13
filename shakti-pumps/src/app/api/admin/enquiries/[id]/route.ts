import { NextResponse } from "next/server";
import { eq } from "drizzle-orm";
import { z } from "zod";
import { db } from "@/lib/db";
import { enquiries } from "@/lib/db/schema";
import { getAdmin } from "@/lib/auth";
import { ENQUIRY_STATUSES } from "@/lib/constants";

type Ctx = { params: Promise<{ id: string }> };

export async function PATCH(req: Request, { params }: Ctx) {
  if (!(await getAdmin())) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const id = Number((await params).id);
  const parsed = z.object({ status: z.enum(ENQUIRY_STATUSES) }).safeParse(await req.json().catch(() => null));
  if (!Number.isInteger(id) || !parsed.success) return NextResponse.json({ error: "Invalid request" }, { status: 400 });
  const rows = await db().update(enquiries).set({ status: parsed.data.status }).where(eq(enquiries.id, id)).returning({ id: enquiries.id });
  return rows.length ? NextResponse.json({ ok: true }) : NextResponse.json({ error: "Not found" }, { status: 404 });
}

export async function DELETE(_req: Request, { params }: Ctx) {
  if (!(await getAdmin())) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const id = Number((await params).id);
  if (!Number.isInteger(id)) return NextResponse.json({ error: "Invalid request" }, { status: 400 });
  await db().delete(enquiries).where(eq(enquiries.id, id));
  return NextResponse.json({ ok: true });
}
