import { useEffect, useState } from 'react';
import { getMockShipments } from '../../services/shipmentService';
import { Shipment } from '../../types/shipment';
import { useAuth } from '../../contexts/AuthContext';
import {
  BarChart,
  Package,
  Truck,
  AlertTriangle,
  ChevronRight,
  Calendar,
  ArrowRightCircle,
  Clock,
  TrendingUp
} from 'lucide-react';
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
    <div className="max-w-7xl mx-auto">
      <div className="mb-8 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl p-6 shadow-sm">
        <h1 className="text-2xl md:text-3xl font-bold text-gray-900 flex items-center">
          {t('welcome')}, <span className="text-blue-700 ml-2">{user?.name}</span>
        </h1>
        <p className="mt-2 text-gray-600 text-lg">{t('hereIsOverview')}</p>
      </div>

      {isLoading ? (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-blue-600"></div>
        </div>
      ) : (
        <>
          {/* Stats */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200 hover:shadow-md transition-shadow duration-300 transform hover:translate-y-[-2px]">
              <div className="flex items-center">
                <div className="p-3 rounded-full bg-blue-100 text-blue-600 shadow-sm">
                  <Truck size={24} strokeWidth={2} />
                </div>
                <div className="ml-4">
                  <h3 className="text-sm font-medium text-gray-500">{t('statsInTransit')}</h3>
                  <div className="flex items-baseline">
                    <p className="text-3xl font-semibold text-gray-900">{inTransitCount}</p>
                    <TrendingUp size={16} className="ml-2 text-blue-500" />
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200 hover:shadow-md transition-shadow duration-300 transform hover:translate-y-[-2px]">
              <div className="flex items-center">
                <div className="p-3 rounded-full bg-indigo-100 text-indigo-600 shadow-sm">
                  <Package size={24} strokeWidth={2} />
                </div>
                <div className="ml-4">
                  <h3 className="text-sm font-medium text-gray-500">{t('statsInWarehouse')}</h3>
                  <div className="flex items-baseline">
                    <p className="text-3xl font-semibold text-gray-900">{inWarehouseCount}</p>
                    <TrendingUp size={16} className="ml-2 text-indigo-500" />
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200 hover:shadow-md transition-shadow duration-300 transform hover:translate-y-[-2px]">
              <div className="flex items-center">
                <div className="p-3 rounded-full bg-gray-100 text-gray-600 shadow-sm">
                  <BarChart size={24} strokeWidth={2} />
                </div>
                <div className="ml-4">
                  <h3 className="text-sm font-medium text-gray-500">{t('statsTotalShipments')}</h3>
                  <div className="flex items-baseline">
                    <p className="text-3xl font-semibold text-gray-900">{totalShipments}</p>
                    <TrendingUp size={16} className="ml-2 text-gray-500" />
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200 hover:shadow-md transition-shadow duration-300 transform hover:translate-y-[-2px]">
              <div className="flex items-center">
                <div className="p-3 rounded-full bg-red-100 text-red-600 shadow-sm">
                  <AlertTriangle size={24} strokeWidth={2} />
                </div>
                <div className="ml-4">
                  <h3 className="text-sm font-medium text-gray-500">{t('statsIssues')}</h3>
                  <div className="flex items-baseline">
                    <p className="text-3xl font-semibold text-gray-900">{issuesCount}</p>
                    {issuesCount > 0 && <span className="ml-2 animate-pulse text-red-500">●</span>}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Active Shipments */}
          <div className="mb-8">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-semibold text-gray-900 flex items-center">
                <Truck size={20} className="mr-2 text-blue-600" />
                {t('activeShipments')}
              </h2>
              <Link to="/shipments" className="flex items-center text-sm font-medium text-blue-600 hover:text-blue-800 bg-blue-50 hover:bg-blue-100 px-3 py-1.5 rounded-lg transition-colors">
                {t('viewAll')}
                <ChevronRight size={16} className="ml-1" />
              </Link>
            </div>
            {activeShipments.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {activeShipments.slice(0, 3).map(shipment => (
                  <ShipmentCard key={shipment.id} shipment={shipment} />
                ))}
              </div>
            ) : (
              <div className="text-gray-500 bg-white p-6 rounded-lg border border-gray-200 flex items-center justify-center">
                <Package size={20} className="mr-2 text-gray-400" />
                <p>{t('noActiveShipments')}</p>
              </div>
            )}
          </div>

          {/* Recent Shipments */}
          <div>
            <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
              <Clock size={20} className="mr-2 text-blue-600" />
              {t('recentActivity')}
            </h2>
            <div className="bg-white overflow-hidden shadow-sm rounded-xl border border-gray-200">
              <ul className="divide-y divide-gray-200">
                {recentShipments.map((shipment) => (
                  <li key={shipment.id} className="hover:bg-blue-50 transition-colors duration-200">
                    <Link to={`/shipments/${shipment.id}`} className="block">
                      <div className="px-4 py-4 sm:px-6">
                        <div className="flex items-center justify-between">
                          <p className="text-sm font-medium text-blue-600 truncate flex items-center">
                            <Package size={16} className="mr-2 flex-shrink-0" />
                            {shipment.reference}
                          </p>
                          <div className="ml-2 flex-shrink-0 flex">
                            <p className="px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full bg-blue-100 text-blue-800 items-center">
                              {shipment.origin}
                              <ArrowRightCircle size={12} className="mx-1" />
                              {shipment.destination}
                            </p>
                          </div>
                        </div>
                        <div className="mt-2 sm:flex sm:justify-between">
                          <div className="sm:flex">
                            <p className="flex items-center text-sm text-gray-500 line-clamp-1">
                              {shipment.description.substring(0, 50)}
                              {shipment.description.length > 50 ? '...' : ''}
                            </p>
                          </div>
                          <div className="mt-2 flex items-center text-sm text-gray-500 sm:mt-0">
                            <Calendar size={16} className="flex-shrink-0 mr-1.5 text-gray-400" />
                            <p>{t('updatedOn')} {new Date(shipment.updatedAt).toLocaleDateString()}</p>
                          </div>
                        </div>
                      </div>
                    </Link>
                  </li>
                ))}
              </ul>
              {recentShipments.length === 0 && (
                <div className="p-6 text-center text-gray-500">
                  <p>{t('noRecentActivity')}</p>
                </div>
              )}
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default Dashboard;