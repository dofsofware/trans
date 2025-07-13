import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { useTheme } from '../../contexts/ThemeContext';
import { useLanguage } from '../../contexts/LanguageContext';
import { createMockClient } from '../../services/clientService';
import AvatarUploader from '../../components/common/AvatarUploader';
import {
  ArrowLeft,
  Save,
  User,
  Mail,
  Phone,
  Building,
  MapPin,
  Globe,
  Hash,
  UserCheck,
  Calendar,
  CheckCircle,
  AlertCircle,
  Loader2
} from 'lucide-react';
import { format } from 'date-fns';
import backImage from '../../utils/backGround_hearder.png';

interface ClientFormData {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  company: string;
  address: string;
  city: string;
  country: string;
  avatar?: string;
}

interface FormErrors {
  firstName?: string;
  lastName?: string;
  email?: string;
  phone?: string;
  company?: string;
  address?: string;
  city?: string;
  country?: string;
}

const NewClientPage = () => {
  const { user } = useAuth();
  const { theme } = useTheme();
  const { t, language } = useLanguage();
  const navigate = useNavigate();
  
  const [formData, setFormData] = useState<ClientFormData>({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    company: '',
    address: '',
    city: '',
    country: '',
    avatar: undefined
  });
  
  const [errors, setErrors] = useState<FormErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [generatedIdentifiant, setGeneratedIdentifiant] = useState('');
  const [createdClientId, setCreatedClientId] = useState('');
  const [pageLoaded, setPageLoaded] = useState(false);

  const isDark = theme === 'dark';
  const shadowClass = isDark ? 'shadow-gray-900/20' : 'shadow-sm';
  const hoverShadow = isDark ? 'hover:shadow-gray-900/30' : 'hover:shadow-md';
  const textPrimary = isDark ? 'text-white' : 'text-gray-900';
  const textSecondary = isDark ? 'text-gray-300' : 'text-gray-600';
  const textMuted = isDark ? 'text-gray-400' : 'text-gray-500';
  const bgPrimary = isDark ? 'bg-gray-900' : 'bg-white';
  const bgSecondary = isDark ? 'bg-gray-800' : 'bg-white';
  const borderColor = isDark ? 'border-gray-700' : 'border-gray-200';

  // Générer l'identifiant client automatiquement
  useEffect(() => {
    const generateClientId = () => {
      const timestamp = Date.now().toString();
      const random = Math.floor(Math.random() * 1000).toString().padStart(3, '0');
      return `DKR${timestamp.slice(-8)}${random}`;
    };
    
    setGeneratedIdentifiant(generateClientId());
    setTimeout(() => setPageLoaded(true), 100);
  }, []);


  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};

    if (!formData.firstName.trim()) {
      newErrors.firstName = t('required');
    }

    if (!formData.lastName.trim()) {
      newErrors.lastName = t('required');
    }

    if (!formData.email.trim()) {
      newErrors.email = t('required');
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = t('invalidEmail')}
    

    if (!formData.company.trim()) {
      newErrors.company = t('required');
    }

    if (!formData.city.trim()) {
      newErrors.city = t('required');
    }

    if (!formData.country.trim()) {
      newErrors.country = t('required');
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleInputChange = (field: keyof ClientFormData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: undefined }));
    }
  };

  const handleAvatarSave = (avatarData: any) => {
    setFormData(prev => ({ ...prev, avatar: avatarData.preview }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);

    try {
      const clientData = {
        name: `${formData.firstName} ${formData.lastName}`,
        email: formData.email,
        phone: formData.phone,
        company: formData.company,
        address: formData.address,
        city: formData.city,
        country: formData.country,
        avatar: formData.avatar,
        clientId: generatedIdentifiant
      };

      const createdClient = await createMockClient(clientData);
      setCreatedClientId(createdClient.id);
      setShowSuccess(true);
    } catch (error) {
      console.error('Error creating client:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleBack = () => {
    navigate('/clients');
  };

  const handleViewClient = () => {
    navigate(`/clients/${createdClientId}`);
  };

  const getInitials = (firstName: string, lastName: string) => {
    return `${firstName.charAt(0)}${lastName.charAt(0)}`.toUpperCase();
  };

  if (showSuccess) {
    return (
      <div className={`max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-6 transition-all duration-700 ${pageLoaded ? 'opacity-100' : 'opacity-0'}`}>
        <div className={`${bgSecondary} rounded-lg ${shadowClass} p-8 text-center`}>
          <div className="flex justify-center mb-6">
            <div className="w-16 h-16 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center">
              <CheckCircle size={32} className="text-green-600 dark:text-green-400" />
            </div>
          </div>
          
          <h2 className={`text-2xl font-bold ${textPrimary} mb-2`}>
            {t('clientCreated')}
          </h2>
          
          <p className={`${textSecondary} mb-8`}>
            {t('clientCreatedDesc')}
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button
              onClick={handleBack}
              className={`inline-flex items-center px-6 py-3 border ${borderColor} rounded-lg ${bgPrimary} ${textPrimary} hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors`}
            >
              <ArrowLeft size={18} className="mr-2" />
              {t('backToClients')}
            </button>
            
            <button
              onClick={handleViewClient}
              className="inline-flex items-center px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              <User size={18} className="mr-2" />
              {t('viewClient')}
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={`max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-6 transition-all duration-700 ${pageLoaded ? 'opacity-100' : 'opacity-0'}`}>
      {/* Header Section */}
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
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between">
          <div className="p-4">
            <div className="flex items-center mb-4">
              <button
                onClick={handleBack}
                className={`p-2 rounded-lg ${textMuted} hover:${textPrimary} hover:bg-white/20 transition-colors mr-4`}
              >
                <ArrowLeft size={20} />
              </button>
              <h1 className={`text-2xl md:text-3xl font-bold ${textPrimary}`}>
                {t('newClient')}
              </h1>
            </div>
            <p className={`${textSecondary} text-lg`}>
              {t('createNewClient')}
            </p>
          </div>
        </div>
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit} className="space-y-8">
        {/* Informations personnelles */}
<div className={`${bgSecondary} rounded-xl ${shadowClass} p-4 sm:p-6 lg:p-8 ${borderColor} border transition-all duration-300 hover:shadow-lg`}>
  <div className="flex items-center mb-6 sm:mb-8">
    <div className={`p-2 rounded-lg ${bgPrimary} mr-3 sm:mr-4`}>
      <User size={20} className={`${textPrimary}`} />
    </div>
    <h2 className={`text-xl sm:text-2xl font-semibold ${textPrimary}`}>
      {t('personalInfo')}
    </h2>
  </div>

  <div className="space-y-6 sm:space-y-8">
    {/* Champs prénom et nom */}
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
      {/* Prénom */}
      <div className="space-y-2">
        <label className={`block text-sm sm:text-base font-medium ${textSecondary}`}>
          {t('firstName')} <span className="text-red-500">*</span>
        </label>
        <div className="relative">
          <input
            type="text"
            value={formData.firstName}
            onChange={(e) => handleInputChange('firstName', e.target.value)}
            placeholder={t('firstNamePlaceholder')}
            className={`block w-full px-3 py-3 sm:px-4 sm:py-4 border rounded-lg sm:rounded-xl ${bgPrimary} ${textPrimary} 
              focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 
              transition-all duration-200 text-sm sm:text-base
              ${errors.firstName ? 'border-red-500 bg-red-50 dark:bg-red-900/10' : `${borderColor} hover:border-blue-300 dark:hover:border-blue-600`}`}
          />
          {errors.firstName && (
            <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
              <AlertCircle size={16} className="text-red-500" />
            </div>
          )}
        </div>
        {errors.firstName && (
          <div className="flex items-start space-x-2 mt-2">
            <AlertCircle size={14} className="text-red-500 mt-0.5 flex-shrink-0" />
            <p className="text-sm text-red-500 leading-relaxed">
              {errors.firstName}
            </p>
          </div>
        )}
      </div>

      {/* Nom */}
      <div className="space-y-2">
        <label className={`block text-sm sm:text-base font-medium ${textSecondary}`}>
          {t('lastName')} <span className="text-red-500">*</span>
        </label>
        <div className="relative">
          <input
            type="text"
            value={formData.lastName}
            onChange={(e) => handleInputChange('lastName', e.target.value)}
            placeholder={t('lastNamePlaceholder')}
            className={`block w-full px-3 py-3 sm:px-4 sm:py-4 border rounded-lg sm:rounded-xl ${bgPrimary} ${textPrimary} 
              focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 
              transition-all duration-200 text-sm sm:text-base
              ${errors.lastName ? 'border-red-500 bg-red-50 dark:bg-red-900/10' : `${borderColor} hover:border-blue-300 dark:hover:border-blue-600`}`}
          />
          {errors.lastName && (
            <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
              <AlertCircle size={16} className="text-red-500" />
            </div>
          )}
        </div>
        {errors.lastName && (
          <div className="flex items-start space-x-2 mt-2">
            <AlertCircle size={14} className="text-red-500 mt-0.5 flex-shrink-0" />
            <p className="text-sm text-red-500 leading-relaxed">
              {errors.lastName}
            </p>
          </div>
        )}
      </div>
    </div>

    {/* Section Avatar améliorée */}
    <div className="space-y-4">
      <label className={`block text-sm sm:text-base font-medium ${textSecondary}`}>
        {t('avatar')}
      </label>
      
      <div className="flex flex-col sm:flex-row items-start gap-4 sm:gap-6 lg:gap-8">
        {/* Avatar Preview amélioré */}
        <div className="flex-shrink-0 w-full sm:w-auto flex justify-center sm:justify-start">
          <div className="relative group">
            <div className={`w-20 h-20 sm:w-24 sm:h-24 lg:w-28 lg:h-28 rounded-full overflow-hidden border-3 ${
              formData.avatar ? 'border-blue-200 dark:border-blue-800' : borderColor
            } ${formData.avatar ? '' : 'bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-700 dark:to-gray-800'} 
            flex items-center justify-center transition-all duration-300 group-hover:scale-105`}>
              {formData.avatar ? (
                <img
                  src={formData.avatar}
                  alt="Avatar preview"
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="text-center">
                  {formData.firstName || formData.lastName ? (
                    <span className={`text-lg sm:text-xl lg:text-2xl font-bold ${textMuted} uppercase`}>
                      {getInitials(formData.firstName, formData.lastName)}
                    </span>
                  ) : (
                    <User size={28} className={`${textMuted} sm:w-8 sm:h-8 lg:w-10 lg:h-10`} />
                  )}
                </div>
              )}
            </div>
            
            {/* Badge de statut */}
            <div className={`absolute -bottom-1 -right-1 w-6 h-6 sm:w-7 sm:h-7 rounded-full border-2 ${bgSecondary} flex items-center justify-center ${
              formData.avatar ? 'bg-green-500 border-green-400' : 'bg-gray-400 border-gray-300'
            } transition-all duration-300`}>
              {formData.avatar ? (
                <svg className="w-3 h-3 sm:w-4 sm:h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              ) : (
                <svg className="w-3 h-3 sm:w-4 sm:h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                </svg>
              )}
            </div>
          </div>
          
          {/* Description sous l'avatar */}
          {formData.avatar && (
            <div className="mt-3 text-center sm:text-left">
              <p className={`text-xs sm:text-sm ${textMuted} font-medium`}>
                {language === 'fr' ? 'Photo de profil' : 'Profile picture'}
              </p>
            </div>
          )}
        </div>
        
        {/* Avatar Uploader avec meilleure disposition */}
        <div className="flex-1 w-full min-w-0">
          <div className="space-y-3">
            <AvatarUploader
              currentAvatar={formData.avatar}
              onSave={handleAvatarSave}
            />
            
            {/* Conseils pour l'avatar */}
            <div className={`p-3 sm:p-4 rounded-lg ${bgPrimary} border ${borderColor}`}>
              <div className="flex items-start space-x-2">
                <svg className={`w-4 h-4 sm:w-5 sm:h-5 ${textMuted} mt-0.5 flex-shrink-0`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <div className="space-y-1">
                  <p className={`text-xs sm:text-sm ${textMuted} font-medium`}>
                    {language === 'fr' ? 'Conseils pour votre photo' : 'Photo tips'}
                  </p>
                  <ul className={`text-xs ${textMuted} space-y-1`}>
                    <li>{language === 'fr' ? '• Format carré recommandé' : '• Square format recommended'}</li>
                    <li>{language === 'fr' ? '• Taille minimale: 200x200px' : '• Minimum size: 200x200px'}</li>
                    <li>{language === 'fr' ? '• Formats acceptés: JPG, PNG, WebP' : '• Accepted formats: JPG, PNG, WebP'}</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</div>

        {/* Informations de contact */}
        <div className={`${bgSecondary} rounded-lg ${shadowClass} p-6 ${borderColor} border`}>
          <div className="flex items-center mb-6">
            <Mail size={20} className={`${textPrimary} mr-3`} />
            <h2 className={`text-xl font-semibold ${textPrimary}`}>
              {t('contactInfo')}
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Email */}
            <div>
              <label className={`block text-sm font-medium ${textSecondary} mb-2`}>
                {t('email')} <span className="text-red-500">*</span>
              </label>
              <input
                type="email"
                value={formData.email}
                onChange={(e) => handleInputChange('email', e.target.value)}
                placeholder={t('emailPlaceholder')}
                className={`block w-full px-4 py-3 border rounded-lg ${bgPrimary} ${textPrimary} focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all ${
                  errors.email ? 'border-red-500' : borderColor
                }`}
              />
              {errors.email && (
                <p className="mt-1 text-sm text-red-500 flex items-center">
                  <AlertCircle size={14} className="mr-1" />
                  {errors.email}
                </p>
              )}
            </div>

            {/* Téléphone */}
            <div>
              <label className={`block text-sm font-medium ${textSecondary} mb-2`}>
                {t('phone')}
              </label>
              <input
                type="tel"
                value={formData.phone}
                onChange={(e) => handleInputChange('phone', e.target.value)}
                placeholder={t('phonePlaceholder')}
                className={`block w-full px-4 py-3 border ${borderColor} rounded-lg ${bgPrimary} ${textPrimary} focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all`}
              />
            </div>
          </div>
        </div>

        {/* Informations de l'entreprise */}
        <div className={`${bgSecondary} rounded-lg ${shadowClass} p-6 ${borderColor} border`}>
          <div className="flex items-center mb-6">
            <Building size={20} className={`${textPrimary} mr-3`} />
            <h2 className={`text-xl font-semibold ${textPrimary}`}>
              {t('companyInfo')}
            </h2>
          </div>

          <div>
            <label className={`block text-sm font-medium ${textSecondary} mb-2`}>
              {t('company')} <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={formData.company}
              onChange={(e) => handleInputChange('company', e.target.value)}
              placeholder={t('companyPlaceholder')}
              className={`block w-full px-4 py-3 border rounded-lg ${bgPrimary} ${textPrimary} focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all ${
                errors.company ? 'border-red-500' : borderColor
              }`}
            />
            {errors.company && (
              <p className="mt-1 text-sm text-red-500 flex items-center">
                <AlertCircle size={14} className="mr-1" />
                {errors.company}
              </p>
            )}
          </div>
        </div>

        {/* Informations d'adresse */}
        <div className={`${bgSecondary} rounded-lg ${shadowClass} p-6 ${borderColor} border`}>
          <div className="flex items-center mb-6">
            <MapPin size={20} className={`${textPrimary} mr-3`} />
            <h2 className={`text-xl font-semibold ${textPrimary}`}>
              {t('addressInfo')}
            </h2>
          </div>

          <div className="space-y-6">
            {/* Adresse */}
            <div>
              <label className={`block text-sm font-medium ${textSecondary} mb-2`}>
                {t('address')}
              </label>
              <input
                type="text"
                value={formData.address}
                onChange={(e) => handleInputChange('address', e.target.value)}
                placeholder={t('addressPlaceholder')}
                className={`block w-full px-4 py-3 border ${borderColor} rounded-lg ${bgPrimary} ${textPrimary} focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all`}
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Ville */}
              <div>
                <label className={`block text-sm font-medium ${textSecondary} mb-2`}>
                  {t('city')} <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={formData.city}
                  onChange={(e) => handleInputChange('city', e.target.value)}
                  placeholder={t('cityPlaceholder')}
                  className={`block w-full px-4 py-3 border rounded-lg ${bgPrimary} ${textPrimary} focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all ${
                    errors.city ? 'border-red-500' : borderColor
                  }`}
                />
                {errors.city && (
                  <p className="mt-1 text-sm text-red-500 flex items-center">
                    <AlertCircle size={14} className="mr-1" />
                    {errors.city}
                  </p>
                )}
              </div>

              {/* Pays */}
              <div>
                <label className={`block text-sm font-medium ${textSecondary} mb-2`}>
                  {t('country')} <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={formData.country}
                  onChange={(e) => handleInputChange('country', e.target.value)}
                  placeholder={t('countryPlaceholder')}
                  className={`block w-full px-4 py-3 border rounded-lg ${bgPrimary} ${textPrimary} focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all ${
                    errors.country ? 'border-red-500' : borderColor
                  }`}
                />
                {errors.country && (
                  <p className="mt-1 text-sm text-red-500 flex items-center">
                    <AlertCircle size={14} className="mr-1" />
                    {errors.country}
                  </p>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Informations système */}
        <div className={`${bgSecondary} rounded-lg ${shadowClass} p-6 ${borderColor} border`}>
          <div className="flex items-center mb-6">
            <Hash size={20} className={`${textPrimary} mr-3`} />
            <h2 className={`text-xl font-semibold ${textPrimary}`}>
              {t('systemInfo')}
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Identifiant Client */}
            <div>
              <label className={`block text-sm font-medium ${textSecondary} mb-2`}>
                {t('clientId')}
              </label>
              <div className={`px-4 py-3 border ${borderColor} rounded-lg ${isDark ? 'bg-gray-700' : 'bg-gray-50'} ${textMuted}`}>
                {generatedIdentifiant}
              </div>
            </div>

            {/* Agent en charge */}
            <div>
              <label className={`block text-sm font-medium ${textSecondary} mb-2`}>
                {t('assignedAgent')}
              </label>
              <div className={`px-4 py-3 border ${borderColor} rounded-lg ${isDark ? 'bg-gray-700' : 'bg-gray-50'} ${textMuted}`}>
                {user?.name}
              </div>
            </div>

            {/* Statut */}
            <div>
              <label className={`block text-sm font-medium ${textSecondary} mb-2`}>
                {t('status')}
              </label>
              <div className="flex items-center px-4 py-3 border border-green-200 dark:border-green-800 rounded-lg bg-green-50 dark:bg-green-900/20">
                <UserCheck size={16} className="text-green-600 dark:text-green-400 mr-2" />
                <span className="text-green-700 dark:text-green-300 font-medium">
                  {t('active')}
                </span>
              </div>
            </div>

            {/* Date de création */}
            <div>
              <label className={`block text-sm font-medium ${textSecondary} mb-2`}>
                {t('creationDate')}
              </label>
              <div className={`flex items-center px-4 py-3 border ${borderColor} rounded-lg ${isDark ? 'bg-gray-700' : 'bg-gray-50'} ${textMuted}`}>
                <Calendar size={16} className="mr-2" />
                {format(new Date(), 'dd/MM/yyyy HH:mm')}
              </div>
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="flex flex-col sm:flex-row gap-4 justify-end">
          <button
            type="button"
            onClick={handleBack}
            className={`inline-flex items-center justify-center px-6 py-3 border ${borderColor} rounded-lg ${bgPrimary} ${textPrimary} hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors`}
          >
            {t('cancel')}
          </button>
          
          <button
            type="submit"
            disabled={isSubmitting}
            className="inline-flex items-center justify-center px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            {isSubmitting ? (
              <>
                <Loader2 size={18} className="animate-spin mr-2" />
                {t('saving')}
              </>
            ) : (
              <>
                <Save size={18} className="mr-2" />
                {t('save')}
              </>
            )}
          </button>
        </div>
      </form>

      {/* CSS Animations */}
      <style jsx global>{`
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }

        .animate-fadeIn {
          animation: fadeIn 0.5s ease-out forwards;
        }
      `}</style>
    </div>
  );
};

export default NewClientPage;