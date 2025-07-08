import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { useTheme } from '../../contexts/ThemeContext';
import { useLanguage } from '../../contexts/LanguageContext';
import { getMockClients } from '../../services/clientService';
import { Client } from '../../types/client';
import FileUploadComponent from '../../components/common/FileUploadComponent';
import {
  ArrowLeft,
  Save,
  FileText,
  Upload,
  Users,
  MapPin,
  Package,
  Truck,
  Ship,
  Plane,
  Hash,
  Calendar,
  AlertCircle,
  CheckCircle,
  Loader2,
  X,
  Plus,
  Eye,
  EyeOff,
  Lock,
  Unlock,
  Building,
  Settings,
  Container,
  Weight,
  Box
} from 'lucide-react';
import { format } from 'date-fns';
import backImage from '../../utils/backGround_hearder.png';

interface ContainerData {
  id: string;
  number: string;
  volume: string;
  weight: string;
  type: string;
}

interface TransitFileFormData {
  blNumber: string;
  shipmentType: 'import' | 'export';
  clients: string[];
  origin: string;
  destination: string;
  capacity: string;
  productType: 'standard' | 'dangerous' | 'fragile';
  transportType: 'air' | 'sea';
  description: string;
  shuttleCompany: string;
  serviceType: string;
  transporter: string;
  containers: ContainerData[];
}

interface FileUpload {
  id: string;
  file: File;
  name: string;
  type: 'invoice' | 'packing_list' | 'other';
  isPrivate: boolean;
  uploadedAt: string;
}

interface FormErrors {
  blNumber?: string;
  clients?: string;
  origin?: string;
  destination?: string;
  capacity?: string;
  description?: string;
  shuttleCompany?: string;
  serviceType?: string;
  transporter?: string;
  containers?: string;
}

// Mock data for shuttle companies and transporters
const mockShuttleCompanies = [
  'Express Shuttle Services',
  'City Transport Solutions',
  'Metro Logistics',
  'Urban Freight Express',
  'Quick Connect Transport',
  'Harbor Shuttle Co.',
  'Airport Express Services',
  'Continental Shuttle Lines'
];

const mockTransporters = [
  'Global Shipping Lines',
  'Ocean Freight International',
  'Air Cargo Express',
  'Continental Transport',
  'Maritime Solutions Ltd',
  'Sky Bridge Logistics',
  'Euro Transport Group',
  'Pacific Shipping Co.'
];

const containerTypes = [
  { value: '20ft_standard', label: '20ft Standard' },
  { value: '40ft_standard', label: '40ft Standard' },
  { value: '40ft_hc', label: '40ft High Cube' },
  { value: '20ft_reefer', label: '20ft Reefer' },
  { value: '40ft_reefer', label: '40ft Reefer' },
  { value: '20ft_open_top', label: '20ft Open Top' },
  { value: '40ft_open_top', label: '40ft Open Top' },
  { value: '20ft_flat_rack', label: '20ft Flat Rack' },
  { value: '40ft_flat_rack', label: '40ft Flat Rack' }
];

