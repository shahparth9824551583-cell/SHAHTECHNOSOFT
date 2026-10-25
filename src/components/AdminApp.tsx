"use client";
import { FormEvent, useEffect, useMemo, useState } from "react";
import { onAuthStateChanged, signInWithEmailAndPassword, signOut, type User } from "firebase/auth";
import { collection, doc, getDoc, onSnapshot, orderBy, query, serverTimestamp, setDoc, updateDoc } from "firebase/firestore";
import { firebaseConfigured, getClientAuth, getClientDb } from "@/lib/firebase-client";
import { PAYMENT_STATUSES, STATUSES } from "@/lib/constants";
import { courses } from "@/data/courses";
import { internships } from "@/data/internships";
import { site } from "@/config/site";

type App = {
  id: string; reference: string; fullName: string; whatsapp: string; email: string; state: string; city: string;
  educationLevel: string; collegeName: string; applicationType: string; itemId: string; itemName: string; price: number;
  message: string; status: string; paymentStatus: string; adminNotes: string; paymentNotes: string; createdAt: Date | null;
};
const TABS = ["Dashboard", "Applications", "Students", "Courses", "Internships", "Reports", "Settings"] as const;
type Tab = (typeof TABS)[number];
const fmt = (d: Date | null) => (d ? d.toLocaleString("en-IN", { dateStyle: "medium", timeStyle: "short" }) : "-");

function toCsv(rows: App[]) {
  const cols = ["reference", "fullName", "whatsapp", "email", "state", "city", "educationLevel", "collegeName", "applicationType", "itemName", "price", "status", "paymentStatus", "createdAt"] as const;
  const esc = (v: unknown) => { let s = String(v ?? ""); if (/^[=+\-@\t\r]/.test(s)) s = "'" + s; return `"${s.replace(/"/g, '""')}"`; };
  return [cols.join(","), ...rows.map((r) => cols.map((c) => esc(c === "createdAt" ? r.createdAt?.toISOString() : r[c])).join(","))].join("\r\n");
}
function download(rows: App[]) {
  const url = URL.createObjectURL(new Blob(["\uFEFF" + toCsv(rows)], { type: "text/csv;charset=utf-8" }));
  const a = document.createElement("a");
  a.href = url; a.download = `applications-${new Date().toISOString().slice(0, 10)}.csv`; a.click();
  URL.revokeObjectURL(url);
}

export default function AdminApp() {
  const [user, setUser] = useState<User | null>(null);
  const [isAdmin, setIsAdmin] = useState<boolean | null>(null);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    if (!firebaseConfigured) { setReady(true); return; }
    return onAuthStateChanged(getClientAuth(), async (u) => {
      setUser(u);
      setIsAdmin(u ? (await u.getIdTokenResult(true)).claims.admin === true : false);
      setReady(true);
    });
  }, []);

  if (!firebaseConfigured) return <Box title="Firebase is not configured">Add the NEXT_PUBLIC_FIREBASE_* values to <code>.env.local</code> (and in Vercel), then restart. See README.</Box>;
  if (!ready) return <Box title="Loading…">Please wait.</Box>;
  if (!user) return <Login />;
  if (!isAdmin) return (
    <Box title="Not authorized">
      This account ({user.email}) is not an administrator. Ask the owner to run the set-admin step, then log in again.
      <button className="btn-navy mt-4" onClick={() => signOut(getClientAuth())}>Log out</button>
    </Box>
  );
  return <Panel user={user} />;
}

function Box({ title, children }: { title: string; children: React.ReactNode }) {
  return <div className="container-x max-w-lg py-16"><div className="card"><h1 className="text-2xl font-bold">{title}</h1><div className="mt-3 text-slate-600">{children}</div></div></div>;
}

