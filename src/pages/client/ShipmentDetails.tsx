import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { getMockShipmentById } from '../../services/shipmentService';
import { Shipment } from '../../types/shipment';
import Status from '../../components/common/Status';
import ShipmentTimeline from '../../components/shipments/ShipmentTimeline';
import ClaimButton from '../../components/common/ClaimButton';
import {
  ArrowLeft,
  FileText,
  MessageSquare,
  Hash,
  Plane,
  Ship,
  Package,
  Calendar,
  MapPin,
  RefreshCw,
  Download,
  Share2,
  Printer,
  Ruler
} from 'lucide-react';
import { format } from 'date-fns';
import { useLanguage } from '../../contexts/LanguageContext';
import { useTheme } from '../../contexts/ThemeContext';
import LoadingScreen from '../../components/common/LoadingScreen';
import ContactAgentButton from '../../components/common/ContactAgentButton';

// Définition des données mock pour l'agent en charge
const getMockAgentById = (id) => {
  const agents = {
      "agent1": {
        id: "agent1",
        name: "Moussa Diagne",
        email: "moussa.d@logistics.com",
        phone: "+221 77 111 22 33",
        photo: "https://as2.ftcdn.net/jpg/03/49/49/79/1000_F_349497933_Ly4im8BDmHLaLzgyKg2f2yZOvJjBtlw5.jpg",
        department: "Sea Freight",
        position: "Senior Logistics Coordinator",
        languages: ["English", "French", "Wolof"],
        location: "Dakar, Senegal",
        availability: "08:00 - 17:00 GMT"
      },
      "agent2": {
        id: "agent2",
        name: "Sophie Lefebvre",
        email: "sophie.l@logistics.com",
        phone: "+33 6 22 33 44 55",
        photo: "https://as2.ftcdn.net/jpg/03/49/49/79/1000_F_349497933_Ly4im8BDmHLaLzgyKg2f2yZOvJjBtlw5.jpg",
        department: "Air Freight",
        position: "Logistics Specialist",
        languages: ["English", "French"],
        location: "Paris, France",
        availability: "09:00 - 18:00 CET"
      }
    };

  return agents[id] || agents.agent1;
};

