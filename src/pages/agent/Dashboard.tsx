import { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { useTheme } from '../../contexts/ThemeContext';
import { useLanguage } from '../../contexts/LanguageContext';
import { getMockShipments } from '../../services/shipmentService';
import { getMockClients } from '../../services/clientService';
import { Shipment } from '../../types/shipment';
import { Client } from '../../types/client';
import ShipmentCard from '../../components/shipments/ShipmentCard';
import LoadingScreen from '../../components/common/LoadingScreen';
import {
  Search,
  Filter,
  Plus,
  Users,
  Package,
  X,
  ChevronDown,
  FileText,
  MapPin,
  User,
  Calendar,
  Truck,
  Ship,
  Plane,
  RefreshCw,
  ArrowUpDown,
  ArrowUp,
  ArrowDown
} from 'lucide-react';
import { format } from 'date-fns';
import backImage from '../../utils/backGround_hearder.png';

interface FilterState {
  search: string;
  status: string;
  type: string;
  client: string;
  assignedTo: string;
  createdBy: string;
  origin: string;
  destination: string;
  dateFrom: string;
  dateTo: string;
  containerType: string;
  priority: string;
}

type SortField = 'creationDate' | 'reference' | 'status' | 'client' | 'destination' | 'origin';
type SortOrder = 'asc' | 'desc';

const AgentDashboard = () => {
  const { user } = useAuth();
  const { theme } = useTheme();
  const { t } = useLanguage();
  const [shipments, setShipments] = useState<Shipment[]>([]);
  const [clients, setClients] = useState<Client[]>([]);
  const [filteredShipments, setFilteredShipments] = useState<Shipment[]>([]);
  const [sortedShipments, setSortedShipments] = useState<Shipment[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showFilters, setShowFilters] = useState(false);
  const [activeFiltersCount, setActiveFiltersCount] = useState(0);
  const [pageLoaded, setPageLoaded] = useState(false);
  const [sortField, setSortField] = useState<SortField>('creationDate');
  const [sortOrder, setSortOrder] = useState<SortOrder>('desc');

  const [filters, setFilters] = useState<FilterState>({
    search: '',
    status: '',
    type: '',
    client: '',
    assignedTo: '',
    createdBy: '',
    origin: '',
    destination: '',
    dateFrom: '',
    dateTo: '',
    containerType: '',
    priority: ''
  });

  // Mock agents data
  const agents = [
    { id: '1', name: 'Sophie Martin', role: t('operations') },
    { id: '2', name: 'Thomas Dubois', role: t('customs') },
    { id: '3', name: 'Marie Lefebvre', role: t('finance') },
    { id: '4', name: 'Pierre Durand', role: t('operations') }
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
        const [shipmentsData, clientsData] = await Promise.all([
          getMockShipments(),
          getMockClients()
        ]);
        setShipments(shipmentsData);
        setClients(clientsData);
        setFilteredShipments(shipmentsData);
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
    let filtered = [...shipments];

    // Search filter
    if (filters.search) {
      const searchLower = filters.search.toLowerCase();
      filtered = filtered.filter(s =>
        s.reference.toLowerCase().includes(searchLower) ||
        s.origin.toLowerCase().includes(searchLower) ||
        s.destination.toLowerCase().includes(searchLower) ||
        s.description.toLowerCase().includes(searchLower)
      );
    }

    // Status filter
    if (filters.status) {
      filtered = filtered.filter(s => s.status === filters.status);
    }

    // Type filter
    if (filters.type) {
      filtered = filtered.filter(s => s.type === filters.type);
    }

    // Client filter
    if (filters.client) {
      filtered = filtered.filter(s => s.clientId === filters.client);
    }

    // Assigned to filter
    if (filters.assignedTo) {
      filtered = filtered.filter(s => s.assignedAgentId === filters.assignedTo);
    }

    // Origin filter
    if (filters.origin) {
      filtered = filtered.filter(s => 
        s.origin.toLowerCase().includes(filters.origin.toLowerCase())
      );
    }

    // Destination filter
    if (filters.destination) {
      filtered = filtered.filter(s => 
        s.destination.toLowerCase().includes(filters.destination.toLowerCase())
      );
    }

    // Date filters
    if (filters.dateFrom) {
      filtered = filtered.filter(s => 
        new Date(s.createdAt) >= new Date(filters.dateFrom)
      );
    }

    if (filters.dateTo) {
      filtered = filtered.filter(s => 
        new Date(s.createdAt) <= new Date(filters.dateTo)
      );
    }

    setFilteredShipments(filtered);

    // Count active filters
    const activeCount = Object.values(filters).filter(value => value !== '').length;
    setActiveFiltersCount(activeCount);
  }, [filters, shipments]);

  // Apply sorting
  useEffect(() => {
    const sorted = [...filteredShipments].sort((a, b) => {
      let aValue: any;
      let bValue: any;

      switch (sortField) {
        case 'creationDate':
          aValue = new Date(a.createdAt);
          bValue = new Date(b.createdAt);
          break;
        case 'reference':
          aValue = a.reference.toLowerCase();
          bValue = b.reference.toLowerCase();
          break;
        case 'status':
          // Définir un ordre de priorité pour les statuts
          const statusOrder = {
            'draft': 1,
            'processing': 2,
            'warehouse': 3,
            'customs': 4,
            'in_transit': 5,
            'delivered': 6,
            'issue': 7
          };
          aValue = statusOrder[a.status as keyof typeof statusOrder] || 0;
          bValue = statusOrder[b.status as keyof typeof statusOrder] || 0;
          break;
        case 'client':
          const clientA = clients.find(c => c.id === a.clientId);
          const clientB = clients.find(c => c.id === b.clientId);
          aValue = clientA?.name.toLowerCase() || '';
          bValue = clientB?.name.toLowerCase() || '';
          break;
        case 'destination':
          aValue = a.destination.toLowerCase();
          bValue = b.destination.toLowerCase();
          break;
        case 'origin':
          aValue = a.origin.toLowerCase();
          bValue = b.origin.toLowerCase();
          break;
        default:
          return 0;
      }

      if (aValue < bValue) {
        return sortOrder === 'asc' ? -1 : 1;
      }
      if (aValue > bValue) {
        return sortOrder === 'asc' ? 1 : -1;
      }
      return 0;
    });

    setSortedShipments(sorted);
  }, [filteredShipments, sortField, sortOrder, clients]);

  const handleFilterChange = (key: keyof FilterState, value: string) => {
    setFilters(prev => ({ ...prev, [key]: value }));
  };

  const handleSortChange = (field: SortField) => {
    if (sortField === field) {
      // Si on clique sur le même champ, inverser l'ordre
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      // Nouveau champ, commencer par ordre croissant
      setSortField(field);
      setSortOrder('asc');
    }
  };

  const clearAllFilters = () => {
    setFilters({
      search: '',
      status: '',
      type: '',
      client: '',
      assignedTo: '',
      createdBy: '',
      origin: '',
      destination: '',
      dateFrom: '',
      dateTo: '',
      containerType: '',
      priority: ''
    });
  };

  const clearFilter = (key: keyof FilterState) => {
    setFilters(prev => ({ ...prev, [key]: '' }));
  };

  const getSortIcon = (field: SortField) => {
    if (sortField !== field) {
      return <ArrowUpDown size={14} className={textMuted} />;
    }
    return sortOrder === 'asc' 
      ? <ArrowUp size={14} className="text-blue-600" />
      : <ArrowDown size={14} className="text-blue-600" />;
  };

  if (isLoading) {
    return <LoadingScreen />;
  }

  return (
    <div className={`max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 transition-all duration-700 ${pageLoaded ? 'opacity-100' : 'opacity-0'}`}>
      {/* Header Section */}
      <div 
        className={`mb-8 rounded-xl p-6 ${shadowClass} transform transition-all duration-500 ${hoverShadow} hover:scale-[1.01] animate-fadeIn`}
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
          <div className="p-4">
            <h1 className={`text-2xl md:text-3xl font-bold ${textPrimary} mb-2`}>
              {t('dashboard')} - {t('agent')}
            </h1>
            <p className={`${textSecondary} text-lg`}>
              {t('manageFilesAndClients')}
            </p>
          </div>
          
          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-3 p-4">
            <button className="inline-flex items-center px-4 py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors shadow-sm">
              <Users size={18} className="mr-2" />
              {t('createClient')}
            </button>
            <button className="inline-flex items-center px-4 py-2.5 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors shadow-sm">
              <FileText size={18} className="mr-2" />
              {t('newFile')}
            </button>
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
              className={`block w-full pl-10 pr-4 py-2.5 border ${borderColor} rounded-lg ${bgPrimary} ${textPrimary} focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200`}
            />
          </div>

          {/* Filter Toggle Button */}
          <div className="flex items-center gap-3">
            <button
              onClick={() => setShowFilters(!showFilters)}
              className={`inline-flex items-center px-4 py-2.5 border ${borderColor} rounded-lg ${bgPrimary} ${textPrimary} hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors relative`}
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
                className="inline-flex items-center px-3 py-2 text-sm text-red-600 hover:text-red-800 transition-colors"
              >
                <X size={16} className="mr-1" />
                {t('clearAll')}
              </button>
            )}

            <button className={`p-2.5 border ${borderColor} rounded-lg ${bgPrimary} ${textMuted} hover:${textPrimary} transition-colors`}>
              <RefreshCw size={18} />
            </button>
          </div>
        </div>

        {/* Advanced Filters */}
        {showFilters && (
          <div className={`mt-6 pt-6 border-t ${borderColor} grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4`}>
            {/* Status Filter */}
            <div>
              <label className={`block text-sm font-medium ${textSecondary} mb-1`}>
                {t('status')}
              </label>
              <select
                value={filters.status}
                onChange={(e) => handleFilterChange('status', e.target.value)}
                className={`block w-full px-3 py-2 border ${borderColor} rounded-lg ${bgPrimary} ${textPrimary} focus:outline-none focus:ring-2 focus:ring-blue-500`}
              >
                <option value="">{t('allStatuses')}</option>
                <option value="draft">{t('draft')}</option>
                <option value="processing">{t('processing')}</option>
                <option value="warehouse">{t('warehouse')}</option>
                <option value="customs">{t('customs')}</option>
                <option value="in_transit">{t('inTransit')}</option>
                <option value="delivered">{t('delivered')}</option>
                <option value="issue">{t('issue')}</option>
              </select>
            </div>

            {/* Type Filter */}
            <div>
              <label className={`block text-sm font-medium ${textSecondary} mb-1`}>
                {t('transportType')}
              </label>
              <select
                value={filters.type}
                onChange={(e) => handleFilterChange('type', e.target.value)}
                className={`block w-full px-3 py-2 border ${borderColor} rounded-lg ${bgPrimary} ${textPrimary} focus:outline-none focus:ring-2 focus:ring-blue-500`}
              >
                <option value="">{t('allTypes')}</option>
                <option value="air">{t('air')}</option>
                <option value="sea">{t('sea')}</option>
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
                className={`block w-full px-3 py-2 border ${borderColor} rounded-lg ${bgPrimary} ${textPrimary} focus:outline-none focus:ring-2 focus:ring-blue-500`}
              >
                <option value="">{t('allClients')}</option>
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
                className={`block w-full px-3 py-2 border ${borderColor} rounded-lg ${bgPrimary} ${textPrimary} focus:outline-none focus:ring-2 focus:ring-blue-500`}
              >
                <option value="">{t('allAgents')}</option>
                {agents.map(agent => (
                  <option key={agent.id} value={agent.id}>
                    {agent.name} ({agent.role})
                  </option>
                ))}
              </select>
            </div>

            {/* Origin Filter */}
            <div>
              <label className={`block text-sm font-medium ${textSecondary} mb-1`}>
                {t('origin')}
              </label>
              <input
                type="text"
                placeholder={t('cityCountryPlaceholder')}
                value={filters.origin}
                onChange={(e) => handleFilterChange('origin', e.target.value)}
                className={`block w-full px-3 py-2 border ${borderColor} rounded-lg ${bgPrimary} ${textPrimary} focus:outline-none focus:ring-2 focus:ring-blue-500`}
              />
            </div>

            {/* Destination Filter */}
            <div>
              <label className={`block text-sm font-medium ${textSecondary} mb-1`}>
                {t('destination')}
              </label>
              <input
                type="text"
                placeholder={t('cityCountryPlaceholder')}
                value={filters.destination}
                onChange={(e) => handleFilterChange('destination', e.target.value)}
                className={`block w-full px-3 py-2 border ${borderColor} rounded-lg ${bgPrimary} ${textPrimary} focus:outline-none focus:ring-2 focus:ring-blue-500`}
              />
            </div>

            {/* Date From Filter */}
            <div>
              <label className={`block text-sm font-medium ${textSecondary} mb-1`}>
                {t('creationDateFrom')}
              </label>
              <input
                type="date"
                value={filters.dateFrom}
                onChange={(e) => handleFilterChange('dateFrom', e.target.value)}
                className={`block w-full px-3 py-2 border ${borderColor} rounded-lg ${bgPrimary} ${textPrimary} focus:outline-none focus:ring-2 focus:ring-blue-500`}
              />
            </div>

            {/* Date To Filter */}
            <div>
              <label className={`block text-sm font-medium ${textSecondary} mb-1`}>
                {t('creationDateTo')}
              </label>
              <input
                type="date"
                value={filters.dateTo}
                onChange={(e) => handleFilterChange('dateTo', e.target.value)}
                className={`block w-full px-3 py-2 border ${borderColor} rounded-lg ${bgPrimary} ${textPrimary} focus:outline-none focus:ring-2 focus:ring-blue-500`}
              />
            </div>
          </div>
        )}

        {/* Active Filters Display */}
        {activeFiltersCount > 0 && (
          <div className={`mt-4 pt-4 border-t ${borderColor}`}>
            <div className="flex flex-wrap gap-2">
              <span className={`text-sm ${textMuted}`}>{t('activeFilters')}</span>
              {Object.entries(filters).map(([key, value]) => {
                if (!value) return null;
                
                const filterLabels = {
                  search: t('search'),
                  status: t('status'),
                  type: t('type'),
                  client: t('client'),
                  assignedTo: t('assignedTo'),
                  origin: t('origin'),
                  destination: t('destination'),
                  dateFrom: t('creationDateFrom'),
                  dateTo: t('creationDateTo')
                };

                // Fonction pour obtenir la valeur traduite
                const getTranslatedValue = (filterKey: string, filterValue: string) => {
                  switch (filterKey) {
                    case 'status':
                      const statusTranslations: { [key: string]: string } = {
                        'draft': t('draft'),
                        'processing': t('processing'),
                        'warehouse': t('warehouse'),
                        'customs': t('customs'),
                        'in_transit': t('inTransit'),
                        'delivered': t('delivered'),
                        'issue': t('issue')
                      };
                      return statusTranslations[filterValue] || filterValue;
                    
                    case 'type':
                      const typeTranslations: { [key: string]: string } = {
                        'air': t('air'),
                        'sea': t('sea')
                      };
                      return typeTranslations[filterValue] || filterValue;
                    
                    case 'client':
                      const client = clients.find(c => c.id === filterValue);
                      return client ? client.name : filterValue;
                    
                    case 'assignedTo':
                      const agent = agents.find(a => a.id === filterValue);
                      return agent ? `${agent.name} (${agent.role})` : filterValue;
                    
                    default:
                      return filterValue;
                  }
                };

                return (
                  <span
                    key={key}
                    className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300"
                  >
                    {filterLabels[key as keyof typeof filterLabels]}: {getTranslatedValue(key, value)}
                    <button
                      onClick={() => clearFilter(key as keyof FilterState)}
                      className="ml-2 hover:text-blue-600"
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

      {/* Results Summary and Sorting */}
      <div className="mb-6 flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
        <p className={`text-sm ${textSecondary}`}>
          {sortedShipments.length} {t('filesFound')}
          {activeFiltersCount > 0 && ` ${t('filtered')}`}
        </p>
        
        {/* Sorting Options */}
        <div className="flex flex-wrap items-center gap-2">
          <span className={`text-sm ${textMuted} mr-2`}>{t('sortBy')}</span>
          
          <button
            onClick={() => handleSortChange('creationDate')}
            className={`inline-flex items-center px-3 py-1.5 text-sm border ${borderColor} rounded-lg ${bgPrimary} ${textPrimary} hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors ${
              sortField === 'creationDate' ? 'ring-2 ring-blue-500 border-blue-500' : ''
            }`}
          >
            {t('creationDate')}
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
            {t('status')}
            {getSortIcon('status')}
          </button>

          <button
            onClick={() => handleSortChange('client')}
            className={`inline-flex items-center px-3 py-1.5 text-sm border ${borderColor} rounded-lg ${bgPrimary} ${textPrimary} hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors ${
              sortField === 'client' ? 'ring-2 ring-blue-500 border-blue-500' : ''
            }`}
          >
            {t('client')}
            {getSortIcon('client')}
          </button>

          <button
            onClick={() => handleSortChange('destination')}
            className={`inline-flex items-center px-3 py-1.5 text-sm border ${borderColor} rounded-lg ${bgPrimary} ${textPrimary} hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors ${
              sortField === 'destination' ? 'ring-2 ring-blue-500 border-blue-500' : ''
            }`}
          >
            {t('destination')}
            {getSortIcon('destination')}
          </button>
        </div>
      </div>

      {/* Shipments Grid */}
      {sortedShipments.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {sortedShipments.map((shipment, index) => (
            <div
              key={shipment.id}
              className="transform transition-all duration-300 hover:scale-105"
              style={{
                animationName: 'fadeInScale',
                animationDuration: '0.5s',
                animationFillMode: 'both',
                animationDelay: `${0.1 * index}s`
              }}
            >
              <ShipmentCard shipment={shipment} />
            </div>
          ))}
        </div>
      ) : (
        <div className={`${bgSecondary} rounded-lg ${shadowClass} p-12 text-center`}>
          <Package size={48} className={`mx-auto mb-4 ${textMuted}`} />
          <h3 className={`text-lg font-medium ${textPrimary} mb-2`}>
            {t('noFilesFound')}
          </h3>
          <p className={textMuted}>
            {activeFiltersCount > 0 
              ? t('noFilesFoundMessage')
              : t('noFilesAvailable')
            }
          </p>
          {activeFiltersCount > 0 && (
            <button
              onClick={clearAllFilters}
              className="mt-4 inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              {t('clearFilters')}
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
      `}</style>
    </div>
  );
};

export default AgentDashboard;