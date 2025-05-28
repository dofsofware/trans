import { useState, useEffect, useRef } from 'react';
import { X, Send, Paperclip, MessageSquare, Info, AlertCircle, FileText, Download } from 'lucide-react';
import { useLanguage } from '../../contexts/LanguageContext';
import { useTheme } from '../../contexts/ThemeContext';
import FileUploadModal from '../../components/common/FileUploadModal';

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
  const { theme } = useTheme();

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
          className={`relative transform overflow-hidden rounded-lg shadow-xl transition-all duration-300 ease-out sm:my-8 sm:w-full sm:max-w-lg w-full max-w-md ${
            theme === 'dark' ? 'bg-gray-800' : 'bg-white'
          }`}
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
  const { theme } = useTheme();

  return (
    <div className="mb-4">
      <label
        htmlFor={id}
        className={`block text-sm font-medium mb-1 ${
          theme === 'dark' ? 'text-gray-200' : 'text-gray-700'
        }`}
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
          className={`shadow-sm focus:ring-blue-500 focus:border-blue-500 block w-full sm:text-sm border rounded-md py-2.5 ${
            error ? 'border-red-300' : theme === 'dark' ? 'border-gray-600' : 'border-gray-300'
          } ${
            theme === 'dark' ? 'bg-gray-700 text-white placeholder-gray-400' : 'bg-white text-gray-900 placeholder-gray-500'
          } ${className}`}
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
  const { theme } = useTheme();

  return (
    <div className="mb-4">
      <label
        htmlFor={id}
        className={`block text-sm font-medium mb-1 ${
          theme === 'dark' ? 'text-gray-200' : 'text-gray-700'
        }`}
      >
        {label}
      </label>
      <div className="relative">
        <select
          id={id}
          name={id}
          value={value}
          onChange={onChange}
          className={`shadow-sm focus:ring-blue-500 focus:border-blue-500 block w-full sm:text-sm border rounded-md py-2.5 ${
            error ? 'border-red-300' : theme === 'dark' ? 'border-gray-600' : 'border-gray-300'
          } ${
            theme === 'dark' ? 'bg-gray-700 text-white' : 'bg-white text-gray-900'
          } ${className}`}
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
  onAttachFiles = null,
}) => {
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);
  const { t } = useLanguage();
  const { theme } = useTheme();

  const openUploadModal = () => {
    setIsUploadModalOpen(true);
  };

  const closeUploadModal = () => {
    setIsUploadModalOpen(false);
  };

  const handleFileUpload = (files) => {
    if (onAttachFiles) {
      onAttachFiles(files);
    }
    closeUploadModal();
  };

  return (
    <div className="mb-4">
      <label
        htmlFor={id}
        className={`block text-sm font-medium mb-1 ${
          theme === 'dark' ? 'text-gray-200' : 'text-gray-700'
        }`}
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
          className={`shadow-sm focus:ring-blue-500 focus:border-blue-500 block w-full sm:text-sm border rounded-md py-2.5 resize-none pr-10 ${
            error ? 'border-red-300' : theme === 'dark' ? 'border-gray-600' : 'border-gray-300'
          } ${
            theme === 'dark' ? 'bg-gray-700 text-white placeholder-gray-400' : 'bg-white text-gray-900 placeholder-gray-500'
          } ${className}`}
          placeholder={placeholder}
          aria-invalid={error ? "true" : "false"}
        ></textarea>
        <button
          type="button"
          className={`absolute right-3 bottom-3 hover:text-gray-600 focus:outline-none ${
            theme === 'dark' ? 'text-gray-400 hover:text-gray-300' : 'text-gray-400 hover:text-gray-600'
          }`}
          title={t('attach_file') || "Attach file"}
          onClick={openUploadModal}
        >
          <Paperclip size={18} />
        </button>
      </div>
      {error && (
        <p className="mt-1 text-sm text-red-600" id={`${id}-error`}>
          {error}
        </p>
      )}

      {/* Modal d'upload intégré directement dans le composant */}
      <FileUploadModal
        isOpen={isUploadModalOpen}
        onClose={closeUploadModal}
        onFileUpload={handleFileUpload}
      />
    </div>
  );
};

