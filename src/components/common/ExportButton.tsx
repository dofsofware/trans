import React, { useState, useRef, useEffect } from 'react';
import { Download } from 'lucide-react';
import { jsPDF } from 'jspdf';
import autoTable from 'jspdf-autotable';
import { format } from 'date-fns';

interface ExportButtonProps {
  data: any[] | Record<string, any>[];
  headers: string[];
  filename?: string;
  title?: string;
  orientation?: 'portrait' | 'landscape';
  buttonClassName?: string;
  menuClassName?: string;
  menuItemClassName?: string;
  translations?: {
    export: string;
    exportPdf: string;
    exportExcel: string;
    exportCsv: string;
  };
  formatDataForExport?: (data: any[]) => any[][];
  customPdfConfig?: {
    styles?: any;
    headStyles?: any;
    alternateRowStyles?: any;
    margin?: any;
  };
}

const ExportButton: React.FC<ExportButtonProps> = ({
  data,
  headers,
  filename = `export_${format(new Date(), 'yyyy-MM-dd')}`,
  title = 'Export',
  orientation = 'landscape',
  buttonClassName = 'inline-flex items-center justify-center px-4 py-2.5 border border-gray-300 rounded-lg bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors text-sm sm:text-base',
  menuClassName = 'absolute top-full right-0 mt-2 w-48 rounded-md shadow-lg bg-white dark:bg-gray-800 ring-1 ring-black ring-opacity-5 z-50',
  menuItemClassName = 'block w-full text-left px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700',
  translations = {
    export: 'Export',
    exportPdf: 'Export as PDF',
    exportExcel: 'Export as Excel',
    exportCsv: 'Export as CSV'
  },
  formatDataForExport,
  customPdfConfig
}) => {
  const [showExportOptions, setShowExportOptions] = useState(false);
  const exportMenuRef = useRef<HTMLDivElement>(null);

  // Format data for export if a custom formatter is provided
  const getFormattedData = () => {
    if (formatDataForExport) {
      return formatDataForExport(data);
    }

    // Default formatting: convert objects to arrays
    if (data.length > 0 && typeof data[0] === 'object' && !Array.isArray(data[0])) {
      return data.map(item => {
        if (Array.isArray(item)) return item;
        return headers.map(header => item[header] || '');
      });
    }

    return data;
  };

  // Close export menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (exportMenuRef.current && !exportMenuRef.current.contains(event.target as Node)) {
        setShowExportOptions(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const exportToPDF = () => {
    const tableData = getFormattedData();

    // Initialize PDF with specified orientation
    const doc = new jsPDF({
      orientation: orientation
    });

    // Add title
    doc.setFontSize(16);
    doc.text(title, 14, 15);

    // Add export date
    doc.setFontSize(10);
    doc.text(format(new Date(), 'dd/MM/yyyy HH:mm'), 14, 22);

    // Generate table with default or custom config
    const tableConfig = {
      head: [headers],
      body: tableData,
      startY: 30,
      styles: { fontSize: 8 },
      headStyles: { fillColor: [51, 51, 51] },
      alternateRowStyles: { fillColor: [245, 245, 245] },
      margin: { top: 30 },
      ...customPdfConfig
    };

    autoTable(doc, tableConfig);

    // Save the PDF
    doc.save(`${filename}.pdf`);
  };

  const exportToCSV = () => {
    const tableData = getFormattedData();
    
    // Create CSV header
    let csvContent = headers.join(',') + '\n';
    
    // Add data rows
    tableData.forEach(row => {
      // Escape commas in cells
      const escapedRow = row.map(cell => {
        const cellStr = String(cell);
        // If cell contains comma, quotes, or newlines, wrap in quotes
        if (cellStr.includes(',') || cellStr.includes('"') || cellStr.includes('\n')) {
          // Escape quotes by doubling them
          return '"' + cellStr.replace(/"/g, '""') + '"';
        }
        return cellStr;
      });
      csvContent += escapedRow.join(',') + '\n';
    });
    
    // Create Blob for CSV file with BOM for UTF-8
    const BOM = new Uint8Array([0xEF, 0xBB, 0xBF]);
    const blob = new Blob([BOM, csvContent], { type: 'text/csv;charset=utf-8;' });
    
    // Create download link
    downloadFile(blob, `${filename}.csv`);
  };

  const exportToExcel = () => {
    const tableData = getFormattedData();
    
    // Create HTML for Excel
    let htmlContent = `
      <html xmlns:o="urn:schemas-microsoft-com:office:office" xmlns:x="urn:schemas-microsoft-com:office:excel" xmlns="http://www.w3.org/TR/REC-html40">
      <head>
        <meta charset="UTF-8">
        <!--[if gte mso 9]>
        <xml>
          <x:ExcelWorkbook>
            <x:ExcelWorksheets>
              <x:ExcelWorksheet>
                <x:Name>Sheet 1</x:Name>
                <x:WorksheetOptions>
                  <x:DisplayGridlines/>
                </x:WorksheetOptions>
              </x:ExcelWorksheet>
            </x:ExcelWorksheets>
          </x:ExcelWorkbook>
        </xml>
        <![endif]-->
        <style>
          table, th, td {
            border-collapse: collapse;
            font-family: Arial, sans-serif;
            font-size: 10pt;
          }
          th {
            background-color: #f2f2f2;
            font-weight: bold;
            text-align: center;
          }
        </style>
      </head>
      <body>
        <table>
          <thead>
            <tr>
    `;
    
    // Add headers
    headers.forEach(header => {
      htmlContent += `<th>${header}</th>`;
    });
    
    htmlContent += `
            </tr>
          </thead>
          <tbody>
    `;
    
    // Add data rows
    tableData.forEach(row => {
      htmlContent += '<tr>';
      row.forEach(cell => {
        // Escape HTML special characters
        const cellStr = String(cell)
          .replace(/&/g, '&amp;')
          .replace(/</g, '&lt;')
          .replace(/>/g, '&gt;')
          .replace(/"/g, '&quot;')
          .replace(/'/g, '&#039;')
          .replace(/\n/g, '<br>');
        
        htmlContent += `<td>${cellStr}</td>`;
      });
      htmlContent += '</tr>';
    });
    
    // Close HTML document
    htmlContent += `
          </tbody>
        </table>
      </body>
      </html>
    `;
    
    // Create Blob for HTML file
    const blob = new Blob([htmlContent], { type: 'application/vnd.ms-excel;charset=utf-8;' });
    
    // Create download link
    downloadFile(blob, `${filename}.xls`);
  };

  // Helper function to download files
  const downloadFile = (blob: Blob, filename: string) => {
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    
    link.setAttribute('href', url);
    link.setAttribute('download', filename);
    link.style.visibility = 'hidden';
    
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const handleExport = (type: 'pdf' | 'excel' | 'csv') => {
    switch (type) {
      case 'pdf':
        exportToPDF();
        break;
      case 'excel':
        exportToExcel();
        break;
      case 'csv':
        exportToCSV();
        break;
    }
    
    // Close export options menu after export
    setShowExportOptions(false);
  };

  return (
    <div className="relative">
      <button 
        onClick={() => setShowExportOptions(!showExportOptions)}
        className={buttonClassName}
      >
        <Download size={18} className="mr-2" />
        {translations.export}
      </button>
      
      {showExportOptions && (
        <div ref={exportMenuRef} className={menuClassName}>
          <div className="py-1" role="menu" aria-orientation="vertical">
            <button
              onClick={() => handleExport('pdf')}
              className={menuItemClassName}
              role="menuitem"
            >
              {translations.exportPdf}
            </button>
            <button
              onClick={() => handleExport('excel')}
              className={menuItemClassName}
              role="menuitem"
            >
              {translations.exportExcel}
            </button>
            <button
              onClick={() => handleExport('csv')}
              className={menuItemClassName}
              role="menuitem"
            >
              {translations.exportCsv}
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ExportButton;