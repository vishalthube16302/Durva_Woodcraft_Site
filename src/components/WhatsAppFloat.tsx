import { MessageCircle } from 'lucide-react';
import { useSettings } from '../hooks/useSettings';

export default function WhatsAppFloat() {
  const { settings } = useSettings();
  const waNumber = settings?.phone_numbers?.[0]?.replace(/\D/g, '') || '';

  return (
    <a
      href={`https://wa.me/${waNumber}?text=Hello%20Durva%20Woodcraft%2C%20I%27m%20interested%20in%20your%20handmade%20furniture.`}
      target="_blank"
      rel="noopener noreferrer"
      className="wa-float"
      aria-label="Chat on WhatsApp"
      title="Chat with us on WhatsApp"
    >
      <MessageCircle size={28} color="#ffffff" fill="#ffffff" />
    </a>
  );
}
