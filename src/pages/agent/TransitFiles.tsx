import { useState, useEffect, useRef } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { useTheme } from '../../contexts/ThemeContext';
import { useLanguage } from '../../contexts/LanguageContext';
import { useNavigate } from 'react-router-dom';
import { getMockClients } from '../../services/clientService';
import { Client } from '../../types/client';
import { Container } from '../../types/container';
import LoadingScreen from '../../components/common/LoadingScreen';
import { useMediaQuery } from 'react-responsive';
import {
  Search,
  Filter,
  Plus,
  FileText,
  X,
  Calendar,
  User,
  MapPin,
  Package,
  Truck,
  Ship,
  Plane,
  RefreshCw,
  Download,
  Eye,
  Edit,
  MoreVertical,
  ChevronLeft,
  ChevronRight,
  Grid,
  Table,
  Building,
  Hash,
  Weight,
  Box,
  Clock,
  AlertTriangle,
  CheckCircle,
  Users,
  Globe,
} from 'lucide-react';
import { format, subDays } from 'date-fns';
import backImage from '../../utils/backGround_hearder.png';
import { TransitFile } from '../../types/transitFile';
import { getTransitFiles } from '../../services/transitFileService';
import { jsPDF } from 'jspdf';
import autoTable from 'jspdf-autotable';

interface FilterState {
  search: string;
  status: string;
  transportType: string;
  shipmentType: string;
  productType: string;
  client: string;
  assignedTo: string;
  origin: string;
  destination: string;
  dateFrom: string;
  dateTo: string;
}

