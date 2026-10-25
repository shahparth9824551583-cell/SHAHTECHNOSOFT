# SHAH TECHNOSOFT Website (Next.js + Firebase + Vercel)

LEARN | GROW | BUILD YOUR FUTURE. 138 courses (₹299; your original 100 + extra courses from your posters), 8 internships (₹999), secure application form, admin panel.

**Honest status:** the source code is complete, but it was written in an environment with no internet, so `npm install`, `npm run build`, a TypeScript compile and a real Firebase test were **NOT run**. Please run the checklist in section 9 on your computer. Firebase is **not connected** until you finish section 3. The website is **not deployed** until you finish section 6.

Pinned versions (all compatible with Node 24 / npm 11): next 15.1.6, react 19.0.0, typescript 5.7.3, tailwindcss 3.4.17, firebase 11.2.0, firebase-admin 13.0.2, zod 3.24.1. Your installed Node, npm and Git need no reinstall. `package-lock.json` is created on your first `npm install`; commit it.

## 1. Windows 11 setup (Gujlish)
1. ZIP par right-click > **Extract All**. Folder `shahtechnosoft` banse.
2. VS Code kholo > **File > Open Folder** > `shahtechnosoft` select karo.
3. **Terminal > New Terminal** (PowerShell).
4. `npm install`  (2-5 minute lage, internet joiye)
5. `Copy-Item .env.example .env.local`
6. `.env.local` ma Firebase values bharo (section 3).
7. `npm run verify`  (courses ni list ma duplicate check kare)
8. `npm run dev` > browser ma http://localhost:3000 kholo.

## Logo and courses
Official logo: `public/logo-full.jpg` (your uploaded photo, unchanged, only cropped to remove the corner watermark) and favicon `src/app/icon.png`. The logo background is near-black, so it is always placed on dark `bg-ink` sections. To change the course list edit only `src/data/courses.json`.

## 2. Replace placeholders (important)
WhatsApp (919824551583), email, and Instagram (https://www.instagram.com/shahtechnosoft/) are already set in `src/config/site.ts`. **YouTube is NOT set yet**: paste your exact channel URL in `youtubeUrl`; until then the YouTube icon is hidden. Optionally add `address`. Also complete the `[OWNER TO COMPLETE]` parts of Terms (`src/app/terms/page.tsx`) and review Privacy.

## 3. Firebase setup (Gujlish)
1. https://console.firebase.google.com > **Add project** (name: shahtechnosoft).
2. **Build > Authentication > Get started > Email/Password > Enable**. Then **Users > Add user** (your admin email + strong password).
3. **Build > Firestore Database > Create database** (production mode, nearest region e.g. Mumbai).
4. **Firestore > Rules**: paste all of `firestore.rules` > **Publish**.
5. **Project settings > General > Your apps > Web (</>)**: register app, copy the config into the `NEXT_PUBLIC_FIREBASE_*` lines of `.env.local`.
6. **Project settings > Service accounts > Generate new private key**: copy `project_id`, `client_email`, `private_key` into `FIREBASE_PROJECT_ID`, `FIREBASE_CLIENT_EMAIL`, `FIREBASE_PRIVATE_KEY` (keep quotes and `\n`). **Never share or commit this file.** Delete the downloaded JSON after copying.

## 4. Create the first admin (securely)
Admin role is a Firebase custom claim, set only from your computer using the service account (nobody can give themselves admin from the website):

`npm run set-admin -- your-admin-email@example.com`

Then open `/admin`, log in (log out and in again if you were already logged in). Firestore rules enforce admin-only access, so hiding the URL is not relied on.

## 5. GitHub (Windows)
Create an account at github.com, then **New repository** `shahtechnosoft` (Private, empty). In the VS Code terminal:
```
git init
git add .
git commit -m "Initial SHAH TECHNOSOFT website"
git branch -M main
git remote add origin https://github.com/YOUR_USERNAME/shahtechnosoft.git
git push -u origin main
```
`.gitignore` already blocks `.env.local` and service-account files. Check on GitHub that `.env.local` is NOT there.

## 6. Vercel deploy
1. vercel.com > sign in with GitHub > **Add New > Project** > import `shahtechnosoft`. Framework: Next.js (auto).
2. **Environment Variables**: add every variable from `.env.example` with your real values. For `FIREBASE_PRIVATE_KEY` paste the value with the `\n` characters.
3. **Project name** `shahtechnosoft` (URL `shahtechnosoft.vercel.app` only if available; otherwise choose another subdomain in Settings > Domains). Set `NEXT_PUBLIC_SITE_URL` to your real URL.
4. **Deploy**. If it fails: open the deployment > **Build Logs**, fix, push again (auto redeploy).
5. Firebase Console > **Authentication > Settings > Authorized domains** > add your `*.vercel.app` domain.

## 7. How the security works
- Visitors cannot read or write `applications` (rules deny). The form posts to `/api/apply`, which validates with zod, takes the price from the server catalog, rejects duplicates (same email + item within 24 h), has a honeypot and a basic per-IP rate limit, and writes with the Admin SDK. Success page is shown only after the write succeeds.
- Admins (custom claim) can read applications and update only: status, paymentStatus, adminNotes, paymentNotes.
- The in-memory rate limit is best-effort on Vercel; for stronger protection enable Vercel Firewall rate limiting.

## 8. Known limits / not included
- No online payment gateway (as requested). No payment-success message anywhere.
- Contact page has buttons (WhatsApp, email), not a contact form.
- Admin "Settings" shows config; business details are edited in `src/config/site.ts`.
- Admin cannot rename courses or change prices (catalog preserved by design). Visibility toggles are stored in `settings/visibility`.
- Students tab = applicants with status Enrolled/Completed.

## 9. Testing checklist (run these yourself)
`npm run verify` (138 courses, no duplicates; this was run and passed) · `npm run typecheck` · `npm run build` · Courses page shows 138 cards with ₹299 and search/category filters work · Apply Now preselects course and price · Internships page: 8 cards, ₹999 · invalid email/phone show errors · a valid submit gives a reference ID `ST-YYYYMMDD-XXXXXX` and a document in Firestore · same submit again is blocked · logged-out user cannot read `applications` · admin login, status/payment update, CSV export · Instagram/WhatsApp/YouTube links open the right place after configuration · mobile layout · Privacy and Terms pages.

## 10. Troubleshooting
- `Firebase Admin environment variables are missing`: fill `.env.local` and restart `npm run dev`.
- Application fails with permission/credential error: check `FIREBASE_PRIVATE_KEY` format (quotes, `\n`).
- `/admin` says Not authorized: run set-admin, then log out and log in.
- Admin shows "Could not load applications": publish `firestore.rules`.
- `auth/unauthorized-domain`: add your domain in Firebase authorized domains.
- Port busy: `npm run dev -- -p 3001`.
