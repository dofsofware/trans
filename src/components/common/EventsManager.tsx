import { useState, useEffect } from 'react';
import { Calendar, User, Edit, Check, Clock, AlertTriangle, CheckCircle } from 'lucide-react';
import { useLanguage } from '../../contexts/LanguageContext';
import { useTheme } from '../../contexts/ThemeContext';

// Types pour les événements
export interface EventData {
  id: string;
  name: string;
  description: string;
  category: 'operations' | 'customs' | 'transport' | 'logistics' | 'commercial';
  isSelected: boolean;
  isCompleted: boolean;
  date?: string;
  details?: string;
  agentId?: string;
  agentName?: string;
}

export interface EventsManagerProps {
  shipmentType: 'import' | 'export';
  transportType: 'air' | 'sea';
  events: EventData[];
  onEventsChange: (events: EventData[]) => void;
  disabled?: boolean;
  showProgress?: boolean;
}

// Définition des événements par type d'opération
const EVENT_DEFINITIONS = {
  export: {
    air: [
      {
        id: 'export_pregate',
        name: 'export_pregate_event',
        description: 'export_pregate_description',
        category: 'operations' as const
      },
      {
        id: 'warehouse_reception',
        name: 'warehouse_reception_event',
        description: 'warehouse_reception_description',
        category: 'operations' as const
      },
      {
        id: 'declaration',
        name: 'declaration_event',
        description: 'declaration_description',
        category: 'customs' as const
      },
      {
        id: 'export_customs_clearance',
        name: 'export_customs_clearance_event',
        description: 'export_customs_clearance_description',
        category: 'customs' as const
      },
      {
        id: 'warehouse_loading',
        name: 'warehouse_loading_event',
        description: 'warehouse_loading_description',
        category: 'operations' as const
      },
      {
        id: 'effective_transport',
        name: 'effective_transport_event',
        description: 'effective_transport_description',
        category: 'transport' as const
      },
      {
        id: 'aircraft_loading',
        name: 'vessel_loading_event',
        description: 'vessel_loading_description',
        category: 'transport' as const
      },
      {
        id: 'departure',
        name: 'departure_event',
        description: 'departure_description',
        category: 'transport' as const
      },
      {
        id: 'estimated_arrival',
        name: 'estimated_arrival_event',
        description: 'estimated_arrival_description',
        category: 'logistics' as const
      },
      {
        id: 'billing',
        name: 'billing_event',
        description: 'billing_description',
        category: 'commercial' as const
      }
    ],
    sea: [
      {
        id: 'export_pregate',
        name: 'export_pregate_event',
        description: 'export_pregate_description',
        category: 'operations' as const
      },
      {
        id: 'warehouse_reception',
        name: 'warehouse_reception_event',
        description: 'warehouse_reception_description',
        category: 'operations' as const
      },
      {
        id: 'declaration',
        name: 'declaration_event',
        description: 'declaration_description',
        category: 'customs' as const
      },
      {
        id: 'export_customs_clearance',
        name: 'export_customs_clearance_event',
        description: 'export_customs_clearance_description',
        category: 'customs' as const
      },
      {
        id: 'warehouse_loading',
        name: 'warehouse_loading_event',
        description: 'warehouse_loading_description',
        category: 'operations' as const
      },
      {
        id: 'effective_transport',
        name: 'effective_transport_event',
        description: 'effective_transport_description',
        category: 'transport' as const
      },
      {
        id: 'vessel_loading',
        name: 'vessel_loading_event',
        description: 'vessel_loading_description',
        category: 'transport' as const
      },
      {
        id: 'departure',
        name: 'departure_event',
        description: 'departure_description',
        category: 'transport' as const
      },
      {
        id: 'estimated_arrival',
        name: 'estimated_arrival_event',
        description: 'estimated_arrival_description',
        category: 'logistics' as const
      },
      {
        id: 'billing',
        name: 'billing_event',
        description: 'billing_description',
        category: 'commercial' as const
      }
    ]
  },
  import: {
    air: [
      {
        id: 'import_prealert',
        name: 'import_prealert_event',
        description: 'import_prealert_description',
        category: 'operations' as const
      },
      {
        id: 'arrival',
        name: 'arrival_event',
        description: 'arrival_description',
        category: 'transport' as const
      },
      {
        id: 'import_customs_clearance',
        name: 'import_customs_clearance_event',
        description: 'import_customs_clearance_description',
        category: 'customs' as const
      },
      {
        id: 'pickup',
        name: 'pickup_event',
        description: 'pickup_description',
        category: 'operations' as const
      },
      {
        id: 'delivery',
        name: 'delivery_event',
        description: 'delivery_description',
        category: 'operations' as const
      },
      {
        id: 'warehouse_arrival',
        name: 'warehouse_arrival_event',
        description: 'warehouse_arrival_description',
        category: 'operations' as const
      },
      {
        id: 'billing',
        name: 'billing_event',
        description: 'billing_description',
        category: 'commercial' as const
      }
    ],
    sea: [
      {
        id: 'import_prealert',
        name: 'import_prealert_event',
        description: 'import_prealert_description',
        category: 'operations' as const
      },
      {
        id: 'arrival',
        name: 'arrival_event',
        description: 'arrival_description',
        category: 'transport' as const
      },
      {
        id: 'import_customs_clearance',
        name: 'import_customs_clearance_event',
        description: 'import_customs_clearance_description',
        category: 'customs' as const
      },
      {
        id: 'maritime_company_slip',
        name: 'maritime_company_slip_event',
        description: 'maritime_company_slip_description',
        category: 'operations' as const
      },
      {
        id: 'import_pregate',
        name: 'import_pregate_event',
        description: 'import_pregate_description',
        category: 'operations' as const
      },
      {
        id: 'pickup',
        name: 'pickup_event',
        description: 'pickup_description',
        category: 'operations' as const
      },
      {
        id: 'delivery',
        name: 'delivery_event',
        description: 'delivery_description',
        category: 'operations' as const
      },
      {
        id: 'warehouse_arrival',
        name: 'warehouse_arrival_event',
        description: 'warehouse_arrival_description',
        category: 'operations' as const
      },
      {
        id: 'billing',
        name: 'billing_event',
        description: 'billing_description',
        category: 'commercial' as const
      }
    ]
  }
};

