'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase/client';

export default function LandingPage() {
  const [checkingAuth, setCheckingAuth] = useState(true);
  const [language, setLanguage] = useState<'ar' | 'en' | 'de'>('ar');
  const router = useRouter();

  useEffect(() => {
    const saved = localStorage.getItem('language');
    if (saved === 'en' || saved === 'de' || saved === 'ar') {
      setLanguage(saved);
    }
  }, []);

  useEffect(() => {
    const checkAuth = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        router.push('/test');
      } else {
        setCheckingAuth(false);
      }
    };
    checkAuth();
  }, [router]);

  if (checkingAuth) return null;

  const labels = {
    ar: {
      quote: '✨ لا تنسَ حلمًا زارك مرة… فهو لم يأتِ عبثًا ✨',
      start: 'ابدأ التفسير',
      login: 'تسجيل الدخول',
      title: 'تاويليوم – همس الأحلام',
    },
    en: {
      quote: '✨ Never forget a dream that visited you — it came for a reason ✨',
      start: 'Start Interpreting',
      login: 'Log In',
      title: 'Taawilium – The Dream Whisperer',
    },
    de: {
      quote: '✨ Vergiss niemals einen Traum, der dich besucht hat – er kam aus einem Grund ✨',
      start: 'Traum deuten',
      login: 'Anmelden',
      title: 'Taawilium – Der Traumflüsterer',
    },
  }[language];

  const handleLanguageChange = (lang: 'ar' | 'en' | 'de') => {
    setLanguage(lang);
    localStorage.setItem('language', lang);
  };

  const dir = language === 'ar' ? 'rtl' : 'ltr';

  return (
    <div
      className="min-h-screen bg-cover bg-center text-white flex flex-col items-center justify-center relative px-4"
      style={{ backgroundImage: "url('/images/moon-bg.jpg')" }}
      dir={dir}
    >
      <div className="absolute top-6 right-6">
        <select
          value={language}
          onChange={(e) => handleLanguageChange(e.target.value as 'ar' | 'en' | 'de')}
          className="bg-white/10 text-white text-sm rounded-md px-3 py-1"
        >
          <option value="ar">🇸🇦 العربية</option>
          <option value="en">🇬🇧 English</option>
          <option value="de">🇩🇪 Deutsch</option>
        </select>
      </div>

      <p className="text-xl md:text-2xl text-center font-light mb-4 text-white drop-shadow">
        {labels.quote}
      </p>

      <h1 className="text-4xl md:text-5xl font-bold text-purple-300 drop-shadow mb-8 text-center">
        {labels.title}
      </h1>

      <div className="flex flex-col md:flex-row gap-4">
        <button
          onClick={() => router.push('/login')}
          className="bg-white/10 hover:bg-white/20 text-white font-medium py-2 px-6 rounded-md shadow-md border border-purple-500"
        >
          {labels.login}
        </button>
      </div>
    </div>
  );
}