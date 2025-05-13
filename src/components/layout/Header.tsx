import { Link } from 'react-router-dom';
import { Bell, Menu, MessageSquare, Globe2, ChevronDown, Moon, Sun } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { useLanguage } from '../../contexts/LanguageContext';
import { useTheme } from '../../contexts/ThemeContext';
import { User } from '../../types/user';
import { useState, useEffect, useRef } from 'react';

interface HeaderProps {
  toggleSidebar: () => void;
  user: User;
}

const Header = ({ toggleSidebar, user }: HeaderProps) => {
  const { logout } = useAuth();
  const { language, setLanguage, t } = useLanguage();
  const { theme, toggleTheme } = useTheme();
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isLanguageOpen, setIsLanguageOpen] = useState(false);
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);

  const headerRef = useRef<HTMLDivElement>(null);
  const notificationsButtonRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (headerRef.current && !headerRef.current.contains(event.target as Node)) {
        setIsProfileOpen(false);
        setIsLanguageOpen(false);
        setIsNotificationsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const toggleProfileMenu = () => {
    setIsProfileOpen(!isProfileOpen);
    if (isLanguageOpen) setIsLanguageOpen(false);
    if (isNotificationsOpen) setIsNotificationsOpen(false);
  };

  const toggleLanguageMenu = () => {
    setIsLanguageOpen(!isLanguageOpen);
    if (isProfileOpen) setIsProfileOpen(false);
    if (isNotificationsOpen) setIsNotificationsOpen(false);
  };

  const toggleNotifications = () => {
    setIsNotificationsOpen(!isNotificationsOpen);
    if (isProfileOpen) setIsProfileOpen(false);
    if (isLanguageOpen) setIsLanguageOpen(false);
  };

  const handleLanguageChange = (lang: 'en' | 'fr') => {
    setLanguage(lang);
    setIsLanguageOpen(false);
  };

  const notifications = [
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
  ];

  return (
    <header className="sticky top-0 z-30 bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
      <div className="px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16" ref={headerRef}>
          <div className="flex items-center">
            <button 
              onClick={toggleSidebar}
              type="button" 
              className="text-gray-500 dark:text-gray-400 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-blue-500 lg:hidden"
            >
              <Menu size={24} />
            </button>
            <div className="ml-4 lg:ml-0">
              <Link to="/" className="flex items-center">
                <span className="text-xl font-bold text-blue-900 dark:text-blue-100">Ship<span className="text-blue-600">Track</span></span>
              </Link>
            </div>
          </div>

          <div className="flex items-center space-x-4">
            {/* Theme Toggle */}
            <button
              onClick={toggleTheme}
              className="p-1 text-gray-400 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full"
            >
              {theme === 'dark' ? <Sun size={20} /> : <Moon size={20} />}
            </button>

            {/* Language Selector */}
            <div className="relative">
              <button
                onClick={toggleLanguageMenu}
                className="flex items-center space-x-2 text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white"
              >
                <Globe2 size={20} />
                <span className="text-sm font-medium">{language.toUpperCase()}</span>
                <ChevronDown size={16} />
              </button>

              {isLanguageOpen && (
                <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-gray-700 rounded-md shadow-lg py-1 z-10 border border-gray-200 dark:border-gray-600">
                  <button
                    onClick={() => handleLanguageChange('en')}
                    className="block w-full text-left px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-600"
                  >
                    English
                  </button>
                  <button
                    onClick={() => handleLanguageChange('fr')}
                    className="block w-full text-left px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-600"
                  >
                    Français
                  </button>
                </div>
              )}
            </div>

            {/* Notifications */}
            <div className="flex-shrink-0 relative flex items-center">
              <button 
                ref={notificationsButtonRef}
                onClick={toggleNotifications}
                className="inline-flex items-center justify-center w-8 h-8 text-gray-400 dark:text-gray-300 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 relative focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <Bell size={20} />
                <span className="absolute -top-1 -right-1 w-2 h-2 bg-red-500 rounded-full"></span>
              </button>

              {isNotificationsOpen && (
                <div 
                  className="fixed md:absolute inset-x-0 md:inset-auto md:right-0 top-16 md:top-full mt-2 w-[95%] md:w-96 bg-white dark:bg-gray-700 rounded-lg shadow-lg py-1 z-10 border border-gray-200 dark:border-gray-600 mx-auto md:mx-0"
                  style={{
                    maxHeight: 'calc(100vh - 80px)',
                    overflowY: 'auto'
                  }}
                >
                  <div className="px-4 py-3 border-b border-gray-200 dark:border-gray-600">
                    <h3 className="text-sm font-semibold text-gray-900 dark:text-gray-100">Notifications</h3>
                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">You have {notifications.filter(n => n.unread).length} unread notifications</p>
                  </div>
                  <div className="max-h-[calc(100vh-200px)] overflow-y-auto">
                    {notifications.map((notification) => (
                      <div 
                        key={notification.id}
                        className={`px-4 py-3 hover:bg-gray-50 dark:hover:bg-gray-600 cursor-pointer ${notification.unread ? 'bg-blue-50 dark:bg-blue-900/20' : ''}`}
                      >
                        <div className="flex items-start">
                          <div className="flex-1 min-w-0">
                            <p className={`text-sm font-medium ${notification.unread ? 'text-blue-900 dark:text-blue-100' : 'text-gray-900 dark:text-gray-100'}`}>
                              {notification.title}
                            </p>
                            <p className="text-sm text-gray-500 dark:text-gray-400 mt-0.5">
                              {notification.message}
                            </p>
                            <p className="text-xs text-gray-400 dark:text-gray-500 mt-1">
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
                  <div className="px-4 py-3 border-t border-gray-200 dark:border-gray-600 bg-gray-50 dark:bg-gray-600">
                    <Link
                      to="/notifications"
                      className="block text-sm text-center text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 font-medium"
                      onClick={() => setIsNotificationsOpen(false)}
                    >
                      View all notifications
                    </Link>
                  </div>
                </div>
              )}
            </div>
            
            <div className="flex-shrink-0 relative flex items-center">
              <Link to="/messages" className="inline-flex items-center justify-center w-8 h-8 text-gray-400 dark:text-gray-300 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 relative">
                <MessageSquare size={20} />
              </Link>
              <span className="absolute top-0 right-0 w-2 h-2 bg-red-500 rounded-full"></span>
            </div>

            <div className="relative flex-shrink-0">
              <button 
                onClick={toggleProfileMenu}
                className="flex items-center space-x-3 focus:outline-none"
              >
                <div className="h-8 w-8 rounded-full overflow-hidden border-2 border-gray-200 dark:border-gray-600">
                  {user.avatar ? (
                    <img 
                      src={user.avatar} 
                      alt={user.name} 
                      className="h-full w-full object-cover"
                    />
                  ) : (
                    <div className="h-full w-full bg-blue-100 dark:bg-blue-900 flex items-center justify-center">
                      <span className="text-blue-800 dark:text-blue-200 font-medium">{user.name.charAt(0)}</span>
                    </div>
                  )}
                </div>
                <div className="hidden md:block text-sm font-medium text-gray-700 dark:text-gray-200">
                  {user.name}
                </div>
                <ChevronDown size={16} className="text-gray-500 dark:text-gray-400" />
              </button>

              {isProfileOpen && (
                <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-gray-700 rounded-md shadow-lg py-1 z-10 border border-gray-200 dark:border-gray-600">
                  <Link 
                    to="/profile" 
                    className="block px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-600"
                    onClick={() => setIsProfileOpen(false)}
                  >
                    {t('profile')}
                  </Link>
                  <Link 
                    to="/settings" 
                    className="block px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-600"
                    onClick={() => setIsProfileOpen(false)}
                  >
                    {t('settings')}
                  </Link>
                  <button 
                    onClick={() => {
                      logout();
                      setIsProfileOpen(false);
                    }}
                    className="block w-full text-left px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-600"
                  >
                    {t('signOut')}
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;