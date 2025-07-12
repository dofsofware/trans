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
  capacity: string;
  contentDescription: string;
  containers: Container[];
  documents: TransitFileDocuments;
  events: TransitEvent[];
  status: 'draft' | 'in_progress' | 'completed' | 'archived';
  createdAt: string;
  updatedAt: string;
  createdBy: string;
  updatedBy: string;
}

// Mock data for development
export const mockTransitFiles: TransitFile[] = [
  {
    id: 'TF-2023-001',
    blNumber: 'BL12345678',
    reference: 'TF-2023-001',
    clientIds: ['client-1', 'client-2'],
    origin: 'Shanghai, China',
    destination: 'Rotterdam, Netherlands',
    transportType: 'sea',
    shipmentType: 'import',
    productType: 'standard',
    capacity: '20ft x 2, 40ft x 1',
    contentDescription: 'Electronics components and household goods',
    containers: [
      {
        id: 'cont-1',
        number: 'TGHU1234567',
        type: '20ft',
        sealNumber: 'SL12345',
        weight: 18500,
        packages: 120,
        packageType: 'cartons'
      },
      {
        id: 'cont-2',
        number: 'FSCU7654321',
        type: '40ft',
        sealNumber: 'SL54321',
        weight: 26500,
        packages: 200,
        packageType: 'pallets'
      }
    ],
    documents: {
      invoice: {
        file: '/documents/TF-2023-001/invoice.pdf',
        clientVisible: true
      },
      packingList: {
        file: '/documents/TF-2023-001/packing-list.pdf',
        clientVisible: true
      },
      otherDocuments: [
        {
          file: '/documents/TF-2023-001/certificate.pdf',
          clientVisible: false
        }
      ]
    },
    events: [
      {
        id: 'event-1',
        name: 'Import Prealert',
        date: '2023-05-01',
        agentId: 'user-1',
        agentName: 'John Doe',
        details: 'Prealert sent to all parties',
        completed: true
      },
      {
        id: 'event-2',
        name: 'Arrival',
        date: '2023-05-15',
        agentId: 'user-2',
        agentName: 'Jane Smith',
        details: 'Vessel arrived at port',
        completed: true
      },
      {
        id: 'event-3',
        name: 'Declaration',
        date: '2023-05-16',
        agentId: 'user-1',
        agentName: 'John Doe',
        completed: false
      },
      // ... other events
    ],
    status: 'in_progress',
    createdAt: '2023-04-20T10:30:00Z',
    updatedAt: '2023-05-16T14:45:00Z',
    createdBy: 'user-1',
    updatedBy: 'user-2'
  },
  // ... other mock files
];