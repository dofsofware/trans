import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar';
import Header from './Header';
import { useAuth } from '../../contexts/AuthContext';
import { useState, useEffect } from 'react';
import { ChevronLeft } from 'lucide-react';

const Layout = () => {
  const { user } = useAuth();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  
  // Set initial state based on screen size
  useEffect(() => {
    const handleResize = () => {
      setSidebarOpen(window.innerWidth >= 1024);
    };
    
    // Set initial state
    handleResize();
    
    // Add event listener
    window.addEventListener('resize', handleResize);
    
    // Cleanup
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const toggleSidebar = () => {
    setSidebarOpen(prev => !prev);
  };

  const closeSidebarOnMobile = () => {
    if (window.innerWidth < 1024) {
      setSidebarOpen(false);
    }
  };

  if (!user) return null;

  return (
    <div className="flex h-screen bg-gray-50 dark:bg-gray-900 overflow-hidden">
      {/* Sidebar */}
      <div 
        className={`
          fixed inset-y-0 left-0 z-30 w-64 bg-blue-900 dark:bg-gray-800 transform transition-transform duration-300 ease-in-out 
          ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}
        `}
      >
        <Sidebar role={user.role} onNavigate={closeSidebarOnMobile} />
        <button
          onClick={toggleSidebar}
          className="absolute -right-9 top-1/4 -transform translate-y-1/2 bg-blue-900 dark:bg-gray-800 text-white p-2 rounded-r-md"
          aria-label="Toggle sidebar"
        >
          <ChevronLeft size={20} className={`transform transition-transform duration-300 ${sidebarOpen ? '' : 'rotate-180'}`} />
        </button>
      </div>

      {/* Overlay for mobile */}
      {sidebarOpen && (
        <div 
          className="fixed inset-0 bg-gray-600 bg-opacity-50 backdrop-blur-sm z-20 lg:hidden"
          onClick={closeSidebarOnMobile}
        />
      )}

      {/* Main content */}
      <div className={`flex flex-col flex-1 w-full overflow-hidden transition-all duration-300 ${sidebarOpen ? 'lg:ml-64' : ''}`}>
        <Header toggleSidebar={toggleSidebar} user={user} />
        <main className="flex-1 overflow-auto bg-gray-50 dark:bg-gray-700 p-4 md:p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default Layout;