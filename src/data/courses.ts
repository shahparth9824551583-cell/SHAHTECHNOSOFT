import raw from "./courses.json";
import { site } from "@/config/site";

export type Course = { id: string; name: string; category: string; price: number };

let n = 0;
export const courses: Course[] = Object.entries(raw as Record<string, string[]>).flatMap(([category, names]) =>
  names.map((name) => ({ id: `course-${String(++n).padStart(3, "0")}`, name, category, price: site.coursePrice })),
);
export const categories = Object.keys(raw);
