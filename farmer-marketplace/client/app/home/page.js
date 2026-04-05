"use client";

import dynamic from 'next/dynamic';
import PageLoader from '@/components/ui/PageLoader';

const HomeContent = dynamic(() => import('@/components/HomeContent'), {
  ssr: false,
  loading: () => <PageLoader label="Loading marketplace..." />
});

export default function HomePage() {
  return <HomeContent />;
}