function Login() {
  const [err, setErr] = useState(""); const [busy, setBusy] = useState(false);
  async function submit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault(); setErr(""); setBusy(true);
    const f = new FormData(e.currentTarget);
    try { await signInWithEmailAndPassword(getClientAuth(), String(f.get("email")), String(f.get("password"))); }
    catch { setErr("Login failed. Check your email and password."); }
    setBusy(false);
  }
  return (
    <div className="container-x max-w-md py-16">
      <form onSubmit={submit} className="card space-y-4">
        <h1 className="text-2xl font-bold">Admin login</h1>
        <div><label htmlFor="email" className="mb-1 block text-sm font-medium">Email</label><input id="email" name="email" type="email" required autoComplete="username" className="input" /></div>
        <div><label htmlFor="password" className="mb-1 block text-sm font-medium">Password</label><input id="password" name="password" type="password" required autoComplete="current-password" className="input" /></div>
        {err && <p role="alert" className="text-sm text-red-600">{err}</p>}
        <button disabled={busy} className="btn-navy w-full">{busy ? "Logging in…" : "Log in"}</button>
      </form>
    </div>
  );
}

function Panel({ user }: { user: User }) {
  const [tab, setTab] = useState<Tab>("Dashboard");
  const [apps, setApps] = useState<App[]>([]);
  const [loadErr, setLoadErr] = useState("");
  const [hidden, setHidden] = useState<string[]>([]);
  const [q, setQ] = useState(""); const [item, setItem] = useState(""); const [status, setStatus] = useState("");
  const [from, setFrom] = useState(""); const [to, setTo] = useState("");
  const [openId, setOpenId] = useState<string | null>(null);

  useEffect(() => {
    const db = getClientDb();
    const off = onSnapshot(query(collection(db, "applications"), orderBy("createdAt", "desc")),
      (snap) => setApps(snap.docs.map((x) => { const d = x.data(); return { ...d, id: x.id, createdAt: d.createdAt?.toDate?.() ?? null } as App; })),
      (e) => setLoadErr(e.message));
    getDoc(doc(db, "settings", "visibility")).then((s) => setHidden((s.data()?.hidden as string[] | undefined) ?? [])).catch(() => {});
    return off;
  }, []);

  const filtered = useMemo(() => apps.filter((a) => {
    const s = q.trim().toLowerCase();
    if (s && !a.fullName.toLowerCase().includes(s) && !a.reference.toLowerCase().includes(s)) return false;
    if (item && a.itemName !== item) return false;
    if (status && a.status !== status) return false;
    if (from && (!a.createdAt || a.createdAt < new Date(from + "T00:00:00"))) return false;
    if (to && (!a.createdAt || a.createdAt > new Date(to + "T23:59:59"))) return false;
    return true;
  }), [apps, q, item, status, from, to]);

  const count = (s: string) => apps.filter((a) => a.status === s).length;
  const students = useMemo(() => {
    const m = new Map<string, App[]>();
    filtered.filter((a) => ["Enrolled", "Completed"].includes(a.status)).forEach((a) => m.set(a.email, [...(m.get(a.email) ?? []), a]));
    return [...m.entries()];
  }, [filtered]);

  async function toggle(id: string) {
    const next = hidden.includes(id) ? hidden.filter((x) => x !== id) : [...hidden, id];
    await setDoc(doc(getClientDb(), "settings", "visibility"), { hidden: next }, { merge: true });
    setHidden(next);
  }

  const Filters = (
    <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-5">
      <input aria-label="Search by name or application ID" placeholder="Search name or ID" value={q} onChange={(e) => setQ(e.target.value)} className="input" />
      <select aria-label="Filter by course or internship" value={item} onChange={(e) => setItem(e.target.value)} className="input"><option value="">All courses / internships</option>{[...new Set(apps.map((a) => a.itemName))].sort().map((n) => <option key={n}>{n}</option>)}</select>
      <select aria-label="Filter by status" value={status} onChange={(e) => setStatus(e.target.value)} className="input"><option value="">All statuses</option>{STATUSES.map((s) => <option key={s}>{s}</option>)}</select>
      <input aria-label="From date" type="date" value={from} onChange={(e) => setFrom(e.target.value)} className="input" />
      <input aria-label="To date" type="date" value={to} onChange={(e) => setTo(e.target.value)} className="input" />
    </div>
  );
  const selected = apps.find((a) => a.id === openId);

  return (
    <div className="container-x py-8">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h1 className="text-2xl font-bold">Admin panel</h1>
        <div className="text-sm text-slate-600">{user.email} <button className="btn-navy ml-2 !py-1.5" onClick={() => signOut(getClientAuth())}>Log out</button></div>
      </div>
      <div role="tablist" className="mt-5 flex flex-wrap gap-2">
        {TABS.map((t) => <button key={t} role="tab" aria-selected={tab === t} onClick={() => setTab(t)} className={`rounded-full border px-4 py-1.5 text-sm font-medium ${tab === t ? "border-navy bg-navy text-white" : "border-slate-300 text-navy"}`}>{t}</button>)}
      </div>
      {loadErr && <p role="alert" className="mt-4 rounded bg-red-50 p-3 text-sm text-red-700">Could not load applications: {loadErr}</p>}

      <div className="mt-6">
        {tab === "Dashboard" && (
          <div className="grid grid-cols-2 gap-4 md:grid-cols-3">
            {([["Total applications", apps.length], ["New", count("New")], ["Contacted", count("Contacted")], ["Awaiting payment", count("Awaiting Payment")], ["Payments confirmed", count("Payment Confirmed")], ["Enrolled students", count("Enrolled")]] as [string, number][]).map(([l, n]) => (
              <div key={l} className="card border-t-4 border-t-gold"><p className="text-3xl font-bold text-navy">{n}</p><p className="text-sm text-slate-600">{l}</p></div>
            ))}
          </div>
        )}

        {tab === "Applications" && (
          <div className="space-y-4">
            {Filters}
            <div className="overflow-x-auto rounded-xl border border-slate-200">
              <table className="w-full min-w-[720px] text-left text-sm">
                <thead className="bg-navy-50 text-navy"><tr>{["Reference", "Name", "Applied for", "Status", "Payment", "Date", ""].map((h) => <th key={h} className="p-3">{h}</th>)}</tr></thead>
                <tbody>{filtered.map((a) => (
                  <tr key={a.id} className="border-t border-slate-100"><td className="p-3 font-mono text-xs">{a.reference}</td><td className="p-3">{a.fullName}</td><td className="p-3">{a.itemName}</td><td className="p-3">{a.status}</td><td className="p-3">{a.paymentStatus}</td><td className="p-3">{fmt(a.createdAt)}</td><td className="p-3"><button className="font-semibold text-navy underline" onClick={() => setOpenId(a.id)}>View</button></td></tr>
                ))}</tbody>
              </table>
              {filtered.length === 0 && <p className="p-4 text-center text-slate-500">No applications match.</p>}
            </div>
            {selected && <Detail key={selected.id} app={selected} onClose={() => setOpenId(null)} />}
          </div>
        )}

        {tab === "Students" && (
          <div className="space-y-4">
            <p className="text-sm text-slate-600">Students are applicants whose status is Enrolled or Completed. Use the filters to search.</p>
            {Filters}
            {students.length === 0 ? <p className="card text-slate-500">No student records yet.</p> : students.map(([email, list]) => (
              <div key={email} className="card"><p className="font-semibold">{list[0].fullName} <span className="font-normal text-slate-500">· {email} · {list[0].whatsapp}</span></p>
                <ul className="mt-2 list-inside list-disc text-sm text-slate-600">{list.map((a) => <li key={a.id}>{a.itemName} ({a.status}, payment: {a.paymentStatus}) · {a.reference}</li>)}</ul></div>
            ))}
          </div>
        )}

        {(tab === "Courses" || tab === "Internships") && (
          <div>
            <p className="mb-3 text-sm text-slate-600">Untick to hide an item from the public website. The catalog itself cannot be edited here, and the price stays fixed.</p>
            <ul className="grid gap-2 md:grid-cols-2">
              {(tab === "Courses" ? courses : internships).map((c) => (
                <li key={c.id} className="card flex items-center justify-between !p-3 text-sm"><span>{c.name} · ₹{c.price}</span>
                  <label className="flex items-center gap-2"><input type="checkbox" className="accent-navy" checked={!hidden.includes(c.id)} onChange={() => toggle(c.id)} />Visible</label></li>
              ))}
            </ul>
          </div>
        )}

        {tab === "Reports" && (
          <div className="space-y-4">
            {Filters}
            <p className="text-sm text-slate-600">{filtered.length} of {apps.length} applications in this view.</p>
            <div className="grid gap-2 sm:grid-cols-3 lg:grid-cols-4">{STATUSES.map((s) => <div key={s} className="card !p-3"><p className="text-xl font-bold text-navy">{filtered.filter((a) => a.status === s).length}</p><p className="text-xs text-slate-600">{s}</p></div>)}</div>
            <button className="btn-gold" disabled={!filtered.length} onClick={() => download(filtered)}>Download CSV ({filtered.length})</button>
          </div>
        )}

        {tab === "Settings" && (
          <div className="card space-y-2 text-sm text-slate-700">
            <p>Business details are edited in <code>src/config/site.ts</code> (then redeploy):</p>
            <p>Email: {site.email}<br />WhatsApp: {site.whatsappNumber}<br />Instagram: {site.instagramUrl}<br />YouTube: {site.youtubeUrl}</p>
          </div>
        )}
      </div>
    </div>
  );
}

