import React from 'react';
import ExportButton from './ExportButton';
import { format } from 'date-fns';
import { useLanguage } from '../../contexts/LanguageContext';

interface Column<T> {
  // Clé unique pour la colonne
  key: string;
  // Titre de la colonne (sera utilisé comme en-tête)
  title: string;
  // Fonction pour extraire la valeur de la colonne à partir d'un élément
  render: (item: T) => React.ReactNode | string | number;
}

interface TableExportProps<T> {
  // Les données à exporter
  data: T[];
  // Définition des colonnes
  columns: Column<T>[];
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

function TableExport<T>({ 
  data,
  columns,
  filenamePrefix,
  title,
  orientation = 'landscape',
  buttonClassName,
  menuClassName,
  menuItemClassName,
  customPdfConfig
}: TableExportProps<T>) {
  const { t } = useLanguage();
  
  // Extraire les en-têtes à partir des définitions de colonnes
  const headers = columns.map(column => column.title);

  // Fonction pour formater les données pour l'exportation
  const formatData = (data: T[]) => {
    return data.map(item => {
      return columns.map(column => {
        const value = column.render(item);
        // Convertir les valeurs React en chaînes de caractères
        if (React.isValidElement(value)) {
          return '';
        }
        return value !== undefined && value !== null ? String(value) : '';
      });
    });
  };

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

export default TableExport;