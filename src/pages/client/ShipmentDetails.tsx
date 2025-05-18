import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { getMockShipmentById } from '../../services/shipmentService';
import { Shipment } from '../../types/shipment';
import Status from '../../components/common/Status';
import ShipmentTimeline from '../../components/shipments/ShipmentTimeline';
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
  Printer
} from 'lucide-react';
import { format } from 'date-fns';
import { useLanguage } from '../../contexts/LanguageContext';
import LoadingScreen from '../../components/common/LoadingScreen';

const ShipmentDetails = () => {
  const { id } = useParams<{ id: string }>();
  const [shipment, setShipment] = useState<Shipment | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const { t } = useLanguage();
  const [activeTab, setActiveTab] = useState('timeline');

  useEffect(() => {
    const fetchShipment = async () => {
      try {
        if (id) {
          const data = await getMockShipmentById(id);
          setShipment(data);
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
      <div className="bg-white shadow rounded-lg p-6 max-w-2xl mx-auto mt-8">
        <div className="text-center">
          <Package size={48} className="mx-auto text-gray-400 mb-4" />
          <h3 className="text-xl font-medium text-gray-900 mb-2">Shipment not found</h3>
          <p className="text-gray-500 mb-6">
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
    <div className="flex items-start space-x-3 p-3 bg-gray-50 rounded-lg">
      <div className="flex-shrink-0 mt-1">
        {icon}
      </div>
      <div>
        <p className="text-xs font-medium text-gray-500">{label}</p>
        <p className="text-sm font-medium text-gray-900">{value}</p>
      </div>
    </div>
  );

  const renderTabContent = () => {
    switch(activeTab) {
      case 'timeline':
        return (
          <div className="bg-white rounded-lg shadow overflow-hidden">
            <div className="p-4 sm:p-6">
              <ShipmentTimeline events={shipment.events} />
            </div>
          </div>
        );
      case 'documents':
        return (
          <div className="bg-white rounded-lg shadow overflow-hidden">
            <div className="px-4 py-5 sm:px-6 border-b border-gray-200">
              <div className="flex justify-between items-center">
                <h3 className="text-lg font-medium text-gray-900">Documents</h3>
                {shipment.documents.length > 0 && (
                  <button className="inline-flex items-center px-3 py-1 text-xs font-medium rounded-md text-blue-700 bg-blue-50 hover:bg-blue-100 transition-colors">
                    <Download size={14} className="mr-1" />
                    {t('download_all')}
                  </button>
                )}
              </div>
            </div>
            {shipment.documents.length > 0 ? (
              <ul className="divide-y divide-gray-200">
                {shipment.documents.map(doc => (
                  <li key={doc.id} className="px-4 py-3 flex justify-between items-center hover:bg-gray-50 transition-colors">
                    <div className="flex items-center">
                      <div className="flex-shrink-0 h-10 w-10 rounded-md bg-blue-50 flex items-center justify-center">
                        <FileText size={20} className="text-blue-600" />
                      </div>
                      <div className="ml-3">
                        <p className="text-sm font-medium text-gray-900">{doc.name}</p>
                        <p className="text-xs text-gray-500">Added on {format(new Date(), 'MMM d, yyyy')}</p>
                      </div>
                    </div>
                    <div className="flex space-x-2">
                      <button className="p-1 rounded-full hover:bg-gray-100 text-gray-500 hover:text-gray-700 transition-colors">
                        <Share2 size={16} />
                      </button>
                      <button className="p-1 rounded-full hover:bg-gray-100 text-gray-500 hover:text-gray-700 transition-colors">
                        <Download size={16} />
                      </button>
                    </div>
                  </li>
                ))}
              </ul>
            ) : (
              <div className="px-4 py-12 text-center">
                <FileText size={40} className="mx-auto text-gray-300 mb-3" />
                <p className="text-sm text-gray-500 mb-4">{t('no_documents_yet')}</p>
              </div>
            )}
          </div>
        );
      case 'details':
        return (
          <div className="bg-white rounded-lg shadow overflow-hidden">
            <div className="px-4 py-5 sm:px-6 border-b border-gray-200">
              <h3 className="text-lg font-medium text-gray-900">{t('shipment_details')}</h3>
            </div>
            <div className="p-4 sm:p-6">
              <h4 className="font-medium text-gray-900 mb-3">{t('description')}</h4>
              <p className="text-sm text-gray-700 whitespace-pre-wrap mb-6 bg-gray-50 p-4 rounded-lg">
                {shipment.description}
              </p>

              <h4 className="font-medium text-gray-900 mb-3">{t('additional_information')}</h4>
              <dl className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
                <div className="bg-gray-50 p-4 rounded-lg">
                  <dt className="text-xs font-medium text-gray-500 mb-1">{t('incoterms')}</dt>
                  <dd className="text-sm font-medium text-gray-900">FOB</dd>
                </div>
                <div className="bg-gray-50 p-4 rounded-lg">
                  <dt className="text-xs font-medium text-gray-500 mb-1">{t('containers')}</dt>
                  <dd className="text-sm font-medium text-gray-900">2 x 40' HC</dd>
                </div>
                <div className="bg-gray-50 p-4 rounded-lg">
                  <dt className="text-xs font-medium text-gray-500 mb-1">{t('insurance')}</dt>
                  <dd className="text-sm font-medium text-gray-900">Yes - Full Value</dd>
                </div>
                <div className="bg-gray-50 p-4 rounded-lg">
                  <dt className="text-xs font-medium text-gray-500 mb-1">{t('customs_status')}</dt>
                  <dd className="text-sm font-medium text-gray-900">Cleared</dd>
                </div>
              </dl>

              <h4 className="font-medium text-gray-900 mb-3">{t('parties')}</h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="bg-gray-50 p-4 rounded-lg">
                  <p className="text-xs font-medium text-gray-500 mb-1">{t('shipper')}</p>
                  <p className="text-sm font-medium text-gray-900">GlobalTrade Inc.</p>
                  <p className="text-xs text-gray-500 mt-1">New York, USA</p>
                </div>
                <div className="bg-gray-50 p-4 rounded-lg">
                  <p className="text-xs font-medium text-gray-500 mb-1">{t('consignee')}</p>
                  <p className="text-sm font-medium text-gray-900">EuroDistribution GmbH</p>
                  <p className="text-xs text-gray-500 mt-1">Hamburg, Germany</p>
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
      <div className="bg-gray-50 w-full py-3 mb-6 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-wrap items-center justify-between">
          <div className="flex items-center mb-2 sm:mb-0">
            <Link to="/" className="mr-4 inline-flex items-center text-sm text-blue-600 hover:text-blue-800 transition-colors">
              <ArrowLeft size={16} className="mr-1" /> {t('back')}
            </Link>
            <div className="flex items-center">
              <ShipmentTypeIcon size={18} className="text-blue-600 mr-2" />
              <span className="text-sm font-medium text-gray-900 mr-2">{shipment.reference}</span>
              <Status status={shipment.status} size="sm" />
            </div>
          </div>
        </div>
      </div>

      {/* Main Info Card */}
      <div className="bg-white shadow rounded-lg overflow-hidden mb-6">
        <div className="relative">
          <div className="absolute top-0 left-0 w-full h-5 bg-blue-600"></div>
          <div className="relative px-4 sm:px-6 pt-12 pb-6">
            <div className="flex flex-wrap items-baseline mb-4">
              <h1 className="text-2xl font-bold text-gray-900 mr-3">
                {`${shipment.origin} → ${shipment.destination}`}
              </h1>
              <div className="flex items-center text-sm text-blue-600">
                <ShipmentTypeIcon size={16} className="mr-1" />
                {shipmentTypeLabel}
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-6 gap-4 mb-6">
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
            </div>

            <p className="text-xs text-gray-500">
              {t('created_at')} {format(new Date(shipment.createdAt), 'MMMM d, yyyy')}
            </p>
          </div>
        </div>
      </div>

      {/* Tabs Navigation - AMÉLIORATION ICI */}
      <div className="mb-6 border-b border-gray-200">
        <nav className="-mb-px flex space-x-4 sm:space-x-6 overflow-x-auto scrollbar-hide">
          <button
            onClick={() => setActiveTab('timeline')}
            className={`whitespace-nowrap py-3 sm:py-4 px-1 border-b-2 font-medium text-xs sm:text-sm ${
              activeTab === 'timeline'
                ? 'border-blue-600 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            } transition-colors`}
          >
            {t('shipment_timeLine')}
          </button>
          <button
            onClick={() => setActiveTab('documents')}
            className={`whitespace-nowrap py-3 sm:py-4 px-1 border-b-2 font-medium text-xs sm:text-sm ${
              activeTab === 'documents'
                ? 'border-blue-600 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            } transition-colors`}
          >
            {t('documents')}
          </button>
          <button
            onClick={() => setActiveTab('details')}
            className={`whitespace-nowrap py-3 sm:py-4 px-1 border-b-2 font-medium text-xs sm:text-sm ${
              activeTab === 'details'
                ? 'border-blue-600 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            } transition-colors`}
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
          <div className="bg-white rounded-lg shadow overflow-hidden">
            <div className="px-4 py-5 sm:px-6 border-b border-gray-200">
              <h3 className="text-lg font-medium text-gray-900">
                {t('quick_actions')}
              </h3>
            </div>
            <div className="p-4">
              <div className="space-y-3">
                <button
                  type="button"
                  className="w-full inline-flex justify-center items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
                >
                  <MessageSquare size={16} className="mr-2" />
                  {t('contact_the_agent_in_charge')}
                </button>
                <button
                  type="button"
                  className="w-full inline-flex justify-center items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
                >
                  <MessageSquare size={16} className="mr-2" />
                  {t('claim')}
                </button>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow overflow-hidden">
            <div className="px-4 py-5 sm:px-6 border-b border-gray-200">
              <h3 className="text-md font-medium text-gray-900">
                {t('contact_information')}
              </h3>
            </div>
            <div className="p-4">
              <div className="space-y-4">
                <div>
                  <p className="text-xs font-medium text-gray-500">{t('agent_in_charge')}</p>
                  <p className="text-sm font-medium text-gray-900">Moussa Diagne</p>
                  <p className="text-xs text-gray-500">moussa.d@logistics.com</p>
                  <p className="text-xs text-gray-500">+221 77 111 22 33</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ShipmentDetails;