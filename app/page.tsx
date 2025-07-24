// app/page.tsx
'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function HomePage() {
  const router = useRouter();

  useEffect(() => {
    router.push('/test'); // يمكنك تغيير المسار لاحقًا
  }, [router]);

  return null;
}