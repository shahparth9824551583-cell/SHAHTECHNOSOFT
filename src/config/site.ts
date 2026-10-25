/**
 * CENTRAL WEBSITE CONFIGURATION
 * Replace every value that contains YOUR_ or XXXX with your real details.
 * Nothing here is invented: these are placeholders until you fill them.
 */
export const site = {
  name: "SHAH TECHNOSOFT",
  tagline: "LEARN | GROW | BUILD YOUR FUTURE",
  url: process.env.NEXT_PUBLIC_SITE_URL ?? "https://shahtechnosoft.vercel.app",

  coursePrice: 299,
  internshipPrice: 999,

  // >>> REPLACE THESE <<<
  email: "shahparth9824551583@gmail.com",
  whatsappNumber: "919824551583", // international format: 91 + 10 digits, no + or spaces
  instagramUrl: "https://www.instagram.com/shahtechnosoft/",
  // TODO(owner): paste your exact channel URL, e.g. https://www.youtube.com/@yourhandle . Not verified yet, so left empty;
  // while empty, the YouTube icon is hidden instead of linking to a wrong page.
  youtubeUrl: "",
  address: "", // leave empty to hide. Add your real address only if you want to show it.

  emailSubject: "Inquiry for SHAH TECHNOSOFT",
  emailBody: "Hello SHAH TECHNOSOFT, I want to know more about your courses and internships.",
  whatsappMessage: "Hello SHAH TECHNOSOFT, I want to know more about your courses and internships.",
} as const;

export const whatsappLink = () =>
  `https://wa.me/${site.whatsappNumber.replace(/\D/g, "")}?text=${encodeURIComponent(site.whatsappMessage)}`;

export const mailtoLink = () =>
  `mailto:${site.email}?subject=${encodeURIComponent(site.emailSubject)}&body=${encodeURIComponent(site.emailBody)}`;

export const siteConfig = site;

export const inr = (n: number) => `₹${n.toLocaleString("en-IN")}`;
