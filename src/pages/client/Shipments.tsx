import { useState, useEffect } from 'react';
import { getMockShipments } from '../../services/shipmentService';
import { Shipment } from '../../types/shipment';
import { useAuth } from '../../contexts/AuthContext';
import { useTheme } from '../../contexts/ThemeContext';
import ShipmentCard from '../../components/shipments/ShipmentCard';
import { Filter, Plus, Search, X } from 'lucide-react';
import { useLanguage } from '../../contexts/LanguageContext';
import LoadingScreen from '../../components/common/LoadingScreen';
import backImage from '../../utils/shipments.png';

const ShipmentsPage = () => {
  const { user } = useAuth();
  const { theme } = useTheme();
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
  const [pageLoaded, setPageLoaded] = useState(false);

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
        // Trigger animations after data is loaded
        setTimeout(() => setPageLoaded(true), 100);
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

  // Theme-aware classes
  const isDark = theme === 'dark';
  const bgPrimary = isDark ? 'bg-gray-900' : 'bg-white';
  const bgSecondary = isDark ? 'bg-gray-800' : 'bg-white';
  const textPrimary = isDark ? 'text-white' : 'text-gray-900';
  const textSecondary = isDark ? 'text-gray-300' : 'text-gray-600';
  const textMuted = isDark ? 'text-gray-400' : 'text-gray-500';
  const borderColor = isDark ? 'border-gray-700' : 'border-gray-300';
  const borderLight = isDark ? 'border-gray-600' : 'border-gray-200';
  const shadowClass = isDark ? 'shadow-gray-900/20' : 'shadow-sm';
  const hoverShadow = isDark ? 'hover:shadow-gray-900/30' : 'hover:shadow-md';
  const focusRing = isDark ? 'focus:ring-blue-400 focus:border-blue-400' : 'focus:ring-blue-500 focus:border-blue-500';
  const placeholderColor = isDark ? 'placeholder-gray-400' : 'placeholder-gray-500';

  return (
    <div className={`max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 transition-all duration-700 ${pageLoaded ? 'opacity-100' : 'opacity-0'}`}>
      {/* New Header Section */}
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
        <div className="p-4">
          <h1 className={`text-2xl md:text-3xl font-bold ${textPrimary}`}>
            {t('my_shipments')}
          </h1>
          <p className={`mt-2 ${textSecondary} text-lg`}>{t('hereIsOverview')}</p>
        </div>
      </div>

      {/* Search and Filters */}
      <div
        className={`${bgSecondary} rounded-lg ${shadowClass} p-4 mb-6 transform transition-all duration-500 ${hoverShadow}`}
        style={{
          animationName: 'fadeInUp',
          animationDuration: '0.6s',
          animationFillMode: 'both',
          animationDelay: '0.2s'
        }}
      >
        <div className="flex flex-col md:flex-row md:items-center space-y-4 md:space-y-0 md:space-x-4">
          <div className="flex-1 relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search size={18} className={`${isDark ? 'text-gray-500' : 'text-gray-400'} animate-pulse`} />
            </div>
            <input
              type="text"
              placeholder={t('search_shipments')}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className={`block w-full pl-10 pr-10 py-2 border ${borderColor} rounded-lg leading-5 ${bgPrimary} ${placeholderColor} ${textPrimary} focus:outline-none focus:placeholder-gray-400 focus:ring-1 ${focusRing} sm:text-sm transition-all duration-300 focus:shadow-inner`}
            />
            {searchQuery && (
              <button
                onClick={clearSearch}
                className={`absolute inset-y-0 right-0 pr-3 flex items-center ${isDark ? 'text-gray-500 hover:text-gray-300' : 'text-gray-400 hover:text-gray-600'} transition-colors duration-200`}
                aria-label="Clear search"
              >
                <X size={16} className="transform transition-transform duration-200 hover:rotate-90" />
              </button>
            )}
          </div>
          <div className="flex space-x-2">
            <button
              onClick={() => setShowFilters(!showFilters)}
              className={`inline-flex items-center px-4 py-2 border ${borderColor} rounded-lg ${shadowClass} text-sm font-medium ${isDark ? 'text-gray-300 bg-gray-700 hover:bg-gray-600' : 'text-gray-700 bg-white hover:bg-gray-50'} focus:outline-none focus:ring-2 focus:ring-offset-2 ${isDark ? 'focus:ring-blue-400' : 'focus:ring-blue-500'} transition-all duration-300 hover:shadow transform hover:scale-105`}
            >
              <Filter size={16} className={`mr-2 transition-transform duration-300 ${showFilters ? 'rotate-180' : 'rotate-0'}`} />
              <span>{t('filters')}</span>
            </button>
            {statusFilter !== 'all' && (
              <button
                onClick={clearFilters}
                className={`inline-flex items-center px-4 py-2 border ${borderColor} rounded-lg ${shadowClass} text-sm font-medium ${isDark ? 'text-red-400 bg-gray-700 hover:bg-red-900/20' : 'text-red-600 bg-white hover:bg-red-50'} focus:outline-none focus:ring-2 focus:ring-offset-2 ${isDark ? 'focus:ring-red-400' : 'focus:ring-red-500'} transition-all duration-300 hover:shadow transform hover:scale-105`}
              >
                <X size={16} className="mr-1 animate-spin-slow" />
                <span>{t('clear')}</span>
              </button>
            )}
          </div>
        </div>

        {/* Expanded Filters */}
        {showFilters && (
          <div className={`mt-4 pt-4 border-t ${borderLight}`}>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <div>
                <label htmlFor="status-filter" className={`block text-sm font-medium ${isDark ? 'text-gray-300' : 'text-gray-700'} mb-1`}>
                  {t('status')}
                </label>
                <select
                  id="status-filter"
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className={`block w-full pl-3 pr-10 py-2 text-base border ${borderColor} ${bgPrimary} ${textPrimary} focus:outline-none ${focusRing} sm:text-sm rounded-lg transition-all duration-200`}
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
      <div
        className="mb-4 flex justify-between items-center"
        style={{
          animationName: 'fadeIn',
          animationDuration: '0.6s',
          animationFillMode: 'both',
          animationDelay: '0.4s'
        }}
      >
        <p className={`text-sm ${textSecondary} animate-pulse-slow`}>
          {filteredShipments.length} {filteredShipments.length < 2 ? t('shipment_found') : t('shipments_found')}
        </p>
        {/* Sort options could go here */}
      </div>

      {isLoading ? (
        <LoadingScreen />
      ) : filteredShipments.length > 0 ? (
        <div
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
          style={{
            animationName: 'fadeInUp',
            animationDuration: '0.8s',
            animationFillMode: 'both',
            animationDelay: '0.5s'
          }}
        >
          {filteredShipments.map((shipment, index) => (
            <div
              key={shipment.id}
              className="transform transition-all duration-300 hover:scale-105 hover:z-10"
              style={{
                animationName: 'fadeInScale',
                animationDuration: '0.5s',
                animationFillMode: 'both',
                animationDelay: `${0.1 * index + 0.6}s`
              }}
            >
              <ShipmentCard shipment={shipment} />
            </div>
          ))}
        </div>
      ) : (
        <div
          className={`${bgSecondary} rounded-lg ${shadowClass} p-8 text-center transform transition-all duration-500 ${hoverShadow}`}
          style={{
            animationName: 'fadeInUp',
            animationDuration: '0.6s',
            animationFillMode: 'both',
            animationDelay: '0.5s'
          }}
        >
          <div className={`mx-auto flex items-center justify-center h-24 w-24 rounded-full ${isDark ? 'bg-blue-900/30' : 'bg-blue-100'} mb-4 animate-pulse-slow`}>
            <Search size={36} className={`${isDark ? 'text-blue-400' : 'text-blue-600'} animate-bounce-slow`} />
          </div>
          <h3 className={`text-lg font-medium ${textPrimary} mb-1`}>{t('no_shipments_found')}</h3>
          <p className={textMuted}>{t('try_adjusting_filters')}</p>
        </div>
      )}

      {/* Add CSS animations */}
      <style jsx global>{`
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }

        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
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

        @keyframes slideInDown {
          from {
            opacity: 0;
            transform: translateY(-20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes charFadeIn {
          0% { opacity: 0; transform: translateY(-8px); }
          100% { opacity: 1; transform: translateY(0); }
        }

        .animate-charFadeIn {
          display: inline-block;
        }

        .animate-charFadeIn span {
          opacity: 0;
          display: inline-block;
          animation: charFadeIn 0.3s ease-out forwards;
        }

        .animate-pulse-slow {
          animation: pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite;
        }

        .animate-bounce-slow {
          animation: bounce 2s infinite;
        }

        .animate-spin-slow {
          animation: spin 3s linear infinite;
        }

        @keyframes pulse {
          0%, 100% {
            opacity: 1;
          }
          50% {
            opacity: 0.7;
          }
        }

        @keyframes bounce {
          0%, 100% {
            transform: translateY(-10%);
            animation-timing-function: cubic-bezier(0.8, 0, 1, 1);
          }
          50% {
            transform: translateY(0);
            animation-timing-function: cubic-bezier(0, 0, 0.2, 1);
          }
        }

        @keyframes spin {
          from {
            transform: rotate(0deg);
          }
          to {
            transform: rotate(360deg);
          }
        }
      `}</style>
    </div>
  );
};

export default ShipmentsPage;