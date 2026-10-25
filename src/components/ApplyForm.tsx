"use client";
import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import { courses } from "@/data/courses";
import { internships } from "@/data/internships";
import { applicationSchema } from "@/lib/validation";
import { EDUCATION, INDIAN_STATES } from "@/lib/constants";
import { inr } from "@/config/site";

type Errors = Record<string, string[] | undefined>;

function Field({ id, label, error, optional, children }: { id: string; label: string; error?: string[]; optional?: boolean; children: React.ReactNode }) {
  return (
    <div>
      <label htmlFor={id} className="mb-1 block text-sm font-medium text-navy">{label}{optional && <span className="font-normal text-slate-500"> (optional)</span>}</label>
      {children}
      {error?.[0] && <p id={`${id}-err`} role="alert" className="mt-1 text-sm text-red-600">{error[0]}</p>}
    </div>
  );
}

export default function ApplyForm({ initialType, initialItem }: { initialType: "course" | "internship"; initialItem: string }) {
  const router = useRouter();
  const [type, setType] = useState(initialType);
  const [item, setItem] = useState(initialItem);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<Errors>({});
  const [formError, setFormError] = useState("");

  const list = type === "course" ? courses : internships;
  const selected = list.find((x) => x.id === item);
  const a = (k: string) => ({ "aria-invalid": Boolean(errors[k]), "aria-describedby": errors[k] ? `${k}-err` : undefined });

  async function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (loading) return;
    setFormError("");
    const f = new FormData(e.currentTarget);
    const g = (k: string) => String(f.get(k) ?? "");
    const data = {
      fullName: g("fullName"), whatsapp: g("whatsapp"), email: g("email"), state: g("state"), city: g("city"),
      educationLevel: g("educationLevel"), collegeName: g("collegeName"), applicationType: type, itemId: item,
      message: g("message"), consent: f.get("consent") === "on", website: g("website"),
    };
    const parsed = applicationSchema.safeParse(data);
    if (!parsed.success) { setErrors(parsed.error.flatten().fieldErrors as Errors); return; }
    setErrors({});
    setLoading(true);
    try {
      const res = await fetch("/api/apply", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(data) });
      const json = await res.json().catch(() => null);
      if (res.ok && json?.ok && json.reference) { router.push(`/apply/success?ref=${encodeURIComponent(json.reference)}`); return; }
      if (json?.fieldErrors) setErrors(json.fieldErrors);
      setFormError(json?.message ?? "Something went wrong. Please try again.");
    } catch {
      setFormError("Network problem. Check your internet connection and try again.");
    }
    setLoading(false);
  }

  return (
    <form onSubmit={onSubmit} noValidate className="space-y-5">
      <fieldset className="grid grid-cols-2 gap-3">
        <legend className="mb-2 text-sm font-medium text-navy">I want to apply for</legend>
        {(["course", "internship"] as const).map((t) => (
          <label key={t} className={`cursor-pointer rounded-lg border p-3 text-center text-sm font-semibold ${type === t ? "border-gold bg-gold/10 text-navy" : "border-slate-300 text-slate-600"}`}>
            <input type="radio" name="type" className="sr-only" checked={type === t} onChange={() => { setType(t); setItem(""); }} />
            {t === "course" ? "A Course" : "An Internship"}
          </label>
        ))}
      </fieldset>

      <Field id="itemId" label={type === "course" ? "Selected course" : "Selected internship"} error={errors.itemId}>
        <select id="itemId" className="input" value={item} onChange={(e) => setItem(e.target.value)} {...a("itemId")}>
          <option value="">Select…</option>
          {list.map((x) => <option key={x.id} value={x.id}>{x.name}</option>)}
        </select>
      </Field>
      {selected && (
        <div className="flex items-center justify-between rounded-xl bg-navy p-4 text-white" aria-live="polite">
          <span className="font-display text-lg">{selected.name}</span>
          <span className="rounded-full bg-gold px-3 py-1 font-bold text-navy-900">{inr(selected.price)}</span>
        </div>
      )}

      <div className="grid gap-4 sm:grid-cols-2">
        <Field id="fullName" label="Full name" error={errors.fullName}><input id="fullName" name="fullName" autoComplete="name" className="input" {...a("fullName")} /></Field>
        <Field id="whatsapp" label="WhatsApp number" error={errors.whatsapp}><input id="whatsapp" name="whatsapp" inputMode="tel" autoComplete="tel" placeholder="10-digit mobile number" className="input" {...a("whatsapp")} /></Field>
        <Field id="email" label="Email address" error={errors.email}><input id="email" name="email" type="email" autoComplete="email" className="input" {...a("email")} /></Field>
        <Field id="educationLevel" label="Education level" error={errors.educationLevel}>
          <select id="educationLevel" name="educationLevel" className="input" defaultValue="" {...a("educationLevel")}><option value="">Select…</option>{EDUCATION.map((x) => <option key={x}>{x}</option>)}</select>
        </Field>
        <Field id="state" label="State" error={errors.state}>
          <select id="state" name="state" className="input" defaultValue="" {...a("state")}><option value="">Select…</option>{INDIAN_STATES.map((x) => <option key={x}>{x}</option>)}</select>
        </Field>
        <Field id="city" label="City" error={errors.city}><input id="city" name="city" autoComplete="address-level2" className="input" {...a("city")} /></Field>
      </div>
      <Field id="collegeName" label="College name" optional error={errors.collegeName}><input id="collegeName" name="collegeName" className="input" /></Field>
      <Field id="message" label="Message" optional error={errors.message}><textarea id="message" name="message" rows={3} maxLength={500} className="input" /></Field>

      <input type="text" name="website" tabIndex={-1} autoComplete="off" aria-hidden="true" className="hidden" />

      <div>
        <label className="flex items-start gap-3 text-sm text-slate-700">
          <input type="checkbox" name="consent" className="mt-1 h-4 w-4 accent-navy" {...a("consent")} />
          <span>I agree that SHAH TECHNOSOFT may contact me on WhatsApp, phone or email about this application.</span>
        </label>
        {errors.consent?.[0] && <p id="consent-err" role="alert" className="mt-1 text-sm text-red-600">{errors.consent[0]}</p>}
      </div>

      {formError && <p role="alert" className="rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-700">{formError}</p>}
      <p className="text-xs text-slate-500">No payment is taken on this form. Payment instructions are shared by SHAH TECHNOSOFT after your application is reviewed. Never share card details, UPI PIN or passwords.</p>
      <button type="submit" disabled={loading} className="btn-gold w-full">{loading ? "Submitting your application…" : "Submit application"}</button>
    </form>
  );
}
