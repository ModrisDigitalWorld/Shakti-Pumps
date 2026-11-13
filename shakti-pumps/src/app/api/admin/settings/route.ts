import { NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { getAdmin } from "@/lib/auth";
import { SETTINGS_FIELDS, buildSchema } from "@/lib/admin-config";
import { getSettings, saveSettings } from "@/lib/settings";

const schema = buildSchema(SETTINGS_FIELDS);

export async function GET() {
  if (!(await getAdmin())) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  return NextResponse.json({ item: await getSettings() });
}

export async function PUT(req: Request) {
  if (!(await getAdmin())) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const parsed = schema.safeParse(await req.json().catch(() => null));
  if (!parsed.success) {
    return NextResponse.json({ error: "Please fix the highlighted fields.", fields: parsed.error.flatten().fieldErrors }, { status: 400 });
  }
  await saveSettings(parsed.data);
  revalidatePath("/", "layout");
  return NextResponse.json({ ok: true });
}
