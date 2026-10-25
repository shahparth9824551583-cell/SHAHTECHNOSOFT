import type { Metadata } from "next";
import Legal from "@/components/Legal";

export const metadata: Metadata = { title: "Privacy Policy" };

export default function Privacy() {
  return (
    <Legal title="Privacy Policy" sections={[
      ["Information we collect", "When you apply, we collect your name, WhatsApp number, email, state, city, education level, optional college name, the course or internship you chose, and an optional message."],
      ["Why we collect it", "To save and review your application, contact you about it, share payment instructions, verify payment and manage enrollment."],
      ["How it is handled", "Application records are stored in a private database. They are not shown publicly and can be accessed only by authorized administrators of SHAH TECHNOSOFT. We do not ask for card details, UPI PIN or passwords."],
      ["Privacy questions", "To ask about, correct or request removal of your information, contact us using the details on the Contact page."],
      ["Payment verification", "Payments are verified manually by an administrator before payment status is updated."],
      ["Changes", "We may update this policy. The latest version is always on this page."],
    ]} />
  );
}
