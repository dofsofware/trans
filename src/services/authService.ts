import { User } from '../types/user';

// Mock users for MVP demonstration
const mockUsers: User[] = [
  {
    id: '1',
    name: 'Cheikh Client',
    email: 'client@example.com',
    role: 'client',
    avatar: 'https://as2.ftcdn.net/jpg/03/49/49/79/1000_F_349497933_Ly4im8BDmHLaLzgyKg2f2yZOvJjBtlw5.jpg',
    identifiant: 'DKR0002349283429'
  },
  {
    id: '2',
    name: 'Cheikh Agent Operations',
    email: 'operations@hollytrans.com',
    role: 'operations',
    avatar: 'https://as2.ftcdn.net/jpg/03/49/49/79/1000_F_349497933_Ly4im8BDmHLaLzgyKg2f2yZOvJjBtlw5.jpg',
    identifiant: 'DKR0002349283429'
  },
  {
    id: '3',
    name: 'Cheikh Customs Agent',
    email: 'customs@hollytrans.com',
    role: 'customs',
    avatar: 'https://as2.ftcdn.net/jpg/03/49/49/79/1000_F_349497933_Ly4im8BDmHLaLzgyKg2f2yZOvJjBtlw5.jpg',
    identifiant: 'DKR0002349283429'
  },
  {
    id: '4',
    name: 'Cheikh Finance Manager',
    email: 'finance@hollytrans.com',
    role: 'finance',
    avatar: 'https://as2.ftcdn.net/jpg/03/49/49/79/1000_F_349497933_Ly4im8BDmHLaLzgyKg2f2yZOvJjBtlw5.jpg',
    identifiant: 'DKR0002349283429'
  },
  {
    id: '5',
    name: 'Cheikh Logistics Supervisor',
    email: 'supervisor@hollytrans.com',
    role: 'supervisor',
    avatar: 'https://as2.ftcdn.net/jpg/03/49/49/79/1000_F_349497933_Ly4im8BDmHLaLzgyKg2f2yZOvJjBtlw5.jpg',
    identifiant: 'DKR0002349283429'
  },
  {
    id: '6',
    name: 'Cheikh Admin User',
    email: 'admin@hollytrans.com',
    role: 'admin',
    avatar: 'https://as2.ftcdn.net/jpg/03/49/49/79/1000_F_349497933_Ly4im8BDmHLaLzgyKg2f2yZOvJjBtlw5.jpg',
    identifiant: 'DKR0002349283429'
  },
];

// For MVP, we'll use a mock authentication service
export const getMockCurrentUser = async (email?: string): Promise<User | null> => {
  // Simulate network delay
  await new Promise(resolve => setTimeout(resolve, 800));
  
  if (email) {
    return mockUsers.find(user => user.email === email) || null;
  }
  
  // For demo purposes, default to client user if no email provided
  return mockUsers[1];
};

export const getUserById = async (id: string): Promise<User | null> => {
  // Simulate network delay
  await new Promise(resolve => setTimeout(resolve, 500));
  
  return mockUsers.find(user => user.id === id) || null;
};