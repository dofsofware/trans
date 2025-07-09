import { useState, useEffect } from 'react';
import { Plus, X, Package, Weight, Box, Truck, Edit2, Trash2, Check, Save } from 'lucide-react';
import { useLanguage } from '../../contexts/LanguageContext';
import { useTheme } from '../../contexts/ThemeContext';
import { Container, ContainerFormData } from '../../types/container';

interface ContainerManagerProps {
  containers: Container[];
  onContainersChange: (containers: Container[]) => void;
  disabled?: boolean;
}

interface EditingContainer extends ContainerFormData {
  id: string;
  isNew?: boolean;
}

const ContainerManager = ({ containers, onContainersChange, disabled = false }: ContainerManagerProps) => {
  const { t } = useLanguage();
  const { theme } = useTheme();
  const [editingContainers, setEditingContainers] = useState<{ [key: string]: EditingContainer }>({});
  const [errors, setErrors] = useState<{ [key: string]: Partial<ContainerFormData> }>({});

  const isDark = theme === 'dark';
  const textPrimary = isDark ? 'text-white' : 'text-gray-900';
  const textSecondary = isDark ? 'text-gray-300' : 'text-gray-600';
  const textMuted = isDark ? 'text-gray-400' : 'text-gray-500';
  const bgPrimary = isDark ? 'bg-gray-900' : 'bg-white';
  const bgSecondary = isDark ? 'bg-gray-800' : 'bg-white';
  const borderColor = isDark ? 'border-gray-700' : 'border-gray-200';

  const containerTypes = [
    { value: 'dry', label: t('dry_container') },
    { value: 'refrigerated', label: t('refrigerated_container') },
    { value: 'open_top', label: t('open_top_container') },
    { value: 'flat_rack', label: t('flat_rack_container') },
    { value: 'tank', label: t('tank_container') },
    { value: 'other', label: t('other_container') }
  ];

  const containerSizes = [
    { value: '20ft', label: '20 pieds' },
    { value: '40ft', label: '40 pieds' },
    { value: '40ft_hc', label: '40 pieds HC' },
    { value: '45ft', label: '45 pieds' }
  ];

  const validateContainer = (containerId: string, data: EditingContainer): boolean => {
    const newErrors: Partial<ContainerFormData> = {};

    if (!data.containerNumber.trim()) {
      newErrors.containerNumber = t('required');
    } else if (!/^[A-Z]{4}[0-9]{7}$/.test(data.containerNumber.toUpperCase())) {
      newErrors.containerNumber = t('invalid_container_number_format');
    } else {
      // Check for duplicates
      const existingContainer = containers.find(c => 
        c.containerNumber.toUpperCase() === data.containerNumber.toUpperCase() &&
        c.id !== containerId
      );
      if (existingContainer) {
        newErrors.containerNumber = t('container_number_already_exists');
      }
    }

    if (!data.volume.trim()) {
      newErrors.volume = t('required');
    } else if (isNaN(Number(data.volume)) || Number(data.volume) <= 0) {
      newErrors.volume = t('invalid_volume');
    }

    if (!data.weight.trim()) {
      newErrors.weight = t('required');
    } else if (isNaN(Number(data.weight)) || Number(data.weight) <= 0) {
      newErrors.weight = t('invalid_weight');
    }

    setErrors(prev => ({ ...prev, [containerId]: newErrors }));
    return Object.keys(newErrors).length === 0;
  };

  const handleAddContainer = () => {
    const newId = `container-new-${Date.now()}`;
    const newContainer: EditingContainer = {
      id: newId,
      containerNumber: '',
      volume: '',
      weight: '',
      containerType: 'dry',
      size: '20ft',
      isNew: true
    };

    setEditingContainers(prev => ({ ...prev, [newId]: newContainer }));
  };

  const handleEditContainer = (container: Container) => {
    const editingContainer: EditingContainer = {
      id: container.id,
      containerNumber: container.containerNumber,
      volume: container.volume.toString(),
      weight: container.weight.toString(),
      containerType: container.containerType,
      size: container.size
    };

    setEditingContainers(prev => ({ ...prev, [container.id]: editingContainer }));
  };

  const handleSaveContainer = (containerId: string) => {
    const editingContainer = editingContainers[containerId];
    if (!editingContainer || !validateContainer(containerId, editingContainer)) {
      return;
    }

    const containerData: Container = {
      id: editingContainer.isNew ? `container-${Date.now()}` : containerId,
      containerNumber: editingContainer.containerNumber.toUpperCase(),
      volume: Number(editingContainer.volume),
      weight: Number(editingContainer.weight),
      containerType: editingContainer.containerType,
      size: editingContainer.size
    };

    let updatedContainers;
    if (editingContainer.isNew) {
      updatedContainers = [...containers, containerData];
    } else {
      updatedContainers = containers.map(c => 
        c.id === containerId ? containerData : c
      );
    }

    onContainersChange(updatedContainers);
    
    // Remove from editing state
    setEditingContainers(prev => {
      const newState = { ...prev };
      delete newState[containerId];
      return newState;
    });
    
    // Clear errors
    setErrors(prev => {
      const newState = { ...prev };
      delete newState[containerId];
      return newState;
    });
  };

  const handleCancelEdit = (containerId: string) => {
    setEditingContainers(prev => {
      const newState = { ...prev };
      delete newState[containerId];
      return newState;
    });
    
    setErrors(prev => {
      const newState = { ...prev };
      delete newState[containerId];
      return newState;
    });
  };

  const handleDeleteContainer = (containerId: string) => {
    const updatedContainers = containers.filter(c => c.id !== containerId);
    onContainersChange(updatedContainers);
  };

  const handleFieldChange = (containerId: string, field: keyof ContainerFormData, value: string) => {
    setEditingContainers(prev => ({
      ...prev,
      [containerId]: {
        ...prev[containerId],
        [field]: value
      }
    }));

    // Clear error for this field
    if (errors[containerId]?.[field]) {
      setErrors(prev => ({
        ...prev,
        [containerId]: {
          ...prev[containerId],
          [field]: undefined
        }
      }));
    }
  };

  const getContainerTypeIcon = (type: string) => {
    switch (type) {
      case 'refrigerated':
        return '❄️';
      case 'open_top':
        return '📦';
      case 'flat_rack':
        return '🚛';
      case 'tank':
        return '🛢️';
      default:
        return '📦';
    }
  };

  const stopPropagation = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
  };

  // Combine containers and editing containers for display
  const displayContainers = [
    ...containers.filter(c => !editingContainers[c.id]),
    ...Object.values(editingContainers)
  ];

  return (
    <div className="container-manager space-y-4" onClick={stopPropagation}>
      {/* Header */}
      <div className="flex items-center justify-between">
        <h3 className={`text-lg font-medium ${textPrimary} flex items-center`}>
          <Package size={20} className="mr-2 text-blue-600" />
          {t('containers')}
        </h3>
        {!disabled && (
          <button
            type="button"
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              handleAddContainer();
            }}
            className="inline-flex items-center px-3 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm"
          >
            <Plus size={16} className="mr-1" />
            {t('add_container')}
          </button>
        )}
      </div>

      {/* Container List */}
      {displayContainers.length > 0 ? (
        <div className="space-y-3">
          {displayContainers.map((container) => {
            const isEditing = editingContainers[container.id];
            const containerErrors = errors[container.id] || {};

            return (
              <div
                key={container.id}
                className={`p-4 rounded-lg border transition-all ${
                  isEditing 
                    ? 'border-blue-300 bg-blue-50/50 dark:bg-blue-900/20 dark:border-blue-700' 
                    : `${borderColor} ${bgSecondary} hover:shadow-md`
                }`}
                onClick={stopPropagation}
              >
                {isEditing ? (
                  // Editing Mode
                  <div className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                      {/* Container Number */}
                      <div>
                        <label className={`block text-xs font-medium ${textSecondary} mb-1`}>
                          {t('container_number')} *
                        </label>
                        <input
                          type="text"
                          value={isEditing.containerNumber}
                          onChange={(e) => handleFieldChange(container.id, 'containerNumber', e.target.value)}
                          placeholder="ABCD1234567"
                          className={`block w-full px-2 py-1.5 text-sm border rounded ${bgPrimary} ${textPrimary} focus:outline-none focus:ring-1 focus:ring-blue-500 transition-all ${
                            containerErrors.containerNumber ? 'border-red-500' : borderColor
                          }`}
                        />
                        {containerErrors.containerNumber && (
                          <p className="mt-1 text-xs text-red-500">{containerErrors.containerNumber}</p>
                        )}
                      </div>

                      {/* Container Type */}
                      <div>
                        <label className={`block text-xs font-medium ${textSecondary} mb-1`}>
                          {t('container_type')} *
                        </label>
                        <select
                          value={isEditing.containerType}
                          onChange={(e) => handleFieldChange(container.id, 'containerType', e.target.value)}
                          className={`block w-full px-2 py-1.5 text-sm border ${borderColor} rounded ${bgPrimary} ${textPrimary} focus:outline-none focus:ring-1 focus:ring-blue-500`}
                        >
                          {containerTypes.map(type => (
                            <option key={type.value} value={type.value}>
                              {type.label}
                            </option>
                          ))}
                        </select>
                      </div>

                      {/* Container Size */}
                      <div>
                        <label className={`block text-xs font-medium ${textSecondary} mb-1`}>
                          {t('container_size')} *
                        </label>
                        <select
                          value={isEditing.size}
                          onChange={(e) => handleFieldChange(container.id, 'size', e.target.value)}
                          className={`block w-full px-2 py-1.5 text-sm border ${borderColor} rounded ${bgPrimary} ${textPrimary} focus:outline-none focus:ring-1 focus:ring-blue-500`}
                        >
                          {containerSizes.map(size => (
                            <option key={size.value} value={size.value}>
                              {size.label}
                            </option>
                          ))}
                        </select>
                      </div>

                      {/* Actions */}
                      <div className="flex items-end space-x-2">
                        <button
                          type="button"
                          onClick={(e) => {
                            e.preventDefault();
                            e.stopPropagation();
                            handleSaveContainer(container.id);
                          }}
                          className="flex-1 inline-flex items-center justify-center px-3 py-1.5 bg-green-600 text-white rounded text-sm hover:bg-green-700 transition-colors"
                        >
                          <Check size={14} className="mr-1" />
                          {t('save')}
                        </button>
                        <button
                          type="button"
                          onClick={(e) => {
                            e.preventDefault();
                            e.stopPropagation();
                            handleCancelEdit(container.id);
                          }}
                          className={`flex-1 inline-flex items-center justify-center px-3 py-1.5 border ${borderColor} rounded text-sm ${bgPrimary} ${textPrimary} hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors`}
                        >
                          <X size={14} className="mr-1" />
                          {t('cancel')}
                        </button>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {/* Volume */}
                      <div>
                        <label className={`block text-xs font-medium ${textSecondary} mb-1`}>
                          {t('volume')} (m³) *
                        </label>
                        <input
                          type="number"
                          step="0.01"
                          min="0"
                          value={isEditing.volume}
                          onChange={(e) => handleFieldChange(container.id, 'volume', e.target.value)}
                          placeholder="33.2"
                          className={`block w-full px-2 py-1.5 text-sm border rounded ${bgPrimary} ${textPrimary} focus:outline-none focus:ring-1 focus:ring-blue-500 transition-all ${
                            containerErrors.volume ? 'border-red-500' : borderColor
                          }`}
                        />
                        {containerErrors.volume && (
                          <p className="mt-1 text-xs text-red-500">{containerErrors.volume}</p>
                        )}
                      </div>

                      {/* Weight */}
                      <div>
                        <label className={`block text-xs font-medium ${textSecondary} mb-1`}>
                          {t('weight')} (kg) *
                        </label>
                        <input
                          type="number"
                          step="0.01"
                          min="0"
                          value={isEditing.weight}
                          onChange={(e) => handleFieldChange(container.id, 'weight', e.target.value)}
                          placeholder="25000"
                          className={`block w-full px-2 py-1.5 text-sm border rounded ${bgPrimary} ${textPrimary} focus:outline-none focus:ring-1 focus:ring-blue-500 transition-all ${
                            containerErrors.weight ? 'border-red-500' : borderColor
                          }`}
                        />
                        {containerErrors.weight && (
                          <p className="mt-1 text-xs text-red-500">{containerErrors.weight}</p>
                        )}
                      </div>
                    </div>
                  </div>
                ) : (
                  // Display Mode
                  <div className="flex items-start justify-between">
                    <div className="flex items-center flex-1">
                      <span className="text-2xl mr-3">
                        {getContainerTypeIcon(container.containerType)}
                      </span>
                      <div className="flex-1">
                        <div className="flex items-center justify-between mb-2">
                          <h4 className={`font-medium ${textPrimary}`}>
                            {container.containerNumber}
                          </h4>
                          <span className={`inline-flex items-center rounded-full border font-medium px-2 py-1 text-xs ${
                            isDark ? 'bg-blue-900/50 text-blue-300 border-blue-700' : 'bg-blue-50 text-blue-700 border-blue-200'
                          }`}>
                            {containerSizes.find(s => s.value === container.size)?.label}
                          </span>
                        </div>
                        
                        <p className={`text-sm ${textMuted} mb-2`}>
                          {containerTypes.find(t => t.value === container.containerType)?.label}
                        </p>

                        <div className="grid grid-cols-2 gap-4 text-sm">
                          <div className="flex items-center">
                            <Box size={14} className={`mr-1 flex-shrink-0 ${textMuted}`} />
                            <span className={textMuted}>{t('volume')}:</span>
                            <span className={`ml-1 ${textSecondary}`}>
                              {container.volume.toLocaleString()} m³
                            </span>
                          </div>
                          <div className="flex items-center">
                            <Weight size={14} className={`mr-1 flex-shrink-0 ${textMuted}`} />
                            <span className={textMuted}>{t('weight')}:</span>
                            <span className={`ml-1 ${textSecondary}`}>
                              {container.weight.toLocaleString()} kg
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>

                    {!disabled && (
                      <div className="flex items-center space-x-1 ml-4">
                        <button
                          type="button"
                          onClick={(e) => {
                            e.preventDefault();
                            e.stopPropagation();
                            handleEditContainer(container);
                          }}
                          className={`p-2 rounded ${textMuted} hover:${textPrimary} hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors`}
                          title={t('edit')}
                        >
                          <Edit2 size={16} />
                        </button>
                        <button
                          type="button"
                          onClick={(e) => {
                            e.preventDefault();
                            e.stopPropagation();
                            handleDeleteContainer(container.id);
                          }}
                          className="p-2 rounded text-red-500 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"
                          title={t('delete')}
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    )}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      ) : (
        // Empty State
        <div className={`text-center py-8 ${bgSecondary} rounded-lg border ${borderColor}`}>
          <Package size={48} className={`mx-auto mb-4 ${textMuted}`} />
          <p className={`${textMuted} mb-4`}>
            {t('no_containers_added')}
          </p>
          {!disabled && (
            <button
              type="button"
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                handleAddContainer();
              }}
              className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              <Plus size={16} className="mr-2" />
              {t('add_first_container')}
            </button>
          )}
        </div>
      )}
    </div>
  );
};

export default ContainerManager;