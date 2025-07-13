import { useState, useEffect } from 'react';
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
  status: string;
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

  const [transitFiles, setTransitFiles] = useState<TransitFile[]>([]);
  const [clients, setClients] = useState<Client[]>([]);
  const [filteredFiles, setFilteredFiles] = useState<TransitFile[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showFilters, setShowFilters] = useState(false);
  const [activeFiltersCount, setActiveFiltersCount] = useState(0);
  const [selectedFile, setSelectedFile] = useState<TransitFile | null>(null);
  const [events, setEvents] = useState<TransitEvent[]>([]);
  const [eventTypeFilter, setEventTypeFilter] = useState<'all' | 'export' | 'import'>('all');
  const [currentEventFilter, setCurrentEventFilter] = useState<string>('');

  const [filters, setFilters] = useState<FilterState>({
    search: '',
    status: '',
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
        { id: 'ep1', name: t('export_pregate'), details: 'Pregate completed successfully', date: currentDate, agentName: 'John Doe', completed: false },
        { id: 'ep2', name: t('warehouse_reception'), details: 'Goods received at warehouse', date: currentDate, agentName: 'Alice Smith', completed: false },
        { id: 'ep3', name: t('declaration'), details: 'Declaration submitted', date: currentDate, agentName: 'Bob Johnson', completed: false },
        { id: 'ep4', name: t('export_customs_clearance'), details: 'Customs clearance in progress', date: currentDate, agentName: 'Carol White', completed: false },
        { id: 'ep5', name: t('warehouse_loading'), details: 'Loading scheduled for tomorrow', date: currentDate, agentName: 'David Brown', completed: false },
        { id: 'ep6', name: t('effective_transport'), details: 'Transport en route', date: currentDate, agentName: 'Eve Wilson', completed: false },
        { id: 'ep7', name: t('vessel_loading'), details: 'Awaiting vessel arrival', date: currentDate, agentName: 'Frank Miller', completed: false },
        { id: 'ep8', name: t('departure'), details: 'Scheduled for next week', date: currentDate, agentName: 'Grace Davis', completed: false },
        { id: 'ep9', name: t('estimated_arrival'), details: 'ETA to be confirmed', date: currentDate, agentName: 'Henry Clark', completed: false },
        { id: 'ep10', name: t('billing'), details: 'Pending completion', date: currentDate, agentName: 'Ivy Anderson', completed: false }
      ];

      // Mark first N events as completed
      events.slice(0, completedCount).forEach(event => event.completed = true);
      return events;
    } else {
      const events = [
        { id: 'ip1', name: t('import_prealert'), details: 'Documents received', date: currentDate, agentName: 'John Doe', completed: false },
        { id: 'ip2', name: t('arrival'), details: 'Vessel arrived at port', date: currentDate, agentName: 'Alice Smith', completed: false },
        { id: 'ip3', name: t('declaration'), details: 'Declaration in process', date: currentDate, agentName: 'Bob Johnson', completed: false },
        { id: 'ip4', name: t('import_customs_clearance'), details: 'Awaiting customs approval', date: currentDate, agentName: 'Carol White', completed: false },
        { id: 'ip5', name: t('maritime_company_slip'), details: 'Slip issued', date: currentDate, agentName: 'David Brown', completed: false },
        { id: 'ip6', name: t('import_pregate'), details: 'Pregate validation ongoing', date: currentDate, agentName: 'Eve Wilson', completed: false },
        { id: 'ip7', name: t('pickup'), details: 'Scheduled for tomorrow', date: currentDate, agentName: 'Frank Miller', completed: false },
        { id: 'ip8', name: t('delivery'), details: 'Pending pickup completion', date: currentDate, agentName: 'Grace Davis', completed: false },
        { id: 'ip9', name: t('warehouse_arrival'), details: 'Not yet scheduled', date: currentDate, agentName: 'Henry Clark', completed: false },
        { id: 'ip10', name: t('billing'), details: 'To be processed', date: currentDate, agentName: 'Ivy Anderson', completed: false }
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

    if (filters.status) {
      filtered = filtered.filter(file => file.status === filters.status);
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

    setFilteredFiles(filtered);

    const activeFilters = Object.values(filters).filter(Boolean).length;
    setActiveFiltersCount(activeFilters);
  }, [filters, transitFiles, clients]);

  if (isLoading) {
    return <LoadingScreen />;
  }

  const getEventStats = () => {
    const stats = {
      export: {} as Record<string, number>,
      import: {} as Record<string, number>
    };

    filteredFiles.forEach(file => {
      const currentEventName = getCurrentEvent(file);
      if (file.shipmentType === 'export') {
        stats.export[currentEventName] = (stats.export[currentEventName] || 0) + 1;
      } else {
        stats.import[currentEventName] = (stats.import[currentEventName] || 0) + 1;
      }
    });

    return stats;
  };

  const eventStats = getEventStats();

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="px-4 sm:px-6 lg:px-8 py-6 space-y-6">
        {/* Event Type Toggle */}
        <div className={`p-4 rounded-lg border ${borderColor} ${bgPrimary} ${shadowClass}`}>
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-center justify-between">
              <h2 className={`text-lg font-medium ${textPrimary}`}>{t('event_types')}</h2>
              {currentEventFilter && (
                <button 
                  onClick={clearEventFilter}
                  className="ml-3 px-2 py-1 text-xs rounded-md bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700 flex items-center gap-1"
                >
                  <X size={14} />
                  {t('clear_filter')}: {currentEventFilter}
                </button>
              )}
            </div>
            <div className="flex items-center bg-gray-100 dark:bg-gray-800 rounded-lg p-1">
              <button
                onClick={() => {
                  setEventTypeFilter('all');
                  setCurrentEventFilter('');
                }}
                className={`px-3 py-1.5 rounded-md text-sm font-medium transition-all ${eventTypeFilter === 'all' 
                  ? 'bg-blue-500 text-white shadow-sm' 
                  : `${textSecondary} hover:bg-gray-200 dark:hover:bg-gray-700`}`}
              >
                {t('all')}
              </button>
              <button
                onClick={() => {
                  setEventTypeFilter('export');
                  setCurrentEventFilter('');
                }}
                className={`px-3 py-1.5 rounded-md text-sm font-medium transition-all ${eventTypeFilter === 'export' 
                  ? 'bg-green-500 text-white shadow-sm' 
                  : `${textSecondary} hover:bg-gray-200 dark:hover:bg-gray-700`}`}
              >
                {t('export')}
              </button>
              <button
                onClick={() => {
                  setEventTypeFilter('import');
                  setCurrentEventFilter('');
                }}
                className={`px-3 py-1.5 rounded-md text-sm font-medium transition-all ${eventTypeFilter === 'import' 
                  ? 'bg-purple-500 text-white shadow-sm' 
                  : `${textSecondary} hover:bg-gray-200 dark:hover:bg-gray-700`}`}
              >
                {t('import')}
              </button>
            </div>
          </div>
        </div>

        {/* Export Events */}
        {(eventTypeFilter === 'all' || eventTypeFilter === 'export') && (
          <div className={`p-4 rounded-lg border ${borderColor} ${bgPrimary} ${shadowClass}`}>
            <h2 className={`text-lg font-medium ${textPrimary} mb-4`}>{t('export_events')}</h2>
            <div className="flex flex-wrap gap-2">
              {Object.entries(eventStats.export).map(([eventName, count]) => (
                <button
                  key={`export-${eventName}`}
                  onClick={() => handleEventFilterClick(eventName, 'export')}
                  className={`px-3 py-1 rounded-full text-sm ${getDepartmentInfo(eventName).bg} ${getDepartmentInfo(eventName).text} ${getDepartmentInfo(eventName).border} flex items-center gap-2 hover:shadow-md transition-shadow cursor-pointer ${currentEventFilter === eventName && eventTypeFilter === 'export' ? 'ring-2 ring-blue-500 dark:ring-blue-400' : ''}`}
                >
                  <span>{eventName}</span>
                  <span className="px-2 py-0.5 rounded-full bg-white/10 text-xs">{count}</span>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Import Events */}
        {(eventTypeFilter === 'all' || eventTypeFilter === 'import') && (
          <div className={`p-4 rounded-lg border ${borderColor} ${bgPrimary} ${shadowClass}`}>
            <h2 className={`text-lg font-medium ${textPrimary} mb-4`}>{t('import_events')}</h2>
            <div className="flex flex-wrap gap-2">
              {Object.entries(eventStats.import).map(([eventName, count]) => (
                <button
                  key={`import-${eventName}`}
                  onClick={() => handleEventFilterClick(eventName, 'import')}
                  className={`px-3 py-1 rounded-full text-sm ${getDepartmentInfo(eventName).bg} ${getDepartmentInfo(eventName).text} ${getDepartmentInfo(eventName).border} flex items-center gap-2 hover:shadow-md transition-shadow cursor-pointer ${currentEventFilter === eventName && eventTypeFilter === 'import' ? 'ring-2 ring-blue-500 dark:ring-blue-400' : ''}`}
                >
                  <span>{eventName}</span>
                  <span className="px-2 py-0.5 rounded-full bg-white/10 text-xs">{count}</span>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Content */}
        <div className="px-4 sm:px-6 lg:px-8 py-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredFiles
              .filter(file => {
                // Filter by event type (export/import)
                const typeMatch = eventTypeFilter === 'all' || file.shipmentType === eventTypeFilter;
                
                // Filter by specific event if one is selected
                if (currentEventFilter && typeMatch) {
                  const currentEvent = getCurrentEvent(file);
                  return currentEvent === currentEventFilter;
                }
                
                return typeMatch;
              })
              .map(file => (
              <div
                key={file.id}
                className={`rounded-lg border ${borderColor} ${bgPrimary} ${shadowClass} transition-shadow duration-200 ${hoverShadow} overflow-hidden cursor-pointer`}
                onClick={() => handleFileSelect(file)}
              >
                <div className="p-4 space-y-4">
                  <div className="flex items-start justify-between">
                    <div>
                      <h3 className={`font-medium ${textPrimary}`}>{file.reference}</h3>
                      <p className={textMuted}>{file.blNumber}</p>
                    </div>
                    <div className={`px-3 py-1 rounded-full text-sm ${getDepartmentInfo(getCurrentEvent(file)).bg} ${getDepartmentInfo(getCurrentEvent(file)).text} ${getDepartmentInfo(getCurrentEvent(file)).border}`}>
                      {getCurrentEvent(file)}
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="flex items-center gap-2">
                      <Users className={`h-5 w-5 ${textMuted}`} />
                      <span className={textSecondary}>{getClientNames(file.clientIds)}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      {file.transportType === 'air' ? (
                        <Plane className={`h-5 w-5 ${textMuted}`} />
                      ) : (
                        <Ship className={`h-5 w-5 ${textMuted}`} />
                      )}
                      <span className={textSecondary}>{t(file.transportType)}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Package className={`h-5 w-5 ${textMuted}`} />
                      <span className={textSecondary}>{t(file.shipmentType)}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Clock className={`h-5 w-5 ${textMuted}`} />
                      <span className={textSecondary}>
                        {format(new Date(file.createdAt), 'dd/MM/yyyy')}
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <MapPin className={`h-5 w-5 ${textMuted}`} />
                    <span className={textSecondary}>
                      {file.origin} → {file.destination}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* File details modal */}
          {selectedFile && (
            <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50" onClick={handleCloseModal}>
              <div className={`w-full max-w-4xl max-h-[90vh] overflow-y-auto rounded-lg ${bgPrimary} ${shadowClass}`} onClick={e => e.stopPropagation()}>
                <div className="p-6 space-y-6">
                  <div className="flex items-start justify-between">
                    <div>
                      <h2 className={`text-xl font-semibold ${textPrimary}`}>{selectedFile.reference}</h2>
                      <p className={textMuted}>{selectedFile.blNumber}</p>
                    </div>
                    <button
                      className={`p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 ${textMuted}`}
                      onClick={handleCloseModal}
                    >
                      <X className="h-6 w-6" />
                    </button>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-4">
                      <div className="flex items-center gap-2">
                        <Users className={`h-5 w-5 ${textMuted}`} />
                        <span className={textSecondary}>{getClientNames(selectedFile.clientIds)}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        {selectedFile.transportType === 'air' ? (
                          <Plane className={`h-5 w-5 ${textMuted}`} />
                        ) : (
                          <Ship className={`h-5 w-5 ${textMuted}`} />
                        )}
                        <span className={textSecondary}>{t(selectedFile.transportType)}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Package className={`h-5 w-5 ${textMuted}`} />
                        <span className={textSecondary}>{t(selectedFile.shipmentType)}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <MapPin className={`h-5 w-5 ${textMuted}`} />
                        <span className={textSecondary}>
                          {selectedFile.origin} → {selectedFile.destination}
                        </span>
                      </div>
                    </div>

                    <div className="space-y-4">
                      <div className="flex items-center gap-2">
                        <Building className={`h-5 w-5 ${textMuted}`} />
                        <span className={textSecondary}>{t(selectedFile.productType)}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Hash className={`h-5 w-5 ${textMuted}`} />
                        <span className={textSecondary}>{selectedFile.capacity}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Clock className={`h-5 w-5 ${textMuted}`} />
                        <span className={textSecondary}>
                          {format(new Date(selectedFile.createdAt), 'dd/MM/yyyy HH:mm')}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Events timeline */}
                  <div className="mt-8">
                    <h3 className={`text-lg sm:text-xl font-bold ${textPrimary} mb-4 sm:mb-6 flex items-center flex-wrap gap-2`}>
                      <Clock size={20} className="sm:w-6 sm:h-6 text-blue-600 flex-shrink-0" />
                      <span>{t('events')}</span>
                    </h3>

                    <div className={`p-3 sm:p-4 rounded-lg ${isDark ? 'bg-blue-900/20' : 'bg-blue-50'} border ${isDark ? 'border-blue-800' : 'border-blue-200'} mb-4 sm:mb-6`}>
                      <div className="flex items-start gap-2 sm:gap-3">
                        <Info size={16} className={`sm:w-5 sm:h-5 mt-0.5 flex-shrink-0 ${isDark ? 'text-blue-400' : 'text-blue-600'}`} />
                        <div className="min-w-0 flex-1">
                          <h4 className={`font-medium ${isDark ? 'text-blue-300' : 'text-blue-800'} mb-1 text-sm sm:text-base`}>
                            {t('events_management')}
                          </h4>
                          <p className={`text-xs sm:text-sm ${isDark ? 'text-blue-200' : 'text-blue-700'} leading-relaxed`}>
                            {t('events_management_desc')} {t('sequential_completion_required')}
                          </p>
                        </div>
                      </div>
                    </div>

                    {/* Department Legend */}
                    <div className="mb-4 sm:mb-6">
                      <h4 className={`text-xs sm:text-sm font-semibold ${textSecondary} mb-2 sm:mb-3`}>
                        {t('departments')}:
                      </h4>
                      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-2 sm:gap-3">
                        <div className="flex items-center min-w-0">
                          <div className="w-3 h-3 sm:w-4 sm:h-4 bg-blue-500 rounded-full mr-1.5 sm:mr-2 flex-shrink-0"></div>
                          <span className={`text-xs sm:text-sm ${textPrimary} truncate`}>{t('operations')}</span>
                        </div>
                        <div className="flex items-center min-w-0">
                          <div className="w-3 h-3 sm:w-4 sm:h-4 bg-green-500 rounded-full mr-1.5 sm:mr-2 flex-shrink-0"></div>
                          <span className={`text-xs sm:text-sm ${textPrimary} truncate`}>{t('customs')}</span>
                        </div>
                        <div className="flex items-center min-w-0">
                          <div className="w-3 h-3 sm:w-4 sm:h-4 bg-purple-500 rounded-full mr-1.5 sm:mr-2 flex-shrink-0"></div>
                          <span className={`text-xs sm:text-sm ${textPrimary} truncate`}>{t('transport')}</span>
                        </div>
                        <div className="flex items-center min-w-0">
                          <div className="w-3 h-3 sm:w-4 sm:h-4 bg-orange-500 rounded-full mr-1.5 sm:mr-2 flex-shrink-0"></div>
                          <span className={`text-xs sm:text-sm ${textPrimary} truncate`}>{t('logistics')}</span>
                        </div>
                        <div className="flex items-center min-w-0 col-span-2 sm:col-span-1">
                          <div className="w-3 h-3 sm:w-4 sm:h-4 bg-pink-500 rounded-full mr-1.5 sm:mr-2 flex-shrink-0"></div>
                          <span className={`text-xs sm:text-sm ${textPrimary} truncate`}>{t('commercial')}</span>
                        </div>
                      </div>
                    </div>

                    {/* Events Timeline */}
                    <div className="relative">
                      <div className="hidden sm:block absolute left-6 lg:left-8 top-0 bottom-0 w-0.5 bg-gradient-to-b from-blue-500 via-green-500 to-purple-500 opacity-30"></div>

                      <div className="space-y-3 sm:space-y-4">
                        {events.map((event, index) => {
                          const deptInfo = getDepartmentInfo(event.name);
                          const colorClasses = {
                            blue: 'from-blue-500 to-blue-600',
                            green: 'from-green-500 to-green-600',
                            purple: 'from-purple-500 to-purple-600',
                            orange: 'from-orange-500 to-orange-600',
                            pink: 'from-pink-500 to-pink-600'
                          };

                          const isPreviousCompleted = index === 0 || events[index - 1].completed;
                          const canBeCompleted = isPreviousCompleted && !event.completed;
                          const isBlocked = !isPreviousCompleted && !event.completed;

                          const hasCompletedAfter = events.slice(index + 1).some(e => e.completed);
                          const canReactivate = event.completed && !hasCompletedAfter;

                          return (
                            <div
                              key={event.id}
                              className={`relative pl-4 sm:pl-12 lg:pl-16 pr-3 sm:pr-4 py-3 sm:py-4 rounded-xl border-2 transition-all duration-300 ${event.completed
                                  ? `${deptInfo.bg} ${deptInfo.border} shadow-md transform hover:scale-[1.01] sm:hover:scale-[1.02]`
                                  : isBlocked
                                    ? `${bgSecondary} ${borderColor} border-dashed opacity-75 cursor-not-allowed`
                                    : `${bgSecondary} ${borderColor} hover:${deptInfo.bg} hover:shadow-lg transform hover:scale-[1.01] sm:hover:scale-[1.02]`
                                }`}
                            >
                              <div className={`hidden sm:block absolute left-4 lg:left-6 top-4 sm:top-6 w-3 h-3 sm:w-4 sm:h-4 rounded-full border-2 border-white shadow-lg bg-gradient-to-r ${colorClasses[deptInfo.color]} transition-all duration-300 ${event.completed
                                  ? 'ring-2 ring-white ring-offset-2 scale-110'
                                  : isBlocked
                                    ? 'opacity-40 scale-75 grayscale'
                                    : 'hover:scale-110'
                                }`}></div>

                              <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3 sm:gap-4 mb-3 sm:mb-4">
                                <div className="flex-1 min-w-0">
                                  <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-3 mb-2">
                                    <h4 className={`font-semibold ${textPrimary} text-base sm:text-lg ${isBlocked ? 'opacity-60' : ''} break-words`}>
                                      {event.name}
                                    </h4>
                                    <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${deptInfo.bg} ${deptInfo.text} border ${deptInfo.border} ${isBlocked ? 'opacity-60' : ''} self-start sm:self-auto flex-shrink-0`}>
                                      {deptInfo.dept}
                                    </span>
                                  </div>
                                  <div className="flex items-center text-xs sm:text-sm text-gray-500">
                                    <User size={12} className="sm:w-4 sm:h-4 mr-1 flex-shrink-0" />
                                    <span className={`${textMuted} ${isBlocked ? 'opacity-60' : ''} truncate`}>
                                      {t('agent')}: {event.agentName}
                                    </span>
                                  </div>
                                  <div className="mt-2 grid grid-cols-1 lg:grid-cols-2 gap-3">
                                    <div>
                                      <label className={`block text-xs font-medium ${textMuted} mb-1`}>{t('date')}:</label>
                                      <input
                                        type="date"
                                        value={event.date}
                                        onChange={(e) => handleEventChange(event.id, 'date', e.target.value)}
                                        disabled={isBlocked || event.completed}
                                        className={`w-full px-2 py-1 text-sm rounded border ${borderColor} ${bgPrimary} ${textPrimary}`}
                                      />
                                    </div>
                                    <div>
                                      <label className={`block text-xs font-medium ${textMuted} mb-1`}>{t('details')}:</label>
                                      <input
                                        type="text"
                                        value={event.details}
                                        onChange={(e) => handleEventChange(event.id, 'details', e.target.value)}
                                        disabled={isBlocked || event.completed}
                                        placeholder={t('enter_details')}
                                        className={`w-full px-2 py-1 text-sm rounded border ${borderColor} ${bgPrimary} ${textPrimary}`}
                                      />
                                    </div>
                                  </div>
                                </div>

                                <div className="flex items-center justify-between sm:justify-end gap-2 sm:gap-3">
                                  <div className={`flex items-center px-2 sm:px-3 py-1 rounded-full text-xs font-medium transition-all flex-shrink-0 ${event.completed
                                      ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300'
                                      : isBlocked
                                        ? 'bg-gray-100 text-gray-500 dark:bg-gray-700 dark:text-gray-400'
                                        : 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300'
                                    }`}>
                                    {event.completed ? (
                                      <><Check size={12} className="sm:w-4 sm:h-4 mr-1" /> {t('completed')}</>
                                    ) : isBlocked ? (
                                      <><AlertTriangle size={12} className="sm:w-4 sm:h-4 mr-1 opacity-50" /> {t('waiting')}</>
                                    ) : (
                                      <><Clock size={12} className="sm:w-4 sm:h-4 mr-1" /> {t('pending')}</>
                                    )}
                                  </div>

                                  <button
                                    onClick={() => handleEventChange(event.id, 'completed', !event.completed)}
                                    disabled={!canBeCompleted && !canReactivate}
                                    className={`px-2 sm:px-3 py-1 rounded-lg text-xs font-medium transition-all ${canBeCompleted
                                        ? 'bg-green-100 text-green-800 hover:bg-green-200 dark:bg-green-900/30 dark:text-green-300 dark:hover:bg-green-900/40'
                                        : canReactivate
                                          ? 'bg-orange-100 text-orange-800 hover:bg-orange-200 dark:bg-orange-900/30 dark:text-orange-300 dark:hover:bg-orange-900/40'
                                          : 'bg-gray-100 text-gray-500 cursor-not-allowed dark:bg-gray-700 dark:text-gray-400'
                                      }`}
                                  >
                                    <div title={canBeCompleted ? t('complete') : canReactivate ? t('reactivate') : t('waiting')}>
                                      {canBeCompleted ? <Check size={14} className="sm:w-4 sm:h-4" /> : canReactivate ? <RefreshCw size={14} className="sm:w-4 sm:h-4" /> : <Check size={14} className="sm:w-4 sm:h-4" />}
                                    </div>
                                  </button>
                                </div>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default FileTrackingPage;