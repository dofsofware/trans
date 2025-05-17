import { Loader2 } from 'lucide-react';
import { useLanguage } from '../../contexts/LanguageContext';


const LoadingScreen = () => {
    const { t } = useLanguage();
  return (
   <div className="flex justify-center items-center h-64">
                   <div className="items-center">
                       <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-blue-600"></div>
                       <p className="mt-4 text-blue-500 font-medium">{t('loading')}</p>
                   </div>
                 </div>
  );
};


export default LoadingScreen;