import { useState, useRef, useEffect } from 'react';
import { Camera, X, Check, Move, Upload } from 'lucide-react';
import { useTheme } from '../../contexts/ThemeContext';
import { useLanguage } from '../../contexts/LanguageContext';

const AvatarUploader = ({ currentAvatar, onSave }) => {
  const { theme } = useTheme();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [scale, setScale] = useState(1);
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });

  const fileInputRef = useRef(null);
  const imageRef = useRef(null);
  const containerRef = useRef(null);

  // Reset state when modal closes
  useEffect(() => {
    if (!isModalOpen) {
      setTimeout(() => {
        setSelectedFile(null);
        setPreviewUrl(null);
        setPosition({ x: 0, y: 0 });
        setScale(1);
      }, 300);
    }
  }, [isModalOpen]);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file && file.type.match('image.*')) {
      setSelectedFile(file);
      const reader = new FileReader();
      reader.onload = () => {
        setPreviewUrl(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const openFileSelector = () => {
    fileInputRef.current.click();
  };

  const handleMouseDown = (e) => {
    if (previewUrl) {
      setIsDragging(true);
      setDragStart({
        x: e.clientX - position.x,
        y: e.clientY - position.y
      });
    }
  };

  const handleMouseMove = (e) => {
    if (isDragging && containerRef.current) {
      const containerRect = containerRef.current.getBoundingClientRect();
      const containerSize = containerRect.width;
      const imageSize = containerSize * scale;
      const maxOffset = (imageSize - containerSize) / 2;

      let newX = e.clientX - dragStart.x;
      let newY = e.clientY - dragStart.y;

      // Constrain the position to keep the image within the viewport
      newX = Math.max(-maxOffset, Math.min(newX, maxOffset));
      newY = Math.max(-maxOffset, Math.min(newY, maxOffset));

      setPosition({ x: newX, y: newY });
    }
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  const { t } = useLanguage();

  const handleTouchStart = (e) => {
    if (previewUrl) {
      setIsDragging(true);
      setDragStart({
        x: e.touches[0].clientX - position.x,
        y: e.touches[0].clientY - position.y
      });
    }
  };

  const handleTouchMove = (e) => {
    if (isDragging && containerRef.current) {
      const containerRect = containerRef.current.getBoundingClientRect();
      const containerSize = containerRect.width;
      const imageSize = containerSize * scale;
      const maxOffset = (imageSize - containerSize) / 2;

      let newX = e.touches[0].clientX - dragStart.x;
      let newY = e.touches[0].clientY - dragStart.y;

      // Constrain the position
      newX = Math.max(-maxOffset, Math.min(newX, maxOffset));
      newY = Math.max(-maxOffset, Math.min(newY, maxOffset));

      setPosition({ x: newX, y: newY });
    }
  };

  const handleTouchEnd = () => {
    setIsDragging(false);
  };

  const handleSave = () => {
    // In a real implementation, we would crop the image server-side or use canvas
    // Here we'll simulate this by passing the image data and position/scale info
    onSave({
      file: selectedFile,
      position,
      scale,
      preview: previewUrl
    });
    setIsModalOpen(false);
  };

  useEffect(() => {
    if (isDragging) {
      window.addEventListener('mousemove', handleMouseMove);
      window.addEventListener('mouseup', handleMouseUp);
      window.addEventListener('touchmove', handleTouchMove);
      window.addEventListener('touchend', handleTouchEnd);
    }

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
      window.removeEventListener('touchmove', handleTouchMove);
      window.removeEventListener('touchend', handleTouchEnd);
    };
  }, [isDragging]);

  return (
    <>
      <button
        type="button"
        onClick={() => setIsModalOpen(true)}
        className={`inline-flex items-center px-3 py-2 border shadow-sm text-sm font-medium rounded-md transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 ${theme === 'dark'
            ? 'border-gray-600 text-gray-300 bg-gray-800 hover:bg-gray-700 focus:ring-offset-gray-900'
            : 'border-gray-300 text-gray-700 bg-white hover:bg-gray-50'
          }`}
      >
        <Camera size={16} className="mr-2" />
        {t('update_avatar')}
      </button>

      {/* Hidden file input */}
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileChange}
        accept="image/*"
        className="hidden"
      />

      {/* Modal Backdrop */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-40 flex items-center justify-center p-4">
          {/* Modal */}
          <div className={`rounded-xl shadow-xl max-w-md w-full overflow-hidden transform transition-all ${theme === 'dark' ? 'bg-gray-800' : 'bg-white'
            }`}>
            {/* Modal Header */}
            <div className={`px-6 py-4 border-b ${theme === 'dark' ? 'border-gray-700' : 'border-gray-200'
              }`}>
              <h3 className={`text-lg font-medium ${theme === 'dark' ? 'text-white' : 'text-gray-900'
                }`}>
                {t('avatar_modal_title')}
              </h3>
            </div>

            {/* Modal Body */}
            <div className="px-6 py-4">
              {!previewUrl ? (
                <div className="flex flex-col items-center justify-center p-8">
                  <div
                    onClick={openFileSelector}
                    className={`w-40 h-40 rounded-full border-2 border-dashed flex flex-col items-center justify-center cursor-pointer transition-colors ${theme === 'dark'
                        ? 'border-gray-600 text-gray-400 hover:border-blue-400 hover:text-blue-400'
                        : 'border-gray-300 text-gray-400 hover:border-blue-500 hover:text-blue-500'
                      }`}
                  >
                    <Upload size={32} />
                    <span className="mt-2 text-sm">Choisir une image</span>
                  </div>
                  <p className={`mt-4 text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'
                    }`}>
                    JPG, PNG ou GIF. 5 MB maximum.
                  </p>
                </div>
              ) : (
                <div className="flex flex-col items-center">
                  {/* Preview container */}
                  <div
                    ref={containerRef}
                    className={`w-52 h-52 rounded-full overflow-hidden border-2 relative mb-4 cursor-move ${theme === 'dark' ? 'border-gray-600' : 'border-gray-200'
                      }`}
                    onMouseDown={handleMouseDown}
                    onTouchStart={handleTouchStart}
                  >
                    <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                      <Move size={24} className="text-white opacity-70" />
                    </div>
                    <img
                      ref={imageRef}
                      src={previewUrl}
                      alt="Aperçu"
                      className="absolute"
                      style={{
                        width: `${scale * 100}%`,
                        height: `${scale * 100}%`,
                        transform: `translate(${position.x}px, ${position.y}px)`,
                        transformOrigin: 'center',
                        objectFit: 'cover',
                        pointerEvents: 'none'
                      }}
                    />
                  </div>

                  {/* Zoom control */}
                  <div className="w-full max-w-xs mb-4">
                    <label htmlFor="zoom" className={`block text-sm font-medium mb-1 ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'
                      }`}>
                      Zoom
                    </label>
                    <input
                      type="range"
                      id="zoom"
                      name="zoom"
                      min="1"
                      max="3"
                      step="0.1"
                      value={scale}
                      onChange={(e) => setScale(parseFloat(e.target.value))}
                      className={`w-full h-2 rounded-lg appearance-none cursor-pointer ${theme === 'dark' ? 'bg-gray-600' : 'bg-gray-200'
                        }`}
                    />
                  </div>

                  <button
                    type="button"
                    onClick={openFileSelector}
                    className={`inline-flex items-center px-3 py-2 border text-sm font-medium rounded-md transition-colors ${theme === 'dark'
                        ? 'border-gray-600 text-gray-300 bg-gray-700 hover:bg-gray-600'
                        : 'border-gray-300 text-gray-700 bg-white hover:bg-gray-50'
                      }`}
                  >
                    Choisir une autre image
                  </button>
                </div>
              )}
            </div>

            {/* Modal Footer */}
            <div className={`px-6 py-4 border-t flex justify-end space-x-3 ${theme === 'dark'
                ? 'bg-gray-700 border-gray-600'
                : 'bg-gray-50 border-gray-200'
              }`}>
              <button
                type="button"
                onClick={() => setIsModalOpen(false)}
                className={`inline-flex justify-center px-4 py-2 border shadow-sm text-sm font-medium rounded-md transition-colors ${theme === 'dark'
                    ? 'border-gray-600 text-gray-300 bg-gray-800 hover:bg-gray-700'
                    : 'border-gray-300 text-gray-700 bg-white hover:bg-gray-50'
                  }`}
              >
                <X size={16} className="mr-2" />
                Annuler
              </button>
              <button
                type="button"
                onClick={handleSave}
                disabled={!previewUrl}
                className={`inline-flex justify-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white transition-colors ${previewUrl
                    ? 'bg-blue-600 hover:bg-blue-700'
                    : theme === 'dark'
                      ? 'bg-blue-500 cursor-not-allowed'
                      : 'bg-blue-400 cursor-not-allowed'
                  }`}
              >
                <Check size={16} className="mr-2" />
                Appliquer
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default AvatarUploader;