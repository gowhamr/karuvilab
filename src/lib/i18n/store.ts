import { create } from 'zustand';
import { translations, Locale, getTranslation } from './index';

interface I18nState {
  locale: Locale;
  t: (path: string) => string;
  setLocale: (locale: Locale) => void;
}

export const useI18n = create<I18nState>((set, get) => ({
  locale: 'en',
  t: (path: string) => getTranslation(get().locale, path),
  setLocale: (locale: Locale) => set({ locale }),
}));