const EventsManager = ({ 
  shipmentType, 
  transportType, 
  events, 
  onEventsChange, 
  disabled = false,
  showProgress = true 
}: EventsManagerProps) => {
  const { t } = useLanguage();
  const { theme } = useTheme();
  const [expandedEvent, setExpandedEvent] = useState<string | null>(null);

  const isDark = theme === 'dark';
  const textPrimary = isDark ? 'text-white' : 'text-gray-900';
  const textSecondary = isDark ? 'text-gray-300' : 'text-gray-600';
  const textMuted = isDark ? 'text-gray-400' : 'text-gray-500';
  const bgPrimary = isDark ? 'bg-gray-900' : 'bg-white';
  const bgSecondary = isDark ? 'bg-gray-800' : 'bg-white';
  const borderColor = isDark ? 'border-gray-700' : 'border-gray-200';

  // Obtenir les définitions d'événements pour le type d'opération actuel
  const eventDefinitions = EVENT_DEFINITIONS[shipmentType]?.[transportType] || [];

  // Initialiser les événements si nécessaire
  useEffect(() => {
    if (events.length === 0 && eventDefinitions.length > 0) {
      const initialEvents: EventData[] = eventDefinitions.map(def => ({
        id: def.id,
        name: def.name,
        description: def.description,
        category: def.category,
        isSelected: false,
        isCompleted: false,
        agentName: 'Cheikh Agent Operations'
      }));
      onEventsChange(initialEvents);
    }
  }, [shipmentType, transportType, events.length, eventDefinitions, onEventsChange]);

  // Couleurs par catégorie
  const getCategoryColor = (category: string) => {
    const colors = {
      operations: isDark ? 'text-blue-400' : 'text-blue-600',
      customs: isDark ? 'text-purple-400' : 'text-purple-600',
      transport: isDark ? 'text-green-400' : 'text-green-600',
      logistics: isDark ? 'text-orange-400' : 'text-orange-600',
      commercial: isDark ? 'text-pink-400' : 'text-pink-600'
    };
    return colors[category as keyof typeof colors] || textMuted;
  };

  const getCategoryBadgeColor = (category: string) => {
    const colors = {
      operations: isDark ? 'bg-blue-900/50 text-blue-300 border-blue-700' : 'bg-blue-50 text-blue-700 border-blue-200',
      customs: isDark ? 'bg-purple-900/50 text-purple-300 border-purple-700' : 'bg-purple-50 text-purple-700 border-purple-200',
      transport: isDark ? 'bg-green-900/50 text-green-300 border-green-700' : 'bg-green-50 text-green-700 border-green-200',
      logistics: isDark ? 'bg-orange-900/50 text-orange-300 border-orange-700' : 'bg-orange-50 text-orange-700 border-orange-200',
      commercial: isDark ? 'bg-pink-900/50 text-pink-300 border-pink-700' : 'bg-pink-50 text-pink-700 border-pink-200'
    };
    return colors[category as keyof typeof colors] || `${isDark ? 'bg-gray-700 text-gray-300 border-gray-600' : 'bg-gray-50 text-gray-700 border-gray-200'}`;
  };

  // Gérer la sélection d'un événement
  const handleEventToggle = (eventId: string) => {
    if (disabled) return;
    
    const updatedEvents = events.map(event =>
      event.id === eventId
        ? { ...event, isSelected: !event.isSelected }
        : event
    );
    onEventsChange(updatedEvents);
  };

  // Gérer la completion d'un événement
  const handleEventComplete = (eventId: string) => {
    if (disabled) return;
    
    const updatedEvents = events.map(event =>
      event.id === eventId
        ? { ...event, isCompleted: !event.isCompleted }
        : event
    );
    onEventsChange(updatedEvents);
  };

  // Gérer les changements de date
  const handleDateChange = (eventId: string, date: string) => {
    if (disabled) return;
    
    const updatedEvents = events.map(event =>
      event.id === eventId
        ? { ...event, date }
        : event
    );
    onEventsChange(updatedEvents);
  };

  // Gérer les changements de détails
  const handleDetailsChange = (eventId: string, details: string) => {
    if (disabled) return;
    
    const updatedEvents = events.map(event =>
      event.id === eventId
        ? { ...event, details }
        : event
    );
    onEventsChange(updatedEvents);
  };

  // Calculer les statistiques de progression
  const selectedEvents = events.filter(e => e.isSelected);
  const completedEvents = selectedEvents.filter(e => e.isCompleted);
  const progressPercentage = selectedEvents.length > 0 ? (completedEvents.length / selectedEvents.length) * 100 : 0;

  return (
    <div className="space-y-6">
      {/* En-tête avec progression */}
      <div className="flex items-center justify-between">
        <div>
          <h3 className={`text-lg font-medium ${textPrimary} flex items-center`}>
            <Clock size={20} className="mr-2 text-blue-600" />
            {t('events_management')}
          </h3>
          <p className={`text-sm ${textMuted} mt-1`}>
            {t('events_management_desc')}
          </p>
        </div>
        
        {showProgress && selectedEvents.length > 0 && (
          <div className="text-right">
            <div className={`text-sm font-medium ${textPrimary}`}>
              {completedEvents.length} / {selectedEvents.length} {t('completedEvents')}
            </div>
            <div className={`text-xs ${textMuted}`}>
              {Math.round(progressPercentage)}% {t('complited')}
            </div>
          </div>
        )}
      </div>

      {/* Barre de progression */}
      {showProgress && selectedEvents.length > 0 && (
        <div className={`rounded-lg p-4 ${isDark ? 'bg-blue-900/20' : 'bg-blue-50'}`}>
          <div className="flex items-center justify-between mb-2">
            <span className={`text-sm font-medium ${isDark ? 'text-blue-300' : 'text-blue-700'}`}>
              {t('eventProgression')}
            </span>
            <span className={`text-sm ${isDark ? 'text-blue-400' : 'text-blue-600'}`}>
              {Math.round(progressPercentage)}%
            </span>
          </div>
          <div className={`w-full rounded-full h-2 ${isDark ? 'bg-blue-800' : 'bg-blue-200'}`}>
            <div
              className="bg-blue-600 h-2 rounded-full transition-all duration-300"
              style={{ width: `${progressPercentage}%` }}
            />
          </div>
        </div>
      )}

      {/* Liste des événements */}
      <div className="space-y-3">
        {events.map((event) => (
          <div
            key={event.id}
            className={`rounded-lg border transition-all duration-200 ${
              event.isSelected
                ? isDark 
                  ? 'border-blue-500 bg-blue-900/20' 
                  : 'border-blue-300 bg-blue-50'
                : `${borderColor} ${bgSecondary} hover:shadow-md`
            }`}
          >
            <div className="p-4">
              {/* En-tête de l'événement */}
              <div className="flex items-start justify-between">
                <div className="flex items-start space-x-3 flex-1">
                  {/* Checkbox de sélection */}
                  <div className="flex items-center pt-1">
                    <input
                      type="checkbox"
                      checked={event.isSelected}
                      onChange={() => handleEventToggle(event.id)}
                      disabled={disabled}
                      className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded transition-colors"
                    />
                  </div>

                  {/* Informations de l'événement */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center space-x-2 mb-1">
                      <h4 className={`font-medium ${textPrimary}`}>
                        {t(event.name)}
                      </h4>
                      <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium border ${getCategoryBadgeColor(event.category)}`}>
                        {t(event.category)}
                      </span>
                    </div>
                    
                    <p className={`text-sm ${textMuted} mb-2`}>
                      {t(event.description)}
                    </p>

                    {/* Agent assigné */}
                    <div className="flex items-center text-xs">
                      <User size={12} className={`mr-1 ${textMuted}`} />
                      <span className={textMuted}>
                        {t('agent_in_charge')}: {event.agentName}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Statut de completion */}
                {event.isSelected && (
                  <div className="flex items-center space-x-2 ml-4">
                    <button
                      onClick={() => handleEventComplete(event.id)}
                      disabled={disabled}
                      className={`flex items-center px-3 py-1 rounded-full text-xs font-medium transition-colors ${
                        event.isCompleted
                          ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300'
                          : 'bg-gray-100 text-gray-600 dark:bg-gray-700 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-600'
                      }`}
                    >
                      {event.isCompleted ? (
                        <>
                          <CheckCircle size={12} className="mr-1" />
                          {t('event_completed')}
                        </>
                      ) : (
                        <>
                          <Clock size={12} className="mr-1" />
                          {t('event_pending')}
                        </>
                      )}
                    </button>
                  </div>
                )}
              </div>

              {/* Configuration de l'événement (si sélectionné) */}
              {event.isSelected && (
                <div className={`mt-4 pt-4 border-t ${borderColor} grid grid-cols-1 md:grid-cols-2 gap-4`}>
                  {/* Date */}
                  <div>
                    <label className={`block text-sm font-medium ${textSecondary} mb-1`}>
                      {t('event_date')} *
                    </label>
                    <div className="relative">
                      <input
                        type="date"
                        value={event.date || ''}
                        onChange={(e) => handleDateChange(event.id, e.target.value)}
                        disabled={disabled}
                        className={`block w-full px-3 py-2 border ${borderColor} rounded-lg ${bgPrimary} ${textPrimary} focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm`}
                      />
                      <Calendar 
                        size={16} 
                        className={`absolute right-3 top-1/2 transform -translate-y-1/2 ${textMuted} pointer-events-none`} 
                      />
                    </div>
                  </div>

                  {/* Détails */}
                  <div>
                    <label className={`block text-sm font-medium ${textSecondary} mb-1`}>
                      {t('event_details')}
                    </label>
                    <textarea
                      value={event.details || ''}
                      onChange={(e) => handleDetailsChange(event.id, e.target.value)}
                      disabled={disabled}
                      placeholder={t('event_notes_placeholder')}
                      rows={2}
                      className={`block w-full px-3 py-2 border ${borderColor} rounded-lg ${bgPrimary} ${textPrimary} focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm resize-none`}
                    />
                  </div>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Message si aucun événement sélectionné */}
      {selectedEvents.length === 0 && (
        <div className={`text-center py-8 ${bgSecondary} rounded-lg border ${borderColor}`}>
          <AlertTriangle size={48} className={`mx-auto mb-4 ${textMuted}`} />
          <p className={`${textMuted} mb-2`}>
            {t('no_events_selected')}
          </p>
          <p className={`text-sm ${textMuted}`}>
            {t('select_at_least_one_event')}
          </p>
        </div>
      )}
    </div>
  );
};

export default EventsManager;