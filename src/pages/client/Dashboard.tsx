import { useEffect, useState } from 'react';
import { getMockShipments } from '../../services/shipmentService';
import { Shipment } from '../../types/shipment';
import { useAuth } from '../../contexts/AuthContext';
import LoadingScreen from '../../components/common/LoadingScreen';
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
import backImage from '../../utils/backGround_hearder.png';

const Dashboard = () => {
  const { user } = useAuth();
  const { t } = useLanguage();
  const [shipments, setShipments] = useState<Shipment[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isVisible, setIsVisible] = useState(false);

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
        // Trigger animation for the entire dashboard after data is loaded
        setTimeout(() => setIsVisible(true), 100);
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
    <div className={`max-w-7xl mx-auto transition-opacity duration-700 ${isVisible ? 'opacity-100' : 'opacity-0'}`}>
      {/* Header with background image */}
      <div 
        className="mb-8 rounded-xl p-6 shadow-sm transform transition-all duration-500 hover:shadow-md hover:scale-[1.01] animate-fadeIn"
        style={{
          backgroundImage: `linear-gradient(to right, rgba(239, 246, 255, 0.85), rgba(224, 231, 255, 0.85)), url(${backImage})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat'
        }}
      >
        <div className="p-4">
          <h1 className="text-2xl md:text-3xl font-bold text-gray-900 flex items-center">
            {t('welcome')}, <span className="text-blue-700 ml-2">{user?.name}</span>
          </h1>
          <p className="mt-2 text-gray-600 text-lg">{t('hereIsOverview')}</p>
        </div>
      </div>

      {isLoading ? (
        <LoadingScreen />
      ) : (
        <>
          {/* Stats */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            {[
              {
                icon: <Truck size={24} strokeWidth={2}  />,
                bgColor: "bg-blue-100",
                textColor: "text-blue-600",
                title: t('statsInTransit'),
                value: inTransitCount,
                trend: <TrendingUp size={16} className="ml-2 text-blue-500" />
              },
              {
                icon: <Package size={24} strokeWidth={2}  />,
                bgColor: "bg-indigo-100",
                textColor: "text-indigo-600",
                title: t('statsInWarehouse'),
                value: inWarehouseCount,
                trend: <TrendingUp size={16} className="ml-2 text-indigo-500" />
              },
              {
                icon: <BarChart size={24} strokeWidth={2}  />,
                bgColor: "bg-gray-100",
                textColor: "text-gray-600",
                title: t('statsTotalShipments'),
                value: totalShipments,
                trend: <TrendingUp size={16} className="ml-2 text-gray-500" />
              },
              {
                icon: <AlertTriangle size={24} strokeWidth={2} />,
                bgColor: "bg-red-100",
                textColor: "text-red-600",
                title: t('statsIssues'),
                value: issuesCount,
                trend: issuesCount > 0 && <span className="ml-2 animate-ping text-red-500">●</span>
              }
            ].map((stat, index) => (
              <div
                key={index}
                className="bg-white p-6 rounded-xl shadow-sm border border-gray-200 hover:shadow-md transition-all duration-300 transform hover:translate-y-[-2px] hover:scale-105"
                style={{
                  animationName: 'fadeInUp',
                  animationDuration: '0.5s',
                  animationFillMode: 'both',
                  animationDelay: `${index * 0.1}s`
                }}
              >
                <div className="flex items-center">
                  <div className={`p-3 rounded-full ${stat.bgColor} ${stat.textColor} shadow-sm transition-all duration-300 hover:shadow-lg hover:scale-110`}>
                    {stat.icon}
                  </div>
                  <div className="ml-4">
                    <h3 className="text-sm font-medium text-gray-500">{stat.title}</h3>
                    <div className="flex items-baseline">
                      <p className="text-3xl font-semibold text-gray-900">{stat.value}</p>
                      {stat.trend}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Active Shipments */}
          <div
            className="mb-8"
            style={{
              animationName: 'fadeInLeft',
              animationDuration: '0.6s',
              animationFillMode: 'both',
              animationDelay: '0.3s'
            }}
          >
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-semibold text-gray-900 flex items-center">
                <Truck size={20} className="mr-2 text-blue-600" />
                {t('activeShipments')}
              </h2>
              <Link to="/shipments" className="flex items-center text-sm font-medium text-blue-600 hover:text-blue-800 bg-blue-50 hover:bg-blue-100 px-3 py-1.5 rounded-lg transition-colors hover:scale-105 transform duration-300">
                {t('viewAll')}
                <ChevronRight size={16} className="ml-1 transition-transform duration-300 group-hover:translate-x-1" />
              </Link>
            </div>
            {activeShipments.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {activeShipments.slice(0, 3).map((shipment, index) => (
                  <div
                    key={shipment.id}
                    style={{
                      animationName: 'fadeInUp',
                      animationDuration: '0.5s',
                      animationFillMode: 'both',
                      animationDelay: `${index * 0.15 + 0.4}s`
                    }}
                    className="transform transition-all duration-300 hover:scale-105"
                  >
                    <ShipmentCard shipment={shipment} />
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-gray-500 bg-white p-6 rounded-lg border border-gray-200 flex items-center justify-center transition-all duration-300 hover:shadow-md">
                <Package size={20} className="mr-2 text-gray-400" />
                <p>{t('noActiveShipments')}</p>
              </div>
            )}
          </div>

          {/* Recent Shipments */}
          <div
            style={{
              animationName: 'fadeInRight',
              animationDuration: '0.6s',
              animationFillMode: 'both',
              animationDelay: '0.5s'
            }}
          >
            <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
              <Clock size={20} className="mr-2 text-blue-600" />
              {t('recentActivity')}
            </h2>
            <div className="bg-white overflow-hidden shadow-sm rounded-xl border border-gray-200 transition-all duration-300 hover:shadow-md">
              <ul className="divide-y divide-gray-200">
                {recentShipments.map((shipment, index) => (
                  <li
                    key={shipment.id}
                    className="hover:bg-blue-50 transition-all duration-300"
                    style={{
                      animationName: 'fadeIn',
                      animationDuration: '0.5s',
                      animationFillMode: 'both',
                      animationDelay: `${index * 0.1 + 0.6}s`
                    }}
                  >
                    <Link to={`/shipments/${shipment.id}`} className="block">
                      <div className="px-4 py-4 sm:px-6 transition-all duration-300 hover:translate-x-1">
                        <div className="flex items-center justify-between">
                          <p className="text-sm font-medium text-blue-600 truncate flex items-center">
                            <Package size={16} className="mr-2 flex-shrink-0 transition-transform duration-300 hover:rotate-12" />
                            {shipment.reference}
                          </p>
                          <div className="ml-2 flex-shrink-0 flex">
                            <p className="px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full bg-blue-100 text-blue-800 items-center transition-all duration-300 hover:bg-blue-200">
                              {shipment.origin}
                              <ArrowRightCircle size={12} className="mx-1 animate-pulse" />
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

      {/* Add CSS animations */}
      <style jsx global>{`
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }

        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes fadeInLeft {
          from {
            opacity: 0;
            transform: translateX(-20px);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }

        @keyframes fadeInRight {
          from {
            opacity: 0;
            transform: translateX(20px);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }

        .animate-fadeIn {
          animation: fadeIn 0.5s ease-in-out;
        }

        .animate-spin {
          animation: spin 3s linear infinite;
        }

        .animate-slow {
          animation-duration: 6s !important;
        }

        .animate-ping {
          animation: ping 1.5s cubic-bezier(0, 0, 0.2, 1) infinite;
        }

        @keyframes ping {
          75%, 100% {
            transform: scale(2);
            opacity: 0;
          }
        }

        @keyframes spin {
          from {
            transform: rotate(0deg);
          }
          to {
            transform: rotate(360deg);
          }
        }
      `}</style>
    </div>
  );
};

export default Dashboard;