'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase/client';

type Language = 'ar' | 'en' | 'de';
type Mode = 'holistic' | 'spiritual' | 'scientific';

const isMode = (v: string): v is Mode =>
  v === 'holistic' || v === 'spiritual' || v === 'scientific';

const isLang = (v: string): v is Language =>
  v === 'ar' || v === 'en' || v === 'de';

export default function TestPage() {
  const router = useRouter();

  const [checking, setChecking] = useState(true);
  const [dream, setDream] = useState('');
  const [interpretation, setInterpretation] = useState('');
  const [loading, setLoading] = useState(false);
  const [saved, setSaved] = useState(false);
  const [language, setLanguage] = useState<Language>('ar');
  const [mode, setMode] = useState<Mode>('holistic');

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => {
      if (!data.user) router.push('/login');
      else setChecking(false);
    });
  }, [router]);

  useEffect(() => {
    const savedLang = localStorage.getItem('language');
    if (savedLang && isLang(savedLang)) setLanguage(savedLang);
  }, []);

  if (checking) return null;

  const labels = {
    ar: {
      intro: '✨لا تنسَ حلمًا زارك مرة… فهو لم يأتِ عبثًا✨',
      title: 'Taawilium – همس الأحلام',
      placeholder: 'اكتب حلمك هنا...',
      interpret: '🔮 تفسير',
      deleting: '🗑️ حذف الحلم',
      interpreting: '...جارٍ التفسير',
      noResult: 'لم يتم العثور على تفسير.',
      error: 'حدث خطأ أثناء التفسير.',
      spiritual: 'روحاني فقط 🌙',
      scientific: 'علمي فقط 🧪',
      holistic: 'شامل 💫',
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
      spiritual: 'Spiritual Only 🌙',
      scientific: 'Scientific Only 🧪',
      holistic: 'Combined 💫',
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
      spiritual: 'Nur Spirituell 🌙',
      scientific: 'Nur Wissenschaftlich 🧪',
      holistic: 'Kombiniert 💫',
      selectMode: 'Wähle Deutungsart',
      save: '💾 Traum speichern',
      saved: '✅ Traum erfolgreich gespeichert.',
      signOut: '🚪 Abmelden',
      view: '🕯️ Gespeicherte Träume anzeigen',
    },
  }[language];

  const dir = language === 'ar' ? 'rtl' : 'ltr';

  const getPromptPath = (m: Mode, lang: Language) => {
    switch (m) {
      case 'scientific': return `prompts/components/methodologys/dcas.${lang}.txt`;
      case 'spiritual': return `prompts/components/methodologys/spiritual_deduction.${lang}.txt`;
      case 'holistic':
      default: return `prompts/components/methodologys/holistic.${lang}.txt`;
    }
  };

  const handleInterpret = async () => {
    if (!dream.trim()) return alert('Please enter your dream.');

    setLoading(true);
    setInterpretation('');
    setSaved(false);

    try {
      const promptPath = getPromptPath(mode, language);

      const res = await fetch('/api/prompt-engine', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          dream,
          mode,
          promptPath,
          profile: {
            language,
            culture: 'islamic',
            tier: 'premium',
            scientific: mode === 'scientific',
            emotional_intensity: 'medium',
          },
        }),
      });

      const data = await res.json();
      setInterpretation(data.result || labels.noResult);

      const audio = new Audio('/sounds/whisper.mp3');
      void audio.play();
    } catch {
      setInterpretation(labels.error);
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    if (!dream || !interpretation) return alert('Please interpret dream before saving.');

    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('No user');

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
      else alert('Failed to save dream.');
    } catch {
      alert('Failed to save dream.');
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
      dir={dir}
      className="min-h-screen bg-[#0f0f23] bg-cover bg-center p-8 text-white flex flex-col"
      style={{ backgroundImage: "url('/images/moon-bg.jpg')" }}
    >
      {/* Header */}
      <header className="flex justify-between items-center mb-8">
        <select
          value={language}
          onChange={e => {
            const val = e.target.value;
            if (isLang(val)) {
              setLanguage(val);
              localStorage.setItem('language', val);
            }
          }}
          className="bg-white/20 text-white rounded px-3 py-1 focus:outline-none cursor-pointer"
        >
          <option value="ar">🇸🇦 العربية</option>
          <option value="en">🇬🇧 English</option>
          <option value="de">🇩🇪 Deutsch</option>
        </select>
        <button
          onClick={handleSignOut}
          className="bg-purple-900 hover:bg-purple-700 transition px-5 py-2 rounded text-white font-semibold"
        >
          {labels.signOut}
        </button>
      </header>

      {/* Title & Intro */}
      <section className="text-center mb-10">
        <h1 className="text-5xl font-bold text-purple-800 mb-2">{labels.title}</h1>
        <p className="text-xl italic">{labels.intro}</p>
      </section>

      {/* Dream Input */}
      <section className="max-w-3xl mx-auto w-full flex flex-col gap-4">
        <textarea
          value={dream}
          onChange={e => setDream(e.target.value)}
          placeholder={labels.placeholder}
          rows={7}
          className="bg-black/40 text-white rounded-lg p-4 resize-none backdrop-blur-md border border-purple-700 placeholder-purple-400 focus:outline-none"
        />

        {/* Select Interpretation Mode */}
        <div className="flex gap-4 items-center">
          <label className="font-semibold min-w-max">{labels.selectMode}:</label>
          <select
            value={mode}
            onChange={e => {
              const val = e.target.value;
              if (isMode(val)) setMode(val);
            }}
            className="bg-black/40 text-white rounded px-3 py-1 cursor-pointer backdrop-blur-md border border-purple-700 focus:outline-none"
          >
            <option value="holistic">{labels.holistic}</option>
            <option value="spiritual">{labels.spiritual}</option>
            <option value="scientific">{labels.scientific}</option>
          </select>
        </div>

        {/* Buttons */}
        <div className="flex gap-4 justify-center flex-wrap">
          <button
            onClick={handleInterpret}
            disabled={loading}
            className="bg-gradient-to-r from-purple-900 to-purple-700 px-6 py-2 rounded-lg font-semibold hover:from-purple-700 hover:to-purple-900 transition disabled:opacity-50"
          >
            {loading ? labels.interpreting : labels.interpret}
          </button>

          <button
            onClick={handleDelete}
            className="bg-gradient-to-r from-gray-800 to-gray-700 px-5 py-2 rounded-lg font-semibold hover:from-gray-600 hover:to-gray-500 transition"
          >
            {labels.deleting}
          </button>

          <button
            onClick={handleSave}
            disabled={saved || !interpretation}
            className="bg-gradient-to-r from-indigo-900 to-indigo-700 px-6 py-2 rounded-lg font-semibold hover:from-indigo-700 hover:to-indigo-900 transition disabled:opacity-50"
          >
            {saved ? labels.saved : labels.save}
          </button>

          <button
            onClick={() => router.push('/dream')}
            className="bg-gradient-to-r from-purple-700 to-purple-500 px-5 py-2 rounded-lg font-semibold hover:from-purple-500 hover:to-purple-700 transition"
          >
            {labels.view}
          </button>
        </div>

        {/* Interpretation Output */}
        {interpretation && (
          <div
            className="mt-8 max-w-3xl mx-auto bg-black/40 rounded-lg p-6 border border-purple-700 text-white whitespace-pre-wrap backdrop-blur-md"
            aria-live="polite"
          >
            {interpretation}
          </div>
        )}
      </section>
    </div>
  );
}