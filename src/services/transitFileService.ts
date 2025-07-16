import { TransitFile } from '../types/transitFile';
import { Container } from '../types/container';
import { format, subDays } from 'date-fns';

// Simulate API delay
const simulateDelay = () => new Promise(resolve => setTimeout(resolve, 500));

// Générateur de données mock pour les dossiers de transit
const generateMockTransitFiles = (count = 25): TransitFile[] => {
  const origins = [
    'Shanghai, Chine', 'Shenzhen, Chine', 'Hong Kong', 'Singapour', 'Dubai, EAU',
    'Rotterdam, Pays-Bas', 'Hamburg, Allemagne', 'Le Havre, France', 'Anvers, Belgique',
    'Los Angeles, USA', 'New York, USA', 'Tokyo, Japon', 'Busan, Corée du Sud'
  ];

  const destinations = [
    'Dakar, Sénégal', 'Abidjan, Côte d\'Ivoire', 'Lagos, Nigeria', 'Casablanca, Maroc',
    'Tunis, Tunisie', 'Alger, Algérie', 'Douala, Cameroun', 'Lomé, Togo',
    'Cotonou, Bénin', 'Conakry, Guinée', 'Bamako, Mali', 'Ouagadougou, Burkina Faso'
  ];

  const productTypes: ('standard' | 'dangerous' | 'fragile')[] = ['standard', 'dangerous', 'fragile'];
  const transportTypes: ('air' | 'sea')[] = ['air', 'sea'];
  const shipmentTypes: ('import' | 'export')[] = ['import', 'export'];
  const statuses: ('draft' | 'in_transit' | 'completed' | 'archived')[] = 
    ['draft', 'in_transit', 'completed', 'archived'];

  const contentDescriptions = [
    'Équipements électroniques et composants informatiques',
    'Textiles et vêtements prêt-à-porter',
    'Pièces automobiles et accessoires',
    'Produits alimentaires et boissons',
    'Matériaux de construction et quincaillerie',
    'Produits pharmaceutiques et médicaux',
    'Machines industrielles et équipements',
    'Produits chimiques et matières premières',
    'Mobilier et articles de décoration',
    'Jouets et articles de sport'
  ];

  const weights = [
    '15 tonnes',
    '25 tonnes',
    '28 tonnes',
    '500 kg',
    '1000 kg',
    '2000 kg',
    '5000 kg',
    '10 tonnes'
  ];

  const volumes = [
    '20 pieds',
    '40 pieds',
    '40 pieds HC',
    '2 m³',
    '5 m³',
    '10 m³',
    '25 m³',
    '50 m³'
  ];

  // Generate mock containers for sea transport
  const generateMockContainers = (transportType: 'air' | 'sea', fileIndex: number): Container[] => {
    if (transportType !== 'sea') return [];
    
    const containerTypes: Container['containerType'][] = ['dry', 'refrigerated', 'open_top', 'flat_rack', 'tank'];
    const containerSizes: Container['size'][] = ['20ft', '40ft', '40ft_hc', '45ft'];
    const containers: Container[] = [];
    
    const numContainers = Math.floor(Math.random() * 3) + 1; // 1-3 containers
    
    for (let i = 0; i < numContainers; i++) {
      const letters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
      const containerNumber = 
        letters.charAt(Math.floor(Math.random() * letters.length)) +
        letters.charAt(Math.floor(Math.random() * letters.length)) +
        letters.charAt(Math.floor(Math.random() * letters.length)) +
        letters.charAt(Math.floor(Math.random() * letters.length)) +
        Math.floor(Math.random() * 10000000).toString().padStart(7, '0');
      
      containers.push({
        id: `container-${fileIndex}-${i}`,
        containerNumber,
        volume: Math.floor(Math.random() * 50) + 10, // 10-60 m³
        weight: Math.floor(Math.random() * 20000) + 5000, // 5000-25000 kg
        containerType: containerTypes[Math.floor(Math.random() * containerTypes.length)],
        size: containerSizes[Math.floor(Math.random() * containerSizes.length)]
      });
    }
    
    return containers;
  };

  const files: TransitFile[] = [];

  for (let i = 0; i < count; i++) {
    const createdAt = format(subDays(new Date(), Math.floor(Math.random() * 90)), "yyyy-MM-dd'T'HH:mm:ss");
    const updatedAt = format(subDays(new Date(), Math.floor(Math.random() * 30)), "yyyy-MM-dd'T'HH:mm:ss");
    const transportType = transportTypes[Math.floor(Math.random() * transportTypes.length)];
    
    // Générer un numéro BL/LTA réaliste
    const blPrefix = transportType === 'air' ? 'LTA' : 'BL';
    const blNumber = `${blPrefix}${new Date().getFullYear()}${(1000 + i).toString().padStart(4, '0')}`;
    
    // Générer une référence de dossier
    const reference = `TF-${new Date().getFullYear()}-${(10000 + i).toString()}`;

    // Sélectionner 1-3 clients aléatoirement
    const numClients = Math.floor(Math.random() * 3) + 1;
    const clientIds = [];
    for (let j = 0; j < numClients; j++) {
      const clientId = `client-${1000 + Math.floor(Math.random() * 25)}`;
      if (!clientIds.includes(clientId)) {
        clientIds.push(clientId);
      }
    }

    files.push({
      id: `tf-${1000 + i}`,
      reference,
      blNumber,
      clientIds,
      origin: origins[Math.floor(Math.random() * origins.length)],
      destination: destinations[Math.floor(Math.random() * destinations.length)],
      transportType,
      shipmentType: shipmentTypes[Math.floor(Math.random() * shipmentTypes.length)],
      productType: productTypes[Math.floor(Math.random() * productTypes.length)],
      totalWeight: weights[Math.floor(Math.random() * weights.length)],
      totalVolume: volumes[Math.floor(Math.random() * volumes.length)],
      contentDescription: contentDescriptions[Math.floor(Math.random() * contentDescriptions.length)],
      containers: generateMockContainers(transportType, i),
      documents: {
        invoice: Math.random() > 0.0 ? { file: `invoice-${i}.pdf`, clientVisible: Math.random() > 0.5 } : undefined,
        packingList: Math.random() > 0.0 ? { file: `packing-list-${i}.pdf`, clientVisible: Math.random() > 0.5 } : undefined,
        otherDocuments: Math.random() > 0.7 ? [
          { file: `doc1-${i}.pdf`, clientVisible: Math.random() > 0.5 },
          { file: `doc2-${i}.pdf`, clientVisible: Math.random() > 0.5 }
        ] : undefined
      },
      events: [
        {
          id: `event-${i}-1`,
          name: 'Import Prealert',
          date: format(subDays(new Date(), Math.floor(Math.random() * 30) + 10), "yyyy-MM-dd"),
          agentId: `agent-${Math.floor(Math.random() * 4) + 1}`,
          agentName: 'Agent Name',
          details: 'Prealert sent to all parties',
          completed: true
        },
        {
          id: `event-${i}-2`,
          name: 'Arrival',
          date: format(subDays(new Date(), Math.floor(Math.random() * 20) + 5), "yyyy-MM-dd"),
          agentId: `agent-${Math.floor(Math.random() * 4) + 1}`,
          agentName: 'Agent Name',
          details: 'Vessel arrived at port',
          completed: Math.random() > 0.3
        },
        {
          id: `event-${i}-3`,
          name: 'Declaration',
          date: format(subDays(new Date(), Math.floor(Math.random() * 15)), "yyyy-MM-dd"),
          agentId: `agent-${Math.floor(Math.random() * 4) + 1}`,
          agentName: 'Agent Name',
          completed: Math.random() > 0.5
        }
      ],
      status: statuses[Math.floor(Math.random() * statuses.length)],
      createdAt,
      updatedAt,
      createdBy: '2', // Agent actuel
      updatedBy: '2'
    });
  }

  return files;
};

// Generate and cache mock data
let mockTransitFiles: TransitFile[] = generateMockTransitFiles(25);

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
    id: `tf-${Date.now()}`,
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
    { value: 'in_transit', label: 'In Transit' },
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