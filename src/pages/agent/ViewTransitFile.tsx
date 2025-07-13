import React from 'react';
import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { useTheme } from '../../contexts/ThemeContext';
import { useLanguage } from '../../contexts/LanguageContext';
import { Client } from '../../types/client';
import { Container } from '../../types/container';
import LoadingScreen from '../../components/common/LoadingScreen';
import {
  ArrowLeft,
  FileText,
  Users,
  MapPin,
  Package,
  Ship,
  Plane,
  Building,
  AlertCircle,
  User,
  Calendar,
  CheckCircle,
  Eye,
  Info,
  Clock,
  Edit3,
  Weight,
  Box,
  Truck
} from 'lucide-react';
import { format } from 'date-fns';
import backImage from '../../utils/backGround_hearder.png';

interface TransitFile {
  id: string;
  blNumber: string;
  reference: string;
  clientIds: string[];
  origin: string;
  destination: string;
  transportType: 'air' | 'sea';
  shipmentType: 'import' | 'export';
  productType: 'standard' | 'dangerous' | 'fragile';
  capacity: string;
  contentDescription: string;
  containers: Container[];
  documents: {
    invoice?: { file: File; clientVisible: boolean };
    packingList?: { file: File; clientVisible: boolean };
    otherDocuments?: { file: File; clientVisible: boolean }[];
  };
  events: TransitEvent[];
}

interface TransitEvent {
  id: string;
  name: string;
  date: string;
  agentId: string;
  agentName: string;
  details?: string;
  completed: boolean;
}

