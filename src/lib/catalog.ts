import { courses } from "@/data/courses";
import { internships } from "@/data/internships";

export type AppType = "course" | "internship";

/** Server-trusted lookup: price always comes from here, never from the browser. */
export function findItem(type: AppType, id: string): { name: string; price: number } | null {
  const item = (type === "course" ? courses : internships).find((x) => x.id === id);
  return item ? { name: item.name, price: item.price } : null;
}
