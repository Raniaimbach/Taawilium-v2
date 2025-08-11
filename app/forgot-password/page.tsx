'use client';

import { useState } from 'react';

const translations: Record<
  string,
  {
    title: string;
    placeholderEmail: string;
    buttonSend: string;
    loadingSend: string;
    successMessage: string;
    errorMessage: string;
    selectLanguage: string;
  }
> = {
  ar: {
    title: '🔒 نسيت كلمة المرور؟',
    placeholderEmail: 'البريد الإلكتروني',
    buttonSend: 'إرسال رابط إعادة التعيين',
    loadingSend: '...جاري الإرسال',
    successMessage: '✅ تم إرسال رابط إعادة تعيين كلمة المرور إلى بريدك الإلكتروني',
    errorMessage: '❌ حدث خطأ ما',
    selectLanguage: 'اختر اللغة',
  },
  en: {
    title: '🔒 Forgot Password?',
    placeholderEmail: 'Email',
    buttonSend: 'Send Reset Link',
    loadingSend: '...Sending',
    successMessage: '✅ Password reset link sent to your email',
    errorMessage: '❌ An error occurred',
    selectLanguage: 'Select Language',
  },
  de: {
    title: '🔒 Passwort vergessen?',
    placeholderEmail: 'E-Mail',
    buttonSend: 'Link zum Zurücksetzen senden',
    loadingSend: '...Senden',
    successMessage: '✅ Link zum Zurücksetzen des Passworts wurde an Ihre E-Mail gesendet',
    errorMessage: '❌ Ein Fehler ist aufgetreten',
    selectLanguage: 'Sprache wählen',
  },
};

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [lang, setLang] = useState<'ar' | 'en' | 'de'>('ar');

  const t = translations[lang];

  const handleSendLink = async () => {
    setLoading(true);
    setMessage('');

    try {
      const res = await fetch('/api/forgot-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });

      const data = await res.json();

      if (res.ok) {
        setMessage(t.successMessage);
      } else {
        setMessage(`❌ خطأ: ${data.error || t.errorMessage}`);
      }
    } catch {
      setMessage(`❌ ${t.errorMessage}`);
    }

    setLoading(false);
  };

  return (
    <div
      className="min-h-screen flex flex-col items-center justify-center text-white px-4"
      style={{
        backgroundImage: "url('/images/moon-bg.jpg')",
        backgroundSize: 'cover',
        backdropFilter: 'blur(6px)',
        backgroundColor: '#0f0f23',
      }}
    >
      <div className="bg-[#1a1a2e]/70 p-8 rounded-lg shadow-md w-full max-w-md backdrop-blur-md">
        <div className="mb-4 text-center">
          <label htmlFor="language-select" className="mr-2">
            {t.selectLanguage}:
          </label>
          <select
            id="language-select"
            value={lang}
            onChange={(e) => setLang(e.target.value as 'ar' | 'en' | 'de')}
            className="text-black rounded px-2 py-1"
          >
            <option value="ar">العربية</option>
            <option value="en">English</option>
            <option value="de">Deutsch</option>
          </select>
        </div>

        <h1 className="text-2xl mb-4 text-center font-bold">{t.title}</h1>
        <input
          type="email"
          placeholder={t.placeholderEmail}
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full mb-4 px-4 py-2 rounded bg-[#2a2a3c] text-white"
        />
        <button
          onClick={handleSendLink}
          disabled={loading || !email}
          className="w-full py-2 rounded bg-purple-700 hover:bg-purple-800 transition"
        >
          {loading ? t.loadingSend : t.buttonSend}
        </button>
        {message && <p className="mt-4 text-center">{message}</p>}
      </div>
    </div>
  );
}