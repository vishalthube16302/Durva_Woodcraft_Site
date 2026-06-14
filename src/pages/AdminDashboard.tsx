import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { LogOut, Settings, Package, FolderTree, Image as ImageIcon, ExternalLink, Shield } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { useSettings } from '../hooks/useSettings';
import { getImageUrl } from '../utils/imageUtils';
import SettingsPanel from '../components/admin/SettingsPanel';
import CategoriesPanel from '../components/admin/CategoriesPanel';
import ProductsPanel from '../components/admin/ProductsPanel';
import GalleryPanel from '../components/admin/GalleryPanel';

type Tab = 'settings' | 'categories' | 'products' | 'gallery';

export default function AdminDashboard() {
  const [activeTab, setActiveTab] = useState<Tab>('products');
  const { user, loading: authLoading, signOut } = useAuth();
  const { settings } = useSettings();
  const navigate = useNavigate();

  useEffect(() => {
    if (!authLoading && !user) {
      navigate('/manage-durva-xk92');
    }
  }, [user, authLoading, navigate]);

  const handleSignOut = async () => {
    await signOut();
    navigate('/manage-durva-xk92');
  };

  if (authLoading || !user || !settings) {
    return (
      <div className="min-h-screen bg-royal-bg flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-2 border-royal-border border-t-royal-brown rounded-full animate-spin mx-auto mb-4" />
          <p className="font-body text-royal-navy/60 text-sm">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  const tabs = [
    { id: 'products' as Tab,   name: 'Products',   icon: Package },
    { id: 'categories' as Tab, name: 'Categories', icon: FolderTree },
    { id: 'gallery' as Tab,    name: 'Gallery',    icon: ImageIcon },
    { id: 'settings' as Tab,   name: 'Settings',   icon: Settings },
  ];

  return (
    <div className="min-h-screen bg-royal-surface/40">

      {/* Admin header */}
      <header className="bg-royal-mahogany text-royal-bg shadow-royal-lg sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">

            {/* Logo + brand */}
            <div className="flex items-center gap-4">
              {settings.logo_url && (
                <img src={getImageUrl(settings.logo_url)} alt={settings.brand_name} className="h-9 w-auto" />
              )}
              <div>
                <h1 className="font-display text-lg font-bold text-royal-bg leading-tight">
                  {settings.brand_name}
                </h1>
                <div className="flex items-center gap-1.5 text-xs text-royal-bg/50">
                  <Shield size={10} />
                  Admin Dashboard · Secure
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="flex items-center gap-3">
              <a
                href="/"
                target="_blank"
                rel="noopener noreferrer"
                className="hidden sm:flex items-center gap-2 px-4 py-2 text-sm font-body font-medium text-royal-bg/70 hover:text-royal-bg hover:bg-royal-bg/10 rounded-lg transition-colors"
              >
                <ExternalLink size={14} />
                View Live Site
              </a>
              <button
                onClick={handleSignOut}
                className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-body font-semibold bg-royal-bg/10 hover:bg-royal-bg/20 text-royal-bg transition-colors"
              >
                <LogOut size={15} />
                Sign Out
              </button>
            </div>
          </div>

          {/* Tab bar */}
          <div className="flex gap-1 pb-0 overflow-x-auto">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              const active = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center gap-2 px-5 py-3 text-sm font-body font-semibold border-b-2 transition-all whitespace-nowrap ${
                    active
                      ? 'border-royal-gold text-royal-gold'
                      : 'border-transparent text-royal-bg/50 hover:text-royal-bg/80 hover:border-royal-bg/30'
                  }`}
                >
                  <Icon size={15} />
                  {tab.name}
                </button>
              );
            })}
          </div>
        </div>
      </header>

      {/* Main content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {activeTab === 'settings' && <SettingsPanel />}
        {activeTab === 'categories' && <CategoriesPanel />}
        {activeTab === 'products' && <ProductsPanel />}
        {activeTab === 'gallery' && <GalleryPanel />}
      </main>
    </div>
  );
}
