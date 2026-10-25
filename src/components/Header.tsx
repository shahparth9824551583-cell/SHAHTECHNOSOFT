"use client";
import Link from "next/link";
import { useState } from "react";
import Logo from "./Logo";
import { whatsappLink } from "@/config/site";

const nav = [
  { href: "/", label: "Home" },
  { href: "/about", label: "About Us" },
  { href: "/courses", label: "Courses" },
  { href: "/internships", label: "Internships" },
  { href: "/contact", label: "Contact" },
];

export default function Header() {
  const [open, setOpen] = useState(false);
  return (
    <header className="sticky top-0 z-40 border-b border-gold/40 bg-ink">
      <div className="container-x flex h-[84px] items-center justify-between">
        <Link href="/" aria-label="SHAH TECHNOSOFT home" onClick={() => setOpen(false)}><Logo /></Link>
        <nav aria-label="Main" className="hidden items-center gap-1 lg:flex">
          {nav.map((n) => (
            <Link key={n.href} href={n.href} className="rounded-md px-3 py-2 text-sm font-medium text-slate-200 hover:bg-white/10 hover:text-gold">{n.label}</Link>
          ))}
          <a href={whatsappLink()} target="_blank" rel="noopener noreferrer" className="rounded-md px-3 py-2 text-sm font-medium text-gold hover:bg-white/10">WhatsApp</a>
          <Link href="/apply" className="btn-gold ml-2 !py-2">Apply Now</Link>
        </nav>
        <button className="rounded-md p-2 text-gold lg:hidden" aria-expanded={open} aria-controls="mobile-nav" aria-label="Toggle menu" onClick={() => setOpen(!open)}>
          <svg viewBox="0 0 24 24" className="h-6 w-6" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">{open ? <path d="M6 6l12 12M18 6L6 18" /> : <path d="M4 7h16M4 12h16M4 17h16" />}</svg>
        </button>
      </div>
      {open && (
        <nav id="mobile-nav" aria-label="Mobile" className="border-t border-white/10 bg-ink lg:hidden">
          <div className="container-x flex flex-col py-3">
            {nav.map((n) => (<Link key={n.href} href={n.href} onClick={() => setOpen(false)} className="rounded-md px-2 py-3 font-medium text-slate-100 hover:bg-white/10">{n.label}</Link>))}
            <a href={whatsappLink()} target="_blank" rel="noopener noreferrer" className="rounded-md px-2 py-3 font-medium text-gold hover:bg-white/10">WhatsApp</a>
            <Link href="/apply" onClick={() => setOpen(false)} className="btn-gold mt-2">Apply Now</Link>
          </div>
        </nav>
      )}
    </header>
  );
}
