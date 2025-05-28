import { useEffect, useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { useTheme } from '../../contexts/ThemeContext';
import { getMockShipments } from '../../services/shipmentService';
import { Shipment } from '../../types/shipment';
import { User, Package, TrendingUp, Clock, Calendar, PieChart, Key } from 'lucide-react';
import Status from '../../components/common/Status';
import { useLanguage } from '../../contexts/LanguageContext';
import LoadingScreen from '../../components/common/LoadingScreen';

const ProfilePage = () => {
  const { user } = useAuth();
  const { theme } = useTheme();
  const { t } = useLanguage();
  const [shipments, setShipments] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('overview');
  const [animateStats, setAnimateStats] = useState(false);
  const [animateCharts, setAnimateCharts] = useState(false);
  const [visibleItems, setVisibleItems] = useState(0);

  // Mock data for shipments if none are fetched
  const mockShipments = [
    { id: 1, trackingNumber: 'SHP12345678', status: 'delivered', createdAt: '2025-01-15T10:30:00Z' },
    { id: 2, trackingNumber: 'SHP23456789', status: 'intransit', createdAt: '2025-02-20T14:45:00Z' },
    { id: 3, trackingNumber: 'SHP34567890', status: 'processing', createdAt: '2025-03-05T09:15:00Z' },
    { id: 4, trackingNumber: 'SHP45678901', status: 'delivered', createdAt: '2025-03-12T16:20:00Z' },
    { id: 5, trackingNumber: 'SHP56789012', status: 'draft', createdAt: '2025-03-18T11:10:00Z' },
    { id: 6, trackingNumber: 'SHP67890123', status: 'delivered', createdAt: '2025-03-25T08:30:00Z' },
    { id: 7, trackingNumber: 'SHP78901234', status: 'intransit', createdAt: '2025-04-02T13:45:00Z' },
    { id: 8, trackingNumber: 'SHP89012345', status: 'delivered', createdAt: '2025-04-10T15:20:00Z' },
    { id: 9, trackingNumber: 'SHP90123456', status: 'cancelled', createdAt: '2025-04-15T10:00:00Z' },
    { id: 10, trackingNumber: 'SHP01234567', status: 'delivered', createdAt: '2025-04-22T09:30:00Z' },
    { id: 11, trackingNumber: 'SHP98765432', status: 'processing', createdAt: '2025-04-28T14:15:00Z' },
    { id: 12, trackingNumber: 'SHP87654321', status: 'intransit', createdAt: '2025-05-05T11:40:00Z' },
    { id: 13, trackingNumber: 'SHP76543210', status: 'delivered', createdAt: '2025-05-12T16:50:00Z' },
    { id: 14, trackingNumber: 'SHP65432109', status: 'delivered', createdAt: '2025-05-16T10:30:00Z' },
  ];

  useEffect(() => {
    const fetchShipments = async () => {
      try {
        if (user) {
          // Try to fetch real data first
          const data = await getMockShipments(user.id)
            .catch(() => {
              // If error or empty, use our mock data
              console.log('Using mock shipment data');
              return mockShipments;
            });
          setShipments(data.length > 0 ? data : mockShipments);
        } else {
          // No user, use mock data
          setShipments(mockShipments);
        }
      } catch (error) {
        console.error('Error fetching shipments:', error);
        // Fallback to mock data
        setShipments(mockShipments);
      } finally {
        setIsLoading(false);

        // Trigger animations after data is loaded
        setTimeout(() => setAnimateStats(true), 300);
        setTimeout(() => setAnimateCharts(true), 600);
      }
    };

    fetchShipments();
  }, [user]);

  // Animation for activity timeline
  useEffect(() => {
    if (!isLoading && shipments.length > 0) {
      const timer = setInterval(() => {
        setVisibleItems(prev => {
          const next = prev + 1;
          if (next >= Math.min(5, shipments.length)) {
            clearInterval(timer);
          }
          return next;
        });
      }, 200);

      return () => clearInterval(timer);
    }
  }, [isLoading, shipments]);

  // Calculate statistics
  const totalShipments = shipments.length;
  const completedShipments = shipments.filter(s => s.status === 'delivered').length;
  const activeShipments = shipments.filter(s => s.status !== 'delivered' && s.status !== 'draft').length;
  const completionRate = totalShipments ? (completedShipments / totalShipments * 100).toFixed(1) : 0;

  // Calculate monthly shipment counts for the chart
  const getMonthlyShipments = () => {
    // Create mock monthly data with proper distribution if no shipments
    if (shipments.length === 0) {
      return {
        0: 5,  // January
        1: 7,  // February
        2: 12, // March
        3: 18, // April
        4: 10, // May - current month at this point
        5: 8,  // June
        6: 15, // July
        7: 20, // August
        8: 16, // September
        9: 14, // October
        10: 11, // November
        11: 9   // December
      };
    }

    // Calculate from actual shipments data
    return shipments.reduce((acc, shipment) => {
      const month = new Date(shipment.createdAt).getMonth();
      acc[month] = (acc[month] || 0) + 1;
      return acc;
    }, {});
  };

  const monthlyShipments = getMonthlyShipments();

  // Status distribution
  const statusDistribution = shipments.reduce((acc, shipment) => {
    acc[shipment.status] = (acc[shipment.status] || 0) + 1;
    return acc;
  }, {});

  // Color palette for status bars
  const statusColors = {
    draft: 'bg-gray-400',
    processing: 'bg-blue-500',
    intransit: 'bg-amber-500',
    delivered: 'bg-green-500',
    cancelled: 'bg-red-500'
  };

  // Theme-aware styles
  const getThemeClasses = () => {
    const isDark = theme === 'dark';
    return {
      container: isDark ? 'bg-gray-900' : 'bg-gray-50',
      card: isDark ? 'bg-gray-800 shadow-gray-900/20' : 'bg-white shadow-md',
      cardHover: isDark ? 'hover:shadow-gray-900/40' : 'hover:shadow-lg',
      text: {
        primary: isDark ? 'text-gray-100' : 'text-gray-900',
        secondary: isDark ? 'text-gray-300' : 'text-gray-700',
        muted: isDark ? 'text-gray-400' : 'text-gray-500',
        accent: isDark ? 'text-blue-400' : 'text-blue-600'
      },
      border: isDark ? 'border-gray-700' : 'border-gray-200',
      gradient: isDark 
        ? 'bg-gradient-to-r from-blue-600 to-blue-800' 
        : 'bg-gradient-to-r from-blue-500 to-blue-900',
      gradientOverlay: isDark 
        ? 'bg-gradient-to-r from-blue-700 to-blue-900' 
        : 'bg-gradient-to-r from-blue-600 to-blue-800',
      chartBar: isDark ? 'bg-blue-500 hover:bg-blue-400' : 'bg-blue-400 hover:bg-blue-600',
      progressBg: isDark ? 'bg-gray-700' : 'bg-gray-100',
      tabActive: isDark ? 'border-blue-400 text-blue-400' : 'border-blue-500 text-blue-600',
      tabInactive: isDark 
        ? 'border-transparent text-gray-400 hover:text-gray-300 hover:border-gray-600' 
        : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
    };
  };

  const themeClasses = getThemeClasses();

  const renderMonthlyChart = () => {
    const maxCount = Math.max(...Object.values(monthlyShipments), 1);

    return (
      <div className="h-64">
        <div className="flex h-full items-end space-x-1 md:space-x-2">
          {Array.from({ length: 12 }).map((_, index) => {
            const count = monthlyShipments[index] || 0;
            const height = (count / maxCount) * 100;
            const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

            // Animation delay based on index
            const animationDelay = `${0.05 * index}s`;

            return (
              <div key={index} className="group relative flex-1 flex flex-col items-center">
                <div className={`absolute bottom-full mb-2 opacity-0 group-hover:opacity-100 transition-opacity ${
                  theme === 'dark' ? 'bg-gray-700 text-gray-200' : 'bg-gray-800 text-white'
                } text-xs rounded py-1 px-2 pointer-events-none`}>
                  {monthNames[index]}: {count}
                </div>
                <div
                  className={`w-full ${themeClasses.chartBar} transition-all duration-500 rounded-t flex justify-center items-end pt-1 pb-0 ${animateCharts ? 'animate-grow-up' : 'h-0'}`}
                  style={{
                    height: animateCharts ? `${Math.max(height, 5)}%` : '0%',
                    transitionDelay: animationDelay
                  }}
                >
                  <span className="text-xs text-white font-medium">{count > 0 ? count : ''}</span>
                </div>
              </div>
            );
          })}
        </div>
        <div className={`flex justify-between mt-2 text-xs ${themeClasses.text.muted}`}>
          {['J', 'F', 'M', 'A', 'M', 'J', 'J', 'A', 'S', 'O', 'N', 'D'].map((month, idx) => (
            <div key={month} className="text-center">{month}</div>
          ))}
        </div>
      </div>
    );
  };

  // Custom animation for tab switching
  const handleTabChange = (tab) => {
    // Reset animations when switching tabs
    setAnimateCharts(false);
    setAnimateStats(false);
    setVisibleItems(0);

    // Change tab
    setActiveTab(tab);

    // Trigger animations for new tab content
    setTimeout(() => setAnimateStats(true), 300);
    setTimeout(() => setAnimateCharts(true), 600);
  };

  // Pulsing loader animation
  if (isLoading) {
    return (
      <LoadingScreen />
    );
  }

  return (
    <div className={`min-h-screen  transition-colors duration-300`}>
        {/* Profile Header with Tabs - Fade in animation */}
        <div className={`${themeClasses.card} rounded-lg overflow-hidden mb-6 opacity-0 animate-fade-in transition-colors duration-300`}>
          <div className={`${themeClasses.gradient} px-6 py-8 sm:px-8 relative overflow-hidden`}>
            {/* Background animation */}
            <div className={`absolute inset-0 ${themeClasses.gradientOverlay} animate-pulse-slow opacity-50`}></div>

            <div className="flex flex-col sm:flex-row items-center relative z-10">
              <div className="h-24 w-24 rounded-full bg-white flex items-center justify-center p-1 border-4 border-white shadow-md transition-transform duration-300 hover:scale-110">
                {user?.avatar ? (
                  <img
                    src={user.avatar}
                    alt={user.name}
                    className="h-full w-full rounded-full object-cover"
                  />
                ) : (
                  <User className="h-12 w-12 text-blue-600" />
                )}
              </div>
              <div className="mt-4 sm:mt-0 sm:ml-6 text-center sm:text-left">
                <h2 className="text-2xl font-bold text-white animate-fade-in-up">
                  {user?.name}
                </h2>
                <p className="text-blue-100 animate-fade-in-up" style={{ animationDelay: '0.2s' }}>
                  {user?.email}
                </p>
                <p className="mt-1 text-sm text-blue-50 animate-fade-in-up" style={{ animationDelay: '0.3s' }}>
                  {t('member_since')} {new Date().getFullYear()}
                </p>
                {/* Affichage de l'identifiant utilisateur */}
                <div className="mt-2 flex items-center text-blue-50 animate-fade-in-up" style={{ animationDelay: '0.4s' }}>
                  <Key className="h-4 w-4 mr-1" />
                  <p className="text-sm">
                    <span className="font-mono"><b>{user?.identifiant || 'XXXXXXXXXXXXXXXXXXXXXXXXX'}</b></span>
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className={`${themeClasses.border} border-b`}>
            <nav className="flex -mb-px overflow-x-auto scrollbar-hide">
              <button
                onClick={() => handleTabChange('overview')}
                className={`whitespace-nowrap py-4 px-6 border-b-2 font-medium text-sm transition-all duration-300 ${
                  activeTab === 'overview'
                    ? themeClasses.tabActive
                    : themeClasses.tabInactive
                }`}
              >
                {t('overview')}
              </button>
              <button
                onClick={() => handleTabChange('analytics')}
                className={`whitespace-nowrap py-4 px-6 border-b-2 font-medium text-sm transition-all duration-300 ${
                  activeTab === 'analytics'
                    ? themeClasses.tabActive
                    : themeClasses.tabInactive
                }`}
              >
                {t('analytics')}
              </button>
            </nav>
          </div>
        </div>

        {activeTab === 'overview' && (
          <>
            {/* Statistics Cards - Staggered animation */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
              {[
                {
                  icon: <Package className="h-6 w-6 text-blue-600" />,
                  bgColor: theme === 'dark' ? 'bg-blue-900/50' : 'bg-blue-100',
                  label: t('totalShipments'),
                  value: totalShipments
                },
                {
                  icon: <TrendingUp className="h-6 w-6 text-green-600" />,
                  bgColor: theme === 'dark' ? 'bg-green-900/50' : 'bg-green-100',
                  label: t('completion_rate'),
                  value: `${completionRate}%`
                },
                {
                  icon: <Clock className="h-6 w-6 text-amber-600" />,
                  bgColor: theme === 'dark' ? 'bg-amber-900/50' : 'bg-amber-100',
                  label: t('active_shipments'),
                  value: activeShipments
                },
                {
                  icon: <Package className="h-6 w-6 text-purple-600" />,
                  bgColor: theme === 'dark' ? 'bg-purple-900/50' : 'bg-purple-100',
                  label: t('completed'),
                  value: completedShipments
                }
              ].map((item, index) => (
                <div
                  key={index}
                  className={`${themeClasses.card} ${themeClasses.cardHover} rounded-lg overflow-hidden transition-all duration-500 transform ${
                    animateStats ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
                  }`}
                  style={{ transitionDelay: `${0.1 * index}s` }}
                >
                  <div className="px-4 py-5 sm:p-6">
                    <div className="flex items-center">
                      <div className={`flex-shrink-0 ${item.bgColor} rounded-md p-3 transform transition-transform hover:scale-110 duration-300`}>
                        {item.icon}
                      </div>
                      <div className="ml-4">
                        <p className={`text-sm font-medium ${themeClasses.text.muted}`}>{item.label}</p>
                        <p className={`text-2xl font-semibold ${themeClasses.text.primary}`}>{item.value}</p>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Status Distribution - Animated bars */}
            <div className={`${themeClasses.card} rounded-lg p-6 mb-6 transform transition-all duration-500 ${
              animateCharts ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
            }`}>
              <div className="flex items-center justify-between mb-4">
                <h3 className={`text-lg font-medium ${themeClasses.text.primary}`}>{t('shipment_status_distribution')}</h3>
                <PieChart className={`h-5 w-5 ${themeClasses.text.muted} animate-pulse`} />
              </div>
              <div className="space-y-4">
                {Object.entries(statusDistribution).map(([status, count], index) => {
                  const percentage = ((count / totalShipments) * 100).toFixed(1);
                  return (
                    <div key={status} className="flex flex-col sm:flex-row sm:items-center">
                      <div className="flex items-center mb-2 sm:mb-0">
                        <Status status={status} size="sm" className="w-24" />
                        <span className={`ml-2 text-sm font-medium ${themeClasses.text.secondary}`}>{percentage}%</span>
                      </div>
                      <div className="flex-1 sm:ml-4">
                        <div className={`h-3 ${themeClasses.progressBg} rounded-full overflow-hidden`}>
                          <div
                            className={`h-full rounded-full ${statusColors[status] || 'bg-blue-600'} transition-all duration-1000 ease-out`}
                            style={{
                              width: animateCharts ? `${percentage}%` : '0%',
                              transitionDelay: `${0.1 * index}s`
                            }}
                          />
                        </div>
                      </div>
                      <span className={`mt-1 sm:mt-0 sm:ml-4 text-sm ${themeClasses.text.muted}`}>{count}</span>
                    </div>
                  );
                })}
              </div>
            </div>
          </>
        )}

        {activeTab === 'analytics' && (
          <>
            {/* Monthly Shipments Chart with animation */}
            <div className={`${themeClasses.card} rounded-lg p-6 mb-6 transform transition-all duration-500 ${
              animateStats ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
            }`}>
              <div className="flex items-center justify-between mb-4">
                <h3 className={`text-lg font-medium ${themeClasses.text.primary}`}>{t('monthly_shipments')}</h3>
                <Calendar className={`h-5 w-5 ${themeClasses.text.muted} animate-pulse`} />
              </div>
              {renderMonthlyChart()}
              <div className={`mt-4 text-sm ${themeClasses.text.muted} text-center`}>
                {t('last_12_months')}
              </div>
            </div>

            {/* Advanced Analytics with animations */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
              {/* Delivery Performance */}
              <div className={`${themeClasses.card} rounded-lg p-6 transform transition-all duration-500 ${
                animateCharts ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
              }`} style={{ transitionDelay: '0.2s' }}>
                <h3 className={`text-lg font-medium ${themeClasses.text.primary} mb-4`}>{t('delivery_performance')}</h3>
                <div className="space-y-4">
                  {[
                    { label: t('avg_delivery_time'), value: `3.2 ${t('days')}`, percentage: 80, color: 'bg-blue-600' },
                    { label: t('on_time_delivery'), value: '92%', percentage: 92, color: 'bg-green-600' },
                    { label: t('delayed_shipments'), value: '5%', percentage: 5, color: 'bg-amber-600' },
                    { label: t('cancelled'), value: '3%', percentage: 3, color: 'bg-red-600' }
                  ].map((item, index) => (
                    <div key={index}>
                      <div className="flex justify-between mb-1">
                        <span className={`text-sm font-medium ${themeClasses.text.secondary}`}>{item.label}</span>
                        <span className={`text-sm font-medium ${
                          item.color === 'bg-blue-600' ? (theme === 'dark' ? 'text-blue-400' : 'text-blue-600') :
                          item.color === 'bg-green-600' ? (theme === 'dark' ? 'text-green-400' : 'text-green-600') :
                          item.color === 'bg-amber-600' ? (theme === 'dark' ? 'text-amber-400' : 'text-amber-600') : 
                          (theme === 'dark' ? 'text-red-400' : 'text-red-600')
                        }`}>{item.value}</span>
                      </div>
                      <div className={`h-2 ${themeClasses.progressBg} rounded-full`}>
                        <div
                          className={`h-2 ${item.color} rounded-full transition-all duration-1000 ease-out`}
                          style={{
                            width: animateCharts ? `${item.percentage}%` : '0%',
                            transitionDelay: `${0.2 + (0.1 * index)}s`
                          }}
                        ></div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Shipping Destinations */}
              <div className={`${themeClasses.card} rounded-lg p-6 transform transition-all duration-500 ${
                animateCharts ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
              }`} style={{ transitionDelay: '0.4s' }}>
                <h3 className={`text-lg font-medium ${themeClasses.text.primary} mb-4`}>{t('shipping_destinations')}</h3>
                <div className="space-y-4">
                  {[
                    { location: 'Paris', percentage: 35 },
                    { location: 'Lyon', percentage: 25 },
                    { location: 'Marseille', percentage: 20 },
                    { location: 'Bordeaux', percentage: 15 },
                    { location: t('other'), percentage: 5 }
                  ].map((item, index) => (
                    <div key={index} className="flex justify-between items-center">
                      <span className={`text-sm font-medium ${themeClasses.text.secondary}`}>{item.location}</span>
                      <div className="flex-1 mx-4">
                        <div className={`h-2 ${themeClasses.progressBg} rounded-full`}>
                          <div
                            className="h-2 bg-blue-600 rounded-full transition-all duration-1000 ease-out"
                            style={{
                              width: animateCharts ? `${item.percentage}%` : '0%',
                              transitionDelay: `${0.4 + (0.1 * index)}s`
                            }}
                          ></div>
                        </div>
                      </div>
                      <span className={`text-sm ${themeClasses.text.muted}`}>{item.percentage}%</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Activity Timeline with staggered animation */}
            <div className={`${themeClasses.card} rounded-lg p-6`}>
              <h3 className={`text-lg font-medium ${themeClasses.text.primary} mb-4`}>{t('recent_activity')}</h3>
              <div className="flow-root">
                <ul className={`divide-y ${theme === 'dark' ? 'divide-gray-700' : 'divide-gray-200'}`}>
                  {shipments.slice(0, 5).map((shipment, index) => (
                    <li key={index} className="py-4">
                      <div className="flex items-center space-x-4">
                        <div className={`flex-shrink-0 h-10 w-10 rounded-full flex items-center justify-center ${
                          shipment.status === 'delivered' ? (theme === 'dark' ? 'bg-green-900/50' : 'bg-green-100') :
                          shipment.status === 'intransit' ? (theme === 'dark' ? 'bg-amber-900/50' : 'bg-amber-100') :
                          shipment.status === 'cancelled' ? (theme === 'dark' ? 'bg-red-900/50' : 'bg-red-100') : 
                          (theme === 'dark' ? 'bg-blue-900/50' : 'bg-blue-100')
                        }`}>
                          <Package className={`h-5 w-5 ${
                            shipment.status === 'delivered' ? (theme === 'dark' ? 'text-green-400' : 'text-green-600') :
                            shipment.status === 'intransit' ? (theme === 'dark' ? 'text-amber-400' : 'text-amber-600') :
                            shipment.status === 'cancelled' ? (theme === 'dark' ? 'text-red-400' : 'text-red-600') : 
                            (theme === 'dark' ? 'text-blue-400' : 'text-blue-600')
                          }`} />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className={`text-sm font-medium ${themeClasses.text.primary} truncate`}>
                            {shipment.trackingNumber}
                          </p>
                          <Status status={shipment.status} size="sm" />
                        </div>
                        <div className={`text-right text-sm ${themeClasses.text.muted}`}>
                          <p>{new Date(shipment.createdAt).toLocaleDateString()}</p>
                        </div>
                      </div>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </>
        )}

                {/* Add global CSS for animations */}
        <style jsx global>{`
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

          @keyframes fadeIn {
            from { opacity: 0; }
            to { opacity: 1; }
          }

          @keyframes growUp {
            from { height: 0; }
            to { height: 100%; }
          }

          @keyframes pulseSlow {
            0%, 100% { opacity: 0.5; }
            50% { opacity: 0.7; }
          }

          .animate-fade-in-up {
            animation: fadeInUp 0.6s ease-out forwards;
          }

          .animate-fade-in {
            animation: fadeIn 0.8s ease-out forwards;
          }

          .animate-grow-up {
            animation: growUp 1s ease-out forwards;
          }

          .animate-pulse-slow {
            animation: pulseSlow 3s ease-in-out infinite;
          }
        `}</style>
    </div>
  );
};

export default ProfilePage;