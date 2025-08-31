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
    subtitle: string;
    experience: string;
    education: string;
    viewMore: string;
    viewLess: string;
    achievements: string;
    viewProjects: string;
    types: {
      work: string;
      education: string;
      project: string;
    };
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
    copyright: string;
  };
  meta: {
    title: string;
    description: string;
    ogTitle: string;
    ogDescription: string;
    twitterTitle: string;
    twitterDescription: string;
  };
  timelineData: {
    [key: string]: {
      title: string;
      company: string;
      location: string;
      period: string;
      description: string;
      achievements: string[];
    };
  };
  technologies: {
    [key: string]: string;
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