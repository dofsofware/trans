import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { useTheme } from '../../contexts/ThemeContext';
import { useLanguage } from '../../contexts/LanguageContext';
import { getMockClients } from '../../services/clientService';
import { Client } from '../../types/client';
import { Container } from '../../types/container';
import FileUploadComponent from '../../components/common/FileUploadComponent';
import ContainerManager from '../../components/common/ContainerManager';
import LoadingScreen from '../../components/common/LoadingScreen';
import {
  ArrowLeft,
  FileText,
  Users,
  MapPin,
  Package,
  Truck,
  Ship,
  Plane,
  Building,
  User,
  Calendar,
  CheckCircle,
  Eye,
  EyeOff,
  Info,
  Upload,
  X,
  Search,
  Plus
} from 'lucide-react';
import { format } from 'date-fns';
import backImage from '../../utils/backGround_hearder.png';

interface FormData {
  blNumber: string;
  reference: string;
  clientIds: string[];
  origin: string;
  destination: string;
  transportType: 'air' | 'sea';
  shipmentType: 'import' | 'export';
  productType: 'standard' | 'dangerous' | 'fragile';
  capacity: string;
  contentDescription: string;
  containers: Container[];
  documents: {
    invoice?: { file: File; clientVisible: boolean };
    packingList?: { file: File; clientVisible: boolean };
    otherDocuments?: { file: File; clientVisible: boolean }[];
  };
}

interface FormErrors {
  blNumber?: string;
  clientIds?: string;
  origin?: string;
  destination?: string;
  capacity?: string;
  contentDescription?: string;
}

