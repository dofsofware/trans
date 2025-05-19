import { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate, Link } from 'react-router-dom';
import { Loader2, Eye, EyeOff, AlertCircle, Globe2, Check, ChevronDown, Moon, Sun } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';
import { useTheme } from '../contexts/ThemeContext';

import darkLogo from '../utils/ShipTrack_dark_mode.png';
import lightLogo from '../utils/ShipTrack_light_mode.png';

const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [rememberMe, setRememberMe] = useState(false);
  const [isLanguageOpen, setIsLanguageOpen] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();
  const { theme, toggleTheme } = useTheme();
  const { language, setLanguage, t } = useLanguage();

  const logo = theme === 'dark' ? darkLogo : lightLogo;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      await login(email, password);
      navigate('/');
    } catch (err) {
      setError(t('invalidCredentials'));
    } finally {
      setIsLoading(false);
    }
  };

  const setDemoAccount = (demoEmail) => {
    setEmail(demoEmail);
    setPassword('demo123'); // Assuming a standard demo password
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const toggleLanguageMenu = () => {
    setIsLanguageOpen(!isLanguageOpen);
  };

  const handleLanguageChange = (lang) => {
    setLanguage(lang);
    setIsLanguageOpen(false);
  };

  // Determine background image class based on theme
  const backgroundImageClass = theme === 'dark'
    ? 'bg-[linear-gradient(rgba(15,23,42,0.8),rgba(15,23,42,0.9))]'
    : 'bg-[linear-gradient(rgba(59,130,246,0.1),rgba(37,99,235,0.2))]';

  return (
    <div
      className={`min-h-screen w-full flex items-center justify-center px-4 py-8 bg-cover bg-center ${backgroundImageClass}`}
      style={{
        backgroundImage: 'url(https://www.basenton.com/wp-content/uploads/2023/11/image-23.png)',
        backgroundSize: 'cover',
        backgroundPosition: 'center'
      }}
    >
      <div className="absolute inset-0 bg-gradient-to-r from-blue-900/80 to-black/70" />

      {/* Language and Theme selectors - discreetly positioned at the top-right corner */}
      <div className="absolute top-4 right-4 flex items-center space-x-2 z-10">
        {/* Theme Toggle */}
        <button
          onClick={toggleTheme}
          className="p-2 rounded-full bg-white/30 dark:bg-gray-800/30 backdrop-blur-sm text-gray-800 dark:text-gray-200 hover:bg-white/40 dark:hover:bg-gray-700/40 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
          aria-label={theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}
        >
          {theme === 'dark' ? <Sun size={18} /> : <Moon size={18} />}
        </button>

        {/* Language Selector */}
        <div className="relative">
          <button
            onClick={toggleLanguageMenu}
            className="flex items-center p-2 rounded-full bg-white/30 dark:bg-gray-800/30 backdrop-blur-sm text-gray-800 dark:text-gray-200 hover:bg-white/40 dark:hover:bg-gray-700/40 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
            aria-label="Change language"
          >
            <Globe2 size={18} />
          </button>

          {isLanguageOpen && (
            <div className="absolute mt-2 right-0 w-32 bg-white dark:bg-gray-700 rounded-lg shadow-lg py-1 z-10 border border-gray-200 dark:border-gray-600 transform origin-top-right transition-all duration-200">
              <button
                onClick={() => handleLanguageChange('en')}
                className="flex items-center justify-between w-full text-left px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors duration-150"
              >
                <span>{t('english')}</span>
                {language === 'en' && <Check size={16} className="text-blue-500" />}
              </button>
              <button
                onClick={() => handleLanguageChange('fr')}
                className="flex items-center justify-between w-full text-left px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors duration-150"
              >
                <span>{t('french')}</span>
                {language === 'fr' && <Check size={16} className="text-blue-500" />}
              </button>
            </div>
          )}
        </div>
      </div>

      <div className="relative max-w-md w-full bg-white/95 dark:bg-gray-800/95 backdrop-blur-sm rounded-2xl shadow-2xl overflow-hidden transition-colors duration-300">
        <div className="px-6 py-8 sm:p-10">
          {/* Logo and title section */}
          <div className="flex flex-col items-center">
            <div className="h-16 flex items-center justify-center">
              <img
                src={logo}
                alt="ShipTrack Logo"
                className="h-12 w-auto transition-all duration-300"
              />
            </div>
            <p className="mt-2 text-center text-sm text-gray-600 dark:text-gray-300">
              {t('portal')}
            </p>
          </div>

          {/* Error message */}
          {error && (
            <div className="mt-4 flex items-center gap-2 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800/30 text-red-700 dark:text-red-400 px-4 py-3 rounded-lg text-sm">
              <AlertCircle size={18} />
              <span>{error}</span>
            </div>
          )}

          {/* Login form */}
          <form className="mt-6 space-y-5" onSubmit={handleSubmit}>
            {/* Email field */}
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                {t('email')}
              </label>
              <div className="mt-1">
                <input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="appearance-none block w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg shadow-sm placeholder-gray-400 dark:placeholder-gray-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 sm:text-sm transition-all"
                  placeholder={t('emailPlaceholder')}
                />
              </div>
            </div>

            {/* Password field with show/hide toggle */}
            <div>
              <div className="flex items-center justify-between">
                <label htmlFor="password" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                  {t('password')}
                </label>
                <div className="text-sm">
                  <Link
                    to="/forgot-password"
                    className="font-medium text-blue-600 hover:text-blue-500 dark:text-blue-400 dark:hover:text-blue-300 transition-colors"
                  >
                    {t('forgotPassword')}
                  </Link>
                </div>
              </div>
              <div className="mt-1 relative">
                <input
                  id="password"
                  name="password"
                  type={showPassword ? "text" : "password"}
                  autoComplete="current-password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="appearance-none block w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg shadow-sm placeholder-gray-400 dark:placeholder-gray-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 pr-10 sm:text-sm transition-all"
                />
                <button
                  type="button"
                  onClick={togglePasswordVisibility}
                  className="absolute inset-y-0 right-0 flex items-center pr-3 text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 focus:outline-none"
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            {/* Remember me checkbox */}
            <div className="flex items-center">
              <input
                id="remember-me"
                name="remember-me"
                type="checkbox"
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 dark:border-gray-600 rounded transition-colors"
              />
              <label htmlFor="remember-me" className="ml-2 block text-sm text-gray-700 dark:text-gray-300">
                {t('rememberMe')}
              </label>
            </div>

            {/* Login button */}
            <div>
              <button
                type="submit"
                disabled={isLoading}
                className="w-full flex justify-center items-center py-3 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 dark:bg-blue-700 dark:hover:bg-blue-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-70 disabled:cursor-not-allowed transition-all"
              >
                {isLoading ? (
                  <>
                    <Loader2 size={18} className="animate-spin mr-2" />
                    <span>{t('loading')}</span>
                  </>
                ) : (
                  t('login')
                )}
              </button>
            </div>
          </form>

          {/* Demo accounts section */}
          <div className="mt-6">
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-300 dark:border-gray-600" />
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-white dark:bg-gray-800 text-gray-500 dark:text-gray-400">{t('demoAccounts')}</span>
              </div>
            </div>

            <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => setDemoAccount('client@example.com')}
                className="w-full inline-flex justify-center py-2 px-4 border border-gray-300 dark:border-gray-600 rounded-lg shadow-sm bg-white dark:bg-gray-700 text-sm font-medium text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-600 transition-colors"
              >
                Cheikh Client
              </button>
              <button
                type="button"
                onClick={() => setDemoAccount('operations@hollytrans.com')}
                className="w-full inline-flex justify-center py-2 px-4 border border-gray-300 dark:border-gray-600 rounded-lg shadow-sm bg-white dark:bg-gray-700 text-sm font-medium text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-600 transition-colors"
              >
                Operations Agent
              </button>
            </div>
          </div>

          {/* Footer */}
          <p className="mt-6 text-center text-xs text-gray-500 dark:text-gray-400">
            {t('allRightsReserved')}
          </p>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;