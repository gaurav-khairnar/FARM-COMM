"use client";

import { forwardRef } from 'react';

const Select = forwardRef(function Select({ label, error, children, className = '', ...props }, ref) {
  return (
    <label className="block space-y-1.5">
      {label && <span className="text-sm font-medium text-[color:var(--text)]">{label}</span>}
      <select
        ref={ref}
        className={`w-full rounded-xl border border-[color:var(--line)] bg-white px-3 py-2.5 text-sm outline-none focus:border-[color:var(--primary)] ${className}`}
        {...props}
      >
        {children}
      </select>
      {error ? <span className="text-xs text-[color:var(--danger)]">{error}</span> : null}
    </label>
  );
});

export default Select;