// New Message Form Component avec gestion des pièces jointes
const NewMessageForm = ({ onClose, onSendMessage }) => {
  const { t } = useLanguage();
  const { theme } = useTheme();
  const [selectedShipment, setSelectedShipment] = useState('');
  const [messageText, setMessageText] = useState('');
  const [textareaHeight, setTextareaHeight] = useState(80);
  const [subject, setSubject] = useState('');
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const textareaRef = useRef(null);
  const [attachedFiles, setAttachedFiles] = useState([]); // État pour stocker les fichiers attachés

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

  // Gérer l'ajout de fichiers
  const handleAttachFiles = (files) => {
    setAttachedFiles(files);
  };

  // Gérer la suppression d'un fichier attaché
  const removeAttachedFile = (indexToRemove) => {
    setAttachedFiles(
      attachedFiles.filter((_, index) => index !== indexToRemove)
    );
  };

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
        read: true,
        attachments: attachedFiles.map(file => ({
          id: `file-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
          name: file.name,
          size: file.size,
          type: file.type,
          url: URL.createObjectURL(file) // Ceci est juste pour simuler - dans une vraie app, vous téléchargeriez le fichier sur un serveur
        }))
      };

      onSendMessage(newThread, newMessage);
      setIsSubmitting(false);
      onClose();
    }, 1000);
  };

  const MessageAttachment = ({ attachment }) => {
    const { t } = useLanguage();
    const { theme } = useTheme();

    // Déterminer le type d'icône en fonction du type de fichier
    const getAttachmentIcon = (fileType) => {
      if (fileType.startsWith('image/')) {
        return null; // Pas besoin d'icône pour les images car on affiche l'aperçu
      } else if (fileType.startsWith('application/pdf')) {
        return <FileText size={14} className="text-red-500" />;
      } else if (fileType.startsWith('application/msword') ||
                fileType.startsWith('application/vnd.openxmlformats-officedocument.wordprocessingml.document')) {
        return <FileText size={14} className="text-blue-500" />;
      } else if (fileType.startsWith('application/vnd.ms-excel') ||
                fileType.startsWith('application/vnd.openxmlformats-officedocument.spreadsheetml.sheet')) {
        return <FileText size={14} className="text-green-500" />;
      } else {
        return <Paperclip size={14} className="text-blue-500" />;
      }
    };

    // Formater la taille du fichier
    const formatFileSize = (bytes) => {
      if (bytes < 1024) return bytes + ' B';
      else if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';
      else return (bytes / (1024 * 1024)).toFixed(1) + ' MB';
    };

    return (
      <div className="mt-2 mb-2">
        <a
          href={attachment.url}
          target="_blank"
          rel="noopener noreferrer"
          className={`block border rounded-md p-2 transition-colors ${
            theme === 'dark' 
              ? 'bg-gray-700 border-gray-600 hover:bg-gray-600' 
              : 'bg-gray-50 border-gray-200 hover:bg-gray-100'
          }`}
        >
          <div className="flex items-center">
            {attachment.type.startsWith('image/') ? (
              <div className="w-10 h-10 mr-2 rounded overflow-hidden">
                <img
                  src={attachment.url}
                  alt={attachment.name}
                  className="w-full h-full object-cover"
                />
              </div>
            ) : (
              <div className="w-10 h-10 mr-2 bg-blue-100 rounded flex items-center justify-center">
                {getAttachmentIcon(attachment.type)}
              </div>
            )}
            <div className="flex-1 overflow-hidden">
              <p className={`text-sm font-medium truncate ${
                theme === 'dark' ? 'text-gray-200' : 'text-gray-700'
              }`}>{attachment.name}</p>
              <p className={`text-xs ${
                theme === 'dark' ? 'text-gray-400' : 'text-gray-500'
              }`}>{formatFileSize(attachment.size)}</p>
            </div>
            <div className="ml-2">
              <Download size={16} className={`${
                theme === 'dark' ? 'text-gray-400' : 'text-gray-500'
              }`} />
            </div>
          </div>
        </a>
      </div>
    );
  };

  const MessageItem = ({ message, isCurrentUser }) => {
    const { theme } = useTheme();
    
    return (
      <div className={`mb-4 flex ${isCurrentUser ? 'justify-end' : 'justify-start'}`}>
        <div className={`max-w-3/4 p-3 rounded-lg ${
          isCurrentUser 
            ? theme === 'dark' 
              ? 'bg-blue-700 text-blue-100' 
              : 'bg-blue-100 text-blue-900'
            : theme === 'dark'
              ? 'bg-gray-700 text-gray-100'
              : 'bg-gray-100 text-gray-900'
        }`}>
          <p className="text-sm">{message.content}</p>

          {/* Afficher les pièces jointes si présentes */}
          {message.attachments && message.attachments.length > 0 && (
            <div className={`mt-2 border-t pt-2 ${
              theme === 'dark' ? 'border-gray-600' : 'border-gray-200'
            }`}>
              {message.attachments.map((attachment) => (
                <MessageAttachment key={attachment.id} attachment={attachment} />
              ))}
            </div>
          )}

          <p className={`text-xs mt-1 ${
            theme === 'dark' ? 'text-gray-400' : 'text-gray-500'
          }`}>
            {new Date(message.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
          </p>
        </div>
      </div>
    );
  };

  // Formater la taille du fichier
  const formatFileSize = (bytes) => {
    if (bytes < 1024) return bytes + ' B';
    else if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';
    else return (bytes / (1024 * 1024)).toFixed(1) + ' MB';
  };

  return (
    <>
      <div className="p-5">
        <div className={`mb-4 flex items-start border rounded-md p-3 ${
          theme === 'dark' 
            ? 'bg-blue-900 border-blue-800 text-blue-200' 
            : 'bg-blue-50 border-blue-100 text-blue-800'
        }`}>
          <Info size={18} className={`mr-2 mt-0.5 flex-shrink-0 ${
            theme === 'dark' ? 'text-blue-300' : 'text-blue-600'
          }`} />
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
          <div className={`mb-4 border rounded-md p-3 ${
            theme === 'dark' 
              ? 'bg-gray-700 border-gray-600' 
              : 'bg-gray-50 border-gray-200'
          }`}>
            <h4 className={`text-sm font-medium mb-2 flex items-center ${
              theme === 'dark' ? 'text-gray-200' : 'text-gray-700'
            }`}>
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
                <p className={`text-sm font-medium ${
                  theme === 'dark' ? 'text-gray-100' : 'text-gray-900'
                }`}>
                  {selectedShipmentData.agent.name}
                </p>
                <p className={`text-xs flex items-center ${
                  theme === 'dark' ? 'text-gray-400' : 'text-gray-500'
                }`}>
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

        {/* Message Input avec attachement de fichiers */}
        <FormTextarea
          id="message"
          label={t('message') || 'Message'}
          value={messageText}
          onChange={(e) => setMessageText(e.target.value)}
          placeholder={t('write_your_message') || 'Write your message...'}
          inputRef={textareaRef}
          className="min-h-20"
          onAttachFiles={handleAttachFiles}
        />

        {/* Affichage des fichiers attachés */}
        {attachedFiles.length > 0 && (
          <div className="mt-2 mb-4">
            <p className={`text-sm font-medium mb-2 ${
              theme === 'dark' ? 'text-gray-200' : 'text-gray-700'
            }`}>
              {t('attached_files') || 'Attached Files'} ({attachedFiles.length})
            </p>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2">
              {attachedFiles.map((file, index) => (
                <div key={index} className={`border rounded-md p-2 relative ${
                  theme === 'dark' 
                    ? 'bg-gray-700 border-gray-600' 
                    : 'bg-gray-50 border-gray-200'
                }`}>
                  <button
                    className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center"
                    onClick={() => removeAttachedFile(index)}
                  >
                    <X size={12} />
                  </button>
                  <div className="flex items-center">
                    {file.type.startsWith('image/') ? (
                      <div className="w-8 h-8 mr-2 rounded overflow-hidden">
                        <img
                          src={URL.createObjectURL(file)}
                          alt={file.name}
                          className="w-full h-full object-cover"
                        />
                      </div>
                    ) : (
                      <div className="w-8 h-8 mr-2 bg-blue-100 rounded flex items-center justify-center">
                        <Paperclip size={14} className="text-blue-500" />
                      </div>
                    )}
                    <div className="flex-1 overflow-hidden">
                      <p className={`text-xs font-medium truncate ${
                        theme === 'dark' ? 'text-gray-200' : 'text-gray-700'
                      }`}>{file.name}</p>
                      <p className={`text-xs ${
                        theme === 'dark' ? 'text-gray-400' : 'text-gray-500'
                      }`}>{formatFileSize(file.size)}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Error Message */}
        {error && (
          <div className={`mb-4 border px-4 py-3 rounded-md flex items-start animate-fadeIn ${
            theme === 'dark' 
              ? 'bg-red-900 border-red-700 text-red-200' 
              : 'bg-red-50 border-red-200 text-red-700'
          }`}>
            <AlertCircle size={16} className="mr-2 mt-0.5 flex-shrink-0" />
            <span className="text-sm">{error}</span>
          </div>
        )}

        {/* Form Actions */}
        <div className="flex flex-col-reverse sm:flex-row sm:justify-end space-y-reverse space-y-3 sm:space-y-0 sm:space-x-3 mt-6">
          <button
            type="button"
            className={`py-2.5 px-4 border rounded-md shadow-sm text-sm font-medium focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors w-full sm:w-auto ${
              theme === 'dark'
                ? 'border-gray-600 text-gray-200 bg-gray-700 hover:bg-gray-600'
                : 'border-gray-300 text-gray-700 bg-white hover:bg-gray-50'
            }`}
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
                {attachedFiles.length > 0 && (
                  <span className="ml-1">({attachedFiles.length})</span>
                )}
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
  const { theme } = useTheme();

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      {/* Header */}
      <div className={`px-4 py-3 text-white flex justify-between items-center ${
        theme === 'dark' ? 'bg-blue-700' : 'bg-blue-600'
      }`}>
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