import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Ship, Loader2, ArrowLeft, Key, CheckCircle, AlertCircle } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';

const ResetPasswordPage = () => {
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const navigate = useNavigate();
  const { t } = useLanguage();

  // Password validation
  const [passwordStrength, setPasswordStrength] = useState({
    length: false,
    hasUppercase: false,
    hasLowercase: false,
    hasNumber: false,
    hasSpecial: false
  });

  const validatePassword = (password) => {
    setPasswordStrength({
      length: password.length >= 8,
      hasUppercase: /[A-Z]/.test(password),
      hasLowercase: /[a-z]/.test(password),
      hasNumber: /[0-9]/.test(password),
      hasSpecial: /[!@#$%^&*(),.?":{}|<>]/.test(password)
    });
  };

  const handlePasswordChange = (e) => {
    const newPassword = e.target.value;
    setPassword(newPassword);
    validatePassword(newPassword);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    // Check if passwords match
    if (password !== confirmPassword) {
      setError(t('passwordsDoNotMatch'));
      setIsLoading(false);
      return;
    }

    // Check if password meets all criteria
    const allCriteriaMet = Object.values(passwordStrength).every(criterion => criterion);
    if (!allCriteriaMet) {
      setError(t('passwordRequirementsNotMet'));
      setIsLoading(false);
      return;
    }

    try {
      // Simulate API call for password reset
      await new Promise(resolve => setTimeout(resolve, 1500));
      setSuccess(true);
    } catch (err) {
      setError(t('resetPasswordError'));
    } finally {
      setIsLoading(false);
    }
  };

  const handleBackToLogin = () => {
    navigate('/login');
  };

  // Get token from URL if available
  const getTokenFromUrl = () => {
    const urlParams = new URLSearchParams(window.location.search);
    return urlParams.get('token');
  };

  // Get strength level
  const getStrengthLevel = () => {
    const criteria = Object.values(passwordStrength);
    const metCriteria = criteria.filter(c => c).length;

    if (metCriteria === 5) return 'strong';
    if (metCriteria >= 3) return 'medium';
    if (metCriteria > 0) return 'weak';
    return 'none';
  };

  const strengthLevelClass = () => {
    const level = getStrengthLevel();
    switch (level) {
      case 'strong': return 'bg-green-500 dark:bg-green-600';
      case 'medium': return 'bg-yellow-500 dark:bg-yellow-600';
      case 'weak': return 'bg-red-500 dark:bg-red-600';
      default: return 'bg-gray-300 dark:bg-gray-700';
    }
  };

  const strengthWidth = () => {
    const level = getStrengthLevel();
    switch (level) {
      case 'strong': return 'w-full';
      case 'medium': return 'w-2/3';
      case 'weak': return 'w-1/3';
      default: return 'w-0';
    }
  };

  return (
    <div
      className="min-h-screen w-full flex items-center justify-center px-4 py-8 bg-cover bg-center bg-[linear-gradient(rgba(59,130,246,0.1),rgba(37,99,235,0.2))] dark:bg-[linear-gradient(rgba(15,23,42,0.8),rgba(15,23,42,0.9))]"
      style={{
        backgroundImage: 'url(https://www.basenton.com/wp-content/uploads/2023/11/image-23.png)',
        backgroundSize: 'cover',
        backgroundPosition: 'center'
      }}
    >
      <div className="absolute inset-0 bg-gradient-to-r from-blue-900/80 to-black/70" />

      <div className="relative max-w-md w-full bg-white/95 dark:bg-gray-800/95 backdrop-blur-sm rounded-2xl shadow-2xl overflow-hidden transition-colors duration-300">
        <div className="px-6 py-8 sm:p-10">
          {/* Back button */}
          <button
            onClick={handleBackToLogin}
            className="flex items-center text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 transition-colors mb-6"
          >
            <ArrowLeft size={16} className="mr-1" />
            <span className="text-sm font-medium">{t('backToLogin')}</span>
          </button>

          {/* Logo and title section */}
          <div className="flex flex-col items-center">
            <div className="p-3 rounded-full bg-blue-100 dark:bg-blue-900/50 shadow-md">
              <Key size={34} className="text-blue-600 dark:text-blue-400" />
            </div>
            <h2 className="mt-5 text-center text-3xl font-extrabold text-gray-900 dark:text-white">
              {t('createNewPassword')}
            </h2>
            <p className="mt-2 text-center text-sm text-gray-600 dark:text-gray-300">
              {t('createNewPasswordInstructions')}
            </p>
          </div>

          {/* Success message */}
          {success ? (
            <div className="mt-8">
              <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800/30 rounded-lg p-6">
                <div className="flex justify-center mb-4">
                  <CheckCircle size={48} className="text-green-500 dark:text-green-400" />
                </div>
                <h3 className="text-lg font-medium text-center text-green-800 dark:text-green-400">
                  {t('passwordResetSuccess')}
                </h3>
                <p className="mt-2 text-sm text-center text-green-700 dark:text-green-300">
                  {t('passwordResetSuccessDetails')}
                </p>
                <button
                  onClick={handleBackToLogin}
                  className="mt-6 w-full flex justify-center items-center py-3 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 dark:bg-blue-700 dark:hover:bg-blue-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-all"
                >
                  {t('proceedToLogin')}
                </button>
              </div>
            </div>
          ) : (
            <>
              {/* Token validation warning */}
              {!getTokenFromUrl() && (
                <div className="mt-4 flex items-center gap-2 bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800/30 text-yellow-700 dark:text-yellow-400 px-4 py-3 rounded-lg text-sm">
                  <AlertCircle size={18} />
                  <span>{t('invalidResetToken')}</span>
                </div>
              )}

              {/* Error message */}
              {error && (
                <div className="mt-4 flex items-center gap-2 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800/30 text-red-700 dark:text-red-400 px-4 py-3 rounded-lg text-sm">
                  <AlertCircle size={18} />
                  <span>{error}</span>
                </div>
              )}

              {/* Password reset form */}
              <form className="mt-6 space-y-5" onSubmit={handleSubmit}>
                {/* New Password field */}
                <div>
                  <label htmlFor="password" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                    {t('newPassword')}
                  </label>
                  <div className="mt-1">
                    <input
                      id="password"
                      name="password"
                      type="password"
                      autoComplete="new-password"
                      required
                      value={password}
                      onChange={handlePasswordChange}
                      className="appearance-none block w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg shadow-sm placeholder-gray-400 dark:placeholder-gray-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 sm:text-sm transition-all"
                      placeholder={t('newPasswordPlaceholder')}
                    />
                  </div>

                  {/* Password strength indicator */}
                  <div className="mt-2">
                    <div className="h-1 w-full bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                      <div
                        className={`h-full ${strengthLevelClass()} ${strengthWidth()} transition-all duration-300`}
                      ></div>
                    </div>
                    <div className="mt-2 space-y-1 text-xs text-gray-600 dark:text-gray-400">
                      <div className={`flex items-center ${passwordStrength.length ? 'text-green-600 dark:text-green-400' : ''}`}>
                        <span className="w-4 h-4 inline-flex items-center justify-center mr-1">
                          {passwordStrength.length ? '✓' : '·'}
                        </span>
                        {t('minLength')}
                      </div>
                      <div className={`flex items-center ${passwordStrength.hasUppercase ? 'text-green-600 dark:text-green-400' : ''}`}>
                        <span className="w-4 h-4 inline-flex items-center justify-center mr-1">
                          {passwordStrength.hasUppercase ? '✓' : '·'}
                        </span>
                        {t('upperCase')}
                      </div>
                      <div className={`flex items-center ${passwordStrength.hasLowercase ? 'text-green-600 dark:text-green-400' : ''}`}>
                        <span className="w-4 h-4 inline-flex items-center justify-center mr-1">
                          {passwordStrength.hasLowercase ? '✓' : '·'}
                        </span>
                        {t('lowerCase')}
                      </div>
                      <div className={`flex items-center ${passwordStrength.hasNumber ? 'text-green-600 dark:text-green-400' : ''}`}>
                        <span className="w-4 h-4 inline-flex items-center justify-center mr-1">
                          {passwordStrength.hasNumber ? '✓' : '·'}
                        </span>
                        {t('number')}
                      </div>
                      <div className={`flex items-center ${passwordStrength.hasSpecial ? 'text-green-600 dark:text-green-400' : ''}`}>
                        <span className="w-4 h-4 inline-flex items-center justify-center mr-1">
                          {passwordStrength.hasSpecial ? '✓' : '·'}
                        </span>
                        {t('specialChar')}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Confirm Password field */}
                <div>
                  <label htmlFor="confirm-password" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                    {t('confirmPassword')}
                  </label>
                  <div className="mt-1">
                    <input
                      id="confirm-password"
                      name="confirm-password"
                      type="password"
                      autoComplete="new-password"
                      required
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      className={`appearance-none block w-full px-4 py-3 border ${
                        confirmPassword && password !== confirmPassword
                          ? 'border-red-300 dark:border-red-600'
                          : 'border-gray-300 dark:border-gray-600'
                      } rounded-lg shadow-sm placeholder-gray-400 dark:placeholder-gray-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 sm:text-sm transition-all`}
                      placeholder={t('confirmPasswordPlaceholder')}
                    />
                    {confirmPassword && password !== confirmPassword && (
                      <p className="mt-1 text-xs text-red-600 dark:text-red-400">
                        {t('passwordsDoNotMatch')}
                      </p>
                    )}
                  </div>
                </div>

                {/* Submit button */}
                <div>
                  <button
                    type="submit"
                    disabled={isLoading || !getTokenFromUrl()}
                    className="w-full flex justify-center items-center py-3 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 dark:bg-blue-700 dark:hover:bg-blue-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-70 disabled:cursor-not-allowed transition-all"
                  >
                    {isLoading ? (
                      <>
                        <Loader2 size={18} className="animate-spin mr-2" />
                        <span>{t('resetting')}</span>
                      </>
                    ) : (
                      t('resetPassword')
                    )}
                  </button>
                </div>
              </form>
            </>
          )}

          {/* Footer */}
          <p className="mt-6 text-center text-xs text-gray-500 dark:text-gray-400">
            {t('allRightsReserved')}
          </p>
        </div>
      </div>
    </div>
  );
};

export default ResetPasswordPage;