const TransitFilesPage = () => {
  const { user } = useAuth();
  const { theme } = useTheme();
  const { t } = useLanguage();
  const navigate = useNavigate();

  const handleViewFile = (fileId: string) => {
    navigate(`/transit-files/${fileId}`);
  };

  // État pour le type d'export sélectionné
  const [exportType, setExportType] = useState<'pdf' | 'excel' | 'csv'>('pdf');
  const [showExportOptions, setShowExportOptions] = useState(false);
  const exportMenuRef = useRef<HTMLDivElement>(null);

  // Fermer le menu d'export lorsque l'utilisateur clique en dehors
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

  const handleExport = (type: 'pdf' | 'excel' | 'csv' = exportType) => {
    // Préparer les données pour l'export
    const tableData = filteredFiles.map(file => ([
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
    ]));

    // Créer l'en-tête
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

    if (type === 'pdf') {
      // Initialiser le PDF en mode paysage
      const doc = new jsPDF({
        orientation: 'landscape'
      });

      // Ajouter le titre
      doc.setFontSize(16);
      doc.text(t('transit_files_list'), 14, 15);

      // Ajouter la date d'export
      doc.setFontSize(10);
      doc.text(format(new Date(), 'dd/MM/yyyy HH:mm'), 14, 22);

      // Générer le tableau
      autoTable(doc, {
        head: [headers],
        body: tableData,
        startY: 30,
        styles: { fontSize: 8 },
        headStyles: { fillColor: [51, 51, 51] },
        alternateRowStyles: { fillColor: [245, 245, 245] },
        margin: { top: 30 }
      });

      // Sauvegarder le PDF
      doc.save(`transit_files_${format(new Date(), 'yyyy-MM-dd')}.pdf`);
    } else if (type === 'csv') {
      // Créer un fichier CSV standard
      let csvContent = headers.join(',') + '\n';
      
      // Ajouter les données
      tableData.forEach(row => {
        // Échapper les virgules dans les cellules
        const escapedRow = row.map(cell => {
          const cellStr = String(cell);
          // Si la cellule contient une virgule, des guillemets ou des sauts de ligne, l'entourer de guillemets
          if (cellStr.includes(',') || cellStr.includes('"') || cellStr.includes('\n')) {
            // Échapper les guillemets en les doublant
            return '"' + cellStr.replace(/"/g, '""') + '"';
          }
          return cellStr;
        });
        csvContent += escapedRow.join(',') + '\n';
      });
      
      // Créer un objet Blob pour le fichier CSV avec BOM pour UTF-8
      // Le BOM (Byte Order Mark) permet à Excel de reconnaître correctement l'encodage UTF-8
      const BOM = new Uint8Array([0xEF, 0xBB, 0xBF]);
      const blob = new Blob([BOM, csvContent], { type: 'text/csv;charset=utf-8;' });
      
      // Créer un lien pour télécharger le fichier
      const link = document.createElement('a');
      const url = URL.createObjectURL(blob);
      
      link.setAttribute('href', url);
      link.setAttribute('download', `transit_files_${format(new Date(), 'yyyy-MM-dd')}.csv`);
      link.style.visibility = 'hidden';
      
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } else if (type === 'excel') {
      // Créer un fichier Excel (HTML) qui sera correctement interprété par Excel
      // Cette approche crée un tableau HTML que Excel peut ouvrir avec les cellules correctement séparées
      
      // Créer le début du document HTML avec les styles
      let htmlContent = `
        <html xmlns:o="urn:schemas-microsoft-com:office:office" xmlns:x="urn:schemas-microsoft-com:office:excel" xmlns="http://www.w3.org/TR/REC-html40">
        <head>
          <meta charset="UTF-8">
          <!--[if gte mso 9]>
          <xml>
            <x:ExcelWorkbook>
              <x:ExcelWorksheets>
                <x:ExcelWorksheet>
                  <x:Name>Feuille 1</x:Name>
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
      
      // Ajouter les en-têtes
      headers.forEach(header => {
        htmlContent += `<th>${header}</th>`;
      });
      
      htmlContent += `
              </tr>
            </thead>
            <tbody>
      `;
      
      // Ajouter les données
      tableData.forEach(row => {
        htmlContent += '<tr>';
        row.forEach(cell => {
          // Échapper les caractères HTML spéciaux
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
      
      // Fermer le document HTML
      htmlContent += `
            </tbody>
          </table>
        </body>
        </html>
      `;
      
      // Créer un objet Blob pour le fichier HTML
      const blob = new Blob([htmlContent], { type: 'application/vnd.ms-excel;charset=utf-8;' });
      
      // Créer un lien pour télécharger le fichier
      const link = document.createElement('a');
      const url = URL.createObjectURL(blob);
      
      link.setAttribute('href', url);
      link.setAttribute('download', `transit_files_${format(new Date(), 'yyyy-MM-dd')}.xls`);
      link.style.visibility = 'hidden';
      
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
    
    // Fermer le menu d'options d'export après l'export
    setShowExportOptions(false);
  };
  const [transitFiles, setTransitFiles] = useState<TransitFile[]>([]);
  const [clients, setClients] = useState<Client[]>([]);
  const [filteredFiles, setFilteredFiles] = useState<TransitFile[]>([]);
  const [sortedFiles, setSortedFiles] = useState<TransitFile[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showFilters, setShowFilters] = useState(false);
  const [activeFiltersCount, setActiveFiltersCount] = useState(0);
  const [pageLoaded, setPageLoaded] = useState(false);
  const [viewMode, setViewMode] = useState<'grid' | 'table'>('grid');
  
  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(9);
  const [totalPages, setTotalPages] = useState(1);
  const [paginatedFiles, setPaginatedFiles] = useState<TransitFile[]>([]);
  
  // Sorting state
  const [sortField, setSortField] = useState<'creationDate' | 'reference' | 'status'>('creationDate');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('desc');

  const isMobile = useMediaQuery({ maxWidth: 767 });
  const isTablet = useMediaQuery({ minWidth: 768, maxWidth: 1023 });

  const [filters, setFilters] = useState<FilterState>({
    search: '',
    status: '',
    transportType: '',
    shipmentType: '',
    productType: '',
    client: '',
    assignedTo: '',
    origin: '',
    destination: '',
    dateFrom: '',
    dateTo: '',
  });

  // Mock agents data
  const agents = [
    { id: 'agent-1', name: 'Sophie Martin', role: t('operations') },
    { id: 'agent-2', name: 'Thomas Dubois', role: t('customs') },
    { id: 'agent-3', name: 'Marie Lefebvre', role: t('finance') },
    { id: 'agent-4', name: 'Pierre Durand', role: t('operations') }
  ];

  const isDark = theme === 'dark';
  const shadowClass = isDark ? 'shadow-gray-900/20' : 'shadow-sm';
  const hoverShadow = isDark ? 'hover:shadow-gray-900/30' : 'hover:shadow-md';
  const textPrimary = isDark ? 'text-white' : 'text-gray-900';
  const textSecondary = isDark ? 'text-gray-300' : 'text-gray-600';
  const textMuted = isDark ? 'text-gray-400' : 'text-gray-500';
  const bgPrimary = isDark ? 'bg-gray-900' : 'bg-white';
  const bgSecondary = isDark ? 'bg-gray-800' : 'bg-white';
  const borderColor = isDark ? 'border-gray-700' : 'border-gray-200';

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [filesData, clientsData] = await Promise.all([
          getTransitFiles(),
          getMockClients()
        ]);
        setTransitFiles(filesData);
        setClients(clientsData);
        setFilteredFiles(filesData);
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setIsLoading(false);
        setTimeout(() => setPageLoaded(true), 100);
      }
    };

    fetchData();
  }, []);

  // Apply filters
  useEffect(() => {
    let filtered = [...transitFiles];

    // Search filter
    if (filters.search) {
      const searchLower = filters.search.toLowerCase();
      filtered = filtered.filter(f =>
        f.reference.toLowerCase().includes(searchLower) ||
        f.blNumber.toLowerCase().includes(searchLower) ||
        f.origin.toLowerCase().includes(searchLower) ||
        f.destination.toLowerCase().includes(searchLower) ||
        f.contentDescription.toLowerCase().includes(searchLower)
      );
    }

    // Current event filter (remplace le filtre de statut)
    if (filters.status) {
      filtered = filtered.filter(f => {
        const currentEvent = getCurrentEvent(f);
        return currentEvent === t(filters.status);
      });
    }

    // Transport type filter
    if (filters.transportType) {
      filtered = filtered.filter(f => f.transportType === filters.transportType);
    }

    // Shipment type filter
    if (filters.shipmentType) {
      filtered = filtered.filter(f => f.shipmentType === filters.shipmentType);
    }

    // Product type filter
    if (filters.productType) {
      filtered = filtered.filter(f => f.productType === filters.productType);
    }

    // Client filter
    if (filters.client) {
      filtered = filtered.filter(f => f.clientIds.includes(filters.client));
    }

    // Assigned to filter
    if (filters.assignedTo) {
      filtered = filtered.filter(f => f.assignedAgentId === filters.assignedTo);
    }

    // Origin filter
    if (filters.origin) {
      filtered = filtered.filter(f => 
        f.origin.toLowerCase().includes(filters.origin.toLowerCase())
      );
    }

    // Destination filter
    if (filters.destination) {
      filtered = filtered.filter(f => 
        f.destination.toLowerCase().includes(filters.destination.toLowerCase())
      );
    }


    // Date filters
    if (filters.dateFrom) {
      filtered = filtered.filter(f => 
        new Date(f.createdAt) >= new Date(filters.dateFrom)
      );
    }

    if (filters.dateTo) {
      filtered = filtered.filter(f => 
        new Date(f.createdAt) <= new Date(filters.dateTo)
      );
    }

    setFilteredFiles(filtered);

    // Count active filters
    const activeCount = Object.values(filters).filter(value => value !== '').length;
    setActiveFiltersCount(activeCount);
  }, [filters, transitFiles]);

  // Apply sorting
  useEffect(() => {
    const sorted = [...filteredFiles].sort((a, b) => {
      let comparison = 0;
      
      switch (sortField) {
        case 'creationDate':
          comparison = new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
          break;
        case 'reference':
          comparison = a.reference.localeCompare(b.reference);
          break;
        case 'status':
          // Trier par événement en cours au lieu du statut
          const eventA = getCurrentEvent(a);
          const eventB = getCurrentEvent(b);
          comparison = eventA.localeCompare(eventB);
          break;
      }
      
      return sortDirection === 'asc' ? comparison : -comparison;
    });
    
    setSortedFiles(sorted);
  }, [filteredFiles, sortField, sortDirection]);

  // Apply pagination
  useEffect(() => {
    const totalPagesCount = Math.ceil(sortedFiles.length / itemsPerPage);
    setTotalPages(totalPagesCount);
    
    if (currentPage > totalPagesCount && totalPagesCount > 0) {
      setCurrentPage(1);
    }
    
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    const paginated = sortedFiles.slice(startIndex, endIndex);
    
    setPaginatedFiles(paginated);
  }, [sortedFiles, currentPage, itemsPerPage]);

  // Options de filtres basées sur les données réelles
  const statusOptions = [
    // Événements d'export
    'export_pregate', 'warehouse_reception', 'declaration', 'export_customs_clearance',
    'warehouse_loading', 'effective_transport', 'vessel_loading', 'departure',
    'estimated_arrival', 'billing',
    // Événements d'import
    'import_prealert', 'arrival', 'import_customs_clearance', 'maritime_company_slip',
    'import_pregate', 'pickup', 'delivery', 'warehouse_arrival'
  ];
  const transportTypeOptions = ['air', 'sea'];
  const shipmentTypeOptions = ['import', 'export'];
  const productTypeOptions = ['standard', 'dangerous', 'fragile'];

  const handleFilterChange = (key: keyof FilterState, value: string) => {
    setFilters(prev => ({ ...prev, [key]: value }));
  };

  const clearAllFilters = () => {
    setFilters({
      search: '',
      status: '',
      transportType: '',
      shipmentType: '',
      productType: '',
      client: '',
      assignedTo: '',
      origin: '',
      destination: '',
      dateFrom: '',
      dateTo: '',
    });
  };

  const clearFilter = (key: keyof FilterState) => {
    setFilters(prev => ({ ...prev, [key]: '' }));
  };

  const getClientNames = (clientIds: string[]) => {
    const names = clientIds.map(id => {
      const client = clients.find(c => c.id === id);
      return client ? client.name : t('unknown_client');
    });
    return names.join(', ');
  };

  const getAgentName = (agentId: string) => {
    const agent = agents.find(a => a.id === agentId);
    return agent ? agent.name : t('unknown_client');
  };
  
  // Fonction pour obtenir l'événement en cours d'un fichier de transit
  const getCurrentEvent = (file: TransitFile): string => {
    // Si le fichier n'a pas d'événements ou est complété, retourner le statut
    if (!file.events || file.events.length === 0) {
      return t(file.status);
    }
    
    // Trouver le premier événement non complété
    const currentEvent = file.events.find(event => !event.completed);
    
    // Si tous les événements sont complétés, retourner 'completed'
    return currentEvent ? t(currentEvent.name) : t('completed');
  };

  // Pagination handlers
  const handlePageChange = (page: number) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const handleItemsPerPageChange = (value: number) => {
    setItemsPerPage(value);
    setCurrentPage(1);
  };

  // Sorting handlers
  const handleSortChange = (field: 'creationDate' | 'reference' | 'status') => {
    if (sortField === field) {
      setSortDirection(prev => prev === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('desc');
    }
  };

  const getSortIcon = (field: string) => {
    if (sortField !== field) return null;
    return (
      <span className="ml-1">
        {sortDirection === 'asc' ? '↑' : '↓'}
      </span>
    );
  };

  // Generate pagination numbers with ellipsis
  const getPaginationNumbers = () => {
    const pages = [];
    const maxVisiblePages = 5;
    
    if (totalPages <= maxVisiblePages) {
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      const leftBound = Math.max(2, currentPage - 1);
      const rightBound = Math.min(totalPages - 1, currentPage + 1);
      
      pages.push(1);
      
      if (leftBound > 2) {
        pages.push('...');
      }
      
      for (let i = leftBound; i <= rightBound; i++) {
        pages.push(i);
      }
      
      if (rightBound < totalPages - 1) {
        pages.push('...');
      }
      
      pages.push(totalPages);
    }
    
    return pages;
  };

  // Get status color
  const getStatusColor = (status: string) => {
    const colors = {
      draft: isDark ? 'bg-gray-700 text-gray-300' : 'bg-gray-100 text-gray-800',
      processing: isDark ? 'bg-amber-800 text-amber-300' : 'bg-amber-100 text-amber-800',
      warehouse: isDark ? 'bg-blue-800 text-blue-300' : 'bg-blue-100 text-blue-800',
      customs: isDark ? 'bg-purple-800 text-purple-300' : 'bg-purple-100 text-purple-800',
      in_transit: isDark ? 'bg-indigo-800 text-indigo-300' : 'bg-indigo-100 text-indigo-800',
      delivered: isDark ? 'bg-green-800 text-green-300' : 'bg-green-100 text-green-800',
      issue: isDark ? 'bg-red-800 text-red-300' : 'bg-red-100 text-red-800'
    };
    
    // Pour les événements, utiliser des couleurs basées sur le nom de l'événement
    if (status.includes('pregate') || status.includes('declaration') || status.includes('customs') || status.includes('clearance')) {
      return isDark ? 'bg-purple-800 text-purple-300' : 'bg-purple-100 text-purple-800';
    } else if (status.includes('transport') || status.includes('loading') || status.includes('departure') || status.includes('arrival')) {
      return isDark ? 'bg-blue-800 text-blue-300' : 'bg-blue-100 text-blue-800';
    } else if (status.includes('warehouse')) {
      return isDark ? 'bg-amber-800 text-amber-300' : 'bg-amber-100 text-amber-800';
    } else if (status.includes('billing') || status.includes('payment')) {
      return isDark ? 'bg-green-800 text-green-300' : 'bg-green-100 text-green-800';
    }
    
    // Map new status values to existing colors
    if (status === 'in_transit') return colors.processing;
    if (status === 'completed') return colors.delivered;
    return colors[status as keyof typeof colors] || colors.draft;
  };

  // Get product type icon
  const getProductTypeIcon = (type: string) => {
    switch (type) {
      case 'dangerous':
        return <AlertTriangle size={14} className="text-red-500" />;
      case 'fragile':
        return <Package size={14} className="text-yellow-500" />;
      default:
        return <Package size={14} className={textMuted} />;
    }
  };

  // Navigation handlers
  const handleNewFile = () => {
    navigate('/transit-files/new');
  };

  const handleEditFile = (fileId: string) => {
    navigate(`/transit-files/${fileId}/edit`);
  };

  // File Card Component
  const FileCard = ({ file }: { file: TransitFile }) => (
    <div className={`${bgSecondary} rounded-lg ${shadowClass} hover:${hoverShadow} transition-all duration-300 transform hover:-translate-y-1 border ${borderColor}`}>
      <div className="p-4 sm:p-5">
        {/* Header */}
        <div className="flex justify-between items-start mb-4">
          <div className="flex items-center min-w-0 flex-1">
            <FileText size={20} className={`mr-2 flex-shrink-0 ${isDark ? 'text-blue-400' : 'text-blue-600'}`} />
            <div className="min-w-0 flex-1">
              <h3 className={`text-base sm:text-lg font-semibold ${textPrimary} truncate`}>
                {file.reference}
              </h3>
              <p className={`text-xs ${textMuted} truncate`}>
                {file.blNumber}
              </p>
            </div>
          </div>
          <div className="flex flex-col items-end space-y-2 ml-2">
            <span className={`inline-flex items-center rounded-full border font-medium px-2 py-1 text-xs ${
              file.transportType === 'air' 
                ? isDark ? 'bg-blue-900/50 text-blue-300 border-blue-700' : 'bg-blue-50 text-blue-700 border-blue-200'
                : isDark ? 'bg-indigo-900/50 text-indigo-300 border-indigo-700' : 'bg-indigo-50 text-indigo-700 border-indigo-200'
            }`}>
              {file.transportType === 'air' ? <Plane size={12} className="mr-1" /> : <Ship size={12} className="mr-1" />}
              {t(file.transportType)}
            </span>
            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(getCurrentEvent(file))}`}>
              {getCurrentEvent(file)}
            </span>
          </div>
        </div>

        {/* Route */}
        <div className={`flex items-start space-x-2 p-3 rounded-lg mb-4 ${isDark ? 'bg-gray-700/50' : 'bg-gray-50'}`}>
          <MapPin size={16} className={`mt-0.5 flex-shrink-0 ${isDark ? 'text-blue-400' : 'text-blue-500'}`} />
          <div className="text-sm flex-1 min-w-0">
            <div className="grid grid-cols-1 gap-2">
              <div>
                <div className={`text-xs uppercase tracking-wide ${textMuted}`}>
                  {t('from')}
                </div>
                <div className={`font-medium ${textSecondary} truncate`}>
                  {file.origin}
                </div>
              </div>
              <div>
                <div className={`text-xs uppercase tracking-wide ${textMuted}`}>
                  {t('to')}
                </div>
                <div className={`font-medium ${textSecondary} truncate`}>
                  {file.destination}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Clients */}
        <div className={`flex items-center space-x-2 p-3 rounded-lg mb-4 ${isDark ? 'bg-blue-900/30' : 'bg-blue-50'}`}>
          <Users size={16} className={`flex-shrink-0 ${isDark ? 'text-blue-400' : 'text-blue-600'}`} />
          <div className="text-sm overflow-hidden min-w-0 flex-1">
            <span className={`font-medium ${isDark ? 'text-blue-300' : 'text-blue-600'}`}>
              {t('clients')}:{' '}
            </span>
            <span className={`${isDark ? 'text-blue-200' : 'text-blue-800'} truncate block`}>
              {getClientNames(file.clientIds)}
            </span>
          </div>
        </div>

        {/* Details */}
        <div className={`pt-3 mt-3 border-t ${borderColor}`}>
          <div className="grid grid-cols-1 gap-2 text-xs mb-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <Package size={12} className={`mr-1 flex-shrink-0 ${textMuted}`} />
                <span className={textMuted}>{t('shipment_type')}:</span>
              </div>
              <span className={`${textSecondary} font-medium`}>{t(file.shipmentType)}</span>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                {getProductTypeIcon(file.productType)}
                <span className={`ml-1 ${textMuted}`}>{t('product_type')}:</span>
              </div>
              <span className={`${textSecondary} font-medium`}>{t(file.productType)}</span>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <Weight size={12} className={`mr-1 flex-shrink-0 ${textMuted}`} />
                <span className={textMuted}>{t('weight')}:</span>
              </div>
              <span className={`${textSecondary} font-medium truncate ml-2 text-right`}>{file.totalWeight}</span>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <Box size={12} className={`mr-1 flex-shrink-0 ${textMuted}`} />
                <span className={textMuted}>{t('volume')}:</span>
              </div>
              <span className={`${textSecondary} font-medium truncate ml-2 text-right`}>{file.totalVolume}</span>
            </div>
          </div>
          
          <div className="flex items-center justify-between">
            <div className="flex items-center text-xs">
              <Calendar size={12} className={`mr-1 ${textMuted}`} />
              <span className={textMuted}>
                {format(new Date(file.createdAt), 'dd/MM/yyyy')}
              </span>
            </div>
            <div className="flex items-center space-x-1">
              <button 
                onClick={() => handleViewFile(file.id)}
                className={`p-1 rounded ${textMuted} hover:${textPrimary} transition-colors`} 
                title={t('view_details')}
              >
                <Eye size={14} />
              </button>
              <button 
                onClick={() => handleEditFile(file.id)}
                className={`p-1 rounded ${textMuted} hover:${textPrimary} transition-colors`} 
                title={t('edit')}
              >
                <Edit size={14} />
              </button>
              <button className={`p-1 rounded ${textMuted} hover:${textPrimary} transition-colors`} title={t('more_actions')}>
                <MoreVertical size={14} />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  // Table View Component
  const TableView = () => (
    <div className={`${bgSecondary} rounded-lg ${shadowClass} overflow-hidden`}>
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
          <thead className={`${isDark ? 'bg-gray-700' : 'bg-gray-50'}`}>
            <tr>
              <th className={`px-4 sm:px-6 py-3 text-left text-xs font-medium uppercase tracking-wider ${textMuted}`}>
                {t('reference')}
              </th>
              <th className={`px-4 sm:px-6 py-3 text-left text-xs font-medium uppercase tracking-wider ${textMuted}`}>
                {t('clients')}
              </th>
              <th className={`px-4 sm:px-6 py-3 text-left text-xs font-medium uppercase tracking-wider ${textMuted}`}>
                {t('origin')} → {t('destination')}
              </th>
              <th className={`px-4 sm:px-6 py-3 text-left text-xs font-medium uppercase tracking-wider ${textMuted}`}>
                {t('transport_type')}
              </th>
              <th className={`px-4 sm:px-6 py-3 text-left text-xs font-medium uppercase tracking-wider ${textMuted}`}>
                {t('current_event')}
              </th>
              <th className={`px-4 sm:px-6 py-3 text-left text-xs font-medium uppercase tracking-wider ${textMuted}`}>
                {t('creation_date')}
              </th>
              <th className={`px-4 sm:px-6 py-3 text-left text-xs font-medium uppercase tracking-wider ${textMuted}`}>
                Actions
              </th>
            </tr>
          </thead>
          <tbody className={`divide-y ${isDark ? 'divide-gray-700' : 'divide-gray-200'}`}>
            {paginatedFiles.map((file) => (
              <tr key={file.id} className={`${isDark ? 'hover:bg-gray-700' : 'hover:bg-gray-50'} transition-colors`}>
                <td className={`px-4 sm:px-6 py-4 whitespace-nowrap text-sm font-medium ${textPrimary}`}>
                  <div>
                    <div className="truncate max-w-32">{file.reference}</div>
                    <div className={`text-xs ${textMuted} truncate max-w-32`}>{file.blNumber}</div>
                  </div>
                </td>
                <td className={`px-4 sm:px-6 py-4 whitespace-nowrap text-sm ${textSecondary}`}>
                  <div className="max-w-32 truncate">
                    {getClientNames(file.clientIds)}
                  </div>
                </td>
                <td className={`px-4 sm:px-6 py-4 whitespace-nowrap text-sm ${textSecondary}`}>
                  <div className="flex items-center">
                    <span className="truncate max-w-20">{file.origin.split(',')[0]}</span>
                    <span className="mx-2">→</span>
                    <span className="truncate max-w-20">{file.destination.split(',')[0]}</span>
                  </div>
                </td>
                <td className={`px-4 sm:px-6 py-4 whitespace-nowrap text-sm ${textSecondary}`}>
                  <div className="flex items-center">
                    {file.transportType === 'air' ? (
                      <Plane size={16} className="mr-1 text-blue-600" />
                    ) : (
                      <Ship size={16} className="mr-1 text-blue-600" />
                    )}
                    {t(file.transportType)}
                  </div>
                </td>
                <td className="px-4 sm:px-6 py-4 whitespace-nowrap">
                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(getCurrentEvent(file))}`}>
                    {getCurrentEvent(file)}
                  </span>
                </td>
                <td className={`px-4 sm:px-6 py-4 whitespace-nowrap text-sm ${textMuted}`}>
                  {format(new Date(file.createdAt), 'dd/MM/yyyy')}
                </td>
                <td className="px-4 sm:px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                  <div className="flex items-center justify-end space-x-2">
                    <button 
                      onClick={() => handleViewFile(file.id)} 
                      className={`${textMuted} hover:text-blue-600 transition-colors`} 
                      title={t('view_details')}
                    >
                      <Eye size={16} />
                    </button>
                    <button 
                      onClick={() => handleEditFile(file.id)}
                      className={`${textMuted} hover:text-blue-600 transition-colors`} 
                      title={t('edit')}
                    >
                      <Edit size={16} />
                    </button>
                    <button className={`${textMuted} hover:text-blue-600 transition-colors`} title={t('more_actions')}>
                      <MoreVertical size={16} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );

  if (isLoading) {
    return <LoadingScreen />;
  }

  return (
    <div className={`max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 transition-all duration-700 ${pageLoaded ? 'opacity-100' : 'opacity-0'}`}>
      {/* Header Section */}
      <div 
        className={`mb-6 sm:mb-8 rounded-xl p-4 sm:p-6 ${shadowClass} transform transition-all duration-500 ${hoverShadow} hover:scale-[1.01] animate-fadeIn`}
        style={{
          backgroundImage: isDark 
            ? `linear-gradient(to right, rgba(17, 24, 39, 0.85), rgba(31, 41, 55, 0.85)), url(${backImage})`
            : `linear-gradient(to right, rgba(239, 246, 255, 0.85), rgba(224, 231, 255, 0.85)), url(${backImage})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat'
        }}
      >
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between">
          <div className="p-2 sm:p-4">
            <h1 className={`text-xl sm:text-2xl md:text-3xl font-bold ${textPrimary} mb-2`}>
              {t('transit_files')}
            </h1>
            <p className={`${textSecondary} text-base sm:text-lg`}>
              {t('manage_transit_files')}
            </p>
          </div>
          
          <div className="flex flex-col sm:flex-row gap-3 p-2 sm:p-4">
            <button 
              onClick={handleNewFile}
              className="inline-flex items-center justify-center px-4 py-2.5 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors shadow-sm text-sm sm:text-base"
            >
              <Plus size={18} className="mr-2" />
              {t('new_transit_file')}
            </button>
            <div className="relative">
              <button 
                onClick={() => setShowExportOptions(!showExportOptions)}
                className={`inline-flex items-center justify-center px-4 py-2.5 border ${borderColor} rounded-lg ${bgPrimary} ${textPrimary} hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors text-sm sm:text-base`}
              >
                <Download size={18} className="mr-2" />
                {t('export')}
              </button>
              
              {showExportOptions && (
                <div ref={exportMenuRef} className={`absolute top-full right-0 mt-2 w-48 rounded-md shadow-lg ${bgPrimary} ring-1 ring-black ring-opacity-5 z-50`}>
                  <div className="py-1" role="menu" aria-orientation="vertical">
                    <button
                      onClick={() => handleExport('pdf')}
                      className={`block w-full text-left px-4 py-2 text-sm ${textPrimary} hover:bg-gray-100 dark:hover:bg-gray-700`}
                      role="menuitem"
                    >
                      {t('export_pdf')}
                    </button>
                    <button
                      onClick={() => handleExport('excel')}
                      className={`block w-full text-left px-4 py-2 text-sm ${textPrimary} hover:bg-gray-100 dark:hover:bg-gray-700`}
                      role="menuitem"
                    >
                      {t('export_excel')}
                    </button>
                    <button
                      onClick={() => handleExport('csv')}
                      className={`block w-full text-left px-4 py-2 text-sm ${textPrimary} hover:bg-gray-100 dark:hover:bg-gray-700`}
                      role="menuitem"
                    >
                      {t('export_csv')}
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Search and Filter Bar */}
      <div className={`${bgSecondary} rounded-lg ${shadowClass} p-4 mb-6 ${borderColor} border`}>
        <div className="flex flex-col lg:flex-row lg:items-center gap-4">
          {/* Search Input */}
          <div className="flex-1 relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search size={18} className={textMuted} />
            </div>
            <input
              type="text"
              placeholder={t('searchPlaceholder')}
              value={filters.search}
              onChange={(e) => handleFilterChange('search', e.target.value)}
              className={`block w-full pl-10 pr-4 py-2.5 border ${borderColor} rounded-lg ${bgPrimary} ${textPrimary} focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 text-sm sm:text-base`}
            />
          </div>

          {/* Filter Toggle Button */}
          <div className="flex items-center gap-3">
            <button
              onClick={() => setShowFilters(!showFilters)}
              className={`inline-flex items-center px-4 py-2.5 border ${borderColor} rounded-lg ${bgPrimary} ${textPrimary} hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors relative text-sm sm:text-base`}
            >
              <Filter size={18} className="mr-2" />
              {t('filters')}
              {activeFiltersCount > 0 && (
                <span className="absolute -top-2 -right-2 bg-blue-600 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                  {activeFiltersCount}
                </span>
              )}
            </button>

            {activeFiltersCount > 0 && (
              <button
                onClick={clearAllFilters}
                className="inline-flex items-center px-3 py-2 text-sm text-red-600 hover:text-red-800 dark:text-red-400 dark:hover:text-red-300 transition-colors"
              >
                <X size={16} className="mr-1" />
                {t('clearAll')}
              </button>
            )}

          </div>
        </div>

        {/* Advanced Filters */}
        {showFilters && (
          <div className={`mt-6 pt-6 border-t ${borderColor} grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4`}>
            {/* Current Event Filter */}
            <div>
              <label className={`block text-sm font-medium ${textSecondary} mb-1`}>
                {t('current_event')}
              </label>
              <select
                value={filters.status}
                onChange={(e) => handleFilterChange('status', e.target.value)}
                className={`block w-full px-3 py-2 border ${borderColor} rounded-lg ${bgPrimary} ${textPrimary} focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm`}
              >
                <option value="">{t('all_events')}</option>
                {statusOptions.map(status => (
                  <option key={status} value={status}>{t(status)}</option>
                ))}
              </select>
            </div>

            {/* Transport Type Filter */}
            <div>
              <label className={`block text-sm font-medium ${textSecondary} mb-1`}>
                {t('transport_type')}
              </label>
              <select
                value={filters.transportType}
                onChange={(e) => handleFilterChange('transportType', e.target.value)}
                className={`block w-full px-3 py-2 border ${borderColor} rounded-lg ${bgPrimary} ${textPrimary} focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm`}
              >
                <option value="">{t('all_types')}</option>
                {transportTypeOptions.map(type => (
                  <option key={type} value={type}>{t(type)}</option>
                ))}
              </select>
            </div>

            {/* Shipment Type Filter */}
            <div>
              <label className={`block text-sm font-medium ${textSecondary} mb-1`}>
                {t('shipment_type')}
              </label>
              <select
                value={filters.shipmentType}
                onChange={(e) => handleFilterChange('shipmentType', e.target.value)}
                className={`block w-full px-3 py-2 border ${borderColor} rounded-lg ${bgPrimary} ${textPrimary} focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm`}
              >
                <option value="">{t('all_types')}</option>
                {shipmentTypeOptions.map(type => (
                  <option key={type} value={type}>{t(type)}</option>
                ))}
              </select>
            </div>

            {/* Product Type Filter */}
            <div>
              <label className={`block text-sm font-medium ${textSecondary} mb-1`}>
                {t('product_type')}
              </label>
              <select
                value={filters.productType}
                onChange={(e) => handleFilterChange('productType', e.target.value)}
                className={`block w-full px-3 py-2 border ${borderColor} rounded-lg ${bgPrimary} ${textPrimary} focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm`}
              >
                <option value="">{t('all_types')}</option>
                {productTypeOptions.map(type => (
                  <option key={type} value={type}>{t(type)}</option>
                ))}
                </select>
            </div>

            {/* Client Filter */}
            <div>
              <label className={`block text-sm font-medium ${textSecondary} mb-1`}>
                {t('client')}
              </label>
              <select
                value={filters.client}
                onChange={(e) => handleFilterChange('client', e.target.value)}
                className={`block w-full px-3 py-2 border ${borderColor} rounded-lg ${bgPrimary} ${textPrimary} focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm`}
              >
                <option value="">{t('all_clients')}</option>
                {clients.map(client => (
                  <option key={client.id} value={client.id}>
                    {client.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Assigned To Filter */}
            <div>
              <label className={`block text-sm font-medium ${textSecondary} mb-1`}>
                {t('assignedTo')}
              </label>
              <select
                value={filters.assignedTo}
                onChange={(e) => handleFilterChange('assignedTo', e.target.value)}
                className={`block w-full px-3 py-2 border ${borderColor} rounded-lg ${bgPrimary} ${textPrimary} focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm`}
              >
                <option value="">{t('all_agents')}</option>
                {agents.map(agent => (
                  <option key={agent.id} value={agent.id}>
                    {agent.name} ({agent.role})
                  </option>
                ))}
              </select>
            </div>


            {/* Date Range Filters */}
            <div className="col-span-1 sm:col-span-2">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Date From Filter */}
                <div>
                  <label className={`block text-sm font-medium ${textSecondary} mb-1`}>
                    {t('creation_date_from')}
                  </label>
                  <input
                    type="date"
                    value={filters.dateFrom}
                    onChange={(e) => handleFilterChange('dateFrom', e.target.value)}
                    max={filters.dateTo}
                    className={`block w-full px-3 py-2 border ${borderColor} rounded-lg ${bgPrimary} ${textPrimary} focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm`}
                  />
                </div>
                {/* Date To Filter */}
                <div>
                  <label className={`block text-sm font-medium ${textSecondary} mb-1`}>
                    {t('creation_date_to')}
                  </label>
                  <input
                    type="date"
                    value={filters.dateTo}
                    onChange={(e) => handleFilterChange('dateTo', e.target.value)}
                    min={filters.dateFrom}
                    className={`block w-full px-3 py-2 border ${borderColor} rounded-lg ${bgPrimary} ${textPrimary} focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm`}
                  />
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Active Filters Display */}
        {activeFiltersCount > 0 && (
          <div className={`mt-4 pt-4 border-t ${borderColor}`}>
            <div className="flex flex-wrap gap-2">
              <span className={`text-sm ${textMuted}`}>{t('activeFilters')}:</span>
              {Object.entries(filters).map(([key, value]) => {
                if (!value) return null;
                
                const filterLabels = {
                  search: t('search'),
                  status: t('status'),
                  transportType: t('transport_type'),
                  shipmentType: t('shipment_type'),
                  productType: t('product_type'),
                  client: t('client'),
                  assignedTo: t('assignedTo'),
                  origin: t('origin'),
                  destination: t('destination'),
                  dateFrom: t('creation_date_from'),
                  dateTo: t('creation_date_to'),
                };

                return (
                  <span
                    key={key}
                    className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300"
                  >
                    {filterLabels[key as keyof typeof filterLabels]}: {value}
                    <button
                      onClick={() => clearFilter(key as keyof FilterState)}
                      className="ml-2 hover:text-blue-600 dark:hover:text-blue-400"
                    >
                      <X size={12} />
                    </button>
                  </span>
                );
              })}
            </div>
          </div>
        )}
      </div>

      {/* Sorting and View Options */}
      <div className={`${bgSecondary} rounded-lg ${shadowClass} p-4 mb-6 ${borderColor} border`}>
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
          {/* Results Summary */}
          <div className="flex items-center">
            <p className={`text-sm ${textSecondary}`}>
              {sortedFiles.length} {t('files_found')}
              {activeFiltersCount > 0 && ` ${t('filtered')}`}
            </p>
          </div>
          
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
            {/* Items per page selector */}
            <div className="flex items-center gap-2">
              <span className={`text-sm ${textMuted}`}>{t('itemsPerPage')}:</span>
              <select
                value={itemsPerPage}
                onChange={(e) => handleItemsPerPageChange(Number(e.target.value))}
                className={`px-2 py-1 text-sm border ${borderColor} rounded ${bgPrimary} ${textPrimary}`}
              >
                <option value={6}>6</option>
                <option value={9}>9</option>
                <option value={12}>12</option>
                <option value={24}>24</option>
              </select>
            </div>
            
            {/* View Mode Toggle */}
            {!isMobile && (
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setViewMode('grid')}
                  className={`p-2 rounded-lg transition-colors ${
                    viewMode === 'grid' 
                      ? 'bg-blue-600 text-white' 
                      : `${bgPrimary} ${textMuted} hover:${textPrimary} border ${borderColor}`
                  }`}
                >
                  <Grid size={18} />
                </button>
                <button
                  onClick={() => setViewMode('table')}
                  className={`p-2 rounded-lg transition-colors ${
                    viewMode === 'table' 
                      ? 'bg-blue-600 text-white' 
                      : `${bgPrimary} ${textMuted} hover:${textPrimary} border ${borderColor}`
                  }`}
                >
                  <Table size={18} />
                </button>
              </div>
            )}
            
            {/* Sorting Options */}
            <div className="flex flex-wrap items-center gap-2">
              <span className={`text-sm ${textMuted}`}>{t('sortBy')}:</span>
              
              <button
                onClick={() => handleSortChange('creationDate')}
                className={`inline-flex items-center px-3 py-1.5 text-sm border ${borderColor} rounded-lg ${bgPrimary} ${textPrimary} hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors ${
                  sortField === 'creationDate' ? 'ring-2 ring-blue-500 border-blue-500' : ''
                }`}
              >
                {t('creation_date')}
                {getSortIcon('creationDate')}
              </button>

              <button
                onClick={() => handleSortChange('reference')}
                className={`inline-flex items-center px-3 py-1.5 text-sm border ${borderColor} rounded-lg ${bgPrimary} ${textPrimary} hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors ${
                  sortField === 'reference' ? 'ring-2 ring-blue-500 border-blue-500' : ''
                }`}
              >
                {t('reference')}
                {getSortIcon('reference')}
              </button>

              <button
                onClick={() => handleSortChange('status')}
                className={`inline-flex items-center px-3 py-1.5 text-sm border ${borderColor} rounded-lg ${bgPrimary} ${textPrimary} hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors ${
                  sortField === 'status' ? 'ring-2 ring-blue-500 border-blue-500' : ''
                }`}
              >
                {t('current_event')}
                {getSortIcon('status')}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Content Display */}
      {sortedFiles.length > 0 ? (
        <div className="space-y-6">
          {viewMode === 'grid' || isMobile ? (
            <div className={`grid grid-cols-1 ${isTablet ? 'md:grid-cols-2' : 'md:grid-cols-2 lg:grid-cols-3'} gap-4 sm:gap-6`}>
              {paginatedFiles.map((file, index) => (
                <div
                  key={file.id}
                  className="transform transition-all duration-300 hover:scale-105"
                  style={{
                    animationName: 'fadeInScale',
                    animationDuration: '0.5s',
                    animationFillMode: 'both',
                    animationDelay: `${0.1 * index}s`
                  }}
                >
                  <FileCard file={file} />
                </div>
              ))}
            </div>
          ) : (
            <TableView />
          )}
          
          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex flex-col sm:flex-row justify-between items-center gap-4 pt-6">
              <div className={`text-sm ${textSecondary}`}>
                Page {currentPage} {t('of')} {totalPages}
              </div>
              
              <div className="flex items-center space-x-2">
                <button
                  onClick={() => handlePageChange(currentPage - 1)}
                  disabled={currentPage === 1}
                  className={`p-2 rounded-lg border ${borderColor} ${bgPrimary} ${textPrimary} disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 dark:hover:bg-gray-700`}
                >
                  <ChevronLeft size={18} />
                </button>
                
                {getPaginationNumbers().map((page, index) => (
                  page === '...' ? (
                    <span key={index} className={`px-3 py-2 ${textMuted}`}>...</span>
                  ) : (
                    <button
                      key={index}
                      onClick={() => handlePageChange(page as number)}
                      className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                        currentPage === page
                          ? 'bg-blue-600 text-white'
                          : `border ${borderColor} ${bgPrimary} ${textPrimary} hover:bg-gray-50 dark:hover:bg-gray-700`
                      }`}
                    >
                      {page}
                    </button>
                  )
                ))}
                
                <button
                  onClick={() => handlePageChange(currentPage + 1)}
                  disabled={currentPage === totalPages}
                  className={`p-2 rounded-lg border ${borderColor} ${bgPrimary} ${textPrimary} disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 dark:hover:bg-gray-700`}
                >
                  <ChevronRight size={18} />
                </button>
              </div>
            </div>
          )}
        </div>
      ) : (
        <div className={`${bgSecondary} rounded-lg ${shadowClass} p-8 sm:p-12 text-center`}>
          <FileText size={48} className={`mx-auto mb-4 ${textMuted}`} />
          <h3 className={`text-lg font-medium ${textPrimary} mb-2`}>
            {t('no_files_found')}
          </h3>
          <p className={textMuted}>
            {activeFiltersCount > 0 
              ? t('no_files_match_filters')
              : t('no_files_available')
            }
          </p>
          {activeFiltersCount > 0 && (
            <button
              onClick={clearAllFilters}
              className="mt-4 inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              {t('clear_all_filters')}
            </button>
          )}
        </div>
      )}

      {/* CSS Animations */}
      <style jsx global>{`
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }

        @keyframes fadeInScale {
          from {
            opacity: 0;
            transform: scale(0.95);
          }
          to {
            opacity: 1;
            transform: scale(1);
          }
        }

        .animate-fadeIn {
          animation: fadeIn 0.5s ease-out forwards;
        }

        .truncate {
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
        }
      `}</style>
    </div>
  );
};

export default TransitFilesPage;