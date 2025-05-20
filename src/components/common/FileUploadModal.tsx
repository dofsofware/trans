import { useState, useEffect } from 'react';
import { X, Upload, Check } from 'lucide-react';
import { useLanguage } from '../../contexts/LanguageContext';
import FileUploadComponent from './FileUploadComponent';

const FileUploadModal = ({ isOpen, onClose, onFileUpload }) => {
  const { t, language } = useLanguage();
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

  return (
    <div
      className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4 animate-fadeIn"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-xl shadow-lg max-w-md w-full max-h-[90vh] overflow-y-auto custom-scrollbar"
        onClick={handleModalContentClick}
      >
        <div className="flex justify-between items-center p-4 border-b border-gray-200">
          <h3 className="text-lg font-medium text-gray-900">
            {language === 'fr' ? 'Télécharger des fichiers' : 'Upload Files'}
          </h3>
          <button
            className="text-gray-400 hover:text-gray-500 transition-colors"
            onClick={onClose}
          >
            <X size={20} />
          </button>
        </div>

        <div>
          <div className="p-4">
            <div className="mb-4">
              <p className="text-sm text-gray-600 mb-2">
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
              <div className="flex items-center p-2 mb-4 bg-green-50 text-green-700 rounded-md">
                <Check size={16} className="mr-2" />
                <span className="text-sm">
                  {language === 'fr' ? 'Fichiers téléchargés avec succès!' : 'Files uploaded successfully!'}
                </span>
              </div>
            )}
          </div>

          <div className="flex justify-end gap-3 p-4 bg-gray-50 border-t border-gray-200 rounded-b-xl">
            <button
              type="button"
              className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500"
              onClick={onClose}
            >
              {language === 'fr' ? 'Annuler' : 'Cancel'}
            </button>
            <button
              type="button"
              className={`px-4 py-2 text-sm font-medium text-white rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500
                ${selectedFiles.length === 0
                  ? 'bg-blue-400 cursor-not-allowed'
                  : 'bg-blue-600 hover:bg-blue-700'}`}
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
          background: #f1f1f1;
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: #d1d5db;
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: #9ca3af;
        }
      `}</style>
    </div>
  );
};

export default FileUploadModal;