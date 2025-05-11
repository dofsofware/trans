import { User } from '../types/user';

// Mock users for MVP demonstration
const mockUsers: User[] = [
  {
    id: '1',
    name: 'Client Demo',
    email: 'client@example.com',
    role: 'client',
    avatar: 'https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg?auto=compress&cs=tinysrgb&w=100'
  },
  {
    id: '2',
    name: 'Operations Agent',
    email: 'operations@hollytrans.com',
    role: 'operations',
    avatar: 'https://images.pexels.com/photos/1036623/pexels-photo-1036623.jpeg?auto=compress&cs=tinysrgb&w=100'
  },
  {
    id: '3',
    name: 'Customs Agent',
    email: 'customs@hollytrans.com',
    role: 'customs',
    avatar: 'https://images.pexels.com/photos/1181695/pexels-photo-1181695.jpeg?auto=compress&cs=tinysrgb&w=100'
  },
  {
    id: '4',
    name: 'Finance Manager',
    email: 'finance@hollytrans.com',
    role: 'finance',
    avatar: 'https://images.pexels.com/photos/3785079/pexels-photo-3785079.jpeg?auto=compress&cs=tinysrgb&w=100'
  },
  {
    id: '5',
    name: 'Logistics Supervisor',
    email: 'supervisor@hollytrans.com',
    role: 'supervisor',
    avatar: 'https://images.pexels.com/photos/1933873/pexels-photo-1933873.jpeg?auto=compress&cs=tinysrgb&w=100'
  },
  {
    id: '6',
    name: 'Admin User',
    email: 'admin@hollytrans.com',
    role: 'admin',
    avatar: 'https://images.pexels.com/photos/2379004/pexels-photo-2379004.jpeg?auto=compress&cs=tinysrgb&w=100'
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
  return mockUsers[0];
};

export const getUserById = async (id: string): Promise<User | null> => {
  // Simulate network delay
  await new Promise(resolve => setTimeout(resolve, 500));
  
  return mockUsers.find(user => user.id === id) || null;
};