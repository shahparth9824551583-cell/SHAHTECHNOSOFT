import type { Metadata } from "next";
import PageHero from "@/components/PageHero";
import SocialLinks from "@/components/SocialLinks";
import { LogoFull } from "@/components/Logo";
import { site, whatsappLink, mailtoLink } from "@/config/site";

export const metadata: Metadata = { title: "Contact Us" };

export default function Contact() {
  return (
    <>
      <PageHero title="Contact Us">We usually reply on WhatsApp. Choose the way that is easiest for you.</PageHero>
      <div className="container-x grid max-w-4xl gap-6 py-12 md:grid-cols-2">
        <div className="card">
          <div className="inline-block rounded-xl bg-ink p-2"><LogoFull width={220} /></div>
          <h2 className="mt-3 text-2xl font-bold">{site.name}</h2>
          <p className="text-sm font-semibold tracking-widest text-gold-600">{site.tagline}</p>
          {site.address && <p className="mt-3 text-slate-600">{site.address}</p>}
          <SocialLinks className="mt-5 [&_a]:border-navy [&_a]:text-navy [&_a:hover]:bg-gold" />
        </div>
        <div className="card space-y-4">
          <a href={whatsappLink()} target="_blank" rel="noopener noreferrer" className="btn-gold w-full">Chat on WhatsApp</a>
          <a href={mailtoLink()} className="btn-navy w-full break-all">Email: {site.email}</a>
          <p className="text-xs text-slate-500">To apply for a course or internship, use the Apply Now page so we can save your application.</p>
        </div>
      </div>
    </>
  );
}
