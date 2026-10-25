import type { Metadata } from "next";
import PageHero from "@/components/PageHero";
import CourseBrowser from "@/components/CourseBrowser";
import { courses } from "@/data/courses";

export const metadata: Metadata = { title: "Courses" };

export default function Courses() {
  return (<><PageHero title="Courses">{courses.length} IT courses. ₹299 each. Search or filter by category, then tap Apply Now.</PageHero><CourseBrowser /></>);
}
