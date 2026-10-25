"use client";
import Link from "next/link";
import { useMemo, useState } from "react";
import { categories, courses } from "@/data/courses";
import { inr } from "@/config/site";
import { useHidden } from "@/lib/useHidden";

export default function CourseBrowser() {
  const hidden = useHidden();
  const [q, setQ] = useState("");
  const [cat, setCat] = useState("All");
  const list = useMemo(
    () => courses.filter((c) => !hidden.includes(c.id) && (cat === "All" || c.category === cat) && c.name.toLowerCase().includes(q.trim().toLowerCase())),
    [q, cat, hidden],
  );
  return (
    <div className="container-x py-10">
      <label htmlFor="search" className="sr-only">Search courses by name</label>
      <input id="search" type="search" value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search course name…" className="input max-w-md" />
      <div className="mt-4 flex flex-wrap gap-2" role="group" aria-label="Filter by category">
        {["All", ...categories].map((c) => (
          <button key={c} onClick={() => setCat(c)} aria-pressed={cat === c}
            className={`rounded-full border px-3 py-1.5 text-xs font-medium transition ${cat === c ? "border-navy bg-navy text-white" : "border-slate-300 bg-white text-navy hover:border-gold"}`}>{c}</button>
        ))}
      </div>
      <p className="mt-5 text-sm text-slate-500" aria-live="polite">Showing {list.length} course{list.length === 1 ? "" : "s"}</p>
      {list.length === 0 ? (
        <p className="card mt-4 text-center text-slate-600">No course matches your search. Try another word or choose “All”.</p>
      ) : (
        <ul className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {list.map((c) => (
            <li key={c.id} className="card flex flex-col justify-between gap-4 border-t-4 border-t-gold transition hover:shadow-md">
              <h2 className="font-display text-lg font-semibold leading-snug">{c.name}</h2>
              <div className="flex items-center justify-between">
                <span className="text-xl font-bold text-navy">{inr(c.price)}</span>
                <Link href={`/apply?type=course&item=${c.id}`} className="btn-navy !py-2" aria-label={`Apply now for ${c.name}`}>Apply Now</Link>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
