import type { Metadata } from "next";
import PageHero from "@/components/PageHero";
import InternshipGrid from "@/components/InternshipGrid";

export const metadata: Metadata = { title: "Internship Programs" };

export default function Internships() {
  return (<><PageHero title="Internship Programs">8 internship options. ₹999 each. Tap Apply Now to start.</PageHero><InternshipGrid /></>);
}
