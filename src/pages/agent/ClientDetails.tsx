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
  Search,
  DollarSign,
  BarChart3,
  Globe,
  Shield,
  CreditCard,
  Star,
  Truck,
  Ship,
  Plane
} from 'lucide-react';
import { format } from 'date-fns';
import backImage from '../../utils/backGround_hearder.png';

// Mock data generators
const generateMockClientShipments = (clientId: string): Shipment[] => {
  const mockShipments: Shipment[] = [
    {
      id: 'SHIP-1001',
      reference: 'HT-10001',
      clientId,
      origin: 'Shanghai, China',
      destination: 'Paris, France',
      description: 'Electronics components',
      weight: 1250.5,
      volume: 15.2,
      status: 'delivered',
      type: 'sea',
      estimatedDelivery: '2024-01-15T10:00:00',
      assignedAgentId: '2',
      createdAt: '2024-01-01T08:00:00',
      updatedAt: '2024-01-15T10:00:00',
      events: [],
      documents: []
    },
    {
      id: 'SHIP-1002',
      reference: 'HT-10002',
      clientId,
      origin: 'Dubai, UAE',
      destination: 'Lyon, France',
      description: 'Textile goods',
      weight: 850.0,
      volume: 12.8,
      status: 'in_transit',
      type: 'air',
      estimatedDelivery: '2024-02-10T14:00:00',
      assignedAgentId: '2',
      createdAt: '2024-01-20T09:00:00',
      updatedAt: '2024-02-05T16:30:00',
      events: [],
      documents: []
    },
    {
      id: 'SHIP-1003',
      reference: 'HT-10003',
      clientId,
      origin: 'Hamburg, Germany',
      destination: 'Marseille, France',
      description: 'Automotive parts',
      weight: 2100.0,
      volume: 25.5,
      status: 'warehouse',
      type: 'sea',
      estimatedDelivery: '2024-02-20T12:00:00',
      assignedAgentId: '2',
      createdAt: '2024-02-01T10:00:00',
      updatedAt: '2024-02-08T11:15:00',
      events: [],
      documents: []
    },
    {
      id: 'SHIP-1004',
      reference: 'HT-10004',
      clientId,
      origin: 'Rotterdam, Netherlands',
      destination: 'Toulouse, France',
      description: 'Industrial machinery',
      weight: 3200.0,
      volume: 45.8,
      status: 'customs',
      type: 'sea',
      estimatedDelivery: '2024-02-25T16:00:00',
      assignedAgentId: '2',
      createdAt: '2024-02-10T14:00:00',
      updatedAt: '2024-02-15T09:30:00',
      events: [],
      documents: []
    },
    {
      id: 'SHIP-1005',
      reference: 'HT-10005',
      clientId,
      origin: 'Singapore',
      destination: 'Nice, France',
      description: 'Consumer electronics',
      weight: 680.0,
      volume: 8.5,
      status: 'processing',
      type: 'air',
      estimatedDelivery: '2024-03-05T11:00:00',
      assignedAgentId: '2',
      createdAt: '2024-02-20T10:00:00',
      updatedAt: '2024-02-22T15:45:00',
      events: [],
      documents: []
    }
  ];
  return mockShipments;
};

const generateMockDocuments = () => [
  {
    id: 'doc-1',
    name: 'Contrat de service 2024',
    type: 'contract',
    uploadedAt: '2024-01-15T10:00:00',
    uploadedBy: 'Agent Commercial',
    size: '2.4 MB',
    status: 'approved'
  },
  {
    id: 'doc-2',
    name: 'Police d\'assurance transport',
    type: 'insurance_policy',
    uploadedAt: '2024-01-10T14:30:00',
    uploadedBy: 'Client',
    size: '1.8 MB',
    status: 'approved'
  },
  {
    id: 'doc-3',
    name: 'Certificat fiscal 2024',
    type: 'tax_certificate',
    uploadedAt: '2024-02-01T09:15:00',
    uploadedBy: 'Comptabilité',
    size: '856 KB',
    status: 'pending_review'
  },
  {
    id: 'doc-4',
    name: 'Document de conformité douanière',
    type: 'compliance_document',
    uploadedAt: '2024-01-25T16:20:00',
    uploadedBy: 'Agent Douanes',
    size: '1.2 MB',
    status: 'approved'
  },
  {
    id: 'doc-5',
    name: 'État financier Q4 2023',
    type: 'financial_statement',
    uploadedAt: '2024-01-05T11:45:00',
    uploadedBy: 'Directeur Financier',
    size: '3.1 MB',
    status: 'expired'
  }
];

