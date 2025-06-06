import { useEffect, useState } from 'react';
import { getMockShipments } from '../../services/shipmentService';
import { Shipment } from '../../types/shipment';
import { useAuth } from '../../contexts/AuthContext';
import { useTheme } from '../../contexts/ThemeContext';
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
  const { theme } = useTheme();
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

  // Theme-aware classes
  const isDark = theme === 'dark';
  const bgPrimary = isDark ? 'bg-gray-900' : 'bg-white';
  const bgSecondary = isDark ? 'bg-gray-800' : 'bg-white';
  const textPrimary = isDark ? 'text-white' : 'text-gray-900';
  const textSecondary = isDark ? 'text-gray-300' : 'text-gray-600';
  const textMuted = isDark ? 'text-gray-400' : 'text-gray-500';
  const borderColor = isDark ? 'border-gray-700' : 'border-gray-200';
  const shadowClass = isDark ? 'shadow-gray-900/20' : 'shadow-sm';
  const hoverShadow = isDark ? 'hover:shadow-gray-900/30' : 'hover:shadow-md';

  return (
    <div className={`max-w-7xl mx-auto transition-opacity duration-700 ${isVisible ? 'opacity-100' : 'opacity-0'}`}>
      {/* Header with background image */}
      <div 
        className={`mb-8 rounded-xl p-6 ${shadowClass} transform transition-all duration-500 ${hoverShadow} hover:scale-[1.01] animate-fadeIn`}
        style={{
          backgroundImage: isDark 
            ? `linear-gradient(to right, rgba(17, 24, 39, 0.85), rgba(31, 41, 55, 0.85)), url(${backImage})`
            : `linear-gradient(to right, rgba(239, 246, 255, 0.85), rgba(224, 231, 255, 0.85)), url(${backImage})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat'
        }}
      >
        <div className="p-4">
          <h1 className={`text-2xl md:text-3xl font-bold ${textPrimary} flex items-center`}>
            {t('welcome')}, <span className="text-blue-400 ml-2">{user?.name}</span>
          </h1>
          <p className={`mt-2 ${textSecondary} text-lg`}>{t('hereIsOverview')}</p>
        </div>
      </div>

      {isLoading ? (
        <LoadingScreen />
      ) : (
        <>
          {/* Stats */}
          {/* Stats Section Redesignée */}
<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
  {[
    {
      icon: <Truck size={24} strokeWidth={2} />,
      iconBg: isDark ? "bg-blue-500/20" : "bg-blue-50",
      iconColor: "text-blue-500",
      title: t('statsInTransit'),
      value: inTransitCount,
      trend: <TrendingUp size={16} className="ml-2 text-blue-500" />,
      accentColor: "bg-gradient-to-r from-blue-500 to-blue-600"
    },
    {
      icon: <Package size={24} strokeWidth={2} />,
      iconBg: isDark ? "bg-blue-500/20" : "bg-blue-50",
      iconColor: "text-blue-500",
      title: t('statsInWarehouse'),
      value: inWarehouseCount,
      trend: <TrendingUp size={16} className="ml-2 text-blue-500" />,
      accentColor: "bg-gradient-to-r from-blue-500 to-indigo-600"
    },
    {
      icon: <BarChart size={24} strokeWidth={2} />,
      iconBg: isDark ? "bg-blue-500/20" : "bg-blue-50",
      iconColor: "text-blue-500",
      title: t('statsTotalShipments'),
      value: totalShipments,
      trend: <TrendingUp size={16} className="ml-2 text-blue-500" />,
      accentColor: "bg-gradient-to-r from-blue-600 to-cyan-500"
    },
    {
      icon: <AlertTriangle size={24} strokeWidth={2} />,
      iconBg: isDark ? "bg-blue-500/20" : "bg-blue-50",
      iconColor: issuesCount > 0 ? "text-red-500" : "text-blue-500",
      title: t('statsIssues'),
      value: issuesCount,
      trend: issuesCount > 0 && <span className="ml-2 animate-ping text-red-500">●</span>,
      accentColor: issuesCount > 0 
        ? "bg-gradient-to-r from-red-500 to-orange-500" 
        : "bg-gradient-to-r from-blue-500 to-purple-600"
    }
  ].map((stat, index) => (
    <div
      key={index}
      className={`${bgSecondary} rounded-xl ${shadowClass} border ${borderColor} ${hoverShadow} transition-all duration-300 transform hover:translate-y-[-2px] hover:scale-105 overflow-hidden group`}
      style={{
        animationName: 'fadeInUp',
        animationDuration: '0.5s',
        animationFillMode: 'both',
        animationDelay: `${index * 0.1}s`
      }}
    >
      {/* Accent bar en haut */}
      <div className={`h-1 ${stat.accentColor} transition-all duration-300 group-hover:h-2`}></div>
      
      {/* Contenu de la carte */}
      <div className="p-6">
        <div className="flex items-center justify-between mb-4">
          <div className={`p-3 rounded-xl ${stat.iconBg} ${stat.iconColor} shadow-sm transition-all duration-300 hover:shadow-lg hover:scale-110 group-hover:rotate-3`}>
            {stat.icon}
          </div>
          {stat.trend && (
            <div className="transition-all duration-300 group-hover:scale-110">
              {stat.trend}
            </div>
          )}
        </div>
        
        <div className="space-y-2">
          <h3 className={`text-sm font-medium ${textMuted} uppercase tracking-wide`}>
            {stat.title}
          </h3>
          <p className={`text-3xl font-bold ${textPrimary} transition-all duration-300 group-hover:scale-105`}>
            {stat.value}
          </p>
        </div>
      </div>
      
      {/* Effet de glow subtil au hover */}
      <div className={`absolute inset-0 opacity-0 group-hover:opacity-5 transition-opacity duration-300 pointer-events-none ${stat.accentColor.replace('bg-gradient-to-r', 'bg-gradient-to-br')}`}></div>
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
              <h2 className={`text-xl font-semibold ${textPrimary} flex items-center`}>
                <Truck size={20} className="mr-2 text-blue-500" />
                {t('activeShipments')}
              </h2>
              <Link 
                to="/shipments" 
                className={`flex items-center text-sm font-medium text-blue-500 hover:text-blue-400 ${isDark ? 'bg-blue-900/30 hover:bg-blue-900/50' : 'bg-blue-50 hover:bg-blue-100'} px-3 py-1.5 rounded-lg transition-colors hover:scale-105 transform duration-300`}
              >
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
              <div className={`${textMuted} ${bgSecondary} p-6 rounded-lg border ${borderColor} flex items-center justify-center transition-all duration-300 ${hoverShadow}`}>
                <Package size={20} className={`mr-2 ${isDark ? 'text-gray-500' : 'text-gray-400'}`} />
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
            <h2 className={`text-xl font-semibold ${textPrimary} mb-4 flex items-center`}>
              <Clock size={20} className="mr-2 text-blue-500" />
              {t('recentActivity')}
            </h2>
            <div className={`${bgSecondary} overflow-hidden ${shadowClass} rounded-xl border ${borderColor} transition-all duration-300 ${hoverShadow}`}>
              <ul className={`divide-y ${isDark ? 'divide-gray-700' : 'divide-gray-200'}`}>
                {recentShipments.map((shipment, index) => (
                  <li
                    key={shipment.id}
                    className={`${isDark ? 'hover:bg-gray-700/50' : 'hover:bg-blue-50'} transition-all duration-300`}
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
                          <p className="text-sm font-medium text-blue-500 truncate flex items-center">
                            <Package size={16} className="mr-2 flex-shrink-0 transition-transform duration-300 hover:rotate-12" />
                            {shipment.reference}
                          </p>
                          <div className="ml-2 flex-shrink-0 flex">
                            <p className={`px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${isDark ? 'bg-blue-900/50 text-blue-300' : 'bg-blue-100 text-blue-800'} items-center transition-all duration-300 ${isDark ? 'hover:bg-blue-900/70' : 'hover:bg-blue-200'}`}>
                              {shipment.origin}
                              <ArrowRightCircle size={12} className="mx-1 animate-pulse" />
                              {shipment.destination}
                            </p>
                          </div>
                        </div>
                        <div className="mt-2 sm:flex sm:justify-between">
                          <div className="sm:flex">
                            <p className={`flex items-center text-sm ${textMuted} line-clamp-1`}>
                              {shipment.description.substring(0, 50)}
                              {shipment.description.length > 50 ? '...' : ''}
                            </p>
                          </div>
                          <div className={`mt-2 flex items-center text-sm ${textMuted} sm:mt-0`}>
                            <Calendar size={16} className={`flex-shrink-0 mr-1.5 ${isDark ? 'text-gray-500' : 'text-gray-400'}`} />
                            <p>{t('updatedOn')} {new Date(shipment.updatedAt).toLocaleDateString()}</p>
                          </div>
                        </div>
                      </div>
                    </Link>
                  </li>
                ))}
              </ul>
              {recentShipments.length === 0 && (
                <div className={`p-6 text-center ${textMuted}`}>
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