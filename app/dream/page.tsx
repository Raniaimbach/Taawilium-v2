'use client';

export const dynamic = 'force-dynamic';

import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase/client';

type Dream = {
  id: string;
  content: string;
  interpretation: string;
  created_at: string;
};

export default function DreamsPage() {
  const [dreams, setDreams] = useState<Dream[]>([]);
  const [loading, setLoading] = useState(true);
  const [language, setLanguage] = useState<'ar' | 'en' | 'de'>('ar');
  const [expanded, setExpanded] = useState<Record<string, boolean>>({});

  const t = {
    ar: {
      app: '💫 تاويليوم – همس الأحلام',
      title: '🌙 أحلامك السابقة',
      loading: '...جارٍ التحميل',
      noDreams: 'لا توجد أحلام محفوظة بعد.',
      dream: 'الحلم:',
      interpretation: 'التفسير:',
      tryNew: '🔁 تجربة تفسير جديد',
      signOut: '🚪 تسجيل الخروج',
      back: '🏠 العودة إلى الرئيسية',
      showMore: 'اضغط لعرض المزيد',
      delete: '🗑️ حذف',
      confirmDelete: 'هل أنت متأكد أنك تريد حذف هذا الحلم؟',
    },
    en: {
      app: '💫 Taawilium – The Dream Whisperer',
      title: '🌙 Your Previous Dreams',
      loading: '...Loading',
      noDreams: 'No dreams saved yet.',
      dream: 'Dream:',
      interpretation: 'Interpretation:',
      tryNew: '🔁 Try a New Interpretation',
      signOut: '🚪 Sign Out',
      back: '🏠 Back to Home',
      showMore: 'Click to expand',
      delete: '🗑️ Delete',
      confirmDelete: 'Are you sure you want to delete this dream?',
    },
    de: {
      app: '💫 Taawilium – Der Traumflüsterer',
      title: '🌙 Deine früheren Träume',
      loading: '...Wird geladen',
      noDreams: 'Noch keine gespeicherten Träume.',
      dream: 'Traum:',
      interpretation: 'Deutung:',
      tryNew: '🔁 Neue Deutung versuchen',
      signOut: '🚪 Abmelden',
      back: '🏠 Zurück zur Hauptseite',
      showMore: 'Zum Anzeigen klicken',
      delete: '🗑️ Löschen',
      confirmDelete: 'Möchtest du diesen Traum wirklich löschen?',
    },
  }[language];

  useEffect(() => {
    const savedLang = localStorage.getItem('language') as 'ar' | 'en' | 'de';
    if (savedLang) setLanguage(savedLang);
  }, []);

  const changeLanguage = (lang: 'ar' | 'en' | 'de') => {
    localStorage.setItem('language', lang);
    setLanguage(lang);
    window.location.reload();
  };

  const dir = language === 'ar' ? 'rtl' : 'ltr';
  const align = language === 'ar' ? 'text-right' : 'text-left';

  const fetchDreams = async () => {
    const {
      data: { user },
    }: { data: { user: { id: string } | null } } = await supabase.auth.getUser();

    if (!user) {
      setDreams([]);
      setLoading(false);
      return;
    }

    const { data, error } = await supabase
      .from('dream')
      .select('*')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false });

    if (!error && data) {
      setDreams(data as Dream[]);
    }

    setLoading(false);
  };

  useEffect(() => {
    fetchDreams();
  }, []);

  const handleDelete = async (id: string) => {
    const confirm = window.confirm(t.confirmDelete);
    if (!confirm) return;

    const { error } = await supabase.from('dream').delete().eq('id', id);
    if (!error) {
      setDreams((prev) => prev.filter((d) => d.id !== id));
    }
  };

  return (
    <div className={`min-h-screen bg-[#0f0f23] text-white px-6 py-10 ${align}`} dir={dir}>
      {/* Top Controls */}
      <div className="flex justify-between items-center mb-6">
        <a href="/test" className="text-sm text-purple-400 hover:underline">{t.back}</a>
        <div className="flex items-center gap-4">
          <button
            onClick={async () => {
              await supabase.auth.signOut();
              window.location.href = '/login';
            }}
            className="text-sm text-purple-300 hover:underline"
          >
            {t.signOut}
          </button>
          <select
            value={language}
            onChange={(e) => changeLanguage(e.target.value as 'ar' | 'en' | 'de')}
            className="bg-transparent border border-purple-300 text-purple-300 text-sm px-2 py-1 rounded-md"
          >
            <option value="ar">🇸🇦 عربي</option>
            <option value="en">🇬🇧 English</option>
            <option value="de">🇩🇪 Deutsch</option>
          </select>
        </div>
      </div>

      {/* App Title */}
      <h1 className="text-3xl md:text-4xl font-bold text-purple-400 text-center mb-1">
        {t.app}
      </h1>

      {/* Section Title */}
      <h2 className="text-2xl md:text-3xl font-semibold text-center mb-8 text-gray-300">
        {t.title}
      </h2>

      {/* Content */}
      {loading ? (
        <p className="text-center text-gray-400">{t.loading}</p>
      ) : dreams.length === 0 ? (
        <p className="text-center text-gray-400">{t.noDreams}</p>
      ) : (
        <ul className="grid md:grid-cols-2 gap-6">
          {dreams.map((dream) => {
            const isOpen = expanded[dream.id];
            return (
              <li
                key={dream.id}
                onClick={() => setExpanded(prev => ({ ...prev, [dream.id]: !isOpen }))}
                className="cursor-pointer bg-gradient-to-br from-[#1a1a2e] to-[#2a2a4f] p-6 rounded-lg shadow-lg border border-purple-700 transition duration-300 hover:scale-[1.01]"
              >
                <p className="text-sm text-gray-400 mb-2">
                  🕰️ {new Date(dream.created_at).toLocaleString(language === 'ar' ? 'ar-EG' : language === 'de' ? 'de-DE' : 'en-US')}
                </p>
                <p className="mb-2">
                  <span className="text-purple-300 font-semibold">{t.dream}</span>{' '}
                  {isOpen ? dream.content : dream.content.slice(0, 100) + (dream.content.length > 100 ? '...' : '')}
                </p>
                <p>
                  <span className="text-purple-300 font-semibold">{t.interpretation}</span>{' '}
                  {isOpen ? dream.interpretation : dream.interpretation.slice(0, 100) + (dream.interpretation.length > 100 ? '...' : '')}
                </p>
                {!isOpen && <p className="text-sm text-gray-400 mt-2">{t.showMore}</p>}

                <div className="text-right mt-4">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleDelete(dream.id);
                    }}
                    className="text-sm text-red-400 hover:text-red-500"
                  >
                    {t.delete}
                  </button>
                </div>
              </li>
            );
          })}
        </ul>
      )}

      {/* Try New */}
      <div className="text-center mt-12">
        <a
          href="/test"
          className="inline-block bg-purple-800 hover:bg-purple-900 text-white font-semibold py-2 px-6 rounded-md shadow-md"
        >
          {t.tryNew}
        </a>
      </div>
    </div>
  );
}