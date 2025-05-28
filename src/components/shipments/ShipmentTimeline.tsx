import { ShipmentEvent } from '../../types/shipment';
import { format } from 'date-fns';
import { useLanguage } from '../../contexts/LanguageContext';
import { useTheme } from '../../contexts/ThemeContext';
import { 
  FileEdit, 
  PackageOpen, 
  Warehouse, 
  Building, 
  Ship, 
  PackageCheck, 
  AlertCircle,
  ChevronDown,
  ChevronUp,
  MapPin,
  Calendar
} from 'lucide-react';
import { useState, useRef, useEffect } from 'react';

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

const statusColorMapDark = {
  draft: 'bg-gray-700 text-gray-300',
  processing: 'bg-amber-800 text-amber-300',
  warehouse: 'bg-blue-800 text-blue-300',
  customs: 'bg-purple-800 text-purple-300',
  in_transit: 'bg-indigo-800 text-indigo-300',
  delivered: 'bg-emerald-800 text-emerald-300',
  issue: 'bg-red-800 text-red-300'
};

const statusLabelMap = {
  draft: 'shipment_created',
  processing: 'processing_started',
  warehouse: 'arrived_at_warehouse',
  customs: 'in_customs_clearance',
  in_transit: 'in_transit',
  delivered: 'delivered_successfully',
  issue: 'issue_reported'
};

const ShipmentTimeline = ({ events }: ShipmentTimelineProps) => {
  const [showAll, setShowAll] = useState(false);
  const [animating, setAnimating] = useState(false);
  const timelineRef = useRef<HTMLDivElement>(null);
  const { t } = useLanguage();
  const { theme } = useTheme();

  const isDark = theme === 'dark';

  const sortedEvents = [...events].sort((a, b) =>
    new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
  );

  const displayedEvents = showAll ? sortedEvents : sortedEvents.slice(0, 3);

  useEffect(() => {
    if (animating && timelineRef.current) {
      setAnimating(false);
    }
  }, [animating]);

  const toggleShowAll = () => {
    if (!showAll && timelineRef.current) {
      // Scroll to the expand button before expanding
      const currentPosition = window.scrollY;
      const targetPosition = timelineRef.current.offsetTop + timelineRef.current.offsetHeight - 100;
      const needsScroll = targetPosition > window.innerHeight + currentPosition;

      if (needsScroll) {
        // Scroll to position the button in view
        window.scrollTo({
          top: targetPosition - window.innerHeight + 100,
          behavior: 'smooth'
        });
      }

      // Add a small delay to ensure scroll completes first
      setTimeout(() => {
        setShowAll(true);
        setAnimating(true);
      }, needsScroll ? 300 : 0);
    } else {
      setShowAll(false);
    }
  };

  return (
    <div className="flow-root" ref={timelineRef}>
      <ul className="-mb-8">
        {displayedEvents.map((event, eventIdx) => {
          const Icon = statusIconMap[event.status];
          const colorClass = isDark ? statusColorMapDark[event.status] : statusColorMap[event.status];
          const lastItem = eventIdx === displayedEvents.length - 1;

          return (
            <li key={event.id} className={animating && !lastItem ? 'animate-fadeIn' : ''}>
              <div className="relative pb-8">
                {!lastItem && (
                  <span
                    className={`absolute top-5 left-5 -ml-px h-full w-0.5 ${
                      isDark ? 'bg-gray-600' : 'bg-gray-200'
                    }`}
                    aria-hidden="true"
                  />
                )}

                {/* Desktop Design */}
                <div className="relative hidden md:flex items-start space-x-3">
                  <div className="relative">
                    <div className={`h-10 w-10 rounded-full flex items-center justify-center ${colorClass}`}>
                      <Icon className="h-5 w-5" aria-hidden="true" />
                    </div>
                  </div>
                  <div className="min-w-0 flex-1 py-1.5">
                    <div className={`text-sm ${
                      isDark ? 'text-gray-400' : 'text-gray-500'
                    }`}>
                      <div className={`font-medium ${
                        isDark ? 'text-white' : 'text-gray-900'
                      }`}>
                        {t(statusLabelMap[event.status])}
                      </div>
                      <span className="whitespace-nowrap text-sm">
                        {format(new Date(event.timestamp), 'MMM d, yyyy • h:mm a')}
                      </span>
                      {event.location && (
                        <div className="mt-1">
                          <span className={`${
                            isDark ? 'text-gray-300' : 'text-gray-600'
                          }`}>Location: </span>
                          {event.location}
                        </div>
                      )}
                      {event.notes && (
                        <div className={`mt-1 text-sm ${
                          isDark ? 'text-gray-300' : 'text-gray-700'
                        }`}>
                          {event.notes}
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                {/* Mobile Timeline Design */}
                <div className="md:hidden relative">
                  <div className="flex">
                    {/* Timeline dot and line */}
                    <div className="flex flex-col items-center mr-4">
                      <div className={`h-10 w-10 rounded-full flex items-center justify-center ${colorClass} z-10`}>
                        <Icon className="h-5 w-5" aria-hidden="true" />
                      </div>
                      {!lastItem && (
                        <div className={`h-full w-0.5 my-1 ${
                          isDark ? 'bg-gray-600' : 'bg-gray-200'
                        }`}></div>
                      )}
                    </div>

                    {/* Content */}
                    <div className="flex-1 pb-6">
                      <div className={`rounded-lg shadow-sm border p-3 ${
                        isDark 
                          ? 'bg-gray-700 border-gray-600' 
                          : 'bg-white border-gray-100'
                      }`}>
                        <h3 className={`text-sm font-medium ${
                          isDark ? 'text-white' : 'text-gray-900'
                        }`}>
                          {t(statusLabelMap[event.status])}
                        </h3>

                        <div className={`flex items-center mt-2 text-xs ${
                          isDark ? 'text-gray-400' : 'text-gray-500'
                        }`}>
                          <Calendar size={12} className="mr-1 flex-shrink-0" />
                          {format(new Date(event.timestamp), 'MMM d, yyyy • h:mm a')}
                        </div>

                        {event.location && (
                          <div className={`flex items-center mt-2 text-xs ${
                            isDark ? 'text-gray-300' : 'text-gray-600'
                          }`}>
                            <MapPin size={12} className="mr-1 flex-shrink-0" />
                            <span>{event.location}</span>
                          </div>
                        )}

                        {event.notes && (
                          <div className={`mt-2 text-xs p-2 rounded ${
                            isDark 
                              ? 'text-gray-300 bg-gray-600' 
                              : 'text-gray-700 bg-gray-50'
                          }`}>
                            {event.notes}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </li>
          );
        })}
      </ul>

      {sortedEvents.length > 3 && (
        <div className="mt-6 text-center">
          <button
            type="button"
            className={`inline-flex items-center px-4 py-2 border rounded-md shadow-sm text-sm font-medium focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors ${
              isDark
                ? 'border-gray-600 bg-gray-700 text-gray-200 hover:bg-gray-600 focus:ring-offset-gray-800'
                : 'border-gray-300 bg-white text-gray-700 hover:bg-gray-50'
            }`}
            onClick={toggleShowAll}
          >
            {showAll ? (
              <>
                <ChevronUp size={16} className="mr-2" />
                {t('show_less')}
              </>
            ) : (
              <>
                <ChevronDown size={16} className="mr-2" />
                {t('show_all', { count: sortedEvents.length })}
              </>
            )}
          </button>
        </div>
      )}
    </div>
  );
};

export default ShipmentTimeline;