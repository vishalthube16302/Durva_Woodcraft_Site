import { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabase';
import { MessageCircle, Package, RefreshCw, Phone, Mail, Clock, CheckCircle, XCircle } from 'lucide-react';

type Tab = 'inquiries' | 'custom_orders';

interface Inquiry {
  id: string; name: string; phone: string; email: string | null;
  message: string | null; source: string; status: string; created_at: string;
}
interface CustomOrder {
  id: string; name: string; phone: string; email: string | null;
  furniture_type: string | null; wood_type: string | null; finish: string | null;
  dimensions: string | null; budget_range: string | null; notes: string | null;
  status: string; created_at: string;
}

export default function InquiriesPanel() {
  const [tab, setTab]               = useState<Tab>('inquiries');
  const [inquiries, setInquiries]   = useState<Inquiry[]>([]);
  const [orders, setOrders]         = useState<CustomOrder[]>([]);
  const [loading, setLoading]       = useState(true);

  const fetchData = async () => {
    setLoading(true);
    const [{ data: inq }, { data: ord }] = await Promise.all([
      supabase.from('inquiries').select('*').order('created_at', { ascending: false }).limit(50),
      supabase.from('custom_orders').select('*').order('created_at', { ascending: false }).limit(50),
    ]);
    setInquiries(inq || []);
    setOrders(ord || []);
    setLoading(false);
  };

  useEffect(() => { fetchData(); }, []);

  const updateStatus = async (table: 'inquiries' | 'custom_orders', id: string, status: string) => {
    await supabase.from(table).update({ status }).eq('id', id);
    fetchData();
  };

  const fmt = (d: string) => new Date(d).toLocaleString('en-IN', { day: '2-digit', month: 'short', hour: '2-digit', minute: '2-digit' });

  const StatusBadge = ({ status }: { status: string }) => {
    const map: Record<string, string> = {
      new: 'bg-blue-50 text-blue-700 border-blue-200',
      contacted: 'bg-yellow-50 text-yellow-700 border-yellow-200',
      completed: 'bg-green-50 text-green-700 border-green-200',
      cancelled: 'bg-red-50 text-red-700 border-red-200',
    };
    return (
      <span className={`font-body text-xs px-2.5 py-1 rounded-full border font-semibold capitalize ${map[status] || 'bg-gray-50 text-gray-700 border-gray-200'}`}>
        {status}
      </span>
    );
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="font-display text-2xl font-bold text-royal-mahogany">Inquiries & Orders</h2>
          <p className="font-body text-sm text-royal-navy/50 mt-1">
            {inquiries.length} inquiries · {orders.length} custom orders
          </p>
        </div>
        <button onClick={fetchData}
          className="flex items-center gap-2 px-4 py-2 rounded-xl border border-royal-border text-royal-navy/60 hover:text-royal-mahogany hover:border-royal-brown transition-all font-body text-sm">
          <RefreshCw size={14} className={loading ? 'animate-spin' : ''} />
          Refresh
        </button>
      </div>

      {/* Tab switcher */}
      <div className="flex gap-1 bg-royal-surface rounded-xl p-1 w-fit">
        {[
          { id: 'inquiries' as Tab,    icon: MessageCircle, label: `Contact (${inquiries.length})` },
          { id: 'custom_orders' as Tab, icon: Package,      label: `Custom Orders (${orders.length})` },
        ].map(({ id, icon: Icon, label }) => (
          <button key={id} onClick={() => setTab(id)}
            className={`flex items-center gap-2 px-5 py-2.5 rounded-lg font-body text-sm font-semibold transition-all ${
              tab === id ? 'bg-royal-bg shadow-royal-sm text-royal-mahogany' : 'text-royal-navy/50 hover:text-royal-navy/80'
            }`}>
            <Icon size={15} />{label}
          </button>
        ))}
      </div>

      {/* Inquiries list */}
      {tab === 'inquiries' && (
        <div className="space-y-3">
          {inquiries.length === 0 ? (
            <div className="text-center py-16 text-royal-navy/40 font-body">No inquiries yet.</div>
          ) : inquiries.map(inq => (
            <div key={inq.id} className="bg-royal-bg rounded-2xl border border-royal-border p-5 hover:shadow-royal-sm transition-shadow">
              <div className="flex items-start justify-between gap-4 mb-3">
                <div>
                  <h3 className="font-display text-base font-bold text-royal-mahogany">{inq.name}</h3>
                  <div className="flex flex-wrap gap-3 mt-1">
                    <a href={`tel:${inq.phone}`} className="flex items-center gap-1 font-body text-xs text-royal-brown hover:text-royal-mahogany">
                      <Phone size={11} />{inq.phone}
                    </a>
                    {inq.email && (
                      <a href={`mailto:${inq.email}`} className="flex items-center gap-1 font-body text-xs text-royal-brown hover:text-royal-mahogany">
                        <Mail size={11} />{inq.email}
                      </a>
                    )}
                    <span className="flex items-center gap-1 font-body text-xs text-royal-navy/40">
                      <Clock size={11} />{fmt(inq.created_at)}
                    </span>
                  </div>
                </div>
                <StatusBadge status={inq.status} />
              </div>
              {inq.message && (
                <p className="font-body text-sm text-royal-navy/70 bg-royal-surface rounded-xl px-4 py-3 mb-3">{inq.message}</p>
              )}
              <div className="flex gap-2 flex-wrap">
                {['new', 'contacted', 'completed', 'cancelled'].map(s => (
                  <button key={s} onClick={() => updateStatus('inquiries', inq.id, s)}
                    disabled={inq.status === s}
                    className={`font-body text-xs px-3 py-1.5 rounded-lg border transition-all disabled:opacity-40 disabled:cursor-default ${
                      inq.status === s ? 'border-royal-brown bg-royal-surface text-royal-brown' : 'border-royal-border hover:border-royal-brown text-royal-navy/60 hover:text-royal-mahogany'
                    }`}>
                    {s}
                  </button>
                ))}
                <a href={`https://wa.me/${inq.phone.replace(/\D/g,'')}?text=Hello%20${encodeURIComponent(inq.name)}%2C%20thank%20you%20for%20contacting%20Durva%20Woodcraft!`}
                  target="_blank" rel="noopener noreferrer"
                  className="flex items-center gap-1 font-body text-xs px-3 py-1.5 rounded-lg border border-green-300 text-green-700 hover:bg-green-50 transition-all">
                  <MessageCircle size={11} /> Reply on WhatsApp
                </a>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Custom orders list */}
      {tab === 'custom_orders' && (
        <div className="space-y-3">
          {orders.length === 0 ? (
            <div className="text-center py-16 text-royal-navy/40 font-body">No custom orders yet.</div>
          ) : orders.map(ord => (
            <div key={ord.id} className="bg-royal-bg rounded-2xl border border-royal-border p-5 hover:shadow-royal-sm transition-shadow">
              <div className="flex items-start justify-between gap-4 mb-3">
                <div>
                  <h3 className="font-display text-base font-bold text-royal-mahogany">{ord.name}</h3>
                  <div className="flex flex-wrap gap-3 mt-1">
                    <a href={`tel:${ord.phone}`} className="flex items-center gap-1 font-body text-xs text-royal-brown hover:text-royal-mahogany">
                      <Phone size={11} />{ord.phone}
                    </a>
                    {ord.email && (
                      <a href={`mailto:${ord.email}`} className="flex items-center gap-1 font-body text-xs text-royal-brown hover:text-royal-mahogany">
                        <Mail size={11} />{ord.email}
                      </a>
                    )}
                    <span className="flex items-center gap-1 font-body text-xs text-royal-navy/40">
                      <Clock size={11} />{fmt(ord.created_at)}
                    </span>
                  </div>
                </div>
                <StatusBadge status={ord.status} />
              </div>
              {/* Order details grid */}
              <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-3 mb-3">
                {[
                  { label: 'Furniture', value: ord.furniture_type },
                  { label: 'Wood',      value: ord.wood_type },
                  { label: 'Finish',    value: ord.finish },
                  { label: 'Budget',    value: ord.budget_range },
                ].filter(i => i.value).map(({ label, value }) => (
                  <div key={label} className="bg-royal-surface rounded-xl px-3 py-2">
                    <p className="font-body text-xs text-royal-navy/40 uppercase tracking-wide">{label}</p>
                    <p className="font-body text-sm text-royal-mahogany font-semibold mt-0.5">{value}</p>
                  </div>
                ))}
              </div>
              {ord.dimensions && (
                <p className="font-body text-xs text-royal-navy/60 mb-2">📐 Dimensions: {ord.dimensions}</p>
              )}
              {ord.notes && (
                <p className="font-body text-sm text-royal-navy/70 bg-royal-surface rounded-xl px-4 py-3 mb-3">{ord.notes}</p>
              )}
              <div className="flex gap-2 flex-wrap">
                {['new', 'contacted', 'quoted', 'in_progress', 'completed', 'cancelled'].map(s => (
                  <button key={s} onClick={() => updateStatus('custom_orders', ord.id, s)}
                    disabled={ord.status === s}
                    className={`font-body text-xs px-3 py-1.5 rounded-lg border transition-all disabled:opacity-40 disabled:cursor-default ${
                      ord.status === s ? 'border-royal-brown bg-royal-surface text-royal-brown' : 'border-royal-border hover:border-royal-brown text-royal-navy/60 hover:text-royal-mahogany'
                    }`}>
                    {s.replace('_', ' ')}
                  </button>
                ))}
                <a href={`https://wa.me/${ord.phone.replace(/\D/g,'')}?text=Hello%20${encodeURIComponent(ord.name)}%2C%20regarding%20your%20custom%20furniture%20order%20at%20Durva%20Woodcraft!`}
                  target="_blank" rel="noopener noreferrer"
                  className="flex items-center gap-1 font-body text-xs px-3 py-1.5 rounded-lg border border-green-300 text-green-700 hover:bg-green-50 transition-all">
                  <MessageCircle size={11} /> Reply on WhatsApp
                </a>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