const ViewTransitFilePage = () => {
  const { id } = useParams<{ id: string }>();
  const { user } = useAuth();
  const { theme } = useTheme();
  const { t } = useLanguage();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(true);
  const [transitFile, setTransitFile] = useState<TransitFile | null>(null);
  const [clients, setClients] = useState<Client[]>([]);

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
    // Simuler le chargement des données
    const fetchData = async () => {
      try {
        // TODO: Remplacer par l'appel API réel
        await new Promise(resolve => setTimeout(resolve, 1000));
        // Données simulées
        const mockTransitFile: TransitFile = {
          id: id || '',
          blNumber: 'BL123456',
          reference: 'TF-2024-123456',
          clientIds: ['client1', 'client2'],
          origin: 'Paris, France',
          destination: 'New York, USA',
          transportType: 'sea',
          shipmentType: 'export',
          productType: 'standard',
          capacity: '20 tonnes',
          contentDescription: 'Electronics and accessories',
          containers: [
            {
              id: 'cont1',
              containerNumber: 'CONT123456',
              containerType: 'dry',
              size: 'ft20',
              weight: 15000,
              volume: 33
            },
            {
              id: 'cont2',
              containerNumber: 'CONT789012',
              containerType: 'dry',
              size: 'ft_hc40',
              weight: 25000,
              volume: 76
            },
            {
              id: 'cont3',
              containerNumber: 'CONT345678',
              containerType: 'refrigerated',
              size: 'ft20',
              weight: 18000,
              volume: 28
            }
          ],
          documents: {
            invoice: {
              file: 'https://example.com/documents/invoice-123.pdf',
              clientVisible: true
            },
            packingList: {
              file: 'https://example.com/documents/packing-list-123.pdf',
              clientVisible: true
            },
            otherDocuments: [
              {
                file: 'https://example.com/documents/certificate-of-origin.pdf',
                clientVisible: false
              },
              {
                file: 'https://example.com/documents/insurance-certificate.pdf',
                clientVisible: true
              }
            ]
          },
          events: [
            {
              id: 'event1',
              name: t('export_pregate'),
              date: '2024-01-15',
              agentId: 'agent1',
              agentName: 'John Doe',
              details: 'Completed on time',
              completed: true
            },
            {
              id: 'event2',
              name: t('warehouse_reception'),
              date: '2024-01-16',
              agentId: 'agent2',
              agentName: 'Jane Smith',
              details: 'All items received',
              completed: true
            }
          ]
        };
        setTransitFile(mockTransitFile);
      } catch (error) {
        console.error('Error fetching transit file:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [id, t]);

  if (isLoading || !transitFile) {
    return <LoadingScreen />;
  }

  const getClientName = (clientId: string) => {
    const client = clients.find(c => c.id === clientId);
    return client ? client.name : t('unknown_client');
  };

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
      {/* Header Section */}
      <div
        className={`mb-8 rounded-xl p-6 ${shadowClass} transform transition-all duration-500 ${hoverShadow}`}
        style={{
          backgroundImage: isDark
            ? `linear-gradient(to right, rgba(17, 24, 39, 0.85), rgba(31, 41, 55, 0.85)), url(${backImage})`
            : `linear-gradient(to right, rgba(239, 246, 255, 0.85), rgba(224, 231, 255, 0.85)), url(${backImage})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat'
        }}
      >
        <div className="flex items-center justify-between">
          <div>
            <button
              onClick={() => navigate(-1)}
              className={`inline-flex items-center ${textSecondary} hover:${textPrimary} transition-colors mb-4`}
            >
              <ArrowLeft size={18} className="mr-2" />
              {t('back')}
            </button>
            <h1 className={`text-2xl md:text-3xl font-bold ${textPrimary} mb-2`}>
              {t('transit_file_details')}
            </h1>
            <p className={`${textSecondary} text-lg`}>
              {t('reference')}: {transitFile.reference}
            </p>
          </div>
        </div>
      </div>

      {/* General Information */}
      <div className={`${bgSecondary} rounded-lg ${shadowClass} p-6 mb-8 border ${borderColor}`}>
        <h2 className={`text-xl font-semibold ${textPrimary} mb-6 flex items-center`}>
          <Info size={20} className="mr-2 text-blue-600" />
          {t('general_information')}
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className={`block text-sm font-medium ${textSecondary} mb-2`}>
              {t('bl_number')}
            </label>
            <div className={`px-3 py-2.5 rounded-lg ${bgPrimary} ${textPrimary} border ${borderColor}`}>
              {transitFile.blNumber}
            </div>
          </div>

          <div>
            <label className={`block text-sm font-medium ${textSecondary} mb-2`}>
              {t('transport_type')}
            </label>
            <div className={`px-3 py-2.5 rounded-lg ${bgPrimary} ${textPrimary} border ${borderColor} flex items-center`}>
              {transitFile.transportType === 'sea' ? (
                <><Ship size={18} className="mr-2" /> {t('maritime')}</>
              ) : (
                <><Plane size={18} className="mr-2" /> {t('aerial')}</>
              )}
            </div>
          </div>

          <div>
            <label className={`block text-sm font-medium ${textSecondary} mb-2`}>
              {t('shipment_type')}
            </label>
            <div className={`px-3 py-2.5 rounded-lg ${bgPrimary} ${textPrimary} border ${borderColor}`}>
              {t(transitFile.shipmentType)}
            </div>
          </div>

          <div>
            <label className={`block text-sm font-medium ${textSecondary} mb-2`}>
              {t('product_type')}
            </label>
            <div className={`px-3 py-2.5 rounded-lg ${bgPrimary} ${textPrimary} border ${borderColor} flex items-center`}>
              <Package size={18} className="mr-2" />
              {t(transitFile.productType)}
            </div>
          </div>

          <div className="md:col-span-2">
            <label className={`block text-sm font-medium ${textSecondary} mb-2`}>
              {t('content_description')}
            </label>
            <div className={`px-3 py-2.5 rounded-lg ${bgPrimary} ${textPrimary} border ${borderColor}`}>
              {transitFile.contentDescription}
            </div>
          </div>
        </div>
      </div>

      {/* Clients and Route */}
      <div className={`${bgSecondary} rounded-lg ${shadowClass} p-6 mb-8 border ${borderColor}`}>
        <h2 className={`text-xl font-semibold ${textPrimary} mb-6 flex items-center`}>
          <Users size={20} className="mr-2 text-blue-600" />
          {t('clients_and_route')}
        </h2>

        <div className="space-y-6">
          {/* Clients */}
          <div>
            <label className={`block text-sm font-medium ${textSecondary} mb-2`}>
              {t('clients')}
            </label>
            <div className="flex flex-wrap gap-2">
              {transitFile.clientIds.map((clientId) => (
                <span
                  key={clientId}
                  className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300"
                >
                  {getClientName(clientId)}
                </span>
              ))}
            </div>
          </div>

          {/* Route */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className={`block text-sm font-medium ${textSecondary} mb-2`}>
                {t('origin')}
              </label>
              <div className={`px-3 py-2.5 rounded-lg ${bgPrimary} ${textPrimary} border ${borderColor}`}>
                {transitFile.origin}
              </div>
            </div>

            <div>
              <label className={`block text-sm font-medium ${textSecondary} mb-2`}>
                {t('destination')}
              </label>
              <div className={`px-3 py-2.5 rounded-lg ${bgPrimary} ${textPrimary} border ${borderColor}`}>
                {transitFile.destination}
              </div>
            </div>

            <div className="md:col-span-2">
              <label className={`block text-sm font-medium ${textSecondary} mb-2`}>
                {t('capacity')}
              </label>
              <div className={`px-3 py-2.5 rounded-lg ${bgPrimary} ${textPrimary} border ${borderColor}`}>
                {transitFile.capacity}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Documents Section */}
      <div className={`${bgSecondary} rounded-lg ${shadowClass} p-6 mb-8 border ${borderColor}`}>
        <h2 className={`text-xl font-semibold ${textPrimary} mb-6 flex items-center`}>
          <FileText size={20} className="mr-2 text-blue-600" />
          {t('file_documents')}
        </h2>

        <div className="space-y-4">
          {/* Invoice */}
          <div className={`p-4 rounded-lg border ${borderColor} ${bgPrimary} hover:shadow-lg transition-shadow duration-200`}>
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center space-x-2">
                <FileText size={18} className="text-blue-600" />
                <span className={`font-medium ${textPrimary}`}>{t('invoice')}</span>
                {transitFile.documents.invoice?.clientVisible && (
                  <span className="px-2 py-0.5 text-xs rounded-full bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300">
                    {t('visible_to_client')}
                  </span>
                )}
              </div>
              {transitFile.documents.invoice ? (
                <button
                  className="inline-flex items-center px-3 py-1.5 rounded-lg text-sm font-medium bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300 hover:bg-blue-200 dark:hover:bg-blue-900/50 transition-colors"
                  onClick={() => window.open(transitFile.documents.invoice?.file as string)}
                >
                  <Eye size={14} className="mr-1.5" />
                  {t('view_document')}
                </button>
              ) : (
                <span className={`text-sm ${textMuted} italic`}>{t('no_document')}</span>
              )}
            </div>
            {transitFile.documents.invoice && (
              <div className={`text-sm ${textMuted} flex items-center`}>
                <Calendar size={14} className="mr-1.5" />
                {t('uploaded_on')} {format(new Date(), 'dd/MM/yyyy')}
              </div>
            )}
          </div>

          {/* Packing List */}
          <div className={`p-4 rounded-lg border ${borderColor} ${bgPrimary} hover:shadow-lg transition-shadow duration-200`}>
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center space-x-2">
                <FileText size={18} className="text-blue-600" />
                <span className={`font-medium ${textPrimary}`}>{t('packing_list')}</span>
                {transitFile.documents.packingList?.clientVisible && (
                  <span className="px-2 py-0.5 text-xs rounded-full bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300">
                    {t('visible_to_client')}
                  </span>
                )}
              </div>
              {transitFile.documents.packingList ? (
                <button
                  className="inline-flex items-center px-3 py-1.5 rounded-lg text-sm font-medium bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300 hover:bg-blue-200 dark:hover:bg-blue-900/50 transition-colors"
                  onClick={() => window.open(transitFile.documents.packingList?.file as string)}
                >
                  <Eye size={14} className="mr-1.5" />
                  {t('view_document')}
                </button>
              ) : (
                <span className={`text-sm ${textMuted} italic`}>{t('no_document')}</span>
              )}
            </div>
            {transitFile.documents.packingList && (
              <div className={`text-sm ${textMuted} flex items-center`}>
                <Calendar size={14} className="mr-1.5" />
                {t('uploaded_on')} {format(new Date(), 'dd/MM/yyyy')}
              </div>
            )}
          </div>

          {/* Other Documents */}
          {transitFile.documents.otherDocuments?.map((doc, index) => (
            <div key={index} className={`p-4 rounded-lg border ${borderColor} ${bgPrimary} hover:shadow-lg transition-shadow duration-200`}>
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center space-x-2">
                  <FileText size={18} className="text-blue-600" />
                  <span className={`font-medium ${textPrimary}`}>{t('other_document')} {index + 1}</span>
                  {doc.clientVisible && (
                    <span className="px-2 py-0.5 text-xs rounded-full bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300">
                      {t('visible_to_client')}
                    </span>
                  )}
                </div>
                <button
                  className="inline-flex items-center px-3 py-1.5 rounded-lg text-sm font-medium bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300 hover:bg-blue-200 dark:hover:bg-blue-900/50 transition-colors"
                  onClick={() => window.open(doc.file as string)}
                >
                  <Eye size={14} className="mr-1.5" />
                  {t('view_document')}
                </button>
              </div>
              <div className={`text-sm ${textMuted} flex items-center`}>
                <Calendar size={14} className="mr-1.5" />
                {t('uploaded_on')} {format(new Date(), 'dd/MM/yyyy')}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Containers Section */}
      <div className={`${bgSecondary} rounded-lg ${shadowClass} p-6 mb-8 border ${borderColor}`}>
        <h2 className={`text-xl font-semibold ${textPrimary} mb-6 flex items-center`}>
          <Package size={20} className="mr-2 text-blue-600" />
          {t('containers')}
        </h2>

        {transitFile.containers.length > 0 ? (
          <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-4">
            {transitFile.containers.map((container, index) => {
              const getContainerTypeIcon = (type: string) => {
                switch (type) {
                  case 'refrigerated':
                    return '❄️';
                  case 'open_top':
                    return '📦';
                  case 'flat_rack':
                    return '🚛';
                  case 'tank':
                    return '🛢️';
                  default:
                    return '📦';
                }
              };

              return (
                <div
                  key={container.id}
                  className={`p-4 rounded-xl border ${borderColor} ${bgPrimary} hover:shadow-lg transition-shadow duration-200`}
                >
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <span className="text-xl">{getContainerTypeIcon(container.containerType)}</span>
                        <span className={`font-medium ${textPrimary}`}>{container.containerNumber}</span>
                      </div>
                      <span className={`text-sm font-medium px-2 py-1 rounded-full ${container.containerType === 'refrigerated' ? 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300' : 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300'}`}>
                        {t(container.size)}
                      </span>
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      <div className={`p-2 rounded-lg bg-gray-50 dark:bg-gray-800/50 ${borderColor}`}>
                        <div className="flex items-center space-x-2">
                          <Weight size={16} className="text-gray-400" />
                          <span className={`text-sm ${textMuted}`}>{t('weight')}</span>
                        </div>
                        <span className={`block mt-1 font-medium ${textPrimary}`}>
                          {container.weight} kg
                        </span>
                      </div>

                      <div className={`p-2 rounded-lg bg-gray-50 dark:bg-gray-800/50 ${borderColor}`}>
                        <div className="flex items-center space-x-2">
                          <Box size={16} className="text-gray-400" />
                          <span className={`text-sm ${textMuted}`}>{t('volume')}</span>
                        </div>
                        <span className={`block mt-1 font-medium ${textPrimary}`}>
                          {container.volume} m³
                        </span>
                      </div>
                    </div>

                    <div className={`p-2 rounded-lg bg-gray-50 dark:bg-gray-800/50 ${borderColor}`}>
                      <div className="flex items-center space-x-2">
                        <Truck size={16} className="text-gray-400" />
                        <span className={`text-sm ${textMuted}`}>{t('type')}</span>
                      </div>
                      <span className={`block mt-1 font-medium ${textPrimary}`}>
                        {t(container.containerType + '_container')}
                      </span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className={`text-center py-8 ${textMuted}`}>
            <Package size={40} className="mx-auto mb-3 opacity-50" />
            <p>{t('no_containers')}</p>
          </div>
        )}
      </div>

            {/* Events Timeline */}
      <div className={`${bgSecondary} rounded-lg ${shadowClass} p-6 mb-8 border ${borderColor}`}>
        <h2 className={`text-xl font-semibold ${textPrimary} mb-6 flex items-center`}>
          <Clock size={20} className="mr-2 text-blue-600" />
          {t('events')}
        </h2>

        <div className="space-y-4">
          {transitFile.events.map((event, index) => (
            <div
              key={event.id}
              className={`p-4 rounded-lg border ${borderColor} ${event.completed ? 'bg-green-50 dark:bg-green-900/20' : bgPrimary}`}
            >
              <div className="flex items-start justify-between mb-3">
                <div>
                  <h3 className={`font-medium ${textPrimary} text-lg mb-1`}>{event.name}</h3>
                  <div className="flex items-center text-sm text-gray-500">
                    <User size={14} className="mr-1" />
                    {event.agentName}
                  </div>
                </div>
                <div className={`flex items-center ${event.completed ? 'text-green-600 dark:text-green-400' : textMuted}`}>
                  {event.completed ? <CheckCircle size={20} /> : <Clock size={20} />}
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className={`block text-xs font-medium ${textMuted} mb-1`}>
                    <Calendar size={12} className="inline mr-1" />
                    {t('date')}
                  </label>
                  <div className={`text-sm ${textPrimary}`}>
                    {format(new Date(event.date), 'dd/MM/yyyy')}
                  </div>
                </div>

                {event.details && (
                  <div>
                    <label className={`block text-xs font-medium ${textMuted} mb-1`}>
                      <Edit3 size={12} className="inline mr-1" />
                      {t('details')}
                    </label>
                    <div className={`text-sm ${textPrimary}`}>{event.details}</div>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>

        {/* Progress Summary */}
        <div className="mt-6 p-4 bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20 rounded-xl border border-blue-200 dark:border-blue-700">
          <div className="flex items-center justify-between mb-3">
            <h4 className={`font-semibold ${textPrimary} text-sm`}>
              {t('eventProgression')}
            </h4>
            <span className={`text-sm ${textMuted}`}>
              {transitFile.events.filter(e => e.completed).length} / {transitFile.events.length} {t('completed')}
            </span>
          </div>

          <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2 overflow-hidden">
            <div
              className="bg-gradient-to-r from-blue-500 via-green-500 to-purple-500 h-2 rounded-full transition-all duration-700 ease-out"
              style={{
                width: `${(transitFile.events.filter(e => e.completed).length / transitFile.events.length) * 100}%`
              }}
            />
          </div>

          <div className="mt-2 text-xs text-gray-600 dark:text-gray-400">
            {Math.round((transitFile.events.filter(e => e.completed).length / transitFile.events.length) * 100)}% {t('completedEvents')}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ViewTransitFilePage;