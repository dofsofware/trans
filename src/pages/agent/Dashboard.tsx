import React from 'react';

const AgentDashboard = () => {
  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">Agent Dashboard</h1>
      <div className="grid gap-6">
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-lg font-semibold mb-4">Active Shipments Overview</h2>
          <p className="text-gray-600">Welcome to your agent dashboard. Shipment management tools will be displayed here.</p>
        </div>
      </div>
    </div>
  );
};

export default AgentDashboard;