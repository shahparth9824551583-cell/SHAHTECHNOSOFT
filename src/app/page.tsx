import Link from "next/link";
import SocialLinks from "@/components/SocialLinks";
import { LogoFull } from "@/components/Logo";
import { courses } from "@/data/courses";
import { inr, site, whatsappLink } from "@/config/site";

const steps = [
  ["Choose", "Pick a course or an internship and tap Apply Now."],
  ["Apply", "Fill the short form. You get a unique reference ID once it is saved."],
  ["We contact you", "Our team contacts you on WhatsApp or email and shares payment instructions."],
  ["Confirm", "After we verify your payment, your enrollment is confirmed."],
];
const faqs = [
  ["Who can apply?", "Students of BCA, B.Sc. IT, MCA, M.Sc. IT, Computer Science, and beginners interested in IT."],
  ["Do I pay when I submit the form?", "No. The form only saves your application. Payment instructions are shared separately after review."],
  ["What is the price?", `Each course costs ${inr(site.coursePrice)} and each internship costs ${inr(site.internshipPrice)}.`],
  ["Do you guarantee a job or placement?", "No. We do not guarantee employment or placement. We help you learn and build practical skills."],
  ["How do I know my application was received?", "You see a success page with a unique reference ID only after your application is saved. Keep that ID for any follow-up."],
];

export default function Home() {
  return (
    <>
      <section className="relative overflow-hidden bg-ink text-white">
        <div aria-hidden className="absolute -right-24 -top-24 h-96 w-96 rounded-full bg-gold/15 blur-3xl" />
        <div aria-hidden className="absolute inset-0 opacity-[0.07]" style={{ backgroundImage: "linear-gradient(#C9A227 1px,transparent 1px),linear-gradient(90deg,#C9A227 1px,transparent 1px)", backgroundSize: "44px 44px" }} />
        <div className="container-x relative grid items-center gap-10 py-16 md:grid-cols-[1.4fr_1fr] md:py-24">
          <div className="animate-rise">
            <p className="text-sm font-semibold tracking-[0.25em] text-gold">{site.tagline}</p>
            <h1 className="mt-4 font-display text-4xl font-bold leading-tight !text-white sm:text-5xl">Practical IT skills, at a price a student can afford.</h1>
            <p className="mt-5 max-w-xl text-lg text-slate-200">{site.name} offers {courses.length} IT courses at {inr(site.coursePrice)} each and 8 internship programs at {inr(site.internshipPrice)} each.</p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link href="/courses" className="btn-gold">Explore Courses</Link>
              <Link href="/internships" className="btn-ghost">Explore Internships</Link>
            </div>
          </div>
          <div className="hidden justify-self-center md:block" aria-hidden><LogoFull width={380} /></div>
        </div>
      </section>

      <section className="container-x py-14">
        <div className="grid gap-8 md:grid-cols-2">
          <div>
            <h2 className="text-3xl font-bold">About {site.name}</h2>
            <p className="mt-4 text-slate-600">We help BCA, B.Sc. IT, MCA, M.Sc. IT and Computer Science students, and beginners, learn programming, web and app development, AI, cybersecurity, databases, cloud and more, in a simple and affordable way.</p>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="card border-t-4 border-t-gold text-center"><p className="text-3xl font-bold text-navy">{inr(site.coursePrice)}</p><p className="mt-1 text-sm text-slate-600">per course</p></div>
            <div className="card border-t-4 border-t-gold text-center"><p className="text-3xl font-bold text-navy">{inr(site.internshipPrice)}</p><p className="mt-1 text-sm text-slate-600">per internship</p></div>
          </div>
        </div>
      </section>

      <section className="bg-navy-50 py-14">
        <div className="container-x">
          <h2 className="text-3xl font-bold">How applying works</h2>
          <ol className="mt-8 grid gap-4 md:grid-cols-4">
            {steps.map(([t, d], i) => (
              <li key={t} className="card"><span className="flex h-8 w-8 items-center justify-center rounded-full bg-gold font-bold text-navy-900">{i + 1}</span><h3 className="mt-3 text-lg font-semibold">{t}</h3><p className="mt-1 text-sm text-slate-600">{d}</p></li>
            ))}
          </ol>
        </div>
      </section>

      <section className="container-x py-14">
        <h2 className="text-3xl font-bold">Frequently asked questions</h2>
        <div className="mt-6 max-w-3xl divide-y divide-slate-200 rounded-2xl border border-slate-200">
          {faqs.map(([q, a]) => (
            <details key={q} className="group p-4"><summary className="cursor-pointer font-semibold text-navy">{q}</summary><p className="mt-2 text-slate-600">{a}</p></details>
          ))}
        </div>
      </section>

      <section className="bg-navy py-14 text-white">
        <div className="container-x flex flex-col items-start justify-between gap-6 md:flex-row md:items-center">
          <div>
            <h2 className="text-3xl font-bold !text-white">Questions? Talk to us.</h2>
            <p className="mt-2 text-slate-200">Message us on WhatsApp or follow us on Instagram and YouTube.</p>
          </div>
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
            <a href={whatsappLink()} target="_blank" rel="noopener noreferrer" className="btn-gold">Chat on WhatsApp</a>
            <SocialLinks />
          </div>
        </div>
      </section>
    </>
  );
}