const generateMockActivities = () => [
  {
    id: 'act-1',
    type: 'shipment_created',
    description: 'Nouvelle expédition HT-10005 créée',
    timestamp: '2024-02-20T10:00:00',
    user: 'Agent Operations',
    details: 'Expédition aérienne vers Nice'
  },
  {
    id: 'act-2',
    type: 'status_updated',
    description: 'Statut de HT-10004 mis à jour vers "Dédouanement"',
    timestamp: '2024-02-15T09:30:00',
    user: 'Agent Douanes',
    details: 'Documents douaniers en cours de vérification'
  },
  {
    id: 'act-3',
    type: 'document_uploaded',
    description: 'Document "Certificat fiscal 2024" téléchargé',
    timestamp: '2024-02-01T09:15:00',
    user: 'Comptabilité',
    details: 'Document en attente de validation'
  },
  {
    id: 'act-4',
    type: 'payment_received',
    description: 'Paiement reçu pour la facture #INV-2024-001',
    timestamp: '2024-01-30T14:20:00',
    user: 'Système de paiement',
    details: 'Montant: 15,750'
  },
  {
    id: 'act-5',
    type: 'shipment_delivered',
    description: 'Expédition HT-10001 livrée avec succès',
    timestamp: '2024-01-15T10:00:00',
    user: 'Agent Livraison',
    details: 'Livraison confirmée par le destinataire'
  },
  {
    id: 'act-6',
    type: 'meeting_scheduled',
    description: 'Réunion de révision trimestrielle programmée',
    timestamp: '2024-01-12T16:30:00',
    user: 'Gestionnaire de compte',
    details: 'Prévue pour le 15 mars 2024'
  },
  {
    id: 'act-7',
    type: 'contract_renewed',
    description: 'Contrat de service renouvelé pour 2024',
    timestamp: '2024-01-05T11:00:00',
    user: 'Directeur Commercial',
    details: 'Renouvellement automatique activé'
  },
  {
    id: 'act-8',
    type: 'feedback_received',
    description: 'Évaluation de satisfaction client reçue',
    timestamp: '2024-01-03T09:45:00',
    user: 'Service Qualité',
    details: 'Note: 4.8/5 - Très satisfait'
  }
];

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
        // Use mock shipments for this client
        const mockShipments = generateMockClientShipments(clientData?.id || clientId);
        setClientShipments(mockShipments);
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
  const avgDeliveryTime = 12; // Mock data
  const totalValue = 125000; // Mock data
  const avgShipmentValue = stats.totalShipments > 0 ? Math.round(totalValue / stats.totalShipments) : 0;
  const customerSatisfaction = 4.8; // Mock data
  const monthlyVolume = 8; // Mock data
  const yearlyGrowth = 15; // Mock data

  // Get activity icon
  const getActivityIcon = (type: string) => {
    switch (type) {
      case 'shipment_created': return Package;
      case 'status_updated': return TrendingUp;
      case 'document_uploaded': return FileText;
      case 'payment_received': return DollarSign;
      case 'shipment_delivered': return CheckCircle;
      case 'meeting_scheduled': return Calendar;
      case 'contract_renewed': return FileText;
      case 'feedback_received': return Star;
      default: return Activity;
    }
  };

  // Get activity color
  const getActivityColor = (type: string) => {
    switch (type) {
      case 'shipment_created': return 'text-blue-500';
      case 'status_updated': return 'text-orange-500';
      case 'document_uploaded': return 'text-purple-500';
      case 'payment_received': return 'text-green-500';
      case 'shipment_delivered': return 'text-emerald-500';
      case 'meeting_scheduled': return 'text-indigo-500';
      case 'contract_renewed': return 'text-cyan-500';
      case 'feedback_received': return 'text-yellow-500';
      default: return 'text-gray-500';
    }
  };

  // Get document status color
  const getDocumentStatusColor = (status: string) => {
    switch (status) {
      case 'approved': return 'text-green-600 bg-green-100 dark:bg-green-900/30 dark:text-green-300';
      case 'pending_review': return 'text-yellow-600 bg-yellow-100 dark:bg-yellow-900/30 dark:text-yellow-300';
      case 'rejected': return 'text-red-600 bg-red-100 dark:bg-red-900/30 dark:text-red-300';
      case 'expired': return 'text-gray-600 bg-gray-100 dark:bg-gray-900/30 dark:text-gray-300';
      default: return 'text-gray-600 bg-gray-100 dark:bg-gray-900/30 dark:text-gray-300';
    }
  };

  // Get document type icon
  const getDocumentTypeIcon = (type: string) => {
    switch (type) {
      case 'contract': return FileText;
      case 'insurance_policy': return Shield;
      case 'tax_certificate': return FileText;
      case 'compliance_document': return CheckCircle;
      case 'financial_statement': return BarChart3;
      default: return FileText;
    }
  };

  if (isLoading) {
    return <LoadingScreen />;
  }

  if (!client) {
    return (
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className={`${bgSecondary} rounded-lg ${shadowClass} p-8 text-center`}>
          <AlertCircle size={48} className={`mx-auto mb-4 ${textMuted}`} />
          <h3 className={`text-lg font-medium ${textPrimary} mb-2`}>
            {t('client_not_found')}
          </h3>
          <p className={textMuted}>
            {t('client_not_found_desc')}
          </p>
          <button
            onClick={handleBack}
            className="mt-4 inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            <ArrowLeft size={16} className="mr-2" />
            {t('backToClients')}
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
              {t('contact_client')}
            </button>
            <button 
              onClick={handleEditClient}
              className="inline-flex items-center px-4 py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors shadow-sm"
            >
              <Edit size={18} className="mr-2" />
              {t('modify_client')}
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
              {t('basic_information')}
            </h3>
            
            <div className="flex items-center">
              <Hash size={16} className={`${textMuted} mr-2 flex-shrink-0`} />
              <div>
                <span className={`text-xs ${textMuted} block`}>{t('clientId')}</span>
                <span className={`text-sm font-mono ${textPrimary} font-medium`}>
                  {formatClientId(client.clientId || `DKR${String(client.id).padStart(10, '0')}`)}
                </span>
              </div>
            </div>

            <div className="flex items-center">
              <Mail size={16} className={`${textMuted} mr-2 flex-shrink-0`} />
              <div>
                <span className={`text-xs ${textMuted} block`}>{t('email')}</span>
                <span className={`text-sm ${textSecondary}`}>
                  {client.email}
                </span>
              </div>
            </div>

            {client.phone && (
              <div className="flex items-center">
                <Phone size={16} className={`${textMuted} mr-2 flex-shrink-0`} />
                <div>
                  <span className={`text-xs ${textMuted} block`}>{t('phone')}</span>
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
              {t('companyInfo')}
            </h3>
            
            <div className="flex items-center">
              <Building size={16} className={`${textMuted} mr-2 flex-shrink-0`} />
              <div>
                <span className={`text-xs ${textMuted} block`}>{t('company')}</span>
                <span className={`text-sm ${textSecondary}`}>
                  {client.company}
                </span>
              </div>
            </div>

            {client.city && client.country && (
              <div className="flex items-center">
                <MapPin size={16} className={`${textMuted} mr-2 flex-shrink-0`} />
                <div>
                  <span className={`text-xs ${textMuted} block`}>{t('location')}</span>
                  <span className={`text-sm ${textSecondary}`}>
                    {client.city}, {client.country}
                  </span>
                </div>
              </div>
            )}

            {client.address && (
              <div className="flex items-start">
                <MapPin size={16} className={`${textMuted} mr-2 flex-shrink-0 mt-0.5`} />
                <div>
                  <span className={`text-xs ${textMuted} block`}>{t('address')}</span>
                  <span className={`text-sm ${textSecondary}`}>
                    {client.address}
                  </span>
                </div>
              </div>
            )}
          </div>

          {/* Status & Dates */}
          <div className="space-y-4">
            <h3 className={`text-lg font-semibold ${textPrimary} mb-4`}>
              {t('account_status')}
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
                <span className={`text-xs ${textMuted} block`}>{t('status')}</span>
                <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                  client.status === 'active'
                    ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300'
                    : 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300'
                }`}>
                  {client.status === 'active' ? t('active') : t('inactive')}
                </span>
              </div>
            </div>

            <div className="flex items-center">
              <Calendar size={16} className={`${textMuted} mr-2 flex-shrink-0`} />
              <div>
                <span className={`text-xs ${textMuted} block`}>{t('client_since')}</span>
                <span className={`text-sm ${textSecondary}`}>
                  {format(new Date(client.createdAt), 'dd/MM/yyyy')}
                </span>
              </div>
            </div>

            <div className="flex items-center">
              <Clock size={16} className={`${textMuted} mr-2 flex-shrink-0`} />
              <div>
                <span className={`text-xs ${textMuted} block`}>{t('last_activity')}</span>
                <span className={`text-sm ${textSecondary}`}>
                  {format(new Date(), 'dd/MM/yyyy')}
                </span>
              </div>
            </div>
          </div>

          {/* Business Metrics */}
          <div className="space-y-4">
            <h3 className={`text-lg font-semibold ${textPrimary} mb-4`}>
              {t('business_metrics')}
            </h3>
            
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className={`text-xs ${textMuted}`}>{t('total_shipments')}</span>
                <span className={`text-sm font-medium ${textPrimary}`}>{stats.totalShipments}</span>
              </div>
              
              <div className="flex justify-between items-center">
                <span className={`text-xs ${textMuted}`}>{t('success_rate')}</span>
                <span className={`text-sm font-medium text-green-600`}>{completionRate}%</span>
              </div>
              
              <div className="flex justify-between items-center">
                <span className={`text-xs ${textMuted}`}>{t('total_value')}</span>
                <span className={`text-sm font-medium ${textPrimary}`}>{totalValue.toLocaleString()}</span>
              </div>
              
              <div className="flex justify-between items-center">
                <span className={`text-xs ${textMuted}`}>{t('customer_satisfaction')}</span>
                <span className={`text-sm font-medium text-yellow-600`}>{customerSatisfaction}/5</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs Navigation */}
      <div className={`${bgSecondary} rounded-lg ${shadowClass} mb-6 ${borderColor} border`}>
        <div className="flex flex-wrap border-b border-gray-200 dark:border-gray-700">
          {[
            { id: 'overview', label: t('overview'), icon: TrendingUp },
            { id: 'shipments', label: t('shipments'), icon: Package },
            { id: 'documents', label: t('documents'), icon: FileText },
            { id: 'activity', label: t('activity_log'), icon: Activity }
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
                {tab.id === 'documents' && (
                  <span className={`ml-2 px-2 py-0.5 text-xs rounded-full ${
                    activeTab === tab.id 
                      ? 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300'
                      : 'bg-gray-100 text-gray-600 dark:bg-gray-700 dark:text-gray-400'
                  }`}>
                    {generateMockDocuments().length}
                  </span>
                )}
                {tab.id === 'activity' && (
                  <span className={`ml-2 px-2 py-0.5 text-xs rounded-full ${
                    activeTab === tab.id 
                      ? 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300'
                      : 'bg-gray-100 text-gray-600 dark:bg-gray-700 dark:text-gray-400'
                  }`}>
                    {generateMockActivities().length}
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
          {/* Performance Overview */}
          <div className="lg:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className={`${bgSecondary} rounded-lg ${shadowClass} p-6 ${borderColor} border`}>
              <div className="flex items-center justify-between">
                <div>
                  <p className={`text-sm ${textMuted}`}>{t('active_shipments')}</p>
                  <p className={`text-2xl font-bold ${textPrimary}`}>{stats.activeShipments}</p>
                  <p className={`text-xs ${textMuted} mt-1`}>{t('pending_shipments')}</p>
                </div>
                <div className="p-3 bg-blue-100 dark:bg-blue-900/30 rounded-full">
                  <Package size={24} className="text-blue-600 dark:text-blue-400" />
                </div>
              </div>
            </div>

            <div className={`${bgSecondary} rounded-lg ${shadowClass} p-6 ${borderColor} border`}>
              <div className="flex items-center justify-between">
                <div>
                  <p className={`text-sm ${textMuted}`}>{t('success_rate')}</p>
                  <p className={`text-2xl font-bold ${textPrimary}`}>{completionRate}%</p>
                  <p className={`text-xs ${textMuted} mt-1`}>{t('delivery_performance')}</p>
                </div>
                <div className="p-3 bg-green-100 dark:bg-green-900/30 rounded-full">
                  <CheckCircle size={24} className="text-green-600 dark:text-green-400" />
                </div>
              </div>
            </div>

            <div className={`${bgSecondary} rounded-lg ${shadowClass} p-6 ${borderColor} border`}>
              <div className="flex items-center justify-between">
                <div>
                  <p className={`text-sm ${textMuted}`}>{t('average_transit_time')}</p>
                  <p className={`text-2xl font-bold ${textPrimary}`}>{avgDeliveryTime}{t('days')}</p>
                  <p className={`text-xs ${textMuted} mt-1`}>{t('avg_delivery_time')}</p>
                </div>
                <div className="p-3 bg-yellow-100 dark:bg-yellow-900/30 rounded-full">
                  <Clock size={24} className="text-yellow-600 dark:text-yellow-400" />
                </div>
              </div>
            </div>

            <div className={`${bgSecondary} rounded-lg ${shadowClass} p-6 ${borderColor} border`}>
              <div className="flex items-center justify-between">
                <div>
                  <p className={`text-sm ${textMuted}`}>{t('revenue_generated')}</p>
                  <p className={`text-2xl font-bold ${textPrimary}`}>{totalValue.toLocaleString()}</p>
                  <p className={`text-xs ${textMuted} mt-1`}>{t('total_value')}</p>
                </div>
                <div className="p-3 bg-purple-100 dark:bg-purple-900/30 rounded-full">
                  <DollarSign size={24} className="text-purple-600 dark:text-purple-400" />
                </div>
              </div>
            </div>

            <div className={`${bgSecondary} rounded-lg ${shadowClass} p-6 ${borderColor} border`}>
              <div className="flex items-center justify-between">
                <div>
                  <p className={`text-sm ${textMuted}`}>{t('monthly_volume')}</p>
                  <p className={`text-2xl font-bold ${textPrimary}`}>{monthlyVolume}</p>
                  <p className={`text-xs ${textMuted} mt-1`}>{t('shipment_volume')}</p>
                </div>
                <div className="p-3 bg-indigo-100 dark:bg-indigo-900/30 rounded-full">
                  <BarChart3 size={24} className="text-indigo-600 dark:text-indigo-400" />
                </div>
              </div>
            </div>

            <div className={`${bgSecondary} rounded-lg ${shadowClass} p-6 ${borderColor} border`}>
              <div className="flex items-center justify-between">
                <div>
                  <p className={`text-sm ${textMuted}`}>{t('yearly_growth')}</p>
                  <p className={`text-2xl font-bold ${textPrimary}`}>+{yearlyGrowth}%</p>
                  <p className={`text-xs ${textMuted} mt-1`}>{t('performance_overview')}</p>
                </div>
                <div className="p-3 bg-emerald-100 dark:bg-emerald-900/30 rounded-full">
                  <TrendingUp size={24} className="text-emerald-600 dark:text-emerald-400" />
                </div>
              </div>
            </div>
          </div>

          {/* Recent Activity & Shipping Methods */}
          <div className="space-y-6">
            {/* Recent Activity */}
            <div className={`${bgSecondary} rounded-lg ${shadowClass} p-6 ${borderColor} border`}>
              <h3 className={`text-lg font-semibold ${textPrimary} mb-4`}>
                {t('recent_activity')}
              </h3>
              <div className="space-y-4">
                {generateMockActivities().slice(0, 5).map((activity) => {
                  const Icon = getActivityIcon(activity.type);
                  const colorClass = getActivityColor(activity.type);
                  return (
                    <div key={activity.id} className="flex items-center space-x-3">
                      <div className="flex-shrink-0">
                        <Icon size={16} className={colorClass} />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className={`text-sm font-medium ${textPrimary} truncate`}>
                          {activity.description}
                        </p>
                        <p className={`text-xs ${textMuted} truncate`}>
                          {format(new Date(activity.timestamp), 'dd/MM/yyyy HH:mm')}
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Preferred Shipping Methods */}
            <div className={`${bgSecondary} rounded-lg ${shadowClass} p-6 ${borderColor} border`}>
              <h3 className={`text-lg font-semibold ${textPrimary} mb-4`}>
                {t('preferred_shipping_methods')}
              </h3>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <Ship size={16} className="text-blue-600 mr-2" />
                    <span className={`text-sm ${textSecondary}`}>{t('sea_shipment')}</span>
                  </div>
                  <span className={`text-sm font-medium ${textPrimary}`}>60%</span>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <Plane size={16} className="text-green-600 mr-2" />
                    <span className={`text-sm ${textSecondary}`}>{t('air_shipment')}</span>
                  </div>
                  <span className={`text-sm font-medium ${textPrimary}`}>40%</span>
                </div>
              </div>
            </div>

            {/* Top Destinations */}
            <div className={`${bgSecondary} rounded-lg ${shadowClass} p-6 ${borderColor} border`}>
              <h3 className={`text-lg font-semibold ${textPrimary} mb-4`}>
                {t('top_destinations')}
              </h3>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className={`text-sm ${textSecondary}`}>Paris, France</span>
                  <span className={`text-sm font-medium ${textPrimary}`}>35%</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className={`text-sm ${textSecondary}`}>Lyon, France</span>
                  <span className={`text-sm font-medium ${textPrimary}`}>25%</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className={`text-sm ${textSecondary}`}>Marseille, France</span>
                  <span className={`text-sm font-medium ${textPrimary}`}>20%</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className={`text-sm ${textSecondary}`}>{t('other')}</span>
                  <span className={`text-sm font-medium ${textPrimary}`}>20%</span>
                </div>
              </div>
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
                  placeholder={t('search_shipments_placeholder')}
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
                <option value="all">{t('all_shipment_statuses')}</option>
                <option value="draft">{t('draft')}</option>
                <option value="processing">{t('processing')}</option>
                <option value="warehouse">{t('warehouse')}</option>
                <option value="customs">{t('customs')}</option>
                <option value="in_transit">{t('in_transit')}</option>
                <option value="delivered">{t('delivered')}</option>
                <option value="issue">{t('issue')}</option>
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
                {t('no_shipments_for_client')}
              </h3>
              <p className={textMuted}>
                {searchQuery || shipmentsFilter !== 'all'
                  ? t('no_shipments_match_criteria')
                  : t('no_shipments_for_client')
                }
              </p>
              {(searchQuery || shipmentsFilter !== 'all') && (
                <button
                  onClick={() => {
                    setSearchQuery('');
                    setShipmentsFilter('all');
                  }}
                  className="mt-4 inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  {t('clear_shipment_filters')}
                </button>
              )}
            </div>
          )}
        </div>
      )}

      {activeTab === 'documents' && (
        <div className="space-y-6">
          {/* Documents List */}
          <div className={`${bgSecondary} rounded-lg ${shadowClass} ${borderColor} border`}>
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h3 className={`text-lg font-semibold ${textPrimary}`}>
                  {t('client_documents')}
                </h3>
                <button className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
                  <FileText size={16} className="mr-2" />
                  {t('upload_new_document')}
                </button>
              </div>
              
              <div className="space-y-4">
                {generateMockDocuments().map((document, index) => {
                  const Icon = getDocumentTypeIcon(document.type);
                  const statusColorClass = getDocumentStatusColor(document.status);
                  
                  return (
                    <div
                      key={document.id}
                      className={`flex items-center justify-between p-4 rounded-lg ${isDark ? 'bg-gray-700/50' : 'bg-gray-50'} transition-all duration-300 hover:shadow-md`}
                      style={{
                        animationName: 'fadeInScale',
                        animationDuration: '0.5s',
                        animationFillMode: 'both',
                        animationDelay: `${0.1 * index}s`
                      }}
                    >
                      <div className="flex items-center space-x-4">
                        <div className="flex-shrink-0">
                          <Icon size={20} className="text-blue-600" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className={`text-sm font-medium ${textPrimary} truncate`}>
                            {document.name}
                          </p>
                          <div className="flex items-center mt-1 space-x-4">
                            <span className={`text-xs ${textMuted}`}>
                              {t('uploaded_by')}: {document.uploadedBy}
                            </span>
                            <span className={`text-xs ${textMuted}`}>
                              {t('size')}: {document.size}
                            </span>
                            <span className={`text-xs ${textMuted}`}>
                              {format(new Date(document.uploadedAt), 'dd/MM/yyyy')}
                            </span>
                          </div>
                        </div>
                      </div>
                      
                      <div className="flex items-center space-x-3">
                        <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${statusColorClass}`}>
                          {t(document.status)}
                        </span>
                        <div className="flex items-center space-x-2">
                          <button className={`p-2 rounded-lg ${textMuted} hover:text-blue-600 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors`}>
                            <Eye size={16} />
                          </button>
                          <button className={`p-2 rounded-lg ${textMuted} hover:text-blue-600 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors`}>
                            <Download size={16} />
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
      )}

      {activeTab === 'activity' && (
        <div className="space-y-6">
          {/* Activity List */}
          <div className={`${bgSecondary} rounded-lg ${shadowClass} ${borderColor} border`}>
            <div className="p-6">
              <h3 className={`text-lg font-semibold ${textPrimary} mb-6`}>
                {t('activity_log')}
              </h3>
              
              <div className="space-y-4">
                {generateMockActivities().map((activity, index) => {
                  const Icon = getActivityIcon(activity.type);
                  const colorClass = getActivityColor(activity.type);
                  
                  return (
                    <div
                      key={activity.id}
                      className={`flex items-start space-x-4 p-4 rounded-lg ${isDark ? 'bg-gray-700/50' : 'bg-gray-50'} transition-all duration-300`}
                      style={{
                        animationName: 'fadeInScale',
                        animationDuration: '0.5s',
                        animationFillMode: 'both',
                        animationDelay: `${0.1 * index}s`
                      }}
                    >
                      <div className="flex-shrink-0 mt-1">
                        <div className={`w-8 h-8 rounded-full bg-white dark:bg-gray-800 flex items-center justify-center shadow-sm`}>
                          <Icon size={16} className={colorClass} />
                        </div>
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className={`text-sm font-medium ${textPrimary}`}>
                          {activity.description}
                        </p>
                        {activity.details && (
                          <p className={`text-sm ${textSecondary} mt-1`}>
                            {activity.details}
                          </p>
                        )}
                        <div className="flex items-center mt-2 space-x-2">
                          <span className={`text-xs ${textMuted}`}>
                            {format(new Date(activity.timestamp), 'dd/MM/yyyy à HH:mm')}
                          </span>
                          <span className={`text-xs ${textMuted}`}>•</span>
                          <span className={`text-xs ${textMuted}`}>
                            {t('by')} {activity.user}
                          </span>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
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