import { TransitFile, mockTransitFiles } from '../types/transitFile';

// Simulate API delay
const simulateDelay = () => new Promise(resolve => setTimeout(resolve, 500));

export const getTransitFiles = async (): Promise<TransitFile[]> => {
  await simulateDelay();
  return mockTransitFiles;
};

export const getTransitFileById = async (id: string): Promise<TransitFile> => {
  await simulateDelay();
  const file = mockTransitFiles.find(file => file.id === id);
  if (!file) {
    throw new Error(`Transit file with ID ${id} not found`);
  }
  return file;
};

export const createTransitFile = async (fileData: Omit<TransitFile, 'id' | 'createdAt' | 'updatedAt' | 'createdBy' | 'updatedBy'>): Promise<TransitFile> => {
  await simulateDelay();
  const newFile: TransitFile = {
    ...fileData,
    id: `TF-${new Date().getFullYear()}-${Math.random().toString(36).substring(2, 8).toUpperCase()}`,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    createdBy: 'current-user-id', // This would be replaced with actual user ID
    updatedBy: 'current-user-id',
    status: 'draft'
  };
  mockTransitFiles.push(newFile);
  return newFile;
};

export const updateTransitFile = async (fileData: TransitFile): Promise<TransitFile> => {
  await simulateDelay();
  const index = mockTransitFiles.findIndex(file => file.id === fileData.id);
  if (index === -1) {
    throw new Error(`Transit file with ID ${fileData.id} not found`);
  }
  
  const updatedFile = {
    ...fileData,
    updatedAt: new Date().toISOString(),
    updatedBy: 'current-user-id' // This would be replaced with actual user ID
  };
  
  mockTransitFiles[index] = updatedFile;
  return updatedFile;
};

export const deleteTransitFile = async (id: string): Promise<void> => {
  await simulateDelay();
  const index = mockTransitFiles.findIndex(file => file.id === id);
  if (index === -1) {
    throw new Error(`Transit file with ID ${id} not found`);
  }
  mockTransitFiles.splice(index, 1);
};

// Additional utility functions
export const getTransitFileStatusOptions = () => {
  return [
    { value: 'draft', label: 'Draft' },
    { value: 'in_progress', label: 'In Progress' },
    { value: 'completed', label: 'Completed' },
    { value: 'archived', label: 'Archived' }
  ];
};

export const getTransportTypeOptions = () => {
  return [
    { value: 'air', label: 'Air' },
    { value: 'sea', label: 'Sea' }
  ];
};

export const getShipmentTypeOptions = () => {
  return [
    { value: 'import', label: 'Import' },
    { value: 'export', label: 'Export' }
  ];
};

export const getProductTypeOptions = () => {
  return [
    { value: 'standard', label: 'Standard' },
    { value: 'dangerous', label: 'Dangerous' },
    { value: 'fragile', label: 'Fragile' }
  ];
};