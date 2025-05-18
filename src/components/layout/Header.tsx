import { Link } from 'react-router-dom';
import { Bell, Menu, Globe2, ChevronDown, Moon, Sun, Check, Search } from 'lucide-react';
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
  const [isSearchOpen, setIsSearchOpen] = useState(false);

  const headerRef = useRef<HTMLDivElement>(null);
  const notificationsButtonRef = useRef<HTMLButtonElement>(null);
  const searchRef = useRef<HTMLDivElement>(null);

  // Notifications data
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

  const unreadCount = notifications.filter(n => n.unread).length;

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (headerRef.current && !headerRef.current.contains(event.target as Node)) {
        setIsProfileOpen(false);
        setIsLanguageOpen(false);
        setIsNotificationsOpen(false);
      }

      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setIsSearchOpen(false);
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

  const toggleSearch = () => {
    setIsSearchOpen(!isSearchOpen);
  };

  const handleLanguageChange = (lang: 'en' | 'fr') => {
    setLanguage(lang);
    setIsLanguageOpen(false);
  };


  return (
    <header className="sticky top-0 z-30 bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 shadow-sm">
      <div className="px-3 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16" ref={headerRef}>
          {/* Left section */}
          <div className="flex items-center space-x-4">
            <button
              onClick={toggleSidebar}
              type="button"
              className="p-2 rounded-md text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 lg:hidden transition-colors duration-200"
              aria-label="Toggle sidebar"
            >
              <Menu size={22} />
            </button>
            <div>
              <Link to="/" className="flex items-center">
                <span className="text-xl font-bold text-blue-900 dark:text-blue-100">Ship<span className="text-blue-600">Track</span></span>
              </Link>
            </div>
          </div>

          {/* Search bar - shows on medium+ screens by default */}
          <div className="hidden md:block flex-grow max-w-md mx-4">
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search size={18} className="text-gray-400 dark:text-gray-500" />
              </div>
              <input
                type="text"
                placeholder={t('search') || 'Search...'}
                className="w-full pl-10 pr-4 py-2 bg-gray-100 dark:bg-gray-700 border-none rounded-full text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-700 dark:text-gray-200 placeholder-gray-500 dark:placeholder-gray-400 transition-all duration-200"
              />
            </div>
          </div>

          {/* Search button - visible only on small screens */}
          <div className="md:hidden">
            <button
              onClick={toggleSearch}
              className="p-2 rounded-md text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors duration-200"
            >
              <Search size={20} />
            </button>
          </div>

          {/* Right section */}
          <div className="flex items-center space-x-1 sm:space-x-3">
            {/* Theme Toggle */}
            <button
              onClick={toggleTheme}
              className="p-2 rounded-md text-gray-500 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
              aria-label={theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}
            >
              {theme === 'dark' ? <Sun size={20} /> : <Moon size={20} />}
            </button>

            {/* Language Selector */}
            <div className="relative">
              <button
                onClick={toggleLanguageMenu}
                className="flex items-center space-x-1 p-2 rounded-md text-gray-500 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
                aria-label="Change language"
              >
                <Globe2 size={20} />
                <span className="hidden sm:inline text-sm font-medium">{language.toUpperCase()}</span>
                <ChevronDown size={14} className="hidden sm:block" />
              </button>

              {isLanguageOpen && (
                <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-gray-700 rounded-lg shadow-lg py-1 z-10 border border-gray-200 dark:border-gray-600 transform origin-top-right transition-all duration-200">
                  <button
                    onClick={() => handleLanguageChange('en')}
                    className="flex items-center w-full text-left px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors duration-150"
                  >
                    <span className="mr-2 font-medium">English</span>
                    {language === 'en' && <Check size={16} className="text-blue-500" />}
                  </button>
                  <button
                    onClick={() => handleLanguageChange('fr')}
                    className="flex items-center w-full text-left px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors duration-150"
                  >
                    <span className="mr-2 font-medium">Français</span>
                    {language === 'fr' && <Check size={16} className="text-blue-500" />}
                  </button>
                </div>
              )}
            </div>

            {/* Notifications */}
            <div className="relative">
              <button
                ref={notificationsButtonRef}
                onClick={toggleNotifications}
                className="p-2 rounded-md text-gray-500 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors duration-200 relative focus:outline-none focus:ring-2 focus:ring-blue-500"
                aria-label="Notifications"
              >
                <Bell size={20} />
                {unreadCount > 0 && (
                  <span className="absolute -top-1 -right-1 flex items-center justify-center h-5 w-5 text-xs bg-red-500 text-white font-medium rounded-full">{unreadCount}</span>
                )}
              </button>

              {isNotificationsOpen && (
                <div
                  className="fixed md:absolute inset-x-0 md:inset-auto md:right-0 top-16 md:top-full mt-1 w-[95%] md:w-96 bg-white dark:bg-gray-700 rounded-lg shadow-xl py-1 z-10 border border-gray-200 dark:border-gray-600 mx-auto md:mx-0 transform origin-top transition-all duration-200"
                  style={{
                    maxHeight: 'calc(100vh - 80px)',
                    overflowY: 'auto'
                  }}
                >
                  <div className="px-4 py-3 border-b border-gray-200 dark:border-gray-600 flex justify-between items-center">
                    <div>
                      <h3 className="text-sm font-semibold text-gray-900 dark:text-gray-100">{t('notifications')}</h3>
                      <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                        {t('unread_count', { count: unreadCount })}
                      </p>
                    </div>
                    <button
                      onClick={() => {/* Handle mark all as read */}}
                      className="p-2 rounded-md text-gray-400 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors duration-150 focus:outline-none focus:ring-2 focus:ring-blue-500"
                      title={t('mark_all_as_read')}
                    >
                      <Check size={18} />
                    </button>
                  </div>
                  <div className="max-h-[calc(100vh-200px)] overflow-y-auto">
                    {notifications.length > 0 ? (
                      notifications.map((notification) => (
                        <div
                          key={notification.id}
                          className={`px-4 py-3 hover:bg-gray-50 dark:hover:bg-gray-600 cursor-pointer border-b border-gray-100 dark:border-gray-600 last:border-0 transition-colors duration-150 ${notification.unread ? 'bg-blue-50 dark:bg-gray-600/50' : ''}`}
                        >
                          <div className="flex items-start">
                            <div className="flex-1 min-w-0">
                              <p className={`text-sm font-medium ${notification.unread ? 'text-blue-700 dark:text-blue-300' : 'text-gray-800 dark:text-gray-200'}`}>
                                {notification.title}
                              </p>
                              <p className="text-sm text-gray-600 dark:text-gray-400 mt-0.5 line-clamp-2">
                                {notification.message}
                              </p>
                              <p className="text-xs text-gray-500 dark:text-gray-500 mt-1">
                                {notification.time}
                              </p>
                            </div>
                            {notification.unread && (
                              <div className="ml-3 flex-shrink-0">
                                <div className="w-2 h-2 bg-blue-600 dark:bg-blue-500 rounded-full"></div>
                              </div>
                            )}
                          </div>
                        </div>
                      ))
                    ) : (
                      <div className="py-6 px-4 text-center">
                        <p className="text-gray-500 dark:text-gray-400 text-sm">{t('no_notifications') || 'No notifications'}</p>
                      </div>
                    )}
                  </div>
                  <div className="px-4 py-3 border-t border-gray-200 dark:border-gray-600 bg-gray-50 dark:bg-gray-600">
                    <Link
                      to="/notifications"
                      className="block text-sm text-center text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 font-medium transition-colors duration-150"
                      onClick={() => setIsNotificationsOpen(false)}
                    >
                      {t('view_all_notifications')}
                    </Link>
                  </div>
                </div>
              )}
            </div>

            {/* Profile */}
            <div className="relative">
              <button
                onClick={toggleProfileMenu}
                className="flex items-center space-x-2 focus:outline-none focus:ring-2 focus:ring-blue-500 rounded-full p-1"
                aria-label="User menu"
              >
                <div className="h-8 w-8 rounded-full overflow-hidden border-2 border-gray-200 dark:border-gray-600 flex-shrink-0">
                  {user.avatar ? (
                    <img
                      src={user.avatar}
                      alt={user.name}
                      className="h-full w-full object-cover"
                    />
                  ) : (
                    <div className="h-full w-full bg-blue-600 dark:bg-blue-700 flex items-center justify-center">
                      <span className="text-white font-medium">{user.name.charAt(0)}</span>
                    </div>
                  )}
                </div>
                <div className="hidden md:flex items-center">
                  <span className="text-sm font-medium text-gray-700 dark:text-gray-200">{user.name}</span>
                  <ChevronDown size={14} className="text-gray-500 dark:text-gray-400 ml-1" />
                </div>
              </button>

              {isProfileOpen && (
                <div className="absolute right-0 mt-2 w-56 bg-white dark:bg-gray-700 rounded-lg shadow-lg py-1 z-10 border border-gray-200 dark:border-gray-600 transform origin-top-right transition-all duration-200">
                  <div className="px-4 py-3 border-b border-gray-200 dark:border-gray-600">
                    <p className="text-sm font-medium text-gray-900 dark:text-white">{user.name}</p>
                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-1 truncate">{user?.email || 'user@example.com'}</p>
                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-1 truncate">{user?.identifiant}</p>
                  </div>
                  <Link
                    to="/profile"
                    className="flex items-center px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors duration-150"
                    onClick={() => setIsProfileOpen(false)}
                  >
                    {t('profile')}
                  </Link>
                  <Link
                    to="/settings"
                    className="flex items-center px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors duration-150"
                    onClick={() => setIsProfileOpen(false)}
                  >
                    {t('settings')}
                  </Link>
                  <div className="border-t border-gray-200 dark:border-gray-600 mt-1"></div>
                  <button
                    onClick={() => {
                      logout();
                      setIsProfileOpen(false);
                    }}
                    className="flex items-center w-full text-left px-4 py-2 text-sm text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors duration-150"
                  >
                    {t('signOut')}
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Mobile search - expandable search bar */}
      {isSearchOpen && (
        <div
          ref={searchRef}
          className="md:hidden px-3 pb-3 bg-white dark:bg-gray-800 transform transition-all duration-300 ease-in-out"
        >
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search size={18} className="text-gray-400 dark:text-gray-500" />
            </div>
            <input
              type="text"
              placeholder={t('search') || 'Search...'}
              className="w-full pl-10 pr-4 py-2 bg-gray-100 dark:bg-gray-700 border-none rounded-full text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-700 dark:text-gray-200 placeholder-gray-500 dark:placeholder-gray-400 transition-all duration-200"
              autoFocus
            />
          </div>
        </div>
      )}
    </header>
  );
};

export default Header;