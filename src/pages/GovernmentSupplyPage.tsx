import { ArrowLeft, Award, FileText, Shield, Building2, CheckCircle, Phone, MessageCircle, Download, Landmark } from 'lucide-react';
import { Link } from 'react-router-dom';
import Header from '../components/Header';
import Footer from '../components/Footer';
import WhatsAppFloat from '../components/WhatsAppFloat';
import { useSettings } from '../hooks/useSettings';

export default function GovernmentSupplyPage() {
  const { settings } = useSettings();
  if (!settings) return null;

  const waNumber = (settings.whatsapp_number || settings.phone_numbers?.[0] || '').replace(/\D/g, '');
  const waMsg = encodeURIComponent(
    'Hello Durva Woodcraft, I am from a government department/institution and would like to discuss a furniture supply requirement. Please share your tender documentation and rate card.'
  );

  const credentials = [
    settings.msme_number && {
      icon: Award,
      label: 'MSME / Udyam Registration',
      value: settings.msme_number,
      note: 'Eligible for purchase preference under General Financial Rules (GFR) 2017',
    },
    settings.gst_number && {
      icon: FileText,
      label: 'GST Registration',
      value: settings.gst_number,
      note: 'Valid for B2B and institutional invoicing across India',
    },
    settings.gem_seller_id && {
      icon: Landmark,
      label: 'GeM Seller ID',
      value: settings.gem_seller_id,
      note: 'Registered seller on Government e-Marketplace',
    },
  ].filter(Boolean) as { icon: any; label: string; value: string; note: string }[];

  const procurementSteps = [
    { step: '1', title: 'Share Requirement', desc: 'Send your tender document, BOQ, or furniture list via WhatsApp or email with quantities and specifications.' },
    { step: '2', title: 'Site Assessment', desc: 'For large orders, our team can visit or do a video walkthrough to confirm exact requirements and measurements.' },
    { step: '3', title: 'Formal Quotation', desc: 'We send a detailed quotation with per-unit pricing, GST breakup, delivery timeline, and payment terms within 48 hours.' },
    { step: '4', title: 'Purchase Order', desc: 'On confirmation, work begins in our Nashik workshop. Regular progress updates shared with your nodal officer.' },
    { step: '5', title: 'Delivery & Installation', desc: 'Furniture delivered and installed at your premises. GST invoice and warranty card provided on completion.' },
  ];

  const eligibilityPoints = [
    'Registered MSME under Udyam — eligible for price preference as per Public Procurement Policy for MSEs',
    'Can issue GST-compliant tax invoices for all institutional and government purchases',
    'Capable of fulfilling bulk orders with standardized specifications across multiple units',
    'Located in Maharashtra — suitable for state government departments and PSUs under "Make in Maharashtra" preference',
    'No minimum order value — both small department requirements and large institutional tenders accepted',
  ];

  const supplyCategories = [
    { name: 'Office Furniture', items: ['Executive desks', 'Visitor chairs', 'Conference tables', 'Filing cabinets', 'Reception counters'] },
    { name: 'Institutional Furniture', items: ['Classroom desks & benches', 'Library shelving', 'Hostel cots', 'Common room seating'] },
    { name: 'Healthcare Furniture', items: ['Waiting area benches', 'Reception desks', 'Storage cabinets', 'Wooden partitions'] },
    { name: 'Public Spaces', items: ['Park benches', 'Information counters', 'Notice boards', 'Custom signage'] },
  ];

  return (
    <div className="min-h-screen bg-royal-bg">
      <Header />
      <main className="pt-32 pb-20">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">

          <Link
            to="/"
            className="inline-flex items-center gap-2 font-body text-sm text-royal-navy/50 hover:text-royal-brown transition-colors mb-8"
          >
            <ArrowLeft size={14} /> Back to Home
          </Link>

          {/* Header */}
          <div className="text-center mb-14">
            <div className="inline-flex items-center gap-2 bg-royal-navy text-royal-bg px-4 py-1.5 rounded-full text-xs font-body font-semibold uppercase tracking-wider mb-5">
              <Building2 size={13} /> Government & Institutional Supply
            </div>
            <h1 className="font-display text-3xl sm:text-4xl font-bold text-royal-mahogany mb-4">
              Furniture Supply for Government Departments & Institutions
            </h1>
            <p className="font-body text-royal-navy/60 max-w-2xl mx-auto leading-relaxed">
              Durva Woodcraft is an MSME-registered manufacturer in Nashik, Maharashtra, supplying handcrafted
              wooden furniture to government offices, educational institutions, hospitals, and PSUs across India.
            </p>
            <hr className="royal-divider w-20 mx-auto mt-6" />
          </div>

          {/* Credentials strip */}
          {credentials.length > 0 && (
            <div className="bg-royal-navy rounded-2xl p-8 mb-14">
              <div className={`grid gap-6 text-center ${credentials.length === 1 ? 'grid-cols-1 max-w-xs mx-auto' : credentials.length === 2 ? 'sm:grid-cols-2' : 'sm:grid-cols-3'}`}>
                {credentials.map(({ icon: Icon, label, value, note }) => (
                  <div key={label} className="py-2">
                    <Icon size={22} className="text-royal-gold mx-auto mb-2" />
                    <p className="font-body text-xs text-royal-bg/50 uppercase tracking-widest mb-1">{label}</p>
                    <p className="font-display text-lg font-bold text-royal-gold mb-1">{value}</p>
                    <p className="font-body text-xs text-royal-bg/40">{note}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Eligibility */}
          <div className="bg-royal-surface/40 rounded-2xl p-8 border border-royal-border mb-14">
            <div className="flex items-center gap-2 mb-6">
              <Shield size={20} className="text-royal-brown" />
              <h2 className="font-display text-xl font-bold text-royal-mahogany">Procurement Eligibility</h2>
            </div>
            <ul className="space-y-3">
              {eligibilityPoints.map((point) => (
                <li key={point} className="flex items-start gap-2.5 font-body text-sm text-royal-navy/70">
                  <CheckCircle size={15} className="text-royal-gold mt-0.5 flex-shrink-0" />
                  {point}
                </li>
              ))}
            </ul>
          </div>

          {/* Procurement process */}
          <div className="mb-14">
            <h2 className="font-display text-xl font-bold text-royal-mahogany mb-8 text-center">
              How Institutional Procurement Works
            </h2>
            <div className="space-y-4">
              {procurementSteps.map(({ step, title, desc }) => (
                <div key={step} className="flex gap-4 bg-royal-bg border border-royal-border rounded-xl p-5">
                  <div className="w-9 h-9 rounded-full bg-royal-mahogany flex items-center justify-center flex-shrink-0">
                    <span className="font-display text-sm font-bold text-royal-bg">{step}</span>
                  </div>
                  <div>
                    <h3 className="font-display text-base font-bold text-royal-mahogany mb-1">{title}</h3>
                    <p className="font-body text-sm text-royal-navy/60 leading-relaxed">{desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Supply categories */}
          <div className="mb-14">
            <h2 className="font-display text-xl font-bold text-royal-mahogany mb-8 text-center">
              Furniture Categories We Supply
            </h2>
            <div className="grid sm:grid-cols-2 gap-6">
              {supplyCategories.map(({ name, items }) => (
                <div key={name} className="bg-royal-surface/40 rounded-2xl p-6 border border-royal-border">
                  <h3 className="font-display text-base font-bold text-royal-mahogany mb-3">{name}</h3>
                  <ul className="space-y-1.5">
                    {items.map((item) => (
                      <li key={item} className="font-body text-sm text-royal-navy/60 flex items-center gap-2">
                        <span className="w-1 h-1 rounded-full bg-royal-gold flex-shrink-0" />
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>

          {/* Documents note */}
          <div className="bg-royal-surface/30 rounded-2xl p-6 border border-royal-border mb-14 flex items-start gap-4">
            <FileText size={24} className="text-royal-brown flex-shrink-0 mt-1" />
            <div>
              <h3 className="font-display text-base font-bold text-royal-mahogany mb-1">Documentation on Request</h3>
              <p className="font-body text-sm text-royal-navy/60 leading-relaxed">
                Udyam certificate, GST registration certificate, PAN, bank details, and past supply references
                can be shared directly with your procurement officer upon request via WhatsApp or email.
              </p>
            </div>
          </div>

          {/* CTA */}
          <div className="bg-royal-navy rounded-2xl p-10 text-center">
            <h2 className="font-display text-2xl font-bold text-royal-bg mb-3">
              Have a Tender or Bulk Requirement?
            </h2>
            <p className="font-body text-royal-bg/70 mb-8 max-w-lg mx-auto leading-relaxed">
              Share your requirement document and our team will respond with a formal quotation,
              delivery timeline, and documentation within 24–48 hours.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              {waNumber && (
                <a
                  href={`https://wa.me/${waNumber}?text=${waMsg}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-center gap-2 px-8 py-3.5 rounded-full font-semibold font-body text-white transition-all hover:opacity-90"
                  style={{ backgroundColor: '#25D366' }}
                >
                  <MessageCircle size={18} /> WhatsApp Procurement Team
                </a>
              )}
              {settings.phone_numbers?.[0] && (
                <a
                  href={`tel:${settings.phone_numbers[0]}`}
                  className="flex items-center justify-center gap-2 px-8 py-3.5 rounded-full font-semibold font-body border-2 border-royal-gold text-royal-gold hover:bg-royal-gold hover:text-royal-navy transition-all"
                >
                  <Phone size={18} /> Call Directly
                </a>
              )}
              {settings.email && (
                <a
                  href={`mailto:${settings.email}?subject=Government%2FInstitutional%20Furniture%20Requirement`}
                  className="flex items-center justify-center gap-2 px-8 py-3.5 rounded-full font-semibold font-body border-2 border-royal-bg/30 text-royal-bg/80 hover:bg-royal-bg/10 transition-all"
                >
                  <Download size={18} /> Email Requirement
                </a>
              )}
            </div>
          </div>
        </div>
      </main>
      <Footer />
      <WhatsAppFloat />
    </div>
  );
}
