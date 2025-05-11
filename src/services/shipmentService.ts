import { Shipment, ShipmentStatus, Document } from '../types/shipment';
import { format, addDays, subDays } from 'date-fns';

// Mock data generator for shipments
export const generateMockShipments = (count = 10): Shipment[] => {
  const statuses: ShipmentStatus[] = ['draft', 'processing', 'warehouse', 'customs', 'in_transit', 'delivered', 'issue'];
  const origins = ['Shenzhen, China', 'Dubai, UAE', 'Rotterdam, Netherlands', 'Hamburg, Germany', 'Singapore'];
  const destinations = ['Paris, France', 'New York, USA', 'Tokyo, Japan', 'London, UK', 'Sydney, Australia'];
  
  const shipments: Shipment[] = [];
  
  for (let i = 0; i < count; i++) {
    const status = statuses[Math.floor(Math.random() * statuses.length)];
    const createdAt = format(subDays(new Date(), Math.floor(Math.random() * 60)), "yyyy-MM-dd'T'HH:mm:ss");
    const updatedAt = format(subDays(new Date(), Math.floor(Math.random() * 30)), "yyyy-MM-dd'T'HH:mm:ss");
    const estimatedDelivery = format(addDays(new Date(), Math.floor(Math.random() * 30)), "yyyy-MM-dd'T'HH:mm:ss");
    
    const documents: Document[] = [];
    
    // Add some random documents
    if (Math.random() > 0.3) {
      documents.push({
        id: `doc-invoice-${i}`,
        shipmentId: `SHIP-${1000 + i}`,
        name: `Invoice #INV-${2000 + i}`,
        type: 'invoice',
        url: '#',
        uploadedAt: createdAt,
        uploadedBy: '1'
      });
    }
    
    if (Math.random() > 0.5) {
      documents.push({
        id: `doc-bl-${i}`,
        shipmentId: `SHIP-${1000 + i}`,
        name: `Bill of Lading #BL-${3000 + i}`,
        type: 'bill_of_lading',
        url: '#',
        uploadedAt: updatedAt,
        uploadedBy: '2'
      });
    }

    shipments.push({
      id: `SHIP-${1000 + i}`,
      reference: `HT-${10000 + i}`,
      clientId: '1',
      origin: origins[Math.floor(Math.random() * origins.length)],
      destination: destinations[Math.floor(Math.random() * destinations.length)],
      description: `Shipment ${i+1} containing various goods`,
      weight: parseFloat((Math.random() * 10000).toFixed(2)),
      volume: parseFloat((Math.random() * 100).toFixed(2)),
      status,
      estimatedDelivery,
      assignedAgentId: '2',
      createdAt,
      updatedAt,
      events: generateMockEvents(`SHIP-${1000 + i}`, status),
      documents
    });
  }
  
  return shipments;
};

const generateMockEvents = (shipmentId: string, currentStatus: ShipmentStatus) => {
  const events = [];
  const statuses: ShipmentStatus[] = ['draft', 'processing', 'warehouse', 'customs', 'in_transit', 'delivered'];
  const locations = ['Shanghai Port', 'Dubai Port', 'Rotterdam Terminal', 'Paris Warehouse', 'Customs Office'];
  
  let currentIndex = statuses.indexOf(currentStatus);
  if (currentStatus === 'issue') {
    currentIndex = Math.floor(Math.random() * (statuses.length - 1)) + 1;
  }
  
  for (let i = 0; i <= currentIndex; i++) {
    const daysAgo = (currentIndex - i) * 3 + Math.floor(Math.random() * 2);
    events.push({
      id: `event-${shipmentId}-${i}`,
      shipmentId,
      status: statuses[i],
      timestamp: format(subDays(new Date(), daysAgo), "yyyy-MM-dd'T'HH:mm:ss"),
      location: locations[Math.floor(Math.random() * locations.length)],
      notes: i === currentIndex && currentStatus === 'issue' 
        ? 'There is an issue with this shipment that requires attention.'
        : undefined,
      agentId: String(Math.floor(Math.random() * 5) + 2)
    });
  }
  
  if (currentStatus === 'issue') {
    events.push({
      id: `event-${shipmentId}-issue`,
      shipmentId,
      status: 'issue',
      timestamp: format(subDays(new Date(), 1), "yyyy-MM-dd'T'HH:mm:ss"),
      location: locations[Math.floor(Math.random() * locations.length)],
      notes: 'Issue detected with shipment processing.',
      agentId: String(Math.floor(Math.random() * 5) + 2)
    });
  }
  
  return events;
};

// Mock API functions
export const getMockShipments = async (clientId?: string): Promise<Shipment[]> => {
  await new Promise(resolve => setTimeout(resolve, 1000));
  const shipments = generateMockShipments(15);
  
  if (clientId) {
    return shipments.filter(s => s.clientId === clientId);
  }
  
  return shipments;
};

export const getMockShipmentById = async (id: string): Promise<Shipment | null> => {
  await new Promise(resolve => setTimeout(resolve, 800));
  const shipments = generateMockShipments(15);
  return shipments.find(s => s.id === id) || null;
};

export const updateShipmentStatus = async (id: string, status: ShipmentStatus, notes?: string): Promise<Shipment | null> => {
  await new Promise(resolve => setTimeout(resolve, 1200));
  
  // For MVP, just return a mock updated shipment
  const shipment = await getMockShipmentById(id);
  if (!shipment) return null;
  
  shipment.status = status;
  shipment.updatedAt = format(new Date(), "yyyy-MM-dd'T'HH:mm:ss");
  
  shipment.events.push({
    id: `event-${id}-${Date.now()}`,
    shipmentId: id,
    status,
    timestamp: format(new Date(), "yyyy-MM-dd'T'HH:mm:ss"),
    notes,
    agentId: '2'
  });
  
  return shipment;
};