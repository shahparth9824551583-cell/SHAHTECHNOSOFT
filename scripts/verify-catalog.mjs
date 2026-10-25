import { readFileSync } from "node:fs";
const raw = JSON.parse(readFileSync(new URL("../src/data/courses.json", import.meta.url), "utf8"));
const names = Object.values(raw).flat();
const dupes = names.filter((n, i) => names.indexOf(n) !== i);
console.log("Categories:", Object.keys(raw).length);
console.log("Courses:", names.length);
console.log("Duplicates:", dupes.length ? dupes : "none");
if (dupes.length) process.exit(1);
