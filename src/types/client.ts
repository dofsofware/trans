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
  updatedBy?: string;
  status: 'active' | 'inactive';
  avatar?: string;
  clientId?: string;
  assignedAgentId?: string;
  // Nouveaux champs pour les entreprises
  isCompany?: boolean;
  ninea?: string;
  raisonSociale?: string;
  companyAddress?: string;
  companyPhone?: string;
  companyEmail?: string;
}