import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useTheme } from '../../contexts/ThemeContext';
import { useLanguage } from '../../contexts/LanguageContext';
import { getMockClientById } from '../../services/clientService';
import { getMockShipments } from '../../services/shipmentService';
import { Client } from '../../types/client';
import { Shipment } from '../../types/shipment';
import ShipmentCard from '../../components/shipments/ShipmentCard';
import LoadingScreen from '../../components/common/LoadingScreen';
import Status from '../../components/common/Status';
import {
  ArrowLeft,
  User,
  Mail,
  Phone,
  Building,
  MapPin,
  Calendar,
  Hash,
  UserCheck,
  UserX,
  Edit,
  MoreVertical,
  Package,
  FileText,
  MessageSquare,
  Activity,
  TrendingUp,
  Clock,
  CheckCircle,
  AlertCircle,
  Download,
  Eye,
  Filter,
  Search
} from 'lucide-react';
import { format } from 'date-fns';
import backImage from '../../utils/backGround_hearder.png';

const ClientDetailsPage = () => {
  const { clientId } = useParams<{ clientId: string }>();
  const navigate = useNavigate();
  const { theme } = useTheme();
  const { t } = useLanguage();
  
  const [client, setClient] = useState<Client | null>(null);
  const [clientShipments, setClientShipments] = useState<Shipment[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [pageLoaded, setPageLoaded] = useState(false);
  const [activeTab, setActiveTab] = useState<'overview' | 'shipments' | 'documents' | 'activity'>('overview');
  const [shipmentsFilter, setShipmentsFilter] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');

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
      if (!clientId) return;
      
      try {
        const [clientData, shipmentsData] = await Promise.all([
          getMockClientById(clientId),
          getMockShipments()
        ]);
        
        setClient(clientData);
        // Filter shipments for this client
        const filteredShipments = shipmentsData.filter(s => s.clientId === clientData?.id);
        setClientShipments(filteredShipments);
      } catch (error) {
        console.error('Error fetching client data:', error);
      } finally {
        setIsLoading(false);
        setTimeout(() => setPageLoaded(true), 100);
      }
    };

    fetchData();
  }, [clientId]);

  const handleBack = () => {
    navigate('/clients');
  };

  const handleEditClient = () => {
    navigate(`/clients/${clientId}/edit`);
  };

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(part => part.charAt(0))
      .join('')
      .toUpperCase();
  };

  const formatClientId = (clientId: string) => {
    if (clientId && clientId.length >= 13) {
      return `${clientId.substring(0, 3)}-${clientId.substring(3, 7)}-${clientId.substring(7, 11)}-${clientId.substring(11)}`;
    }
    return clientId;
  };

  // Filter shipments based on status and search
  const filteredShipments = clientShipments.filter(shipment => {
    const matchesStatus = shipmentsFilter === 'all' || shipment.status === shipmentsFilter;
    const matchesSearch = !searchQuery || 
      shipment.reference.toLowerCase().includes(searchQuery.toLowerCase()) ||
      shipment.origin.toLowerCase().includes(searchQuery.toLowerCase()) ||
      shipment.destination.toLowerCase().includes(searchQuery.toLowerCase());
    
    return matchesStatus && matchesSearch;
  });

  // Calculate statistics
  const stats = {
    totalShipments: clientShipments.length,
    activeShipments: clientShipments.filter(s => ['processing', 'warehouse', 'customs', 'in_transit'].includes(s.status)).length,
    deliveredShipments: clientShipments.filter(s => s.status === 'delivered').length,
    issueShipments: clientShipments.filter(s => s.status === 'issue').length
  };

  const completionRate = stats.totalShipments > 0 ? Math.round((stats.deliveredShipments / stats.totalShipments) * 100) : 0;

  if (isLoading) {
    return <LoadingScreen />;
  }

  if (!client) {
    return (
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className={`${bgSecondary} rounded-lg ${shadowClass} p-8 text-center`}>
          <AlertCircle size={48} className={`mx-auto mb-4 ${textMuted}`} />
          <h3 className={`text-lg font-medium ${textPrimary} mb-2`}>
            Client non trouvé
          </h3>
          <p className={textMuted}>
            Le client demandé n'existe pas ou a été supprimé.
          </p>
          <button
            onClick={handleBack}
            className="mt-4 inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            <ArrowLeft size={16} className="mr-2" />
            Retour aux clients
          </button>
        </div>
      </div>
    );
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
            <div className="flex items-center mb-4">
              <button
                onClick={handleBack}
                className={`p-2 rounded-lg ${textMuted} hover:${textPrimary} hover:bg-white/20 transition-colors mr-4`}
              >
                <ArrowLeft size={20} />
              </button>
              <div className="flex items-center">
                <div className={`h-12 w-12 rounded-full flex items-center justify-center overflow-hidden mr-4 ${
                  client.avatar ? '' : 'bg-blue-100 dark:bg-blue-900/30'
                }`}>
                  {client.avatar ? (
                    <img
                      src={client.avatar}
                      alt={client.name}
                      className="h-full w-full object-cover"
                    />
                  ) : (
                    <span className="text-blue-600 font-medium text-lg">
                      {getInitials(client.name)}
                    </span>
                  )}
                </div>
                <div>
                  <h1 className={`text-2xl md:text-3xl font-bold ${textPrimary}`}>
                    {client.name}
                  </h1>
                  <p className={`${textSecondary} text-lg`}>
                    {client.company}
                  </p>
                </div>
              </div>
            </div>
          </div>
          
          <div className="flex flex-col sm:flex-row gap-3 p-4">
            <button className={`inline-flex items-center px-4 py-2.5 border ${borderColor} rounded-lg ${bgPrimary} ${textPrimary} hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors`}>
              <MessageSquare size={18} className="mr-2" />
              Contacter
            </button>
            <button 
              onClick={handleEditClient}
              className="inline-flex items-center px-4 py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors shadow-sm"
            >
              <Edit size={18} className="mr-2" />
              Modifier
            </button>
          </div>
        </div>
      </div>

      {/* Client Info Card */}
      <div className={`${bgSecondary} rounded-lg ${shadowClass} p-6 mb-8 ${borderColor} border`}>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {/* Basic Info */}
          <div className="space-y-4">
            <h3 className={`text-lg font-semibold ${textPrimary} mb-4`}>
              Informations de base
            </h3>
            
            <div className="flex items-center">
              <Hash size={16} className={`${textMuted} mr-2 flex-shrink-0`} />
              <div>
                <span className={`text-xs ${textMuted} block`}>ID Client</span>
                <span className={`text-sm font-mono ${textPrimary} font-medium`}>
                  {formatClientId(client.clientId || `DKR${String(client.id).padStart(10, '0')}`)}
                </span>
              </div>
            </div>

            <div className="flex items-center">
              <Mail size={16} className={`${textMuted} mr-2 flex-shrink-0`} />
              <div>
                <span className={`text-xs ${textMuted} block`}>Email</span>
                <span className={`text-sm ${textSecondary}`}>
                  {client.email}
                </span>
              </div>
            </div>

            {client.phone && (
              <div className="flex items-center">
                <Phone size={16} className={`${textMuted} mr-2 flex-shrink-0`} />
                <div>
                  <span className={`text-xs ${textMuted} block`}>Téléphone</span>
                  <span className={`text-sm ${textSecondary}`}>
                    {client.phone}
                  </span>
                </div>
              </div>
            )}
          </div>

          {/* Company Info */}
          <div className="space-y-4">
            <h3 className={`text-lg font-semibold ${textPrimary} mb-4`}>
              Entreprise
            </h3>
            
            <div className="flex items-center">
              <Building size={16} className={`${textMuted} mr-2 flex-shrink-0`} />
              <div>
                <span className={`text-xs ${textMuted} block`}>Société</span>
                <span className={`text-sm ${textSecondary}`}>
                  {client.company}
                </span>
              </div>
            </div>

            {client.city && client.country && (
              <div className="flex items-center">
                <MapPin size={16} className={`${textMuted} mr-2 flex-shrink-0`} />
                <div>
                  <span className={`text-xs ${textMuted} block`}>Localisation</span>
                  <span className={`text-sm ${textSecondary}`}>
                    {client.city}, {client.country}
                  </span>
                </div>
              </div>
            )}
          </div>

          {/* Status & Dates */}
          <div className="space-y-4">
            <h3 className={`text-lg font-semibold ${textPrimary} mb-4`}>
              Statut & Dates
            </h3>
            
            <div className="flex items-center">
              <div className="mr-2">
                {client.status === 'active' ? (
                  <UserCheck size={16} className="text-green-600" />
                ) : (
                  <UserX size={16} className="text-red-600" />
                )}
              </div>
              <div>
                <span className={`text-xs ${textMuted} block`}>Statut</span>
                <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                  client.status === 'active'
                    ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300'
                    : 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300'
                }`}>
                  {client.status === 'active' ? 'Actif' : 'Inactif'}
                </span>
              </div>
            </div>

            <div className="flex items-center">
              <Calendar size={16} className={`${textMuted} mr-2 flex-shrink-0`} />
              <div>
                <span className={`text-xs ${textMuted} block`}>Client depuis</span>
                <span className={`text-sm ${textSecondary}`}>
                  {format(new Date(client.createdAt), 'dd/MM/yyyy')}
                </span>
              </div>
            </div>
          </div>

          {/* Statistics */}
          <div className="space-y-4">
            <h3 className={`text-lg font-semibold ${textPrimary} mb-4`}>
              Statistiques
            </h3>
            
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className={`text-xs ${textMuted}`}>Total expéditions</span>
                <span className={`text-sm font-medium ${textPrimary}`}>{stats.totalShipments}</span>
              </div>
              
              <div className="flex justify-between items-center">
                <span className={`text-xs ${textMuted}`}>En cours</span>
                <span className={`text-sm font-medium ${textPrimary}`}>{stats.activeShipments}</span>
              </div>
              
              <div className="flex justify-between items-center">
                <span className={`text-xs ${textMuted}`}>Livrées</span>
                <span className={`text-sm font-medium text-green-600`}>{stats.deliveredShipments}</span>
              </div>
              
              <div className="flex justify-between items-center">
                <span className={`text-xs ${textMuted}`}>Taux de réussite</span>
                <span className={`text-sm font-medium ${textPrimary}`}>{completionRate}%</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs Navigation */}
      <div className={`${bgSecondary} rounded-lg ${shadowClass} mb-6 ${borderColor} border`}>
        <div className="flex flex-wrap border-b border-gray-200 dark:border-gray-700">
          {[
            { id: 'overview', label: 'Aperçu', icon: TrendingUp },
            { id: 'shipments', label: 'Expéditions', icon: Package },
            { id: 'documents', label: 'Documents', icon: FileText },
            { id: 'activity', label: 'Activité', icon: Activity }
          ].map((tab) => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`flex items-center px-6 py-4 text-sm font-medium transition-colors ${
                  activeTab === tab.id
                    ? 'border-b-2 border-blue-500 text-blue-600 dark:text-blue-400'
                    : `${textMuted} hover:${textSecondary}`
                }`}
              >
                <Icon size={16} className="mr-2" />
                {tab.label}
                {tab.id === 'shipments' && (
                  <span className={`ml-2 px-2 py-0.5 text-xs rounded-full ${
                    activeTab === tab.id 
                      ? 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300'
                      : 'bg-gray-100 text-gray-600 dark:bg-gray-700 dark:text-gray-400'
                  }`}>
                    {stats.totalShipments}
                  </span>
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* Tab Content */}
      {activeTab === 'overview' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Statistics Cards */}
          <div className="lg:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className={`${bgSecondary} rounded-lg ${shadowClass} p-6 ${borderColor} border`}>
              <div className="flex items-center justify-between">
                <div>
                  <p className={`text-sm ${textMuted}`}>Expéditions actives</p>
                  <p className={`text-2xl font-bold ${textPrimary}`}>{stats.activeShipments}</p>
                </div>
                <div className="p-3 bg-blue-100 dark:bg-blue-900/30 rounded-full">
                  <Package size={24} className="text-blue-600 dark:text-blue-400" />
                </div>
              </div>
            </div>

            <div className={`${bgSecondary} rounded-lg ${shadowClass} p-6 ${borderColor} border`}>
              <div className="flex items-center justify-between">
                <div>
                  <p className={`text-sm ${textMuted}`}>Taux de réussite</p>
                  <p className={`text-2xl font-bold ${textPrimary}`}>{completionRate}%</p>
                </div>
                <div className="p-3 bg-green-100 dark:bg-green-900/30 rounded-full">
                  <CheckCircle size={24} className="text-green-600 dark:text-green-400" />
                </div>
              </div>
            </div>

            <div className={`${bgSecondary} rounded-lg ${shadowClass} p-6 ${borderColor} border`}>
              <div className="flex items-center justify-between">
                <div>
                  <p className={`text-sm ${textMuted}`}>Temps moyen</p>
                  <p className={`text-2xl font-bold ${textPrimary}`}>12j</p>
                </div>
                <div className="p-3 bg-yellow-100 dark:bg-yellow-900/30 rounded-full">
                  <Clock size={24} className="text-yellow-600 dark:text-yellow-400" />
                </div>
              </div>
            </div>

            <div className={`${bgSecondary} rounded-lg ${shadowClass} p-6 ${borderColor} border`}>
              <div className="flex items-center justify-between">
                <div>
                  <p className={`text-sm ${textMuted}`}>Problèmes</p>
                  <p className={`text-2xl font-bold ${textPrimary}`}>{stats.issueShipments}</p>
                </div>
                <div className="p-3 bg-red-100 dark:bg-red-900/30 rounded-full">
                  <AlertCircle size={24} className="text-red-600 dark:text-red-400" />
                </div>
              </div>
            </div>
          </div>

          {/* Recent Activity */}
          <div className={`${bgSecondary} rounded-lg ${shadowClass} p-6 ${borderColor} border`}>
            <h3 className={`text-lg font-semibold ${textPrimary} mb-4`}>
              Activité récente
            </h3>
            <div className="space-y-4">
              {clientShipments.slice(0, 5).map((shipment) => (
                <div key={shipment.id} className="flex items-center space-x-3">
                  <div className="flex-shrink-0">
                    <Status status={shipment.status} size="sm" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className={`text-sm font-medium ${textPrimary} truncate`}>
                      {shipment.reference}
                    </p>
                    <p className={`text-xs ${textMuted} truncate`}>
                      {shipment.origin} → {shipment.destination}
                    </p>
                  </div>
                  <div className={`text-xs ${textMuted}`}>
                    {format(new Date(shipment.updatedAt), 'dd/MM')}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {activeTab === 'shipments' && (
        <div className="space-y-6">
          {/* Filters */}
          <div className={`${bgSecondary} rounded-lg ${shadowClass} p-4 ${borderColor} border`}>
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="flex-1 relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Search size={18} className={textMuted} />
                </div>
                <input
                  type="text"
                  placeholder="Rechercher une expédition..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className={`block w-full pl-10 pr-4 py-2.5 border ${borderColor} rounded-lg ${bgPrimary} ${textPrimary} focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500`}
                />
              </div>
              
              <select
                value={shipmentsFilter}
                onChange={(e) => setShipmentsFilter(e.target.value)}
                className={`px-4 py-2.5 border ${borderColor} rounded-lg ${bgPrimary} ${textPrimary} focus:outline-none focus:ring-2 focus:ring-blue-500`}
              >
                <option value="all">Tous les statuts</option>
                <option value="draft">Brouillon</option>
                <option value="processing">En traitement</option>
                <option value="warehouse">En entrepôt</option>
                <option value="customs">Dédouanement</option>
                <option value="in_transit">En transit</option>
                <option value="delivered">Livré</option>
                <option value="issue">Problème</option>
              </select>
            </div>
          </div>

          {/* Shipments Grid */}
          {filteredShipments.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredShipments.map((shipment, index) => (
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
                Aucune expédition trouvée
              </h3>
              <p className={textMuted}>
                {searchQuery || shipmentsFilter !== 'all'
                  ? 'Aucune expédition ne correspond à vos critères.'
                  : 'Ce client n\'a pas encore d\'expéditions.'
                }
              </p>
            </div>
          )}
        </div>
      )}

      {activeTab === 'documents' && (
        <div className={`${bgSecondary} rounded-lg ${shadowClass} p-12 text-center`}>
          <FileText size={48} className={`mx-auto mb-4 ${textMuted}`} />
          <h3 className={`text-lg font-medium ${textPrimary} mb-2`}>
            Documents du client
          </h3>
          <p className={textMuted}>
            La gestion des documents sera disponible prochainement.
          </p>
        </div>
      )}

      {activeTab === 'activity' && (
        <div className={`${bgSecondary} rounded-lg ${shadowClass} p-12 text-center`}>
          <Activity size={48} className={`mx-auto mb-4 ${textMuted}`} />
          <h3 className={`text-lg font-medium ${textPrimary} mb-2`}>
            Journal d'activité
          </h3>
          <p className={textMuted}>
            L'historique des activités sera disponible prochainement.
          </p>
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

export default ClientDetailsPage;