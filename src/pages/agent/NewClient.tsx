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

  // Traductions
  const texts = {
    newClient: language === 'fr' ? 'Nouveau Client' : 'New Client',
    createNewClient: language === 'fr' ? 'Créer un nouveau client' : 'Create a new client',
    clientInformation: language === 'fr' ? 'Informations du client' : 'Client Information',
    personalInfo: language === 'fr' ? 'Informations personnelles' : 'Personal Information',
    contactInfo: language === 'fr' ? 'Informations de contact' : 'Contact Information',
    companyInfo: language === 'fr' ? 'Informations de l\'entreprise' : 'Company Information',
    addressInfo: language === 'fr' ? 'Informations d\'adresse' : 'Address Information',
    systemInfo: language === 'fr' ? 'Informations système' : 'System Information',
    firstName: language === 'fr' ? 'Prénom' : 'First Name',
    lastName: language === 'fr' ? 'Nom' : 'Last Name',
    email: language === 'fr' ? 'Email' : 'Email',
    phone: language === 'fr' ? 'Téléphone' : 'Phone',
    company: language === 'fr' ? 'Entreprise' : 'Company',
    address: language === 'fr' ? 'Adresse' : 'Address',
    city: language === 'fr' ? 'Ville' : 'City',
    country: language === 'fr' ? 'Pays' : 'Country',
    avatar: language === 'fr' ? 'Photo de profil' : 'Profile Picture',
    clientId: language === 'fr' ? 'Identifiant Client' : 'Client ID',
    assignedAgent: language === 'fr' ? 'Agent en charge' : 'Assigned Agent',
    status: language === 'fr' ? 'Statut' : 'Status',
    active: language === 'fr' ? 'Actif' : 'Active',
    creationDate: language === 'fr' ? 'Date de création' : 'Creation Date',
    save: language === 'fr' ? 'Enregistrer' : 'Save',
    cancel: language === 'fr' ? 'Annuler' : 'Cancel',
    saving: language === 'fr' ? 'Enregistrement...' : 'Saving...',
    required: language === 'fr' ? 'Ce champ est requis' : 'This field is required',
    invalidEmail: language === 'fr' ? 'Email invalide' : 'Invalid email',
    clientCreated: language === 'fr' ? 'Client créé avec succès!' : 'Client created successfully!',
    clientCreatedDesc: language === 'fr' ? 'Le nouveau client a été ajouté à votre portefeuille.' : 'The new client has been added to your portfolio.',
    backToClients: language === 'fr' ? 'Retour aux clients' : 'Back to clients',
    viewClient: language === 'fr' ? 'Voir le client' : 'View client',
    fillAllFields: language === 'fr' ? 'Veuillez remplir tous les champs obligatoires' : 'Please fill in all required fields',
    firstNamePlaceholder: language === 'fr' ? 'Entrez le prénom' : 'Enter first name',
    lastNamePlaceholder: language === 'fr' ? 'Entrez le nom' : 'Enter last name',
    emailPlaceholder: language === 'fr' ? 'exemple@entreprise.com' : 'example@company.com',
    phonePlaceholder: language === 'fr' ? '+33 1 23 45 67 89' : '+1 234 567 8900',
    companyPlaceholder: language === 'fr' ? 'Nom de l\'entreprise' : 'Company name',
    addressPlaceholder: language === 'fr' ? 'Adresse complète' : 'Full address',
    cityPlaceholder: language === 'fr' ? 'Ville' : 'City',
    countryPlaceholder: language === 'fr' ? 'Pays' : 'Country'
  };

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};

    if (!formData.firstName.trim()) {
      newErrors.firstName = texts.required;
    }

    if (!formData.lastName.trim()) {
      newErrors.lastName = texts.required;
    }

    if (!formData.email.trim()) {
      newErrors.email = texts.required;
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = texts.invalidEmail;
    }

    if (!formData.company.trim()) {
      newErrors.company = texts.required;
    }

    if (!formData.city.trim()) {
      newErrors.city = texts.required;
    }

    if (!formData.country.trim()) {
      newErrors.country = texts.required;
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

      await createMockClient(clientData);
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
            {texts.clientCreated}
          </h2>
          
          <p className={`${textSecondary} mb-8`}>
            {texts.clientCreatedDesc}
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button
              onClick={handleBack}
              className={`inline-flex items-center px-6 py-3 border ${borderColor} rounded-lg ${bgPrimary} ${textPrimary} hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors`}
            >
              <ArrowLeft size={18} className="mr-2" />
              {texts.backToClients}
            </button>
            
            <button
              onClick={() => navigate(`/clients/${generatedIdentifiant}`)}
              className="inline-flex items-center px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              <User size={18} className="mr-2" />
              {texts.viewClient}
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
                {texts.newClient}
              </h1>
            </div>
            <p className={`${textSecondary} text-lg`}>
              {texts.createNewClient}
            </p>
          </div>
        </div>
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit} className="space-y-8">
        {/* Informations personnelles */}
        <div className={`${bgSecondary} rounded-lg ${shadowClass} p-6 ${borderColor} border`}>
          <div className="flex items-center mb-6">
            <User size={20} className={`${textPrimary} mr-3`} />
            <h2 className={`text-xl font-semibold ${textPrimary}`}>
              {texts.personalInfo}
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Prénom */}
            <div>
              <label className={`block text-sm font-medium ${textSecondary} mb-2`}>
                {texts.firstName} <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={formData.firstName}
                onChange={(e) => handleInputChange('firstName', e.target.value)}
                placeholder={texts.firstNamePlaceholder}
                className={`block w-full px-4 py-3 border rounded-lg ${bgPrimary} ${textPrimary} focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all ${
                  errors.firstName ? 'border-red-500' : borderColor
                }`}
              />
              {errors.firstName && (
                <p className="mt-1 text-sm text-red-500 flex items-center">
                  <AlertCircle size={14} className="mr-1" />
                  {errors.firstName}
                </p>
              )}
            </div>

            {/* Nom */}
            <div>
              <label className={`block text-sm font-medium ${textSecondary} mb-2`}>
                {texts.lastName} <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={formData.lastName}
                onChange={(e) => handleInputChange('lastName', e.target.value)}
                placeholder={texts.lastNamePlaceholder}
                className={`block w-full px-4 py-3 border rounded-lg ${bgPrimary} ${textPrimary} focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all ${
                  errors.lastName ? 'border-red-500' : borderColor
                }`}
              />
              {errors.lastName && (
                <p className="mt-1 text-sm text-red-500 flex items-center">
                  <AlertCircle size={14} className="mr-1" />
                  {errors.lastName}
                </p>
              )}
            </div>
          </div>

          {/* Avatar */}
          <div className="mt-6">
            <label className={`block text-sm font-medium ${textSecondary} mb-2`}>
              {texts.avatar}
            </label>
            <AvatarUploader
              currentAvatar={formData.avatar}
              onSave={handleAvatarSave}
            />
          </div>
        </div>

        {/* Informations de contact */}
        <div className={`${bgSecondary} rounded-lg ${shadowClass} p-6 ${borderColor} border`}>
          <div className="flex items-center mb-6">
            <Mail size={20} className={`${textPrimary} mr-3`} />
            <h2 className={`text-xl font-semibold ${textPrimary}`}>
              {texts.contactInfo}
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Email */}
            <div>
              <label className={`block text-sm font-medium ${textSecondary} mb-2`}>
                {texts.email} <span className="text-red-500">*</span>
              </label>
              <input
                type="email"
                value={formData.email}
                onChange={(e) => handleInputChange('email', e.target.value)}
                placeholder={texts.emailPlaceholder}
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
                {texts.phone}
              </label>
              <input
                type="tel"
                value={formData.phone}
                onChange={(e) => handleInputChange('phone', e.target.value)}
                placeholder={texts.phonePlaceholder}
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
              {texts.companyInfo}
            </h2>
          </div>

          <div>
            <label className={`block text-sm font-medium ${textSecondary} mb-2`}>
              {texts.company} <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={formData.company}
              onChange={(e) => handleInputChange('company', e.target.value)}
              placeholder={texts.companyPlaceholder}
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
              {texts.addressInfo}
            </h2>
          </div>

          <div className="space-y-6">
            {/* Adresse */}
            <div>
              <label className={`block text-sm font-medium ${textSecondary} mb-2`}>
                {texts.address}
              </label>
              <input
                type="text"
                value={formData.address}
                onChange={(e) => handleInputChange('address', e.target.value)}
                placeholder={texts.addressPlaceholder}
                className={`block w-full px-4 py-3 border ${borderColor} rounded-lg ${bgPrimary} ${textPrimary} focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all`}
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Ville */}
              <div>
                <label className={`block text-sm font-medium ${textSecondary} mb-2`}>
                  {texts.city} <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={formData.city}
                  onChange={(e) => handleInputChange('city', e.target.value)}
                  placeholder={texts.cityPlaceholder}
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
                  {texts.country} <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={formData.country}
                  onChange={(e) => handleInputChange('country', e.target.value)}
                  placeholder={texts.countryPlaceholder}
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
              {texts.systemInfo}
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Identifiant Client */}
            <div>
              <label className={`block text-sm font-medium ${textSecondary} mb-2`}>
                {texts.clientId}
              </label>
              <div className={`px-4 py-3 border ${borderColor} rounded-lg ${isDark ? 'bg-gray-700' : 'bg-gray-50'} ${textMuted}`}>
                {generatedIdentifiant}
              </div>
              <p className={`mt-1 text-xs ${textMuted}`}>
                {language === 'fr' ? 'Généré automatiquement' : 'Auto-generated'}
              </p>
            </div>

            {/* Agent en charge */}
            <div>
              <label className={`block text-sm font-medium ${textSecondary} mb-2`}>
                {texts.assignedAgent}
              </label>
              <div className={`px-4 py-3 border ${borderColor} rounded-lg ${isDark ? 'bg-gray-700' : 'bg-gray-50'} ${textMuted}`}>
                {user?.name}
              </div>
              <p className={`mt-1 text-xs ${textMuted}`}>
                {language === 'fr' ? 'Agent créateur du compte' : 'Account creator agent'}
              </p>
            </div>

            {/* Statut */}
            <div>
              <label className={`block text-sm font-medium ${textSecondary} mb-2`}>
                {texts.status}
              </label>
              <div className="flex items-center px-4 py-3 border border-green-200 dark:border-green-800 rounded-lg bg-green-50 dark:bg-green-900/20">
                <UserCheck size={16} className="text-green-600 dark:text-green-400 mr-2" />
                <span className="text-green-700 dark:text-green-300 font-medium">
                  {texts.active}
                </span>
              </div>
            </div>

            {/* Date de création */}
            <div>
              <label className={`block text-sm font-medium ${textSecondary} mb-2`}>
                {texts.creationDate}
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
            {texts.cancel}
          </button>
          
          <button
            type="submit"
            disabled={isSubmitting}
            className="inline-flex items-center justify-center px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            {isSubmitting ? (
              <>
                <Loader2 size={18} className="animate-spin mr-2" />
                {texts.saving}
              </>
            ) : (
              <>
                <Save size={18} className="mr-2" />
                {texts.save}
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