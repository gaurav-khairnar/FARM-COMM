"use client";

import { createContext, useContext, useMemo } from 'react';

const messages = {
  en: {
    appName: 'Farm-Connect',
    login: 'Log in',
    register: 'Create account',
    home: 'Marketplace',
    sell: 'Sell',
    cart: 'Cart',
    orders: 'Orders',
    profile: 'Profile'
  }
};

const I18nContext = createContext({
  language: 'en',
  t: (key) => key
});

export function I18nProvider({ children }) {
  const value = useMemo(
    () => ({
      language: 'en',
      t: (key) => messages.en[key] || key
    }),
    []
  );

  return <I18nContext.Provider value={value}>{children}</I18nContext.Provider>;
}

export function useI18n() {
  return useContext(I18nContext);
}
