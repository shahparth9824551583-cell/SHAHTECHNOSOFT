import type { Metadata } from "next";
import Legal from "@/components/Legal";

export const metadata: Metadata = { title: "Terms and Conditions" };

export default function Terms() {
  return (
    <Legal title="Terms and Conditions" sections={[
      ["Course applications", "Submitting the form is an application, not an enrollment. Enrollment is confirmed only after review and payment verification. Course price: ₹299 per course."],
      ["Internship applications", "Internship price: ₹999 per internship. Submitting the form is an application only. Details of each internship are shared when we contact you."],
      ["Payment verification", "Payment instructions are shared separately by SHAH TECHNOSOFT. Never send card details, UPI PIN or passwords. Payment status is updated only after manual verification."],
      ["Cancellation and refunds", "[OWNER TO COMPLETE: write your cancellation and refund rules here.]"],
      ["Completion and certificates", "A completion certificate is issued only when the applicable requirements, stated by SHAH TECHNOSOFT for that course or internship, have actually been met. [OWNER TO COMPLETE: list the requirements.]"],
      ["No guarantee of employment", "We do not guarantee any job, placement, salary or work experience."],
      ["Contact", "Use the details on the Contact page for questions about these terms."],
    ]} />
  );
}
