import { useState, useEffect } from 'react';
import { ShieldCheck, Eye, EyeOff, AlertCircle, CheckCircle, X, Info } from 'lucide-react';
import { useLanguage } from '../../contexts/LanguageContext';

// Composant Modal réutilisable avec animation améliorée
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

// Indicateur de force du mot de passe
const PasswordStrengthIndicator = ({ strength }) => {
  let width = '0%';
  let color = 'bg-gray-200';
  let label = 'Non défini';

  if (strength === 'weak') {
    width = '33%';
    color = 'bg-red-500';
    label = 'Faible';
  } else if (strength === 'medium') {
    width = '66%';
    color = 'bg-yellow-500';
    label = 'Moyen';
  } else if (strength === 'strong') {
    width = '100%';
    color = 'bg-green-500';
    label = 'Fort';
  }

  return (
    <div className="mt-1 mb-3">
      <div className="flex justify-between items-center mb-1">
        <span className="text-xs text-gray-600">Force du mot de passe:</span>
        <span className={`text-xs font-medium ${
          strength === 'weak' ? 'text-red-600' :
          strength === 'medium' ? 'text-yellow-600' :
          strength === 'strong' ? 'text-green-600' : 'text-gray-500'
        }`}>{label}</span>
      </div>
      <div className="w-full bg-gray-200 rounded-full h-2">
        <div
          className={`${color} h-2 rounded-full transition-all duration-300 ease-out`}
          style={{ width }}
        ></div>
      </div>
    </div>
  );
};

