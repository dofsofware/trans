import { useState } from 'react';
import { useLanguage } from '../../contexts/LanguageContext';
import { Bell, Check } from 'lucide-react';

const NotificationsPage = () => {
  const { t } = useLanguage();
  const [notifications] = useState([
    {
      id: 1,
      title: 'Shipment Status Update',
      message: 'Your shipment HT-10001 has arrived at the warehouse',
      time: '5 minutes ago',
      unread: true
    },
    {
      id: 2,
      title: 'Document Required',
      message: 'Please upload customs declaration for shipment HT-10002',
      time: '1 hour ago',
      unread: true
    },
    {
      id: 3,
      title: 'Payment Received',
      message: 'Payment for invoice #INV-2023-001 has been processed',
      time: '2 hours ago',
      unread: false
    },
    {
      id: 4,
      title: 'New Message',
      message: 'You have a new message from your logistics agent',
      time: '3 hours ago',
      unread: false
    },
    {
      id: 5,
      title: 'Shipment Delivered',
      message: 'Shipment HT-10003 has been successfully delivered',
      time: '1 day ago',
      unread: false
    },
    {
      id: 6,
      title: 'Price Update',
      message: 'New shipping rates will be effective from next month',
      time: '2 days ago',
      unread: false
    }
  ]);

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">{t('notifications')}</h1>
        <p className="mt-1 text-gray-600">
          {t('notifications_description')}
        </p>
      </div>

      <div className="bg-white shadow overflow-hidden sm:rounded-lg border border-gray-200">
        <div className="px-4 py-5 sm:px-6 flex justify-between items-center">
          <div>
            <h3 className="text-lg leading-6 font-medium text-gray-900">
              {t('all_notifications')}
            </h3>
            <p className="mt-1 max-w-2xl text-sm text-gray-500">
              {t('unread_count', { count: notifications.filter(n => n.unread).length })}
            </p>
          </div>
          <button
            type="button"
            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-blue-600 bg-blue-100 hover:bg-blue-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            <Check className="h-4 w-4 mr-2" />
            {t('mark_all_as_read')}
          </button>
        </div>
        <div className="border-t border-gray-200">
          {notifications.length > 0 ? (
            <div className="divide-y divide-gray-200">
              {notifications.map((notification) => (
                <div 
                  key={notification.id}
                  className={`px-4 py-4 sm:px-6 hover:bg-gray-50 ${
                    notification.unread ? 'bg-blue-50 dark:bg-blue-900/20' : ''
                  }`}
                >
                  <div className="flex items-start">
                    <div className="flex-shrink-0">
                      <Bell className={`h-5 w-5 ${notification.unread ? 'text-blue-600' : 'text-gray-400'}`} />
                    </div>
                    <div className="ml-3 flex-1">
                      <p className={`text-sm font-medium ${
                        notification.unread ? 'text-blue-900 dark:text-blue-100' : 'text-gray-900 dark:text-gray-100'
                      }`}>
                        {notification.title}
                      </p>
                      <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">
                        {notification.message}
                      </p>
                      <p className="mt-1 text-xs text-gray-500 dark:text-gray-500">
                        {notification.time}
                      </p>
                    </div>
                    {notification.unread && (
                      <div className="ml-3 flex-shrink-0">
                        <div className="w-2 h-2 bg-blue-600 dark:bg-blue-400 rounded-full"></div>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="px-4 py-12 text-center">
              <Bell className="mx-auto h-12 w-12 text-gray-400" />
              <h3 className="mt-2 text-sm font-medium text-gray-900">{t('no_notifications')}</h3>
              <p className="mt-1 text-sm text-gray-500">{t('no_notifications_description')}</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default NotificationsPage;