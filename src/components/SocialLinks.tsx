import { site, whatsappLink } from "@/config/site";

const stroke = { fill: "none", stroke: "currentColor", strokeWidth: 1.8, strokeLinecap: "round", strokeLinejoin: "round" } as const;
export const icons = {
  Instagram: (<svg viewBox="0 0 24 24" className="h-5 w-5" {...stroke} aria-hidden="true"><rect x="3" y="3" width="18" height="18" rx="5" /><circle cx="12" cy="12" r="4" /><circle cx="17.3" cy="6.7" r="1" fill="currentColor" /></svg>),
  WhatsApp: (<svg viewBox="0 0 24 24" className="h-5 w-5" {...stroke} aria-hidden="true"><path d="M20.5 3.5A11 11 0 0 0 3.2 17.3L2 22l4.8-1.2A11 11 0 1 0 20.5 3.5z" /><path d="M9 7.5c-.6 1.1 0 2.6 1.5 4.2s3.1 2.3 4.2 1.8l.8-1.2-2-1-.8.7c-.6-.3-1.3-1-1.7-1.7l.7-.8-1-2z" fill="currentColor" stroke="none" /></svg>),
  YouTube: (<svg viewBox="0 0 24 24" className="h-5 w-5" {...stroke} aria-hidden="true"><rect x="2" y="5" width="20" height="14" rx="4" /><path d="M10 9l5 3-5 3z" fill="currentColor" /></svg>),
};

export default function SocialLinks({ className = "" }: { className?: string }) {
  const all = [
    { label: "Instagram", href: site.instagramUrl },
    { label: "WhatsApp", href: whatsappLink() },
    { label: "YouTube", href: site.youtubeUrl },
  ] as const;
  const links = all.filter((l) => l.href); // hide any icon whose URL is not configured yet
  return (
    <ul className={`flex items-center gap-3 ${className}`}>
      {links.map((l) => (
        <li key={l.label}>
          <a href={l.href} target="_blank" rel="noopener noreferrer" aria-label={`SHAH TECHNOSOFT on ${l.label} (opens in a new tab)`}
            className="flex h-10 w-10 items-center justify-center rounded-full border border-gold/60 text-gold transition hover:-translate-y-0.5 hover:bg-gold hover:text-navy-900">
            {icons[l.label]}
          </a>
        </li>
      ))}
    </ul>
  );
}
