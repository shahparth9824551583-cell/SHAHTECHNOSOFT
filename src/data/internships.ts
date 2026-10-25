import { site } from "@/config/site";

export type Internship = { id: string; name: string; price: number };

export const internships: Internship[] = [
  "Web Development Internship",
  "Python Development Internship",
  "Java Development Internship",
  "AI and Machine Learning Internship",
  "Data Analytics Internship",
  "Cybersecurity Internship",
  "App Development Internship",
  "UI/UX Design Internship",
].map((name, i) => ({ id: `internship-${i + 1}`, name, price: site.internshipPrice }));
