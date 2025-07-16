import { Container } from './container';
import { Client } from './client';

export interface TransitEvent {
  id: string;
  name: string;
  date: string;
  agentId: string;
  agentName: string;
  details?: string;
  completed: boolean;
}

export interface TransitFileDocument {
  file: File | string; // string for existing file URLs
  clientVisible: boolean;
}

export interface TransitFileDocuments {
  invoice?: TransitFileDocument;
  packingList?: TransitFileDocument;
  otherDocuments?: TransitFileDocument[];
}

export interface TransitFile {
  id: string;
  blNumber: string;
  reference: string;
  clientIds: string[];
  clients?: Client[]; // Populated when fetching single file
  origin: string;
  destination: string;
  transportType: 'air' | 'sea';
  shipmentType: 'import' | 'export';
  productType: 'standard' | 'dangerous' | 'fragile';
  totalWeight: string;
  totalVolume: string;
  contentDescription: string;
  containers: Container[];
  documents: TransitFileDocuments;
  events: TransitEvent[];
  currentEvent: 'export_pregate' | 'warehouse_reception' | 'declaration' | 'export_customs_clearance' | 'warehouse_loading' | 'effective_transport' | 'vessel_loading' | 'departure' | 'estimated_arrival' | 'billing';
  createdAt: string;
  updatedAt: string;
  createdBy: string;
  updatedBy: string;
}