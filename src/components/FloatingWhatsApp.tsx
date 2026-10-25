import { icons } from "./SocialLinks";
import { whatsappLink } from "@/config/site";

/** Floating chat button. Opens WhatsApp with a prefilled message; the visitor must press Send. */
export default function FloatingWhatsApp() {
  return (
    <a href={whatsappLink()} target="_blank" rel="noopener noreferrer" aria-label="Chat with SHAH TECHNOSOFT on WhatsApp (opens in a new tab)"
      className="fixed bottom-5 right-5 z-50 flex h-14 w-14 items-center justify-center rounded-full bg-[#25D366] text-white shadow-lg transition hover:scale-110 [&_svg]:h-7 [&_svg]:w-7">
      {icons.WhatsApp}
    </a>
  );
}
