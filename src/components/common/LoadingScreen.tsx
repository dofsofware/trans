import { Plane, Ship, Package } from 'lucide-react';
import { useLanguage } from '../../contexts/LanguageContext';

const LoadingScreen = ({ 
  variant = 'default', 
  message = null,
  showProgress = false,
  progress = 0
}) => {
  const { t } = useLanguage();
  const renderDefaultLoader = () => (
    <div className="flex flex-col items-center space-y-4">
      {/* Animation simple et épurée */}
      <div className="relative w-16 h-16">
        <div className="absolute inset-0 border-2 border-blue-200 rounded-full"></div>
        <div className="absolute inset-0 border-2 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
        <Package className="absolute inset-0 w-6 h-6 text-blue-600 m-auto" />
      </div>
      
      <p className="text-blue-600 font-medium">{t('loading')}</p>
    </div>
  );

  const renderMinimalLoader = () => (
    <div className="flex items-center space-x-3">
      <div className="w-5 h-5 border-2 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
      <span className="text-blue-600">{t('loading')}</span>
    </div>
  );

  const renderDotsLoader = () => (
    <div className="flex flex-col items-center space-y-3">
      <div className="flex space-x-1">
        <div className="w-2 h-2 bg-blue-600 rounded-full animate-bounce"></div>
        <div className="w-2 h-2 bg-blue-600 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
        <div className="w-2 h-2 bg-blue-600 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
      </div>
      <p className="text-blue-600 text-sm">{t('loading')}</p>
    </div>
  );

  const renderIconLoader = () => (
    <div className="flex flex-col items-center space-y-3">
      <div className="flex space-x-4">
        <Plane className="w-6 h-6 text-blue-600 animate-pulse" />
        <Ship className="w-6 h-6 text-blue-700 animate-pulse" style={{ animationDelay: '0.5s' }} />
      </div>
      <p className="text-blue-600 font-medium">{t('loading')}</p>
    </div>
  );

  return (
    <div className="flex justify-center items-center h-64">
      <div className="flex flex-col items-center">
        {variant === 'minimal' && renderMinimalLoader()}
        {variant === 'dots' && renderDotsLoader()}
        {variant === 'icons' && renderIconLoader()}
        {variant === 'default' && renderDefaultLoader()}
      </div>
    </div>
  );
};

export default LoadingScreen;