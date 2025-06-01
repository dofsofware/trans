import { useState } from 'react';
import { useLanguage } from '../../contexts/LanguageContext';
import { useTheme } from '../../contexts/ThemeContext';
import { Bell, Check, X, Clock, AlertCircle, Package, FileText, CreditCard, MessageSquare } from 'lucide-react';
import backImage from '../../utils/invoices.png';

const NotificationsPage = () => {
  const { t } = useLanguage();
  const { theme } = useTheme();
  const shadowClass = theme === 'dark' ? 'shadow-lg shadow-gray-900/30' : 'shadow-lg shadow-gray-200/30';
  const hoverShadow = theme === 'dark' ? 'hover:shadow-xl hover:shadow-gray-900/40' : 'hover:shadow-xl hover:shadow-gray-300/40';
  const textPrimary = theme === 'dark' ? 'text-white' : 'text-gray-900';
  const textSecondary = theme === 'dark' ? 'text-gray-300' : 'text-gray-600';
  const [notifications, setNotifications] = useState([
    {
      id: 1,
      title: 'Shipment Status Update',
      message: 'Your shipment HT-10001 has arrived at the warehouse',
      time: '5 minutes ago',
      unread: true,
      type: 'shipment'
    },
    {
      id: 2,
      title: 'Document Required',
      message: 'Please upload customs declaration for shipment HT-10002',
      time: '1 hour ago',
      unread: true,
      type: 'document'
    },
    {
      id: 3,
      title: 'Payment Received',
      message: 'Payment for invoice #INV-2023-001 has been processed',
      time: '2 hours ago',
      unread: false,
      type: 'payment'
    },
    {
      id: 4,
      title: 'New Message',
      message: 'You have a new message from your logistics agent',
      time: '3 hours ago',
      unread: false,
      type: 'message'
    },
    {
      id: 5,
      title: 'Shipment Delivered',
      message: 'Shipment HT-10003 has been successfully delivered',
      time: '1 day ago',
      unread: false,
      type: 'shipment'
    },
    {
      id: 6,
      title: 'Price Update',
      message: 'New shipping rates will be effective from next month',
      time: '2 days ago',
      unread: false,
      type: 'alert'
    }
  ]);

  const getNotificationIcon = (type) => {
    switch (type) {
      case 'shipment':
        return <Package className="h-5 w-5" />;
      case 'document':
        return <FileText className="h-5 w-5" />;
      case 'payment':
        return <CreditCard className="h-5 w-5" />;
      case 'message':
        return <MessageSquare className="h-5 w-5" />;
      case 'alert':
        return <AlertCircle className="h-5 w-5" />;
      default:
        return <Bell className="h-5 w-5" />;
    }
  };

  const markAllAsRead = () => {
    setNotifications(prev =>
      prev.map(notification => ({ ...notification, unread: false }))
    );
  };

  const markAsRead = (id) => {
    setNotifications(prev =>
      prev.map(notification =>
        notification.id === id ? { ...notification, unread: false } : notification
      )
    );
  };

  const dismissNotification = (id) => {
    setNotifications(prev =>
      prev.filter(notification => notification.id !== id)
    );
  };

  const unreadCount = notifications.filter(n => n.unread).length;

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* New Header Section */}
      <div 
        className={`mb-8 rounded-xl p-6 ${shadowClass} transform transition-all duration-500 ${hoverShadow} hover:scale-[1.01] animate-fadeIn`}
        style={{
          backgroundImage: theme === 'dark' 
            ? `linear-gradient(to right, rgba(17, 24, 39, 0.85), rgba(31, 41, 55, 0.85)), url(${backImage})`
            : `linear-gradient(to right, rgba(239, 246, 255, 0.85), rgba(224, 231, 255, 0.85)), url(${backImage})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat'
        }}
      >
        <div className="flex items-center justify-between">
          <div className="p-4">
            <h1 className={`text-2xl md:text-3xl font-bold ${textPrimary}`}>
              {t('notifications')}
            </h1>
            <p className={`mt-2 ${textSecondary} text-lg`}>{t('notifications_description')}</p>
          </div>
          <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${
            theme === 'dark' 
              ? 'bg-blue-900/80 text-blue-200' 
              : 'bg-blue-100 text-blue-800'
          }`}>
            {unreadCount > 0 ? t('unread_count', { count: unreadCount }) : t('all_read')}
          </span>
        </div>
      </div>

      <div className={`shadow rounded-lg border overflow-hidden ${
        theme === 'dark' 
          ? 'bg-gray-800 border-gray-700' 
          : 'bg-white border-gray-200'
      }`}>
        <div className="px-4 py-5 sm:px-6 flex flex-wrap justify-between items-center gap-4">
          <div>
            <h3 className={`text-lg leading-6 font-medium ${
              theme === 'dark' ? 'text-white' : 'text-gray-900'
            }`}>
              {t('all_notifications')}
            </h3>
            <p className={`mt-1 text-sm ${
              theme === 'dark' ? 'text-gray-400' : 'text-gray-500'
            }`}>
              {unreadCount > 0
                ? t('unread_count', { count: unreadCount })
                : t('no_unread_notifications')}
            </p>
          </div>
          {unreadCount > 0 && (
            <button
              onClick={markAllAsRead}
              type="button"
              className="inline-flex items-center px-3 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
            >
              <Check className="h-4 w-4 mr-2" />
              {t('mark_all_as_read')}
            </button>
          )}
        </div>
        <div className={`border-t ${
          theme === 'dark' ? 'border-gray-700' : 'border-gray-200'
        }`}>
          {notifications.length > 0 ? (
            <ul className={`divide-y ${
              theme === 'dark' ? 'divide-gray-700' : 'divide-gray-200'
            }`}>
              {notifications.map((notification) => (
                <li
                  key={notification.id}
                  className={`relative transition-all ${
                    notification.unread 
                      ? theme === 'dark' 
                        ? 'bg-blue-900/20' 
                        : 'bg-blue-50'
                      : ''
                  }`}
                >
                  <div className="px-4 py-4 sm:px-6 flex items-start">
                    <div className={`flex-shrink-0 p-2 rounded-full ${
                      notification.unread
                        ? theme === 'dark'
                          ? 'bg-blue-900/40 text-blue-300'
                          : 'bg-blue-100 text-blue-600'
                        : theme === 'dark'
                          ? 'bg-gray-700 text-gray-400'
                          : 'bg-gray-100 text-gray-500'
                    }`}>
                      {getNotificationIcon(notification.type)}
                    </div>
                    <div className="ml-3 flex-1 min-w-0">
                      <div className="flex items-center justify-between mb-1">
                        <h4 className={`text-sm font-medium truncate ${
                          notification.unread 
                            ? theme === 'dark' 
                              ? 'text-blue-200' 
                              : 'text-blue-900'
                            : theme === 'dark' 
                              ? 'text-white' 
                              : 'text-gray-900'
                        }`}>
                          {notification.title}
                        </h4>
                        <div className="flex items-center ml-2 flex-shrink-0">
                          <span className={`flex items-center text-xs ${
                            theme === 'dark' ? 'text-gray-400' : 'text-gray-500'
                          }`}>
                            <Clock className="h-3 w-3 mr-1" />
                            {notification.time}
                          </span>
                        </div>
                      </div>
                      <p className={`text-sm line-clamp-2 ${
                        theme === 'dark' ? 'text-gray-300' : 'text-gray-700'
                      }`}>
                        {notification.message}
                      </p>
                      <div className="mt-2 flex justify-between items-center">
                        {notification.unread && (
                          <button
                            onClick={() => markAsRead(notification.id)}
                            className={`text-xs font-medium flex items-center ${
                              theme === 'dark'
                                ? 'text-blue-300 hover:text-blue-200'
                                : 'text-blue-600 hover:text-blue-800'
                            }`}
                          >
                            <Check className="h-3 w-3 mr-1" />
                            {t('mark_as_read')}
                          </button>
                        )}
                        <button
                          onClick={() => dismissNotification(notification.id)}
                          className={`text-xs flex items-center ml-auto ${
                            theme === 'dark'
                              ? 'text-gray-400 hover:text-gray-300'
                              : 'text-gray-500 hover:text-gray-700'
                          }`}
                        >
                          <X className="h-3 w-3 mr-1" />
                          {t('dismiss')}
                        </button>
                      </div>
                    </div>
                    {notification.unread && (
                      <div className="ml-3 flex-shrink-0">
                        <div className="w-2 h-2 bg-blue-600 rounded-full"></div>
                      </div>
                    )}
                  </div>
                </li>
              ))}
            </ul>
          ) : (
            <div className="px-4 py-12 text-center">
              <Bell className={`mx-auto h-12 w-12 ${
                theme === 'dark' ? 'text-gray-500' : 'text-gray-400'
              }`} />
              <h3 className={`mt-2 text-sm font-medium ${
                theme === 'dark' ? 'text-white' : 'text-gray-900'
              }`}>
                {t('no_notifications')}
              </h3>
              <p className={`mt-1 text-sm ${
                theme === 'dark' ? 'text-gray-400' : 'text-gray-500'
              }`}>
                {t('no_notifications_description')}
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default NotificationsPage;