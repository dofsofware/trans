import React from 'react';
import ExportButton from './ExportButton';
import { format } from 'date-fns';
import { useLanguage } from '../../contexts/LanguageContext';

interface GenericExportProps<T> {
  // Les données à exporter
  data: T[];
  // Fonction pour obtenir les en-têtes (peut être traduits)
  getHeaders: () => string[];
  // Fonction pour formater les données pour l'exportation
  formatData: (data: T[]) => any[][];
  // Préfixe du nom de fichier (sera complété par la date)
  filenamePrefix: string;
  // Titre du document exporté
  title: string;
  // Orientation du document PDF (portrait ou paysage)
  orientation?: 'portrait' | 'landscape';
  // Classes CSS pour personnaliser l'apparence
  buttonClassName?: string;
  menuClassName?: string;
  menuItemClassName?: string;
  // Configuration personnalisée pour le PDF
  customPdfConfig?: {
    styles?: any;
    headStyles?: any;
    alternateRowStyles?: any;
    margin?: any;
  };
}

function GenericExport<T>({ 
  data,
  getHeaders,
  formatData,
  filenamePrefix,
  title,
  orientation = 'landscape',
  buttonClassName,
  menuClassName,
  menuItemClassName,
  customPdfConfig
}: GenericExportProps<T>) {
  const { t } = useLanguage();
  
  // Obtenir les en-têtes
  const headers = getHeaders();

  // Traductions pour les boutons d'exportation
  const translations = {
    export: t('export'),
    exportPdf: t('export_pdf'),
    exportExcel: t('export_excel'),
    exportCsv: t('export_csv')
  };

  return (
    <ExportButton
      data={data}
      headers={headers}
      filename={`${filenamePrefix}_${format(new Date(), 'yyyy-MM-dd')}`}
      title={title}
      orientation={orientation}
      buttonClassName={buttonClassName}
      menuClassName={menuClassName}
      menuItemClassName={menuItemClassName}
      translations={translations}
      formatDataForExport={formatData}
      customPdfConfig={customPdfConfig}
    />
  );
}

export default GenericExport;