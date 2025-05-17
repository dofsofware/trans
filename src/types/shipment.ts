export type ShipmentStatus = 
  | 'draft' 
  | 'processing' 
  | 'warehouse' 
  | 'customs' 
  | 'in_transit' 
  | 'delivered' 
  | 'issue';

export type ShipmentType = 'air' | 'sea';

export interface ShipmentEvent {
  id: string;
  shipmentId: string;
  status: ShipmentStatus;
  timestamp: string;
  location?: string;
  notes?: string;
  agentId?: string;
}

export interface Document {
  id: string;
  shipmentId: string;
  name: string;
  type: 'invoice' | 'customs' | 'bill_of_lading' | 'certificate' | 'other';
  url: string;
  uploadedAt: string;
  uploadedBy: string;
}

export interface Shipment {
  id: string;
  reference: string;
  clientId: string;
  origin: string;
  destination: string;
  description: string;
  weight: number;
  volume: number;
  status: ShipmentStatus;
  type: ShipmentType;
  estimatedDelivery?: string;
  assignedAgentId?: string;
  createdAt: string;
  updatedAt: string;
  events: ShipmentEvent[];
  documents: Document[];
}