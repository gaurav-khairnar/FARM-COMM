"use client";

import { useEffect, useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { authStorage } from '@/lib/auth';

export function useSession({ requiredRole } = {}) {
  const router = useRouter();
  const pathname = usePathname();
  const [user, setUser] = useState(null);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    // Prevent redirect loops by checking current path
    if (pathname === '/login' || pathname === '/register') {
      return;
    }

    const token = authStorage.getToken();
    const currentUser = authStorage.getUser();

    if (!token || !currentUser) {
      router.push('/login');
      return;
    }

    if (requiredRole && currentUser.role !== requiredRole && currentUser.role !== 'admin') {
      router.push('/home');
      return;
    }

    setUser(currentUser);
    setReady(true);
  }, [requiredRole, router, pathname]);

  return { user, ready };
}