// Composant Input Password amélioré
const PasswordInput = ({
  id,
  label,
  value,
  onChange,
  showPassword,
  toggleVisibility,
  error,
  placeholder = "••••••••",
  className = ""
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
          type={showPassword ? "text" : "password"}
          value={value}
          onChange={onChange}
          className={`shadow-sm focus:ring-blue-500 focus:border-blue-500 block w-full sm:text-sm border ${error ? 'border-red-300' : 'border-gray-300'} rounded-md pr-10 py-2.5 ${className}`}
          placeholder={placeholder}
          aria-invalid={error ? "true" : "false"}
          autoComplete={id === "current-password" ? "current-password" : id === "new-password" ? "new-password" : "off"}
        />
        <button
          type="button"
          className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600 focus:outline-none"
          onClick={toggleVisibility}
          aria-label={showPassword ? "Masquer le mot de passe" : "Afficher le mot de passe"}
        >
          {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
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

// Composant PasswordChangeForm amélioré
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
  const [activeField, setActiveField] = useState(null);
  const [passwordStrength, setPasswordStrength] = useState('');

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

  // Évaluer la force du mot de passe lorsqu'il change
  useEffect(() => {
    if (newPassword === '') {
      setPasswordStrength('');
      return;
    }

    const metCount = requirements.filter(req => req.met).length;

    if (metCount <= 2) {
      setPasswordStrength('weak');
    } else if (metCount <= 4) {
      setPasswordStrength('medium');
    } else {
      setPasswordStrength('strong');
    }
  }, [newPassword]);

  // Gérer l'affichage et la disparition de la notification
  useEffect(() => {
    if (showNotification) {
      const timer = setTimeout(() => {
        setShowNotification(false);
        if (onClose) onClose();
      }, 2000);

      return () => clearTimeout(timer);
    }
  }, [showNotification, onClose]);

  const handleSubmit = () => {
    setError('');
    setSuccess(false);

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

    setIsSubmitting(true);

    // Simuler l'appel API
    setTimeout(() => {
      setSuccess(true);
      setIsSubmitting(false);
      setShowNotification(true);
    }, 1000);
  };

  return (
    <>
      <div className="p-5">
        <div className="mb-4 flex items-start bg-blue-50 border border-blue-100 rounded-md p-3 text-blue-800">
          <Info size={18} className="mr-2 mt-0.5 flex-shrink-0 text-blue-600" />
          <p className="text-sm">
            {t('password_change_instruction')}
          </p>
        </div>

        {/* Current Password */}
        <PasswordInput
          id="current-password"
          label={t('current_password')}
          value={currentPassword}
          onChange={(e) => setCurrentPassword(e.target.value)}
          showPassword={showCurrentPassword}
          toggleVisibility={() => setShowCurrentPassword(!showCurrentPassword)}
          className={activeField === 'current' ? 'border-blue-300 ring-1 ring-blue-500' : ''}
          onFocus={() => setActiveField('current')}
          onBlur={() => setActiveField(null)}
        />

        {/* New Password */}
        <PasswordInput
          id="new-password"
          label={t('new_password')}
          value={newPassword}
          onChange={(e) => setNewPassword(e.target.value)}
          showPassword={showNewPassword}
          toggleVisibility={() => setShowNewPassword(!showNewPassword)}
          className={activeField === 'new' ? 'border-blue-300 ring-1 ring-blue-500' : ''}
          onFocus={() => setActiveField('new')}
          onBlur={() => setActiveField(null)}
        />

        {/* Password Strength */}
        {newPassword.length > 0 && (
          <PasswordStrengthIndicator strength={passwordStrength} />
        )}

        {/* Password Requirements */}
        <div className={`mb-5 rounded-md p-3 transition-colors duration-300 border ${activeField === 'new' || (newPassword && !allRequirementsMet) ? 'bg-blue-50 border-blue-100' : 'bg-gray-50 border-gray-200'}`}>
          <h4 className="text-sm font-medium text-gray-700 mb-2 flex items-center">
            <ShieldCheck size={14} className="mr-1 text-blue-600" />
            {t('security_requirements')}
          </h4>
          <ul className="space-y-2">
            {requirements.map((req) => (
              <li key={req.id} className="flex items-center text-sm">
                {req.met ? (
                  <CheckCircle size={14} className="text-green-500 mr-2 flex-shrink-0" />
                ) : (
                  <AlertCircle size={14} className="text-gray-400 mr-2 flex-shrink-0" />
                )}
                <span className={`transition-colors duration-200 ${req.met ? "text-green-600" : "text-gray-500"}`}>
                  {req.label}
                </span>
              </li>
            ))}
          </ul>
        </div>

        {/* Confirm Password */}
        <PasswordInput
          id="confirm-password"
          label={t('confirm_password')}
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          showPassword={showConfirmPassword}
          toggleVisibility={() => setShowConfirmPassword(!showConfirmPassword)}
          error={confirmPassword && !passwordsMatch ? t('error_passwords_dont_match') : ''}
          className={activeField === 'confirm' ? 'border-blue-300 ring-1 ring-blue-500' : ''}
          onFocus={() => setActiveField('confirm')}
          onBlur={() => setActiveField(null)}
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
            {t('cancel')}
          </button>
          <button
            type="button"
            onClick={handleSubmit}
            className={`inline-flex justify-center items-center px-4 py-2.5 border border-transparent shadow-sm text-sm font-medium rounded-md text-white
              ${isSubmitting || (!currentPassword || !newPassword || !confirmPassword) ? 'bg-blue-400 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700'}
              focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors w-full sm:w-auto`}
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
              <>
                <ShieldCheck size={16} className="mr-2" />
                {t('save_changes')}
              </>
            )}
          </button>
        </div>
      </div>

      {/* Success notification - placé au niveau global pour meilleure visibilité */}
      {showNotification && (
        <div className="fixed inset-x-0 top-4 flex items-center justify-center z-50">
          <div className="bg-green-100 border-l-4 border-green-500 text-green-700 p-4 rounded shadow-lg flex items-center max-w-md animate-fadeIn">
            <CheckCircle size={18} className="text-green-500 mr-2 flex-shrink-0" />
            <span className="font-medium">{t('password_changed_successfully')}</span>
          </div>
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
        <h3 className="text-lg font-medium flex items-center" id="modal-headline">
          <ShieldCheck size={18} className="mr-2" />
          {t('change_password')}
        </h3>
        <button
          onClick={onClose}
          className="p-1 rounded-full hover:bg-blue-700 transition-colors focus:outline-none focus:ring-2 focus:ring-white"
          aria-label="Fermer"
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
          className="w-full inline-flex justify-center items-center px-4 py-2.5 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
        >
          <ShieldCheck size={16} className="mr-2" />
          {t('change_password')}
        </button>
      ) : (
        <button
          type="button"
          onClick={openPasswordModal}
          className="inline-flex items-center text-sm text-blue-600 hover:text-blue-800 transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
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