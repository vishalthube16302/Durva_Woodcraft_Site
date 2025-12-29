import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { LogOut, Settings, Package, FolderTree, Image as ImageIcon } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { useSettings } from '../hooks/useSettings';
import { getImageUrl } from '../utils/imageUtils';
import SettingsPanel from '../components/admin/SettingsPanel';
import CategoriesPanel from '../components/admin/CategoriesPanel';
import ProductsPanel from '../components/admin/ProductsPanel';
import GalleryPanel from '../components/admin/GalleryPanel';

type Tab = 'settings' | 'categories' | 'products' | 'gallery';

export default function AdminDashboard() {
  const [activeTab, setActiveTab] = useState<Tab>('settings');
  const { user, loading: authLoading, signOut } = useAuth();
  const { settings } = useSettings();
  const navigate = useNavigate();

  useEffect(() => {
    if (!authLoading && !user) {
      navigate('/admin');
    }
  }, [user, authLoading, navigate]);

  const handleSignOut = async () => {
    await signOut();
    navigate('/admin');
  };

  if (authLoading || !user || !settings) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">Loading...</div>
      </div>
    );
  }

  const tabs = [
    { id: 'settings' as Tab, name: 'Settings', icon: Settings },
    { id: 'categories' as Tab, name: 'Categories', icon: FolderTree },
    { id: 'products' as Tab, name: 'Products', icon: Package },
    { id: 'gallery' as Tab, name: 'Images', icon: ImageIcon },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center space-x-4">
              {settings.logo_url && (
                <img
                  src={getImageUrl(settings.logo_url)}
                  alt={settings.brand_name}
                  className="h-10 w-auto"
                />
              )}
              <div>
                <h1 className="text-2xl font-bold" style={{ color: settings.primary_color }}>
                  {settings.brand_name}
                </h1>
                <p className="text-sm text-gray-600">Admin Dashboard</p>
              </div>
            </div>

            <div className="flex items-center space-x-4">
              <a
                href="/"
                target="_blank"
                rel="noopener noreferrer"
                className="px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 rounded-lg transition-colors"
              >
                View Website
              </a>
              <button
                onClick={handleSignOut}
                className="flex items-center space-x-2 px-4 py-2 rounded-lg text-white transition-all hover:shadow-lg"
                style={{ backgroundColor: settings.primary_color }}
              >
                <LogOut size={18} />
                <span>Sign Out</span>
              </button>
            </div>
          </div>

          <div className="flex space-x-2 overflow-x-auto">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center space-x-2 px-6 py-3 font-medium transition-all border-b-2 ${activeTab === tab.id
                    ? 'text-white'
                    : 'border-transparent text-gray-600 hover:text-gray-900'
                    }`}
                  style={
                    activeTab === tab.id
                      ? {
                        backgroundColor: settings.primary_color,
                        borderColor: settings.primary_color,
                      }
                      : {}
                  }
                >
                  <Icon size={18} />
                  <span>{tab.name}</span>
                </button>
              );
            })}
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {activeTab === 'settings' && <SettingsPanel />}
        {activeTab === 'categories' && <CategoriesPanel />}
        {activeTab === 'products' && <ProductsPanel />}
        {activeTab === 'gallery' && <GalleryPanel />}
      </main>
    </div>
  );
}
