import { Client } from '../types/client';
import { format, subDays } from 'date-fns';

// Mock data generator for clients
export const generateMockClients = (count = 20): Client[] => {
  const companies = [
    'GlobalTrade Inc.',
    'EuroDistribution GmbH',
    'Asia Pacific Logistics',
    'Mediterranean Shipping Co.',
    'Atlantic Import Export',
    'Pacific Trade Solutions',
    'Continental Freight',
    'International Commerce Ltd.',
    'World Cargo Services',
    'Universal Trading Corp.'
  ];

  const firstNames = ['Jean', 'Marie', 'Pierre', 'Sophie', 'Michel', 'Catherine', 'Philippe', 'Isabelle', 'François', 'Nathalie'];
  const lastNames = ['Martin', 'Bernard', 'Dubois', 'Thomas', 'Robert', 'Petit', 'Durand', 'Leroy', 'Moreau', 'Simon'];
  const cities = ['Paris', 'Lyon', 'Marseille', 'Toulouse', 'Nice', 'Nantes', 'Strasbourg', 'Montpellier', 'Bordeaux', 'Lille'];
  const countries = ['France', 'Germany', 'Italy', 'Spain', 'Netherlands', 'Belgium', 'Switzerland', 'Austria'];

  const clients: Client[] = [];

  for (let i = 0; i < count; i++) {
    const firstName = firstNames[Math.floor(Math.random() * firstNames.length)];
    const lastName = lastNames[Math.floor(Math.random() * lastNames.length)];
    const company = companies[Math.floor(Math.random() * companies.length)];
    const city = cities[Math.floor(Math.random() * cities.length)];
    const country = countries[Math.floor(Math.random() * countries.length)];
    const createdAt = format(subDays(new Date(), Math.floor(Math.random() * 365)), "yyyy-MM-dd'T'HH:mm:ss");
    const timestamp = Date.now() + i;
    const random = Math.floor(Math.random() * 1000).toString().padStart(3, '0');
    const clientId = `DKR${timestamp.toString().slice(-8)}${random}`;

    clients.push({
      id: `client-${1000 + i}`,
      name: `${firstName} ${lastName}`,
      email: `${firstName.toLowerCase()}.${lastName.toLowerCase()}@${company.toLowerCase().replace(/[^a-z]/g, '')}.com`,
      phone: `+33 ${Math.floor(Math.random() * 9) + 1} ${Math.floor(Math.random() * 90) + 10} ${Math.floor(Math.random() * 90) + 10} ${Math.floor(Math.random() * 90) + 10} ${Math.floor(Math.random() * 90) + 10}`,
      company,
      address: `${Math.floor(Math.random() * 999) + 1} Rue ${lastName}`,
      city,
      country,
      createdAt,
      updatedAt: createdAt,
      updatedBy: '2',
      status: Math.random() > 0.1 ? 'active' : 'inactive',
      avatar: Math.random() > 0.5 ? 'https://as2.ftcdn.net/jpg/03/49/49/79/1000_F_349497933_Ly4im8BDmHLaLzgyKg2f2yZOvJjBtlw5.jpg' : undefined,
      clientId,
      assignedAgentId: '2'
    });
  }

  return clients;
};

// Mock API functions
export const getMockClients = async (): Promise<Client[]> => {
  await new Promise(resolve => setTimeout(resolve, 800));
  return generateMockClients(25);
};

export const getMockClientById = async (id: string): Promise<Client | null> => {
  await new Promise(resolve => setTimeout(resolve, 500));
  const clients = generateMockClients(25);
  return clients.find(c => c.id === id) || null;
};

export const createMockClient = async (clientData: Partial<Client>): Promise<Client> => {
  await new Promise(resolve => setTimeout(resolve, 1000));
  
  const timestamp = Date.now();
  const random = Math.floor(Math.random() * 1000).toString().padStart(3, '0');
  const clientId = clientData.clientId || `DKR${timestamp.toString().slice(-8)}${random}`;
  
  const newClient: Client = {
    id: `client-${timestamp}`,
    name: clientData.name || '',
    email: clientData.email || '',
    phone: clientData.phone,
    company: clientData.company || '',
    address: clientData.address,
    city: clientData.city,
    country: clientData.country,
    createdAt: format(new Date(), "yyyy-MM-dd'T'HH:mm:ss"),
    updatedAt: format(new Date(), "yyyy-MM-dd'T'HH:mm:ss"),
    updatedBy: '2', // Current agent ID
    status: 'active',
    avatar: clientData.avatar,
    clientId,
    assignedAgentId: '2' // Current agent ID
  };

  return newClient;
};