import { useState } from 'react';
import { MessageSquare, X, Check } from 'lucide-react';
import { useLanguage } from '../../contexts/LanguageContext';

// Mock data for agent in charge
const getMockAgentById = (id) => {
  const agents = {
    "agent1": {
      id: "agent1",
      name: "Moussa Diagne",
      email: "moussa.d@logistics.com",
      phone: "+221 77 111 22 33",
      photo: "https://as2.ftcdn.net/jpg/03/49/49/79/1000_F_349497933_Ly4im8BDmHLaLzgyKg2f2yZOvJjBtlw5.jpg",
      department: "Sea Freight",
      position: "Senior Logistics Coordinator",
      languages: ["English", "French", "Wolof"],
      location: "Dakar, Senegal",
      availability: "08:00 - 17:00 GMT"
    },
    "agent2": {
      id: "agent2",
      name: "Sophie Lefebvre",
      email: "sophie.l@logistics.com",
      phone: "+33 6 22 33 44 55",
      photo: "https://as2.ftcdn.net/jpg/03/49/49/79/1000_F_349497933_Ly4im8BDmHLaLzgyKg2f2yZOvJjBtlw5.jpg",
      department: "Air Freight",
      position: "Logistics Specialist",
      languages: ["English", "French"],
      location: "Paris, France",
      availability: "09:00 - 18:00 CET"
    }
  };

  // Return a specific agent or default to Moussa Diagne
  return agents[id] || agents.agent1;
};

// Component for the contact agent modal
const ContactAgentModal = ({ isOpen, onClose, shipmentId, agent }) => {
  const { t } = useLanguage();
  const [message, setMessage] = useState('');
  const [isSending, setIsSending] = useState(false);
  const [showNotification, setShowNotification] = useState(false);

  if (!isOpen) return null;

  const handleSend = () => {
    if (!message.trim()) return;

    setIsSending(true);

    // Simulate sending message
    setTimeout(() => {
      setIsSending(false);
      setMessage('');
      setShowNotification(true);

      // Auto hide notification after 3 seconds
      setTimeout(() => {
        setShowNotification(false);
        onClose();
      }, 3000);
    }, 1000);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-md overflow-hidden">
        {/* Header */}
        <div className="px-4 py-3 bg-blue-600 text-white flex justify-between items-center">
          <h3 className="text-lg font-medium flex items-center">
            <MessageSquare size={18} className="mr-2" />
            {t('contact_the_agent_in_charge')}
          </h3>
          <button
            onClick={onClose}
            className="p-1 rounded-full hover:bg-blue-700 transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        {/* Content */}
        <div className="p-4">
          {/* Shipment reference */}
          <div className="mb-4">
            <p className="text-xs font-medium text-gray-500">{t('shipment_reference')}</p>
            <p className="text-sm font-medium text-gray-900">{shipmentId}</p>
          </div>

          {/* Agent info */}
          <div className="mb-6 p-4 bg-gray-50 rounded-lg">
            <div className="flex items-start space-x-3">
              <div className="flex-shrink-0">
                <img
                  src={agent.photo}
                  alt={agent.name}
                  className="h-10 w-10 rounded-full"
                />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-900">{agent.name}</p>
                <p className="text-xs text-gray-500">{agent.position}</p>
                <p className="text-xs text-gray-500">{agent.email}</p>
                <p className="text-xs text-gray-500">{agent.phone}</p>
                <div className="mt-1 flex items-center text-xs text-gray-500">
                  <span className="inline-block w-2 h-2 bg-green-500 rounded-full mr-1"></span>
                  {t('available')} {agent.availability}
                </div>
              </div>
            </div>
          </div>

          {/* Message input */}
          <div className="mb-4">
            <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-1">
              {t('message')}
            </label>
            <textarea
              id="message"
              rows={4}
              className="shadow-sm block w-full focus:ring-blue-500 focus:border-blue-500 sm:text-sm border border-gray-300 rounded-md p-2"
              placeholder={t('write_your_message_here')}
              value={message}
              onChange={(e) => setMessage(e.target.value)}
            />
          </div>

          {/* Send button */}
          <div className="flex justify-end">
            <button
              type="button"
              disabled={isSending || !message.trim()}
              onClick={handleSend}
              className={`inline-flex justify-center items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white
                ${isSending || !message.trim() ? 'bg-blue-400 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700'}
                focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors`}
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
                <>{t('send_message')}</>
              )}
            </button>
          </div>
        </div>

        {/* Success notification */}
        {showNotification && (
          <div className="absolute bottom-4 right-4 bg-green-50 border border-green-200 text-green-800 rounded-lg p-4 shadow-lg flex items-center space-x-2 animate-fade-in">
            <Check size={16} className="text-green-500" />
            <span className="text-sm">{t('message_sent_successfully')}</span>
          </div>
        )}
      </div>
    </div>
  );
};

// Hook to manage contact agent functionality
export const useContactAgent = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedAgent, setSelectedAgent] = useState(null);
  
  const openContactModal = (agentId) => {
    const agent = getMockAgentById(agentId);
    setSelectedAgent(agent);
    setIsModalOpen(true);
  };
  
  const closeContactModal = () => {
    setIsModalOpen(false);
    // Reset after animation completes
    setTimeout(() => setSelectedAgent(null), 300);
  };
  
  return {
    isModalOpen,
    selectedAgent,
    openContactModal,
    closeContactModal,
    ContactAgentModal
  };
};

// Example implementation in a component
const ContactAgentButton = ({ shipmentId, agentId = "agent1", variant = "primary" }) => {
  const { t } = useLanguage();
  const { openContactModal, closeContactModal, isModalOpen, selectedAgent, ContactAgentModal } = useContactAgent();
  
  return (
    <>
      {variant === "primary" ? (
        <button
          type="button"
          onClick={() => openContactModal(agentId)}
          className="w-full inline-flex justify-center items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
        >
          <MessageSquare size={16} className="mr-2" />
          {t('contact_the_agent_in_charge')}
        </button>
      ) : (
        <button
          type="button"
          onClick={() => openContactModal(agentId)}
          className="inline-flex items-center text-sm text-blue-600 hover:text-blue-800 transition-colors"
        >
          <MessageSquare size={16} className="mr-1" />
          {t('contact_agent')}
        </button>
      )}
      
      <ContactAgentModal 
        isOpen={isModalOpen} 
        onClose={closeContactModal} 
        shipmentId={shipmentId}
        agent={selectedAgent || {}}
      />
    </>
  );
};

export default ContactAgentButton;