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
  Table
} from 'lucide-react';
import { format } from 'date-fns';
import backImage from '../../utils/backGround_hearder.png';

interface FilterState {
  search: string;
  status: string;
  type: string;
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
  const [shipments, setShipments] = useState<Shipment[]>([]);
  const [clients, setClients] = useState<Client[]>([]);
  const [filteredShipments, setFilteredShipments] = useState<Shipment[]>([]);
  const [sortedShipments, setSortedShipments] = useState<Shipment[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showFilters, setShowFilters] = useState(false);
  const [activeFiltersCount, setActiveFiltersCount] = useState(0);
  const [pageLoaded, setPageLoaded] = useState(false);
  const [viewMode, setViewMode] = useState<'grid' | 'table'>('grid');
  
  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(9);
  const [totalPages, setTotalPages] = useState(1);
  const [paginatedShipments, setPaginatedShipments] = useState<Shipment[]>([]);
  
  // Sorting state
  const [sortField, setSortField] = useState<'creationDate' | 'reference' | 'status'>('creationDate');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('desc');

    const isMobile = useMediaQuery({ maxWidth: 767 });

  const [filters, setFilters] = useState<FilterState>({
    search: '',
    status: '',
    type: '',
    client: '',
    assignedTo: '',
    origin: '',
    destination: '',
    dateFrom: '',
    dateTo: ''
  });

