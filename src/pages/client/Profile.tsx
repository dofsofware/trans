import { useEffect, useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { getMockShipments } from '../../services/shipmentService';
import { Shipment } from '../../types/shipment';
import { User, Package, TrendingUp, Clock } from 'lucide-react';
import Status from '../../components/common/Status';
import { useLanguage } from '../../contexts/LanguageContext';

const ProfilePage = () => {
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

  // Calculate statistics
  const totalShipments = shipments.length;
  const completedShipments = shipments.filter(s => s.status === 'delivered').length;
  const activeShipments = shipments.filter(s => s.status !== 'delivered' && s.status !== 'draft').length;
  const completionRate = totalShipments ? (completedShipments / totalShipments * 100).toFixed(1) : 0;

  // Calculate monthly shipment counts for the chart
  const monthlyShipments = shipments.reduce((acc, shipment) => {
    const month = new Date(shipment.createdAt).getMonth();
    acc[month] = (acc[month] || 0) + 1;
    return acc;
  }, {} as Record<number, number>);

  // Status distribution
  const statusDistribution = shipments.reduce((acc, shipment) => {
    acc[shipment.status] = (acc[shipment.status] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">{t('profile')}</h1>
        <p className="mt-1 text-gray-600">{t('view_profile_analytics')}</p>
      </div>

      {/* Profile Card */}
      <div className="bg-white shadow rounded-lg mb-8">
        <div className="px-4 py-5 sm:p-6">
          <div className="flex items-center">
            <div className="h-20 w-20 rounded-full bg-blue-100 flex items-center justify-center">
              {user?.avatar ? (
                <img
                  src={user.avatar}
                  alt={user.name}
                  className="h-20 w-20 rounded-full"
                />
              ) : (
                <User className="h-10 w-10 text-blue-600" />
              )}
            </div>
            <div className="ml-6">
              <h2 className="text-2xl font-bold text-gray-900">{user?.name}</h2>
              <p className="text-gray-600">{user?.email}</p>
              <p className="mt-1 text-sm text-gray-500">{t('member_since')} {new Date().getFullYear()}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Statistics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <Package className="h-8 w-8 text-blue-600" />
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500">{t('totalShipments')}</p>
              <p className="text-2xl font-semibold text-gray-900">{totalShipments}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <TrendingUp className="h-8 w-8 text-green-600" />
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500">{t('completion_rate')}</p>
              <p className="text-2xl font-semibold text-gray-900">{completionRate}%</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <Clock className="h-8 w-8 text-amber-600" />
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500">{t('active_shipments')}</p>
              <p className="text-2xl font-semibold text-gray-900">{activeShipments}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <Package className="h-8 w-8 text-purple-600" />
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500">{t('completed')}</p>
              <p className="text-2xl font-semibold text-gray-900">{completedShipments}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Monthly Shipments Chart */}
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-medium text-gray-900 mb-4">{t('monthly_shipments')}</h3>
          <div className="h-64">
            <div className="flex h-full items-end space-x-2">
              {Array.from({ length: 12 }).map((_, index) => {
                const count = monthlyShipments[index] || 0;
                const maxCount = Math.max(...Object.values(monthlyShipments));
                const height = maxCount ? (count / maxCount) * 100 : 0;
                
                return (
                  <div
                    key={index}
                    className="flex-1 bg-blue-100 rounded-t"
                    style={{ height: `${height}%` }}
                  >
                    <div className="px-2 py-1 text-xs text-center">
                      {count}
                    </div>
                  </div>
                );
              })}
            </div>
            <div className="flex justify-between mt-2 text-xs text-gray-500">
              {['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'].map(month => (
                <div key={month} className="text-center">{month}</div>
              ))}
            </div>
          </div>
        </div>

        {/* Status Distribution */}
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-medium text-gray-900 mb-4">{t('shipment_status_distribution')}</h3>
          <div className="space-y-4">
            {Object.entries(statusDistribution).map(([status, count]) => (
              <div key={status} className="flex items-center">
                <Status status={status as any} size="sm" className="w-24" />
                <div className="flex-1 ml-4">
                  <div className="h-4 bg-gray-100 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-blue-600 rounded-full"
                      style={{
                        width: `${(count / totalShipments) * 100}%`
                      }}
                    />
                  </div>
                </div>
                <span className="ml-4 text-sm text-gray-600">{count}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;