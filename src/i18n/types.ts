export interface Translations {
  navigation: {
    home: string;
    about: string;
    projects: string;
    contact: string;
  };
  hero: {
    greeting: string;
    name: string;
    title: string;
    description: string;
    downloadCV: string;
    contactMe: string;
  };
  timeline: {
    title: string;
    experience: string;
    education: string;
  };
  projects: {
    title: string;
    viewProject: string;
    viewCode: string;
  };
  contact: {
    title: string;
    subtitle: string;
    name: string;
    email: string;
    message: string;
    send: string;
    success: string;
    error: string;
  };
  footer: {
    madeWith: string;
  };
}

export type Language = 'es' | 'en';

export interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string, fallback?: string) => string;
}

export interface UseTranslationReturn {
  t: (key: string, fallback?: string) => string;
  language: Language;
  setLanguage: (lang: Language) => void;
}