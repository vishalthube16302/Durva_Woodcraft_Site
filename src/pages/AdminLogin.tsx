import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { LogIn } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { useSettings } from '../hooks/useSettings';
import { getImageUrl } from '../utils/imageUtils';

export default function AdminLogin() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { signIn, user } = useAuth();
  const { settings } = useSettings();
  const navigate = useNavigate();

  useEffect(() => {
    if (user) {
      navigate('/admin/dashboard');
    }
  }, [user, navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    const { error } = await signIn(email, password);

    if (error) {
      setError(error.message);
      setLoading(false);
    } else {
      navigate('/admin/dashboard');
    }
  };

  if (!settings) return null;

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 via-orange-50 to-yellow-50 flex items-center justify-center px-4">
      <div className="max-w-md w-full">
        <div className="text-center mb-8">
          {settings.logo_url && (
            <img
              src={getImageUrl(settings.logo_url)}
              alt={settings.brand_name}
              className="h-16 w-auto mx-auto mb-4"
            />
          )}
          <h1 className="text-3xl font-bold" style={{ color: settings.primary_color }}>
            {settings.brand_name}
          </h1>
          <p className="text-gray-600 mt-2">Admin Panel</p>
        </div>

        <div className="bg-white rounded-2xl shadow-xl p-8">
          <div className="flex items-center justify-center mb-6">
            <div
              className="w-16 h-16 rounded-full flex items-center justify-center text-white"
              style={{ backgroundColor: settings.primary_color }}
            >
              <LogIn size={32} />
            </div>
          </div>

          <h2 className="text-2xl font-bold text-center mb-6">Sign In</h2>

          {error && (
            <div className="mb-4 p-4 bg-red-50 border border-red-200 text-red-700 rounded-lg">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Email Address
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 transition-all"
                style={{ '--tw-ring-color': settings.primary_color } as React.CSSProperties}
                placeholder="admin@example.com"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Password
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 transition-all"
                style={{ '--tw-ring-color': settings.primary_color } as React.CSSProperties}
                placeholder="••••••••"
                required
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 rounded-lg text-white font-medium transition-all hover:shadow-lg disabled:opacity-50"
              style={{ backgroundColor: settings.primary_color }}
            >
              {loading ? 'Signing in...' : 'Sign In'}
            </button>
          </form>

          <div className="mt-6 text-center">
            <a
              href="/"
              className="text-sm text-gray-600 hover:opacity-70 transition-opacity"
            >
              Back to Website
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
