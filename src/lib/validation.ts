import { z } from "zod";
import { EDUCATION, INDIAN_STATES } from "./constants";

export const applicationSchema = z.object({
  fullName: z.string().trim().min(2, "Enter your full name").max(80, "Name is too long"),
  whatsapp: z
    .string()
    .transform((s) => s.replace(/[\s-]/g, ""))
    .pipe(z.string().regex(/^(\+91|91|0)?[6-9]\d{9}$/, "Enter a valid 10-digit Indian mobile number"))
    .transform((s) => s.slice(-10)),
  email: z.string().trim().toLowerCase().email("Enter a valid email address").max(120),
  state: z.enum(INDIAN_STATES, { errorMap: () => ({ message: "Select your state" }) }),
  city: z.string().trim().min(2, "Enter your city").max(60),
  educationLevel: z.enum(EDUCATION, { errorMap: () => ({ message: "Select your education level" }) }),
  collegeName: z.string().trim().max(120).optional().default(""),
  applicationType: z.enum(["course", "internship"]),
  itemId: z.string().min(1, "Select a course or internship").max(100),
  message: z.string().trim().max(500, "Maximum 500 characters").optional().default(""),
  consent: z.boolean().refine((v) => v === true, { message: "Please allow us to contact you about your application" }),
  website: z.string().max(0).optional(), // honeypot: real users leave it empty
});
