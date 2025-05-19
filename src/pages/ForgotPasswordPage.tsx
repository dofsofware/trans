
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Ship, Loader2, ArrowLeft, CheckCircle } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';

const ForgotPasswordPage = () => {
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const navigate = useNavigate();
  const { t } = useLanguage();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      // Simulate API call for password reset
      await new Promise(resolve => setTimeout(resolve, 1500));
      setSuccess(true);
    } catch (err) {
      setError(t('resetEmailError'));
    } finally {
      setIsLoading(false);
    }
  };

  const handleBackToLogin = () => {
    navigate('/login');
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
              <Ship size={34} className="text-blue-600 dark:text-blue-400" />
            </div>
            <h2 className="mt-5 text-center text-3xl font-extrabold text-gray-900 dark:text-white">
              {t('resetPassword')}
            </h2>
            <p className="mt-2 text-center text-sm text-gray-600 dark:text-gray-300">
              {t('resetPasswordInstructions')}
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
                  {t('resetEmailSent')}
                </h3>
                <p className="mt-2 text-sm text-center text-green-700 dark:text-green-300">
                  {t('resetEmailSentDetails')}
                </p>
                <button
                  onClick={handleBackToLogin}
                  className="mt-6 w-full flex justify-center items-center py-3 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 dark:bg-blue-700 dark:hover:bg-blue-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-all"
                >
                  {t('backToLogin')}
                </button>
              </div>
            </div>
          ) : (
            <>
              {/* Error message */}
              {error && (
                <div className="mt-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800/30 text-red-700 dark:text-red-400 px-4 py-3 rounded-lg text-sm">
                  {error}
                </div>
              )}

              {/* Password reset form */}
              <form className="mt-6 space-y-5" onSubmit={handleSubmit}>
                {/* Email field */}
                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                    {t('email')}
                  </label>
                  <div className="mt-1">
                    <input
                      id="email"
                      name="email"
                      type="email"
                      autoComplete="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="appearance-none block w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg shadow-sm placeholder-gray-400 dark:placeholder-gray-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 sm:text-sm transition-all"
                      placeholder={t('emailPlaceholder')}
                    />
                  </div>
                </div>

                {/* Submit button */}
                <div>
                  <button
                    type="submit"
                    disabled={isLoading}
                    className="w-full flex justify-center items-center py-3 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 dark:bg-blue-700 dark:hover:bg-blue-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-70 disabled:cursor-not-allowed transition-all"
                  >
                    {isLoading ? (
                      <>
                        <Loader2 size={18} className="animate-spin mr-2" />
                        <span>{t('sending')}</span>
                      </>
                    ) : (
                      t('sendResetLink')
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

export default ForgotPasswordPage;