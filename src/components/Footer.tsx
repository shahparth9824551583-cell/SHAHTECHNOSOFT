import Link from "next/link";
import { LogoFull } from "./Logo";
import SocialLinks from "./SocialLinks";
import { site, mailtoLink } from "@/config/site";

export default function Footer() {
  return (
    <footer className="bg-ink text-slate-300">
      <div className="container-x grid gap-10 py-12 md:grid-cols-3">
        <div>
          <LogoFull width={260} />
          <p className="mt-4 text-sm font-semibold tracking-widest text-gold">{site.tagline}</p>
          <SocialLinks className="mt-5" />
        </div>
        <nav aria-label="Footer" className="grid grid-cols-2 gap-2 text-sm">
          {[["/", "Home"], ["/about", "About Us"], ["/courses", "Courses"], ["/internships", "Internships"], ["/apply", "Apply Now"], ["/contact", "Contact Us"], ["/privacy", "Privacy Policy"], ["/terms", "Terms and Conditions"]].map(([h, l]) => (
            <Link key={h} href={h} className="py-1 hover:text-gold">{l}</Link>
          ))}
        </nav>
        <div className="text-sm">
          <p className="font-semibold text-white">Contact</p>
          <a href={mailtoLink()} className="mt-2 block break-all hover:text-gold">{site.email}</a>
          {site.address && <p className="mt-2">{site.address}</p>}
          <p className="mt-4 text-xs text-slate-400">Course ₹{site.coursePrice} · Internship ₹{site.internshipPrice}</p>
        </div>
      </div>
      <div className="border-t border-white/10 py-4 text-center text-xs text-slate-400">© {new Date().getFullYear()} {site.name}. All rights reserved.</div>
    </footer>
  );
}
