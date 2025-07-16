import React from 'react';
import { format } from 'date-fns';
import {
  Clock,
  Info,
  User,
  Calendar,
  CheckCircle,
  Edit3,
  Check
} from 'lucide-react';

interface TransitEvent {
  id: string;
  name: string;
  date: string;
  agentId: string;
  agentName: string;
  details?: string;
  completed: boolean;
}

interface TransitEventsManagerProps {
  events: TransitEvent[];
  onEventChange: (eventId: string, field: 'date' | 'details' | 'completed', value: string | boolean) => void;
  isDark: boolean;
  t: (key: string) => string; // Translation function
}

const TransitEventsManager: React.FC<TransitEventsManagerProps> = ({
  events,
  onEventChange,
  isDark,
  t
}) => {
  // Theme-based styling
  const textPrimary = isDark ? 'text-white' : 'text-gray-900';
  const textSecondary = isDark ? 'text-gray-300' : 'text-gray-600';
  const textMuted = isDark ? 'text-gray-400' : 'text-gray-500';
  const bgPrimary = isDark ? 'bg-gray-900' : 'bg-white';
  const bgSecondary = isDark ? 'bg-gray-800' : 'bg-white';
  const borderColor = isDark ? 'border-gray-700' : 'border-gray-200';

  return (
    <div className="space-y-4 sm:space-y-6">
      {/* Events Section */}
      <div className={`p-4 sm:p-6 rounded-xl border ${borderColor} ${bgSecondary} shadow-lg`}>
        <h3 className={`text-lg sm:text-xl font-bold ${textPrimary} mb-4 sm:mb-6 flex items-center flex-wrap gap-2`}>
          <Clock size={20} className="sm:w-6 sm:h-6 text-blue-600 flex-shrink-0" />
          <span>{t('events')}</span>
        </h3>

        <div className={`p-3 sm:p-4 rounded-lg ${isDark ? 'bg-blue-900/20' : 'bg-blue-50'} border ${isDark ? 'border-blue-800' : 'border-blue-200'} mb-4 sm:mb-6`}>
          <div className="flex items-start gap-2 sm:gap-3">
            <Info size={16} className={`sm:w-5 sm:h-5 mt-0.5 flex-shrink-0 ${isDark ? 'text-blue-400' : 'text-blue-600'}`} />
            <div className="min-w-0 flex-1">
              <h4 className={`font-medium ${isDark ? 'text-blue-300' : 'text-blue-800'} mb-1 text-sm sm:text-base`}>
                {t('events_management')}
              </h4>
              <p className={`text-xs sm:text-sm ${isDark ? 'text-blue-200' : 'text-blue-700'} leading-relaxed`}>
                {t('events_management_desc')} {t('sequential_completion_required')}
              </p>
            </div>
          </div>
        </div>

        {/* Department Legend */}
        <div className="mb-4 sm:mb-6">
          <h4 className={`text-xs sm:text-sm font-semibold ${textSecondary} mb-2 sm:mb-3`}>
            {t('departments')}:
          </h4>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-2 sm:gap-3">
            <div className="flex items-center min-w-0">
              <div className="w-3 h-3 sm:w-4 sm:h-4 bg-blue-500 rounded-full mr-1.5 sm:mr-2 flex-shrink-0"></div>
              <span className={`text-xs sm:text-sm ${textPrimary} truncate`}>{t('operations')}</span>
            </div>
            <div className="flex items-center min-w-0">
              <div className="w-3 h-3 sm:w-4 sm:h-4 bg-green-500 rounded-full mr-1.5 sm:mr-2 flex-shrink-0"></div>
              <span className={`text-xs sm:text-sm ${textPrimary} truncate`}>{t('customs')}</span>
            </div>
            <div className="flex items-center min-w-0">
              <div className="w-3 h-3 sm:w-4 sm:h-4 bg-purple-500 rounded-full mr-1.5 sm:mr-2 flex-shrink-0"></div>
              <span className={`text-xs sm:text-sm ${textPrimary} truncate`}>{t('transport')}</span>
            </div>
            <div className="flex items-center min-w-0">
              <div className="w-3 h-3 sm:w-4 sm:h-4 bg-orange-500 rounded-full mr-1.5 sm:mr-2 flex-shrink-0"></div>
              <span className={`text-xs sm:text-sm ${textPrimary} truncate`}>{t('logistics')}</span>
            </div>
            <div className="flex items-center min-w-0 col-span-2 sm:col-span-1">
              <div className="w-3 h-3 sm:w-4 sm:h-4 bg-pink-500 rounded-full mr-1.5 sm:mr-2 flex-shrink-0"></div>
              <span className={`text-xs sm:text-sm ${textPrimary} truncate`}>{t('commercial')}</span>
            </div>
          </div>
        </div>

        {/* Events Timeline */}
        <div className="relative">
          {/* Timeline Line - Hidden on mobile, visible on larger screens */}
          <div className="hidden sm:block absolute left-6 lg:left-8 top-0 bottom-0 w-0.5 bg-gradient-to-b from-blue-500 via-green-500 to-purple-500 opacity-30"></div>

          <div className="space-y-3 sm:space-y-4">
            {events.map((event, index) => {
              // Determine department and color based on event name
              const getDepartmentInfo = (eventName: string) => {
                const eventKey = eventName.toLowerCase();

                if (eventKey.includes('pregate') || eventKey.includes('declaration') || eventKey.includes('customs') || eventKey.includes('clearance')) {
                  return { dept: t('customs'), color: 'green', bg: 'bg-green-50 dark:bg-green-900/20', border: 'border-green-200 dark:border-green-700', text: 'text-green-800 dark:text-green-300' };
                } else if (eventKey.includes('transport') || eventKey.includes('loading') || eventKey.includes('departure') || eventKey.includes('arrival')) {
                  return { dept: t('transport'), color: 'purple', bg: 'bg-purple-50 dark:bg-purple-900/20', border: 'border-purple-200 dark:border-purple-700', text: 'text-purple-800 dark:text-purple-300' };
                } else if (eventKey.includes('warehouse') || eventKey.includes('reception') || eventKey.includes('pickup') || eventKey.includes('delivery')) {
                  return { dept: t('logistics'), color: 'orange', bg: 'bg-orange-50 dark:bg-orange-900/20', border: 'border-orange-200 dark:border-orange-700', text: 'text-orange-800 dark:text-orange-300' };
                } else if (eventKey.includes('billing') || eventKey.includes('prealert')) {
                  return { dept: t('commercial'), color: 'pink', bg: 'bg-pink-50 dark:bg-pink-900/20', border: 'border-pink-200 dark:border-pink-700', text: 'text-pink-800 dark:text-pink-300' };
                }
                return { dept: t('operations'), color: 'blue', bg: 'bg-blue-50 dark:bg-blue-900/20', border: 'border-blue-200 dark:border-blue-700', text: 'text-blue-800 dark:text-blue-300' };
              };

              const deptInfo = getDepartmentInfo(event.name);
              const colorClasses = {
                blue: 'from-blue-500 to-blue-600',
                green: 'from-green-500 to-green-600',
                purple: 'from-purple-500 to-purple-600',
                orange: 'from-orange-500 to-orange-600',
                pink: 'from-pink-500 to-pink-600'
              };

              // Check if previous event is completed (sequential validation)
              const isPreviousCompleted = index === 0 || events[index - 1].completed;
              const canBeCompleted = isPreviousCompleted && !event.completed;
              const isBlocked = !isPreviousCompleted && !event.completed;

              // Check if this event can be reactivated (if there are no completed events after it)
              const hasCompletedAfter = events.slice(index + 1).some(e => e.completed);
              const canReactivate = event.completed && !hasCompletedAfter;

              return (
                <div
                  key={event.id}
                  className={`relative pl-4 sm:pl-12 lg:pl-16 pr-3 sm:pr-4 py-3 sm:py-4 rounded-xl border-2 transition-all duration-300 ${event.completed
                      ? `${deptInfo.bg} ${deptInfo.border} shadow-md transform hover:scale-[1.01] sm:hover:scale-[1.02]`
                      : isBlocked
                        ? `${bgSecondary} ${borderColor} border-dashed opacity-75 cursor-not-allowed`
                        : `${bgSecondary} ${borderColor} hover:${deptInfo.bg} hover:shadow-lg transform hover:scale-[1.01] sm:hover:scale-[1.02]`
                    }`}
                >
                  {/* Timeline Node - Hidden on mobile */}
                  <div className={`hidden sm:block absolute left-4 lg:left-6 top-4 sm:top-6 w-3 h-3 sm:w-4 sm:h-4 rounded-full border-2 border-white shadow-lg bg-gradient-to-r ${colorClasses[deptInfo.color]} transition-all duration-300 ${event.completed
                      ? 'ring-2 ring-white ring-offset-2 scale-110'
                      : isBlocked
                        ? 'opacity-40 scale-75 grayscale'
                        : 'hover:scale-110'
                    }`}></div>

                  {/* Event Header */}
                  <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3 sm:gap-4 mb-3 sm:mb-4">
                    <div className="flex-1 min-w-0">
                      <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-3 mb-2">
                        <h4 className={`font-semibold ${textPrimary} text-base sm:text-lg ${isBlocked ? 'opacity-60' : ''} break-words`}>
                          {event.name}
                        </h4>
                        <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${deptInfo.bg} ${deptInfo.text} border ${deptInfo.border} ${isBlocked ? 'opacity-60' : ''} self-start sm:self-auto flex-shrink-0`}>
                          {deptInfo.dept}
                        </span>
                      </div>
                      <div className="flex items-center text-xs sm:text-sm text-gray-500">
                        <User size={12} className="sm:w-4 sm:h-4 mr-1 flex-shrink-0" />
                        <span className={`${textMuted} ${isBlocked ? 'opacity-60' : ''} truncate`}>
                          {t('agent')}: {event.agentName}
                        </span>
                      </div>
                    </div>

                    {/* Status and Actions */}
                    <div className="flex items-center justify-between sm:justify-end gap-2 sm:gap-3">
                      {/* Status Badge */}
                      <div className={`flex items-center px-2 sm:px-3 py-1 rounded-full text-xs font-medium transition-all flex-shrink-0 ${event.completed
                          ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300'
                          : isBlocked
                            ? 'bg-gray-100 text-gray-500 dark:bg-gray-700 dark:text-gray-400'
                            : 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300'
                        }`}>
                        {event.completed ? (
                          <><CheckCircle size={12} className="sm:w-4 sm:h-4 mr-1" /> {t('completed')}</>
                        ) : isBlocked ? (
                          <><Clock size={12} className="sm:w-4 sm:h-4 mr-1 opacity-50" /> {t('waiting')}</>
                        ) : (
                          <><Clock size={12} className="sm:w-4 sm:h-4 mr-1" /> {t('pending')}</>
                        )}
                      </div>

                      {/* Action Button */}
                      <div className="relative group">
                        {event.completed && canReactivate ? (
                          // Edit Button for completed events that can be reactivated
                          <button
                            type="button"
                            onClick={() => onEventChange(event.id, 'completed', false)}
                            className="p-1.5 sm:p-2 rounded-full bg-yellow-500 text-white shadow-lg hover:bg-yellow-600 hover:scale-110 transition-all duration-200 flex-shrink-0"
                            title={t('reactivate_to_modify')}
                          >
                            <Edit3 size={14} className="sm:w-4 sm:h-4" />
                          </button>
                        ) : (
                          // Complete/Pending Button for all other states
                          <button
                            type="button"
                            onClick={() => canBeCompleted && onEventChange(event.id, 'completed', !event.completed)}
                            disabled={!canBeCompleted}
                            className={`p-1.5 sm:p-2 rounded-full transition-all duration-200 flex-shrink-0 ${event.completed
                                ? 'bg-green-500 text-white shadow-lg hover:bg-green-600 hover:scale-110'
                                : canBeCompleted
                                  ? 'bg-blue-500 text-white shadow-lg hover:bg-blue-600 hover:scale-110'
                                  : 'bg-gray-200 text-gray-400 dark:bg-gray-700 dark:text-gray-500 cursor-not-allowed'
                              }`}
                          >
                            {event.completed ? (
                              <Check size={14} className="sm:w-4 sm:h-4" />
                            ) : isBlocked ? (
                              <div className="relative">
                                <CheckCircle size={14} className="sm:w-4 sm:h-4 opacity-30" />
                                <div className="absolute inset-0 flex items-center justify-center">
                                </div>
                              </div>
                            ) : (
                              <CheckCircle size={14} className="sm:w-4 sm:h-4" />
                            )}
                          </button>
                        )}

                        {/* Tooltip for edit button */}
                        {event.completed && canReactivate && (
                          <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-3 py-1 bg-black text-white text-xs rounded-lg opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-10 hidden sm:block">
                            {t('reactivate_to_modify')}
                            <div className="absolute top-full left-1/2 transform -translate-x-1/2 border-2 border-transparent border-t-black"></div>
                          </div>
                        )}

                        {/* Tooltip for blocked events */}
                        {isBlocked && (
                          <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-3 py-1 bg-black text-white text-xs rounded-lg opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-10 hidden sm:block">
                            {t('complete_previous_step_first')}
                            <div className="absolute top-full left-1/2 transform -translate-x-1/2 border-2 border-transparent border-t-black"></div>
                          </div>
                        )}

                        {/* Tooltip for completed events that can't be reactivated */}
                        {event.completed && hasCompletedAfter && (
                          <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-3 py-1 bg-black text-white text-xs rounded-lg opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-10 hidden sm:block">
                            {t('cannot_reactivate_following_completed')}
                            <div className="absolute top-full left-1/2 transform -translate-x-1/2 border-2 border-transparent border-t-black"></div>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Event Details */}
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-3 sm:gap-4">
                    <div>
                      <label className={`block text-xs font-semibold ${textMuted} mb-1 sm:mb-2 uppercase tracking-wide ${(isBlocked || event.completed) ? 'opacity-60' : ''}`}>
                        <Calendar size={10} className="sm:w-3 sm:h-3 inline mr-1" />
                        {t('date')} *
                      </label>
                      <input
                        type="date"
                        value={event.date}
                        onChange={(e) => onEventChange(event.id, 'date', e.target.value)}
                        disabled={isBlocked || event.completed}
                        className={`block w-full px-3 py-2 text-sm border rounded-lg ${bgPrimary} ${textPrimary} transition-all ${(isBlocked || event.completed)
                            ? `${borderColor} opacity-60 cursor-not-allowed bg-gray-50 dark:bg-gray-800`
                            : `${borderColor} focus:outline-none focus:ring-2 focus:ring-${deptInfo.color}-500 focus:border-${deptInfo.color}-500`
                          }`}
                      />
                    </div>

                    <div>
                      <label className={`block text-xs font-semibold ${textMuted} mb-1 sm:mb-2 uppercase tracking-wide ${(isBlocked || event.completed) ? 'opacity-60' : ''}`}>
                        <Edit3 size={10} className="sm:w-3 sm:h-3 inline mr-1" />
                        {t('details')}
                      </label>
                      <input
                        type="text"
                        value={event.details || ''}
                        onChange={(e) => onEventChange(event.id, 'details', e.target.value)}
                        placeholder={
                          isBlocked
                            ? t('complete_previous_step_placeholder')
                            : event.completed
                              ? t('click_edit_to_modify')
                              : t('optional_details')
                        }
                        disabled={isBlocked || event.completed}
                        className={`block w-full px-3 py-2 text-sm border rounded-lg ${bgPrimary} ${textPrimary} transition-all ${(isBlocked || event.completed)
                            ? `${borderColor} opacity-60 cursor-not-allowed bg-gray-50 dark:bg-gray-800`
                            : `${borderColor} focus:outline-none focus:ring-2 focus:ring-${deptInfo.color}-500 focus:border-${deptInfo.color}-500`
                          }`}
                      />
                    </div>
                  </div>

                  {/* Progress indicator for completed events */}
                  {event.completed && (
                    <div className="mt-3 sm:mt-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                      <div className="flex items-center text-xs sm:text-sm text-green-600 dark:text-green-400">
                        <CheckCircle size={14} className="sm:w-4 sm:h-4 mr-2 flex-shrink-0" />
                        <span className="font-medium">
                          {t('completed')} {t('on')} {format(new Date(event.date), 'dd/MM/yyyy')}
                        </span>
                      </div>
                      {canReactivate && (
                        <div className="text-xs text-yellow-600 dark:text-yellow-400">
                          <Edit3 size={10} className="sm:w-3 sm:h-3 inline mr-1" />
                          {t('click_edit_icon_to_modify')}
                        </div>
                      )}
                    </div>
                  )}

                  {/* Warning for completed events that can't be reactivated */}
                  {event.completed && hasCompletedAfter && (
                    <div className="mt-3 sm:mt-4 flex items-center text-xs sm:text-sm text-amber-600 dark:text-amber-400">
                      <Info size={14} className="sm:w-4 sm:h-4 mr-2 flex-shrink-0" />
                      <span className="font-medium">
                        {t('modification_blocked_following_completed')}
                      </span>
                    </div>
                  )}

                  {/* Next step indicator */}
                  {!event.completed && canBeCompleted && (
                    <div className="mt-3 sm:mt-4 flex items-center text-xs sm:text-sm text-blue-600 dark:text-blue-400">
                      <div className="w-2 h-2 bg-blue-500 rounded-full mr-2 animate-pulse flex-shrink-0"></div>
                      <span className="font-medium">
                        {t('next_step_available')}
                      </span>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Progress Summary */}
        <div className="mt-4 sm:mt-6 p-3 sm:p-4 bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20 rounded-xl border border-blue-200 dark:border-blue-700">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 sm:gap-3 mb-3">
            <h4 className={`font-semibold ${textPrimary} text-sm sm:text-base`}>
              {t('eventProgression')}
            </h4>
            <span className={`text-xs sm:text-sm ${textMuted}`}>
              {events.filter(e => e.completed).length} / {events.length} {t('completed')}
            </span>
          </div>

          <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2 overflow-hidden">
            <div
              className="bg-gradient-to-r from-blue-500 via-green-500 to-purple-500 h-2 rounded-full transition-all duration-700 ease-out"
              style={{
                width: `${(events.filter(e => e.completed).length / events.length) * 100}%`
              }}
            />
          </div>

          <div className="mt-2 sm:mt-3 text-xs text-gray-600 dark:text-gray-400">
            {Math.round((events.filter(e => e.completed).length / events.length) * 100)}% {t('completedEvents')}
          </div>
        </div>
      </div>
    </div>
  );
};

export default TransitEventsManager;