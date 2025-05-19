import { useState, useEffect } from 'react';
import { ShieldCheck, Eye, EyeOff, AlertCircle, CheckCircle, X } from 'lucide-react';
import { useLanguage } from '../../contexts/LanguageContext';

// Composant Modal réutilisable
const Modal = ({ isOpen, onClose, title, children }) => {
  useEffect(() => {
    // Verrouiller le scroll du body quand la modal est ouverte
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'auto';
    }

    // Nettoyer lors du démontage
    return () => {
      document.body.style.overflow = 'auto';
    };
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      {/* Arrière-plan semi-transparent */}
      <div
        className="fixed inset-0 bg-black bg-opacity-50 transition-opacity"
        onClick={onClose}
      ></div>

      {/* Contenu de la modal */}
      <div className="flex min-h-full items-center justify-center p-4">
        <div className="relative transform overflow-hidden rounded-lg bg-white shadow-xl transition-all w-full max-w-md">
          {/* Corps de la modal */}
          <div>
            {children}
          </div>
        </div>
      </div>
    </div>
  );
};

// Composant PasswordChangeForm modifié pour fonctionner avec la modal
const PasswordChangeForm = ({ onClose }) => {
  const { t } = useLanguage();
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showNotification, setShowNotification] = useState(false);

  // Password strength requirements
  const requirements = [
    { id: 'length', label: t('password_req_length'), met: newPassword.length >= 8 },
    { id: 'uppercase', label: t('password_req_uppercase'), met: /[A-Z]/.test(newPassword) },
    { id: 'lowercase', label: t('password_req_lowercase'), met: /[a-z]/.test(newPassword) },
    { id: 'number', label: t('password_req_number'), met: /[0-9]/.test(newPassword) },
    { id: 'special', label: t('password_req_special'), met: /[^A-Za-z0-9]/.test(newPassword) },
  ];

  const allRequirementsMet = requirements.every(req => req.met);
  const passwordsMatch = newPassword === confirmPassword;

  const handleSubmit = () => {
    // Reset states
    setError('');
    setSuccess(false);

    // Validation
    if (!currentPassword) {
      setError(t('error_current_password_required'));
      return;
    }

    if (!allRequirementsMet) {
      setError(t('error_password_requirements'));
      return;
    }

    if (!passwordsMatch) {
      setError(t('error_passwords_dont_match'));
      return;
    }

    // Simulate form submission
    setIsSubmitting(true);

    // Simulate API call with timeout
    setTimeout(() => {
      setSuccess(true);
      setIsSubmitting(false);
      setShowNotification(true);

      // Fermer la modal après une modification réussie
      setTimeout(() => {
        if (onClose) onClose();

        // Reset form
        setCurrentPassword('');
        setNewPassword('');
        setConfirmPassword('');
        setShowNotification(false);
      }, 3000);
    }, 1000);
  };

  return (
    <>
      {/* Current Password */}
      <div className="p-4">
        <p className="mb-4 text-sm text-gray-600">
          {t('password_change_instruction')}
        </p>

        <div className="mb-4">
          <label htmlFor="current-password" className="block text-sm font-medium text-gray-700 mb-1">
            {t('current_password')}
          </label>
          <div className="relative">
            <input
              id="current-password"
              name="current-password"
              type={showCurrentPassword ? "text" : "password"}
              value={currentPassword}
              onChange={(e) => setCurrentPassword(e.target.value)}
              className="shadow-sm focus:ring-blue-500 focus:border-blue-500 block w-full sm:text-sm border border-gray-300 rounded-md pr-10 py-2"
              placeholder="••••••••"
            />
            <button
              type="button"
              className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600"
              onClick={() => setShowCurrentPassword(!showCurrentPassword)}
            >
              {showCurrentPassword ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
          </div>
        </div>

        {/* New Password */}
        <div className="mb-4">
          <label htmlFor="new-password" className="block text-sm font-medium text-gray-700 mb-1">
            {t('new_password')}
          </label>
          <div className="relative">
            <input
              id="new-password"
              name="new-password"
              type={showNewPassword ? "text" : "password"}
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              className="shadow-sm focus:ring-blue-500 focus:border-blue-500 block w-full sm:text-sm border border-gray-300 rounded-md pr-10 py-2"
              placeholder="••••••••"
            />
            <button
              type="button"
              className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600"
              onClick={() => setShowNewPassword(!showNewPassword)}
            >
              {showNewPassword ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
          </div>
        </div>

        {/* Password Requirements */}
        <div className="mb-4 bg-gray-50 rounded-md p-3 border border-gray-200">
          <h4 className="text-sm font-medium text-gray-700 mb-2">{t('security_requirements')}</h4>
          <ul className="space-y-1">
            {requirements.map((req) => (
              <li key={req.id} className="flex items-center text-sm">
                {req.met ? (
                  <CheckCircle size={14} className="text-green-500 mr-2 flex-shrink-0" />
                ) : (
                  <AlertCircle size={14} className="text-gray-400 mr-2 flex-shrink-0" />
                )}
                <span className={req.met ? "text-green-600" : "text-gray-500"}>
                  {req.label}
                </span>
              </li>
            ))}
          </ul>
        </div>

        {/* Confirm Password */}
        <div className="mb-4">
          <label htmlFor="confirm-password" className="block text-sm font-medium text-gray-700 mb-1">
            {t('confirm_password')}
          </label>
          <div className="relative">
            <input
              id="confirm-password"
              name="confirm-password"
              type={showConfirmPassword ? "text" : "password"}
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className={`shadow-sm focus:ring-blue-500 focus:border-blue-500 block w-full sm:text-sm border-gray-300 rounded-md pr-10 py-2 ${
                confirmPassword && !passwordsMatch ? "border-red-300" : ""
              }`}
              placeholder="••••••••"
            />
            <button
              type="button"
              className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600"
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
            >
              {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
          </div>
          {confirmPassword && !passwordsMatch && (
            <p className="mt-1 text-sm text-red-600">{t('error_passwords_dont_match')}</p>
          )}
        </div>

        {/* Error Message */}
        {error && (
          <div className="mb-4 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-md flex items-start">
            <AlertCircle size={16} className="mr-2 mt-0.5 flex-shrink-0" />
            <span className="text-sm">{error}</span>
          </div>
        )}

        {/* Form Actions */}
        <div className="flex justify-end space-x-3 mt-6">
          <button
            type="button"
            className="py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
            disabled={isSubmitting}
            onClick={onClose}
          >
            {t('cancel')}
          </button>
          <button
            type="button"
            onClick={handleSubmit}
            className={`inline-flex justify-center items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white
              ${isSubmitting || (!currentPassword || !newPassword || !confirmPassword) ? 'bg-blue-400 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700'}
              focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors`}
            disabled={isSubmitting || !currentPassword || !newPassword || !confirmPassword}
          >
            {isSubmitting ? (
              <>
                <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                {t('saving')}
              </>
            ) : (
              t('save_changes')
            )}
          </button>
        </div>
      </div>

      {/* Success notification */}
      {showNotification && (
        <div className="absolute bottom-4 right-4 bg-green-50 border border-green-200 text-green-800 rounded-lg p-4 shadow-lg flex items-center space-x-2 animate-fade-in">
          <CheckCircle size={16} className="text-green-500" />
          <span className="text-sm">{t('password_changed_successfully')}</span>
        </div>
      )}
    </>
  );
};

// Composant combiné PasswordChangeModal qui utilise les deux composants ci-dessus
const PasswordChangeModal = ({ isOpen, onClose }) => {
  const { t } = useLanguage();

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      {/* Header */}
      <div className="px-4 py-3 bg-blue-600 text-white flex justify-between items-center">
        <h3 className="text-lg font-medium flex items-center">
          <ShieldCheck size={18} className="mr-2" />
          {t('change_password')}
        </h3>
        <button
          onClick={onClose}
          className="p-1 rounded-full hover:bg-blue-700 transition-colors"
        >
          <X size={20} />
        </button>
      </div>

      <PasswordChangeForm onClose={onClose} />
    </Modal>
  );
};

// Hook pour gérer la fonctionnalité de changement de mot de passe
export const usePasswordChange = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const openPasswordModal = () => {
    setIsModalOpen(true);
  };

  const closePasswordModal = () => {
    setIsModalOpen(false);
  };

  return {
    isModalOpen,
    openPasswordModal,
    closePasswordModal,
    PasswordChangeModal
  };
};

// Exemple d'implémentation du bouton
const PasswordChangeButton = ({ variant = "primary" }) => {
  const { t } = useLanguage();
  const { openPasswordModal, closePasswordModal, isModalOpen, PasswordChangeModal } = usePasswordChange();

  return (
    <>
      {variant === "primary" ? (
        <button
          type="button"
          onClick={openPasswordModal}
          className="w-full inline-flex justify-center items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
        >
          <ShieldCheck size={16} className="mr-2" />
          {t('change_password')}
        </button>
      ) : (
        <button
          type="button"
          onClick={openPasswordModal}
          className="inline-flex items-center text-sm text-blue-600 hover:text-blue-800 transition-colors"
        >
          <ShieldCheck size={16} className="mr-1" />
          {t('change_password')}
        </button>
      )}

      <PasswordChangeModal
        isOpen={isModalOpen}
        onClose={closePasswordModal}
      />
    </>
  );
};

export { PasswordChangeModal, PasswordChangeButton };