const NewTransitFilePage = () => {
  const { user } = useAuth();
  const { theme } = useTheme();
  const { t, language } = useLanguage();
  const navigate = useNavigate();
  
  const [formData, setFormData] = useState<TransitFileFormData>({
    blNumber: '',
    shipmentType: 'import',
    clients: [],
    origin: '',
    destination: '',
    capacity: '',
    productType: 'standard',
    transportType: 'sea',
    description: '',
    shuttleCompany: '',
    serviceType: '',
    transporter: '',
    containers: []
  });
  
  const [uploadedFiles, setUploadedFiles] = useState<FileUpload[]>([]);
  const [clients, setClients] = useState<Client[]>([]);
  const [errors, setErrors] = useState<FormErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [generatedReference, setGeneratedReference] = useState('');
  const [createdFileId, setCreatedFileId] = useState('');
  const [pageLoaded, setPageLoaded] = useState(false);
  const [clientSearchQuery, setClientSearchQuery] = useState('');
  const [showClientDropdown, setShowClientDropdown] = useState(false);
  const [shuttleCompanyQuery, setShuttleCompanyQuery] = useState('');
  const [showShuttleDropdown, setShowShuttleDropdown] = useState(false);
  const [transporterQuery, setTransporterQuery] = useState('');
  const [showTransporterDropdown, setShowTransporterDropdown] = useState(false);

  const isDark = theme === 'dark';
  const shadowClass = isDark ? 'shadow-gray-900/20' : 'shadow-sm';
  const hoverShadow = isDark ? 'hover:shadow-gray-900/30' : 'hover:shadow-md';
  const textPrimary = isDark ? 'text-white' : 'text-gray-900';
  const textSecondary = isDark ? 'text-gray-300' : 'text-gray-600';
  const textMuted = isDark ? 'text-gray-400' : 'text-gray-500';
  const bgPrimary = isDark ? 'bg-gray-900' : 'bg-white';
  const bgSecondary = isDark ? 'bg-gray-800' : 'bg-white';
  const borderColor = isDark ? 'border-gray-700' : 'border-gray-200';

  // Générer la référence du dossier automatiquement
  useEffect(() => {
    const generateFileReference = () => {
      const timestamp = Date.now().toString();
      const random = Math.floor(Math.random() * 1000).toString().padStart(3, '0');
      return `TF${timestamp.slice(-8)}${random}`;
    };
    
    setGeneratedReference(generateFileReference());
    setTimeout(() => setPageLoaded(true), 100);
  }, []);

  // Charger les clients
  useEffect(() => {
    const fetchClients = async () => {
      try {
        const clientsData = await getMockClients();
        setClients(clientsData);
      } catch (error) {
        console.error('Error fetching clients:', error);
      }
    };

    fetchClients();
  }, []);

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};

    if (!formData.blNumber.trim()) {
      newErrors.blNumber = t('required');
    }

    if (formData.clients.length === 0) {
      newErrors.clients = t('required');
    }

    if (!formData.origin.trim()) {
      newErrors.origin = t('required');
    }

    if (!formData.destination.trim()) {
      newErrors.destination = t('required');
    }

    if (!formData.capacity.trim()) {
      newErrors.capacity = t('required');
    }

    if (!formData.description.trim()) {
      newErrors.description = t('required');
    }

    if (!formData.shuttleCompany.trim()) {
      newErrors.shuttleCompany = t('required');
    }

    if (!formData.serviceType.trim()) {
      newErrors.serviceType = t('required');
    }

    if (!formData.transporter.trim()) {
      newErrors.transporter = t('required');
    }

    if (formData.transportType === 'sea' && formData.containers.length === 0) {
      newErrors.containers = language === 'fr' ? 'Au moins un conteneur est requis pour le transport maritime' : 'At least one container is required for sea transport';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleInputChange = (field: keyof TransitFileFormData, value: string | string[] | ContainerData[]) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: undefined }));
    }
  };

  const handleFileUpload = (files: File[], type: 'invoice' | 'packing_list' | 'other' = 'other') => {
    const newFiles: FileUpload[] = files.map(file => ({
      id: `file-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      file,
      name: file.name,
      type,
      isPrivate: false,
      uploadedAt: new Date().toISOString()
    }));

    setUploadedFiles(prev => [...prev, ...newFiles]);
  };

  const toggleFilePrivacy = (fileId: string) => {
    setUploadedFiles(prev => 
      prev.map(file => 
        file.id === fileId 
          ? { ...file, isPrivate: !file.isPrivate }
          : file
      )
    );
  };

  const removeFile = (fileId: string) => {
    setUploadedFiles(prev => prev.filter(file => file.id !== fileId));
  };

  const addClient = (clientId: string) => {
    if (!formData.clients.includes(clientId)) {
      handleInputChange('clients', [...formData.clients, clientId]);
    }
    setClientSearchQuery('');
    setShowClientDropdown(false);
  };

  const removeClient = (clientId: string) => {
    handleInputChange('clients', formData.clients.filter(id => id !== clientId));
  };

  const filteredClients = clients.filter(client =>
    !formData.clients.includes(client.id) &&
    (client.name.toLowerCase().includes(clientSearchQuery.toLowerCase()) ||
     client.company.toLowerCase().includes(clientSearchQuery.toLowerCase()) ||
     client.email.toLowerCase().includes(clientSearchQuery.toLowerCase()))
  );

  const filteredShuttleCompanies = mockShuttleCompanies.filter(company =>
    company.toLowerCase().includes(shuttleCompanyQuery.toLowerCase())
  );

  const filteredTransporters = mockTransporters.filter(transporter =>
    transporter.toLowerCase().includes(transporterQuery.toLowerCase())
  );

  // Container management functions
  const addContainer = () => {
    const newContainer: ContainerData = {
      id: `container-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      number: '',
      volume: '',
      weight: '',
      type: '20ft_standard'
    };
    handleInputChange('containers', [...formData.containers, newContainer]);
  };

  const updateContainer = (containerId: string, field: keyof ContainerData, value: string) => {
    const updatedContainers = formData.containers.map(container =>
      container.id === containerId ? { ...container, [field]: value } : container
    );
    handleInputChange('containers', updatedContainers);
  };

  const removeContainer = (containerId: string) => {
    const updatedContainers = formData.containers.filter(container => container.id !== containerId);
    handleInputChange('containers', updatedContainers);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);

    try {
      // Simuler la création du dossier
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      setCreatedFileId(generatedReference);
      setShowSuccess(true);
    } catch (error) {
      console.error('Error creating transit file:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleBack = () => {
    navigate('/');
  };

  const handleViewFile = () => {
    navigate(`/transit-files/${createdFileId}`);
  };

  const getFileIcon = (type: string) => {
    switch (type) {
      case 'invoice':
        return <FileText size={16} className="text-green-600" />;
      case 'packing_list':
        return <Package size={16} className="text-blue-600" />;
      default:
        return <FileText size={16} className="text-gray-600" />;
    }
  };

  const getFileTypeLabel = (type: string) => {
    switch (type) {
      case 'invoice':
        return language === 'fr' ? 'Facture' : 'Invoice';
      case 'packing_list':
        return language === 'fr' ? 'Liste de colisage' : 'Packing List';
      default:
        return language === 'fr' ? 'Autre document' : 'Other Document';
    }
  };

  const formatFileSize = (bytes: number) => {
    if (bytes < 1024) return bytes + ' B';
    else if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';
    else return (bytes / (1024 * 1024)).toFixed(1) + ' MB';
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
            {language === 'fr' ? 'Dossier créé avec succès!' : 'Transit File Created Successfully!'}
          </h2>
          
          <p className={`${textSecondary} mb-8`}>
            {language === 'fr' 
              ? 'Le nouveau dossier de transit a été créé et ajouté à votre portefeuille.'
              : 'The new transit file has been created and added to your portfolio.'
            }
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button
              onClick={handleBack}
              className={`inline-flex items-center px-6 py-3 border ${borderColor} rounded-lg ${bgPrimary} ${textPrimary} hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors`}
            >
              <ArrowLeft size={18} className="mr-2" />
              {language === 'fr' ? 'Retour au tableau de bord' : 'Back to Dashboard'}
            </button>
            
            <button
              onClick={handleViewFile}
              className="inline-flex items-center px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              <FileText size={18} className="mr-2" />
              {language === 'fr' ? 'Voir le dossier' : 'View File'}
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={`max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-6 transition-all duration-700 ${pageLoaded ? 'opacity-100' : 'opacity-0'}`}>
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
                {language === 'fr' ? 'Nouveau Dossier' : 'New Transit File'}
              </h1>
            </div>
            <p className={`${textSecondary} text-lg`}>
              {language === 'fr' 
                ? 'Créer un nouveau dossier de transit'
                : 'Create a new transit file'
              }
            </p>
          </div>
        </div>
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit} className="space-y-8">
        {/* Informations générales */}
        <div className={`${bgSecondary} rounded-xl ${shadowClass} p-6 ${borderColor} border`}>
          <div className="flex items-center mb-6">
            <div className={`p-2 rounded-lg ${bgPrimary} mr-3`}>
              <FileText size={20} className={`${textPrimary}`} />
            </div>
            <h2 className={`text-xl font-semibold ${textPrimary}`}>
              {language === 'fr' ? 'Informations générales' : 'General Information'}
            </h2>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Numéro BL */}
            <div>
              <label className={`block text-sm font-medium ${textSecondary} mb-2`}>
                {language === 'fr' ? 'Numéro BL/LTA/Feuille de route' : 'BL/LTA/Route Sheet Number'} <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={formData.blNumber}
                onChange={(e) => handleInputChange('blNumber', e.target.value)}
                placeholder={language === 'fr' ? 'Entrez le numéro BL' : 'Enter BL number'}
                className={`block w-full px-4 py-3 border rounded-lg ${bgPrimary} ${textPrimary} focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all ${
                  errors.blNumber ? 'border-red-500' : borderColor
                }`}
              />
              {errors.blNumber && (
                <p className="mt-1 text-sm text-red-500 flex items-center">
                  <AlertCircle size={14} className="mr-1" />
                  {errors.blNumber}
                </p>
              )}
            </div>

            {/* Référence du dossier */}
            <div>
              <label className={`block text-sm font-medium ${textSecondary} mb-2`}>
                {language === 'fr' ? 'Référence du dossier' : 'File Reference'}
              </label>
              <div className={`px-4 py-3 border ${borderColor} rounded-lg ${isDark ? 'bg-gray-700' : 'bg-gray-50'} ${textMuted}`}>
                {generatedReference}
              </div>
            </div>

            {/* Type de transport */}
            <div>
              <label className={`block text-sm font-medium ${textSecondary} mb-2`}>
                {language === 'fr' ? 'Type de transport' : 'Transport Type'} <span className="text-red-500">*</span>
              </label>
              <div className="grid grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={() => handleInputChange('transportType', 'sea')}
                  className={`flex items-center justify-center px-4 py-3 border rounded-lg transition-colors ${
                    formData.transportType === 'sea'
                      ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300'
                      : `${borderColor} ${bgPrimary} ${textSecondary} hover:bg-gray-50 dark:hover:bg-gray-700`
                  }`}
                >
                  <Ship size={18} className="mr-2" />
                  {language === 'fr' ? 'Maritime' : 'Sea Freight'}
                </button>
                <button
                  type="button"
                  onClick={() => handleInputChange('transportType', 'air')}
                  className={`flex items-center justify-center px-4 py-3 border rounded-lg transition-colors ${
                    formData.transportType === 'air'
                      ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300'
                      : `${borderColor} ${bgPrimary} ${textSecondary} hover:bg-gray-50 dark:hover:bg-gray-700`
                  }`}
                >
                  <Plane size={18} className="mr-2" />
                  {language === 'fr' ? 'Aérien' : 'Air Freight'}
                </button>
              </div>
            </div>

            {/* Type d'expédition */}
            <div>
              <label className={`block text-sm font-medium ${textSecondary} mb-2`}>
                {language === 'fr' ? 'Type d\'expédition' : 'Shipment Type'} <span className="text-red-500">*</span>
              </label>
              <div className="grid grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={() => handleInputChange('shipmentType', 'import')}
                  className={`flex items-center justify-center px-4 py-3 border rounded-lg transition-colors ${
                    formData.shipmentType === 'import'
                      ? 'border-green-500 bg-green-50 dark:bg-green-900/30 text-green-700 dark:text-green-300'
                      : `${borderColor} ${bgPrimary} ${textSecondary} hover:bg-gray-50 dark:hover:bg-gray-700`
                  }`}
                >
                  <ArrowLeft size={18} className="mr-2" />
                  {language === 'fr' ? 'Import' : 'Import'}
                </button>
                <button
                  type="button"
                  onClick={() => handleInputChange('shipmentType', 'export')}
                  className={`flex items-center justify-center px-4 py-3 border rounded-lg transition-colors ${
                    formData.shipmentType === 'export'
                      ? 'border-orange-500 bg-orange-50 dark:bg-orange-900/30 text-orange-700 dark:text-orange-300'
                      : `${borderColor} ${bgPrimary} ${textSecondary} hover:bg-gray-50 dark:hover:bg-gray-700`
                  }`}
                >
                  <ArrowLeft size={18} className="mr-2 rotate-180" />
                  {language === 'fr' ? 'Export' : 'Export'}
                </button>
              </div>
            </div>

            {/* Type de produit */}
            <div>
              <label className={`block text-sm font-medium ${textSecondary} mb-2`}>
                {language === 'fr' ? 'Type de produit' : 'Product Type'} <span className="text-red-500">*</span>
              </label>
              <select
                value={formData.productType}
                onChange={(e) => handleInputChange('productType', e.target.value)}
                className={`block w-full px-4 py-3 border ${borderColor} rounded-lg ${bgPrimary} ${textPrimary} focus:outline-none focus:ring-2 focus:ring-blue-500`}
              >
                <option value="standard">{language === 'fr' ? 'Standard' : 'Standard'}</option>
                <option value="dangerous">{language === 'fr' ? 'Dangereux' : 'Dangerous'}</option>
                <option value="fragile">{language === 'fr' ? 'Fragile' : 'Fragile'}</option>
              </select>
            </div>
          </div>
        </div>

        {/* Services et Partenaires */}
        <div className={`${bgSecondary} rounded-xl ${shadowClass} p-6 ${borderColor} border`}>
          <div className="flex items-center mb-6">
            <div className={`p-2 rounded-lg ${bgPrimary} mr-3`}>
              <Building size={20} className={`${textPrimary}`} />
            </div>
            <h2 className={`text-xl font-semibold ${textPrimary}`}>
              {language === 'fr' ? 'Services et Partenaires' : 'Services and Partners'}
            </h2>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Compagnie de navette */}
            <div className="relative">
              <label className={`block text-sm font-medium ${textSecondary} mb-2`}>
                {language === 'fr' ? 'Compagnie de navette' : 'Shuttle Company'} <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={shuttleCompanyQuery}
                onChange={(e) => {
                  setShuttleCompanyQuery(e.target.value);
                  setFormData(prev => ({ ...prev, shuttleCompany: e.target.value }));
                  setShowShuttleDropdown(true);
                }}
                onFocus={() => setShowShuttleDropdown(true)}
                placeholder={language === 'fr' ? 'Rechercher ou saisir une compagnie...' : 'Search or enter a company...'}
                className={`block w-full px-4 py-3 border rounded-lg ${bgPrimary} ${textPrimary} focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all ${
                  errors.shuttleCompany ? 'border-red-500' : borderColor
                }`}
              />
              
              {showShuttleDropdown && filteredShuttleCompanies.length > 0 && (
                <div className={`absolute z-10 mt-1 w-full max-h-60 overflow-auto rounded-md ${bgPrimary} py-1 text-base shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm ${borderColor} border`}>
                  {filteredShuttleCompanies.map((company) => (
                    <div
                      key={company}
                      className={`px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-700 cursor-pointer ${textPrimary}`}
                      onClick={() => {
                        setShuttleCompanyQuery(company);
                        setFormData(prev => ({ ...prev, shuttleCompany: company }));
                        setShowShuttleDropdown(false);
                      }}
                    >
                      {company}
                    </div>
                  ))}
                </div>
              )}
              
              {errors.shuttleCompany && (
                <p className="mt-1 text-sm text-red-500 flex items-center">
                  <AlertCircle size={14} className="mr-1" />
                  {errors.shuttleCompany}
                </p>
              )}
            </div>

            {/* Type de prestation */}
            <div>
              <label className={`block text-sm font-medium ${textSecondary} mb-2`}>
                {language === 'fr' ? 'Type de prestation' : 'Service Type'} <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={formData.serviceType}
                onChange={(e) => handleInputChange('serviceType', e.target.value)}
                placeholder={language === 'fr' ? 'Ex: Transport, Dédouanement, Stockage...' : 'Ex: Transport, Customs clearance, Storage...'}
                className={`block w-full px-4 py-3 border rounded-lg ${bgPrimary} ${textPrimary} focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all ${
                  errors.serviceType ? 'border-red-500' : borderColor
                }`}
              />
              {errors.serviceType && (
                <p className="mt-1 text-sm text-red-500 flex items-center">
                  <AlertCircle size={14} className="mr-1" />
                  {errors.serviceType}
                </p>
              )}
            </div>

            {/* Transporteur */}
            <div className="relative lg:col-span-2">
              <label className={`block text-sm font-medium ${textSecondary} mb-2`}>
                {language === 'fr' ? 'Transporteur' : 'Transporter'} <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={transporterQuery}
                onChange={(e) => {
                  setTransporterQuery(e.target.value);
                  setFormData(prev => ({ ...prev, transporter: e.target.value }));
                  setShowTransporterDropdown(true);
                }}
                onFocus={() => setShowTransporterDropdown(true)}
                placeholder={language === 'fr' ? 'Rechercher ou saisir un transporteur...' : 'Search or enter a transporter...'}
                className={`block w-full px-4 py-3 border rounded-lg ${bgPrimary} ${textPrimary} focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all ${
                  errors.transporter ? 'border-red-500' : borderColor
                }`}
              />
              
              {showTransporterDropdown && filteredTransporters.length > 0 && (
                <div className={`absolute z-10 mt-1 w-full max-h-60 overflow-auto rounded-md ${bgPrimary} py-1 text-base shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm ${borderColor} border`}>
                  {filteredTransporters.map((transporter) => (
                    <div
                      key={transporter}
                      className={`px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-700 cursor-pointer ${textPrimary}`}
                      onClick={() => {
                        setTransporterQuery(transporter);
                        setFormData(prev => ({ ...prev, transporter: transporter }));
                        setShowTransporterDropdown(false);
                      }}
                    >
                      {transporter}
                    </div>
                  ))}
                </div>
              )}
              
              {errors.transporter && (
                <p className="mt-1 text-sm text-red-500 flex items-center">
                  <AlertCircle size={14} className="mr-1" />
                  {errors.transporter}
                </p>
              )}
            </div>
          </div>
        </div>

        {/* Conteneurs (uniquement pour transport maritime) */}
        {formData.transportType === 'sea' && (
          <div className={`${bgSecondary} rounded-xl ${shadowClass} p-6 ${borderColor} border`}>
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center">
                <div className={`p-2 rounded-lg ${bgPrimary} mr-3`}>
                  <Container size={20} className={`${textPrimary}`} />
                </div>
                <h2 className={`text-xl font-semibold ${textPrimary}`}>
                  {language === 'fr' ? 'Conteneurs' : 'Containers'}
                </h2>
              </div>
              <button
                type="button"
                onClick={addContainer}
                className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                <Plus size={16} className="mr-2" />
                {language === 'fr' ? 'Ajouter un conteneur' : 'Add Container'}
              </button>
            </div>

            {errors.containers && (
              <div className="mb-4 p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800/30 rounded-lg">
                <p className="text-sm text-red-600 dark:text-red-400 flex items-center">
                  <AlertCircle size={14} className="mr-1" />
                  {errors.containers}
                </p>
              </div>
            )}

            <div className="space-y-4">
              {formData.containers.map((container, index) => (
                <div key={container.id} className={`p-4 border ${borderColor} rounded-lg ${bgPrimary}`}>
                  <div className="flex items-center justify-between mb-4">
                    <h3 className={`text-lg font-medium ${textPrimary}`}>
                      {language === 'fr' ? `Conteneur ${index + 1}` : `Container ${index + 1}`}
                    </h3>
                    <button
                      type="button"
                      onClick={() => removeContainer(container.id)}
                      className="p-2 text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"
                    >
                      <X size={16} />
                    </button>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                    {/* Numéro de conteneur */}
                    <div>
                      <label className={`block text-sm font-medium ${textSecondary} mb-1`}>
                        {language === 'fr' ? 'Numéro' : 'Number'} <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        value={container.number}
                        onChange={(e) => updateContainer(container.id, 'number', e.target.value)}
                        placeholder={language === 'fr' ? 'Ex: MSKU1234567' : 'Ex: MSKU1234567'}
                        className={`block w-full px-3 py-2 border ${borderColor} rounded-lg ${bgPrimary} ${textPrimary} focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm`}
                      />
                    </div>

                    {/* Type de conteneur */}
                    <div>
                      <label className={`block text-sm font-medium ${textSecondary} mb-1`}>
                        {language === 'fr' ? 'Type' : 'Type'} <span className="text-red-500">*</span>
                      </label>
                      <select
                        value={container.type}
                        onChange={(e) => updateContainer(container.id, 'type', e.target.value)}
                        className={`block w-full px-3 py-2 border ${borderColor} rounded-lg ${bgPrimary} ${textPrimary} focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm`}
                      >
                        {containerTypes.map((type) => (
                          <option key={type.value} value={type.value}>
                            {type.label}
                          </option>
                        ))}
                      </select>
                    </div>

                    {/* Volume */}
                    <div>
                      <label className={`block text-sm font-medium ${textSecondary} mb-1`}>
                        {language === 'fr' ? 'Volume (m³)' : 'Volume (m³)'} <span className="text-red-500">*</span>
                      </label>
                      <div className="relative">
                        <input
                          type="number"
                          step="0.01"
                          value={container.volume}
                          onChange={(e) => updateContainer(container.id, 'volume', e.target.value)}
                          placeholder="0.00"
                          className={`block w-full px-3 py-2 pr-8 border ${borderColor} rounded-lg ${bgPrimary} ${textPrimary} focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm`}
                        />
                        <Box size={14} className={`absolute right-2 top-1/2 transform -translate-y-1/2 ${textMuted}`} />
                      </div>
                    </div>

                    {/* Poids */}
                    <div>
                      <label className={`block text-sm font-medium ${textSecondary} mb-1`}>
                        {language === 'fr' ? 'Poids (kg)' : 'Weight (kg)'} <span className="text-red-500">*</span>
                      </label>
                      <div className="relative">
                        <input
                          type="number"
                          step="0.01"
                          value={container.weight}
                          onChange={(e) => updateContainer(container.id, 'weight', e.target.value)}
                          placeholder="0.00"
                          className={`block w-full px-3 py-2 pr-8 border ${borderColor} rounded-lg ${bgPrimary} ${textPrimary} focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm`}
                        />
                        <Weight size={14} className={`absolute right-2 top-1/2 transform -translate-y-1/2 ${textMuted}`} />
                      </div>
                    </div>
                  </div>
                </div>
              ))}

              {formData.containers.length === 0 && (
                <div className={`p-8 text-center border-2 border-dashed ${borderColor} rounded-lg`}>
                  <Container size={48} className={`mx-auto mb-4 ${textMuted}`} />
                  <p className={`${textMuted} mb-4`}>
                    {language === 'fr' 
                      ? 'Aucun conteneur ajouté. Cliquez sur "Ajouter un conteneur" pour commencer.'
                      : 'No containers added. Click "Add Container" to get started.'
                    }
                  </p>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Clients */}
        <div className={`${bgSecondary} rounded-xl ${shadowClass} p-6 ${borderColor} border`}>
          <div className="flex items-center mb-6">
            <div className={`p-2 rounded-lg ${bgPrimary} mr-3`}>
              <Users size={20} className={`${textPrimary}`} />
            </div>
            <h2 className={`text-xl font-semibold ${textPrimary}`}>
              {language === 'fr' ? 'Clients' : 'Clients'}
            </h2>
          </div>

          {/* Client search */}
          <div className="relative mb-4">
            <label className={`block text-sm font-medium ${textSecondary} mb-2`}>
              {language === 'fr' ? 'Ajouter des clients' : 'Add Clients'} <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={clientSearchQuery}
              onChange={(e) => {
                setClientSearchQuery(e.target.value);
                setShowClientDropdown(true);
              }}
              onFocus={() => setShowClientDropdown(true)}
              placeholder={language === 'fr' ? 'Rechercher un client...' : 'Search for a client...'}
              className={`block w-full px-4 py-3 border rounded-lg ${bgPrimary} ${textPrimary} focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all ${
                errors.clients ? 'border-red-500' : borderColor
              }`}
            />
            
            {showClientDropdown && filteredClients.length > 0 && (
              <div className={`absolute z-10 mt-1 w-full max-h-60 overflow-auto rounded-md ${bgPrimary} py-1 text-base shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm ${borderColor} border`}>
                {filteredClients.map((client) => (
                  <div
                    key={client.id}
                    className={`px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-700 cursor-pointer ${textPrimary}`}
                    onClick={() => addClient(client.id)}
                  >
                    <div className="font-medium">{client.name}</div>
                    <div className={`text-sm ${textMuted}`}>{client.company}</div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {errors.clients && (
            <p className="mb-4 text-sm text-red-500 flex items-center">
              <AlertCircle size={14} className="mr-1" />
              {errors.clients}
            </p>
          )}

          {/* Selected clients */}
          {formData.clients.length > 0 && (
            <div className="space-y-2">
              <label className={`block text-sm font-medium ${textSecondary}`}>
                {language === 'fr' ? 'Clients sélectionnés' : 'Selected Clients'}
              </label>
              <div className="flex flex-wrap gap-2">
                {formData.clients.map((clientId) => {
                  const client = clients.find(c => c.id === clientId);
                  if (!client) return null;
                  
                  return (
                    <div
                      key={clientId}
                      className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300`}
                    >
                      {client.name}
                      <button
                        type="button"
                        onClick={() => removeClient(clientId)}
                        className="ml-2 hover:text-blue-600 dark:hover:text-blue-400"
                      >
                        <X size={14} />
                      </button>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>

        {/* Itinéraire et capacité */}
        <div className={`${bgSecondary} rounded-xl ${shadowClass} p-6 ${borderColor} border`}>
          <div className="flex items-center mb-6">
            <div className={`p-2 rounded-lg ${bgPrimary} mr-3`}>
              <MapPin size={20} className={`${textPrimary}`} />
            </div>
            <h2 className={`text-xl font-semibold ${textPrimary}`}>
              {language === 'fr' ? 'Itinéraire et capacité' : 'Route and Capacity'}
            </h2>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Origine */}
            <div>
              <label className={`block text-sm font-medium ${textSecondary} mb-2`}>
                {language === 'fr' ? 'Origine' : 'Origin'} <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={formData.origin}
                onChange={(e) => handleInputChange('origin', e.target.value)}
                placeholder={language === 'fr' ? 'Ville, pays' : 'City, country'}
                className={`block w-full px-4 py-3 border rounded-lg ${bgPrimary} ${textPrimary} focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all ${
                  errors.origin ? 'border-red-500' : borderColor
                }`}
              />
              {errors.origin && (
                <p className="mt-1 text-sm text-red-500 flex items-center">
                  <AlertCircle size={14} className="mr-1" />
                  {errors.origin}
                </p>
              )}
            </div>

            {/* Destination */}
            <div>
              <label className={`block text-sm font-medium ${textSecondary} mb-2`}>
                {language === 'fr' ? 'Destination' : 'Destination'} <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={formData.destination}
                onChange={(e) => handleInputChange('destination', e.target.value)}
                placeholder={language === 'fr' ? 'Ville, pays' : 'City, country'}
                className={`block w-full px-4 py-3 border rounded-lg ${bgPrimary} ${textPrimary} focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all ${
                  errors.destination ? 'border-red-500' : borderColor
                }`}
              />
              {errors.destination && (
                <p className="mt-1 text-sm text-red-500 flex items-center">
                  <AlertCircle size={14} className="mr-1" />
                  {errors.destination}
                </p>
              )}
            </div>

            {/* Capacité */}
            <div className="lg:col-span-2">
              <label className={`block text-sm font-medium ${textSecondary} mb-2`}>
                {language === 'fr' ? 'Capacité' : 'Capacity'} <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={formData.capacity}
                onChange={(e) => handleInputChange('capacity', e.target.value)}
                placeholder={language === 'fr' ? 'Ex: 20 pieds, 1000 kg, 50 m³' : 'Ex: 20 feet, 1000 kg, 50 m³'}
                className={`block w-full px-4 py-3 border rounded-lg ${bgPrimary} ${textPrimary} focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all ${
                  errors.capacity ? 'border-red-500' : borderColor
                }`}
              />
              {errors.capacity && (
                <p className="mt-1 text-sm text-red-500 flex items-center">
                  <AlertCircle size={14} className="mr-1" />
                  {errors.capacity}
                </p>
              )}
            </div>
          </div>
        </div>

        {/* Description */}
        <div className={`${bgSecondary} rounded-xl ${shadowClass} p-6 ${borderColor} border`}>
          <div className="flex items-center mb-6">
            <div className={`p-2 rounded-lg ${bgPrimary} mr-3`}>
              <Package size={20} className={`${textPrimary}`} />
            </div>
            <h2 className={`text-xl font-semibold ${textPrimary}`}>
              {language === 'fr' ? 'Description' : 'Description'}
            </h2>
          </div>

          <div>
            <label className={`block text-sm font-medium ${textSecondary} mb-2`}>
              {language === 'fr' ? 'Description du contenu' : 'Content Description'} <span className="text-red-500">*</span>
            </label>
            <textarea
              rows={4}
              value={formData.description}
              onChange={(e) => handleInputChange('description', e.target.value)}
              placeholder={language === 'fr' ? 'Décrivez le contenu du dossier...' : 'Describe the file content...'}
              className={`block w-full px-4 py-3 border rounded-lg ${bgPrimary} ${textPrimary} focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all resize-none ${
                errors.description ? 'border-red-500' : borderColor
              }`}
            />
            {errors.description && (
              <p className="mt-1 text-sm text-red-500 flex items-center">
                <AlertCircle size={14} className="mr-1" />
                {errors.description}
              </p>
            )}
          </div>
        </div>

        {/* Documents */}
        <div className={`${bgSecondary} rounded-xl ${shadowClass} p-6 ${borderColor} border`}>
          <div className="flex items-center mb-6">
            <div className={`p-2 rounded-lg ${bgPrimary} mr-3`}>
              <Upload size={20} className={`${textPrimary}`} />
            </div>
            <h2 className={`text-xl font-semibold ${textPrimary}`}>
              {language === 'fr' ? 'Documents' : 'Documents'}
            </h2>
          </div>

          {/* File upload sections */}
          <div className="space-y-6">
            {/* Facture */}
            <div>
              <label className={`block text-sm font-medium ${textSecondary} mb-2`}>
                {language === 'fr' ? 'Facture' : 'Invoice'} <span className="text-red-500">*</span>
              </label>
              <FileUploadComponent
                onFileSelect={(files) => handleFileUpload(files, 'invoice')}
                maxFileSize={10}
              />
            </div>

            {/* Packing List */}
            <div>
              <label className={`block text-sm font-medium ${textSecondary} mb-2`}>
                {language === 'fr' ? 'Liste de colisage' : 'Packing List'} <span className="text-red-500">*</span>
              </label>
              <FileUploadComponent
                onFileSelect={(files) => handleFileUpload(files, 'packing_list')}
                maxFileSize={10}
              />
            </div>

            {/* Autres documents */}
            <div>
              <label className={`block text-sm font-medium ${textSecondary} mb-2`}>
                {language === 'fr' ? 'Autres documents' : 'Other Documents'}
              </label>
              <FileUploadComponent
                onFileSelect={(files) => handleFileUpload(files, 'other')}
                maxFileSize={10}
              />
            </div>
          </div>

          {/* Uploaded files list */}
          {uploadedFiles.length > 0 && (
            <div className="mt-8">
              <h3 className={`text-lg font-medium ${textPrimary} mb-4`}>
                {language === 'fr' ? 'Fichiers téléchargés' : 'Uploaded Files'} ({uploadedFiles.length})
              </h3>
              <div className="space-y-3">
                {uploadedFiles.map((file) => (
                  <div
                    key={file.id}
                    className={`flex items-center justify-between p-4 rounded-lg border ${borderColor} ${bgPrimary}`}
                  >
                    <div className="flex items-center space-x-3">
                      {getFileIcon(file.type)}
                      <div>
                        <p className={`text-sm font-medium ${textPrimary}`}>{file.name}</p>
                        <div className="flex items-center space-x-2 text-xs">
                          <span className={textMuted}>{getFileTypeLabel(file.type)}</span>
                          <span className={textMuted}>•</span>
                          <span className={textMuted}>{formatFileSize(file.file.size)}</span>
                          <span className={textMuted}>•</span>
                          <span className={`flex items-center ${file.isPrivate ? 'text-orange-600' : 'text-green-600'}`}>
                            {file.isPrivate ? <Lock size={12} className="mr-1" /> : <Unlock size={12} className="mr-1" />}
                            {file.isPrivate 
                              ? (language === 'fr' ? 'Privé' : 'Private')
                              : (language === 'fr' ? 'Public' : 'Public')
                            }
                          </span>
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex items-center space-x-2">
                      <button
                        type="button"
                        onClick={() => toggleFilePrivacy(file.id)}
                        className={`p-2 rounded-lg transition-colors ${
                          file.isPrivate 
                            ? 'text-orange-600 hover:bg-orange-50 dark:hover:bg-orange-900/20'
                            : 'text-green-600 hover:bg-green-50 dark:hover:bg-green-900/20'
                        }`}
                        title={file.isPrivate 
                          ? (language === 'fr' ? 'Rendre public' : 'Make public')
                          : (language === 'fr' ? 'Rendre privé' : 'Make private')
                        }
                      >
                        {file.isPrivate ? <EyeOff size={16} /> : <Eye size={16} />}
                      </button>
                      <button
                        type="button"
                        onClick={() => removeFile(file.id)}
                        className="p-2 rounded-lg text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"
                        title={language === 'fr' ? 'Supprimer' : 'Remove'}
                      >
                        <X size={16} />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Informations système */}
        <div className={`${bgSecondary} rounded-xl ${shadowClass} p-6 ${borderColor} border`}>
          <div className="flex items-center mb-6">
            <div className={`p-2 rounded-lg ${bgPrimary} mr-3`}>
              <Hash size={20} className={`${textPrimary}`} />
            </div>
            <h2 className={`text-xl font-semibold ${textPrimary}`}>
              {language === 'fr' ? 'Informations système' : 'System Information'}
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Agent en charge */}
            <div>
              <label className={`block text-sm font-medium ${textSecondary} mb-2`}>
                {language === 'fr' ? 'Agent en charge' : 'Agent in Charge'}
              </label>
              <div className={`px-4 py-3 border ${borderColor} rounded-lg ${isDark ? 'bg-gray-700' : 'bg-gray-50'} ${textMuted}`}>
                {user?.name}
              </div>
            </div>

            {/* Date de création */}
            <div>
              <label className={`block text-sm font-medium ${textSecondary} mb-2`}>
                {language === 'fr' ? 'Date de création' : 'Creation Date'}
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
            {language === 'fr' ? 'Annuler' : 'Cancel'}
          </button>
          
          <button
            type="submit"
            disabled={isSubmitting}
            className="inline-flex items-center justify-center px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            {isSubmitting ? (
              <>
                <Loader2 size={18} className="animate-spin mr-2" />
                {language === 'fr' ? 'Création...' : 'Creating...'}
              </>
            ) : (
              <>
                <Save size={18} className="mr-2" />
                {language === 'fr' ? 'Créer le dossier' : 'Create File'}
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

export default NewTransitFilePage;