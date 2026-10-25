import { NextResponse } from "next/server";
import { randomBytes } from "crypto";
import { FieldValue } from "firebase-admin/firestore";
import { getDb } from "@/lib/firebase-admin";
import { applicationSchema } from "@/lib/validation";
import { findItem } from "@/lib/catalog";

export const runtime = "nodejs";

// Best-effort rate limit (per server instance). Add Vercel Firewall rate limiting for stronger protection.
const hits = new Map<string, number[]>();
const ALPHABET = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";

function makeRef() {
  const date = new Date().toISOString().slice(0, 10).replace(/-/g, "");
  let s = "";
  for (const b of randomBytes(6)) s += ALPHABET[b % ALPHABET.length];
  return `ST-${date}-${s}`;
}
const fail = (status: number, message: string) => NextResponse.json({ ok: false, message }, { status });

export async function POST(req: Request) {
  const ip = req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ?? "unknown";
  const now = Date.now();
  const recent = (hits.get(ip) ?? []).filter((t) => now - t < 10 * 60 * 1000);
  if (recent.length >= 5) return fail(429, "Too many attempts. Please wait a few minutes and try again.");
  recent.push(now);
  hits.set(ip, recent);

  let body: unknown;
  try { body = await req.json(); } catch { return fail(400, "Invalid request."); }

  const parsed = applicationSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { ok: false, message: "Please correct the highlighted fields.", fieldErrors: parsed.error.flatten().fieldErrors },
      { status: 400 },
    );
  }
  const d = parsed.data;
  const item = findItem(d.applicationType, d.itemId);
  if (!item) return fail(400, "The selected course or internship was not found.");

  try {
    const db = getDb();
    const same = await db.collection("applications").where("email", "==", d.email).where("itemId", "==", d.itemId).get();
    const duplicate = same.docs.some((x) => {
      const t = x.get("createdAt") as { toMillis?: () => number } | undefined;
      return now - (t?.toMillis?.() ?? 0) < 24 * 60 * 60 * 1000;
    });
    if (duplicate) return fail(409, "You have already applied for this in the last 24 hours. We will contact you soon.");

    const reference = makeRef();
    await db.collection("applications").doc(reference).create({
      reference,
      fullName: d.fullName,
      whatsapp: `+91${d.whatsapp}`,
      email: d.email,
      state: d.state,
      city: d.city,
      educationLevel: d.educationLevel,
      collegeName: d.collegeName,
      applicationType: d.applicationType,
      itemId: d.itemId,
      itemName: item.name,
      price: item.price,
      message: d.message,
      consent: true,
      status: "New",
      paymentStatus: "Not Paid",
      adminNotes: "",
      paymentNotes: "",
      createdAt: FieldValue.serverTimestamp(),
      updatedAt: FieldValue.serverTimestamp(),
    });
    return NextResponse.json({ ok: true, reference });
  } catch (e) {
    console.error("Application save failed:", e);
    return fail(500, "We could not save your application. Please try again, or contact us on WhatsApp.");
  }
}
