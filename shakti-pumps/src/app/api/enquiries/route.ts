import { NextResponse } from "next/server";
import { z } from "zod";
import { db } from "@/lib/db";
import { enquiries } from "@/lib/db/schema";
import { ENQUIRY_TYPES } from "@/lib/constants";
import { clientIp, rateLimit } from "@/lib/rate-limit";

const opt = (n: number) => z.string().trim().max(n).optional().default("");

const schema = z.object({
  type: z.enum(ENQUIRY_TYPES),
  name: z.string().trim().min(2, "Please enter your name").max(100),
  company: opt(150),
  mobile: z
    .string()
    .trim()
    .regex(/^\+?[\d\s-]{8,16}$/, "Enter a valid mobile number"),
  email: z.union([z.literal(""), z.string().trim().email("Enter a valid email").max(200)]).optional().default(""),
  product: opt(200),
  model: opt(200),
  spare: opt(200),
  quantity: opt(50),
  message: opt(2000),
  productId: z.number().int().positive().nullable().optional(),
  sourcePage: opt(300),
  website: z.string().max(0).optional(), // honeypot — must stay empty
});

export async function POST(req: Request) {
  if (!rateLimit(`enquiry:${clientIp(req)}`, 6, 10 * 60_000)) {
    return NextResponse.json({ error: "Too many enquiries from this device. Please call us instead." }, { status: 429 });
  }
  const json = await req.json().catch(() => null);
  const parsed = schema.safeParse(json);
  if (!parsed.success) {
    // Honeypot hit → pretend success so bots learn nothing.
    if (json && typeof json === "object" && (json as { website?: string }).website) return NextResponse.json({ ok: true });
    return NextResponse.json({ error: "Please check the form.", fields: parsed.error.flatten().fieldErrors }, { status: 400 });
  }
  const { website: _hp, ...data } = parsed.data;
  if (data.type === "contact" && !data.message) {
    return NextResponse.json({ error: "Please check the form.", fields: { message: ["Please enter your message"] } }, { status: 400 });
  }
  if (data.type === "spare" && !data.spare) {
    return NextResponse.json({ error: "Please check the form.", fields: { spare: ["Tell us which spare you need"] } }, { status: 400 });
  }
  if (data.type === "quote" && !data.product) {
    return NextResponse.json({ error: "Please check the form.", fields: { product: ["Tell us which product you need"] } }, { status: 400 });
  }
  try {
    const [row] = await db()
      .insert(enquiries)
      .values({ ...data, productId: data.productId ?? null })
      .returning({ id: enquiries.id });
    return NextResponse.json({ ok: true, id: row.id }, { status: 201 });
  } catch (e) {
    console.error("[enquiry]", e);
    return NextResponse.json({ error: "We could not save your enquiry. Please call or WhatsApp us." }, { status: 500 });
  }
}
