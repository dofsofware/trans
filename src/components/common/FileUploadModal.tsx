import { useState, useEffect } from 'react';
import { X, Upload, Check } from 'lucide-react';
import { useLanguage } from '../../contexts/LanguageContext';
import { useTheme } from '../../contexts/ThemeContext';
import FileUploadComponent from './FileUploadComponent';

const FileUploadModal = ({ isOpen, onClose, onFileUpload }) => {
  const { t, language } = useLanguage();
  const { theme } = useTheme();
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadSuccess, setUploadSuccess] = useState(false);

  useEffect(() => {
    if (isOpen) {
      // Reset state when modal opens
      setSelectedFiles([]);
      setUploadSuccess(false);
    }
  }, [isOpen]);

  // Empêcher la propagation du clic à l'intérieur du modal
  const handleModalContentClick = (e) => {
    e.stopPropagation();
  };

  // Gérer la soumission
  const handleSubmit = () => {
    if (selectedFiles.length === 0) return;

    setIsUploading(true);

    // Simuler un chargement
    setTimeout(() => {
      setIsUploading(false);
      setUploadSuccess(true);

      // Passer les fichiers au composant parent
      onFileUpload && onFileUpload(selectedFiles);

      // Fermer le modal après un court délai
      setTimeout(() => {
        onClose();
      }, 1000);
    }, 1500);
  };

  // Gestion des fichiers sélectionnés
  const handleFileSelect = (files) => {
    setSelectedFiles(files);
  };

  if (!isOpen) return null;

  // Classes dynamiques basées sur le thème
  const overlayClasses = theme === 'dark' 
    ? 'fixed inset-0 bg-black bg-opacity-70 z-50 flex items-center justify-center p-4 animate-fadeIn'
    : 'fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4 animate-fadeIn';

  const modalClasses = theme === 'dark'
    ? 'bg-gray-800 rounded-xl shadow-lg max-w-md w-full max-h-[90vh] overflow-y-auto custom-scrollbar'
    : 'bg-white rounded-xl shadow-lg max-w-md w-full max-h-[90vh] overflow-y-auto custom-scrollbar';

  const headerClasses = theme === 'dark'
    ? 'flex justify-between items-center p-4 border-b border-gray-600'
    : 'flex justify-between items-center p-4 border-b border-gray-200';

  const titleClasses = theme === 'dark'
    ? 'text-lg font-medium text-gray-100'
    : 'text-lg font-medium text-gray-900';

  const closeButtonClasses = theme === 'dark'
    ? 'text-gray-400 hover:text-gray-300 transition-colors'
    : 'text-gray-400 hover:text-gray-500 transition-colors';

  const textClasses = theme === 'dark'
    ? 'text-sm text-gray-300 mb-2'
    : 'text-sm text-gray-600 mb-2';

  const successClasses = theme === 'dark'
    ? 'flex items-center p-2 mb-4 bg-green-900 text-green-300 rounded-md'
    : 'flex items-center p-2 mb-4 bg-green-50 text-green-700 rounded-md';

  const footerClasses = theme === 'dark'
    ? 'flex justify-end gap-3 p-4 bg-gray-700 border-t border-gray-600 rounded-b-xl'
    : 'flex justify-end gap-3 p-4 bg-gray-50 border-t border-gray-200 rounded-b-xl';

  const cancelButtonClasses = theme === 'dark'
    ? 'px-4 py-2 text-sm font-medium text-gray-300 bg-gray-600 border border-gray-500 rounded-md shadow-sm hover:bg-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-400'
    : 'px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500';

  const uploadButtonClasses = selectedFiles.length === 0
    ? (theme === 'dark'
        ? 'px-4 py-2 text-sm font-medium text-white rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-400 bg-blue-500 cursor-not-allowed'
        : 'px-4 py-2 text-sm font-medium text-white rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-blue-400 cursor-not-allowed')
    : (theme === 'dark'
        ? 'px-4 py-2 text-sm font-medium text-white rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-400 bg-blue-600 hover:bg-blue-500'
        : 'px-4 py-2 text-sm font-medium text-white rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-blue-600 hover:bg-blue-700');

  return (
    <div
      className={overlayClasses}
      onClick={onClose}
    >
      <div
        className={modalClasses}
        onClick={handleModalContentClick}
      >
        <div className={headerClasses}>
          <h3 className={titleClasses}>
            {language === 'fr' ? 'Télécharger des fichiers' : 'Upload Files'}
          </h3>
          <button
            className={closeButtonClasses}
            onClick={onClose}
          >
            <X size={20} />
          </button>
        </div>

        <div>
          <div className="p-4">
            <div className="mb-4">
              <p className={textClasses}>
                {language === 'fr'
                  ? 'Ajoutez des images ou vidéos à votre message (max 5MB par fichier)'
                  : 'Add images or videos to your message (max 5MB per file)'}
              </p>

              <FileUploadComponent
                onFileSelect={handleFileSelect}
                maxFileSize={5} // 5MB
              />
            </div>

            {uploadSuccess && (
              <div className={successClasses}>
                <Check size={16} className="mr-2" />
                <span className="text-sm">
                  {language === 'fr' ? 'Fichiers téléchargés avec succès!' : 'Files uploaded successfully!'}
                </span>
              </div>
            )}
          </div>

          <div className={footerClasses}>
            <button
              type="button"
              className={cancelButtonClasses}
              onClick={onClose}
            >
              {language === 'fr' ? 'Annuler' : 'Cancel'}
            </button>
            <button
              type="button"
              className={uploadButtonClasses}
              disabled={selectedFiles.length === 0 || isUploading}
              onClick={handleSubmit}
            >
              {isUploading ? (
                <span className="flex items-center">
                  <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  {language === 'fr' ? 'Chargement...' : 'Uploading...'}
                </span>
              ) : (
                <span className="flex items-center">
                  <Upload size={16} className="mr-2" />
                  {language === 'fr' ? 'Télécharger' : 'Upload'}
                </span>
              )}
            </button>
          </div>
        </div>
      </div>

      <style jsx>{`
        .animate-fadeIn {
          animation: fadeIn 0.2s ease-out forwards;
        }

        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }

        .custom-scrollbar::-webkit-scrollbar {
          width: 8px;
          height: 8px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: ${theme === 'dark' ? '#374151' : '#f1f1f1'};
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: ${theme === 'dark' ? '#6b7280' : '#d1d5db'};
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: ${theme === 'dark' ? '#9ca3af' : '#9ca3af'};
        }
      `}</style>
    </div>
  );
};

export default FileUploadModal;