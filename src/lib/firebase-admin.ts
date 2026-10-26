import { cert, getApps, initializeApp } from "firebase-admin/app";
import { getFirestore } from "firebase-admin/firestore";

/** Server-only. Never import this file from a client component. */
function cleanEnv(value: string | undefined): string | undefined {
  if (!value) return undefined;
  let v = value.trim();
  // Remove accidental wrapping quotes added while pasting in Vercel
  if (
    (v.startsWith('"') && v.endsWith('"')) ||
    (v.startsWith("'") && v.endsWith("'"))
  ) {
    v = v.slice(1, -1);
  }
  return v;
}

export function getDb() {
  if (!getApps().length) {
    const projectId = cleanEnv(process.env.FIREBASE_PROJECT_ID);
    const clientEmail = cleanEnv(process.env.FIREBASE_CLIENT_EMAIL);
    const privateKey = cleanEnv(process.env.FIREBASE_PRIVATE_KEY)
      ?.replace(/\\n/g, "\n")
      .replace(/\r/g, "");

    const missing: string[] = [];
    if (!projectId) missing.push("FIREBASE_PROJECT_ID");
    if (!clientEmail) missing.push("FIREBASE_CLIENT_EMAIL");
    if (!privateKey) missing.push("FIREBASE_PRIVATE_KEY");
    if (missing.length) {
      throw new Error(
        `Firebase Admin environment variables are missing: ${missing.join(", ")}`
      );
    }

    if (!privateKey!.includes("BEGIN PRIVATE KEY")) {
      throw new Error(
        "FIREBASE_PRIVATE_KEY is invalid: it must start with -----BEGIN PRIVATE KEY-----"
      );
    }

    initializeApp({
      credential: cert({
        projectId: projectId!,
        clientEmail: clientEmail!,
        privateKey: privateKey!,
      }),
    });
  }
  return getFirestore();
}