import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { LogIn, Shield, Eye, EyeOff } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { useSettings } from '../hooks/useSettings';
import { getImageUrl } from '../utils/imageUtils';

export default function AdminLogin() {
  const [email, setEmail]       = useState('');
  const [password, setPassword] = useState('');
  const [showPwd, setShowPwd]   = useState(false);
  const [error, setError]       = useState('');
  const [loading, setLoading]   = useState(false);
  const { signIn, user }        = useAuth();
  const { settings }            = useSettings();
  const navigate                = useNavigate();

  useEffect(() => {
    if (user) navigate('/manage-durva-xk92/dashboard');
  }, [user, navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await signIn(email, password);
      navigate('/manage-durva-xk92/dashboard');
    } catch {
      setError('Invalid email or password. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-royal-bg flex flex-col items-center justify-center px-4">

      {/* Card */}
      <div className="w-full max-w-sm bg-royal-bg border border-royal-border rounded-2xl shadow-royal-lg overflow-hidden">

        {/* Header */}
        <div className="bg-royal-mahogany px-8 py-8 text-center">
          {settings?.logo_url && (
            <img
              src={getImageUrl(settings.logo_url)}
              alt={settings.brand_name}
              className="h-14 w-auto object-contain mx-auto mb-3"
            />
          )}
          <h1 className="font-display text-xl font-bold text-royal-bg">
            {settings?.brand_name || 'Durva Woodcraft'}
          </h1>
          <div className="flex items-center justify-center gap-1.5 text-royal-bg/50 text-xs mt-1 font-body">
            <Shield size={11} />
            Secure Admin Login
          </div>
        </div>

        {/* Form */}
        <div className="px-8 py-8">
          <form onSubmit={handleSubmit} className="space-y-5">

            <div>
              <label className="block font-body text-xs font-semibold text-royal-mahogany uppercase tracking-widest mb-2">
                Email
              </label>
              <input
                type="email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                required
                placeholder="admin@durvawoodcraft.in"
                className="w-full px-4 py-3 rounded-xl border border-royal-border bg-royal-cream font-body text-sm text-royal-mahogany placeholder-royal-navy/30 focus:outline-none focus:border-royal-brown focus:ring-2 focus:ring-royal-brown/20 transition-all"
              />
            </div>

            <div>
              <label className="block font-body text-xs font-semibold text-royal-mahogany uppercase tracking-widest mb-2">
                Password
              </label>
              <div className="relative">
                <input
                  type={showPwd ? 'text' : 'password'}
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  required
                  placeholder="••••••••"
                  className="w-full px-4 py-3 pr-11 rounded-xl border border-royal-border bg-royal-cream font-body text-sm text-royal-mahogany placeholder-royal-navy/30 focus:outline-none focus:border-royal-brown focus:ring-2 focus:ring-royal-brown/20 transition-all"
                />
                <button
                  type="button"
                  onClick={() => setShowPwd(!showPwd)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-royal-navy/40 hover:text-royal-brown transition-colors"
                >
                  {showPwd ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            {error && (
              <div className="bg-red-50 border border-red-200 rounded-xl px-4 py-3 text-sm font-body text-red-700">
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full royal-btn-primary py-3.5 flex items-center justify-center gap-2 disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {loading ? (
                <div className="w-4 h-4 border-2 border-royal-bg/30 border-t-royal-bg rounded-full animate-spin" />
              ) : (
                <LogIn size={16} />
              )}
              {loading ? 'Signing in...' : 'Sign In'}
            </button>
          </form>

          <p className="font-body text-xs text-royal-navy/40 text-center mt-6 leading-relaxed">
            This admin panel is for authorized personnel only.<br />
            All activity is logged.
          </p>
        </div>
      </div>

      <p className="font-body text-xs text-royal-navy/30 mt-6">
        © {new Date().getFullYear()} {settings?.brand_name}
      </p>
    </div>
  );
}
