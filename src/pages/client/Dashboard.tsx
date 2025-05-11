import { useEffect, useState } from 'react';
import { getMockShipments } from '../../services/shipmentService';
import { Shipment } from '../../types/shipment';
import { useAuth } from '../../contexts/AuthContext';
import { BarChart, Package, Truck, AlertTriangle } from 'lucide-react';
import ShipmentCard from '../../components/shipments/ShipmentCard';
import { Link } from 'react-router-dom';
import { useLanguage } from '../../contexts/LanguageContext';

const Dashboard = () => {
  const { user } = useAuth();
  const { t } = useLanguage();
  const [shipments, setShipments] = useState<Shipment[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchShipments = async () => {
      try {
        if (user) {
          const data = await getMockShipments(user.id);
          setShipments(data);
        }
      } catch (error) {
        console.error('Error fetching shipments:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchShipments();
  }, [user]);

  const activeShipments = shipments.filter(s => s.status !== 'delivered' && s.status !== 'draft');
  const issueShipments = shipments.filter(s => s.status === 'issue');
  const recentShipments = [...shipments].sort((a, b) => 
    new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()
  ).slice(0, 5);

  // Summary stats
  const inTransitCount = shipments.filter(s => s.status === 'in_transit').length;
  const inWarehouseCount = shipments.filter(s => s.status === 'warehouse').length;
  const totalShipments = shipments.length;
  const issuesCount = issueShipments.length;

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">{t('welcome')}, {user?.name}</h1>
        <p className="mt-1 text-gray-600">{t('hereIsOverview')}</p>
      </div>

      {isLoading ? (
        <div className="flex justify-center items-center h-64">
          <div className="spinner"></div>
        </div>
      ) : (
        <>
          {/* Stats */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
              <div className="flex items-center">
                <div className="p-3 rounded-full bg-blue-100 text-blue-600">
                  <Truck size={24} />
                </div>
                <div className="ml-4">
                  <h3 className="text-sm font-medium text-gray-500">{t('statsInTransit')}</h3>
                  <p className="text-3xl font-semibold text-gray-900">{inTransitCount}</p>
                </div>
              </div>
            </div>
            
            <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
              <div className="flex items-center">
                <div className="p-3 rounded-full bg-indigo-100 text-indigo-600">
                  <Package size={24} />
                </div>
                <div className="ml-4">
                  <h3 className="text-sm font-medium text-gray-500">{t('statsInWarehouse')}</h3>
                  <p className="text-3xl font-semibold text-gray-900">{inWarehouseCount}</p>
                </div>
              </div>
            </div>
            
            <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
              <div className="flex items-center">
                <div className="p-3 rounded-full bg-gray-100 text-gray-600">
                  <BarChart size={24} />
                </div>
                <div className="ml-4">
                  <h3 className="text-sm font-medium text-gray-500">{t('statsTotalShipments')}</h3>
                  <p className="text-3xl font-semibold text-gray-900">{totalShipments}</p>
                </div>
              </div>
            </div>
            
            <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
              <div className="flex items-center">
                <div className="p-3 rounded-full bg-red-100 text-red-600">
                  <AlertTriangle size={24} />
                </div>
                <div className="ml-4">
                  <h3 className="text-sm font-medium text-gray-500">{t('statsIssues')}</h3>
                  <p className="text-3xl font-semibold text-gray-900">{issuesCount}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Active Shipments */}
          <div className="mb-8">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-gray-900">{t('activeShipments')}</h2>
              <Link to="/shipments" className="text-sm font-medium text-blue-600 hover:text-blue-700">
                {t('viewAll')}
              </Link>
            </div>
            {activeShipments.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {activeShipments.slice(0, 3).map(shipment => (
                  <ShipmentCard key={shipment.id} shipment={shipment} />
                ))}
              </div>
            ) : (
              <p className="text-gray-500 bg-white p-6 rounded-lg border border-gray-200">
                {t('noActiveShipments')}
              </p>
            )}
          </div>

          {/* Recent Shipments */}
          <div>
            <h2 className="text-lg font-semibold text-gray-900 mb-4">{t('recentActivity')}</h2>
            <div className="bg-white overflow-hidden shadow-sm rounded-lg border border-gray-200">
              <ul className="divide-y divide-gray-200">
                {recentShipments.map((shipment) => (
                  <li key={shipment.id}>
                    <Link to={`/shipments/${shipment.id}`} className="block hover:bg-gray-50">
                      <div className="px-4 py-4 sm:px-6">
                        <div className="flex items-center justify-between">
                          <p className="text-sm font-medium text-blue-600 truncate">{shipment.reference}</p>
                          <div className="ml-2 flex-shrink-0 flex">
                            <p className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-blue-100 text-blue-800">
                              {shipment.origin} → {shipment.destination}
                            </p>
                          </div>
                        </div>
                        <div className="mt-2 sm:flex sm:justify-between">
                          <div className="sm:flex">
                            <p className="flex items-center text-sm text-gray-500">
                              {shipment.description.substring(0, 50)}
                              {shipment.description.length > 50 ? '...' : ''}
                            </p>
                          </div>
                          <div className="mt-2 flex items-center text-sm text-gray-500 sm:mt-0">
                            <div className="mr-2">
                              <svg className="flex-shrink-0 mr-1.5 h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                              </svg>
                            </div>
                            <p>{t('updatedOn')} {new Date(shipment.updatedAt).toLocaleDateString()}</p>
                          </div>
                        </div>
                      </div>
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default Dashboard;