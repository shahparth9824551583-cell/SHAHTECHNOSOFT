import PageHero from "./PageHero";
import { site } from "@/config/site";

export default function Legal({ title, sections }: { title: string; sections: [string, string][] }) {
  return (
    <>
      <PageHero title={title} />
      <div className="container-x max-w-3xl py-10">
        <p role="note" className="rounded-lg border border-gold bg-gold/10 p-3 text-sm text-navy">DRAFT for owner review. Please review this text (preferably with a legal professional) and edit <code>src/components/Legal.tsx</code> and the page file before publishing.</p>
        {sections.map(([h, t]) => (<section key={h} className="mt-6"><h2 className="text-xl font-bold">{h}</h2><p className="mt-2 text-slate-700">{t}</p></section>))}
        <p className="mt-8 text-sm text-slate-600">Contact: {site.email}</p>
      </div>
    </>
  );
}
