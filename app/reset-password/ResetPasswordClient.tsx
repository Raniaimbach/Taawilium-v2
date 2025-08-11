'use client';

import { useEffect, useMemo, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { supabase } from '@/lib/supabase/client';

export default function ResetPasswordClient() {
  const router = useRouter();
  const search = useSearchParams();

  const [ready, setReady] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [password, setPassword] = useState('');
  const [password2, setPassword2] = useState('');
  const [loading, setLoading] = useState(false);
  const [done, setDone] = useState(false);

  const tokens = useMemo(() => {
    const queryAccess = search.get('access_token');
    const queryRefresh = search.get('refresh_token');

    const hash = typeof window !== 'undefined' ? window.location.hash : '';
    const hashParams = new URLSearchParams(hash.startsWith('#') ? hash.slice(1) : hash);
    const hashAccess = hashParams.get('access_token');
    const hashRefresh = hashParams.get('refresh_token');

    return {
      access_token: queryAccess ?? hashAccess ?? null,
      refresh_token: queryRefresh ?? hashRefresh ?? null,
      type: search.get('type') ?? hashParams.get('type'),
    };
  }, [search]);

  useEffect(() => {
    (async () => {
      try {
        if (!tokens.access_token || !tokens.refresh_token) {
          const { data } = await supabase.auth.getSession();
          if (data.session) {
            setReady(true);
            return;
          }
          setError('الرابط غير صالح أو مفقود. افتحي رابط إعادة التعيين من جديد.');
          return;
        }

        const { error: setErr } = await supabase.auth.setSession({
          access_token: tokens.access_token,
          refresh_token: tokens.refresh_token,
        });
        if (setErr) {
          setError('تعذر تفعيل الجلسة من الرابط. افتحي رابط إعادة التعيين من جديد.');
          return;
        }
        setReady(true);
      } catch {
        setError('حدث خطأ أثناء تجهيز الصفحة.');
      }
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleSubmit = async () => {
    setError(null);

    if (password.length < 8) {
      setError('كلمة المرور يجب أن تكون 8 أحرف على الأقل.');
      return;
    }
    if (password !== password2) {
      setError('كلمتا المرور غير متطابقتين.');
      return;
    }

    setLoading(true);
    try {
      const { error: updErr } = await supabase.auth.updateUser({ password });
      if (updErr) {
        setError(updErr.message || 'تعذر تحديث كلمة المرور.');
        return;
      }
      setDone(true);
      if (typeof window !== 'undefined' && window.history.replaceState) {
        const url = new URL(window.location.href);
        url.hash = '';
        window.history.replaceState({}, '', url.toString());
      }
      setTimeout(() => router.push('/login'), 1500);
    } catch {
      setError('حدث خطأ غير متوقع.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="min-h-screen bg-[#0f0f23] bg-cover bg-center flex items-center justify-center p-6 text-white"
      style={{ backgroundImage: "url('/images/moon-bg.jpg')" }}
    >
      <div className="w-full max-w-md bg-black/40 border border-purple-700 rounded-xl p-6 backdrop-blur-md">
        <h1 className="text-2xl font-bold text-center mb-2">إعادة تعيين كلمة المرور</h1>
        <p className="text-center text-purple-200 mb-6">ضعي كلمة مرور جديدة ثم تابعي.</p>

        {!ready && !error && (
          <div className="text-center text-sm text-purple-300">...جارٍ تجهيز الرابط</div>
        )}

        {error && (
          <div className="mb-4 rounded-md border border-red-400 bg-red-900/30 px-3 py-2 text-sm">
            {error}
          </div>
        )}

        {ready && !done && (
          <>
            <label className="block mb-2 text-sm">كلمة المرور الجديدة</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full mb-4 rounded-lg bg-black/50 border border-purple-700 px-3 py-2 focus:outline-none"
              placeholder="********"
            />

            <label className="block mb-2 text-sm">تأكيد كلمة المرور</label>
            <input
              type="password"
              value={password2}
              onChange={(e) => setPassword2(e.target.value)}
              className="w-full mb-6 rounded-lg bg-black/50 border border-purple-700 px-3 py-2 focus:outline-none"
              placeholder="********"
            />

            <button
              onClick={handleSubmit}
              disabled={loading}
              className="w-full bg-gradient-to-r from-purple-900 to-purple-700 hover:from-purple-700 hover:to-purple-900 transition rounded-lg px-4 py-2 font-semibold disabled:opacity-50"
            >
              {loading ? '...جارٍ الحفظ' : 'حفظ كلمة المرور'}
            </button>
          </>
        )}

        {done && (
          <div className="text-center">
            <div className="mb-4">✅ تم تحديث كلمة المرور بنجاح.</div>
            <div className="text-sm text-purple-200">سيتم نقلك إلى صفحة الدخول الآن…</div>
          </div>
        )}
      </div>
    </div>
  );
}