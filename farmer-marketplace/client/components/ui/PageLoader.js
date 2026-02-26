"use client";

import { Loader2 } from 'lucide-react';

export default function PageLoader({ label = 'Loading...' }) {
  return (
    <div className="flex flex-col items-center justify-center min-h-[50vh] gap-4">
      <Loader2 size={40} className="animate-spin text-[color:var(--primary)]" />
      <p className="text-sm text-[color:var(--text-muted)] font-medium">{label}</p>
    </div>
  );
}
