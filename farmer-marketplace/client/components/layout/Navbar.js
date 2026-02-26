"use client";

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { Dialog, DialogPanel } from '@headlessui/react';
import { Menu, X, ShoppingBasket, LayoutGrid, PackageOpen, UserCircle2, Tractor, LogOut, Sprout, Search } from 'lucide-react';
import { useState, useEffect } from 'react';
import { authStorage } from '@/lib/auth';
import { useI18n } from '@/lib/i18n';
import { apiFetch } from '@/lib/api';

export default function Navbar() {
  const pathname = usePathname();
  const router = useRouter();
  const { t } = useI18n();
  const [user, setUser] = useState(null);
  const [mounted, setMounted] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    setMounted(true);
    setUser(authStorage.getUser());
  }, []);

  // Don't render navbar on auth pages or until mounted (prevents hydration errors)
  if (!mounted || !user || pathname === '/login' || pathname === '/register') return null;

  const links = [
    { href: '/home', label: t('home'), icon: LayoutGrid },
    { href: '/cart', label: t('cart'), icon: ShoppingBasket },
    { href: '/orders', label: t('orders'), icon: PackageOpen },
    { href: '/profile', label: t('profile'), icon: UserCircle2 },
    ...(user.role === 'farmer' || user.role === 'admin' ? [{ href: '/sell', label: t('sell'), icon: Tractor }] : [])
  ];

  const logout = async () => {
    try {
      await apiFetch('/auth/logout', { method: 'POST' });
    } catch (_error) {
      // Session clearing is local-first for stateless JWT.
    } finally {
      authStorage.clearSession();
      router.push('/login');
    }
  };

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/home?search=${encodeURIComponent(searchQuery.trim())}`);
    }
  };

  return (
    <header className="sticky top-0 z-50 border-b border-[color:var(--line)] bg-white/95 backdrop-blur-lg shadow-sm">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between gap-4 px-4">
        <Link href="/home" className="flex items-center gap-2 text-lg font-bold text-[color:var(--primary)] hover:scale-105 transition-transform flex-shrink-0">
          <Sprout size={24} className="text-[color:var(--accent)]" />
          <span className="text-gradient hidden sm:inline">{t('appName')}</span>
        </Link>

        {/* Search Bar */}
        <form onSubmit={handleSearch} className="hidden md:flex items-center flex-1 max-w-md">
          <div className="relative w-full">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search products..."
              className="w-full h-10 pl-10 pr-4 text-sm border border-[color:var(--line)] rounded-xl bg-gray-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-[color:var(--primary)] focus:border-transparent transition-all"
            />
          </div>
        </form>

        <nav className="hidden items-center gap-1 md:flex flex-shrink-0">
          {links.map((link) => {
            const Icon = link.icon;
            const active = pathname === link.href;
            return (
              <Link
                key={link.href}
                href={link.href}
                className={`inline-flex items-center gap-2 rounded-xl px-4 py-2 text-sm font-medium transition-all duration-300 ${
                  active 
                    ? 'bg-[color:var(--primary)] text-white shadow-md' 
                    : 'text-[color:var(--text)] hover:bg-[color:var(--neutral)] hover:text-[color:var(--primary)]'
                }`}
              >
                <Icon size={16} />
                {link.label}
              </Link>
            );
          })}
          <button 
            onClick={() => logout()} 
            className="ml-2 inline-flex items-center gap-2 rounded-xl border-2 border-[color:var(--line)] px-4 py-2 text-sm font-medium hover:border-[color:var(--danger)] hover:bg-[color:var(--danger)] hover:text-white transition-all duration-300"
          >
            <LogOut size={16} />
            Logout
          </button>
        </nav>

        <button 
          className="rounded-xl border border-[color:var(--line)] p-2 hover:bg-[color:var(--neutral)] transition-colors md:hidden" 
          onClick={() => setMobileOpen(true)}
        >
          <Menu size={18} />
        </button>
      </div>

      <Dialog open={mobileOpen} onClose={setMobileOpen} className="relative z-50 md:hidden">
        <div className="fixed inset-0 bg-black/30 backdrop-blur-sm" aria-hidden="true" />
        <div className="fixed inset-0 flex justify-end">
          <DialogPanel className="w-80 bg-white p-6 shadow-2xl animate-slide-in-right">
            <div className="mb-6 flex items-center justify-between">
              <span className="font-bold text-lg text-[color:var(--primary)]">{t('appName')}</span>
              <button className="rounded-lg border border-[color:var(--line)] p-2 hover:bg-[color:var(--neutral)] transition-colors" onClick={() => setMobileOpen(false)}>
                <X size={16} />
              </button>
            </div>
            <div className="space-y-2">
              {links.map((link) => {
                const Icon = link.icon;
                const active = pathname === link.href;
                return (
                  <Link 
                    key={link.href} 
                    href={link.href} 
                    onClick={() => setMobileOpen(false)} 
                    className={`flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium transition-all ${
                      active 
                        ? 'bg-[color:var(--primary)] text-white shadow-md' 
                        : 'hover:bg-[color:var(--neutral)]'
                    }`}
                  >
                    <Icon size={18} />
                    {link.label}
                  </Link>
                );
              })}
              <button 
                onClick={() => logout()} 
                className="w-full flex items-center gap-3 rounded-xl bg-[color:var(--danger)] px-4 py-3 text-sm font-semibold text-white shadow-md hover:opacity-90 transition-opacity"
              >
                <LogOut size={18} />
                Logout
              </button>
            </div>
          </DialogPanel>
        </div>
      </Dialog>
    </header>
  );
}
