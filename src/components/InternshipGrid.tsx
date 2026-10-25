"use client";
import Link from "next/link";
import { internships } from "@/data/internships";
import { inr } from "@/config/site";
import { useHidden } from "@/lib/useHidden";

export default function InternshipGrid() {
  const hidden = useHidden();
  const list = internships.filter((i) => !hidden.includes(i.id));
  return (
    <ul className="container-x grid gap-4 py-10 sm:grid-cols-2 lg:grid-cols-4">
      {list.map((i) => (
        <li key={i.id} className="card flex flex-col justify-between gap-6 border-t-4 border-t-gold">
          <h2 className="font-display text-lg font-semibold leading-snug">{i.name}</h2>
          <div className="flex items-center justify-between">
            <span className="text-xl font-bold text-navy">{inr(i.price)}</span>
            <Link href={`/apply?type=internship&item=${i.id}`} className="btn-navy !py-2" aria-label={`Apply now for ${i.name}`}>Apply Now</Link>
          </div>
        </li>
      ))}
    </ul>
  );
}
