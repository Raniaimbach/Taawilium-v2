'use client';
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function Home() {
  const router = useRouter();
  useEffect(() => {
    router.push('/test'); // تحويل مباشر لصفحة التفسير
  }, [router]);
  return null;
}