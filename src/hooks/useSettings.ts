import { useEffect, useState } from 'react';
import { supabase, Settings } from '../lib/supabase';

export function useSettings() {
  const [settings, setSettings] = useState<Settings | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchSettings();

    const channel = supabase
      .channel('settings-changes')
      .on('postgres_changes', {
        event: '*',
        schema: 'public',
        table: 'settings'
      }, () => {
        fetchSettings();
      })
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  async function fetchSettings() {
    try {
      const { data, error } = await supabase
        .from('settings')
        .select('*')
        .maybeSingle();

      if (error) throw error;

      if (data) {
        setSettings(data);
        applyTheme(data);
      }
    } catch (error) {
      console.error('Error fetching settings:', error);
    } finally {
      setLoading(false);
    }
  }

  function applyTheme(settings: Settings) {
    document.documentElement.style.setProperty('--primary-color', settings.primary_color);
    document.documentElement.style.setProperty('--secondary-color', settings.secondary_color);
    document.documentElement.style.setProperty('--accent-color', settings.accent_color);

    if (settings.brand_name) {
      document.title = settings.brand_name;
    }
  }

  return { settings, loading, refetch: fetchSettings };
}
