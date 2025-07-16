import { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { useTheme } from '../../contexts/ThemeContext';
import { useLanguage } from '../../contexts/LanguageContext';
import { useNavigate } from 'react-router-dom';
import { getMockClients } from '../../services/clientService';
import { Client } from '../../types/client';
import { Container } from '../../types/container';
import LoadingScreen from '../../components/common/LoadingScreen';
import TransitEventsManager from '../../components/common/TransitEventsManager';
import { useMediaQuery } from 'react-responsive';
import {
  Search,
  Filter,
  FileText,
  X,
  User,
  MapPin,
  Package,
  Truck,
  Ship,
  Plane,
  RefreshCw,
  Eye,
  ChevronLeft,
  ChevronRight,
  Building,
  Hash,
  Clock,
  AlertTriangle,
  CheckCircle,
  Users,
  Info,
  Globe,
  Check,
  Edit3,
  Calendar,
} from 'lucide-react';
import { format } from 'date-fns';
import backImage from '../../utils/backGround_hearder.png';
import { TransitFile } from '../../types/transitFile';

interface TransitEvent {
  id: string;
  name: string;
  date: string;
  agentName: string;
  details: string;
  completed: boolean;
}
import { getTransitFiles } from '../../services/transitFileService';

interface FilterState {
  search: string;
  currentEvent: string;
  transportType: string;
  shipmentType: string;
  productType: string;
  client: string;
  origin: string;
  destination: string;
  dateFrom: string;
  dateTo: string;
}

const FileTrackingPage = () => {
  const { user } = useAuth();
  const { theme } = useTheme();
  const { t } = useLanguage();
  const navigate = useNavigate();
  const [isFiltersOpen, setIsFiltersOpen] = useState(false);
  const [transitFiles, setTransitFiles] = useState<TransitFile[]>([]);
  const [clients, setClients] = useState<Client[]>([]);
  const [filteredFiles, setFilteredFiles] = useState<TransitFile[]>([]);
  const [paginatedFiles, setPaginatedFiles] = useState<TransitFile[]>([]);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [itemsPerPage, setItemsPerPage] = useState<number>(9);
  const [totalPages, setTotalPages] = useState<number>(1);
  const [sortField, setSortField] = useState<'creationDate' | 'reference' | 'currentEvent'>('creationDate');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('desc');
  const [isLoading, setIsLoading] = useState(true);
  const [showFilters, setShowFilters] = useState(false);
  const [activeFiltersCount, setActiveFiltersCount] = useState(0);
  const [selectedFile, setSelectedFile] = useState<TransitFile | null>(null);
  const [events, setEvents] = useState<TransitEvent[]>([]);
  const [eventTypeFilter, setEventTypeFilter] = useState<'all' | 'export' | 'import'>('all');
  const [currentEventFilter, setCurrentEventFilter] = useState<string>('');

  const [filters, setFilters] = useState<FilterState>({
    search: '',
    currentEvent: '',
    transportType: '',
    shipmentType: '',
    productType: '',
    client: '',
    origin: '',
    destination: '',
    dateFrom: '',
    dateTo: '',
  });

  const isMobile = useMediaQuery({ maxWidth: 767 });
  const isTablet = useMediaQuery({ minWidth: 768, maxWidth: 1023 });

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
        setIsLoading(false);
      } catch (error) {
        console.error('Error fetching data:', error);
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  const getClientNames = (clientIds: string[]): string => {
    return clientIds
      .map(id => clients.find(client => client.id === id)?.name || '')
      .filter(name => name)
      .join(', ');
  };

  const getEvents = (shipmentType: 'export' | 'import', fileId?: string): TransitEvent[] => {
    const currentDate = format(new Date(), 'yyyy-MM-dd');
    const getRandomCompletedCount = () => {
      // Use fileId as a seed to get consistent results for the same file
      const seed = fileId ? parseInt(fileId.replace(/\D/g, '')) : Math.random() * 100;
      return Math.floor((seed % 8) + 1); // 1 to 8 events completed
    };

    const completedCount = getRandomCompletedCount();

    if (shipmentType === 'export') {
      const events = [
        { id: 'ep1', name: t('export_pregate'), details: '', date: currentDate, agentName: 'John Doe', completed: false },
        { id: 'ep2', name: t('warehouse_reception'), details: '', date: currentDate, agentName: 'Alice Smith', completed: false },
        { id: 'ep3', name: t('declaration'), details: '', date: currentDate, agentName: 'Bob Johnson', completed: false },
        { id: 'ep4', name: t('export_customs_clearance'), details: '', date: currentDate, agentName: 'Carol White', completed: false },
        { id: 'ep5', name: t('warehouse_loading'), details: '', date: currentDate, agentName: 'David Brown', completed: false },
        { id: 'ep6', name: t('effective_transport'), details: '', date: currentDate, agentName: 'Eve Wilson', completed: false },
        { id: 'ep7', name: t('vessel_loading'), details: '', date: currentDate, agentName: 'Frank Miller', completed: false },
        { id: 'ep8', name: t('departure'), details: '', date: currentDate, agentName: 'Grace Davis', completed: false },
        { id: 'ep9', name: t('estimated_arrival'), details: '', date: currentDate, agentName: 'Henry Clark', completed: false },
        { id: 'ep10', name: t('billing'), details: '', date: currentDate, agentName: 'Ivy Anderson', completed: false }
      ];

      // Mark first N events as completed
      events.slice(0, completedCount).forEach(event => event.completed = true);
      return events;
    } else {
      const events = [
        { id: 'ip1', name: t('import_prealert'), details: '', date: currentDate, agentName: 'John Doe', completed: false },
        { id: 'ip2', name: t('arrival'), details: '', date: currentDate, agentName: 'Alice Smith', completed: false },
        { id: 'ip3', name: t('declaration'), details: '', date: currentDate, agentName: 'Bob Johnson', completed: false },
        { id: 'ip4', name: t('import_customs_clearance'), details: '', date: currentDate, agentName: 'Carol White', completed: false },
        { id: 'ip5', name: t('maritime_company_slip'), details: '', date: currentDate, agentName: 'David Brown', completed: false },
        { id: 'ip6', name: t('import_pregate'), details: '', date: currentDate, agentName: 'Eve Wilson', completed: false },
        { id: 'ip7', name: t('pickup'), details: '', date: currentDate, agentName: 'Frank Miller', completed: false },
        { id: 'ip8', name: t('delivery'), details: '', date: currentDate, agentName: 'Grace Davis', completed: false },
        { id: 'ip9', name: t('warehouse_arrival'), details: '', date: currentDate, agentName: 'Henry Clark', completed: false },
        { id: 'ip10', name: t('billing'), details: '', date: currentDate, agentName: 'Ivy Anderson', completed: false }
      ];

      // Mark first N events as completed
      events.slice(0, completedCount).forEach(event => event.completed = true);
      return events;
    }
  };

  const handleEventChange = (eventId: string, field: 'completed' | 'date' | 'details', value: boolean | string) => {
    setEvents(prev => prev.map(event =>
      event.id === eventId ? { ...event, [field]: value } : event
    ));
  };

  const handleFileSelect = (file: TransitFile) => {
    setSelectedFile(file);
    setEvents(getEvents(file.shipmentType, file.id));
  };

  const handleCloseModal = () => {
    setSelectedFile(null);
    setEvents([]);
  };

  const getDepartmentInfo = (eventName: string) => {
    const eventKey = eventName.toLowerCase();

    if (eventKey.includes('pregate') || eventKey.includes('declaration') || eventKey.includes('customs') || eventKey.includes('clearance')) {
      return { dept: t('customs'), color: 'green', bg: 'bg-green-50 dark:bg-green-900/20', border: 'border-green-200 dark:border-green-700', text: 'text-green-800 dark:text-green-300' };
    } else if (eventKey.includes('transport') || eventKey.includes('loading') || eventKey.includes('departure') || eventKey.includes('arrival')) {
      return { dept: t('transport'), color: 'purple', bg: 'bg-purple-50 dark:bg-purple-900/20', border: 'border-purple-200 dark:border-purple-700', text: 'text-purple-800 dark:text-purple-300' };
    } else if (eventKey.includes('warehouse') || eventKey.includes('reception') || eventKey.includes('pickup') || eventKey.includes('delivery')) {
      return { dept: t('logistics'), color: 'orange', bg: 'bg-orange-50 dark:bg-orange-900/20', border: 'border-orange-200 dark:border-orange-700', text: 'text-orange-800 dark:text-orange-300' };
    } else if (eventKey.includes('billing') || eventKey.includes('prealert')) {
      return { dept: t('commercial'), color: 'pink', bg: 'bg-pink-50 dark:bg-pink-900/20', border: 'border-pink-200 dark:border-pink-700', text: 'text-pink-800 dark:text-pink-300' };
    }
    return { dept: t('other'), color: 'blue', bg: 'bg-blue-50 dark:bg-blue-900/20', border: 'border-blue-200 dark:border-blue-700', text: 'text-blue-800 dark:text-blue-300' };
  };

  const getCurrentEvent = (file: TransitFile): string => {
    const fileEvents = getEvents(file.shipmentType, file.id);
    const currentEvent = fileEvents.find(event => !event.completed);
    return currentEvent ? currentEvent.name : t('completed');
  };

  const handleFilterChange = (key: keyof FilterState, value: string) => {
    setFilters(prev => ({ ...prev, [key]: value }));
  };

  const handleEventFilterClick = (eventName: string, shipmentType: 'export' | 'import') => {
    setEventTypeFilter(shipmentType);
    setCurrentEventFilter(eventName);
  };

  const clearEventFilter = () => {
    setCurrentEventFilter('');
  };

  const clearAllFilters = () => {
    setFilters({
      search: '',
      currentEvent: '',
      transportType: '',
      shipmentType: '',
      productType: '',
      client: '',
      origin: '',
      destination: '',
      dateFrom: '',
      dateTo: '',
    });
    setEventTypeFilter('all');
    setCurrentEventFilter('');
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const handleItemsPerPageChange = (value: number) => {
    setItemsPerPage(value);
    setCurrentPage(1); // Reset to first page when changing items per page
  };

  const handleSortChange = (field: 'creationDate' | 'reference' | 'currentEvent') => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  };

  const getSortIcon = (field: 'creationDate' | 'reference' | 'currentEvent') => {
    if (sortField !== field) return null;
    return sortDirection === 'asc' ? '↑' : '↓';
  };

  const getPaginationNumbers = () => {
    const pages = [];
    const maxVisiblePages = 5;
    
    if (totalPages <= maxVisiblePages) {
      // Show all pages if total pages is less than or equal to max visible pages
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      // Always show first page
      pages.push(1);
      
      // Calculate start and end of the middle section
      let startPage = Math.max(2, currentPage - 1);
      let endPage = Math.min(totalPages - 1, currentPage + 1);
      
      // Adjust if we're near the beginning
      if (currentPage <= 3) {
        endPage = Math.min(totalPages - 1, 4);
      }
      
      // Adjust if we're near the end
      if (currentPage >= totalPages - 2) {
        startPage = Math.max(2, totalPages - 3);
      }
      
      // Add ellipsis if needed before middle section
      if (startPage > 2) {
        pages.push('...');
      }
      
      // Add middle section
      for (let i = startPage; i <= endPage; i++) {
        pages.push(i);
      }
      
      // Add ellipsis if needed after middle section
      if (endPage < totalPages - 1) {
        pages.push('...');
      }
      
      // Always show last page
      pages.push(totalPages);
    }
    
    return pages;
  };

  useEffect(() => {
    let filtered = [...transitFiles];

    if (filters.search) {
      const searchLower = filters.search.toLowerCase();
      filtered = filtered.filter(file =>
        file.reference.toLowerCase().includes(searchLower) ||
        file.blNumber.toLowerCase().includes(searchLower) ||
        getClientNames(file.clientIds).toLowerCase().includes(searchLower)
      );
    }

    if (filters.currentEvent) {
      filtered = filtered.filter(file => file.currentEvent === filters.currentEvent);
    }

    if (filters.transportType) {
      filtered = filtered.filter(file => file.transportType === filters.transportType);
    }

    if (filters.shipmentType) {
      filtered = filtered.filter(file => file.shipmentType === filters.shipmentType);
    }

    if (filters.productType) {
      filtered = filtered.filter(file => file.productType === filters.productType);
    }

    if (filters.client) {
      filtered = filtered.filter(file => file.clientIds.includes(filters.client));
    }

    if (filters.origin) {
      filtered = filtered.filter(file =>
        file.origin.toLowerCase().includes(filters.origin.toLowerCase())
      );
    }

    if (filters.destination) {
      filtered = filtered.filter(file =>
        file.destination.toLowerCase().includes(filters.destination.toLowerCase())
      );
    }

    if (filters.dateFrom) {
      filtered = filtered.filter(file =>
        new Date(file.createdAt) >= new Date(filters.dateFrom)
      );
    }

    if (filters.dateTo) {
      filtered = filtered.filter(file =>
        new Date(file.createdAt) <= new Date(filters.dateTo)
      );
    }
    
    // Filter by event type (export/import)
    if (eventTypeFilter !== 'all') {
      filtered = filtered.filter(file => file.shipmentType === eventTypeFilter);
    }

    // Filter by specific event if one is selected
    if (currentEventFilter) {
      filtered = filtered.filter(file => {
        const currentEvent = getCurrentEvent(file);
        return currentEvent === currentEventFilter;
      });
    }

    setFilteredFiles(filtered);

    const activeFilters = Object.values(filters).filter(Boolean).length;
    setActiveFiltersCount(activeFilters);
  }, [filters, transitFiles, clients, eventTypeFilter, currentEventFilter]);
  
  useEffect(() => {
    if (!isLoading) {
      // Apply sorting
      const sorted = [...filteredFiles].sort((a, b) => {
        if (sortField === 'creationDate') {
          return sortDirection === 'asc'
            ? new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
            : new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
        } else if (sortField === 'reference') {
          return sortDirection === 'asc'
            ? a.reference.localeCompare(b.reference)
            : b.reference.localeCompare(a.reference);
        } else if (sortField === 'currentEvent') {

          const currentEventA = getCurrentEvent(a);
          const currentEventB = getCurrentEvent(b);
          return sortDirection === 'asc'
            ? currentEventA.localeCompare(currentEventB)
            : currentEventB.localeCompare(currentEventA);
        }
        return 0;
      });

      // Calculate total pages
      const totalPagesCount = Math.ceil(sorted.length / itemsPerPage);
      setTotalPages(totalPagesCount);

      // Adjust current page if it exceeds total pages
      if (currentPage > totalPagesCount) {
        setCurrentPage(Math.max(1, totalPagesCount));
      }

      // Apply pagination
      const startIndex = (currentPage - 1) * itemsPerPage;
      const endIndex = startIndex + itemsPerPage;
      setPaginatedFiles(sorted.slice(startIndex, endIndex));
    }
  }, [filteredFiles, currentPage, itemsPerPage, sortField, sortDirection, isLoading]);

  if (isLoading) {
    return <LoadingScreen />;
  }

  // Définir l'ordre des événements pour export et import
  const exportEventOrder = [
    t('export_pregate'),
    t('warehouse_reception'),
    t('declaration'),
    t('export_customs_clearance'),
    t('warehouse_loading'),
    t('effective_transport'),
    t('vessel_loading'),
    t('departure'),
    t('estimated_arrival'),
    t('billing')
  ];

  const importEventOrder = [
    t('import_prealert'),
    t('arrival'),
    t('declaration'),
    t('import_customs_clearance'),
    t('maritime_company_slip'),
    t('import_pregate'),
    t('pickup'),
    t('delivery'),
    t('warehouse_arrival'),
    t('billing')
  ];

  const getEventStats = () => {
    // Initialiser tous les événements avec un compteur à 0
    const stats = {
      export: Object.fromEntries(exportEventOrder.map(event => [event, 0])),
      import: Object.fromEntries(importEventOrder.map(event => [event, 0]))
    };

    // Compter les événements pour chaque fichier
    transitFiles.forEach(file => {
      // Vérifier si le fichier correspond aux filtres actuels (sauf le filtre d'événement lui-même)
      let matchesFilters = true;
      
      // Appliquer les filtres de recherche
      if (filters.search) {
        const searchLower = filters.search.toLowerCase();
        if (!(
          file.reference.toLowerCase().includes(searchLower) ||
          file.blNumber.toLowerCase().includes(searchLower) ||
          getClientNames(file.clientIds).toLowerCase().includes(searchLower)
        )) {
          matchesFilters = false;
        }
      }
      
      // Appliquer les filtres de date
      if (filters.dateFrom && matchesFilters) {
        if (new Date(file.createdAt) < new Date(filters.dateFrom)) {
          matchesFilters = false;
        }
      }
      
      if (filters.dateTo && matchesFilters) {
        if (new Date(file.createdAt) > new Date(filters.dateTo)) {
          matchesFilters = false;
        }
      }
      
      // Si le fichier correspond aux filtres, compter son événement actuel
      if (matchesFilters) {
        const currentEventName = getCurrentEvent(file);
        if (file.shipmentType === 'export') {
          if (stats.export.hasOwnProperty(currentEventName)) {
            stats.export[currentEventName] += 1;
          }
        } else if (file.shipmentType === 'import') {
          if (stats.import.hasOwnProperty(currentEventName)) {
            stats.import[currentEventName] += 1;
          }
        }
      }
    });

    return stats;
  };

  const eventStats = getEventStats();

  return (
    <div>
      <div className="px-4 sm:px-6 lg:px-8 py-6 space-y-6" >

        {/* Filtres avec onglets */}
        <div className="mb-4 sm:mb-6">
          {/* Contenu des filtres */}
          <div className={`${bgSecondary} rounded-lg ${shadowClass} ${borderColor} border overflow-hidden`}>
            {/* Onglets */}
            <div className="flex border-b ${borderColor}">
              <button
                onClick={() => setIsFiltersOpen(false)}
                className={`flex-1 px-4 py-3 text-sm font-medium transition-colors ${!isFiltersOpen 
                  ? `bg-blue-500 text-white`
                  : `hover:bg-gray-100 dark:hover:bg-gray-700 ${textPrimary}`}`}
              >
                {t('event_filters')}
              </button>
              <button
                onClick={() => setIsFiltersOpen(true)}
                className={`flex-1 px-4 py-3 text-sm font-medium transition-colors ${isFiltersOpen 
                  ? `bg-blue-500 text-white`
                  : `hover:bg-gray-100 dark:hover:bg-gray-700 ${textPrimary}`}`}
              >
                {t('advanced_filters')}
              </button>
            </div>

            {/* Contenu des onglets */}
            <div className="p-4">
              {/* Filtres actifs - toujours visibles */}
              {(activeFiltersCount > 0 || currentEventFilter) && (
                <div className="mb-4">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs sm:text-sm font-medium text-gray-700 dark:text-gray-300">
                      {t('active_filters')}
                    </span>
                    <button
                      onClick={clearAllFilters}
                      className="text-[10px] sm:text-xs text-red-600 hover:text-red-800 dark:text-red-400 dark:hover:text-red-300"
                    >
                      {t('clear_all')}
                    </button>
                  </div>
                  <div className="flex flex-wrap gap-1">
                    {currentEventFilter && (
                      <span className="inline-flex items-center gap-0.5 sm:gap-1 px-1.5 sm:px-2 py-0.5 sm:py-1 bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 rounded-md text-[10px] sm:text-xs">
                        {currentEventFilter}
                        <button onClick={clearEventFilter}>
                          <X size={10} className="sm:hidden" />
                          <X size={12} className="hidden sm:block" />
                        </button>
                      </span>
                    )}
                    {Object.entries(filters).map(([key, value]) =>
                      value && (
                        <span key={key} className="inline-flex items-center gap-0.5 sm:gap-1 px-1.5 sm:px-2 py-0.5 sm:py-1 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-md text-[10px] sm:text-xs">
                          {typeof value === 'string' ? value : t(value)}
                          <button onClick={() => handleFilterChange(key, '')}>
                            <X size={10} className="sm:hidden" />
                            <X size={12} className="hidden sm:block" />
                          </button>
                        </span>
                      )
                    )}
                  </div>
                </div>
              )}

              {/* Onglet Filtres d'événements */}
              {!isFiltersOpen && (
                <div>
                  {/* Toggle export/import */}
                  <div className="flex justify-center mb-4">
                    <div className="flex bg-gray-100 dark:bg-gray-800 rounded-lg p-1">
                      {['all', 'export', 'import'].map(type => (
                        <button
                          key={type}
                          onClick={() => {
                            setEventTypeFilter(type);
                            setCurrentEventFilter('');
                          }}
                          className={`px-3 py-1 text-sm font-medium rounded-md transition-all duration-200 ${eventTypeFilter === type
                              ? 'bg-white dark:bg-gray-700 text-gray-900 dark:text-white shadow-sm'
                              : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
                            }`}
                        >
                          {t(type)}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Events sous forme de chips horizontaux */}
                  <div className="flex flex-wrap gap-2">
                    {/* Export Events */}
                    {(eventTypeFilter === 'all' || eventTypeFilter === 'export') &&
                      exportEventOrder.map(eventName => (
                        <button
                          key={`export-${eventName}`}
                          onClick={() => handleEventFilterClick(eventName, 'export')}
                          className={`group relative px-3 py-1.5 rounded-full text-sm font-medium transition-all duration-200 ${currentEventFilter === eventName && eventTypeFilter === 'export'
                              ? 'bg-green-500 text-white shadow-md'
                              : 'bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-300 hover:bg-green-100 dark:hover:bg-green-900/30'
                            }`}
                        >
                          <div className="flex items-center gap-2">
                            <div className="w-2 h-2 bg-current rounded-full opacity-60"></div>
                            <span>{eventName}</span>
                            <span className={`px-1.5 py-0.5 rounded-full text-xs ${currentEventFilter === eventName && eventTypeFilter === 'export'
                                ? 'bg-white/20 text-white'
                                : 'bg-green-200 dark:bg-green-800 text-green-800 dark:text-green-200'
                              }`}>
                              {eventStats.export[eventName]}
                            </span>
                          </div>
                        </button>
                      ))
                    }

                    {/* Import Events */}
                    {(eventTypeFilter === 'all' || eventTypeFilter === 'import') &&
                      importEventOrder.map(eventName => (
                        <button
                          key={`import-${eventName}`}
                          onClick={() => handleEventFilterClick(eventName, 'import')}
                          className={`group relative px-3 py-1.5 rounded-full text-sm font-medium transition-all duration-200 ${currentEventFilter === eventName && eventTypeFilter === 'import'
                              ? 'bg-blue-500 text-white shadow-md'
                              : 'bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300 hover:bg-blue-100 dark:hover:bg-blue-900/30'
                            }`}
                        >
                          <div className="flex items-center gap-2">
                            <div className="w-2 h-2 bg-current rounded-full opacity-60"></div>
                            <span>{eventName}</span>
                            <span className={`px-1.5 py-0.5 rounded-full text-xs ${currentEventFilter === eventName && eventTypeFilter === 'import'
                                ? 'bg-white/20 text-white'
                                : 'bg-blue-200 dark:bg-blue-800 text-blue-800 dark:text-blue-200'
                              }`}>
                              {eventStats.import[eventName]}
                            </span>
                          </div>
                        </button>
                      ))
                    }
                  </div>
                </div>
              )}

              {/* Onglet Filtres avancés */}
              {isFiltersOpen && (
                <div className="space-y-4">
                  {/* Recherche */}
                  <div>
                    <label className="block text-xs sm:text-sm font-medium text-gray-700 dark:text-gray-300 mb-1 sm:mb-2">
                      {t('search')}
                    </label>
                    <div className="relative">
                      <Search size={14} className="absolute left-2.5 sm:left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                      <input
                        type="text"
                        placeholder={t('searchPlaceholder')}
                        value={filters.search}
                        onChange={(e) => handleFilterChange('search', e.target.value)}
                        className={`w-full pl-8 sm:pl-10 pr-3 sm:pr-4 py-1.5 sm:py-2 border ${borderColor} rounded-lg ${bgPrimary} ${textPrimary} focus:outline-none focus:ring-2 focus:ring-blue-500 text-xs sm:text-sm`}
                      />
                    </div>
                  </div>

                  {/* Date Range */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div>
                        <label className="block text-xs sm:text-sm font-medium text-gray-700 dark:text-gray-300 mb-1 sm:mb-2">
                          {t('date_from')}
                        </label>
                        <input
                          type="date"
                          value={filters.dateFrom}
                          onChange={(e) => handleFilterChange('dateFrom', e.target.value)}
                          className={`w-full px-2 sm:px-3 py-1.5 sm:py-2 border ${borderColor} rounded-lg ${bgPrimary} ${textPrimary} focus:outline-none focus:ring-2 focus:ring-blue-500 text-xs sm:text-sm`}
                        />
                      </div>
                      <div>
                        <label className="block text-xs sm:text-sm font-medium text-gray-700 dark:text-gray-300 mb-1 sm:mb-2">
                          {t('date_to')}
                        </label>
                        <input
                          type="date"
                          value={filters.dateTo}
                          onChange={(e) => handleFilterChange('dateTo', e.target.value)}
                          className={`w-full px-2 sm:px-3 py-1.5 sm:py-2 border ${borderColor} rounded-lg ${bgPrimary} ${textPrimary} focus:outline-none focus:ring-2 focus:ring-blue-500 text-xs sm:text-sm`}
                        />
                      </div>
                    </div>
                  </div>
                )}
            </div>
          </div>

          {/* Contenu principal */}
          <div className="mt-4">

            {/* Espace pour le contenu principal */}
            <div className={`${bgSecondary} rounded-lg ${shadowClass} p-4 ${borderColor} border`}>
              <div >

                {/* Content */}
                <div >
                  <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 sm:gap-0 mb-4">
                    {/* Options de tri */}
                    <div className="flex flex-wrap items-center gap-2 sm:space-x-4">
                      <button
                        onClick={() => handleSortChange('creationDate')}
                        className={`px-2 sm:px-3 py-1 sm:py-1.5 text-xs sm:text-sm font-medium rounded-lg transition-colors ${sortField === 'creationDate' ? 'bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300' : 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700'}`}
                      >
                        {t('creation_date')} {getSortIcon('creationDate')}
                      </button>
                      <button
                        onClick={() => handleSortChange('reference')}
                        className={`px-2 sm:px-3 py-1 sm:py-1.5 text-xs sm:text-sm font-medium rounded-lg transition-colors ${sortField === 'reference' ? 'bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300' : 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700'}`}
                      >
                        {t('reference')} {getSortIcon('reference')}
                      </button>
                      <button
                        onClick={() => handleSortChange('currentEvent')}
                        className={`px-2 sm:px-3 py-1 sm:py-1.5 text-xs sm:text-sm font-medium rounded-lg transition-colors ${sortField === 'currentEvent' ? 'bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300' : 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700'}`}
                      >
                        {t('current_event')} {getSortIcon('currentEvent')}
                      </button>
                    </div>

                    {/* Items per page */}
                    <div className="flex items-center space-x-2">
                      <span className={`text-xs sm:text-sm ${textSecondary}`}>{t('items_per_page')}:</span>
                      <select
                        value={itemsPerPage}
                        onChange={(e) => handleItemsPerPageChange(Number(e.target.value))}
                        className={`px-2 py-1 text-xs sm:text-sm border ${borderColor} rounded-lg ${bgPrimary} ${textPrimary} focus:outline-none focus:ring-2 focus:ring-blue-500`}
                      >
                        {[9, 18, 27, 36].map(value => (
                          <option key={value} value={value}>{value}</option>
                        ))}
                      </select>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
                    {paginatedFiles.map(file => (
                        <div
                          key={file.id}
                          className={`rounded-lg border ${borderColor} ${bgSecondary} ${shadowClass} transition-shadow duration-200 ${hoverShadow} overflow-hidden cursor-pointer`}
                          onClick={() => handleFileSelect(file)}
                        >
                          <div className="p-3 sm:p-4 space-y-3 sm:space-y-4">
                            <div className="flex items-start justify-between">
                              <div>
                                <h3 className={`text-sm sm:text-base font-medium ${textPrimary}`}>{file.reference}</h3>
                                <p className={`text-xs sm:text-sm ${textMuted}`}>{file.blNumber}</p>
                              </div>
                              <div className={`px-2 sm:px-3 py-0.5 sm:py-1 rounded-full text-xs sm:text-sm ${getDepartmentInfo(getCurrentEvent(file)).bg} ${getDepartmentInfo(getCurrentEvent(file)).text} ${getDepartmentInfo(getCurrentEvent(file)).border}`}>
                                {getCurrentEvent(file)}
                              </div>
                            </div>

                            <div className="grid grid-cols-2 gap-2 sm:gap-4">
                              <div className="flex items-center gap-1 sm:gap-2">
                                <Users className={`h-4 w-4 sm:h-5 sm:w-5 ${textMuted}`} />
                                <span className={`text-xs sm:text-sm truncate ${textSecondary}`}>{getClientNames(file.clientIds)}</span>
                              </div>
                              <div className="flex items-center gap-1 sm:gap-2">
                                {file.transportType === 'air' ? (
                                  <Plane className={`h-4 w-4 sm:h-5 sm:w-5 ${textMuted}`} />
                                ) : (
                                  <Ship className={`h-4 w-4 sm:h-5 sm:w-5 ${textMuted}`} />
                                )}
                                <span className={`text-xs sm:text-sm truncate ${textSecondary}`}>{t(file.transportType)}</span>
                              </div>
                              <div className="flex items-center gap-1 sm:gap-2">
                                <Package className={`h-4 w-4 sm:h-5 sm:w-5 ${textMuted}`} />
                                <span className={`text-xs sm:text-sm truncate ${textSecondary}`}>{t(file.shipmentType)}</span>
                              </div>
                              <div className="flex items-center gap-1 sm:gap-2">
                                <Clock className={`h-4 w-4 sm:h-5 sm:w-5 ${textMuted}`} />
                                <span className={`text-xs sm:text-sm ${textSecondary}`}>
                                  {format(new Date(file.createdAt), 'dd/MM/yyyy')}
                                </span>
                              </div>
                            </div>

                            <div className="flex items-center gap-1 sm:gap-2">
                              <MapPin className={`h-4 w-4 sm:h-5 sm:w-5 ${textMuted}`} />
                              <span className={`text-xs sm:text-sm truncate ${textSecondary}`}>
                                {file.origin} → {file.destination}
                              </span>
                            </div>
                          </div>
                        </div>
                      ))}
                  </div>

                  {/* Pagination */}
                  <div className="mt-6 flex flex-col sm:flex-row items-center justify-between gap-4">
                    <div className="text-xs sm:text-sm text-gray-600 dark:text-gray-400 text-center sm:text-left">
                      {t('showing')} <span className="font-medium">{Math.min(filteredFiles.length, (currentPage - 1) * itemsPerPage + 1)}</span> {t('to')} <span className="font-medium">{Math.min(filteredFiles.length, currentPage * itemsPerPage)}</span> {t('of')} <span className="font-medium">{filteredFiles.length}</span> {t('results')}.
                    </div>
                    
                    <div className="flex items-center space-x-1">
                      <button
                        onClick={() => handlePageChange(Math.max(1, currentPage - 1))}
                        disabled={currentPage === 1}
                        className={`px-2 sm:px-3 py-1 rounded-md text-xs sm:text-sm font-medium ${currentPage === 1 ? 'text-gray-400 cursor-not-allowed' : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800'}`}
                      >
                        <ChevronLeft className="h-3 sm:h-4 w-3 sm:w-4" />
                      </button>
                      
                      {getPaginationNumbers().map((page, index) => (
                        <button
                          key={index}
                          onClick={() => typeof page === 'number' ? handlePageChange(page) : null}
                          disabled={page === '...'}
                          className={`px-2 sm:px-3 py-1 rounded-md text-xs sm:text-sm font-medium ${typeof page === 'number' && page === currentPage
                            ? 'bg-blue-500 text-white'
                            : page === '...'
                              ? 'text-gray-400 cursor-default'
                              : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800'
                          }`}
                        >
                          {page}
                        </button>
                      ))}
                      
                      <button
                        onClick={() => handlePageChange(Math.min(totalPages, currentPage + 1))}
                        disabled={currentPage === totalPages}
                        className={`px-3 py-1 rounded-md text-sm font-medium ${currentPage === totalPages ? 'text-gray-400 cursor-not-allowed' : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800'}`}
                      >
                        <ChevronRight className="h-4 w-4" />
                      </button>
                    </div>
                  </div>

                  {/* File details modal */}
                  {selectedFile && (
                    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-2 sm:p-4 z-50" onClick={handleCloseModal}>
                      <div className={`w-full max-w-4xl max-h-[90vh] overflow-y-auto rounded-lg ${bgPrimary} ${shadowClass}`} onClick={e => e.stopPropagation()}>
                        <div className="p-4 sm:p-6 space-y-4 sm:space-y-6">
                          <div className="flex items-start justify-between">
                            <div>
                              <h2 className={`text-lg sm:text-xl font-semibold ${textPrimary}`}>{selectedFile.reference}</h2>
                              <p className={`text-xs sm:text-sm ${textMuted}`}>{selectedFile.blNumber}</p>
                            </div>
                            <button
                              className={`p-1.5 sm:p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 ${textMuted}`}
                              onClick={handleCloseModal}
                            >
                              <X className="h-5 w-5 sm:h-6 sm:w-6" />
                            </button>
                          </div>

                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
                            <div className="space-y-3 sm:space-y-4">
                              <div className="flex items-center gap-1.5 sm:gap-2">
                                <Users className={`h-4 w-4 sm:h-5 sm:w-5 ${textMuted}`} />
                                <span className={`text-xs sm:text-sm ${textSecondary}`}>{getClientNames(selectedFile.clientIds)}</span>
                              </div>
                              <div className="flex items-center gap-1.5 sm:gap-2">
                                {selectedFile.transportType === 'air' ? (
                                  <Plane className={`h-4 w-4 sm:h-5 sm:w-5 ${textMuted}`} />
                                ) : (
                                  <Ship className={`h-4 w-4 sm:h-5 sm:w-5 ${textMuted}`} />
                                )}
                                <span className={`text-xs sm:text-sm ${textSecondary}`}>{t(selectedFile.transportType)}</span>
                              </div>
                              <div className="flex items-center gap-1.5 sm:gap-2">
                                <Package className={`h-4 w-4 sm:h-5 sm:w-5 ${textMuted}`} />
                                <span className={`text-xs sm:text-sm ${textSecondary}`}>{t(selectedFile.shipmentType)}</span>
                              </div>
                              <div className="flex items-center gap-1.5 sm:gap-2">
                                <MapPin className={`h-4 w-4 sm:h-5 sm:w-5 ${textMuted}`} />
                                <span className={`text-xs sm:text-sm ${textSecondary}`}>
                                  {selectedFile.origin} → {selectedFile.destination}
                                </span>
                              </div>
                            </div>

                            <div className="space-y-3 sm:space-y-4">
                              <div className="flex items-center gap-1.5 sm:gap-2">
                                <Building className={`h-4 w-4 sm:h-5 sm:w-5 ${textMuted}`} />
                                <span className={`text-xs sm:text-sm ${textSecondary}`}>{t(selectedFile.productType)}</span>
                              </div>
                              <div className="flex items-center gap-1.5 sm:gap-2">
                                <Hash className={`h-4 w-4 sm:h-5 sm:w-5 ${textMuted}`} />
                                <span className={`text-xs sm:text-sm ${textSecondary}`}>{selectedFile.capacity}</span>
                              </div>
                              <div className="flex items-center gap-1.5 sm:gap-2">
                                <Clock className={`h-4 w-4 sm:h-5 sm:w-5 ${textMuted}`} />
                                <span className={`text-xs sm:text-sm ${textSecondary}`}>
                                  {format(new Date(selectedFile.createdAt), 'dd/MM/yyyy HH:mm')}
                                </span>
                              </div>
                            </div>
                          </div>

                          {/* Events timeline */}
                          <div className="mt-6 sm:mt-8">
                            {/* Utilisation du composant TransitEventsManager */}
                            <TransitEventsManager 
                              events={events.map(event => ({
                                ...event,
                                agentId: event.agentName // Ajout d'un agentId temporaire basé sur le nom
                              }))} 
                              onEventChange={handleEventChange}
                              isDark={isDark}
                              t={t}
                              readOnly={false}
                            />
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                </div>

              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FileTrackingPage;