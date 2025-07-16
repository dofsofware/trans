import React from 'react';
import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { useTheme } from '../../contexts/ThemeContext';
import { useLanguage } from '../../contexts/LanguageContext';
import { getMockClients } from '../../services/clientService';
import { getTransitFileById, updateTransitFile } from '../../services/transitFileService';
import { Client } from '../../types/client';
import { Container } from '../../types/container';
import { TransitFile } from '../../types/transitFile';
import FileUploadComponent from '../../components/common/FileUploadComponent';
import ContainerManager from '../../components/common/ContainerManager';
import LoadingScreen from '../../components/common/LoadingScreen';
import TransitEventsManager from '../../components/common/TransitEventsManager';
import {
  ArrowLeft,
  ArrowRight,
  FileText,
  Users,
  MapPin,
  Package,
  Ship,
  Plane,
  Building,
  AlertCircle,
  User,
  Calendar,
  CheckCircle,
  Eye,
  Info,
  Upload,
  X,
  Search,
  Plus,
  Clock,
  Edit3,
  Save,
  Check
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
    invoice?: { file: File | string; clientVisible: boolean };
    packingList?: { file: File | string; clientVisible: boolean };
    otherDocuments?: { file: File | string; clientVisible: boolean }[];
  };
  events: TransitEvent[];
}

interface TransitEvent {
  id: string;
  name: string;
  date: string;
  agentId: string;
  agentName: string;
  details?: string;
  completed: boolean;
}

interface FormErrors {
  blNumber?: string;
  clientIds?: string;
  origin?: string;
  destination?: string;
  capacity?: string;
  contentDescription?: string;
}

