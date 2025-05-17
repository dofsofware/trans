import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { getMockShipmentById } from '../../services/shipmentService';
import { Shipment } from '../../types/shipment';
import Status from '../../components/common/Status';
import ShipmentTimeline from '../../components/shipments/ShipmentTimeline';
import { ArrowLeft, FileText, MessageSquare, Hash, Plane, Ship } from 'lucide-react';
import { format } from 'date-fns';
import { useLanguage } from '../../contexts/LanguageContext';
import LoadingScreen from '../../components/common/LoadingScreen';

const ShipmentDetails = () => {
  const { id } = useParams<{ id: string }>();
  const [shipment, setShipment] = useState<Shipment | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const { t } = useLanguage();

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
      <div className="bg-white shadow overflow-hidden sm:rounded-lg p-6">
        <h3 className="text-lg font-medium text-gray-900">Shipment not found</h3>
        <p className="mt-1 max-w-2xl text-sm text-gray-500">
          The shipment you're looking for doesn't exist or you don't have access to view it.
        </p>
        <div className="mt-4">
          <Link
            to="/"
            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            Go back to dashboard
          </Link>
        </div>
      </div>
    );
  }

  const ShipmentTypeIcon = shipment.type === 'air' ? Plane : Ship;
  const shipmentTypeLabel = shipment.type === 'air' ? t('air_shipment') : t('sea_shipment');

  return (
    <div>
      <div className="mb-6">
        <Link to="/" className="inline-flex items-center text-sm text-blue-600 hover:text-blue-800">
          <ArrowLeft size={16} className="mr-1" /> Back to Dashboard
        </Link>
      </div>

      <div className="bg-white shadow overflow-hidden sm:rounded-lg mb-6">
        <div className="px-4 py-5 sm:px-6 flex justify-between items-center">
          <div>
            <h3 className="text-lg leading-6 font-medium text-gray-900">
              Shipment {shipment.reference}
            </h3>
            <div className="mt-1 flex items-center space-x-4">
              <p className="text-sm text-gray-500">
                {t('created_at')} {format(new Date(shipment.createdAt), 'MMMM d, yyyy')}
              </p>
              <div className="flex items-center text-sm text-blue-600">
                <ShipmentTypeIcon size={16} className="mr-1" />
                {shipmentTypeLabel}
              </div>
            </div>
          </div>
          <Status status={shipment.status} size="lg" />
        </div>
        
        <div className="border-t border-gray-200 px-4 py-5 sm:px-6">
          <dl className="grid grid-cols-1 sm:grid-cols-2 gap-x-4 gap-y-4">
            <div>
              <dt className="text-sm font-medium text-gray-500">{t('origin')}</dt>
              <dd className="mt-1 text-sm text-gray-900">{shipment.origin}</dd>
            </div>
            <div>
              <dt className="text-sm font-medium text-gray-500">{t('destination')}</dt>
              <dd className="mt-1 text-sm text-gray-900">{shipment.destination}</dd>
            </div>
            <div>
              <dt className="text-sm font-medium text-gray-500">{t('tracking_number')}</dt>
              <dd className="mt-1 text-sm text-gray-900 flex items-center">
                <Hash size={16} className="text-blue-500 mr-1" />
                <span className="font-medium">{shipment.id}</span>
              </dd>
            </div>
            <div>
              <dt className="text-sm font-medium text-gray-500">{t('estimatedDelivery')}</dt>
              <dd className="mt-1 text-sm text-gray-900">
                {shipment.estimatedDelivery ? 
                  format(new Date(shipment.estimatedDelivery), 'MMMM d, yyyy') : 
                  'Pending'
                }
              </dd>
            </div>
            <div>
              <dt className="text-sm font-medium text-gray-500">{t('weight')}</dt>
              <dd className="mt-1 text-sm text-gray-900">{shipment.weight.toLocaleString()} kg</dd>
            </div>
            <div>
              <dt className="text-sm font-medium text-gray-500">{t('volume')}</dt>
              <dd className="mt-1 text-sm text-gray-900">{shipment.volume.toLocaleString()} m³</dd>
            </div>
          </dl>
        </div>
      </div>

      <div className="mb-6 grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Description Card */}
        <div className="lg:col-span-3 bg-white shadow sm:rounded-lg">
          <div className="px-4 py-5 sm:px-6">
            <h3 className="text-lg leading-6 font-medium text-gray-900">
              {t('description')}
            </h3>
          </div>
          <div className="border-t border-gray-200 px-4 py-5 sm:p-6">
            <p className="text-sm text-gray-700 whitespace-pre-wrap">
              {shipment.description}
            </p>
          </div>
        </div>

        {/* Timeline */}
        <div className="lg:col-span-2 bg-white shadow sm:rounded-lg">
          <div className="px-4 py-5 sm:px-6">
            <h3 className="text-lg leading-6 font-medium text-gray-900">
              {t('shipment_timeLine')}
            </h3>
            <p className="mt-1 max-w-2xl text-sm text-gray-500">
              {t('track_the_progress')}
            </p>
          </div>
          <div className="border-t border-gray-200 px-4 py-5 sm:p-6">
            <ShipmentTimeline events={shipment.events} />
          </div>
        </div>

        {/* Documents and Actions */}
        <div className="space-y-6">
          {/* Documents */}
          <div className="bg-white shadow sm:rounded-lg">
            <div className="px-4 py-5 sm:px-6">
              <h3 className="text-lg leading-6 font-medium text-gray-900">
                Documents
              </h3>
            </div>
            <div className="border-t border-gray-200">
              {shipment.documents.length > 0 ? (
                <ul className="divide-y divide-gray-200">
                  {shipment.documents.map(doc => (
                    <li key={doc.id} className="px-4 py-3 flex justify-between items-center hover:bg-gray-50">
                      <div className="flex items-center">
                        <FileText size={18} className="text-gray-400 mr-2" />
                        <span className="text-sm text-gray-900">{doc.name}</span>
                      </div>
                      <a 
                        href="#"
                        className="text-xs font-medium text-blue-600 hover:text-blue-800"
                      >
                        {t('download')}
                      </a>
                    </li>
                  ))}
                </ul>
              ) : (
                <div className="px-4 py-5 sm:px-6 text-sm text-gray-500">
                  {t('no_documents_yet')}
                </div>
              )}
            </div>
          </div>

          {/* Quick Actions */}
          <div className="bg-white shadow sm:rounded-lg">
            <div className="px-4 py-5 sm:px-6">
              <h3 className="text-lg leading-6 font-medium text-gray-900">
                {t('quick_actions')}
              </h3>
            </div>
            <div className="border-t border-gray-200 px-4 py-5 sm:px-6">
              <div className="space-y-4">
                <button
                  type="button"
                  className="w-full inline-flex justify-center items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                >
                  <MessageSquare size={16} className="mr-2" />
                  {t('contact_agent')}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ShipmentDetails;