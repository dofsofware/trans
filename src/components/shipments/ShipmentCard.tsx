import { Link } from 'react-router-dom';
import { Shipment } from '../../types/shipment';
import Status from '../common/Status';
import { format } from 'date-fns';
import { MapPin } from 'lucide-react';

interface ShipmentCardProps {
  shipment: Shipment;
}

const ShipmentCard = ({ shipment }: ShipmentCardProps) => {
  return (
    <Link 
      to={`/shipments/${shipment.id}`} 
      className="block bg-white rounded-lg border border-gray-200 shadow-sm hover:shadow-md transition-shadow"
    >
      <div className="p-5">
        <div className="flex justify-between items-start">
          <div>
            <h3 className="text-lg font-semibold text-gray-900">
              {shipment.reference}
            </h3>
            <p className="text-sm text-gray-500 mt-1">
              {format(new Date(shipment.createdAt), 'MMM d, yyyy')}
            </p>
          </div>
          <Status status={shipment.status} />
        </div>
        
        <div className="mt-4 space-y-2">
          <div className="flex items-start space-x-2">
            <MapPin size={18} className="text-gray-400 mt-0.5 flex-shrink-0" />
            <div className="text-sm">
              <div className="font-medium text-gray-700">From: {shipment.origin}</div>
              <div className="font-medium text-gray-700 mt-1">To: {shipment.destination}</div>
            </div>
          </div>

          <div className="pt-3 mt-3 border-t border-gray-100 flex justify-between">
            <div className="text-xs font-medium text-gray-500">
              Weight: <span className="text-gray-900">{shipment.weight.toLocaleString()} kg</span>
            </div>
            <div className="text-xs font-medium text-gray-500">
              Volume: <span className="text-gray-900">{shipment.volume.toLocaleString()} m³</span>
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
};

export default ShipmentCard;