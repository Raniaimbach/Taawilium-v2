'use client';

export const dynamic = 'force-dynamic';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase/client';

export default function TestPage() {
  const [checking, setChecking] = useState(true);
  const [dream, setDream] = useState('');
  const [interpretation, setInterpretation] = useState('');
  const [loading, setLoading] = useState(false);
  const [saved, setSaved] = useState(false);
  const [mode, setMode] = useState<'both' | 'spirit' | 'sci'>('both');
  const [language, setLanguage] = useState<'ar' | 'en' | 'de'>('ar');
  const router = useRouter();

  useEffect(() => {
    const secureAccess = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        router.push('/login');
      } else {
        setChecking(false);
      }
    };
    secureAccess();
  }, [router]);

  useEffect(() => {
    const storedLang = localStorage.getItem('language');
    if (storedLang === 'ar' || storedLang === 'en' || storedLang === 'de') {
      setLanguage(storedLang);
    }
  }, []);

  if (checking) return null;

  const labels = {
    ar: {
      intro: '✨لا تنسَ حلمًا زارك مرة… فهو لم يأتِ عبثًا✨',
      title: 'تاويليوم – همس الأحلام',
      placeholder: 'اكتب حلمك هنا...',
      interpret: '🔮 تفسير',
      deleting: '🗑️ حذف الحلم',
      interpreting: '...جارٍ التفسير',
      noResult: 'لم يتم العثور على تفسير.',
      error: 'حدث خطأ أثناء التفسير.',
      spirit: 'روحاني فقط 🌙',
      sci: 'علمي فقط 🧪',
      both: 'شامل 💫',
      selectMode: 'اختر نوع التفسير',
      save: '💾 حفظ الحلم',
      saved: '✅ تم حفظ الحلم بنجاح.',
      signOut: '🚪 تسجيل الخروج',
      view: '🕯️ عرض الأحلام السابقة',
    },
    en: {
      intro: '✨Never forget a dream that visited you — it came for a reason✨',
      title: 'Taawilium – The Dream Whisperer',
      placeholder: 'Write your dream here...',
      interpret: '🔮 Interpret',
      deleting: '🗑️ Delete Dream',
      interpreting: '...Interpreting',
      noResult: 'No interpretation found.',
      error: 'An error occurred while interpreting.',
      spirit: 'Spiritual Only 🌙',
      sci: 'Scientific Only 🧪',
      both: 'Combined 💫',
      selectMode: 'Choose interpretation type',
      save: '💾 Save Dream',
      saved: '✅ Dream saved successfully.',
      signOut: '🚪 Sign Out',
      view: '🕯️ View Saved Dreams',
    },
    de: {
      intro: '✨Vergiss niemals einen Traum, der dich besucht hat – er kam aus einem Grund✨',
      title: 'Taawilium – Der Traumflüsterer',
      placeholder: 'Schreibe deinen Traum hier...',
      interpret: '🔮 Deuten',
      deleting: '🗑️ Traum löschen',
      interpreting: '...Deutung läuft',
      noResult: 'Keine Deutung gefunden.',
      error: 'Fehler bei der Deutung.',
      spirit: 'Nur Spirituell 🌙',
      sci: 'Nur Wissenschaftlich 🧪',
      both: 'Kombiniert 💫',
      selectMode: 'Wähle Deutungsart',
      save: '💾 Traum speichern',
      saved: '✅ Traum erfolgreich gespeichert.',
      signOut: '🚪 Abmelden',
      view: '🕯️ Gespeicherte Träume anzeigen',
    },
  }[language];

  const dir = language === 'ar' ? 'rtl' : 'ltr';

  const handleInterpret = async () => {
    setLoading(true);
    setInterpretation('');
    setSaved(false);
    try {
      const res = await fetch('/api/prompt-engine', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          dream,
          mode,
          profile: {
            language,
            culture: 'islamic',
            tier: 'premium',
            scientific: mode === 'sci',
            emotional_intensity: 'medium',
          },
        }),
      });
      const data = await res.json();
      const result = data.result || labels.noResult;
      setInterpretation(result);
      const audio = new Audio('/sounds/whisper.mp3');
      audio.play();
    } catch {
      setInterpretation(labels.error);
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error();
      const res = await fetch('/api/save-dream', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          content: dream,
          interpretation,
          user_id: user.id,
        }),
      });
      if (res.ok) setSaved(true);
    } catch {
      alert('Error saving dream.');
    }
  };

  const handleDelete = () => {
    setDream('');
    setInterpretation('');
    setSaved(false);
  };

  const handleSignOut = async () => {
    const { error } = await supabase.auth.signOut();
    if (!error) window.location.href = '/login';
  };

  return (
    <div
      className={`min-h-screen bg-cover bg-center px-6 py-10 text-white relative`}
      style={{ backgroundImage: "url('/images/moon-bg.jpg')" }}
      dir={dir}
    >
      {/* Language + Signout */}
      <div className="absolute top-4 right-4 flex gap-2 items-center">
        <select
          value={language}
          onChange={(e) => {
            setLanguage(e.target.value as 'ar' | 'en' | 'de');
            localStorage.setItem('language', e.target.value);
          }}
          className="bg-white/10 text-white text-sm rounded-md px-2 py-1"
        >
          <option value="ar">🇸🇦 العربية</option>
          <option value="en">🇬🇧 English</option>
          <option value="de">🇩🇪 Deutsch</option>
        </select>
        <button
          onClick={handleSignOut}
          className="bg-purple-800 hover:bg-purple-900 text-white font-semibold py-1 px-4 rounded-md shadow"
        >
          {labels.signOut}
        </button>
      </div>

      {/* Title + Intro */}
      <div className="text-center mt-24">
        <p className="text-2xl md:text-3xl font-semibold text-white drop-shadow">{labels.intro}</p>
        <h1 className="text-4xl md:text-5xl font-bold mt-2 text-purple-800 drop-shadow">{labels.title}</h1>
      </div>

      {/* Input */}
      <div className="max-w-3xl mx-auto mt-8">
        <textarea
          value={dream}
          onChange={(e) => setDream(e.target.value)}
          placeholder={labels.placeholder}
          className="w-full h-36 p-4 bg-white/5 backdrop-blur-md text-white placeholder-gray-300 rounded-md border border-white/20 shadow-md"
          dir={dir}
        />
      </div>

      {/* Action Buttons */}
      <div className="flex flex-wrap items-center justify-between mt-4 gap-4 max-w-3xl mx-auto">
        <div className="flex gap-2 items-center">
          <select
            value={mode}
            onChange={(e) => setMode(e.target.value as 'both' | 'spirit' | 'sci')}
            className="bg-purple-800 text-white text-sm rounded-md px-3 py-2"
          >
            <option value="both">{labels.selectMode}</option>
            <option value="both">{labels.both}</option>
            <option value="spirit">{labels.spirit}</option>
            <option value="sci">{labels.sci}</option>
          </select>

          <button
            onClick={handleInterpret}
            disabled={loading || !dream.trim()}
            className="bg-purple-800 hover:bg-purple-900 text-white font-semibold py-2 px-4 rounded shadow disabled:opacity-50"
          >
            {loading ? labels.interpreting : labels.interpret}
          </button>
        </div>

        <button
          onClick={handleDelete}
          className="bg-purple-800 hover:bg-purple-900 text-white text-sm py-2 px-4 rounded-md"
        >
          {labels.deleting}
        </button>
      </div>

      {/* Interpretation */}
      {interpretation && (
        <div className="mt-6 max-w-3xl mx-auto bg-white/10 text-white p-6 rounded-md border border-purple-600 shadow-md backdrop-blur">
          <p>{interpretation}</p>
          {!saved && (
            <button
              onClick={handleSave}
              className="mt-4 bg-purple-800 hover:bg-purple-900 text-white py-2 px-4 rounded shadow-md"
            >
              {labels.save}
            </button>
          )}
          {saved && <p className="mt-4 text-green-400">{labels.saved}</p>}
        </div>
      )}

      {/* View Dreams */}
      <div className="text-center mt-8">
        <a
          href="/dream"
          className="inline-block bg-purple-800 hover:bg-purple-900 text-white font-semibold py-2 px-6 rounded-md"
        >
          {labels.view}
        </a>
      </div>
    </div>
  );
}