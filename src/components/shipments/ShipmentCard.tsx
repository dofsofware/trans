import { Link } from 'react-router-dom';
import { Shipment } from '../../types/shipment';
import Status from '../common/Status';
import { format } from 'date-fns';
import { MapPin, Hash, Package, Calendar, Weight, Box, Plane, Ship } from 'lucide-react';
import { useLanguage } from '../../contexts/LanguageContext';
import { useTheme } from '../../contexts/ThemeContext';

interface ShipmentCardProps {
  shipment: Shipment;
}

const ShipmentCard = ({ shipment }: ShipmentCardProps) => {
  const { t } = useLanguage();
  const { theme } = useTheme();

  const ShipmentTypeIcon = shipment.type === 'air' ? Plane : Ship;
  const shipmentTypeLabel = shipment.type === 'air' ? t('type_air') : t('type_sea');

  return (
    <Link
      to={`/shipments/${shipment.id}`}
      className={`block rounded-lg border shadow-sm hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1 ${
        theme === 'dark'
          ? 'bg-gray-800 border-gray-700 hover:bg-gray-750'
          : 'bg-white border-gray-200'
      }`}
    >
      <div className="p-4 sm:p-5">
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-2">
          <div className="flex items-center">
            <Package 
              size={20} 
              className={`mr-2 flex-shrink-0 ${
                theme === 'dark' ? 'text-blue-400' : 'text-blue-600'
              }`} 
            />
            <div>
              <h3 className={`text-lg font-semibold line-clamp-1 ${
                theme === 'dark' ? 'text-white' : 'text-gray-900'
              }`}>
                {shipment.reference}
              </h3>
              <div className="flex items-center mt-1">
                <Calendar 
                  size={14} 
                  className={`mr-1 flex-shrink-0 ${
                    theme === 'dark' ? 'text-gray-500' : 'text-gray-400'
                  }`} 
                />
                <p className={`text-xs ${
                  theme === 'dark' ? 'text-gray-400' : 'text-gray-500'
                }`}>
                  {format(new Date(shipment.createdAt), 'MMM d, yyyy')}
                </p>
              </div>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <span className={`inline-flex items-center rounded-full border font-medium px-2 py-1 text-xs ${
              theme === 'dark'
                ? 'bg-blue-900/50 text-blue-300 border-blue-700'
                : 'bg-blue-50 text-blue-700 border-blue-200'
            }`}>
              <ShipmentTypeIcon size={14} className="mr-1" />
              {shipmentTypeLabel}
            </span>
            <Status status={shipment.status} />
          </div>
        </div>

        <div className="mt-4 space-y-3">
          <div className={`flex items-start space-x-2 p-3 rounded-lg ${
            theme === 'dark' ? 'bg-gray-700/50' : 'bg-gray-50'
          }`}>
            <MapPin 
              size={18} 
              className={`mt-0.5 flex-shrink-0 ${
                theme === 'dark' ? 'text-blue-400' : 'text-blue-500'
              }`} 
            />
            <div className="text-sm flex-1">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                <div>
                  <div className={`text-xs uppercase tracking-wide ${
                    theme === 'dark' ? 'text-gray-400' : 'text-gray-500'
                  }`}>
                    {t('from')}
                  </div>
                  <div className={`font-medium line-clamp-1 ${
                    theme === 'dark' ? 'text-gray-200' : 'text-gray-700'
                  }`}>
                    {shipment.origin}
                  </div>
                </div>
                <div>
                  <div className={`text-xs uppercase tracking-wide ${
                    theme === 'dark' ? 'text-gray-400' : 'text-gray-500'
                  }`}>
                    {t('to')}
                  </div>
                  <div className={`font-medium line-clamp-1 ${
                    theme === 'dark' ? 'text-gray-200' : 'text-gray-700'
                  }`}>
                    {shipment.destination}
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className={`flex items-center space-x-2 p-3 rounded-lg ${
            theme === 'dark' ? 'bg-blue-900/30' : 'bg-blue-50'
          }`}>
            <Hash 
              size={16} 
              className={`flex-shrink-0 ${
                theme === 'dark' ? 'text-blue-400' : 'text-blue-600'
              }`} 
            />
            <div className="text-sm overflow-hidden">
              <span className={`font-medium ${
                theme === 'dark' ? 'text-blue-300' : 'text-blue-600'
              }`}>
                {t('tracking_number')}:{' '}
              </span>
              <span className={`font-mono ${
                theme === 'dark' ? 'text-blue-200' : 'text-blue-800'
              }`}>
                {shipment.id}
              </span>
            </div>
          </div>

          <div className={`pt-3 mt-3 border-t ${
            theme === 'dark' ? 'border-gray-600' : 'border-gray-100'
          }`}>
            <div className="grid grid-cols-2 gap-2">
              <div className="flex items-center">
                <Weight 
                  size={14} 
                  className={`mr-1 flex-shrink-0 ${
                    theme === 'dark' ? 'text-gray-500' : 'text-gray-400'
                  }`} 
                />
                <div className="text-xs font-medium">
                  <span className={theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}>
                    {t('weight')}:{' '}
                  </span>
                  <span className={theme === 'dark' ? 'text-gray-200' : 'text-gray-900'}>
                    {shipment.weight.toLocaleString()} kg
                  </span>
                </div>
              </div>
              <div className="flex items-center justify-end">
                <Box 
                  size={14} 
                  className={`mr-1 flex-shrink-0 ${
                    theme === 'dark' ? 'text-gray-500' : 'text-gray-400'
                  }`} 
                />
                <div className="text-xs font-medium">
                  <span className={theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}>
                    {t('volume')}:{' '}
                  </span>
                  <span className={theme === 'dark' ? 'text-gray-200' : 'text-gray-900'}>
                    {shipment.volume.toLocaleString()} m³
                  </span>
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