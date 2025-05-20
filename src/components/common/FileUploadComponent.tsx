import { useState, useRef } from 'react';
import { X, FileImage, FileVideo, File, Loader2, Upload } from 'lucide-react';
import { useLanguage } from '../../contexts/LanguageContext';

const FileUploadComponent = ({ onFileSelect, maxFileSize = 5 }) => {
  const { t, language } = useLanguage();
  const [files, setFiles] = useState([]);
  const [isDragging, setIsDragging] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState(null);
  const fileInputRef = useRef(null);

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
      ? 'Type de fichier non pris en charge, seuls les images et vidéos sont acceptés'
      : 'Unsupported file type, only images and videos are accepted',
    removeFile: language === 'fr' ? 'Supprimer' : 'Remove'
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
      if (!file.type.startsWith('image/') && !file.type.startsWith('video/')) {
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
      setFiles(prevFiles => [...prevFiles, ...validFiles]);
      onFileSelect && onFileSelect([...files, ...validFiles]);
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
    }
    return <File size={16} className="text-gray-500" />;
  };

  const getFilePreview = (file, index) => {
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
    } else if (file.type.startsWith('video/')) {
      return (
        <div className="relative w-16 h-16 rounded overflow-hidden bg-gray-100 flex items-center justify-center">
          <FileVideo size={24} className="text-purple-500" />
          <button
            onClick={() => removeFile(index)}
            className="absolute top-0 right-0 bg-red-500 text-white rounded-full p-0.5 transform translate-x-1/4 -translate-y-1/4"
          >
            <X size={12} />
          </button>
        </div>
      );
    }
    return null;
  };

  const formatFileSize = (bytes) => {
    if (bytes < 1024) return bytes + ' B';
    else if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';
    else return (bytes / (1024 * 1024)).toFixed(1) + ' MB';
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
          accept="image/*,video/*"
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
            {language === 'fr' ? 'Fichiers sélectionnés' : 'Selected files'}
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
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default FileUploadComponent;