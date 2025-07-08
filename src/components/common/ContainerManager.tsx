import { useState } from 'react';
import { Plus, X, Package, Weight, Box, Truck, Edit2, Trash2 } from 'lucide-react';
import { useLanguage } from '../../contexts/LanguageContext';
import { useTheme } from '../../contexts/ThemeContext';
import { Container, ContainerFormData } from '../../types/container';

interface ContainerManagerProps {
  containers: Container[];
  onContainersChange: (containers: Container[]) => void;
  disabled?: boolean;
}

const ContainerManager = ({ containers, onContainersChange, disabled = false }: ContainerManagerProps) => {
  const { t } = useLanguage();
  const { theme } = useTheme();
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingContainer, setEditingContainer] = useState<Container | null>(null);
  const [formData, setFormData] = useState<ContainerFormData>({
    containerNumber: '',
    volume: '',
    weight: '',
    containerType: 'dry',
    size: '20ft'
  });
  const [errors, setErrors] = useState<Partial<ContainerFormData>>({});

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

  const resetForm = () => {
    setFormData({
      containerNumber: '',
      volume: '',
      weight: '',
      containerType: 'dry',
      size: '20ft'
    });
    setErrors({});
    setEditingContainer(null);
  };

  const validateForm = (): boolean => {
    const newErrors: Partial<ContainerFormData> = {};

    if (!formData.containerNumber.trim()) {
      newErrors.containerNumber = t('required');
    } else if (!/^[A-Z]{4}[0-9]{7}$/.test(formData.containerNumber.toUpperCase())) {
      newErrors.containerNumber = t('invalid_container_number_format');
    }

    if (!formData.volume.trim()) {
      newErrors.volume = t('required');
    } else if (isNaN(Number(formData.volume)) || Number(formData.volume) <= 0) {
      newErrors.volume = t('invalid_volume');
    }

    if (!formData.weight.trim()) {
      newErrors.weight = t('required');
    } else if (isNaN(Number(formData.weight)) || Number(formData.weight) <= 0) {
      newErrors.weight = t('invalid_weight');
    }

    // Check for duplicate container numbers (excluding current editing container)
    const existingContainer = containers.find(c => 
      c.containerNumber.toUpperCase() === formData.containerNumber.toUpperCase() &&
      (!editingContainer || c.id !== editingContainer.id)
    );
    if (existingContainer) {
      newErrors.containerNumber = t('container_number_already_exists');
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    const containerData: Container = {
      id: editingContainer?.id || `container-${Date.now()}`,
      containerNumber: formData.containerNumber.toUpperCase(),
      volume: Number(formData.volume),
      weight: Number(formData.weight),
      containerType: formData.containerType,
      size: formData.size
    };

    let updatedContainers;
    if (editingContainer) {
      updatedContainers = containers.map(c => 
        c.id === editingContainer.id ? containerData : c
      );
    } else {
      updatedContainers = [...containers, containerData];
    }

    onContainersChange(updatedContainers);
    resetForm();
    setShowAddForm(false);
  };

  const handleEdit = (container: Container) => {
    setEditingContainer(container);
    setFormData({
      containerNumber: container.containerNumber,
      volume: container.volume.toString(),
      weight: container.weight.toString(),
      containerType: container.containerType,
      size: container.size
    });
    setShowAddForm(true);
  };

  const handleDelete = (containerId: string) => {
    const updatedContainers = containers.filter(c => c.id !== containerId);
    onContainersChange(updatedContainers);
  };

  const handleCancel = () => {
    resetForm();
    setShowAddForm(false);
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

  return (
    <div className="space-y-4">
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
              setShowAddForm(true);
            }}
            className="inline-flex items-center px-3 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm"
          >
            <Plus size={16} className="mr-1" />
            {t('add_container')}
          </button>
        )}
      </div>

      {/* Container List */}
      {containers.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {containers.map((container) => (
            <div
              key={container.id}
              className={`p-4 rounded-lg border ${borderColor} ${bgSecondary} hover:shadow-md transition-shadow`}
            >
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center">
                  <span className="text-2xl mr-2">
                    {getContainerTypeIcon(container.containerType)}
                  </span>
                  <div>
                    <h4 className={`font-medium ${textPrimary}`}>
                      {container.containerNumber}
                    </h4>
                    <p className={`text-sm ${textMuted}`}>
                      {containerTypes.find(t => t.value === container.containerType)?.label}
                    </p>
                  </div>
                </div>
                {!disabled && (
                  <div className="flex items-center space-x-1">
                    <button
                      type="button"
                      onClick={(e) => {
                        e.preventDefault();
                        handleEdit(container);
                      }}
                      className={`p-1 rounded ${textMuted} hover:${textPrimary} transition-colors`}
                    >
                      <Edit2 size={14} />
                    </button>
                    <button
                      type="button"
                      onClick={(e) => {
                        e.preventDefault();
                        handleDelete(container.id);
                      }}
                      className="p-1 rounded text-red-500 hover:text-red-700 transition-colors"
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                )}
              </div>

              <div className="grid grid-cols-2 gap-3 text-sm">
                <div className="flex items-center">
                  <Truck size={14} className={`mr-1 ${textMuted}`} />
                  <span className={textMuted}>{t('size')}:</span>
                  <span className={`ml-1 ${textSecondary}`}>
                    {containerSizes.find(s => s.value === container.size)?.label}
                  </span>
                </div>
                <div className="flex items-center">
                  <Box size={14} className={`mr-1 ${textMuted}`} />
                  <span className={textMuted}>{t('volume')}:</span>
                  <span className={`ml-1 ${textSecondary}`}>
                    {container.volume.toLocaleString()} m³
                  </span>
                </div>
                <div className="flex items-center col-span-2">
                  <Weight size={14} className={`mr-1 ${textMuted}`} />
                  <span className={textMuted}>{t('weight')}:</span>
                  <span className={`ml-1 ${textSecondary}`}>
                    {container.weight.toLocaleString()} kg
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Empty State */}
      {containers.length === 0 && (
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
                setShowAddForm(true);
              }}
              className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              <Plus size={16} className="mr-2" />
              {t('add_first_container')}
            </button>
          )}
        </div>
      )}

      {/* Add/Edit Form Modal */}
      {showAddForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
          <div className={`${bgSecondary} rounded-xl shadow-xl max-w-md w-full max-h-[90vh] overflow-y-auto`}>
            <div className={`flex justify-between items-center p-4 border-b ${borderColor}`}>
              <h3 className={`text-lg font-medium ${textPrimary}`}>
                {editingContainer ? t('edit_container') : t('add_container')}
              </h3>
              <button
                type="button"
                onClick={handleCancel}
                className={`${textMuted} hover:${textPrimary} transition-colors`}
              >
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-4 space-y-4">
              {/* Container Number */}
              <div>
                <label className={`block text-sm font-medium ${textSecondary} mb-1`}>
                  {t('container_number')} *
                </label>
                <input
                  type="text"
                  value={formData.containerNumber}
                  onChange={(e) => setFormData(prev => ({ ...prev, containerNumber: e.target.value }))}
                  placeholder="ABCD1234567"
                  className={`block w-full px-3 py-2 border rounded-lg ${bgPrimary} ${textPrimary} focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all ${
                    errors.containerNumber ? 'border-red-500' : borderColor
                  }`}
                />
                {errors.containerNumber && (
                  <p className="mt-1 text-sm text-red-500">{errors.containerNumber}</p>
                )}
                <p className={`mt-1 text-xs ${textMuted}`}>
                  {t('container_number_format')}
                </p>
              </div>

              {/* Container Type */}
              <div>
                <label className={`block text-sm font-medium ${textSecondary} mb-1`}>
                  {t('container_type')} *
                </label>
                <select
                  value={formData.containerType}
                  onChange={(e) => setFormData(prev => ({ ...prev, containerType: e.target.value as any }))}
                  className={`block w-full px-3 py-2 border ${borderColor} rounded-lg ${bgPrimary} ${textPrimary} focus:outline-none focus:ring-2 focus:ring-blue-500`}
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
                <label className={`block text-sm font-medium ${textSecondary} mb-1`}>
                  {t('container_size')} *
                </label>
                <select
                  value={formData.size}
                  onChange={(e) => setFormData(prev => ({ ...prev, size: e.target.value as any }))}
                  className={`block w-full px-3 py-2 border ${borderColor} rounded-lg ${bgPrimary} ${textPrimary} focus:outline-none focus:ring-2 focus:ring-blue-500`}
                >
                  {containerSizes.map(size => (
                    <option key={size.value} value={size.value}>
                      {size.label}
                    </option>
                  ))}
                </select>
              </div>

              {/* Volume */}
              <div>
                <label className={`block text-sm font-medium ${textSecondary} mb-1`}>
                  {t('volume')} (m³) *
                </label>
                <input
                  type="number"
                  step="0.01"
                  min="0"
                  value={formData.volume}
                  onChange={(e) => setFormData(prev => ({ ...prev, volume: e.target.value }))}
                  placeholder="33.2"
                  className={`block w-full px-3 py-2 border rounded-lg ${bgPrimary} ${textPrimary} focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all ${
                    errors.volume ? 'border-red-500' : borderColor
                  }`}
                />
                {errors.volume && (
                  <p className="mt-1 text-sm text-red-500">{errors.volume}</p>
                )}
              </div>

              {/* Weight */}
              <div>
                <label className={`block text-sm font-medium ${textSecondary} mb-1`}>
                  {t('weight')} (kg) *
                </label>
                <input
                  type="number"
                  step="0.01"
                  min="0"
                  value={formData.weight}
                  onChange={(e) => setFormData(prev => ({ ...prev, weight: e.target.value }))}
                  placeholder="25000"
                  className={`block w-full px-3 py-2 border rounded-lg ${bgPrimary} ${textPrimary} focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all ${
                    errors.weight ? 'border-red-500' : borderColor
                  }`}
                />
                {errors.weight && (
                  <p className="mt-1 text-sm text-red-500">{errors.weight}</p>
                )}
              </div>

              {/* Form Actions */}
              <div className="flex justify-end space-x-3 pt-4">
                <button
                  type="button"
                  onClick={handleCancel}
                  className={`px-4 py-2 border ${borderColor} rounded-lg ${bgPrimary} ${textPrimary} hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors`}
                >
                  {t('cancel')}
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  {editingContainer ? t('update_container') : t('add_container')}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default ContainerManager;