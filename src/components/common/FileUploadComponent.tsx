import { useState, useRef } from 'react';
import { X, FileImage, FileVideo, FileText, FileSpreadsheet, File, Loader2, Upload } from 'lucide-react';
import { useLanguage } from '../../contexts/LanguageContext';

const FileUploadComponent = ({ onFileSelect, maxFileSize = 5 }) => {
  const { t, language } = useLanguage();
  const [files, setFiles] = useState([]);
  const [isDragging, setIsDragging] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState(null);
  const [uploadStatus, setUploadStatus] = useState({});
  const fileInputRef = useRef(null);

  // URL de l'API pour télécharger les fichiers
  const UPLOAD_API_URL = '/api/upload';

  // Textes multilingues
  const texts = {
    uploadFile: language === 'fr' ? 'Ajouter un fichier' : 'Upload file',
    dragFiles: language === 'fr' ? 'Glissez-déposez des fichiers ou cliquez pour parcourir' : 'Drag and drop files or click to browse',
    maxFileSize: language === 'fr' ? `Maximum ${maxFileSize}MB par fichier` : `Maximum ${maxFileSize}MB per file`,
    uploadingFile: language === 'fr' ? 'Chargement...' : 'Uploading...',
    fileSizeExceeded: language === 'fr'
      ? `La taille du fichier dépasse la limite de ${maxFileSize}MB`
      : `File size exceeds the ${maxFileSize}MB limit`,
    invalidFileType: language === 'fr'
      ? 'Type de fichier non pris en charge, seuls les images, vidéos, PDFs, fichiers Excel et Word sont acceptés'
      : 'Unsupported file type, only images, videos, PDFs, Excel and Word files are accepted',
    removeFile: language === 'fr' ? 'Supprimer' : 'Remove',
    selectedFiles: language === 'fr' ? 'Fichiers sélectionnés' : 'Selected files',
    uploadSuccess: language === 'fr' ? 'Téléchargement réussi' : 'Upload successful',
    uploadError: language === 'fr' ? 'Erreur de téléchargement' : 'Upload error',
    uploadInProgress: language === 'fr' ? 'Téléchargement en cours' : 'Upload in progress'
  };

  // Liste des types MIME acceptés
  const acceptedTypes = {
    'image/': 'image',
    'video/': 'video',
    'application/pdf': 'pdf',
    'application/vnd.ms-excel': 'excel',
    'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet': 'excel',
    'application/msword': 'word',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document': 'word'
  };

  const isAcceptedFileType = (file) => {
    return Object.keys(acceptedTypes).some(type => {
      if (type.endsWith('/')) {
        return file.type.startsWith(type);
      }
      return file.type === type;
    });
  };

  const handleFileInputChange = (e) => {
    const selectedFiles = Array.from(e.target.files);
    validateAndAddFiles(selectedFiles);
    // Reset input value to allow selecting the same file multiple times
    e.target.value = null;
  };

  const validateAndAddFiles = (selectedFiles) => {
    setError(null);

    const validFiles = selectedFiles.filter(file => {
      // Check file type
      if (!isAcceptedFileType(file)) {
        setError(texts.invalidFileType);
        return false;
      }

      // Check file size
      if (file.size > maxFileSize * 1024 * 1024) {
        setError(texts.fileSizeExceeded);
        return false;
      }

      return true;
    });

    if (validFiles.length > 0) {
      const newFiles = [...files, ...validFiles];
      setFiles(newFiles);
      onFileSelect && onFileSelect(newFiles);

      // Upload the new files to the server
      uploadFilesToServer(validFiles);
    }
  };

  // Nouvelle fonction pour télécharger les fichiers vers le serveur
  const uploadFilesToServer = async (filesToUpload) => {
    setIsUploading(true);

    try {
      for (const file of filesToUpload) {
        // Mettre à jour le statut en cours de téléchargement
        setUploadStatus(prev => ({
          ...prev,
          [file.name]: { status: 'uploading', message: texts.uploadInProgress }
        }));

        try {
          // Créer un formData pour envoyer le fichier
          const formData = new FormData();
          formData.append('file', file);

          // Envoyer le fichier à l'API
          const response = await fetch(UPLOAD_API_URL, {
            method: 'POST',
            body: formData,
          });

          if (!response.ok) {
            throw new Error(`Erreur HTTP: ${response.status}`);
          }

          const result = await response.json();

          // Mettre à jour le statut de téléchargement
          setUploadStatus(prev => ({
            ...prev,
            [file.name]: { status: 'success', message: texts.uploadSuccess, path: result.filePath }
          }));

          console.log(`Fichier ${file.name} téléchargé avec succès`);
        } catch (fileError) {
          console.error(`Erreur lors du téléchargement du fichier ${file.name}:`, fileError);

          setUploadStatus(prev => ({
            ...prev,
            [file.name]: { status: 'error', message: texts.uploadError }
          }));
        }
      }
    } catch (error) {
      console.error('Erreur lors du téléchargement des fichiers:', error);
      setError('Erreur lors du téléchargement des fichiers');
    } finally {
      setIsUploading(false);
    }
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);

    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      validateAndAddFiles(Array.from(e.dataTransfer.files));
    }
  };

  const handleOpenFileDialog = () => {
    fileInputRef.current?.click();
  };

  const removeFile = (index) => {
    const newFiles = [...files];
    newFiles.splice(index, 1);
    setFiles(newFiles);
    onFileSelect && onFileSelect(newFiles);
  };

  const getFileIcon = (file) => {
    if (file.type.startsWith('image/')) {
      return <FileImage size={16} className="text-blue-500" />;
    } else if (file.type.startsWith('video/')) {
      return <FileVideo size={16} className="text-purple-500" />;
    } else if (file.type === 'application/pdf') {
      return <FileText size={16} className="text-red-500" />;
    } else if (file.type === 'application/vnd.ms-excel' ||
              file.type === 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet') {
      return <FileSpreadsheet size={16} className="text-green-500" />;
    } else if (file.type === 'application/msword' ||
              file.type === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document') {
      return <FileText size={16} className="text-blue-700" />;
    }
    return <File size={16} className="text-gray-500" />;
  };

  const getFilePreview = (file, index) => {
    // Pour les images, afficher une miniature
    if (file.type.startsWith('image/')) {
      return (
        <div className="relative w-16 h-16 rounded overflow-hidden">
          <img
            src={URL.createObjectURL(file)}
            alt={file.name}
            className="w-full h-full object-cover"
          />
          <button
            onClick={() => removeFile(index)}
            className="absolute top-0 right-0 bg-red-500 text-white rounded-full p-0.5 transform translate-x-1/4 -translate-y-1/4"
          >
            <X size={12} />
          </button>
        </div>
      );
    }

    // Pour les autres types de fichiers, afficher une icône
    let icon = null;
    let bgColor = "bg-gray-100";

    if (file.type.startsWith('video/')) {
      icon = <FileVideo size={24} className="text-purple-500" />;
    } else if (file.type === 'application/pdf') {
      icon = <FileText size={24} className="text-red-500" />;
      bgColor = "bg-red-50";
    } else if (file.type === 'application/vnd.ms-excel' ||
              file.type === 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet') {
      icon = <FileSpreadsheet size={24} className="text-green-500" />;
      bgColor = "bg-green-50";
    } else if (file.type === 'application/msword' ||
              file.type === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document') {
      icon = <FileText size={24} className="text-blue-700" />;
      bgColor = "bg-blue-50";
    } else {
      icon = <File size={24} className="text-gray-500" />;
    }

    return (
      <div className={`relative w-16 h-16 rounded overflow-hidden ${bgColor} flex items-center justify-center`}>
        {icon}
        <button
          onClick={() => removeFile(index)}
          className="absolute top-0 right-0 bg-red-500 text-white rounded-full p-0.5 transform translate-x-1/4 -translate-y-1/4"
        >
          <X size={12} />
        </button>
      </div>
    );
  };

  const formatFileSize = (bytes) => {
    if (bytes < 1024) return bytes + ' B';
    else if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';
    else return (bytes / (1024 * 1024)).toFixed(1) + ' MB';
  };

  // Obtenir l'extension d'un fichier à partir du nom
  const getFileExtension = (filename) => {
    return filename.slice((filename.lastIndexOf(".") - 1 >>> 0) + 2).toLowerCase();
  };

  // Obtenir le type de fichier pour l'affichage
  const getFileTypeLabel = (file) => {
    const ext = getFileExtension(file.name);
    if (file.type.startsWith('image/')) return ext.toUpperCase();
    if (file.type.startsWith('video/')) return ext.toUpperCase();
    if (file.type === 'application/pdf') return 'PDF';
    if (file.type === 'application/vnd.ms-excel' ||
        file.type === 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet') return 'Excel';
    if (file.type === 'application/msword' ||
        file.type === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document') return 'Word';
    return ext.toUpperCase();
  };

  // Obtenir le statut d'upload pour un fichier
  const getUploadStatusIndicator = (file) => {
    const status = uploadStatus[file.name];

    if (!status) return null;

    if (status.status === 'uploading') {
      return (
        <div className="flex items-center mt-1">
          <Loader2 size={10} className="animate-spin mr-1 text-blue-500" />
          <span className="text-xs text-blue-500">{status.message}</span>
        </div>
      );
    } else if (status.status === 'success') {
      return <span className="text-xs text-green-500 mt-1">{status.message}</span>;
    } else if (status.status === 'error') {
      return <span className="text-xs text-red-500 mt-1">{status.message}</span>;
    }

    return null;
  };

  return (
    <div className="w-full">
      {/* Drag and drop area */}
      <div
        className={`mt-2 flex flex-col items-center justify-center rounded-lg border-2 border-dashed p-4 transition-colors ${
          isDragging ? 'border-blue-500 bg-blue-50' : 'border-gray-300 hover:border-blue-400'
        }`}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={handleOpenFileDialog}
        style={{ minHeight: '100px' }}
      >
        <Upload size={24} className="text-gray-500 mb-2" />
        <p className="text-sm text-center text-gray-500">
          {texts.dragFiles}
        </p>
        <p className="text-xs text-center text-gray-400 mt-1">
          {texts.maxFileSize}
        </p>
        {isUploading && (
          <div className="mt-2 flex items-center">
            <Loader2 size={16} className="animate-spin mr-2 text-blue-500" />
            <span className="text-sm text-blue-500">{texts.uploadingFile}</span>
          </div>
        )}
        <input
          ref={fileInputRef}
          type="file"
          multiple
          accept="image/*,video/*,application/pdf,.pdf,.xls,.xlsx,.doc,.docx,application/msword,application/vnd.ms-excel,application/vnd.openxmlformats-officedocument.spreadsheetml.sheet,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
          className="hidden"
          onChange={handleFileInputChange}
        />
      </div>

      {/* Error message */}
      {error && (
        <div className="mt-2 text-sm text-red-500">
          {error}
        </div>
      )}

      {/* File previews */}
      {files.length > 0 && (
        <div className="mt-3">
          <div className="text-sm font-medium text-gray-700">
            {texts.selectedFiles}
          </div>
          <div className="mt-2 grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-2">
            {files.map((file, index) => (
              <div key={index} className="relative">
                {getFilePreview(file, index)}
                <div className="mt-1 text-xs text-gray-500 truncate max-w-full" style={{ width: '64px' }}>
                  {file.name.length > 12 ? file.name.substring(0, 10) + '...' : file.name}
                </div>
                <div className="text-xs text-gray-400">
                  {formatFileSize(file.size)}
                </div>
                <div className="text-xs text-gray-500 bg-gray-100 rounded px-1 inline-block mt-1">
                  {getFileTypeLabel(file)}
                </div>
                {getUploadStatusIndicator(file)}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default FileUploadComponent;