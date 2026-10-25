import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import { site, whatsappLink } from "@/config/site";

export const metadata: Metadata = { title: "Application Received", robots: { index: false } };

export default async function Success({ searchParams }: { searchParams: Promise<{ ref?: string }> }) {
  const { ref } = await searchParams;
  if (!ref || !/^ST-\d{8}-[A-Z2-9]{6}$/.test(ref)) redirect("/apply");
  return (
    <div className="container-x max-w-xl py-16 text-center">
      <div className="card border-t-4 border-t-gold">
        <h1 className="text-3xl font-bold">Application received</h1>
        <p className="mt-3 text-slate-600">Your application was saved. Your reference ID is:</p>
        <p className="mt-3 select-all rounded-lg bg-navy py-3 font-mono text-xl font-bold tracking-wider text-gold">{ref}</p>
        <p className="mt-4 text-sm text-slate-600">Keep this ID. {site.name} will contact you on WhatsApp or email and share payment instructions separately. Payment is not taken on this website.</p>
        <div className="mt-6 flex flex-wrap justify-center gap-3">
          <Link href="/" className="btn-navy">Back to Home</Link>
          <a href={whatsappLink()} target="_blank" rel="noopener noreferrer" className="btn-gold">Message us on WhatsApp</a>
        </div>
      </div>
    </div>
  );
}
