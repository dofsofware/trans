import React from 'react';
import { Client } from '../../types/client';
import ExportButton from './ExportButton';
import { format } from 'date-fns';
import { useLanguage } from '../../contexts/LanguageContext';

interface ClientExportProps {
  clients: Client[];
  buttonClassName?: string;
  menuClassName?: string;
  menuItemClassName?: string;
}

const ClientExport: React.FC<ClientExportProps> = ({
  clients,
  buttonClassName,
  menuClassName,
  menuItemClassName
}) => {
  const { t } = useLanguage();

  // Prepare headers for export
  const headers = [
    'ID',
    t('name'),
    t('company'),
    t('email'),
    t('phone'),
    t('address'),
    t('city'),
    t('country'),
    t('status'),
    t('creation_date')
  ];

  // Format data for export
  const formatDataForExport = (data: Client[]) => {
    return data.map(client => [
      client.id,
      client.name || '',
      client.company || '',
      client.email || '',
      client.phone || '',
      client.address || '',
      client.city || '',
      client.country || '',
      client.status || '',
      client.createdAt ? format(new Date(client.createdAt), 'dd/MM/yyyy') : ''
    ]);
  };

  // Translations for export button
  const translations = {
    export: t('export'),
    exportPdf: t('export_pdf'),
    exportExcel: t('export_excel'),
    exportCsv: t('export_csv')
  };

  return (
    <ExportButton
      data={clients}
      headers={headers}
      filename={`clients_${format(new Date(), 'yyyy-MM-dd')}`}
      title={t('clients_list')}
      orientation="portrait"
      buttonClassName={buttonClassName}
      menuClassName={menuClassName}
      menuItemClassName={menuItemClassName}
      translations={translations}
      formatDataForExport={formatDataForExport}
      customPdfConfig={{
        headStyles: { fillColor: [41, 128, 185], textColor: 255 },
      }}
    />
  );
};

export default ClientExport;