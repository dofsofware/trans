import React, { createContext, useContext, useState, ReactNode } from 'react';

type Language = 'en' | 'fr';

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string) => string;
}

const translations = {
  en: {
    dashboard: 'Dashboard',
    shipments: 'My Shipments',
    documents: 'Documents',
    messages: 'Messages',
    payments: 'Payments',
    profile: 'Profile',
    settings: 'Settings',
    signOut: 'Sign out',
    welcome: 'Welcome back',
    notifications: 'Notifications',
    support: 'Need assistance?',
    contactSupport: 'Contact Support',
    inTransit: 'In Transit',
    inWarehouse: 'In Warehouse',
    totalShipments: 'Total Shipments',
    issues: 'Issues',
    activeShipments: 'Active Shipments',
    viewAll: 'View all',
    recentActivity: 'Recent Activity',
    noActiveShipments: 'You don\'t have any active shipments at the moment.',
    updatedOn: 'Updated on',
    from: 'From',
    to: 'To',
    weight: 'Weight',
    volume: 'Volume',
    status: 'Status',
    origin: 'Origin',
    destination: 'Destination',
    description: 'Description',
    estimatedDelivery: 'Estimated Delivery',
    pending: 'Pending',
    draft: 'Draft',
    processing: 'Processing',
    customs: 'Customs Clearance',
    delivered: 'Delivered',
    issue: 'Issue',
    // Dashboard stats
    statsInTransit: 'In Transit',
    statsInWarehouse: 'In Warehouse',
    statsTotalShipments: 'Total Shipments',
    statsIssues: 'Issues',
    hereIsOverview: 'Here\'s an overview of your shipments'
  },
  fr: {
    dashboard: 'Tableau de bord',
    shipments: 'Mes expéditions',
    documents: 'Documents',
    messages: 'Messages',
    payments: 'Paiements',
    profile: 'Profil',
    settings: 'Paramètres',
    signOut: 'Déconnexion',
    welcome: 'Bienvenue',
    notifications: 'Notifications',
    support: 'Besoin d\'aide ?',
    contactSupport: 'Contacter le support',
    inTransit: 'En transit',
    inWarehouse: 'En entrepôt',
    totalShipments: 'Total des expéditions',
    issues: 'Problèmes',
    activeShipments: 'Expéditions actives',
    viewAll: 'Voir tout',
    recentActivity: 'Activité récente',
    noActiveShipments: 'Vous n\'avez aucune expédition active en ce moment.',
    updatedOn: 'Mis à jour le',
    from: 'De',
    to: 'À',
    weight: 'Poids',
    volume: 'Volume',
    status: 'Statut',
    origin: 'Origine',
    destination: 'Destination',
    description: 'Description',
    estimatedDelivery: 'Livraison estimée',
    pending: 'En attente',
    draft: 'Brouillon',
    processing: 'En traitement',
    customs: 'Dédouanement',
    delivered: 'Livré',
    issue: 'Problème',
    // Dashboard stats
    statsInTransit: 'En Transit',
    statsInWarehouse: 'En Entrepôt',
    statsTotalShipments: 'Total des Expéditions',
    statsIssues: 'Problèmes',
    hereIsOverview: 'Voici un aperçu de vos expéditions'
  },
};

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};

export const LanguageProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [language, setLanguage] = useState<Language>('en');

  const t = (key: string): string => {
    return translations[language][key as keyof typeof translations['en']] || key;
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
};