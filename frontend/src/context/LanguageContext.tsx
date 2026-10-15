import React, { createContext, useContext, useState, useEffect } from 'react';
import { Language } from '../types';

interface Translations {
  appName: string;
  tagline: string;
  dashboard: string;
  partIdentifier: string;
  problemSolver: string;
  studyAssistant: string;
  calculator: string;
  maintenance: string;
  knowledgeLibrary: string;
  savedResults: string;
  profile: string;
  adminDashboard: string;
  welcome: string;
  quickActions: string;
  recentActivity: string;
  searchPlaceholder: string;
  guestUser: string;
  logout: string;
  login: string;
  signup: string;
  safetyAlert: string;
}

const translationsDict: Record<Language, Translations> = {
  en: {
    appName: 'MechNova',
    tagline: 'Intelligence for Every Machine',
    dashboard: 'Dashboard',
    partIdentifier: 'Identify a Part',
    problemSolver: 'AI Problem Solver',
    studyAssistant: 'Study Assistant',
    calculator: 'Engineering Calculator',
    maintenance: 'Maintenance Records',
    knowledgeLibrary: 'Machine Knowledge',
    savedResults: 'Saved Results',
    profile: 'User Profile',
    adminDashboard: 'Fleet Admin',
    welcome: 'Welcome to MechNova',
    quickActions: 'Quick Engineering Actions',
    recentActivity: 'Recent Diagnostics & Calculations',
    searchPlaceholder: 'Search components, formulas, problems, machines...',
    guestUser: 'Guest Mode',
    logout: 'Sign Out',
    login: 'Sign In',
    signup: 'Create Account',
    safetyAlert: 'OSHA / LOTO Safety Warning'
  },
  gu: {
    appName: 'મિકનોવા (MechNova)',
    tagline: 'તમારો સ્માર્ટ મિકેનિકલ સહાયક',
    dashboard: 'ડેશબોર્ડ',
    partIdentifier: 'પાર્ટ ઓળખો (AI)',
    problemSolver: 'મિકેનિકલ સમસ્યા ઉકેલનાર',
    studyAssistant: 'એન્જિનિયરિંગ સ્ટડી સહાયક',
    calculator: 'એન્જિનિયરિંગ કેલ્ક્યુલેટર',
    maintenance: 'મેન્ટેનન્સ રેકોર્ડ્સ',
    knowledgeLibrary: 'મશીન નોલેજ લાઇબ્રેરી',
    savedResults: 'સાચવેલ પરિણામો',
    profile: 'યુઝર પ્રોફાઇલ',
    adminDashboard: 'એડમિન કંટ્રોલ',
    welcome: 'મિકનોવામાં આપનું સ્વાગત છે',
    quickActions: 'ઝડપી એન્જિનિયરિંગ કાર્યો',
    recentActivity: 'તાજેતરની પ્રવૃત્તિ',
    searchPlaceholder: 'પાર્ટ્સ, સૂત્રો, સમસ્યાઓ, મશીનો શોધો...',
    guestUser: 'ગેસ્ટ મોડ',
    logout: 'લૉગ આઉટ',
    login: 'સાઇન ઇન',
    signup: 'નવું ખાતું બનાવો',
    safetyAlert: 'સુરક્ષા ચેતવણી (LOTO)'
  },
  hi: {
    appName: 'मेकनोवा (MechNova)',
    tagline: 'आपका स्मार्ट मैकेनिकल सहायक',
    dashboard: 'डैशबोर्ड',
    partIdentifier: 'पुर्जे की पहचान (AI)',
    problemSolver: 'मैकेनिकल समस्या निवारक',
    studyAssistant: 'इंजीनियरिंग अध्ययन सहायक',
    calculator: 'इंजीनियरिंग कैलकुलेटर',
    maintenance: 'रखरखाव रिकॉर्ड',
    knowledgeLibrary: 'मशीन ज्ञान पुस्तकालय',
    savedResults: 'सहेजे गए परिणाम',
    profile: 'उपयोगकर्ता प्रोफ़ाइल',
    adminDashboard: 'व्यवस्थापक डैशबोर्ड',
    welcome: 'मेकनोवा में आपका स्वागत है',
    quickActions: 'त्वरित इंजीनियरिंग कार्य',
    recentActivity: 'हाल की गतिविधियां',
    searchPlaceholder: 'पुर्जे, सूत्र, समस्याएं, मशीनें खोजें...',
    guestUser: 'अतिथि मोड',
    logout: 'लॉग आउट',
    login: 'साइन इन',
    signup: 'खाता बनाएं',
    safetyAlert: 'सुरक्षा चेतावनी (LOTO)'
  }
};

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: Translations;
}

const LanguageContext = createContext<LanguageContextType>({
  language: 'en',
  setLanguage: () => {},
  t: translationsDict.en,
});

export const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [language, setLanguageState] = useState<Language>(() => {
    return (localStorage.getItem('mechnova_lang') as Language) || 'en';
  });

  const setLanguage = (lang: Language) => {
    setLanguageState(lang);
    localStorage.setItem('mechnova_lang', lang);
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t: translationsDict[language] }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => useContext(LanguageContext);
