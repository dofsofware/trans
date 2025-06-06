import { useState } from 'react';
import { AlertCircle, X, Check } from 'lucide-react';
import { useLanguage } from '../../contexts/LanguageContext';
import { useTheme } from '../../contexts/ThemeContext';

// Modal de réclamation
const ClaimModal = ({ isOpen, onClose, shipmentId }) => {
  const { t } = useLanguage();
  const { theme } = useTheme();
  const [message, setMessage] = useState('');
  const [claimType, setClaimType] = useState('');
  const [isSending, setIsSending] = useState(false);
  const [showNotification, setShowNotification] = useState(false);

  if (!isOpen) return null;

  // Types de réclamations
  const claimTypes = [
    { value: 'agent_change', label: t('request_agent_change') },
    { value: 'delivery_issue', label: t('delivery_issue') },
    { value: 'damaged_goods', label: t('damaged_goods') },
    { value: 'missing_items', label: t('missing_items') },
    { value: 'delay_complaint', label: t('delay_complaint') },
    { value: 'billing_issue', label: t('billing_issue') },
    { value: 'other', label: t('other') }
  ];

  const handleSend = () => {
    if (!message.trim() || !claimType) return;

    setIsSending(true);

    // Simuler l'envoi de la réclamation
    setTimeout(() => {
      setIsSending(false);
      setMessage('');
      setClaimType('');
      setShowNotification(true);

      // Masquer la notification après 3 secondes
      setTimeout(() => {
        setShowNotification(false);
        onClose();
      }, 3000);
    }, 1000);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
      <div className={`rounded-lg shadow-xl w-full max-w-md overflow-hidden ${
        theme === 'dark' ? 'bg-gray-800' : 'bg-white'
      }`}>
        {/* Header */}
        <div className="px-4 py-3 bg-red-600 text-white flex justify-between items-center">
          <h3 className="text-lg font-medium flex items-center">
            <AlertCircle size={18} className="mr-2" />
            {t('file_claim')}
          </h3>
          <button
            onClick={onClose}
            className="p-1 rounded-full hover:bg-red-700 transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        {/* Content */}
        <div className="p-4">
          {/* Shipment reference */}
          <div className="mb-4">
            <p className={`text-xs font-medium ${
              theme === 'dark' ? 'text-gray-400' : 'text-gray-500'
            }`}>
              {t('shipment_reference')}
            </p>
            <p className={`text-sm font-medium ${
              theme === 'dark' ? 'text-gray-100' : 'text-gray-900'
            }`}>
              {shipmentId}
            </p>
          </div>

          {/* Information box */}
          <div className={`mb-6 p-4 rounded-lg ${
            theme === 'dark' ? 'bg-gray-700' : 'bg-gray-50'
          }`}>
            <div className="flex items-start">
              <div className="flex-shrink-0 mt-0.5">
                <AlertCircle size={16} className="text-red-500" />
              </div>
              <div className="ml-3">
                <p className={`text-sm ${
                  theme === 'dark' ? 'text-gray-300' : 'text-gray-700'
                }`}>
                  {t('claim_agent_notification')}
                </p>
              </div>
            </div>
          </div>

          {/* Claim type select */}
          <div className="mb-4">
            <label 
              htmlFor="claimType" 
              className={`block text-sm font-medium mb-1 ${
                theme === 'dark' ? 'text-gray-300' : 'text-gray-700'
              }`}
            >
              {t('claim_type')}
            </label>
            <select
              id="claimType"
              className={`shadow-sm block w-full focus:ring-red-500 focus:border-red-500 sm:text-sm border rounded-md p-2 ${
                theme === 'dark' 
                  ? 'bg-gray-700 border-gray-600 text-gray-100' 
                  : 'bg-white border-gray-300 text-gray-900'
              }`}
              value={claimType}
              onChange={(e) => setClaimType(e.target.value)}
            >
              <option value="">{t('select_claim_type')}</option>
              {claimTypes.map((type) => (
                <option key={type.value} value={type.value}>
                  {type.label}
                </option>
              ))}
            </select>
          </div>

          {/* Message input */}
          <div className="mb-4">
            <label 
              htmlFor="message" 
              className={`block text-sm font-medium mb-1 ${
                theme === 'dark' ? 'text-gray-300' : 'text-gray-700'
              }`}
            >
              {t('message')}
            </label>
            <textarea
              id="message"
              rows={4}
              className={`shadow-sm block w-full focus:ring-red-500 focus:border-red-500 sm:text-sm border rounded-md p-2 ${
                theme === 'dark' 
                  ? 'bg-gray-700 border-gray-600 text-gray-100 placeholder-gray-400' 
                  : 'bg-white border-gray-300 text-gray-900 placeholder-gray-500'
              }`}
              placeholder={t('write_your_claim_here')}
              value={message}
              onChange={(e) => setMessage(e.target.value)}
            />
          </div>

          {/* Send button */}
          <div className="flex justify-end">
            <button
              type="button"
              disabled={isSending || !message.trim() || !claimType}
              onClick={handleSend}
              className={`inline-flex justify-center items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white
                ${isSending || !message.trim() || !claimType ? 'bg-red-400 cursor-not-allowed' : 'bg-red-600 hover:bg-red-700'}
                focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 transition-colors`}
            >
              {isSending ? (
                <>
                  <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  {t('sending')}
                </>
              ) : (
                <>{t('submit_claim')}</>
              )}
            </button>
          </div>
        </div>

        {/* Success notification */}
        {showNotification && (
          <div className={`absolute bottom-4 right-4 border rounded-lg p-4 shadow-lg flex items-center space-x-2 animate-fade-in ${
            theme === 'dark' 
              ? 'bg-green-900 border-green-700 text-green-200' 
              : 'bg-green-50 border-green-200 text-green-800'
          }`}>
            <Check size={16} className="text-green-500" />
            <span className="text-sm">{t('claim_sent_successfully')}</span>
          </div>
        )}
      </div>
    </div>
  );
};

// Hook pour gérer la fonctionnalité de réclamation
export const useClaimSubmission = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const openClaimModal = () => {
    setIsModalOpen(true);
  };

  const closeClaimModal = () => {
    setIsModalOpen(false);
  };

  return {
    isModalOpen,
    openClaimModal,
    closeClaimModal,
    ClaimModal
  };
};

// Composant pour le bouton de réclamation
const ClaimButton = ({ shipmentId, variant = "primary" }) => {
  const { t } = useLanguage();
  const { theme } = useTheme();
  const { openClaimModal, closeClaimModal, isModalOpen, ClaimModal } = useClaimSubmission();

  return (
    <>
      {variant === "primary" ? (
        <button
          type="button"
          onClick={openClaimModal}
          className="w-full inline-flex justify-center items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 transition-colors"
        >
          <AlertCircle size={16} className="mr-2" />
          {t('file_claim')}
        </button>
      ) : (
        <button
          type="button"
          onClick={openClaimModal}
          className={`w-full inline-flex justify-center items-center px-4 py-2 border shadow-sm text-sm font-medium rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 transition-colors ${
            theme === 'dark'
              ? 'border-gray-600 text-gray-300 bg-gray-800 hover:bg-gray-700'
              : 'border-gray-300 text-gray-700 bg-white hover:bg-gray-50'
          }`}
        >
          <AlertCircle size={16} className="mr-2" />
          {t('file_claim')}
        </button>
      )}

      <ClaimModal
        isOpen={isModalOpen}
        onClose={closeClaimModal}
        shipmentId={shipmentId}
      />
    </>
  );
};

export default ClaimButton;