  // Mock agents data
  const agents = [
    { id: '1', name: 'Sophie Martin', role: 'Operations' },
    { id: '2', name: 'Thomas Dubois', role: 'Customs' },
    { id: '3', name: 'Marie Lefebvre', role: 'Finance' },
    { id: '4', name: 'Pierre Durand', role: 'Operations' }
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
      let comparison = 0;
      
      switch (sortField) {
        case 'creationDate':
          comparison = new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
          break;
        case 'reference':
          comparison = a.reference.localeCompare(b.reference);
          break;
        case 'status':
          comparison = a.status.localeCompare(b.status);
          break;
      }
      
      return sortDirection === 'asc' ? comparison : -comparison;
    });
    
    setSortedShipments(sorted);
  }, [filteredShipments, sortField, sortDirection]);

  // Apply pagination
  useEffect(() => {
    const totalPagesCount = Math.ceil(sortedShipments.length / itemsPerPage);
    setTotalPages(totalPagesCount);
    
    // Reset to first page if current page exceeds total pages
    if (currentPage > totalPagesCount && totalPagesCount > 0) {
      setCurrentPage(1);
    }
    
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    const paginated = sortedShipments.slice(startIndex, endIndex);
    
    setPaginatedShipments(paginated);
  }, [sortedShipments, currentPage, itemsPerPage]);

  const handleFilterChange = (key: keyof FilterState, value: string) => {
    setFilters(prev => ({ ...prev, [key]: value }));
  };

  const clearAllFilters = () => {
    setFilters({
      search: '',
      status: '',
      type: '',
      client: '',
      assignedTo: '',
      origin: '',
      destination: '',
      dateFrom: '',
      dateTo: ''
    });
  };

  const clearFilter = (key: keyof FilterState) => {
    setFilters(prev => ({ ...prev, [key]: '' }));
  };

  const getClientName = (clientId: string) => {
    const client = clients.find(c => c.id === clientId);
    return client ? client.name : 'Client inconnu';
  };

  const getAgentName = (agentId: string) => {
    const agent = agents.find(a => a.id === agentId);
    return agent ? agent.name : 'Agent inconnu';
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
    setCurrentPage(1); // Reset to first page when changing items per page
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
              Dossiers de Transit
            </h1>
            <p className={`${textSecondary} text-lg`}>
              Gérez tous vos dossiers de transit et expéditions
            </p>
          </div>
          
          <div className="flex flex-col sm:flex-row gap-3 p-4">
            <button className="inline-flex items-center px-4 py-2.5 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors shadow-sm">
              <Plus size={18} className="mr-2" />
              Nouveau dossier
            </button>
            <button className={`inline-flex items-center px-4 py-2.5 border ${borderColor} rounded-lg ${bgPrimary} ${textPrimary} hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors`}>
              <Download size={18} className="mr-2" />
              Exporter
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
              placeholder="Rechercher par référence, origine, destination..."
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
              Filtres
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
                Effacer tout
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
                Statut
              </label>
              <select
                value={filters.status}
                onChange={(e) => handleFilterChange('status', e.target.value)}
                className={`block w-full px-3 py-2 border ${borderColor} rounded-lg ${bgPrimary} ${textPrimary} focus:outline-none focus:ring-2 focus:ring-blue-500`}
              >
                <option value="">Tous les statuts</option>
                <option value="draft">Brouillon</option>
                <option value="processing">En traitement</option>
                <option value="warehouse">En entrepôt</option>
                <option value="customs">Dédouanement</option>
                <option value="in_transit">En transit</option>
                <option value="delivered">Livré</option>
                <option value="issue">Problème</option>
              </select>
            </div>

            {/* Type Filter */}
            <div>
              <label className={`block text-sm font-medium ${textSecondary} mb-1`}>
                Type de transport
              </label>
              <select
                value={filters.type}
                onChange={(e) => handleFilterChange('type', e.target.value)}
                className={`block w-full px-3 py-2 border ${borderColor} rounded-lg ${bgPrimary} ${textPrimary} focus:outline-none focus:ring-2 focus:ring-blue-500`}
              >
                <option value="">Tous les types</option>
                <option value="air">Aérien</option>
                <option value="sea">Maritime</option>
              </select>
            </div>

            {/* Client Filter */}
            <div>
              <label className={`block text-sm font-medium ${textSecondary} mb-1`}>
                Client
              </label>
              <select
                value={filters.client}
                onChange={(e) => handleFilterChange('client', e.target.value)}
                className={`block w-full px-3 py-2 border ${borderColor} rounded-lg ${bgPrimary} ${textPrimary} focus:outline-none focus:ring-2 focus:ring-blue-500`}
              >
                <option value="">Tous les clients</option>
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
                Assigné à
              </label>
              <select
                value={filters.assignedTo}
                onChange={(e) => handleFilterChange('assignedTo', e.target.value)}
                className={`block w-full px-3 py-2 border ${borderColor} rounded-lg ${bgPrimary} ${textPrimary} focus:outline-none focus:ring-2 focus:ring-blue-500`}
              >
                <option value="">Tous les agents</option>
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
                Origine
              </label>
              <input
                type="text"
                placeholder="Ville, pays..."
                value={filters.origin}
                onChange={(e) => handleFilterChange('origin', e.target.value)}
                className={`block w-full px-3 py-2 border ${borderColor} rounded-lg ${bgPrimary} ${textPrimary} focus:outline-none focus:ring-2 focus:ring-blue-500`}
              />
            </div>

            {/* Destination Filter */}
            <div>
              <label className={`block text-sm font-medium ${textSecondary} mb-1`}>
                Destination
              </label>
              <input
                type="text"
                placeholder="Ville, pays..."
                value={filters.destination}
                onChange={(e) => handleFilterChange('destination', e.target.value)}
                className={`block w-full px-3 py-2 border ${borderColor} rounded-lg ${bgPrimary} ${textPrimary} focus:outline-none focus:ring-2 focus:ring-blue-500`}
              />
            </div>

            {/* Date From Filter */}
            <div>
              <label className={`block text-sm font-medium ${textSecondary} mb-1`}>
                Date de création (de)
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
                Date de création (à)
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
              <span className={`text-sm ${textMuted}`}>Filtres actifs:</span>
              {Object.entries(filters).map(([key, value]) => {
                if (!value) return null;
                
                const filterLabels = {
                  search: 'Recherche',
                  status: 'Statut',
                  type: 'Type',
                  client: 'Client',
                  assignedTo: 'Assigné à',
                  origin: 'Origine',
                  destination: 'Destination',
                  dateFrom: 'Date de',
                  dateTo: 'Date à'
                };

                return (
                  <span
                    key={key}
                    className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300"
                  >
                    {filterLabels[key as keyof typeof filterLabels]}: {value}
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

      {/* Sorting and View Options */}
      <div className={`${bgSecondary} rounded-lg ${shadowClass} p-4 mb-6 ${borderColor} border`}>
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
          {/* Results Summary */}
          <div className="flex items-center">
            <p className={`text-sm ${textSecondary}`}>
              {sortedShipments.length} dossier{sortedShipments.length !== 1 ? 's' : ''} trouvé{sortedShipments.length !== 1 ? 's' : ''}
              {activeFiltersCount > 0 && ' (filtré)'}
            </p>
          </div>
          
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
            {/* Items per page selector */}
            <div className="flex items-center gap-2">
              <span className={`text-sm ${textMuted}`}>Items par page:</span>
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
              <span className={`text-sm ${textMuted}`}>Trier par</span>
              
              <button
                onClick={() => handleSortChange('creationDate')}
                className={`inline-flex items-center px-3 py-1.5 text-sm border ${borderColor} rounded-lg ${bgPrimary} ${textPrimary} hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors ${
                  sortField === 'creationDate' ? 'ring-2 ring-blue-500 border-blue-500' : ''
                }`}
              >
                Date de création
                {getSortIcon('creationDate')}
              </button>

              <button
                onClick={() => handleSortChange('reference')}
                className={`inline-flex items-center px-3 py-1.5 text-sm border ${borderColor} rounded-lg ${bgPrimary} ${textPrimary} hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors ${
                  sortField === 'reference' ? 'ring-2 ring-blue-500 border-blue-500' : ''
                }`}
              >
                Référence
                {getSortIcon('reference')}
              </button>

              <button
                onClick={() => handleSortChange('status')}
                className={`inline-flex items-center px-3 py-1.5 text-sm border ${borderColor} rounded-lg ${bgPrimary} ${textPrimary} hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors ${
                  sortField === 'status' ? 'ring-2 ring-blue-500 border-blue-500' : ''
                }`}
              >
                Statut
                {getSortIcon('status')}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Content Display */}
      {sortedShipments.length > 0 ? (
        <div className="space-y-6">
          {viewMode === 'grid' || isMobile ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {paginatedShipments.map((shipment, index) => (
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
            // Table View
            <div className={`${bgSecondary} rounded-lg ${shadowClass} overflow-hidden`}>
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                  <thead className={`${isDark ? 'bg-gray-700' : 'bg-gray-50'}`}>
                    <tr>
                      <th className={`px-6 py-3 text-left text-xs font-medium uppercase tracking-wider ${textMuted}`}>
                        Référence
                      </th>
                      <th className={`px-6 py-3 text-left text-xs font-medium uppercase tracking-wider ${textMuted}`}>
                        Client
                      </th>
                      <th className={`px-6 py-3 text-left text-xs font-medium uppercase tracking-wider ${textMuted}`}>
                        Origine → Destination
                      </th>
                      <th className={`px-6 py-3 text-left text-xs font-medium uppercase tracking-wider ${textMuted}`}>
                        Type
                      </th>
                      <th className={`px-6 py-3 text-left text-xs font-medium uppercase tracking-wider ${textMuted}`}>
                        Statut
                      </th>
                      <th className={`px-6 py-3 text-left text-xs font-medium uppercase tracking-wider ${textMuted}`}>
                        Date création
                      </th>
                      <th className={`px-6 py-3 text-left text-xs font-medium uppercase tracking-wider ${textMuted}`}>
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className={`divide-y ${isDark ? 'divide-gray-700' : 'divide-gray-200'}`}>
                    {paginatedShipments.map((shipment) => (
                      <tr key={shipment.id} className={`${isDark ? 'hover:bg-gray-700' : 'hover:bg-gray-50'} transition-colors`}>
                        <td className={`px-6 py-4 whitespace-nowrap text-sm font-medium ${textPrimary}`}>
                          {shipment.reference}
                        </td>
                        <td className={`px-6 py-4 whitespace-nowrap text-sm ${textSecondary}`}>
                          {getClientName(shipment.clientId)}
                        </td>
                        <td className={`px-6 py-4 whitespace-nowrap text-sm ${textSecondary}`}>
                          <div className="flex items-center">
                            <span className="truncate max-w-24">{shipment.origin}</span>
                            <span className="mx-2">→</span>
                            <span className="truncate max-w-24">{shipment.destination}</span>
                          </div>
                        </td>
                        <td className={`px-6 py-4 whitespace-nowrap text-sm ${textSecondary}`}>
                          <div className="flex items-center">
                            {shipment.type === 'air' ? (
                              <Plane size={16} className="mr-1 text-blue-600" />
                            ) : (
                              <Ship size={16} className="mr-1 text-blue-600" />
                            )}
                            {shipment.type === 'air' ? 'Aérien' : 'Maritime'}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                            shipment.status === 'delivered' ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300' :
                            shipment.status === 'in_transit' ? 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300' :
                            shipment.status === 'issue' ? 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300' :
                            'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300'
                          }`}>
                            {shipment.status}
                          </span>
                        </td>
                        <td className={`px-6 py-4 whitespace-nowrap text-sm ${textMuted}`}>
                          {format(new Date(shipment.createdAt), 'dd/MM/yyyy')}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                          <div className="flex items-center justify-end space-x-2">
                            <button className={`${textMuted} hover:text-blue-600 transition-colors`}>
                              <Eye size={16} />
                            </button>
                            <button className={`${textMuted} hover:text-blue-600 transition-colors`}>
                              <Edit size={16} />
                            </button>
                            <button className={`${textMuted} hover:text-blue-600 transition-colors`}>
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
        <div className={`${bgSecondary} rounded-lg ${shadowClass} p-12 text-center`}>
          <FileText size={48} className={`mx-auto mb-4 ${textMuted}`} />
          <h3 className={`text-lg font-medium ${textPrimary} mb-2`}>
            Aucun dossier trouvé
          </h3>
          <p className={textMuted}>
            {activeFiltersCount > 0 
              ? 'Aucun dossier ne correspond à vos critères de recherche.'
              : 'Aucun dossier de transit disponible pour le moment.'
            }
          </p>
          {activeFiltersCount > 0 && (
            <button
              onClick={clearAllFilters}
              className="mt-4 inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              Effacer les filtres
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

export default TransitFilesPage;