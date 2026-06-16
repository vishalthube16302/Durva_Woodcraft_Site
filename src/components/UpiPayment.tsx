import { Smartphone, Copy, CheckCircle } from 'lucide-react';
import { useState } from 'react';
import { useSettings } from '../hooks/useSettings';

export default function UpiPayment() {
  const { settings } = useSettings();
  const [copied, setCopied] = useState(false);

  if (!settings) return null;

  // Only show this section if UPI ID is configured
  const upiId = (settings as any).upi_id as string | undefined;
  const upiQr = (settings as any).upi_qr_url as string | undefined;
  const upiName = (settings as any).upi_name as string | undefined;

  if (!upiId && !upiQr) return null;

  const copyUpi = () => {
    if (upiId) {
      navigator.clipboard.writeText(upiId).then(() => {
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      });
    }
  };

  return (
    <div className="bg-royal-surface/50 rounded-2xl border border-royal-border p-6">
      <div className="flex items-center gap-2 mb-4">
        <Smartphone size={18} className="text-royal-brown" />
        <h3 className="font-display text-base font-bold text-royal-mahogany">Pay via UPI</h3>
      </div>

      {upiQr && (
        <div className="flex justify-center mb-4">
          <div className="bg-white p-3 rounded-xl border border-royal-border inline-block">
            <img
              src={upiQr}
              alt="UPI QR Code"
              className="w-40 h-40 object-contain"
            />
          </div>
        </div>
      )}

      {upiId && (
        <button
          onClick={copyUpi}
          className="w-full flex items-center justify-between gap-3 px-4 py-3 bg-royal-bg border border-royal-border rounded-xl hover:border-royal-brown transition-colors group"
        >
          <div className="text-left">
            <p className="font-body text-xs text-royal-navy/50 uppercase tracking-wider mb-0.5">UPI ID</p>
            <p className="font-body text-sm font-semibold text-royal-mahogany">{upiId}</p>
          </div>
          {copied ? (
            <CheckCircle size={18} className="text-green-600 flex-shrink-0" />
          ) : (
            <Copy size={16} className="text-royal-navy/40 group-hover:text-royal-brown flex-shrink-0 transition-colors" />
          )}
        </button>
      )}

      {upiName && (
        <p className="font-body text-xs text-royal-navy/50 text-center mt-3">
          Pay to: <span className="font-semibold text-royal-mahogany">{upiName}</span>
        </p>
      )}

      <div className="mt-4 flex flex-wrap gap-2 justify-center">
        {['PhonePe', 'GPay', 'Paytm', 'BHIM', 'UPI'].map((app) => (
          <span
            key={app}
            className="font-body text-xs px-2.5 py-1 rounded-full bg-royal-bg border border-royal-border text-royal-navy/60"
          >
            {app}
          </span>
        ))}
      </div>
    </div>
  );
}
