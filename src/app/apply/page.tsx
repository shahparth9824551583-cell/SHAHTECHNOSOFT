import type { Metadata } from "next";
import PageHero from "@/components/PageHero";
import ApplyForm from "@/components/ApplyForm";
import { findItem } from "@/lib/catalog";

export const metadata: Metadata = { title: "Apply Now" };

export default async function Apply({ searchParams }: { searchParams: Promise<{ type?: string; item?: string }> }) {
  const sp = await searchParams;
  const type = sp.type === "internship" ? "internship" : "course";
  const item = sp.item && findItem(type, sp.item) ? sp.item : "";
  return (
    <>
      <PageHero title="Apply Now">Fill the form. No payment is taken here.</PageHero>
      <div className="container-x max-w-2xl py-10"><div className="card"><ApplyForm initialType={type} initialItem={item} /></div></div>
    </>
  );
}
