"use client";

export default function Button({
  children,
  type = 'button',
  variant = 'primary',
  size = 'md',
  className = '',
  disabled,
  ...props
}) {
  const variants = {
    primary: 'bg-[color:var(--primary)] text-white hover:bg-[color:var(--primary-light)] hover:shadow-md active:scale-95',
    secondary: 'bg-[color:var(--secondary)] text-white hover:bg-[color:var(--secondary-light)] hover:shadow-md active:scale-95',
    accent: 'bg-[color:var(--accent)] text-[color:var(--text)] hover:bg-[color:var(--accent-light)] hover:shadow-md active:scale-95',
    outline: 'bg-white text-[color:var(--text)] border-2 border-[color:var(--primary)] hover:bg-[color:var(--primary)] hover:text-white',
    ghost: 'bg-transparent text-[color:var(--text)] hover:bg-[color:var(--neutral)]',
    danger: 'bg-[color:var(--danger)] text-white hover:opacity-90 active:scale-95'
  };
  
  const sizes = {
    sm: 'px-3 py-1.5 text-xs',
    md: 'px-5 py-2.5 text-sm',
    lg: 'px-7 py-3.5 text-base'
  };

  return (
    <button
      type={type}
      disabled={disabled}
      className={`inline-flex items-center justify-center gap-2 rounded-xl font-semibold transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed ${variants[variant]} ${sizes[size]} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
}
