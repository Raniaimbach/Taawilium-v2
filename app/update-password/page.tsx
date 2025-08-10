'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase/client';

export default function UpdatePasswordPage() {
  const router = useRouter();
  const [newPassword, setNewPassword] = useState('');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [lang, setLang] = useState<'ar' | 'en' | 'de'>('ar');

  // 🔍 Detect language
  useEffect(() => {
    const userLang = navigator.language.slice(0, 2);
    if (userLang === 'en' || userLang === 'de') setLang(userLang);
    else setLang('ar');
  }, []);

  const translations = {
    ar: {
      title: '🔑 تعيين كلمة مرور جديدة',
      placeholder: 'كلمة المرور الجديدة',
      button: 'تحديث كلمة المرور',
      success: '✅ تم تحديث كلمة المرور بنجاح',
      error: '❌ حدث خطأ أثناء التحديث',
      updating: '...جاري التحديث',
    },
    en: {
      title: '🔑 Set a New Password',
      placeholder: 'New Password',
      button: 'Update Password',
      success: '✅ Password updated successfully',
      error: '❌ An error occurred while updating',
      updating: '...Updating',
    },
    de: {
      title: '🔑 Neues Passwort festlegen',
      placeholder: 'Neues Passwort',
      button: 'Passwort aktualisieren',
      success: '✅ Passwort erfolgreich aktualisiert',
      error: '❌ Fehler beim Aktualisieren',
      updating: '...Wird aktualisiert',
    },
  };

  const t = translations[lang];

  const handleUpdatePassword = async () => {
    setLoading(true);
    setMessage('');

    const { error } = await supabase.auth.updateUser({
      password: newPassword,
    });

    if (error) {
      setMessage(`${t.error}: ${error.message}`);
    } else {
      setMessage(t.success);
      setTimeout(() => router.push('/login'), 3000);
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
        <h1 className="text-2xl mb-6 text-center font-bold">{t.title}</h1>

        <input
          type="password"
          placeholder={t.placeholder}
          value={newPassword}
          onChange={(e) => setNewPassword(e.target.value)}
          className="w-full mb-4 px-4 py-2 rounded bg-[#2a2a3c] text-white"
        />

        <button
          onClick={handleUpdatePassword}
          disabled={loading || !newPassword}
          className="w-full py-2 rounded bg-purple-700 hover:bg-purple-800 transition"
        >
          {loading ? t.updating : t.button}
        </button>

        {message && <p className="mt-4 text-center">{message}</p>}
      </div>
    </div>
  );
}