const ShipmentDetails = () => {
  const { id } = useParams<{ id: string }>();
  const [shipment, setShipment] = useState<Shipment | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const { t } = useLanguage();
  const { theme } = useTheme();
  const [activeTab, setActiveTab] = useState('timeline');
  const [agent, setAgent] = useState(null);

  const isDark = theme === 'dark';

  useEffect(() => {
    const fetchShipment = async () => {
      try {
        if (id) {
          const data = await getMockShipmentById(id);
          setShipment(data);

          // Récupérer les informations de l'agent en charge
          // Dans un cas réel, l'agent serait probablement lié au shipment
          const agentData = getMockAgentById("agent1");
          setAgent(agentData);
        }
      } catch (error) {
        console.error('Error fetching shipment:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchShipment();
  }, [id]);

  if (isLoading) {
    return <LoadingScreen />;
  }

  if (!shipment) {
    return (
      <div className={`shadow rounded-lg p-6 max-w-2xl mx-auto mt-8 ${
        isDark ? 'bg-gray-800' : 'bg-white'
      }`}>
        <div className="text-center">
          <Package size={48} className={`mx-auto mb-4 ${
            isDark ? 'text-gray-500' : 'text-gray-400'
          }`} />
          <h3 className={`text-xl font-medium mb-2 ${
            isDark ? 'text-white' : 'text-gray-900'
          }`}>Shipment not found</h3>
          <p className={`mb-6 ${
            isDark ? 'text-gray-400' : 'text-gray-500'
          }`}>
            The shipment you're looking for doesn't exist or you don't have access to view it.
          </p>
          <Link
            to="/"
            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
          >
            <ArrowLeft size={16} className="mr-2" />
            Go back to dashboard
          </Link>
        </div>
      </div>
    );
  }

  const ShipmentTypeIcon = shipment.type === 'air' ? Plane : Ship;
  const shipmentTypeLabel = shipment.type === 'air' ? t('air_shipment') : t('sea_shipment');

  const renderDetailItem = (icon, label, value) => (
    <div className={`flex items-start space-x-3 p-3 rounded-lg ${
      isDark ? 'bg-gray-700' : 'bg-gray-50'
    }`}>
      <div className="flex-shrink-0 mt-1">
        {icon}
      </div>
      <div>
        <p className={`text-xs font-medium ${
          isDark ? 'text-gray-400' : 'text-gray-500'
        }`}>{label}</p>
        <p className={`text-sm font-medium ${
          isDark ? 'text-white' : 'text-gray-900'
        }`}>{value}</p>
      </div>
    </div>
  );

  const renderTabContent = () => {
    switch(activeTab) {
      case 'timeline':
        return (
          <div className={`rounded-lg shadow overflow-hidden ${
            isDark ? 'bg-gray-800' : 'bg-white'
          }`}>
            <div className="p-4 sm:p-6">
              <ShipmentTimeline events={shipment.events} />
            </div>
          </div>
        );
      case 'documents':
        return (
          <div className={`rounded-lg shadow overflow-hidden ${
            isDark ? 'bg-gray-800' : 'bg-white'
          }`}>
            <div className={`px-4 py-5 sm:px-6 border-b ${
              isDark ? 'border-gray-700' : 'border-gray-200'
            }`}>
              <div className="flex justify-between items-center">
                <h3 className={`text-lg font-medium ${
                  isDark ? 'text-white' : 'text-gray-900'
                }`}>Documents</h3>
                {shipment.documents.length > 0 && (
                  <button className={`inline-flex items-center px-3 py-1 text-xs font-medium rounded-md transition-colors ${
                    isDark 
                      ? 'text-blue-300 bg-blue-900 hover:bg-blue-800' 
                      : 'text-blue-700 bg-blue-50 hover:bg-blue-100'
                  }`}>
                    <Download size={14} className="mr-1" />
                    {t('download_all')}
                  </button>
                )}
              </div>
            </div>
            {shipment.documents.length > 0 ? (
              <ul className={`divide-y ${
                isDark ? 'divide-gray-700' : 'divide-gray-200'
              }`}>
                {shipment.documents.map(doc => (
                  <li key={doc.id} className={`px-4 py-3 flex justify-between items-center transition-colors ${
                    isDark ? 'hover:bg-gray-700' : 'hover:bg-gray-50'
                  }`}>
                    <div className="flex items-center">
                      <div className={`flex-shrink-0 h-10 w-10 rounded-md flex items-center justify-center ${
                        isDark ? 'bg-blue-900' : 'bg-blue-50'
                      }`}>
                        <FileText size={20} className="text-blue-600" />
                      </div>
                      <div className="ml-3">
                        <p className={`text-sm font-medium ${
                          isDark ? 'text-white' : 'text-gray-900'
                        }`}>{doc.name}</p>
                        <p className={`text-xs ${
                          isDark ? 'text-gray-400' : 'text-gray-500'
                        }`}>Added on {format(new Date(), 'MMM d, yyyy')}</p>
                      </div>
                    </div>
                    <div className="flex space-x-2">
                      <button className={`p-1 rounded-full transition-colors ${
                        isDark 
                          ? 'hover:bg-gray-600 text-gray-400 hover:text-gray-200' 
                          : 'hover:bg-gray-100 text-gray-500 hover:text-gray-700'
                      }`}>
                        <Download size={16} />
                      </button>
                    </div>
                  </li>
                ))}
              </ul>
            ) : (
              <div className="px-4 py-12 text-center">
                <FileText size={40} className={`mx-auto mb-3 ${
                  isDark ? 'text-gray-600' : 'text-gray-300'
                }`} />
                <p className={`text-sm mb-4 ${
                  isDark ? 'text-gray-400' : 'text-gray-500'
                }`}>{t('no_documents_yet')}</p>
              </div>
            )}
          </div>
        );
      case 'details':
        return (
          <div className={`rounded-lg shadow overflow-hidden ${
            isDark ? 'bg-gray-800' : 'bg-white'
          }`}>
            <div className={`px-4 py-5 sm:px-6 border-b ${
              isDark ? 'border-gray-700' : 'border-gray-200'
            }`}>
              <h3 className={`text-lg font-medium ${
                isDark ? 'text-white' : 'text-gray-900'
              }`}>{t('shipment_details')}</h3>
            </div>
            <div className="p-4 sm:p-6">
              <h4 className={`font-medium mb-3 ${
                isDark ? 'text-white' : 'text-gray-900'
              }`}>{t('description')}</h4>
              <p className={`text-sm whitespace-pre-wrap mb-6 p-4 rounded-lg ${
                isDark 
                  ? 'text-gray-300 bg-gray-700' 
                  : 'text-gray-700 bg-gray-50'
              }`}>
                {shipment.description}
              </p>

              <h4 className={`font-medium mb-3 ${
                isDark ? 'text-white' : 'text-gray-900'
              }`}>{t('additional_information')}</h4>
              <dl className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
                <div className={`p-4 rounded-lg ${
                  isDark ? 'bg-gray-700' : 'bg-gray-50'
                }`}>
                  <dt className={`text-xs font-medium mb-1 ${
                    isDark ? 'text-gray-400' : 'text-gray-500'
                  }`}>{t('incoterms')}</dt>
                  <dd className={`text-sm font-medium ${
                    isDark ? 'text-white' : 'text-gray-900'
                  }`}>FOB</dd>
                </div>
                <div className={`p-4 rounded-lg ${
                  isDark ? 'bg-gray-700' : 'bg-gray-50'
                }`}>
                  <dt className={`text-xs font-medium mb-1 ${
                    isDark ? 'text-gray-400' : 'text-gray-500'
                  }`}>{t('containers')}</dt>
                  <dd className={`text-sm font-medium ${
                    isDark ? 'text-white' : 'text-gray-900'
                  }`}>2 x 40' HC</dd>
                </div>
                <div className={`p-4 rounded-lg ${
                  isDark ? 'bg-gray-700' : 'bg-gray-50'
                }`}>
                  <dt className={`text-xs font-medium mb-1 ${
                    isDark ? 'text-gray-400' : 'text-gray-500'
                  }`}>{t('insurance')}</dt>
                  <dd className={`text-sm font-medium ${
                    isDark ? 'text-white' : 'text-gray-900'
                  }`}>Yes - Full Value</dd>
                </div>
                <div className={`p-4 rounded-lg ${
                  isDark ? 'bg-gray-700' : 'bg-gray-50'
                }`}>
                  <dt className={`text-xs font-medium mb-1 ${
                    isDark ? 'text-gray-400' : 'text-gray-500'
                  }`}>{t('customs_status')}</dt>
                  <dd className={`text-sm font-medium ${
                    isDark ? 'text-white' : 'text-gray-900'
                  }`}>Cleared</dd>
                </div>
              </dl>

              <h4 className={`font-medium mb-3 ${
                isDark ? 'text-white' : 'text-gray-900'
              }`}>{t('parties')}</h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className={`p-4 rounded-lg ${
                  isDark ? 'bg-gray-700' : 'bg-gray-50'
                }`}>
                  <p className={`text-xs font-medium mb-1 ${
                    isDark ? 'text-gray-400' : 'text-gray-500'
                  }`}>{t('shipper')}</p>
                  <p className={`text-sm font-medium ${
                    isDark ? 'text-white' : 'text-gray-900'
                  }`}>GlobalTrade Inc.</p>
                  <p className={`text-xs mt-1 ${
                    isDark ? 'text-gray-400' : 'text-gray-500'
                  }`}>New York, USA</p>
                </div>
                <div className={`p-4 rounded-lg ${
                  isDark ? 'bg-gray-700' : 'bg-gray-50'
                }`}>
                  <p className={`text-xs font-medium mb-1 ${
                    isDark ? 'text-gray-400' : 'text-gray-500'
                  }`}>{t('consignee')}</p>
                  <p className={`text-sm font-medium ${
                    isDark ? 'text-white' : 'text-gray-900'
                  }`}>EuroDistribution GmbH</p>
                  <p className={`text-xs mt-1 ${
                    isDark ? 'text-gray-400' : 'text-gray-500'
                  }`}>Hamburg, Germany</p>
                </div>
              </div>
            </div>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
      {/* Header with Back Button and Key Info */}
      <div className={`w-full py-3 mb-6 shadow-sm ${
        isDark ? 'bg-gray-800' : 'bg-gray-50'
      }`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-wrap items-center justify-between">
          <div className="flex items-center mb-2 sm:mb-0">
            <Link to="/" className="mr-4 inline-flex items-center text-sm text-blue-600 hover:text-blue-800 transition-colors">
              <ArrowLeft size={16} className="mr-1" /> {t('back')}
            </Link>
            <div className="flex items-center">
              <ShipmentTypeIcon size={18} className="text-blue-600 mr-2" />
              <span className={`text-sm font-medium mr-2 ${
                isDark ? 'text-white' : 'text-gray-900'
              }`}>{shipment.reference}</span>
              <Status status={shipment.status} size="sm" />
            </div>
          </div>
        </div>
      </div>

      {/* Main Info Card */}
      <div className={`shadow rounded-lg overflow-hidden mb-6 ${
        isDark ? 'bg-gray-800' : 'bg-white'
      }`}>
        <div className="relative">
          <div className="absolute top-0 left-0 w-full h-5 bg-blue-600"></div>
          <div className="relative px-4 sm:px-6 pt-12 pb-6">
            <div className="flex flex-wrap items-baseline mb-4">
              <h1 className={`text-2xl font-bold mr-3 ${
                isDark ? 'text-white' : 'text-gray-900'
              }`}>
                {`${shipment.origin} → ${shipment.destination}`}
              </h1>
              <div className="flex items-center text-sm text-blue-600">
                <ShipmentTypeIcon size={16} className="mr-1" />
                {shipmentTypeLabel}
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-7 gap-4 mb-6">
              {renderDetailItem(
                <Hash size={16} className="text-blue-600" />,
                t('tracking_number'),
                <span className="font-mono">{shipment.id}</span>
              )}
              {renderDetailItem(
                <Calendar size={16} className="text-blue-600" />,
                t('estimatedDelivery'),
                shipment.estimatedDelivery ?
                  format(new Date(shipment.estimatedDelivery), 'MMMM d, yyyy') :
                  'Pending'
              )}
              {renderDetailItem(
                <MapPin size={16} className="text-blue-600" />,
                t('origin'),
                shipment.origin
              )}
              {renderDetailItem(
                <MapPin size={16} className="text-blue-600" />,
                t('destination'),
                shipment.destination
              )}
              {renderDetailItem(
                <Package size={16} className="text-blue-600" />,
                t('weight'),
                `${shipment.weight.toLocaleString()} kg`
              )}
              {renderDetailItem(
                <Package size={16} className="text-blue-600" />,
                t('volume'),
                `${shipment.volume.toLocaleString()} m³`
              )}
              {renderDetailItem(
                <Ruler size={16} className="text-blue-600" />,
                t('dimensions'),
                `${shipment.dimensions?.length || 120} × ${shipment.dimensions?.width || 80} × ${shipment.dimensions?.height || 90} cm`
              )}
            </div>

            <p className={`text-xs ${
              isDark ? 'text-gray-400' : 'text-gray-500'
            }`}>
              {t('created_at')} {format(new Date(shipment.createdAt), 'MMMM d, yyyy')}
            </p>
          </div>
        </div>
      </div>

      {/* Tabs Navigation */}
      <div className={`mb-6 border-b ${
        isDark ? 'border-gray-700' : 'border-gray-200'
      }`}>
        <nav className="-mb-px flex space-x-4 sm:space-x-6 overflow-x-auto scrollbar-hide">
          <button
            onClick={() => setActiveTab('timeline')}
            className={`whitespace-nowrap py-3 sm:py-4 px-1 border-b-2 font-medium text-xs sm:text-sm transition-colors ${
              activeTab === 'timeline'
                ? 'border-blue-600 text-blue-600'
                : `border-transparent ${
                    isDark 
                      ? 'text-gray-400 hover:text-gray-200 hover:border-gray-600' 
                      : 'text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`
            }`}
          >
            {t('shipment_timeLine')}
          </button>
          <button
            onClick={() => setActiveTab('documents')}
            className={`whitespace-nowrap py-3 sm:py-4 px-1 border-b-2 font-medium text-xs sm:text-sm transition-colors ${
              activeTab === 'documents'
                ? 'border-blue-600 text-blue-600'
                : `border-transparent ${
                    isDark 
                      ? 'text-gray-400 hover:text-gray-200 hover:border-gray-600' 
                      : 'text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`
            }`}
          >
            {t('documents')}
          </button>
          <button
            onClick={() => setActiveTab('details')}
            className={`whitespace-nowrap py-3 sm:py-4 px-1 border-b-2 font-medium text-xs sm:text-sm transition-colors ${
              activeTab === 'details'
                ? 'border-blue-600 text-blue-600'
                : `border-transparent ${
                    isDark 
                      ? 'text-gray-400 hover:text-gray-200 hover:border-gray-600' 
                      : 'text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`
            }`}
          >
            {t('details')}
          </button>
        </nav>
      </div>

      {/* Tab Content */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        <div className="lg:col-span-3">
          {renderTabContent()}
        </div>

        {/* Quick Actions Sidebar */}
        <div className="space-y-6">
          <div className={`rounded-lg shadow overflow-hidden ${
            isDark ? 'bg-gray-800' : 'bg-white'
          }`}>
            <div className={`px-4 py-5 sm:px-6 border-b ${
              isDark ? 'border-gray-700' : 'border-gray-200'
            }`}>
              <h3 className={`text-lg font-medium ${
                isDark ? 'text-white' : 'text-gray-900'
              }`}>
                {t('quick_actions')}
              </h3>
            </div>
            <div className="p-4">
              <div className="space-y-3">
                {/* Remplacé le bouton par notre composant ContactAgentButton */}
                <ContactAgentButton
                  shipmentId={shipment.reference}
                  agentId="agent1"
                  variant="primary"
                />
                <ClaimButton
                  shipmentId={shipment.reference}
                  variant="primary"
                />
              </div>
            </div>
          </div>

          <div className={`rounded-lg shadow overflow-hidden ${
            isDark ? 'bg-gray-800' : 'bg-white'
          }`}>
            <div className={`px-4 py-5 sm:px-6 border-b ${
              isDark ? 'border-gray-700' : 'border-gray-200'
            }`}>
              <h3 className={`text-md font-medium ${
                isDark ? 'text-white' : 'text-gray-900'
              }`}>
                {t('contact_information')}
              </h3>
            </div>
            <div className="p-4">
              <div className="space-y-4">
                {agent && (
                  <div className="flex items-start space-x-3">
                    <div className="flex-shrink-0">
                      <img
                        src={agent.photo}
                        alt={agent.name}
                        className="h-10 w-10 rounded-full"
                      />
                    </div>
                    <div>
                      <p className={`text-sm font-medium ${
                        isDark ? 'text-white' : 'text-gray-900'
                      }`}>{agent.name}</p>
                      <p className={`text-xs ${
                        isDark ? 'text-gray-400' : 'text-gray-500'
                      }`}>{agent.position}</p>
                      <p className={`text-xs ${
                        isDark ? 'text-gray-400' : 'text-gray-500'
                      }`}>{agent.email}</p>
                      <p className={`text-xs ${
                        isDark ? 'text-gray-400' : 'text-gray-500'
                      }`}>{agent.phone}</p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ShipmentDetails;