const EditTransitFilePage = () => {
  const { id } = useParams<{ id: string }>();
  const { user } = useAuth();
  const { theme } = useTheme();
  const { t } = useLanguage();
  const navigate = useNavigate();
  const [clients, setClients] = useState<Client[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [pageLoaded, setPageLoaded] = useState(false);
  const [currentStep, setCurrentStep] = useState(1);
  const [completedSteps, setCompletedSteps] = useState<number[]>([]);
  const [originalFile, setOriginalFile] = useState<TransitFile | null>(null);

  // Client search and selection
  const [clientSearch, setClientSearch] = useState('');
  const [showClientDropdown, setShowClientDropdown] = useState(false);
  const [filteredClients, setFilteredClients] = useState<Client[]>([]);

  // Initialisation des événements prédéfinis
  useEffect(() => {
    if (pageLoaded && formData) {
      // Création d'une liste de 10 événements prédéfinis
      const predefinedEvents: TransitEvent[] = [

        {

          id: 'event1',

          name: t('export_pregate'),

          date: '2024-01-15',

          agentId: 'agent1',

          agentName: 'John Doe',

          details: '',

          completed: true

        },

        {

          id: 'event2',

          name: t('warehouse_reception'),

          date: '2024-01-16',

          agentId: 'agent2',

          agentName: 'Jane Smith',

          details: '',

          completed: true

        },

        {

          id: 'event3',

          name: t('declaration'),

          date: '2024-01-17',

          agentId: 'agent3',

          agentName: 'Robert Johnson',

          details: '',

          completed: true

        },

        {

          id: 'event4',

          name: t('export_customs_clearance'),

          date: '',

          agentId: '',

          agentName: '',

          details: '',

          completed: false

        },

        {

          id: 'event5',

          name: t('warehouse_loading'),

          date: '',

          agentId: '',

          agentName: '',

          details: '',

          completed: false

        },

        {

          id: 'event6',

          name: t('effective_transport'),

          date: '',

          agentId: '',

          agentName: '',

          details: '',

          completed: false

        },

        {

          id: 'event7',

          name: t('vessel_loading'),

          date: '',

          agentId: '',

          agentName: '',

          details: '',

          completed: false

        },

        {

          id: 'event8',

          name: t('departure'),

          date: '',

          agentId: '',

          agentName: '',

          details: '',

          completed: false

        },

        {

          id: 'event9',

          name: t('estimated_arrival'),

          date: '',

          agentId: '',

          agentName: '',

          details: '',

          completed: false

        },

        {

          id: 'event10',

          name: t('billing'),

          date: '',

          agentId: '',

          agentName: '',

          details: '',

          completed: false

        }

      ];

      // Mise à jour des événements dans formData
      setFormData(prev => ({
        ...prev,
        events: predefinedEvents
      }));
    }
  }, [pageLoaded, user]);

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
    documents: {},
    events: []
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

  // Steps configuration
  const steps = [
    { id: 1, name: t('general_information'), icon: Info },
    { id: 2, name: t('clients_and_route'), icon: Users },
    { id: 3, name: t('cargo_details'), icon: Package },
    { id: 4, name: t('documents'), icon: FileText },
    { id: 5, name: t('events'), icon: Calendar }
  ];

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

  // Events configuration based on shipment type
  const getEventsByShipmentType = (shipmentType: 'import' | 'export'): Omit<TransitEvent, 'id' | 'date' | 'agentId' | 'agentName' | 'completed'>[] => {
    if (shipmentType === 'export') {
      return [
        { name: t('export_pregate'), details: '' },
        { name: t('warehouse_reception'), details: '' },
        { name: t('declaration'), details: '' },
        { name: t('export_customs_clearance'), details: '' },
        { name: t('warehouse_loading'), details: '' },
        { name: t('effective_transport'), details: '' },
        { name: t('vessel_loading'), details: '' },
        { name: t('departure'), details: '' },
        { name: t('estimated_arrival'), details: '' },
        { name: t('billing'), details: '' }
      ];
    } else {
      return [
        { name: t('import_prealert'), details: '' },
        { name: t('arrival'), details: '' },
        { name: t('declaration'), details: '' },
        { name: t('import_customs_clearance'), details: '' },
        { name: t('maritime_company_slip'), details: '' },
        { name: t('import_pregate'), details: '' },
        { name: t('pickup'), details: '' },
        { name: t('delivery'), details: '' },
        { name: t('warehouse_arrival'), details: '' },
        { name: t('billing'), details: '' }
      ];
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [clientsData, fileData] = await Promise.all([
          getMockClients(),
          getTransitFileById(id!)
        ]);

        setClients(clientsData);
        setFilteredClients(clientsData);
        setOriginalFile(fileData);

        // Initialize form with existing file data
        setFormData({
          blNumber: fileData.blNumber,
          reference: fileData.reference,
          clientIds: fileData.clientIds,
          origin: fileData.origin,
          destination: fileData.destination,
          transportType: fileData.transportType,
          shipmentType: fileData.shipmentType,
          productType: fileData.productType,
          capacity: fileData.capacity,
          contentDescription: fileData.contentDescription,
          containers: fileData.containers,
          documents: fileData.documents,
          events: fileData.events
        });

        // Mark all steps as completed since we're editing
        setCompletedSteps(steps.map(step => step.id));
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setIsLoading(false);
        setTimeout(() => setPageLoaded(true), 100);
      }
    };

    fetchData();
  }, [id]);

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

  const handleEventChange = (eventId: string, field: 'date' | 'details' | 'completed', value: string | boolean) => {
    setFormData(prev => ({
      ...prev,
      events: prev.events.map(event =>
        event.id === eventId ? { ...event, [field]: value } : event
      )
    }));
  };

  const validateStep = (step: number): boolean => {
    const newErrors: FormErrors = {};

    switch (step) {
      case 1:
        if (!formData.blNumber.trim()) {
          newErrors.blNumber = t('required');
        }
        if (!formData.contentDescription.trim()) {
          newErrors.contentDescription = t('required');
        }
        break;
      case 2:
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
        break;
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNextStep = () => {
    if (validateStep(currentStep)) {
      if (!completedSteps.includes(currentStep)) {
        setCompletedSteps(prev => [...prev, currentStep]);
      }
      if (currentStep < steps.length) {
        setCurrentStep(currentStep + 1);
      }
    }
  };

  const handlePrevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleStepClick = (stepId: number) => {
    if (stepId <= currentStep || completedSteps.includes(stepId)) {
      setCurrentStep(stepId);
    }
  };

  const handleSubmit = async () => {
    if (!validateStep(currentStep)) {
      return;
    }

    setIsSubmitting(true);

    try {
      // Prepare the updated file data
      const updatedFile = {
        ...originalFile,
        ...formData,
        updatedAt: new Date().toISOString(),
        updatedBy: user?.id || ''
      };

      // Simulate API call
      await updateTransitFile(updatedFile);
      setShowSuccess(true);
    } catch (error) {
      console.error('Error updating transit file:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleBackToDashboard = () => {
    navigate('/');
  };

  const handleViewFile = () => {
    navigate(`/transit-files/${id}`);
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
            {t('transit_file_updated')}
          </h2>

          <p className={`${textSecondary} mb-6`}>
            {t('transit_file_updated_desc')}
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

  const renderStepContent = () => {
    switch (currentStep) {
      case 1:
        return (
          <div className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
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
                  className={`block w-full px-3 py-2.5 border rounded-lg ${bgPrimary} ${textPrimary} focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all ${errors.blNumber ? 'border-red-500' : borderColor
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
                    className={`flex items-center justify-center px-4 py-3 border rounded-lg transition-all ${formData.transportType === 'sea'
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
                    className={`flex items-center justify-center px-4 py-3 border rounded-lg transition-all ${formData.transportType === 'air'
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
              <div className="lg:col-span-2">
                <label className={`block text-sm font-medium ${textSecondary} mb-2`}>
                  {t('product_type')} *
                </label>
                <div className="grid grid-cols-3 gap-3">
                  {['standard', 'dangerous', 'fragile'].map((type) => (
                    <button
                      key={type}
                      type="button"
                      onClick={() => handleInputChange('productType', type)}
                      className={`flex items-center justify-center px-4 py-3 border rounded-lg transition-all ${formData.productType === type
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

            {/* Content Description */}
            <div>
              <label className={`block text-sm font-medium ${textSecondary} mb-2`}>
                {t('content_description')} *
              </label>
              <textarea
                value={formData.contentDescription}
                onChange={(e) => handleInputChange('contentDescription', e.target.value)}
                placeholder={t('describe_content')}
                rows={4}
                className={`block w-full px-3 py-2.5 border rounded-lg ${bgPrimary} ${textPrimary} focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all ${errors.contentDescription ? 'border-red-500' : borderColor
                  }`}
              />
              {errors.contentDescription && (
                <p className="mt-1 text-sm text-red-500">{errors.contentDescription}</p>
              )}
            </div>
          </div>
        );

      case 2:
        return (
          <div className="space-y-6">
            {/* Clients Section */}
            <div className={`p-4 rounded-lg border ${borderColor} ${bgSecondary}`}>
              <h3 className={`text-lg font-medium ${textPrimary} mb-4 flex items-center`}>
                <Users size={20} className="mr-2 text-blue-600" />
                {t('clients_selection')}
              </h3>

              {/* Client Search */}
              <div className="relative">
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
                  onBlur={() => {
                    // Délai pour permettre le clic sur un élément de la liste
                    setTimeout(() => setShowClientDropdown(false), 200);
                  }}
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
                        onMouseDown={(e) => {
                          // Empêche le blur de l'input lors du clic
                          e.preventDefault();
                        }}
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
                <p className="text-sm text-red-500">{errors.clientIds}</p>
              )}
            </div>

            {/* Route and Capacity Section */}
            <div className={`p-4 rounded-lg border ${borderColor} ${bgSecondary}`}>
              <h3 className={`text-lg font-medium ${textPrimary} mb-4 flex items-center`}>
                <MapPin size={20} className="mr-2 text-blue-600" />
                {t('route_and_capacity')}
              </h3>

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
                    className={`block w-full px-3 py-2.5 border rounded-lg ${bgPrimary} ${textPrimary} focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all ${errors.origin ? 'border-red-500' : borderColor
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
                    className={`block w-full px-3 py-2.5 border rounded-lg ${bgPrimary} ${textPrimary} focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all ${errors.destination ? 'border-red-500' : borderColor
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
                    className={`block w-full px-3 py-2.5 border rounded-lg ${bgPrimary} ${textPrimary} focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all ${errors.capacity ? 'border-red-500' : borderColor
                      }`}
                  />
                  {errors.capacity && (
                    <p className="mt-1 text-sm text-red-500">{errors.capacity}</p>
                  )}
                </div>
              </div>
            </div>
          </div>
        );

      case 3:
        return formData.transportType === 'sea' ? (
          <div onClick={(e) => e.stopPropagation()}>
            <ContainerManager
              containers={formData.containers}
              onContainersChange={handleContainersChange}
            />
          </div>
        ) : (
          <div className={`text-center py-12 ${bgSecondary} rounded-lg border ${borderColor}`}>
            <Plane size={48} className={`mx-auto mb-4 ${textMuted}`} />
            <h3 className={`text-lg font-medium ${textPrimary} mb-2`}>
              {t('air_transport_selected')}
            </h3>
            <p className={textMuted}>
              {t('containers_not_applicable_air')}
            </p>
          </div>
        );

      case 4:
        return (
          <div className="space-y-6">
            {/* Documents Section */}
            <div className={`p-4 rounded-lg border ${borderColor} ${bgSecondary}`}>
              <h3 className={`text-lg font-medium ${textPrimary} mb-4 flex items-center`}>
                <Upload size={20} className="mr-2 text-blue-600" />
                {t('documents')}
              </h3>

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
                          className={`relative inline-flex h-5 w-9 items-center rounded-full transition-colors ${formData.documents.invoice?.clientVisible
                            ? 'bg-blue-600'
                            : 'bg-gray-300 dark:bg-gray-600'
                            }`}
                        >
                          <span
                            className={`inline-block h-3 w-3 transform rounded-full bg-white transition-transform ${formData.documents.invoice?.clientVisible ? 'translate-x-5' : 'translate-x-1'
                              }`}
                          />
                        </button>
                      </div>
                    )}
                  </div>
                  <FileUploadComponent
                    onFileSelect={(files) => handleFileUpload(files, 'invoice', false)}
                    maxFileSize={5}
                    existingFile={typeof formData.documents.invoice?.file === 'string' ? formData.documents.invoice.file : undefined}
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
                          className={`relative inline-flex h-5 w-9 items-center rounded-full transition-colors ${formData.documents.packingList?.clientVisible
                            ? 'bg-blue-600'
                            : 'bg-gray-300 dark:bg-gray-600'
                            }`}
                        >
                          <span
                            className={`inline-block h-3 w-3 transform rounded-full bg-white transition-transform ${formData.documents.packingList?.clientVisible ? 'translate-x-5' : 'translate-x-1'
                              }`}
                          />
                        </button>
                      </div>
                    )}
                  </div>
                  <FileUploadComponent
                    onFileSelect={(files) => handleFileUpload(files, 'packingList', false)}
                    maxFileSize={5}
                    existingFile={typeof formData.documents.packingList?.file === 'string' ? formData.documents.packingList.file : undefined}
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
                    multiple
                    existingFiles={formData.documents.otherDocuments?.filter(doc => typeof doc.file === 'string').map(doc => doc.file as string)}
                  />
                  {formData.documents.otherDocuments && formData.documents.otherDocuments.length > 0 && (
                    <div className="mt-3 space-y-2">
                      <h4 className={`text-sm font-medium ${textSecondary}`}>
                        {t('file_visibility_settings')}:
                      </h4>
                      {formData.documents.otherDocuments.map((doc, index) => (
                        <div key={index} className={`flex items-center justify-between p-2 rounded border ${borderColor}`}>
                          <span className={`text-sm ${textPrimary} truncate flex-1 mr-4`}>
                            {typeof doc.file === 'string' ? doc.file.split('/').pop() : doc.file.name}
                          </span>
                          <div className="flex items-center space-x-2">
                            <span className={`text-xs ${textMuted}`}>
                              {t('client_visible')}:
                            </span>
                            <button
                              type="button"
                              onClick={() => toggleOtherDocumentVisibility(index, !doc.clientVisible)}
                              className={`relative inline-flex h-5 w-9 items-center rounded-full transition-colors ${doc.clientVisible
                                ? 'bg-blue-600'
                                : 'bg-gray-300 dark:bg-gray-600'
                                }`}
                            >
                              <span
                                className={`inline-block h-3 w-3 transform rounded-full bg-white transition-transform ${doc.clientVisible ? 'translate-x-5' : 'translate-x-1'
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
          </div>
        );

      case 5:
        return (
          <div className="space-y-4 sm:space-y-6">
            {/* Utilisation du composant TransitEventsManager */}
            <TransitEventsManager
              events={formData.events}
              onEventChange={handleEventChange}
              isDark={isDark}
              t={t}
              readOnly={false}
            />

          </div>
        );

      default:
        return null;
    }
  };

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
              {t('edit_transit_file')}
            </h1>
            <p className={`${textSecondary} text-lg`}>
              {t('edit_transit_file_step_by_step')}
            </p>
          </div>
          <div className={`px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300`}>
            {formData.reference}
          </div>
        </div>
      </div>

      {/* Steps Navigation */}
      <div className={`${bgSecondary} rounded-2xl ${shadowClass} p-6 mb-8 border ${borderColor}`}>
        {/* Desktop/Tablet Version - Horizontal Navigation */}
        <div className="hidden md:block">
          <div className="flex items-center justify-between relative">
            {/* Progress line background */}
            <div className="absolute top-6 left-6 right-6 h-0.5 bg-gray-200 dark:bg-gray-700 rounded-full" />
            <div
              className="absolute top-6 left-6 h-0.5 bg-gradient-to-r from-green-500 to-green-600 rounded-full transition-all duration-500 ease-out"
              style={{
                width: `${(completedSteps.length / (steps.length - 1)) * 100}%`,
                maxWidth: 'calc(100% - 48px)'
              }}
            />

            {/* Steps */}
            {steps.map((step, index) => {
              const Icon = step.icon;
              const isActive = step.id === currentStep;
              const isCompleted = completedSteps.includes(step.id);
              const isAccessible = step.id <= currentStep || completedSteps.includes(step.id);

              return (
                <div key={step.id} className="flex flex-col items-center relative z-10">
                  <button
                    onClick={() => handleStepClick(step.id)}
                    disabled={!isAccessible}
                    className={`w-12 h-12 rounded-full flex items-center justify-center transition-all duration-300 mb-3 group ${isActive
                        ? 'bg-blue-600 text-white shadow-lg scale-110 ring-4 ring-blue-200 dark:ring-blue-800'
                        : isCompleted
                          ? 'bg-green-500 text-white shadow-md hover:scale-105'
                          : isAccessible
                            ? 'bg-white dark:bg-gray-800 text-gray-600 dark:text-gray-300 shadow-md hover:shadow-lg hover:scale-105 border-2 border-gray-200 dark:border-gray-600'
                            : 'bg-gray-100 dark:bg-gray-700 text-gray-400 dark:text-gray-500 cursor-not-allowed'
                      }`}
                  >
                    {isCompleted ? <Check size={20} /> : <Icon size={20} />}
                  </button>

                  <span className={`text-sm font-medium text-center max-w-20 leading-tight transition-all duration-300 ${isActive
                      ? 'text-blue-600 dark:text-blue-400 font-semibold'
                      : isCompleted
                        ? 'text-green-600 dark:text-green-400'
                        : isAccessible
                          ? textPrimary
                          : textMuted
                    }`}>
                    {step.name}
                  </span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Mobile Version - Icons only horizontal navigation */}
        <div className="block md:hidden">
          <div className="flex items-center justify-between relative px-2">
            {/* Progress line background */}
            <div className="absolute top-4 left-4 right-4 h-0.5 bg-gray-200 dark:bg-gray-700 rounded-full" />
            <div
              className="absolute top-4 left-4 h-0.5 bg-gradient-to-r from-green-500 to-green-600 rounded-full transition-all duration-500 ease-out"
              style={{
                width: `${(completedSteps.length / (steps.length - 1)) * 100}%`,
                maxWidth: 'calc(100% - 32px)'
              }}
            />

            {/* Steps - Icons only */}
            {steps.map((step, index) => {
              const Icon = step.icon;
              const isActive = step.id === currentStep;
              const isCompleted = completedSteps.includes(step.id);
              const isAccessible = step.id <= currentStep || completedSteps.includes(step.id);

              return (
                <button
                  key={step.id}
                  onClick={() => handleStepClick(step.id)}
                  disabled={!isAccessible}
                  className={`w-8 h-8 rounded-full flex items-center justify-center transition-all duration-300 relative z-10 ${isActive
                      ? 'bg-blue-600 text-white shadow-lg scale-110 ring-2 ring-blue-200 dark:ring-blue-800'
                      : isCompleted
                        ? 'bg-green-500 text-white shadow-md'
                        : isAccessible
                          ? 'bg-white dark:bg-gray-800 text-gray-600 dark:text-gray-300 shadow-md border border-gray-200 dark:border-gray-600'
                          : 'bg-gray-100 dark:bg-gray-700 text-gray-400 dark:text-gray-500 cursor-not-allowed'
                    }`}
                >
                  {isCompleted ? <Check size={14} /> : <Icon size={14} />}
                </button>
              );
            })}
          </div>

          {/* Current step name in mobile */}
          <div className="mt-4 text-center">
            <span className={`text-sm font-medium ${textPrimary}`}>
              {steps.find(step => step.id === currentStep)?.name}
            </span>
          </div>
        </div>

        {/* Progress indicator */}
        <div className="mt-8 pt-6 border-t border-gray-200 dark:border-gray-700">
          <div className="flex justify-between items-center">
            <span className={`text-sm font-medium ${textMuted}`}>
              {t('step')} {currentStep} {t('of')} {steps.length}
            </span>
            <span className={`text-sm font-medium text-blue-600 dark:text-blue-400`}>
              {Math.round((currentStep / steps.length) * 100)}% {t('completed')}
            </span>
          </div>
        </div>
      </div>

      {/* Step Content */}
      <div className={`${bgSecondary} rounded-lg ${shadowClass} p-6 mb-8 border ${borderColor}`}>
        <div className="mb-6">
          <h2 className={`text-xl font-semibold ${textPrimary} mb-2 flex items-center`}>
            {React.createElement(steps[currentStep - 1].icon, { size: 20, className: "mr-2 text-blue-600" })}
            {steps[currentStep - 1].name}
          </h2>
        </div>

        {renderStepContent()}
      </div>

      {/* Navigation Buttons */}
      <div className="flex justify-between">
        <button
          type="button"
          onClick={handlePrevStep}
          disabled={currentStep === 1}
          className={`inline-flex items-center px-6 py-3 border ${borderColor} rounded-lg ${bgPrimary} ${textPrimary} hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed`}
        >
          <ArrowLeft size={18} className="mr-2" />
          {t('previous')}
        </button>

        {currentStep < steps.length ? (
          <button
            type="button"
            onClick={handleNextStep}
            className="inline-flex items-center px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            {t('next')}
            <ArrowRight size={18} className="ml-2" />
          </button>
        ) : (
          <button
            type="button"
            onClick={handleSubmit}
            disabled={isSubmitting}
            className="inline-flex items-center px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            {isSubmitting ? (
              <>
                <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                {t('updating')}
              </>
            ) : (
              <>
                <Save size={18} className="mr-2" />
                {t('update')}
              </>
            )}
          </button>
        )}
      </div>

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

export default EditTransitFilePage;