import { useState, useEffect, useRef } from 'react';
import { X, Send, Paperclip, MessageSquare, Info, AlertCircle } from 'lucide-react';
import { useLanguage } from '../../contexts/LanguageContext';

// Mock shipments data
const mockShipments = [
  {
    id: 'SHIP-1000',
    description: 'Container from Shanghai to Rotterdam',
    agent: {
      id: '2',
      name: 'Sophie Martin',
      avatar: null,
      status: 'online'
    }
  },
  {
    id: 'SHIP-1002',
    description: 'Air freight from New York to Paris',
    agent: {
      id: '3',
      name: 'Thomas Dubois',
      avatar: null,
      status: 'offline'
    }
  },
  {
    id: 'SHIP-1005',
    description: 'Express delivery from London to Berlin',
    agent: {
      id: '4',
      name: 'Cheikh Tidiane',
      avatar: null,
      status: 'offline'
    }
  },
  {
    id: 'SHIP-1010',
    description: 'Sea freight from Los Angeles to Tokyo',
    agent: {
      id: '5',
      name: 'Maria Garcia',
      avatar: null,
      status: 'online'
    }
  },
  {
    id: 'SHIP-1015',
    description: 'Rail transport from Madrid to Lisbon',
    agent: {
      id: '6',
      name: 'Hans Mueller',
      avatar: null,
      status: 'away'
    }
  }
];

// Function to get initials from name
const getInitials = (name) => {
  return name
    .split(' ')
    .map(part => part.charAt(0))
    .join('')
    .toUpperCase();
};

// Status indicator component
const StatusIndicator = ({ status }) => {
  const statusColors = {
    online: 'bg-green-500',
    away: 'bg-yellow-500',
    offline: 'bg-gray-400'
  };

  return (
    <span className={`absolute bottom-0 right-0 block h-2.5 w-2.5 rounded-full ring-2 ring-white ${statusColors[status]}`}></span>
  );
};

// Modal composant réutilisable avec animation améliorée
const Modal = ({ isOpen, onClose, title, children }) => {
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'auto';
    }
    return () => {
      document.body.style.overflow = 'auto';
    };
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div
        className="fixed inset-0 bg-black bg-opacity-50 transition-opacity duration-300"
        onClick={onClose}
        aria-hidden="true"
      ></div>

      <div className="flex min-h-full items-center justify-center p-4 text-center sm:p-0">
        <div
          className="relative transform overflow-hidden rounded-lg bg-white shadow-xl transition-all duration-300 ease-out sm:my-8 sm:w-full sm:max-w-lg w-full max-w-md"
          role="dialog"
          aria-modal="true"
          aria-labelledby="modal-headline"
        >
          {children}
        </div>
      </div>
    </div>
  );
};

// Input component for consistency
const FormInput = ({
  id,
  label,
  value,
  onChange,
  error,
  placeholder = "",
  className = "",
  inputType = "text",
}) => {
  return (
    <div className="mb-4">
      <label
        htmlFor={id}
        className="block text-sm font-medium text-gray-700 mb-1"
      >
        {label}
      </label>
      <div className="relative">
        <input
          id={id}
          name={id}
          type={inputType}
          value={value}
          onChange={onChange}
          className={`shadow-sm focus:ring-blue-500 focus:border-blue-500 block w-full sm:text-sm border ${error ? 'border-red-300' : 'border-gray-300'} rounded-md py-2.5 ${className}`}
          placeholder={placeholder}
          aria-invalid={error ? "true" : "false"}
        />
      </div>
      {error && (
        <p className="mt-1 text-sm text-red-600" id={`${id}-error`}>
          {error}
        </p>
      )}
    </div>
  );
};

