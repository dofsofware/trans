import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import LoginPage from '../pages/LoginPage';
import ClientDashboard from '../pages/client/Dashboard';
import ClientShipments from '../pages/client/Shipments';
import ShipmentDetails from '../pages/client/ShipmentDetails';
import DocumentsPage from '../pages/client/Documents';
import MessagesPage from '../pages/client/Messages';
import PaymentsPage from '../pages/client/Payments';
import AgentDashboard from '../pages/agent/Dashboard';
import AgentShipments from '../pages/agent/Shipments';
import AgentShipmentDetails from '../pages/agent/ShipmentDetails';
import ClientsPage from '../pages/agent/Clients';
import NewClientPage from '../pages/agent/NewClient';
import EditClientPage from '../pages/agent/EditClient';
import ClientDetailsPage from '../pages/agent/ClientDetails';
import TransitFilesPage from '../pages/agent/TransitFiles';
import Layout from '../components/layout/Layout';
import LoadingScreen from '../components/common/LoadingScreen';
import SettingsPage from '../pages/client/Settings';
import ProfilePage from '../pages/client/Profile';
import NotificationsPage from '../pages/client/Notifications';
import InvoicesPage from '../pages/client/Invoices';
import InvoiceDetails from '../pages/client/InvoiceDetails';
import ForgotPasswordPage from '../pages/ForgotPasswordPage';
import ResetPasswordPage from '../pages/ResetPasswordPage';

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
          <Route path="/forgot-password" element={<ForgotPasswordPage />} />
          <Route path="/reset-password" element={<ResetPasswordPage />} />
          <Route path="*" element={<Navigate to="/login" replace />} />
        </>
      ) : (
        <>
          {user?.role === 'client' ? (
            <Route element={<Layout />}>
              <Route path="/" element={<ClientDashboard />} />
              <Route path="/shipments" element={<ClientShipments />} />
              <Route path="/shipments/:id" element={<ShipmentDetails />} />
              <Route path="/documents" element={<DocumentsPage />} />
              <Route path="/messages" element={<MessagesPage />} />
              <Route path="/payments" element={<PaymentsPage />} />
              <Route path="/settings" element={<SettingsPage />} />
              <Route path="/profile" element={<ProfilePage />} />
              <Route path="/notifications" element={<NotificationsPage />} />
              <Route path="/invoices" element={<InvoicesPage />} />
              <Route path="/invoices/:id" element={<InvoiceDetails />} />
              <Route path="*" element={<Navigate to="/" replace />} />
            </Route>
          ) : (
            <Route element={<Layout />}>
              <Route path="/" element={<AgentDashboard />} />
              <Route path="/shipments" element={<AgentShipments />} />
              <Route path="/shipments/:id" element={<AgentShipmentDetails />} />
              <Route path="/transit-files" element={<TransitFilesPage />} />
              <Route path="/clients" element={<ClientsPage />} />
              <Route path="/clients/new-client" element={<NewClientPage />} />
              <Route path="/clients/:clientId" element={<ClientDetailsPage />} />
              <Route path="/clients/:clientId/edit" element={<EditClientPage />} />
              <Route path="/messages" element={<MessagesPage />} />
              <Route path="*" element={<Navigate to="/" replace />} />
            </Route>
          )}
        </>
      )}
    </Routes>
  );
};

export default AppRoutes;