import { Building2, FileText, Award, Truck, Phone, MessageCircle, CheckCircle, Users, Package, Shield } from 'lucide-react';
import { useSettings } from '../hooks/useSettings';

export default function Corporate() {
  const { settings } = useSettings();
  if (!settings) return null;

  const waNumber = (settings.whatsapp_number || settings.phone_numbers?.[0] || '').replace(/\D/g, '');
  const waMsg = encodeURIComponent('Hello Durva Woodcraft, I am interested in a bulk/government/corporate furniture order. Please share details.');

  const capabilities = [
    { icon: Package,   title: 'Bulk Orders',        desc: 'Minimum 5 pieces. Discounted rates for volume. Custom dimensions on all pieces.' },
    { icon: FileText,  title: 'GST Invoice',         desc: 'Formal GST-compliant invoices for all institutional purchases. Full documentation.' },
    { icon: Award,     title: 'MSME Certified',      desc: 'Udyam registered. Eligible for MSME preference under GFR 2017 government procurement.' },
    { icon: Truck,     title: 'Pan-India Delivery',  desc: 'Delivery to government offices, institutions, hospitals, and hotels across India.' },
    { icon: Users,     title: 'Dedicated Support',   desc: 'Assigned contact for institutional orders. Regular updates and delivery tracking.' },
    { icon: Building2, title: 'GeM Portal Supply',  desc: 'Listed on Government e-Marketplace. Direct procurement by government departments.' },
  ];

  const sectors = [
    'Government Offices & Ministries',
    'Educational Institutions (Schools, Colleges)',
    'Hospitals & Healthcare Facilities',
    'Hotels & Hospitality',
    'Corporate Offices',
    'Co-working Spaces',
    'Retail & Showroom Fit-outs',
    'Festival & Event Furniture',
  ];

  const productCategories = [
    { name: 'Office Furniture',  items: 'Desks, Chairs, Cabinets, Conference Tables' },
    { name: 'Institutional',     items: 'Benches, Study Tables, Library Shelving' },
    { name: 'Hospitality',       items: 'Restaurant Tables, Hotel Beds, Reception Desks' },
    { name: 'Corporate Gifting', items: 'Wooden Pen Stands, Photo Frames, Decor Pieces' },
  ];

  // Only show credentials that are filled in DB
  const credRows = [
    settings.msme_number   && { label: 'MSME / Udyam Registered', value: settings.msme_number,   note: 'Eligible for govt. purchase preference (GFR 2017)' },
    settings.gst_number    && { label: 'GST Registration Number',  value: settings.gst_number,    note: 'Valid for B2B invoicing across India' },
    settings.gem_seller_id && { label: 'GeM Seller ID',            value: settings.gem_seller_id, note: 'Government e-Marketplace listed' },
  ].filter(Boolean) as { label: string; value: string; note: string }[];

  const colCount = credRows.length === 1 ? 'grid-cols-1 max-w-xs mx-auto' : credRows.length === 2 ? 'sm:grid-cols-2' : 'sm:grid-cols-3';

  return (
    <section id="corporate" className="py-20 bg-royal-bg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        <div className="text-center mb-14">
          <p className="font-body text-royal-brown font-semibold text-xs uppercase tracking-widest mb-3">Institutional & Corporate</p>
          <h2 className="font-display text-3xl sm:text-4xl font-bold text-royal-mahogany mb-4">Government & Bulk Orders</h2>
          <p className="font-body text-royal-navy/60 max-w-2xl mx-auto leading-relaxed">
            Durva Woodcraft is MSME registered and fully equipped to supply quality handcrafted wooden furniture
            to government departments, educational institutions, hotels, and corporates across India.
          </p>
          <hr className="royal-divider w-20 mx-auto mt-6" />
        </div>

        {/* Credentials — only rendered when DB has values */}
        {credRows.length > 0 && (
          <div className="bg-royal-navy rounded-2xl p-6 mb-14">
            <div className={`grid gap-6 text-center ${colCount}`}>
              {credRows.map(({ label, value, note }) => (
                <div key={label} className="py-2">
                  <p className="font-body text-xs text-royal-bg/50 uppercase tracking-widest mb-1">{label}</p>
                  <p className="font-display text-lg font-bold text-royal-gold">{value}</p>
                  <p className="font-body text-xs text-royal-bg/40 mt-1">{note}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-14">
          {capabilities.map(({ icon: Icon, title, desc }) => (
            <div key={title} className="bg-royal-surface/50 rounded-2xl p-6 border border-royal-border hover:shadow-royal-md transition-shadow">
              <div className="w-11 h-11 rounded-xl bg-royal-mahogany flex items-center justify-center mb-4">
                <Icon size={20} className="text-royal-bg" />
              </div>
              <h3 className="font-display text-base font-bold text-royal-mahogany mb-2">{title}</h3>
              <p className="font-body text-sm text-royal-navy/60 leading-relaxed">{desc}</p>
            </div>
          ))}
        </div>

        <div className="grid lg:grid-cols-2 gap-10 mb-14">
          <div className="bg-royal-bg rounded-2xl p-8 border border-royal-border">
            <h3 className="font-display text-xl font-bold text-royal-mahogany mb-6">Sectors We Serve</h3>
            <ul className="space-y-3">
              {sectors.map(s => (
                <li key={s} className="flex items-start gap-2.5 font-body text-sm text-royal-navy/70">
                  <CheckCircle size={15} className="text-royal-gold mt-0.5 flex-shrink-0" />{s}
                </li>
              ))}
            </ul>
          </div>
          <div className="bg-royal-bg rounded-2xl p-8 border border-royal-border">
            <h3 className="font-display text-xl font-bold text-royal-mahogany mb-6">Product Categories</h3>
            <div className="space-y-4">
              {productCategories.map(({ name, items }) => (
                <div key={name} className="pb-4 border-b border-royal-border last:border-0">
                  <p className="font-body text-sm font-semibold text-royal-mahogany mb-1">{name}</p>
                  <p className="font-body text-sm text-royal-navy/60">{items}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="bg-royal-surface rounded-2xl p-10 border border-royal-border text-center">
          <Shield size={36} className="text-royal-gold mx-auto mb-4" />
          <h3 className="font-display text-2xl font-bold text-royal-mahogany mb-3">
            Ready to Place a Bulk or Government Order?
          </h3>
          <p className="font-body text-royal-navy/60 mb-2 max-w-lg mx-auto leading-relaxed">
            Share your requirement and we'll provide a detailed quotation with timeline, GST breakdown,
            and delivery schedule within 24 hours.
          </p>
          {settings.msme_number && (
            <p className="font-body text-xs text-royal-brown font-semibold mb-8">
              MSME Registered · {settings.msme_number}
            </p>
          )}
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a href="/government-supply"
              className="flex items-center justify-center gap-2 px-8 py-3.5 rounded-full font-semibold font-body border-2 border-royal-mahogany text-royal-mahogany hover:bg-royal-mahogany hover:text-royal-bg transition-all">
              <Building2 size={18} />View Procurement Details
            </a>
            {waNumber && (
              <a href={`https://wa.me/${waNumber}?text=${waMsg}`} target="_blank" rel="noopener noreferrer"
                className="flex items-center justify-center gap-2 px-8 py-3.5 rounded-full font-semibold font-body text-white transition-all hover:opacity-90 hover:shadow-lg"
                style={{ backgroundColor: '#25D366' }}>
                <MessageCircle size={18} />WhatsApp for Bulk Enquiry
              </a>
            )}
            {settings.phone_numbers?.[0] && (
              <a href={`tel:${settings.phone_numbers[0]}`}
                className="flex items-center justify-center gap-2 px-8 py-3.5 rounded-full font-semibold font-body border-2 border-royal-mahogany text-royal-mahogany hover:bg-royal-mahogany hover:text-royal-bg transition-all">
                <Phone size={18} />Call Us Directly
              </a>
            )}
          </div>
        </div>

      </div>
    </section>
  );
}
