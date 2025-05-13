import React, { createContext, useContext, useState, ReactNode } from 'react';

type Language = 'en' | 'fr';

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string, params?: Record<string, any>) => string;
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
    statsInTransit: 'In Transit',
    statsInWarehouse: 'In Warehouse',
    statsTotalShipments: 'Total Shipments',
    statsIssues: 'Issues',
    hereIsOverview: 'Here\'s an overview of your shipments',
    in_transit:'In Transit',
    warehouse: 'In Warehouse',
    all: 'All',
    created_at: 'Created on',
    shipment_timeLine: 'Shipment Timeline',
    in_customs_clearance: 'In Customs Clearance',
    shipment_created: 'Shipment Created',
    processing_started: 'Processing Started',
    arrived_at_warehouse: 'Arrived at Warehouse',
    delivered_successfully: 'Delivered Successfully',
    issue_reported: 'Issue Reported',
    my_shipments: 'My Shipments',
    search_shipments: 'Search shipments...',
    filter_by_status: 'Filter by Status',
    track_the_progress: 'Track the progress of your shipment',
    download: 'Download',
    no_documents_yet: 'No documents available yet.',
    quick_actions: 'Quick Actions',
    contact_agent: 'Contact Agent',
    notifications_description: 'Stay updated with your shipment status and important alerts',
    all_notifications: 'All Notifications',
    unread_count: (params: { count: number }) => `You have ${params.count} unread notifications`,
    mark_all_as_read: 'Mark all as read',
    no_notifications: 'No notifications',
    no_notifications_description: 'You\'re all caught up! No new notifications at the moment.',
    view_all_notifications: 'View all notifications'
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
    to: 'Vers',
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
    statsInTransit: 'En Transit',
    statsInWarehouse: 'En Entrepôt',
    statsTotalShipments: 'Total des Expéditions',
    statsIssues: 'Problèmes',
    hereIsOverview: 'Voici un aperçu de vos expéditions',
    in_transit:'En Transit',
    warehouse: 'En Entrepôt',
    all: 'Tout',
    created_at: 'Créé en',
    shipment_timeLine: 'Calendrier d\'expédition',
    in_customs_clearance: 'En dédouanement',
    shipment_created: 'Expédition créée',
    processing_started: 'Traitement démarré',
    arrived_at_warehouse: 'Arrivé à l\'entrepôt',
    delivered_successfully: 'Livré avec succès',
    issue_reported: 'Problème signalé',
    my_shipments: 'Mes Expéditions',
    search_shipments: 'Rechercher expédition...',
    filter_by_status: 'Filtre par statut',
    track_the_progress: 'Suivez la progression de votre envoi',
    download: 'Télécharger',
    no_documents_yet: 'Aucun document disponible pour le moment.',
    quick_actions: 'Actions rapide',
    contact_agent: 'Contacter un agent',
    notifications_description: 'Restez informé de l\'état de vos expéditions et des alertes importantes',
    all_notifications: 'Toutes les notifications',
    unread_count: (params: { count: number }) => `Vous avez ${params.count} notifications non lues`,
    mark_all_as_read: 'Tout marquer comme lu',
    no_notifications: 'Aucune notification',
    no_notifications_description: 'Vous êtes à jour ! Aucune nouvelle notification pour le moment.',
    view_all_notifications: 'Voir toutes les notifications'
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
  const [language, setLanguage] = useState<Language>('fr');

  const t = (key: string, params?: Record<string, any>): string => {
    const translation = translations[language][key as keyof typeof translations['fr']];
    if (typeof translation === 'function' && params) {
      return translation(params);
    }
    return translation || key;
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
};