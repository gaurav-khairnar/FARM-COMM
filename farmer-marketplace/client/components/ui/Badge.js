"use client";

export default function Badge({ children, tone = 'info', icon, className = '' }) {
  const tones = {
    info: 'bg-sky-50 text-sky-700 border-sky-200',
    primary: 'bg-emerald-50 text-emerald-700 border-emerald-200',
    secondary: 'bg-orange-50 text-orange-700 border-orange-200',
    accent: 'bg-amber-50 text-amber-700 border-amber-200',
    success: 'bg-green-50 text-green-700 border-green-200',
    warning: 'bg-yellow-50 text-yellow-700 border-yellow-200',
    danger: 'bg-red-50 text-red-700 border-red-200',
    neutral: 'bg-gray-50 text-gray-700 border-gray-200'
  };
  
  return (
    <span className={`inline-flex items-center gap-1.5 rounded-full border px-3 py-1 text-xs font-semibold capitalize ${tones[tone]} ${className}`}>
      {icon && <span className="inline-flex">{icon}</span>}
      {children}
    </span>
  );
}
