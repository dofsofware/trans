import { Link } from 'react-router-dom';
import { Shipment } from '../../types/shipment';
import Status from '../common/Status';
import { format } from 'date-fns';
import { MapPin, Hash, Package, Calendar, Weight, Box, Plane, Ship } from 'lucide-react';
import { useLanguage } from '../../contexts/LanguageContext';

interface ShipmentCardProps {
  shipment: Shipment;
}

const ShipmentCard = ({ shipment }: ShipmentCardProps) => {
  const { t } = useLanguage();

  const ShipmentTypeIcon = shipment.type === 'air' ? Plane : Ship;
  const shipmentTypeLabel = shipment.type === 'air' ? t('type_air') : t('type_sea');

  return (
    <Link
      to={`/shipments/${shipment.id}`}
      className="block bg-white rounded-lg border border-gray-200 shadow-sm hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1"
    >
      <div className="p-4 sm:p-5">
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-2">
          <div className="flex items-center">
            <Package size={20} className="text-blue-600 mr-2 flex-shrink-0" />
            <div>
              <h3 className="text-lg font-semibold text-gray-900 line-clamp-1">
                {shipment.reference}
              </h3>
              <div className="flex items-center mt-1">
                <Calendar size={14} className="text-gray-400 mr-1 flex-shrink-0" />
                <p className="text-xs text-gray-500">
                  {format(new Date(shipment.createdAt), 'MMM d, yyyy')}
                </p>
              </div>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-50 text-blue-700">
              <ShipmentTypeIcon size={12} className="mr-1" />
              {shipmentTypeLabel}
            </span>
            <Status status={shipment.status} />
          </div>
        </div>

        <div className="mt-4 space-y-3">
          <div className="flex items-start space-x-2 bg-gray-50 p-3 rounded-lg">
            <MapPin size={18} className="text-blue-500 mt-0.5 flex-shrink-0" />
            <div className="text-sm flex-1">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                <div>
                  <div className="text-xs text-gray-500 uppercase tracking-wide">{t('from')}</div>
                  <div className="font-medium text-gray-700 line-clamp-1">{shipment.origin}</div>
                </div>
                <div>
                  <div className="text-xs text-gray-500 uppercase tracking-wide">{t('to')}</div>
                  <div className="font-medium text-gray-700 line-clamp-1">{shipment.destination}</div>
                </div>
              </div>
            </div>
          </div>

          <div className="flex items-center space-x-2 bg-blue-50 p-3 rounded-lg">
            <Hash size={16} className="text-blue-600 flex-shrink-0" />
            <div className="text-sm overflow-hidden">
              <span className="text-blue-600 font-medium">{t('tracking_number')}: </span>
              <span className="text-blue-800 font-mono">{shipment.id}</span>
            </div>
          </div>

          <div className="pt-3 mt-3 border-t border-gray-100">
            <div className="grid grid-cols-2 gap-2">
              <div className="flex items-center">
                <Weight size={14} className="text-gray-400 mr-1 flex-shrink-0" />
                <div className="text-xs font-medium">
                  <span className="text-gray-500">{t('weight')}: </span>
                  <span className="text-gray-900">{shipment.weight.toLocaleString()} kg</span>
                </div>
              </div>
              <div className="flex items-center justify-end">
                <Box size={14} className="text-gray-400 mr-1 flex-shrink-0" />
                <div className="text-xs font-medium">
                  <span className="text-gray-500">{t('volume')}: </span>
                  <span className="text-gray-900">{shipment.volume.toLocaleString()} m³</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
};

export default ShipmentCard;