'use client';

export const dynamic = 'force-dynamic';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase/client';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [language, setLanguage] = useState<'ar' | 'en' | 'de'>('ar');
  const router = useRouter();

  useEffect(() => {
    const lang = localStorage.getItem('language') as 'ar' | 'en' | 'de';
    if (lang) setLanguage(lang);
  }, []);

  const labels = {
    ar: {
      title: 'تاويليوم – همس الأحلام',
      login: '✨ تسجيل الدخول ✨',
      email: 'البريد الإلكتروني',
      password: 'كلمة المرور',
      error: 'فشل تسجيل الدخول',
      button: 'تسجيل الدخول',
      switch: 'لا تملك حساباً؟ أنشئ حسابًا',
      lang: '🇬🇧 English',
    },
    en: {
      title: 'Taawilium – The Dream Whisperer',
      login: '✨ Log In ✨',
      email: 'Email',
      password: 'Password',
      error: 'Login failed',
      button: 'Log In',
      switch: "Don't have an account? Sign up",
      lang: '🇩🇪 Deutsch',
    },
    de: {
      title: 'Taawilium – Der Traumflüsterer',
      login: '✨ Anmeldung ✨',
      email: 'E-Mail',
      password: 'Passwort',
      error: 'Anmeldung fehlgeschlagen',
      button: 'Anmelden',
      switch: 'Noch kein Konto? Registrieren',
      lang: '🇸🇦 عربي',
    },
  }[language];

  const nextLang = language === 'ar' ? 'en' : language === 'en' ? 'de' : 'ar';

  const handleLogin = async () => {
    setError('');
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) {
      setError(labels.error);
    } else {
      router.push('/test');
    }
  };

  return (
    <div
      className="min-h-screen bg-cover bg-center text-white flex flex-col items-center justify-center px-4 relative"
      style={{ backgroundImage: "url('/images/moon-bg.jpg')" }}
    >
      {/* زر اللغة */}
      <div className="absolute top-6 right-6">
        <button
          onClick={() => {
            setLanguage(nextLang);
            localStorage.setItem('language', nextLang);
          }}
          className="text-sm bg-white/10 hover:bg-white/20 text-purple-300 px-3 py-1 rounded-md"
        >
          {labels.lang}
        </button>
      </div>

      {/* العنوان */}
      <div className="text-center mb-10 mt-8">
        <h1 className="text-3xl md:text-4xl font-bold text-purple-400">{labels.title}</h1>
      </div>

      {/* صندوق الدخول */}
      <div className="bg-white/10 p-8 rounded-md shadow-md w-full max-w-sm backdrop-blur-md border border-purple-800">
        <h2 className="text-xl font-semibold text-center text-white mb-6">{labels.login}</h2>

        <input
          type="email"
          placeholder={labels.email}
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full p-3 mb-4 rounded-md bg-gray-800/60 text-white placeholder-gray-400 focus:outline-none"
        />
        <input
          type="password"
          placeholder={labels.password}
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full p-3 mb-4 rounded-md bg-gray-800/60 text-white placeholder-gray-400 focus:outline-none"
        />

        {error && <p className="text-red-400 text-sm mb-4 text-center">{error}</p>}

        <button
          onClick={handleLogin}
          className="w-full bg-purple-800 hover:bg-purple-900 text-white font-semibold py-2 rounded-md shadow-md"
        >
          {labels.button}
        </button>

        <p className="text-center text-sm mt-4 text-gray-300">
          <a href="/signup" className="text-purple-400 hover:underline">{labels.switch}</a>
        </p>
      </div>
    </div>
  );
}