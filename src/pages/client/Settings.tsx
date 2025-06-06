import { useState, useCallback } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { useTheme } from '../../contexts/ThemeContext';
import { User, Globe, Bell, ShieldCheck, Camera, Save } from 'lucide-react';
import { useLanguage } from '../../contexts/LanguageContext';
import AvatarUploader from '../../components/common/AvatarUploader';
import { PasswordChangeModal } from '../../components/common/PasswordChangeModal';
import backImage from '../../utils/settings.png';

const SettingsPage = () => {
  const { user, updateUser } = useAuth();
  const { theme } = useTheme();
  const { t, language, setLanguage } = useLanguage();
  const [name, setName] = useState(user?.name || '');
  const [email, setEmail] = useState(user?.email || '');
  const [notifications, setNotifications] = useState(true);
  const [activeTab, setActiveTab] = useState('profile');
  const [avatar, setAvatar] = useState(user?.avatar || null);
  const [isPasswordModalOpen, setIsPasswordModalOpen] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    // Handle settings update
    updateUser({
      name,
      email,
      avatar
    });
  };

  const handleAvatarSave = useCallback((avatarData) => {
    setAvatar(avatarData.preview);
    console.log('Avatar data:', avatarData);
  }, []);

  const openPasswordModal = () => {
    setIsPasswordModalOpen(true);
  };

  const closePasswordModal = () => {
    setIsPasswordModalOpen(false);
  };

  const tabs = [
    { id: 'profile', label: t('profile'), icon: <User size={18} /> },
    { id: 'preferences', label: t('preferences'), icon: <Globe size={18} /> },
    { id: 'security', label: t('security'), icon: <ShieldCheck size={18} /> },
  ];

  // Theme-aware classes
  const isDark = theme === 'dark';
  const shadowClass = isDark ? 'shadow-gray-900/20' : 'shadow-sm';
  const hoverShadow = isDark ? 'hover:shadow-gray-900/30' : 'hover:shadow-md';
  const textPrimary = isDark ? 'text-white' : 'text-gray-900';
  const textSecondary = isDark ? 'text-gray-300' : 'text-gray-600';

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
      {/* New Header Section */}
      <div 
        className={`mb-8 rounded-xl p-6 ${shadowClass} transform transition-all duration-500 ${hoverShadow} hover:scale-[1.01] animate-fadeIn`}
        style={{
          backgroundImage: isDark 
            ? `linear-gradient(to right, rgba(17, 24, 39, 0.85), rgba(31, 41, 55, 0.85)), url(${backImage})`
            : `linear-gradient(to right, rgba(239, 246, 255, 0.85), rgba(224, 231, 255, 0.85)), url(${backImage})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat'
        }}
      >
        <div className="p-4">
          <h1 className={`text-2xl md:text-3xl font-bold ${textPrimary}`}>
            {t('settings')}
          </h1>
          <p className={`mt-2 ${textSecondary} text-lg`}>{t('manage_account_preferences')}</p>
        </div>
      </div>

      {/* Tabs for mobile view */}
      <div className="sm:hidden mb-6">
        <label htmlFor="settings-tabs" className="sr-only">
          Select a tab
        </label>
        <select
          id="settings-tabs"
          name="settings-tabs"
          className={`block w-full pl-3 pr-10 py-2 text-base focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md ${
            isDark 
              ? 'bg-gray-800 border-gray-600 text-white' 
              : 'bg-white border-gray-300 text-gray-900'
          }`}
          value={activeTab}
          onChange={(e) => setActiveTab(e.target.value)}
        >
          {tabs.map((tab) => (
            <option key={tab.id} value={tab.id}>
              {tab.label}
            </option>
          ))}
        </select>
      </div>

      {/* Tabs for desktop view */}
      <div className="hidden sm:block mb-6">
        <div className={`border-b ${isDark ? 'border-gray-700' : 'border-gray-200'}`}>
          <nav className="-mb-px flex space-x-8" aria-label="Tabs">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`
                  flex items-center whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm transition-colors
                  ${activeTab === tab.id
                    ? 'border-blue-500 text-blue-600'
                    : isDark
                      ? 'border-transparent text-gray-400 hover:text-gray-200 hover:border-gray-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }
                `}
              >
                <span className="mr-2">{tab.icon}</span>
                {tab.label}
              </button>
            ))}
          </nav>
        </div>
      </div>

      <div className={`shadow rounded-xl border overflow-hidden ${
        isDark 
          ? 'bg-gray-800 border-gray-700' 
          : 'bg-white border-gray-200'
      }`}>
        <form onSubmit={handleSubmit} className={`divide-y ${isDark ? 'divide-gray-700' : 'divide-gray-200'}`}>
          {/* Profile Section */}
          <div className={activeTab === 'profile' ? 'block' : 'hidden'}>
            <div className="px-6 py-6">
              <h3 className={`text-lg font-medium leading-6 flex items-center ${
                isDark ? 'text-white' : 'text-gray-900'
              }`}>
                <User className="mr-2 text-blue-600" size={20} />
                {t('profile')}
              </h3>
              <p className={`mt-1 text-sm ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
                {t('update_personal_information')}
              </p>
            </div>

            <div className={`px-6 py-5 ${isDark ? 'bg-gray-900/50' : 'bg-gray-50'}`}>
              <div className="flex flex-col sm:flex-row items-center sm:space-x-6 mb-6">
                <div className={`h-24 w-24 rounded-full flex items-center justify-center overflow-hidden relative group mb-4 sm:mb-0 ${
                  isDark ? 'bg-blue-900/30' : 'bg-blue-100'
                }`}>
                  {avatar ? (
                    <img
                      src={avatar}
                      alt={name || user?.name || 'User avatar'}
                      className="h-full w-full object-cover"
                    />
                  ) : (
                    <User className="h-10 w-10 text-blue-600" />
                  )}
                  <div className="absolute inset-0 bg-black bg-opacity-40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                    <Camera className="h-6 w-6 text-white" />
                  </div>
                </div>
                <div>
                  <h4 className={`text-base font-medium mb-1 ${
                    isDark ? 'text-white' : 'text-gray-900'
                  }`}>
                    {name || user?.name || 'Your Name'}
                  </h4>
                  <p className={`text-sm mb-3 ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
                    {email || user?.email || 'your.email@example.com'}
                  </p>
                  <AvatarUploader
                    currentAvatar={avatar}
                    onSave={handleAvatarSave}
                  />
                </div>
              </div>
            </div>

            <div className="px-6 py-5">
              <div className="grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-6">
                <div className="sm:col-span-4">
                  <label htmlFor="name" className={`block text-sm font-medium ${
                    isDark ? 'text-gray-300' : 'text-gray-700'
                  }`}>
                    {t('name')}
                  </label>
                  <div className="mt-1">
                    <input
                      type="text"
                      name="name"
                      id="name"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className={`shadow-sm focus:ring-blue-500 focus:border-blue-500 block w-full sm:text-sm rounded-lg px-4 py-2.5 ${
                        isDark
                          ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400'
                          : 'bg-white border-gray-300 text-gray-900 placeholder-gray-500'
                      }`}
                      placeholder="John Doe"
                    />
                  </div>
                </div>

                <div className="sm:col-span-4">
                  <label htmlFor="email" className={`block text-sm font-medium ${
                    isDark ? 'text-gray-300' : 'text-gray-700'
                  }`}>
                    {t('email')}
                  </label>
                  <div className="mt-1">
                    <input
                      type="email"
                      name="email"
                      id="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className={`shadow-sm focus:ring-blue-500 focus:border-blue-500 block w-full sm:text-sm rounded-lg px-4 py-2.5 ${
                        isDark
                          ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400'
                          : 'bg-white border-gray-300 text-gray-900 placeholder-gray-500'
                      }`}
                      placeholder="john.doe@example.com"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Preferences Section */}
          <div className={activeTab === 'preferences' ? 'block' : 'hidden'}>
            <div className="px-6 py-6">
              <h3 className={`text-lg font-medium leading-6 flex items-center ${
                isDark ? 'text-white' : 'text-gray-900'
              }`}>
                <Globe className="mr-2 text-blue-600" size={20} />
                {t('preferences')}
              </h3>
              <p className={`mt-1 text-sm ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
                {t('customize_your_experience')}
              </p>
            </div>

            <div className="px-6 py-5">
              <div className="max-w-xl space-y-6">
                <div>
                  <label htmlFor="language" className={`block text-sm font-medium ${
                    isDark ? 'text-gray-300' : 'text-gray-700'
                  }`}>
                    {t('language_preference')}
                  </label>
                  <div className="mt-1">
                    <select
                      id="language"
                      name="language"
                      value={language}
                      onChange={(e) => setLanguage(e.target.value)}
                      className={`mt-1 block w-full pl-3 pr-10 py-2.5 text-base focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-lg ${
                        isDark
                          ? 'bg-gray-700 border-gray-600 text-white'
                          : 'bg-white border-gray-300 text-gray-900'
                      }`}
                    >
                      <option value="en">English</option>
                      <option value="fr">Français</option>
                    </select>
                  </div>
                </div>

                <div className={`border-t pt-5 ${isDark ? 'border-gray-700' : 'border-gray-200'}`}>
                  <div className="flex items-start">
                    <div className="flex-shrink-0">
                      <Bell size={20} className="text-blue-600" />
                    </div>
                    <div className="ml-3">
                      <h4 className={`text-base font-medium ${
                        isDark ? 'text-white' : 'text-gray-900'
                      }`}>
                        {t('notification_settings')}
                      </h4>
                      <p className={`text-sm mb-3 ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
                        {t('manage_how_we_contact_you')}
                      </p>
                    </div>
                  </div>

                  <div className="mt-4 ml-8">
                    <div className="relative flex items-start">
                      <div className="flex items-center h-5">
                        <input
                          id="notifications"
                          name="notifications"
                          type="checkbox"
                          checked={notifications}
                          onChange={(e) => setNotifications(e.target.checked)}
                          className={`focus:ring-blue-500 h-5 w-5 text-blue-600 rounded ${
                            isDark ? 'border-gray-600 bg-gray-700' : 'border-gray-300 bg-white'
                          }`}
                        />
                      </div>
                      <div className="ml-3 text-sm">
                        <label htmlFor="notifications" className={`font-medium ${
                          isDark ? 'text-gray-300' : 'text-gray-700'
                        }`}>
                          {t('email_notifications')}
                        </label>
                        <p className={isDark ? 'text-gray-400' : 'text-gray-500'}>
                          {t('receive_notifications')}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Security Section */}
          <div className={activeTab === 'security' ? 'block' : 'hidden'}>
            <div className="px-6 py-6">
              <h3 className={`text-lg font-medium leading-6 flex items-center ${
                isDark ? 'text-white' : 'text-gray-900'
              }`}>
                <ShieldCheck className="mr-2 text-blue-600" size={20} />
                {t('security')}
              </h3>
              <p className={`mt-1 text-sm ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
                {t('manage_security_settings')}
              </p>
            </div>

            <div className="px-6 py-5">
              <div className={`rounded-lg p-5 border ${
                isDark 
                  ? 'bg-gray-900/50 border-gray-600' 
                  : 'bg-gray-50 border-gray-200'
              }`}>
                <h4 className={`text-base font-medium mb-1 ${
                  isDark ? 'text-white' : 'text-gray-900'
                }`}>
                  {t('password')}
                </h4>
                <p className={`text-sm mb-4 ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
                  {t('last_changed')}: 3 {t('months_ago')}
                </p>

                <button
                  type="button"
                  onClick={openPasswordModal}
                  className={`inline-flex items-center px-4 py-2.5 border shadow-sm text-sm font-medium rounded-lg focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors ${
                    isDark
                      ? 'border-gray-600 text-gray-300 bg-gray-700 hover:bg-gray-600 focus:ring-offset-gray-800'
                      : 'border-gray-300 text-gray-700 bg-white hover:bg-gray-50'
                  }`}
                >
                  {t('change_password')}
                </button>
              </div>

              <div className="mt-6">
                <h4 className={`text-base font-medium mb-3 ${
                  isDark ? 'text-white' : 'text-gray-900'
                }`}>
                  {t('connected_devices')}
                </h4>
                <div className={`border rounded-lg divide-y ${
                  isDark 
                    ? 'border-gray-600 divide-gray-600' 
                    : 'border-gray-200 divide-gray-200'
                }`}>
                  <div className="p-4 flex justify-between items-center">
                    <div>
                      <p className={`text-sm font-medium ${
                        isDark ? 'text-white' : 'text-gray-900'
                      }`}>
                        Chrome on Windows
                      </p>
                      <p className={`text-xs ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
                        Active now
                      </p>
                    </div>
                    <button
                      type="button"
                      className="text-sm text-red-600 hover:text-red-800 transition-colors"
                    >
                      {t('logout')}
                    </button>
                  </div>
                  <div className="p-4 flex justify-between items-center">
                    <div>
                      <p className={`text-sm font-medium ${
                        isDark ? 'text-white' : 'text-gray-900'
                      }`}>
                        Safari on iPhone
                      </p>
                      <p className={`text-xs ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
                        Last active: 2 days ago
                      </p>
                    </div>
                    <button
                      type="button"
                      className="text-sm text-red-600 hover:text-red-800 transition-colors"
                    >
                      {t('logout')}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Form Actions */}
          <div className={`px-6 py-4 border-t flex flex-col sm:flex-row-reverse sm:justify-between sm:items-center gap-3 ${
            isDark 
              ? 'bg-gray-900/50 border-gray-700' 
              : 'bg-gray-50 border-gray-200'
          }`}>
            <div className="flex flex-col sm:flex-row gap-3">
              <button
                type="button"
                className={`sm:order-1 py-2.5 px-4 border shadow-sm text-sm font-medium rounded-lg focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors ${
                  isDark
                    ? 'border-gray-600 text-gray-300 bg-gray-700 hover:bg-gray-600 focus:ring-offset-gray-800'
                    : 'border-gray-300 text-gray-700 bg-white hover:bg-gray-50'
                }`}
              >
                {t('cancel')}
              </button>
              <button
                type="submit"
                className="inline-flex justify-center items-center py-2.5 px-4 border border-transparent shadow-sm text-sm font-medium rounded-lg text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
              >
                <Save size={16} className="mr-2" />
                {t('save_changes')}
              </button>
            </div>

            <div className={`text-xs mt-3 sm:mt-0 ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
              {t('last_updated')}: {new Date().toLocaleDateString()}
            </div>
          </div>
        </form>
      </div>

      {/* Password Change Modal */}
      <PasswordChangeModal
        isOpen={isPasswordModalOpen}
        onClose={closePasswordModal}
      />
    </div>
  );
};

export default SettingsPage;