function Detail({ app, onClose }: { app: App; onClose: () => void }) {
  const [status, setStatus] = useState(app.status); const [pay, setPay] = useState(app.paymentStatus);
  const [notes, setNotes] = useState(app.adminNotes ?? ""); const [payNotes, setPayNotes] = useState(app.paymentNotes ?? "");
  const [msg, setMsg] = useState("");
  async function save() {
    if (pay === "Paid" && app.paymentStatus !== "Paid" && !confirm("Mark as Paid? Only do this after you have actually verified the payment.")) return;
    setMsg("Saving…");
    try {
      await updateDoc(doc(getClientDb(), "applications", app.id), { status, paymentStatus: pay, adminNotes: notes, paymentNotes: payNotes, updatedAt: serverTimestamp() });
      setMsg("Saved.");
    } catch { setMsg("Save failed. Check your admin permission and Firestore rules."); }
  }
  const rows: [string, string][] = [["Reference", app.reference], ["Name", app.fullName], ["WhatsApp", app.whatsapp], ["Email", app.email], ["Location", `${app.city}, ${app.state}`], ["Education", app.educationLevel], ["College", app.collegeName || "-"], ["Applied for", `${app.itemName} (₹${app.price})`], ["Message", app.message || "-"], ["Date", fmt(app.createdAt)]];
  return (
    <div className="card space-y-4 border-gold">
      <div className="flex justify-between"><h2 className="text-xl font-bold">Application details</h2><button onClick={onClose} className="text-sm font-semibold text-navy underline">Close</button></div>
      <dl className="grid gap-2 text-sm sm:grid-cols-2">{rows.map(([k, v]) => <div key={k}><dt className="text-slate-500">{k}</dt><dd className="break-words font-medium">{v}</dd></div>)}</dl>
      <div className="grid gap-3 sm:grid-cols-2">
        <label className="text-sm">Application status<select className="input mt-1" value={status} onChange={(e) => setStatus(e.target.value)}>{STATUSES.map((s) => <option key={s}>{s}</option>)}</select></label>
        <label className="text-sm">Payment status<select className="input mt-1" value={pay} onChange={(e) => setPay(e.target.value)}>{PAYMENT_STATUSES.map((s) => <option key={s}>{s}</option>)}</select></label>
        <label className="text-sm">Internal notes<textarea className="input mt-1" rows={3} value={notes} onChange={(e) => setNotes(e.target.value)} /></label>
        <label className="text-sm">Payment verification notes<textarea className="input mt-1" rows={3} value={payNotes} onChange={(e) => setPayNotes(e.target.value)} /></label>
      </div>
      <div className="flex items-center gap-3"><button className="btn-navy" onClick={save}>Save changes</button><span role="status" className="text-sm text-slate-600">{msg}</span></div>
    </div>
  );
}
