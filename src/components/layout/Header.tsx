import { Bell, Menu, MessageSquare, Globe2, ChevronDown } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { useLanguage } from '../../contexts/LanguageContext';
import { Link } from 'react-router-dom';
import { User } from '../../types/user';
import { useState } from 'react';

interface HeaderProps {
  toggleSidebar: () => void;
  user: User;
}

const Header = ({ toggleSidebar, user }: HeaderProps) => {
  const { logout } = useAuth();
  const { language, setLanguage, t } = useLanguage();
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isLanguageOpen, setIsLanguageOpen] = useState(false);

  const toggleProfileMenu = () => {
    setIsProfileOpen(!isProfileOpen);
    if (isLanguageOpen) setIsLanguageOpen(false);
  };

  const toggleLanguageMenu = () => {
    setIsLanguageOpen(!isLanguageOpen);
    if (isProfileOpen) setIsProfileOpen(false);
  };

  const handleLanguageChange = (lang: 'en' | 'fr') => {
    setLanguage(lang);
    setIsLanguageOpen(false);
  };

  return (
    <header className="sticky top-0 z-30 bg-white border-b border-gray-200">
      <div className="px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center">
            <button 
              onClick={toggleSidebar}
              type="button" 
              className="text-gray-500 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-blue-500 lg:hidden"
            >
              <Menu size={24} />
            </button>
            <div className="ml-4 lg:ml-0">
              <Link to="/" className="flex items-center">
                <span className="text-xl font-bold text-blue-900">Holly<span className="text-blue-600">Trans</span></span>
              </Link>
            </div>
          </div>

          <div className="flex items-center space-x-4">
            {/* Language Selector */}
            <div className="relative">
              <button
                onClick={toggleLanguageMenu}
                className="flex items-center space-x-2 text-gray-600 hover:text-gray-900"
              >
                <Globe2 size={20} />
                <span className="text-sm font-medium">{language.toUpperCase()}</span>
                <ChevronDown size={16} />
              </button>

              {isLanguageOpen && (
                <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-10 border border-gray-200">
                  <button
                    onClick={() => handleLanguageChange('en')}
                    className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                  >
                    English
                  </button>
                  <button
                    onClick={() => handleLanguageChange('fr')}
                    className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                  >
                    Français
                  </button>
                </div>
              )}
            </div>

            <div className="flex-shrink-0 relative">
              <button className="p-1 text-gray-400 rounded-full hover:bg-gray-100 relative">
                <span className="absolute top-0 right-0 w-2 h-2 bg-red-500 rounded-full"></span>
                <Bell size={20} />
              </button>
            </div>
            
            <div className="flex-shrink-0 relative">
              <Link to="/messages" className="p-1 text-gray-400 rounded-full hover:bg-gray-100 relative">
                <span className="absolute top-0 right-0 w-2 h-2 bg-red-500 rounded-full"></span>
                <MessageSquare size={20} />
              </Link>
            </div>

            <div className="relative flex-shrink-0">
              <button 
                onClick={toggleProfileMenu}
                className="flex items-center space-x-3 focus:outline-none"
              >
                <div className="h-8 w-8 rounded-full overflow-hidden border-2 border-gray-200">
                  {user.avatar ? (
                    <img 
                      src={user.avatar} 
                      alt={user.name} 
                      className="h-full w-full object-cover"
                    />
                  ) : (
                    <div className="h-full w-full bg-blue-100 flex items-center justify-center">
                      <span className="text-blue-800 font-medium">{user.name.charAt(0)}</span>
                    </div>
                  )}
                </div>
                <div className="hidden md:block text-sm font-medium text-gray-700">
                  {user.name}
                </div>
                <ChevronDown size={16} className="text-gray-500" />
              </button>

              {isProfileOpen && (
                <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-10 border border-gray-200">
                  <Link 
                    to="/profile" 
                    className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                    onClick={() => setIsProfileOpen(false)}
                  >
                    {t('profile')}
                  </Link>
                  <Link 
                    to="/settings" 
                    className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                    onClick={() => setIsProfileOpen(false)}
                  >
                    {t('settings')}
                  </Link>
                  <button 
                    onClick={() => {
                      logout();
                      setIsProfileOpen(false);
                    }}
                    className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
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