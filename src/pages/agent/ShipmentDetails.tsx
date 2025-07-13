import React from 'react';
import { useParams } from 'react-router-dom';

const AgentShipmentDetails = () => {
  const { id } = useParams();

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">Shipment Details</h1>
      <div className="bg-white rounded-lg shadow p-6">
        <p className="text-gray-600">Detailed information for shipment {id} will be displayed here.</p>
      </div>
    </div>
  );
};

export default AgentShipmentDetails;