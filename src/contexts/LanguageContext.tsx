import React, { createContext, useContext, useState } from 'react';

type Language = 'en' | 'fr';

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string) => string;
}

const translations = {
  en: {
    shipment_type: 'Shipment Type',
    air_shipment: 'Air Freight',
    sea_shipment: 'Sea Freight',
    type_air: 'Air',
    type_sea: 'Sea'
  },
  fr: {
    shipment_type: 'Type d\'expédition',
    air_shipment: 'Fret aérien',
    sea_shipment: 'Fret maritime',
    type_air: 'Aérien',
    type_sea: 'Maritime'
  }
};

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [language, setLanguage] = useState<Language>('en');

  const t = (key: string): string => {
    return translations[language][key as keyof typeof translations['en']] || key;
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
}