// Select Input component for consistency
const FormSelect = ({
  id,
  label,
  value,
  onChange,
  error,
  options = [],
  placeholder = "",
  className = "",
}) => {
  return (
    <div className="mb-4">
      <label
        htmlFor={id}
        className="block text-sm font-medium text-gray-700 mb-1"
      >
        {label}
      </label>
      <div className="relative">
        <select
          id={id}
          name={id}
          value={value}
          onChange={onChange}
          className={`shadow-sm focus:ring-blue-500 focus:border-blue-500 block w-full sm:text-sm border ${error ? 'border-red-300' : 'border-gray-300'} rounded-md py-2.5 ${className}`}
          aria-invalid={error ? "true" : "false"}
        >
          <option value="">{placeholder}</option>
          {options.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      </div>
      {error && (
        <p className="mt-1 text-sm text-red-600" id={`${id}-error`}>
          {error}
        </p>
      )}
    </div>
  );
};

// Textarea component for consistency
const FormTextarea = ({
  id,
  label,
  value,
  onChange,
  error,
  placeholder = "",
  className = "",
  inputRef,
}) => {
  return (
    <div className="mb-4">
      <label
        htmlFor={id}
        className="block text-sm font-medium text-gray-700 mb-1"
      >
        {label}
      </label>
      <div className="relative">
        <textarea
          id={id}
          name={id}
          value={value}
          onChange={onChange}
          ref={inputRef}
          className={`shadow-sm focus:ring-blue-500 focus:border-blue-500 block w-full sm:text-sm border ${error ? 'border-red-300' : 'border-gray-300'} rounded-md py-2.5 resize-none pr-10 ${className}`}
          placeholder={placeholder}
          aria-invalid={error ? "true" : "false"}
        ></textarea>
        <button
          type="button"
          className="absolute right-3 bottom-3 text-gray-400 hover:text-gray-600 focus:outline-none"
          title="Attach file"
        >
          <Paperclip size={18} />
        </button>
      </div>
      {error && (
        <p className="mt-1 text-sm text-red-600" id={`${id}-error`}>
          {error}
        </p>
      )}
    </div>
  );
};

// New Message Form Component
const NewMessageForm = ({ onClose, onSendMessage }) => {
  const { t } = useLanguage();
  const [selectedShipment, setSelectedShipment] = useState('');
  const [messageText, setMessageText] = useState('');
  const [textareaHeight, setTextareaHeight] = useState(80);
  const [subject, setSubject] = useState('');
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const textareaRef = useRef(null);

  const selectedShipmentData = mockShipments.find(shipment => shipment.id === selectedShipment);

  const shipmentOptions = mockShipments.map(shipment => ({
    value: shipment.id,
    label: `${shipment.id} - ${shipment.description}`
  }));

  const handleTextareaResize = () => {
    if (!textareaRef.current) return;

    textareaRef.current.style.height = 'auto';
    const newHeight = Math.min(textareaRef.current.scrollHeight, 120);
    textareaRef.current.style.height = `${newHeight}px`;
    setTextareaHeight(newHeight);
  };

  useEffect(() => {
    if (textareaRef.current) {
      handleTextareaResize();
    }
  }, [messageText]);

  const handleSendMessage = () => {
    setError('');

    if (!selectedShipment) {
      setError(t('error_select_shipment') || 'Please select a shipment');
      return;
    }

    if (!messageText.trim()) {
      setError(t('error_message_required') || 'Message is required');
      return;
    }

    setIsSubmitting(true);

    // Simulate API call
    setTimeout(() => {
      const newThread = {
        id: `thread-${Date.now()}`,
        shipmentId: selectedShipment,
        subject: subject || `${t('inquiry_about') || 'Inquiry about'} ${selectedShipment}`,
        participants: ['1', selectedShipmentData.agent.id],
        lastMessage: messageText,
        lastMessageTime: new Date().toISOString(),
        unreadCount: 0,
        agent: selectedShipmentData.agent
      };

      const newMessage = {
        id: `msg-${Date.now()}`,
        threadId: newThread.id,
        senderId: '1', // Current user ID
        content: messageText,
        timestamp: new Date().toISOString(),
        read: true
      };

      onSendMessage(newThread, newMessage);
      setIsSubmitting(false);
      onClose();
    }, 1000);
  };

  return (
    <>
      <div className="p-5">
        <div className="mb-4 flex items-start bg-blue-50 border border-blue-100 rounded-md p-3 text-blue-800">
          <Info size={18} className="mr-2 mt-0.5 flex-shrink-0 text-blue-600" />
          <p className="text-sm">
            {t('new_message_instruction') || 'Select a shipment and write your message. Your inquiry will be sent to the assigned agent.'}
          </p>
        </div>

        {/* Shipment Selection */}
        <FormSelect
          id="shipment-select"
          label={t('select_shipment') || 'Select Shipment'}
          value={selectedShipment}
          onChange={(e) => setSelectedShipment(e.target.value)}
          options={shipmentOptions}
          placeholder={t('select_a_shipment') || '-- Select a shipment --'}
        />

        {/* Agent Info (shown only when shipment is selected) */}
        {selectedShipmentData && (
          <div className="mb-4 bg-gray-50 border border-gray-200 rounded-md p-3">
            <h4 className="text-sm font-medium text-gray-700 mb-2 flex items-center">
              {t('assigned_agent') || 'Assigned Agent'}
            </h4>
            <div className="flex items-center">
              <div className="flex-shrink-0 relative mr-3">
                {selectedShipmentData.agent.avatar ? (
                  <img
                    src={selectedShipmentData.agent.avatar}
                    alt={selectedShipmentData.agent.name}
                    className="h-10 w-10 rounded-full"
                  />
                ) : (
                  <div className="h-10 w-10 rounded-full bg-blue-600 flex items-center justify-center text-white font-medium">
                    {getInitials(selectedShipmentData.agent.name)}
                  </div>
                )}
                <StatusIndicator status={selectedShipmentData.agent.status} />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-900">
                  {selectedShipmentData.agent.name}
                </p>
                <p className="text-xs text-gray-500 flex items-center">
                  <span className={`inline-block h-2 w-2 rounded-full mr-1 ${
                    selectedShipmentData.agent.status === 'online' ? 'bg-green-500' :
                    selectedShipmentData.agent.status === 'away' ? 'bg-yellow-500' : 'bg-gray-400'
                  }`}></span>
                  {selectedShipmentData.agent.status === 'online' ? t('online') || 'Online' :
                   selectedShipmentData.agent.status === 'away' ? t('away') || 'Away' : t('offline') || 'Offline'}
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Message Input */}
        <FormTextarea
          id="message"
          label={t('message') || 'Message'}
          value={messageText}
          onChange={(e) => setMessageText(e.target.value)}
          placeholder={t('write_your_message') || 'Write your message...'}
          inputRef={textareaRef}
          className="min-h-20"
        />

        {/* Error Message */}
        {error && (
          <div className="mb-4 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-md flex items-start animate-fadeIn">
            <AlertCircle size={16} className="mr-2 mt-0.5 flex-shrink-0" />
            <span className="text-sm">{error}</span>
          </div>
        )}

        {/* Form Actions */}
        <div className="flex flex-col-reverse sm:flex-row sm:justify-end space-y-reverse space-y-3 sm:space-y-0 sm:space-x-3 mt-6">
          <button
            type="button"
            className="py-2.5 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors w-full sm:w-auto"
            disabled={isSubmitting}
            onClick={onClose}
          >
            {t('cancel') || 'Cancel'}
          </button>
          <button
            type="button"
            onClick={handleSendMessage}
            className={`inline-flex justify-center items-center px-4 py-2.5 border border-transparent shadow-sm text-sm font-medium rounded-md text-white
              ${isSubmitting || !selectedShipment || !messageText.trim() ? 'bg-blue-400 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700'}
              focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors w-full sm:w-auto`}
            disabled={isSubmitting || !selectedShipment || !messageText.trim()}
          >
            {isSubmitting ? (
              <>
                <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                {t('sending') || 'Sending...'}
              </>
            ) : (
              <>
                <Send size={16} className="mr-2" />
                {t('send_message') || 'Send Message'}
              </>
            )}
          </button>
        </div>
      </div>
    </>
  );
};

// Composant NewMessageModal redesigné
const NewMessageModal = ({ isOpen, onClose, onSendMessage }) => {
  const { t } = useLanguage();

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      {/* Header */}
      <div className="px-4 py-3 bg-blue-600 text-white flex justify-between items-center">
        <h3 className="text-lg font-medium flex items-center" id="modal-headline">
          <MessageSquare size={18} className="mr-2" />
          {t('new_message') || 'New Message'}
        </h3>
        <button
          onClick={onClose}
          className="p-1 rounded-full hover:bg-blue-700 transition-colors focus:outline-none focus:ring-2 focus:ring-white"
          aria-label="Close"
        >
          <X size={20} />
        </button>
      </div>

      <NewMessageForm onClose={onClose} onSendMessage={onSendMessage} />
    </Modal>
  );
};

// Hook pour gérer la fonctionnalité de nouveau message
export const useNewMessage = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const openNewMessageModal = () => {
    setIsModalOpen(true);
  };

  const closeNewMessageModal = () => {
    setIsModalOpen(false);
  };

  return {
    isModalOpen,
    openNewMessageModal,
    closeNewMessageModal,
    NewMessageModal
  };
};

