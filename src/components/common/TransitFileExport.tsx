import React from 'react';
import { TransitFile } from '../../types/transitFile';
import ExportButton from './ExportButton';
import { format } from 'date-fns';
import { useLanguage } from '../../contexts/LanguageContext';

interface TransitFileExportProps {
  files: TransitFile[];
  getClientNames: (clientIds: string[]) => string;
  getCurrentEvent: (file: TransitFile) => string;
  buttonClassName?: string;
  menuClassName?: string;
  menuItemClassName?: string;
}

const TransitFileExport: React.FC<TransitFileExportProps> = ({
  files,
  getClientNames,
  getCurrentEvent,
  buttonClassName,
  menuClassName,
  menuItemClassName
}) => {
  const { t } = useLanguage();

  // Prepare headers for export
  const headers = [
    t('reference'),
    t('bl_number'),
    t('current_event'),
    t('transport_type'),
    t('shipment_type'),
    t('product_type'),
    t('origin'),
    t('destination'),
    t('clients'),
    t('creation_date'),
    t('volume'),
    t('weight')
  ];

  // Format data for export
  const formatDataForExport = (data: TransitFile[]) => {
    return data.map(file => [
      file.reference,
      file.blNumber,
      getCurrentEvent(file),
      t(file.transportType),
      t(file.shipmentType),
      t(file.productType),
      file.origin,
      file.destination,
      getClientNames(file.clientIds),
      format(new Date(file.createdAt), 'dd/MM/yyyy'),
      file.totalVolume ? `${file.totalVolume}` : '-',
      file.totalWeight ? `${file.totalWeight}` : '-'
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
      data={files}
      headers={headers}
      filename={`transit_files_${format(new Date(), 'yyyy-MM-dd')}`}
      title={t('transit_files_list')}
      orientation="landscape"
      buttonClassName={buttonClassName}
      menuClassName={menuClassName}
      menuItemClassName={menuItemClassName}
      translations={translations}
      formatDataForExport={formatDataForExport}
    />
  );
};

export default TransitFileExport;