"use client";

export default function Card({ className = '', hover = false, children }) {
  return (
    <section className={`surface-card ${hover ? 'transition-all duration-300 hover:shadow-xl hover:-translate-y-1' : ''} ${className}`}>
      {children}
    </section>
  );
}