// Exemple d'implémentation du bouton
const NewMessageButton = ({ variant = "primary" }) => {
  const { t } = useLanguage();
  const { openNewMessageModal, closeNewMessageModal, isModalOpen, NewMessageModal } = useNewMessage();

  const handleSendMessage = (newThread, newMessage) => {
    console.log('New thread created:', newThread);
    console.log('Message sent:', newMessage);
    // Ici vous implémenteriez la logique pour envoyer réellement le message
  };

  return (
    <>
      {variant === "primary" ? (
        <button
          type="button"
          onClick={openNewMessageModal}
          className="w-full inline-flex justify-center items-center px-4 py-2.5 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
        >
          <MessageSquare size={16} className="mr-2" />
          {t('new_message') || 'New Message'}
        </button>
      ) : (
        <button
          type="button"
          onClick={openNewMessageModal}
          className="inline-flex items-center text-sm text-blue-600 hover:text-blue-800 transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
        >
          <MessageSquare size={16} className="mr-1" />
          {t('new_message') || 'New Message'}
        </button>
      )}

      <NewMessageModal
        isOpen={isModalOpen}
        onClose={closeNewMessageModal}
        onSendMessage={handleSendMessage}
      />
    </>
  );
};

export { NewMessageModal, NewMessageButton };