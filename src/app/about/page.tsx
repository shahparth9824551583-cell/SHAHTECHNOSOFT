import type { Metadata } from "next";
import Link from "next/link";
import PageHero from "@/components/PageHero";
import { site } from "@/config/site";

export const metadata: Metadata = { title: "About Us" };

export default function About() {
  return (
    <>
      <PageHero title="About Us">{site.tagline}</PageHero>
      <div className="container-x max-w-3xl space-y-5 py-12 text-slate-700">
        <p>{site.name} is an IT education business that offers affordable courses and internship programs for students and beginners.</p>
        <p>Our courses cover computer basics, programming, web and app development, AI, cybersecurity, databases, data analytics, cloud, design, testing and career skills. Each course is {`₹${site.coursePrice}`} and each internship is {`₹${site.internshipPrice}`}.</p>
        <p>We do not claim government approval, university affiliation, accreditation, or job and placement guarantees. Certificates, where offered, depend on the completion requirements stated in our <Link href="/terms" className="font-semibold text-navy underline">Terms and Conditions</Link>.</p>
        <Link href="/courses" className="btn-navy">Explore Courses</Link>
      </div>
    </>
  );
}
