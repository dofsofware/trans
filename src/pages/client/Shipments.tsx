import { useState, useEffect } from 'react';
import { getMockShipments } from '../../services/shipmentService';
import { Shipment } from '../../types/shipment';
import { useAuth } from '../../contexts/AuthContext';
import ShipmentCard from '../../components/shipments/ShipmentCard';
import { Filter, Plus, Search, X } from 'lucide-react';
import { useLanguage } from '../../contexts/LanguageContext';
import LoadingScreen from '../../components/common/LoadingScreen';

const ShipmentsPage = () => {
  const { user } = useAuth();
  const [shipments, setShipments] = useState<Shipment[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [showNewShipmentModal, setShowNewShipmentModal] = useState(false);
  const [newShipment, setNewShipment] = useState({
    origin: '',
    destination: '',
    description: '',
    weight: '',
    volume: '',
  });
  const [showFilters, setShowFilters] = useState(false);
  const { t } = useLanguage();

  useEffect(() => {
    const fetchShipments = async () => {
      try {
        if (user) {
          const data = await getMockShipments(user.id);
          setShipments(data);
        }
      } catch (error) {
        console.error('Error fetching shipments:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchShipments();
  }, [user]);

  const handleNewShipmentSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Here you would typically make an API call to create the shipment
    console.log('New shipment:', newShipment);
    setShowNewShipmentModal(false);
    setNewShipment({
      origin: '',
      destination: '',
      description: '',
      weight: '',
      volume: '',
    });
  };

  const clearSearch = () => {
    setSearchQuery('');
  };

  const clearFilters = () => {
    setStatusFilter('all');
  };

  const filteredShipments = shipments
    .filter(s => statusFilter === 'all' || s.status === statusFilter)
    .filter(s => {
      const searchLower = searchQuery.toLowerCase();
      return (
        searchQuery === '' ||
        s.reference.toLowerCase().includes(searchLower) ||
        s.origin.toLowerCase().includes(searchLower) ||
        s.destination.toLowerCase().includes(searchLower) ||
        s.description.toLowerCase().includes(searchLower)
      );
    });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
      <div className="mb-6 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-gray-900">{t('my_shipments')}</h1>
          <p className="mt-1 text-sm md:text-base text-gray-600">{t('hereIsOverview')}</p>
        </div>
      </div>

      {/* Search and Filters */}
      <div className="bg-white rounded-lg shadow-sm p-4 mb-6">
        <div className="flex flex-col md:flex-row md:items-center space-y-4 md:space-y-0 md:space-x-4">
          <div className="flex-1 relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search size={18} className="text-gray-400" />
            </div>
            <input
              type="text"
              placeholder={t('search_shipments')}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="block w-full pl-10 pr-10 py-2 border border-gray-300 rounded-lg leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
            />
            {searchQuery && (
              <button
                onClick={clearSearch}
                className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600"
                aria-label="Clear search"
              >
                <X size={16} />
              </button>
            )}
          </div>
          <div className="flex space-x-2">
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-lg shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors duration-200"
            >
              <Filter size={16} className="mr-2" />
              <span>{t('filters')}</span>
            </button>
            {statusFilter !== 'all' && (
              <button
                onClick={clearFilters}
                className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-lg shadow-sm text-sm font-medium text-red-600 bg-white hover:bg-red-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 transition-colors duration-200"
              >
                <X size={16} className="mr-1" />
                <span>{t('clear')}</span>
              </button>
            )}
          </div>
        </div>

        {/* Expanded Filters */}
        {showFilters && (
          <div className="mt-4 pt-4 border-t border-gray-200">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <div>
                <label htmlFor="status-filter" className="block text-sm font-medium text-gray-700 mb-1">
                  {t('status')}
                </label>
                <select
                  id="status-filter"
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="block w-full pl-3 pr-10 py-2 text-base border border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-lg"
                >
                  <option value="all">{t('all')}</option>
                  <option value="draft">{t('draft')}</option>
                  <option value="processing">{t('processing')}</option>
                  <option value="warehouse">{t('warehouse')}</option>
                  <option value="customs">{t('customs')}</option>
                  <option value="in_transit">{t('in_transit')}</option>
                  <option value="delivered">{t('delivered')}</option>
                  <option value="issue">{t('issue')}</option>
                </select>
              </div>
              {/* Additional filters could go here */}
            </div>
          </div>
        )}
      </div>

      {/* Results Count */}
      <div className="mb-4 flex justify-between items-center">
        <p className="text-sm text-gray-600">
          {filteredShipments.length} {filteredShipments.length === 1 ? t('shipment_found') : t('shipments_found')}
        </p>
        {/* Sort options could go here */}
      </div>

      {isLoading ? (
        <LoadingScreen />
      ) : filteredShipments.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredShipments.map(shipment => (
            <ShipmentCard key={shipment.id} shipment={shipment} />
          ))}
        </div>
      ) : (
        <div className="bg-white rounded-lg shadow-sm p-8 text-center">
          <div className="mx-auto flex items-center justify-center h-24 w-24 rounded-full bg-blue-100 mb-4">
            <Search size={36} className="text-blue-600" />
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-1">{t('no_shipments_found')}</h3>
          <p className="text-gray-500">{t('try_adjusting_filters')}</p>
        </div>
      )}

    </div>
  );
};

export default ShipmentsPage;