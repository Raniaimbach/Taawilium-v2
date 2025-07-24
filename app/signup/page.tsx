'use client';

export const dynamic = 'force-dynamic';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase/client';

export default function SignupPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [language, setLanguage] = useState<'ar' | 'en' | 'de'>('ar');
  const router = useRouter();

  useEffect(() => {
    const lang = localStorage.getItem('language') as 'ar' | 'en' | 'de';
    if (lang) setLanguage(lang);
  }, []);

  const labels = {
    ar: {
      title: 'تاويليوم – همس الأحلام',
      signup: '✨ إنشاء حساب جديد ✨',
      email: 'البريد الإلكتروني',
      password: 'كلمة المرور',
      error: 'فشل التسجيل',
      success: '✅ تم التسجيل بنجاح!',
      button: 'إنشاء الحساب',
      switch: 'لديك حساب؟ سجّل الدخول',
      lang: '🇬🇧 English',
    },
    en: {
      title: 'Taawilium – The Dream Whisperer',
      signup: '✨ Create a New Account ✨',
      email: 'Email',
      password: 'Password',
      error: 'Registration failed',
      success: '✅ Registered successfully!',
      button: 'Sign Up',
      switch: 'Already have an account? Log in',
      lang: '🇩🇪 Deutsch',
    },
    de: {
      title: 'Taawilium – Der Traumflüsterer',
      signup: '✨ Neues Konto erstellen ✨',
      email: 'E-Mail',
      password: 'Passwort',
      error: 'Registrierung fehlgeschlagen',
      success: '✅ Erfolgreich registriert!',
      button: 'Registrieren',
      switch: 'Bereits ein Konto? Anmelden',
      lang: '🇸🇦 عربي',
    },
  }[language];

  const nextLang = language === 'ar' ? 'en' : language === 'en' ? 'de' : 'ar';

  const handleSignup = async () => {
    setError('');
    const { error } = await supabase.auth.signUp({ email, password });
    if (error) {
      setError(labels.error);
    } else {
      setSuccess(true);
      setTimeout(() => router.push('/login'), 2000);
    }
  };

  return (
    <div
      className="min-h-screen bg-cover bg-center text-white flex flex-col items-center justify-center px-4 relative"
      style={{ backgroundImage: "url('/images/moon-bg.jpg')" }}
    >
      {/* Language Switch */}
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

      {/* App Title */}
      <div className="text-center mb-10 mt-8">
        <h1 className="text-3xl md:text-4xl font-bold text-purple-400">{labels.title}</h1>
      </div>

      {/* Signup Box */}
      <div className="bg-white/10 p-8 rounded-md shadow-md w-full max-w-sm backdrop-blur-md border border-purple-800">
        <h2 className="text-xl font-semibold text-center text-white mb-6">{labels.signup}</h2>

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
        {success && <p className="text-green-400 text-sm mb-4 text-center">{labels.success}</p>}

        <button
          onClick={handleSignup}
          className="w-full bg-purple-800 hover:bg-purple-900 text-white font-semibold py-2 rounded-md shadow-md"
        >
          {labels.button}
        </button>

        <p className="text-center text-sm mt-4 text-gray-300">
          <a href="/login" className="text-purple-400 hover:underline">{labels.switch}</a>
        </p>
      </div>
    </div>
  );
}