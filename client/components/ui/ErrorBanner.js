"use client";

import { AlertCircle } from 'lucide-react';

export default function ErrorBanner({ message }) {
  if (!message) return null;
  return (
    <div className="rounded-xl border border-rose-200 bg-rose-50 px-4 py-4 flex items-center gap-3">
      <AlertCircle size={20} className="text-rose-600 flex-shrink-0" />
      <p className="text-sm text-rose-700 font-medium">{message}</p>
    </div>
  );
}
