import { useState, useEffect } from 'react';
import { useTheme } from '../../contexts/ThemeContext';
import { useLanguage } from '../../contexts/LanguageContext';
import { getMockClients } from '../../services/clientService';
import { Client } from '../../types/client';
import LoadingScreen from '../../components/common/LoadingScreen';
import {
  Search,
  Filter,
  Plus,
  Users,
  X,
  Mail,
  Phone,
  Building,
  MapPin,
  Calendar,
  Edit,
  Eye,
  MoreVertical,
  UserCheck,
  UserX
} from 'lucide-react';
import { format } from 'date-fns';
import backImage from '../../utils/backGround_hearder.png';

const ClientsPage = () => {
  const { theme } = useTheme();
  const { t } = useLanguage();
  const [clients, setClients] = useState<Client[]>([]);
  const [filteredClients, setFilteredClients] = useState<Client[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [showFilters, setShowFilters] = useState(false);
  const [pageLoaded, setPageLoaded] = useState(false);

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
    const fetchClients = async () => {
      try {
        const data = await getMockClients();
        setClients(data);
        setFilteredClients(data);
      } catch (error) {
        console.error('Error fetching clients:', error);
      } finally {
        setIsLoading(false);
        setTimeout(() => setPageLoaded(true), 100);
      }
    };

    fetchClients();
  }, []);

  // Apply filters
  useEffect(() => {
    let filtered = [...clients];

    // Search filter
    if (searchQuery) {
      const searchLower = searchQuery.toLowerCase();
      filtered = filtered.filter(client =>
        client.name.toLowerCase().includes(searchLower) ||
        client.email.toLowerCase().includes(searchLower) ||
        client.company.toLowerCase().includes(searchLower) ||
        (client.city && client.city.toLowerCase().includes(searchLower)) ||
        (client.country && client.country.toLowerCase().includes(searchLower))
      );
    }

    // Status filter
    if (statusFilter !== 'all') {
      filtered = filtered.filter(client => client.status === statusFilter);
    }

    setFilteredClients(filtered);
  }, [searchQuery, statusFilter, clients]);

  const clearSearch = () => {
    setSearchQuery('');
  };

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(part => part.charAt(0))
      .join('')
      .toUpperCase();
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
              Gestion des Clients
            </h1>
            <p className={`${textSecondary} text-lg`}>
              Gérez votre portefeuille clients et leurs informations
            </p>
          </div>
          
          <div className="p-4">
            <button className="inline-flex items-center px-4 py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors shadow-sm">
              <Plus size={18} className="mr-2" />
              Nouveau client
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
              placeholder="Rechercher par nom, email, entreprise, ville..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className={`block w-full pl-10 pr-10 py-2.5 border ${borderColor} rounded-lg ${bgPrimary} ${textPrimary} focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200`}
            />
            {searchQuery && (
              <button
                onClick={clearSearch}
                className={`absolute inset-y-0 right-0 pr-3 flex items-center ${textMuted} hover:${textPrimary} transition-colors`}
              >
                <X size={16} />
              </button>
            )}
          </div>

          {/* Filter Controls */}
          <div className="flex items-center gap-3">
            <button
              onClick={() => setShowFilters(!showFilters)}
              className={`inline-flex items-center px-4 py-2.5 border ${borderColor} rounded-lg ${bgPrimary} ${textPrimary} hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors`}
            >
              <Filter size={18} className="mr-2" />
              Filtres
            </button>
          </div>
        </div>

        {/* Advanced Filters */}
        {showFilters && (
          <div className={`mt-6 pt-6 border-t ${borderColor} grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4`}>
            <div>
              <label className={`block text-sm font-medium ${textSecondary} mb-1`}>
                Statut
              </label>
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className={`block w-full px-3 py-2 border ${borderColor} rounded-lg ${bgPrimary} ${textPrimary} focus:outline-none focus:ring-2 focus:ring-blue-500`}
              >
                <option value="all">Tous les statuts</option>
                <option value="active">Actif</option>
                <option value="inactive">Inactif</option>
              </select>
            </div>
          </div>
        )}
      </div>

      {/* Results Summary */}
      <div className="mb-6 flex justify-between items-center">
        <p className={`text-sm ${textSecondary}`}>
          {filteredClients.length} client{filteredClients.length !== 1 ? 's' : ''} trouvé{filteredClients.length !== 1 ? 's' : ''}
        </p>
      </div>

      {/* Clients Grid */}
      {filteredClients.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredClients.map((client, index) => (
            <div
              key={client.id}
              className={`${bgSecondary} rounded-lg ${shadowClass} ${borderColor} border ${hoverShadow} transition-all duration-300 hover:scale-105 overflow-hidden`}
              style={{
                animationName: 'fadeInScale',
                animationDuration: '0.5s',
                animationFillMode: 'both',
                animationDelay: `${0.1 * index}s`
              }}
            >
              {/* Client Header */}
              <div className="p-6">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center">
                    <div className={`h-12 w-12 rounded-full flex items-center justify-center overflow-hidden ${
                      client.avatar ? '' : 'bg-blue-100 dark:bg-blue-900/30'
                    }`}>
                      {client.avatar ? (
                        <img
                          src={client.avatar}
                          alt={client.name}
                          className="h-full w-full object-cover"
                        />
                      ) : (
                        <span className="text-blue-600 font-medium">
                          {getInitials(client.name)}
                        </span>
                      )}
                    </div>
                    <div className="ml-3">
                      <h3 className={`text-lg font-semibold ${textPrimary}`}>
                        {client.name}
                      </h3>
                      <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                        client.status === 'active'
                          ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300'
                          : 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300'
                      }`}>
                        {client.status === 'active' ? (
                          <UserCheck size={12} className="mr-1" />
                        ) : (
                          <UserX size={12} className="mr-1" />
                        )}
                        {client.status === 'active' ? 'Actif' : 'Inactif'}
                      </span>
                    </div>
                  </div>
                  
                  <button className={`p-2 rounded-full ${textMuted} hover:${textPrimary} hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors`}>
                    <MoreVertical size={16} />
                  </button>
                </div>

                {/* Client Info */}
                <div className="space-y-3">
                  <div className="flex items-center">
                    <Building size={16} className={`${textMuted} mr-2 flex-shrink-0`} />
                    <span className={`text-sm ${textSecondary} truncate`}>
                      {client.company}
                    </span>
                  </div>
                  
                  <div className="flex items-center">
                    <Mail size={16} className={`${textMuted} mr-2 flex-shrink-0`} />
                    <span className={`text-sm ${textSecondary} truncate`}>
                      {client.email}
                    </span>
                  </div>
                  
                  {client.phone && (
                    <div className="flex items-center">
                      <Phone size={16} className={`${textMuted} mr-2 flex-shrink-0`} />
                      <span className={`text-sm ${textSecondary}`}>
                        {client.phone}
                      </span>
                    </div>
                  )}
                  
                  {client.city && client.country && (
                    <div className="flex items-center">
                      <MapPin size={16} className={`${textMuted} mr-2 flex-shrink-0`} />
                      <span className={`text-sm ${textSecondary} truncate`}>
                        {client.city}, {client.country}
                      </span>
                    </div>
                  )}
                  
                  <div className="flex items-center">
                    <Calendar size={16} className={`${textMuted} mr-2 flex-shrink-0`} />
                    <span className={`text-sm ${textMuted}`}>
                      Client depuis {format(new Date(client.createdAt), 'MMM yyyy')}
                    </span>
                  </div>
                </div>
              </div>

              {/* Client Actions */}
              <div className={`px-6 py-4 bg-gray-50 dark:bg-gray-700/50 border-t ${borderColor} flex justify-between items-center`}>
                <button className={`inline-flex items-center text-sm ${textMuted} hover:text-blue-600 transition-colors`}>
                  <Eye size={16} className="mr-1" />
                  Voir détails
                </button>
                <button className={`inline-flex items-center text-sm ${textMuted} hover:text-blue-600 transition-colors`}>
                  <Edit size={16} className="mr-1" />
                  Modifier
                </button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className={`${bgSecondary} rounded-lg ${shadowClass} p-12 text-center`}>
          <Users size={48} className={`mx-auto mb-4 ${textMuted}`} />
          <h3 className={`text-lg font-medium ${textPrimary} mb-2`}>
            Aucun client trouvé
          </h3>
          <p className={textMuted}>
            {searchQuery || statusFilter !== 'all'
              ? 'Aucun client ne correspond à vos critères de recherche.'
              : 'Aucun client enregistré pour le moment.'
            }
          </p>
          {(searchQuery || statusFilter !== 'all') && (
            <button
              onClick={() => {
                setSearchQuery('');
                setStatusFilter('all');
              }}
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

export default ClientsPage;