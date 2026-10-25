// Usage (Windows PowerShell / VS Code terminal):  npm run set-admin -- owner@example.com
// Gives the admin role to an EXISTING Firebase Authentication user. Run it only on your own computer.
import { initializeApp, cert } from "firebase-admin/app";
import { getAuth } from "firebase-admin/auth";

try { process.loadEnvFile(".env.local"); } catch { console.error("Could not read .env.local"); process.exit(1); }
const email = process.argv[2];
if (!email) { console.error("Usage: npm run set-admin -- your-email@example.com"); process.exit(1); }

initializeApp({
  credential: cert({
    projectId: process.env.FIREBASE_PROJECT_ID,
    clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
    privateKey: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, "\n"),
  }),
});

const user = await getAuth().getUserByEmail(email);
await getAuth().setCustomUserClaims(user.uid, { admin: true });
console.log(`Done. ${email} is now admin. Log out and log in again on /admin.`);
