import { MessageCircle } from "lucide-react";
import { WHATSAPP_LINK } from "@/lib/brand";

export function WhatsAppButton() {
  return (
    <a
      href={WHATSAPP_LINK}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Chat with us on WhatsApp"
      className="fixed bottom-5 right-5 z-50 flex items-center gap-2 rounded-full bg-[#25D366] px-4 py-3 text-sm font-bold text-white shadow-lg transition-transform hover:scale-105 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2"
    >
      <MessageCircle className="h-5 w-5 fill-current" />
      <span className="hidden sm:inline">Chat with us</span>
    </a>
  );
}
