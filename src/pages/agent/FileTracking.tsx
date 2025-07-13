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
  Calendar,
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
  Globe,
} from 'lucide-react';
import { format } from 'date-fns';
import backImage from '../../utils/backGround_hearder.png';
import { TransitFile, TransitEvent } from '../../types/transitFile';
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

  const getEvents = (shipmentType: 'export' | 'import'): TransitEvent[] => {
    if (shipmentType === 'export') {
      return [
        { id: 'ep1', name: t('export_pregate'), details: '', agentName: 'John Doe', completed: true },
        { id: 'ep2', name: t('warehouse_reception'), details: '', agentName: 'Alice Smith', completed: true },
        { id: 'ep3', name: t('declaration'), details: '', agentName: 'Bob Johnson', completed: true },
        { id: 'ep4', name: t('export_customs_clearance'), details: '', agentName: 'Carol White', completed: false },
        { id: 'ep5', name: t('warehouse_loading'), details: '', agentName: 'David Brown', completed: false },
        { id: 'ep6', name: t('effective_transport'), details: '', agentName: 'Eve Wilson', completed: false },
        { id: 'ep7', name: t('vessel_loading'), details: '', agentName: 'Frank Miller', completed: false },
        { id: 'ep8', name: t('departure'), details: '', agentName: 'Grace Davis', completed: false },
        { id: 'ep9', name: t('estimated_arrival'), details: '', agentName: 'Henry Clark', completed: false },
        { id: 'ep10', name: t('billing'), details: '', agentName: 'Ivy Anderson', completed: false }
      ];
    } else {
      return [
        { id: 'ip1', name: t('import_prealert'), details: '', agentName: 'John Doe', completed: true },
        { id: 'ip2', name: t('arrival'), details: '', agentName: 'Alice Smith', completed: true },
        { id: 'ip3', name: t('declaration'), details: '', agentName: 'Bob Johnson', completed: false },
        { id: 'ip4', name: t('import_customs_clearance'), details: '', agentName: 'Carol White', completed: false },
        { id: 'ip5', name: t('maritime_company_slip'), details: '', agentName: 'David Brown', completed: false },
        { id: 'ip6', name: t('import_pregate'), details: '', agentName: 'Eve Wilson', completed: false },
        { id: 'ip7', name: t('pickup'), details: '', agentName: 'Frank Miller', completed: false },
        { id: 'ip8', name: t('delivery'), details: '', agentName: 'Grace Davis', completed: false },
        { id: 'ip9', name: t('warehouse_arrival'), details: '', agentName: 'Henry Clark', completed: false },
        { id: 'ip10', name: t('billing'), details: '', agentName: 'Ivy Anderson', completed: false }
      ];
    }
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

  const handleFilterChange = (key: keyof FilterState, value: string) => {
    setFilters(prev => ({ ...prev, [key]: value }));
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

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Header */}
      <div
        className="bg-cover bg-center"
        style={{ backgroundImage: `url(${backImage})` }}
      >
        <div className="px-4 sm:px-6 lg:px-8 py-4 bg-gradient-to-r from-blue-600/90 to-blue-800/90">
          <div className="flex flex-col gap-4">
            <div className="flex items-center justify-between">
              <h1 className="text-xl font-semibold text-white">
                {t('file_tracking')}
              </h1>
            </div>

            {/* Search and filters */}
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="flex-1">
                <div className="relative">
                  <input
                    type="text"
                    className="w-full pl-10 pr-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400"
                    placeholder={t('search_files')}
                    value={filters.search}
                    onChange={(e) => handleFilterChange('search', e.target.value)}
                  />
                  <Search className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
                </div>
              </div>

              <button
                className={`flex items-center gap-2 px-4 py-2 rounded-lg border ${borderColor} ${bgPrimary} ${textPrimary} ${shadowClass} transition-shadow duration-200 ${hoverShadow}`}
                onClick={() => setShowFilters(!showFilters)}
              >
                <Filter className="h-5 w-5" />
                <span>{t('filters')}</span>
                {activeFiltersCount > 0 && (
                  <span className="px-2 py-1 rounded-full bg-blue-100 dark:bg-blue-900 text-blue-600 dark:text-blue-300 text-sm">
                    {activeFiltersCount}
                  </span>
                )}
              </button>
            </div>

            {/* Filters panel */}
            {showFilters && (
              <div className={`grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 p-4 rounded-lg ${bgPrimary} ${borderColor} border ${shadowClass}`}>
                <div className="space-y-2">
                  <label className={`block ${textSecondary}`}>{t('status')}</label>
                  <select
                    className={`w-full rounded-lg border ${borderColor} ${bgSecondary} ${textPrimary} p-2`}
                    value={filters.status}
                    onChange={(e) => handleFilterChange('status', e.target.value)}
                  >
                    <option value="">{t('all')}</option>
                    <option value="draft">{t('draft')}</option>
                    <option value="in_transit">{t('in_transit')}</option>
                    <option value="completed">{t('completed')}</option>
                    <option value="archived">{t('archived')}</option>
                  </select>
                </div>

                <div className="space-y-2">
                  <label className={`block ${textSecondary}`}>{t('transport_type')}</label>
                  <select
                    className={`w-full rounded-lg border ${borderColor} ${bgSecondary} ${textPrimary} p-2`}
                    value={filters.transportType}
                    onChange={(e) => handleFilterChange('transportType', e.target.value)}
                  >
                    <option value="">{t('all')}</option>
                    <option value="air">{t('air')}</option>
                    <option value="sea">{t('sea')}</option>
                  </select>
                </div>

                <div className="space-y-2">
                  <label className={`block ${textSecondary}`}>{t('shipment_type')}</label>
                  <select
                    className={`w-full rounded-lg border ${borderColor} ${bgSecondary} ${textPrimary} p-2`}
                    value={filters.shipmentType}
                    onChange={(e) => handleFilterChange('shipmentType', e.target.value)}
                  >
                    <option value="">{t('all')}</option>
                    <option value="import">{t('import')}</option>
                    <option value="export">{t('export')}</option>
                  </select>
                </div>

                <div className="space-y-2">
                  <label className={`block ${textSecondary}`}>{t('product_type')}</label>
                  <select
                    className={`w-full rounded-lg border ${borderColor} ${bgSecondary} ${textPrimary} p-2`}
                    value={filters.productType}
                    onChange={(e) => handleFilterChange('productType', e.target.value)}
                  >
                    <option value="">{t('all')}</option>
                    <option value="standard">{t('standard')}</option>
                    <option value="dangerous">{t('dangerous')}</option>
                    <option value="fragile">{t('fragile')}</option>
                  </select>
                </div>

                <div className="space-y-2">
                  <label className={`block ${textSecondary}`}>{t('client')}</label>
                  <select
                    className={`w-full rounded-lg border ${borderColor} ${bgSecondary} ${textPrimary} p-2`}
                    value={filters.client}
                    onChange={(e) => handleFilterChange('client', e.target.value)}
                  >
                    <option value="">{t('all')}</option>
                    {clients.map(client => (
                      <option key={client.id} value={client.id}>
                        {client.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="space-y-2">
                  <label className={`block ${textSecondary}`}>{t('origin')}</label>
                  <input
                    type="text"
                    className={`w-full rounded-lg border ${borderColor} ${bgSecondary} ${textPrimary} p-2`}
                    value={filters.origin}
                    onChange={(e) => handleFilterChange('origin', e.target.value)}
                  />
                </div>

                <div className="space-y-2">
                  <label className={`block ${textSecondary}`}>{t('destination')}</label>
                  <input
                    type="text"
                    className={`w-full rounded-lg border ${borderColor} ${bgSecondary} ${textPrimary} p-2`}
                    value={filters.destination}
                    onChange={(e) => handleFilterChange('destination', e.target.value)}
                  />
                </div>

                <div className="space-y-2">
                  <label className={`block ${textSecondary}`}>{t('date_range')}</label>
                  <div className="flex gap-2">
                    <input
                      type="date"
                      className={`w-full rounded-lg border ${borderColor} ${bgSecondary} ${textPrimary} p-2`}
                      value={filters.dateFrom}
                      onChange={(e) => handleFilterChange('dateFrom', e.target.value)}
                    />
                    <input
                      type="date"
                      className={`w-full rounded-lg border ${borderColor} ${bgSecondary} ${textPrimary} p-2`}
                      value={filters.dateTo}
                      onChange={(e) => handleFilterChange('dateTo', e.target.value)}
                    />
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredFiles.map(file => (
            <div
              key={file.id}
              className={`rounded-lg border ${borderColor} ${bgPrimary} ${shadowClass} transition-shadow duration-200 ${hoverShadow} overflow-hidden cursor-pointer`}
              onClick={() => setSelectedFile(file)}
            >
              <div className="p-4 space-y-4">
                <div className="flex items-start justify-between">
                  <div>
                    <h3 className={`font-medium ${textPrimary}`}>{file.reference}</h3>
                    <p className={textMuted}>{file.blNumber}</p>
                  </div>
                  <div className={`px-3 py-1 rounded-full text-sm
                    ${file.status === 'completed' ? 'bg-green-100 dark:bg-green-900/20 text-green-800 dark:text-green-300' :
                      file.status === 'in_transit' ? 'bg-blue-100 dark:bg-blue-900/20 text-blue-800 dark:text-blue-300' :
                        file.status === 'archived' ? 'bg-gray-100 dark:bg-gray-800 text-gray-800 dark:text-gray-300' :
                          'bg-yellow-100 dark:bg-yellow-900/20 text-yellow-800 dark:text-yellow-300'
                    }`}
                  >
                    {t(file.status)}
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
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
            <div className={`w-full max-w-4xl max-h-[90vh] overflow-y-auto rounded-lg ${bgPrimary} ${shadowClass}`}>
              <div className="p-6 space-y-6">
                <div className="flex items-start justify-between">
                  <div>
                    <h2 className={`text-xl font-semibold ${textPrimary}`}>{selectedFile.reference}</h2>
                    <p className={textMuted}>{selectedFile.blNumber}</p>
                  </div>
                  <button
                    className={`p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 ${textMuted}`}
                    onClick={() => setSelectedFile(null)}
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
                  <h3 className={`text-lg font-medium ${textPrimary} mb-4`}>{t('tracking_events')}</h3>
                  <div className="space-y-4">
                    {getEvents(selectedFile.shipmentType).map((event, index) => {
                      const deptInfo = getDepartmentInfo(event.name);
                      return (
                        <div
                          key={event.id}
                          className={`p-4 rounded-lg border ${deptInfo.border} ${deptInfo.bg}`}
                        >
                          <div className="flex items-start justify-between">
                            <div className="space-y-1">
                              <div className="flex items-center gap-2">
                                <span className={`font-medium ${deptInfo.text}`}>{event.name}</span>
                                <span className={`text-sm ${textMuted}`}>({deptInfo.dept})</span>
                              </div>
                              <div className="flex items-center gap-2">
                                <User className={`h-4 w-4 ${textMuted}`} />
                                <span className={`text-sm ${textMuted}`}>{event.agentName}</span>
                              </div>
                            </div>
                            {event.completed ? (
                              <CheckCircle className="h-6 w-6 text-green-500" />
                            ) : (
                              <Clock className={`h-6 w-6 ${textMuted}`} />
                            )}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default FileTrackingPage;