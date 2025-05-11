import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import LoginPage from '../pages/LoginPage';
import ClientDashboard from '../pages/client/Dashboard';
import ShipmentDetails from '../pages/client/ShipmentDetails';
import DocumentsPage from '../pages/client/Documents';
import MessagesPage from '../pages/client/Messages';
import PaymentsPage from '../pages/client/Payments';
import AgentDashboard from '../pages/agent/Dashboard';
import AgentShipments from '../pages/agent/Shipments';
import AgentShipmentDetails from '../pages/agent/ShipmentDetails';
import Layout from '../components/layout/Layout';
import LoadingScreen from '../components/common/LoadingScreen';
import SettingsPage from '../pages/client/Settings';
import ProfilePage from '../pages/client/Profile';

const AppRoutes = () => {
  const { isAuthenticated, isLoading, user } = useAuth();

  if (isLoading) {
    return <LoadingScreen />;
  }

  return (
    <Routes>
      {!isAuthenticated ? (
        <>
          <Route path="/login" element={<LoginPage />} />
          <Route path="*" element={<Navigate to="/login" replace />} />
        </>
      ) : (
        <>
          {user?.role === 'client' ? (
            <Route element={<Layout />}>
              <Route path="/" element={<ClientDashboard />} />
              <Route path="/shipments/:id" element={<ShipmentDetails />} />
              <Route path="/documents" element={<DocumentsPage />} />
              <Route path="/messages" element={<MessagesPage />} />
              <Route path="/payments" element={<PaymentsPage />} />
              <Route path="/settings" element={<SettingsPage />} />
              <Route path="/profile" element={<ProfilePage />} />
              <Route path="*" element={<Navigate to="/" replace />} />
            </Route>
          ) : (
            <Route element={<Layout />}>
              <Route path="/" element={<AgentDashboard />} />
              <Route path="/shipments" element={<AgentShipments />} />
              <Route path="/shipments/:id" element={<AgentShipmentDetails />} />
              <Route path="*" element={<Navigate to="/" replace />} />
            </Route>
          )}
        </>
      )}
    </Routes>
  );
};

export default AppRoutes;