import { create } from 'zustand';
import { getTranslation } from './index';
export const useI18n = create((set, get) => ({
    locale: 'en',
    t: (path) => getTranslation(get().locale, path),
    setLocale: (locale) => set({ locale }),
}));
