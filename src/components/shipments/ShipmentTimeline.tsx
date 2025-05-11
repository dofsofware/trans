import { ShipmentEvent } from '../../types/shipment';
import { format } from 'date-fns';
import { 
  FileEdit, 
  PackageOpen, 
  Warehouse, 
  Building, 
  Ship, 
  PackageCheck, 
  AlertCircle
} from 'lucide-react';
import { useState } from 'react';

interface ShipmentTimelineProps {
  events: ShipmentEvent[];
}

const statusIconMap = {
  draft: FileEdit,
  processing: PackageOpen,
  warehouse: Warehouse,
  customs: Building,
  in_transit: Ship,
  delivered: PackageCheck,
  issue: AlertCircle
};

const statusColorMap = {
  draft: 'bg-gray-200 text-gray-700',
  processing: 'bg-amber-200 text-amber-700',
  warehouse: 'bg-blue-200 text-blue-700',
  customs: 'bg-purple-200 text-purple-700',
  in_transit: 'bg-indigo-200 text-indigo-700',
  delivered: 'bg-emerald-200 text-emerald-700',
  issue: 'bg-red-200 text-red-700'
};

const ShipmentTimeline = ({ events }: ShipmentTimelineProps) => {
  const [showAll, setShowAll] = useState(false);
  
  const sortedEvents = [...events].sort((a, b) => 
    new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
  );
  
  const displayedEvents = showAll ? sortedEvents : sortedEvents.slice(0, 3);

  return (
    <div className="flow-root">
      <ul className="-mb-8">
        {displayedEvents.map((event, eventIdx) => {
          const Icon = statusIconMap[event.status];
          const colorClass = statusColorMap[event.status];
          
          return (
            <li key={event.id}>
              <div className="relative pb-8">
                {eventIdx !== displayedEvents.length - 1 ? (
                  <span className="absolute top-5 left-5 -ml-px h-full w-0.5 bg-gray-200" aria-hidden="true" />
                ) : null}
                <div className="relative flex items-start space-x-3">
                  <div className="relative">
                    <div className={`h-10 w-10 rounded-full flex items-center justify-center ${colorClass}`}>
                      <Icon className="h-5 w-5" aria-hidden="true" />
                    </div>
                  </div>
                  <div className="min-w-0 flex-1 py-1.5">
                    <div className="text-sm text-gray-500">
                      <div className="font-medium text-gray-900">
                        {event.status === 'draft' && 'Shipment Created'}
                        {event.status === 'processing' && 'Processing Started'}
                        {event.status === 'warehouse' && 'Arrived at Warehouse'}
                        {event.status === 'customs' && 'In Customs Clearance'}
                        {event.status === 'in_transit' && 'In Transit'}
                        {event.status === 'delivered' && 'Delivered Successfully'}
                        {event.status === 'issue' && 'Issue Reported'}
                      </div>
                      <span className="whitespace-nowrap text-sm">
                        {format(new Date(event.timestamp), 'MMM d, yyyy • h:mm a')}
                      </span>
                      {event.location && (
                        <div className="mt-1">
                          <span className="text-gray-600">Location: </span> 
                          {event.location}
                        </div>
                      )}
                      {event.notes && (
                        <div className="mt-1 text-sm text-gray-700">
                          {event.notes}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </li>
          );
        })}
      </ul>
      
      {sortedEvents.length > 3 && (
        <div className="mt-2 text-center">
          <button
            type="button"
            className="text-sm text-blue-600 hover:text-blue-800 font-medium"
            onClick={() => setShowAll(!showAll)}
          >
            {showAll ? 'Show Less' : `Show All (${sortedEvents.length})`}
          </button>
        </div>
      )}
    </div>
  );
};

export default ShipmentTimeline;