const NewTransitFilePage = () => {
  const { user } = useAuth();
  const { theme } = useTheme();
  const { t } = useLanguage();
  const navigate = useNavigate();
  const [clients, setClients] = useState<Client[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [createdFileId, setCreatedFileId] = useState<string>('');
  const [pageLoaded, setPageLoaded] = useState(false);
  
  // Client search and selection
  const [clientSearch, setClientSearch] = useState('');
  const [showClientDropdown, setShowClientDropdown] = useState(false);
  const [filteredClients, setFilteredClients] = useState<Client[]>([]);

  const [formData, setFormData] = useState<FormData>({
    blNumber: '',
    reference: '',
    clientIds: [],
    origin: '',
    destination: '',
    transportType: 'sea',
    shipmentType: 'import',
    productType: 'standard',
    capacity: '',
    contentDescription: '',
    containers: [],
    documents: {}
  });

  const [errors, setErrors] = useState<FormErrors>({});

  const isDark = theme === 'dark';
  const shadowClass = isDark ? 'shadow-gray-900/20' : 'shadow-sm';
  const hoverShadow = isDark ? 'hover:shadow-gray-900/30' : 'hover:shadow-md';
  const textPrimary = isDark ? 'text-white' : 'text-gray-900';
  const textSecondary = isDark ? 'text-gray-300' : 'text-gray-600';
  const textMuted = isDark ? 'text-gray-400' : 'text-gray-500';
  const bgPrimary = isDark ? 'bg-gray-900' : 'bg-white';
  const bgSecondary = isDark ? 'bg-gray-800' : 'bg-white';
  const borderColor = isDark ? 'border-gray-700' : 'border-gray-200';

  useEffect(() => {
    const fetchClients = async () => {
      try {
        const clientsData = await getMockClients();
        setClients(clientsData);
        setFilteredClients(clientsData);
      } catch (error) {
        console.error('Error fetching clients:', error);
      } finally {
        setIsLoading(false);
        setTimeout(() => setPageLoaded(true), 100);
      }
    };

    fetchClients();
  }, []);

  // Generate automatic reference
  useEffect(() => {
    if (!formData.reference) {
      const year = new Date().getFullYear();
      const timestamp = Date.now().toString().slice(-6);
      setFormData(prev => ({
        ...prev,
        reference: `TF-${year}-${timestamp}`
      }));
    }
  }, []);

  // Filter clients based on search
  useEffect(() => {
    if (clientSearch.trim() === '') {
      setFilteredClients(clients);
    } else {
      const filtered = clients.filter(client =>
        client.name.toLowerCase().includes(clientSearch.toLowerCase()) ||
        client.email.toLowerCase().includes(clientSearch.toLowerCase()) ||
        client.company?.toLowerCase().includes(clientSearch.toLowerCase())
      );
      setFilteredClients(filtered);
    }
  }, [clientSearch, clients]);

  const handleInputChange = (field: keyof FormData, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    
    // Clear error when user starts typing
    if (errors[field as keyof FormErrors]) {
      setErrors(prev => ({ ...prev, [field]: undefined }));
    }
  };

  const handleContainersChange = (containers: Container[]) => {
    setFormData(prev => ({ ...prev, containers }));
  };
  const handleClientSelect = (client: Client) => {
    if (!formData.clientIds.includes(client.id)) {
      setFormData(prev => ({
        ...prev,
        clientIds: [...prev.clientIds, client.id]
      }));
    }
    setClientSearch('');
    setShowClientDropdown(false);
  };

  const handleClientRemove = (clientId: string) => {
    setFormData(prev => ({
      ...prev,
      clientIds: prev.clientIds.filter(id => id !== clientId)
    }));
  };

  const getClientName = (clientId: string) => {
    const client = clients.find(c => c.id === clientId);
    return client ? client.name : t('unknown_client');
  };

  const handleFileUpload = (files: File[], documentType: 'invoice' | 'packingList' | 'otherDocuments', clientVisible: boolean = false) => {
    setFormData(prev => ({
      ...prev,
      documents: {
        ...prev.documents,
        [documentType]: documentType === 'otherDocuments' 
          ? files.map(file => ({ file, clientVisible }))
          : { file: files[0], clientVisible }
      }
    }));
  };

  const toggleFileVisibility = (documentType: 'invoice' | 'packingList', visible: boolean) => {
    setFormData(prev => ({
      ...prev,
      documents: {
        ...prev.documents,
        [documentType]: prev.documents[documentType] 
          ? { ...prev.documents[documentType], clientVisible: visible }
          : undefined
      }
    }));
  };

  const toggleOtherDocumentVisibility = (index: number, visible: boolean) => {
    setFormData(prev => ({
      ...prev,
      documents: {
        ...prev.documents,
        otherDocuments: prev.documents.otherDocuments?.map((doc, i) => 
          i === index ? { ...doc, clientVisible: visible } : doc
        )
      }
    }));
  };
  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};

    if (!formData.blNumber.trim()) {
      newErrors.blNumber = t('required');
    }

    if (formData.clientIds.length === 0) {
      newErrors.clientIds = t('required');
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

    if (!formData.contentDescription.trim()) {
      newErrors.contentDescription = t('required');
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);

    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      const newFileId = `TF-${Date.now()}`;
      setCreatedFileId(newFileId);
      setShowSuccess(true);
    } catch (error) {
      console.error('Error creating transit file:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleBackToDashboard = () => {
    navigate('/');
  };

  const handleViewFile = () => {
    navigate(`/transit-files/${createdFileId}`);
  };

  if (isLoading) {
    return <LoadingScreen />;
  }

  // Success Modal
  if (showSuccess) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <div className={`max-w-md w-full ${bgSecondary} rounded-xl ${shadowClass} p-8 text-center`}>
          <div className="flex justify-center mb-6">
            <div className="w-16 h-16 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center">
              <CheckCircle size={32} className="text-green-600 dark:text-green-400" />
            </div>
          </div>
          
          <h2 className={`text-2xl font-bold ${textPrimary} mb-2`}>
            {t('transit_file_created')}
          </h2>
          
          <p className={`${textSecondary} mb-6`}>
            {t('transit_file_created_desc')}
          </p>
          
          <div className="space-y-3">
            <button
              onClick={handleViewFile}
              className="w-full inline-flex justify-center items-center px-4 py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              <Eye size={18} className="mr-2" />
              {t('view_file')}
            </button>
            
            <button
              onClick={handleBackToDashboard}
              className={`w-full inline-flex justify-center items-center px-4 py-2.5 border ${borderColor} rounded-lg ${bgPrimary} ${textPrimary} hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors`}
            >
              <ArrowLeft size={18} className="mr-2" />
              {t('back_to_dashboard')}
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
        <div className="flex items-center justify-between">
          <div>
            <button
              onClick={() => navigate(-1)}
              className={`inline-flex items-center ${textSecondary} hover:${textPrimary} transition-colors mb-4`}
            >
              <ArrowLeft size={18} className="mr-2" />
              {t('back')}
            </button>
            <h1 className={`text-2xl md:text-3xl font-bold ${textPrimary} mb-2`}>
              {t('new_transit_file')}
            </h1>
            <p className={`${textSecondary} text-lg`}>
              {t('create_transit_file')}
            </p>
          </div>
          <FileText size={48} className={`${isDark ? 'text-blue-400' : 'text-blue-600'} opacity-80`} />
        </div>
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit} className="space-y-8">
        {/* General Information */}
        <div className={`${bgSecondary} rounded-lg ${shadowClass} p-6 border ${borderColor}`}>
          <h2 className={`text-xl font-semibold ${textPrimary} mb-6 flex items-center`}>
            <Info size={20} className="mr-2 text-blue-600" />
            {t('general_information')}
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* BL Number */}
            <div>
              <label className={`block text-sm font-medium ${textSecondary} mb-2`}>
                {t('bl_number')} *
              </label>
              <input
                type="text"
                value={formData.blNumber}
                onChange={(e) => handleInputChange('blNumber', e.target.value)}
                placeholder={t('enter_bl_number')}
                className={`block w-full px-3 py-2.5 border rounded-lg ${bgPrimary} ${textPrimary} focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all ${
                  errors.blNumber ? 'border-red-500' : borderColor
                }`}
              />
              {errors.blNumber && (
                <p className="mt-1 text-sm text-red-500">{errors.blNumber}</p>
              )}
            </div>

            {/* File Reference */}
            <div>
              <label className={`block text-sm font-medium ${textSecondary} mb-2`}>
                {t('file_reference')}
              </label>
              <input
                type="text"
                value={formData.reference}
                onChange={(e) => handleInputChange('reference', e.target.value)}
                className={`block w-full px-3 py-2.5 border ${borderColor} rounded-lg ${bgPrimary} ${textPrimary} focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all`}
                readOnly
              />
            </div>

            {/* Transport Type */}
            <div>
              <label className={`block text-sm font-medium ${textSecondary} mb-2`}>
                {t('transport_type')} *
              </label>
              <div className="grid grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={() => handleInputChange('transportType', 'sea')}
                  className={`flex items-center justify-center px-4 py-3 border rounded-lg transition-all ${
                    formData.transportType === 'sea'
                      ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300'
                      : `border-gray-300 dark:border-gray-600 ${bgPrimary} ${textSecondary} hover:border-blue-400`
                  }`}
                >
                  <Ship size={18} className="mr-2" />
                  {t('maritime')}
                </button>
                <button
                  type="button"
                  onClick={() => handleInputChange('transportType', 'air')}
                  className={`flex items-center justify-center px-4 py-3 border rounded-lg transition-all ${
                    formData.transportType === 'air'
                      ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300'
                      : `border-gray-300 dark:border-gray-600 ${bgPrimary} ${textSecondary} hover:border-blue-400`
                  }`}
                >
                  <Plane size={18} className="mr-2" />
                  {t('aerial')}
                </button>
              </div>
            </div>

            {/* Shipment Type */}
            <div>
              <label className={`block text-sm font-medium ${textSecondary} mb-2`}>
                {t('shipment_type')} *
              </label>
              <select
                value={formData.shipmentType}
                onChange={(e) => handleInputChange('shipmentType', e.target.value)}
                className={`block w-full px-3 py-2.5 border ${borderColor} rounded-lg ${bgPrimary} ${textPrimary} focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all`}
              >
                <option value="import">{t('import')}</option>
                <option value="export">{t('export')}</option>
              </select>
            </div>

            {/* Product Type */}
            <div className="md:col-span-2">
              <label className={`block text-sm font-medium ${textSecondary} mb-2`}>
                {t('product_type')} *
              </label>
              <div className="grid grid-cols-3 gap-3">
                {['standard', 'dangerous', 'fragile'].map((type) => (
                  <button
                    key={type}
                    type="button"
                    onClick={() => handleInputChange('productType', type)}
                    className={`flex items-center justify-center px-4 py-3 border rounded-lg transition-all ${
                      formData.productType === type
                        ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300'
                        : `border-gray-300 dark:border-gray-600 ${bgPrimary} ${textSecondary} hover:border-blue-400`
                    }`}
                  >
                    <Package size={16} className="mr-2" />
                    {t(type)}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Clients Selection */}
        <div className={`${bgSecondary} rounded-lg ${shadowClass} p-6 border ${borderColor}`}>
          <h2 className={`text-xl font-semibold ${textPrimary} mb-6 flex items-center`}>
            <Users size={20} className="mr-2 text-blue-600" />
            {t('add_clients')} *
          </h2>

          {/* Client Search */}
          <div className="relative mb-4">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search size={18} className={textMuted} />
            </div>
            <input
              type="text"
              value={clientSearch}
              onChange={(e) => {
                setClientSearch(e.target.value);
                setShowClientDropdown(true);
              }}
              onFocus={() => setShowClientDropdown(true)}
              placeholder={t('search_client')}
              className={`block w-full pl-10 pr-4 py-2.5 border ${borderColor} rounded-lg ${bgPrimary} ${textPrimary} focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all`}
            />

            {/* Client Dropdown */}
            {showClientDropdown && filteredClients.length > 0 && (
              <div className={`absolute z-10 mt-1 w-full max-h-60 overflow-auto rounded-md ${bgPrimary} py-1 text-base shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm border ${borderColor}`}>
                {filteredClients.map((client) => (
                  <div
                    key={client.id}
                    className={`px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-700 cursor-pointer ${textPrimary}`}
                    onClick={() => handleClientSelect(client)}
                  >
                    <div className="font-medium">{client.name}</div>
                    <div className={`text-sm ${textMuted}`}>{client.company}</div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Selected Clients */}
          {formData.clientIds.length > 0 && (
            <div>
              <h3 className={`text-sm font-medium ${textSecondary} mb-3`}>
                {t('selected_clients')}
              </h3>
              <div className="flex flex-wrap gap-2">
                {formData.clientIds.map((clientId) => (
                  <span
                    key={clientId}
                    className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300"
                  >
                    {getClientName(clientId)}
                    <button
                      type="button"
                      onClick={() => handleClientRemove(clientId)}
                      className="ml-2 hover:text-blue-600 dark:hover:text-blue-400"
                    >
                      <X size={14} />
                    </button>
                  </span>
                ))}
              </div>
            </div>
          )}

          {errors.clientIds && (
            <p className="mt-2 text-sm text-red-500">{errors.clientIds}</p>
          )}
        </div>

        {/* Route and Capacity */}
        <div className={`${bgSecondary} rounded-lg ${shadowClass} p-6 border ${borderColor}`}>
          <h2 className={`text-xl font-semibold ${textPrimary} mb-6 flex items-center`}>
            <MapPin size={20} className="mr-2 text-blue-600" />
            {t('route_and_capacity')}
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Origin */}
            <div>
              <label className={`block text-sm font-medium ${textSecondary} mb-2`}>
                {t('origin')} *
              </label>
              <input
                type="text"
                value={formData.origin}
                onChange={(e) => handleInputChange('origin', e.target.value)}
                placeholder={t('city_country')}
                className={`block w-full px-3 py-2.5 border rounded-lg ${bgPrimary} ${textPrimary} focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all ${
                  errors.origin ? 'border-red-500' : borderColor
                }`}
              />
              {errors.origin && (
                <p className="mt-1 text-sm text-red-500">{errors.origin}</p>
              )}
            </div>

            {/* Destination */}
            <div>
              <label className={`block text-sm font-medium ${textSecondary} mb-2`}>
                {t('destination')} *
              </label>
              <input
                type="text"
                value={formData.destination}
                onChange={(e) => handleInputChange('destination', e.target.value)}
                placeholder={t('city_country')}
                className={`block w-full px-3 py-2.5 border rounded-lg ${bgPrimary} ${textPrimary} focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all ${
                  errors.destination ? 'border-red-500' : borderColor
                }`}
              />
              {errors.destination && (
                <p className="mt-1 text-sm text-red-500">{errors.destination}</p>
              )}
            </div>

            {/* Capacity */}
            <div className="md:col-span-2">
              <label className={`block text-sm font-medium ${textSecondary} mb-2`}>
                {t('capacity')} *
              </label>
              <input
                type="text"
                value={formData.capacity}
                onChange={(e) => handleInputChange('capacity', e.target.value)}
                placeholder={t('capacity_example')}
                className={`block w-full px-3 py-2.5 border rounded-lg ${bgPrimary} ${textPrimary} focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all ${
                  errors.capacity ? 'border-red-500' : borderColor
                }`}
              />
              {errors.capacity && (
                <p className="mt-1 text-sm text-red-500">{errors.capacity}</p>
              )}
            </div>
          </div>
        </div>

        {/* Containers Section - Only for Sea Transport */}
        {formData.transportType === 'sea' && (
          <div className={`${bgSecondary} rounded-lg ${shadowClass} p-6 border ${borderColor}`}>
            <ContainerManager
              containers={formData.containers}
              onContainersChange={handleContainersChange}
            />
          </div>
        )}

        {/* Content Description */}
        <div className={`${bgSecondary} rounded-lg ${shadowClass} p-6 border ${borderColor}`}>
          <h2 className={`text-xl font-semibold ${textPrimary} mb-6 flex items-center`}>
            <FileText size={20} className="mr-2 text-blue-600" />
            {t('content_description')} *
          </h2>

          <textarea
            value={formData.contentDescription}
            onChange={(e) => handleInputChange('contentDescription', e.target.value)}
            placeholder={t('describe_content')}
            rows={4}
            className={`block w-full px-3 py-2.5 border rounded-lg ${bgPrimary} ${textPrimary} focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all ${
              errors.contentDescription ? 'border-red-500' : borderColor
            }`}
          />
          {errors.contentDescription && (
            <p className="mt-1 text-sm text-red-500">{errors.contentDescription}</p>
          )}
        </div>

        {/* Documents Upload */}
        <div className={`${bgSecondary} rounded-lg ${shadowClass} p-6 border ${borderColor}`}>
          <h2 className={`text-xl font-semibold ${textPrimary} mb-6 flex items-center`}>
            <Upload size={20} className="mr-2 text-blue-600" />
            {t('uploaded_files')}
          </h2>

          <div className="space-y-6">
            {/* Invoice */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <label className={`text-sm font-medium ${textSecondary}`}>
                {t('invoice')}
              </label>
                {formData.documents.invoice && (
                  <div className="flex items-center space-x-2">
                    <span className={`text-xs ${textMuted}`}>
                      {t('client_visible')}:
                    </span>
                    <button
                      type="button"
                      onClick={() => toggleFileVisibility('invoice', !formData.documents.invoice?.clientVisible)}
                      className={`relative inline-flex h-5 w-9 items-center rounded-full transition-colors ${
                        formData.documents.invoice?.clientVisible 
                          ? 'bg-blue-600' 
                          : 'bg-gray-300 dark:bg-gray-600'
                      }`}
                    >
                      <span
                        className={`inline-block h-3 w-3 transform rounded-full bg-white transition-transform ${
                          formData.documents.invoice?.clientVisible ? 'translate-x-5' : 'translate-x-1'
                        }`}
                      />
                    </button>
                  </div>
                )}
              </div>
              <FileUploadComponent
                onFileSelect={(files) => handleFileUpload(files, 'invoice', false)}
                maxFileSize={5}
              />
            </div>

            {/* Packing List */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <label className={`text-sm font-medium ${textSecondary}`}>
                {t('packing_list')}
              </label>
                {formData.documents.packingList && (
                  <div className="flex items-center space-x-2">
                    <span className={`text-xs ${textMuted}`}>
                      {t('client_visible')}:
                    </span>
                    <button
                      type="button"
                      onClick={() => toggleFileVisibility('packingList', !formData.documents.packingList?.clientVisible)}
                      className={`relative inline-flex h-5 w-9 items-center rounded-full transition-colors ${
                        formData.documents.packingList?.clientVisible 
                          ? 'bg-blue-600' 
                          : 'bg-gray-300 dark:bg-gray-600'
                      }`}
                    >
                      <span
                        className={`inline-block h-3 w-3 transform rounded-full bg-white transition-transform ${
                          formData.documents.packingList?.clientVisible ? 'translate-x-5' : 'translate-x-1'
                        }`}
                      />
                    </button>
                  </div>
                )}
              </div>
              <FileUploadComponent
                onFileSelect={(files) => handleFileUpload(files, 'packingList', false)}
                maxFileSize={5}
              />
            </div>

            {/* Other Documents */}
            <div>
              <label className={`block text-sm font-medium ${textSecondary} mb-2`}>
                {t('other_documents')}
              </label>
              <FileUploadComponent
                onFileSelect={(files) => handleFileUpload(files, 'otherDocuments', false)}
                maxFileSize={5}
              />
              {/* Other Documents Visibility Controls */}
              {formData.documents.otherDocuments && formData.documents.otherDocuments.length > 0 && (
                <div className="mt-3 space-y-2">
                  <h4 className={`text-sm font-medium ${textSecondary}`}>
                    {t('file_visibility_settings')}:
                  </h4>
                  {formData.documents.otherDocuments.map((doc, index) => (
                    <div key={index} className={`flex items-center justify-between p-2 rounded border ${borderColor}`}>
                      <span className={`text-sm ${textPrimary} truncate flex-1 mr-4`}>
                        {doc.file.name}
                      </span>
                      <div className="flex items-center space-x-2">
                        <span className={`text-xs ${textMuted}`}>
                          {t('client_visible')}:
                        </span>
                        <button
                          type="button"
                          onClick={() => toggleOtherDocumentVisibility(index, !doc.clientVisible)}
                          className={`relative inline-flex h-5 w-9 items-center rounded-full transition-colors ${
                            doc.clientVisible 
                              ? 'bg-blue-600' 
                              : 'bg-gray-300 dark:bg-gray-600'
                          }`}
                        >
                          <span
                            className={`inline-block h-3 w-3 transform rounded-full bg-white transition-transform ${
                              doc.clientVisible ? 'translate-x-5' : 'translate-x-1'
                            }`}
                          />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>


        {/* System Information */}
        <div className={`${bgSecondary} rounded-lg ${shadowClass} p-6 border ${borderColor}`}>
          <h2 className={`text-xl font-semibold ${textPrimary} mb-6 flex items-center`}>
            <Building size={20} className="mr-2 text-blue-600" />
            {t('system_information')}
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className={`block text-sm font-medium ${textSecondary} mb-2`}>
                {t('agent_in_charge')}
              </label>
              <div className={`flex items-center px-3 py-2.5 border ${borderColor} rounded-lg ${bgPrimary}`}>
                <User size={18} className={`mr-2 ${textMuted}`} />
                <span className={textPrimary}>{user?.name}</span>
              </div>
            </div>

            <div>
              <label className={`block text-sm font-medium ${textSecondary} mb-2`}>
                {t('creation_date')}
              </label>
              <div className={`flex items-center px-3 py-2.5 border ${borderColor} rounded-lg ${bgPrimary}`}>
                <Calendar size={18} className={`mr-2 ${textMuted}`} />
                <span className={textPrimary}>{format(new Date(), 'dd/MM/yyyy')}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Submit Button */}
        <div className="flex justify-end space-x-4">
          <button
            type="button"
            onClick={() => navigate(-1)}
            className={`px-6 py-3 border ${borderColor} rounded-lg ${bgPrimary} ${textPrimary} hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors`}
          >
            {t('cancel')}
          </button>
          <button
            type="submit"
            disabled={isSubmitting}
            className="px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors inline-flex items-center"
          >
            {isSubmitting ? (
              <>
                <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                {t('creating')}
              </>
            ) : (
              <>
                <Plus size={18} className="mr-2" />
                {t('create_file')}
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