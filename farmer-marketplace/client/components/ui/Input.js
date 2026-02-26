"use client";

import { forwardRef } from 'react';

const Input = forwardRef(function Input({ label, error, icon, className = '', ...props }, ref) {
  return (
    <label className="block space-y-1.5">
      {label && <span className="text-sm font-medium text-[color:var(--text)]">{label}</span>}
      <div className="relative">
        {icon && (
          <div className="absolute left-3 top-1/2 -translate-y-1/2 text-[color:var(--text-muted)]">
            {icon}
          </div>
        )}
        <input
          ref={ref}
          className={`w-full rounded-xl border bg-white text-sm transition placeholder:text-[color:var(--text-muted)] focus:border-[color:var(--primary)] focus:outline-none focus:ring-2 focus:ring-[color:var(--primary)]/20 ${
            icon ? 'pl-10 pr-3 py-2.5' : 'px-3 py-2.5'
          } ${
            error ? 'border-[color:var(--danger)] focus:border-[color:var(--danger)] focus:ring-[color:var(--danger)]/20' : 'border-[color:var(--line)]'
          } ${className}`}
          {...props}
        />
      </div>
      {error ? <span className="text-xs text-[color:var(--danger)] flex items-center gap-1">{error}</span> : null}
    </label>
  );
});

export default Input;
