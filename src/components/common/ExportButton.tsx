import React, { useState, useRef, useEffect } from 'react';
import { Download, FileText, FileSpreadsheet, FileDown, ChevronDown } from 'lucide-react';
import { jsPDF } from 'jspdf';
import autoTable from 'jspdf-autotable';
import { format } from 'date-fns';
import  logo  from '../../utils/ShipTrack_light_mode.png';

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
  buttonClassName = '',
  menuClassName = '',
  menuItemClassName = '',
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
  const [isLoading, setIsLoading] = useState(false);
  const exportMenuRef = useRef<HTMLDivElement>(null);

  // Default styles améliorés
  const defaultButtonClassName = `
    relative inline-flex items-center justify-center px-6 py-3 
    border border-transparent rounded-xl font-medium text-sm
    bg-gradient-to-r from-blue-600 to-blue-700 
    text-white shadow-lg hover:shadow-xl
    hover:from-blue-700 hover:to-blue-800
    focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2
    transform transition-all duration-200 ease-in-out
    hover:scale-105 active:scale-95
    disabled:opacity-50 disabled:cursor-not-allowed
    dark:from-blue-500 dark:to-blue-600
    dark:hover:from-blue-600 dark:hover:to-blue-700
    group
  `;

  const defaultMenuClassName = `
    absolute top-full right-0 mt-3 w-56 
    rounded-2xl shadow-2xl bg-white dark:bg-gray-800 
    ring-1 ring-black ring-opacity-5 dark:ring-white dark:ring-opacity-10
    z-[9999] backdrop-blur-xl border border-gray-200 dark:border-gray-700
    transform transition-all duration-300 ease-out
    origin-top-right scale-95 opacity-0 animate-in
    ${showExportOptions ? 'scale-100 opacity-100' : ''}
  `;

  // Correction pour l'alignement des icônes et libellés
  const defaultMenuItemClassName = `
    flex items-center justify-start w-full px-5 py-3 text-sm font-medium
    text-gray-700 dark:text-gray-200 
    hover:bg-gradient-to-r hover:from-blue-50 hover:to-indigo-50
    dark:hover:from-gray-700 dark:hover:to-gray-600
    transition-all duration-200 ease-in-out
    first:rounded-t-xl last:rounded-b-xl
    border-b border-gray-100 dark:border-gray-700 last:border-b-0
    group/item
  `;

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

  // Fonction pour convertir l'image en base64
  const getImageBase64 = (imageUrl: string): Promise<string> => {
    return new Promise((resolve, reject) => {
      const img = new Image();
      img.crossOrigin = 'anonymous';
      img.onload = () => {
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        canvas.width = img.width;
        canvas.height = img.height;
        ctx?.drawImage(img, 0, 0);
        const base64 = canvas.toDataURL('image/png');
        resolve(base64);
      };
      img.onerror = reject;
      img.src = imageUrl;
    });
  };

  const exportToPDF = async () => {
    setIsLoading(true);
    try {
      const tableData = getFormattedData();

      // Initialize PDF with specified orientation
      const doc = new jsPDF({
        orientation: orientation
      });

      const pageWidth = doc.internal.pageSize.width;
      const pageHeight = doc.internal.pageSize.height;

      // Variable pour stocker le logo en base64 (accessible dans tout le scope de la fonction)
      let logoBase64: string | null = null;
      
      // Essayer d'ajouter le logo
      try {
        logoBase64 = await getImageBase64(logo);
        // Ajuster la taille du logo (largeur: 30, hauteur: auto)
        const logoWidth = 3072/40;
        const logoHeight = 849/40;
        
        // Position du logo (coin supérieur droit)
        const logoX = pageWidth - logoWidth - 15;
        const logoY = 10;
        
        doc.addImage(logoBase64, 'PNG', logoX, logoY, logoWidth, logoHeight);
      } catch (error) {
        console.warn('Impossible de charger le logo:', error);
      }

      // Add title with better styling
      doc.setFontSize(20);
      doc.setFont('helvetica', 'bold');
      doc.setTextColor(51, 51, 51);
      doc.text(title, 15, 25);

      // Add export date and info
      doc.setFontSize(10);
      doc.setFont('helvetica', 'normal');
      doc.setTextColor(107, 114, 128); // Gray color
      doc.text(`Exporté le: ${format(new Date(), 'dd/MM/yyyy à HH:mm')}`, 15, 38);
      doc.text(`Nombre d'enregistrements: ${tableData.length}`, 15, 44);

      // Generate table with enhanced styling
      const tableConfig = {
        head: [headers],
        body: tableData,
        startY: 55,
        styles: { 
          fontSize: 8,
          cellPadding: 3,
          overflow: 'linebreak',
          valign: 'middle',
          halign: 'left',
          textColor: [51, 51, 51],
          font: 'helvetica'
        },
        headStyles: { 
          fillColor: [59, 130, 246], // Blue header
          textColor: [255, 255, 255],
          fontStyle: 'bold',
          fontSize: 9,
          halign: 'center'
        },
        alternateRowStyles: { 
          fillColor: [248, 250, 252] // Light gray
        },
        columnStyles: {
          // Vous pouvez personnaliser des colonnes spécifiques ici
        },
        // Marge pour la première page uniquement, les pages suivantes utilisent didDrawPage
        margin: { top: 55, left: 15, right: 15, bottom: 15 },
        theme: 'striped',
        // Configuration des en-têtes et sauts de page
        showHead: 'everyPage',
        pageBreak: 'auto',
        // Gestion des en-têtes et du logo sur chaque page
        // Cette fonction est appelée après le dessin de chaque page et permet de personnaliser l'apparence
        // Elle est utilisée ici pour éliminer l'espace vide en haut des pages suivantes
        didDrawPage: (data: any) => {
          // Pour les pages suivantes, ajuster la position Y pour éviter l'espace vide
          if (data.pageNumber > 1) {
            // Réinitialiser la position Y pour éviter l'espace vide
            data.cursor.y = 15; // Marge minimale en haut
            
            // Ajouter le logo sur les pages suivantes si disponible
            if (logoBase64) {
              try {
                const logoWidth = 3072/40;
                const logoHeight = 849/40;
                const logoX = pageWidth - logoWidth - 15;
                const logoY = 10;
                
                // Utiliser le logo en base64 stocké précédemment
                doc.addImage(logoBase64, 'PNG', logoX, logoY, logoWidth, logoHeight);
                
                // Ajouter un titre ou en-tête de page si nécessaire
                doc.setFontSize(10);
                doc.setFont('helvetica', 'normal');
                doc.setTextColor(107, 114, 128); // Gray color
                doc.text(`${title} - Page ${data.pageNumber}`, 15, 10);
              } catch (error) {
                console.warn('Erreur lors de l\'ajout du logo sur la page:', error);
              }
            }
          }
        },
        ...customPdfConfig
      };

      // Nous n'avons plus besoin de surcharger addPage car didDrawPage gère déjà le positionnement
      // Le logo sera ajouté via la configuration didDrawPage dans autoTable

      autoTable(doc, tableConfig);

      // Add footer
      const finalY = (doc as any).lastAutoTable.finalY || 100;
      if (finalY < pageHeight - 30) {
        doc.setFontSize(8);
        doc.setTextColor(156, 163, 175);
        doc.text('Généré par ShipTrack', pageWidth / 2, pageHeight - 15, { align: 'center' });
      }

      // Save the PDF
      doc.save(`${filename}.pdf`);
    } catch (error) {
      console.error('Erreur lors de l\'export PDF:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const exportToCSV = () => {
    setIsLoading(true);
    try {
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
    } catch (error) {
      console.error('Erreur lors de l\'export CSV:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const exportToExcel = () => {
    setIsLoading(true);
    try {
      const tableData = getFormattedData();
      
      // Create HTML for Excel with better styling
      let htmlContent = `
        <html xmlns:o="urn:schemas-microsoft-com:office:office" xmlns:x="urn:schemas-microsoft-com:office:excel" xmlns="http://www.w3.org/TR/REC-html40">
        <head>
          <meta charset="UTF-8">
          <!--[if gte mso 9]>
          <xml>
            <x:ExcelWorkbook>
              <x:ExcelWorksheets>
                <x:ExcelWorksheet>
                  <x:Name>${title}</x:Name>
                  <x:WorksheetOptions>
                    <x:DisplayGridlines/>
                  </x:WorksheetOptions>
                </x:ExcelWorksheet>
              </x:ExcelWorksheets>
            </x:ExcelWorkbook>
          </xml>
          <![endif]-->
          <style>
            table {
              border-collapse: collapse;
              font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
              width: 100%;
              margin-top: 20px;
            }
            th {
              background-color: #3B82F6;
              color: white;
              font-weight: bold;
              text-align: center;
              padding: 12px 8px;
              border: 1px solid #2563EB;
              font-size: 11pt;
            }
            td {
              padding: 8px;
              border: 1px solid #E5E7EB;
              font-size: 10pt;
              text-align: left;
            }
            tr:nth-child(even) {
              background-color: #F8FAFC;
            }
            tr:hover {
              background-color: #F1F5F9;
            }
            .header {
              font-size: 16pt;
              font-weight: bold;
              color: #1F2937;
              margin-bottom: 10px;
            }
            .export-info {
              font-size: 9pt;
              color: #6B7280;
              margin-bottom: 20px;
            }
          </style>
        </head>
        <body>
          <div class="header">${title}</div>
          <div class="export-info">
            Exporté le: ${format(new Date(), 'dd/MM/yyyy à HH:mm')} | 
            Nombre d'enregistrements: ${tableData.length}
          </div>
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
    } catch (error) {
      console.error('Erreur lors de l\'export Excel:', error);
    } finally {
      setIsLoading(false);
    }
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

  const handleExport = async (type: 'pdf' | 'excel' | 'csv') => {
    try {
      switch (type) {
        case 'pdf':
          await exportToPDF();
          break;
        case 'excel':
          exportToExcel();
          break;
        case 'csv':
          exportToCSV();
          break;
      }
    } catch (error) {
      console.error('Erreur lors de l\'export:', error);
    }
    
    // Close export options menu after export
    setShowExportOptions(false);
  };

  const exportOptions = [
    {
      type: 'pdf' as const,
      icon: FileText,
      label: translations.exportPdf,
      color: 'text-red-600 dark:text-red-400',
      bgColor: 'group-hover/item:bg-red-50 dark:group-hover/item:bg-red-900/20'
    },
    {
      type: 'excel' as const,
      icon: FileSpreadsheet,
      label: translations.exportExcel,
      color: 'text-green-600 dark:text-green-400',
      bgColor: 'group-hover/item:bg-green-50 dark:group-hover/item:bg-green-900/20'
    },
    {
      type: 'csv' as const,
      icon: FileDown,
      label: translations.exportCsv,
      color: 'text-blue-600 dark:text-blue-400',
      bgColor: 'group-hover/item:bg-blue-50 dark:group-hover/item:bg-blue-900/20'
    }
  ];

  return (
    <div className="relative">
      <button 
        onClick={() => setShowExportOptions(!showExportOptions)}
        disabled={isLoading}
        className={buttonClassName || defaultButtonClassName}
      >
        {isLoading ? (
          <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
        ) : (
          <Download 
            size={18} 
            className="mr-2 transition-transform duration-200 group-hover:scale-110" 
          />
        )}
        {isLoading ? 'Export en cours...' : translations.export}
        <ChevronDown 
          size={16} 
          className={`ml-2 transition-transform duration-200 ${
            showExportOptions ? 'rotate-180' : ''
          }`} 
        />
      </button>
      
      {showExportOptions && (
        <div 
          ref={exportMenuRef} 
          className={menuClassName || defaultMenuClassName}
          style={{
            animation: showExportOptions ? 'slideIn 0.3s ease-out' : 'slideOut 0.3s ease-in',
            zIndex: 9999
          }}
        >
          <div className="py-2" role="menu" aria-orientation="vertical" style={{ zIndex: 9999 }}>
            <div className="px-4 py-2 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider border-b border-gray-200 dark:border-gray-700" style={{ zIndex: 9999 }}>
              Formats d'export
            </div>
            {exportOptions.map((option) => {
              const IconComponent = option.icon;
              return (
                <button
                  key={option.type}
                  onClick={() => handleExport(option.type)}
                  className={`${menuItemClassName || defaultMenuItemClassName} ${option.bgColor}`}
                  role="menuitem"
                  disabled={isLoading}
                  style={{ zIndex: 9999 }}
                >
                  <div className="flex items-center w-full">
                    <IconComponent 
                      size={16} 
                      className={`mr-3 transition-colors duration-200 ${option.color} flex-shrink-0`} 
                    />
                    <span className="flex-1 text-left">{option.label}</span>
                    <div className="ml-2 opacity-0 group-hover/item:opacity-100 transition-opacity duration-200">
                      <div className="w-2 h-2 bg-current rounded-full"></div>
                    </div>
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      )}
      
      <style jsx>{`
        @keyframes slideIn {
          from {
            opacity: 0;
            transform: translateY(-10px) scale(0.95);
          }
          to {
            opacity: 1;
            transform: translateY(0) scale(1);
          }
        }
        
        @keyframes slideOut {
          from {
            opacity: 1;
            transform: translateY(0) scale(1);
          }
          to {
            opacity: 0;
            transform: translateY(-10px) scale(0.95);
          }
        }
      `}</style>
    </div>
  );
};

export default ExportButton;