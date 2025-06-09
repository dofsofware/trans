export interface Client {
  id: string;
  name: string;
  email: string;
  phone?: string;
  company: string;
  address?: string;
  city?: string;
  country?: string;
  createdAt: string;
  updatedAt: string;
  status: 'active' | 'inactive';
  avatar?: string;
}