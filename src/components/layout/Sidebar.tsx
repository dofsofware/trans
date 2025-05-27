import { Link, useLocation } from 'react-router-dom';
import { UserRole } from '../../types/user';
import { useLanguage } from '../../contexts/LanguageContext';
import { useTheme } from '../../contexts/ThemeContext';
import {
  Home,
  Package,
  FileText,
  MessageSquare,
  CreditCard,
  Users,
  BarChart,
  Settings,
  Clipboard,
  TruckIcon,
  AlertTriangle,
  Receipt
} from 'lucide-react';
import { cn } from '../../utils/cn';

// Import des images de logo
import lightModeLogo from '../../utils/ShipTrack_light_mode_2.png';
import darkModeLogo from '../../utils/ShipTrack_dark_mode.png';
import backgroundImage from '../../utils/back.png';

interface SidebarProps {
  role: UserRole;
  onNavigate?: () => void;
}

// Extending the link interface to include the unread message count
interface NavLink {
  name: string;
  to: string;
  icon: React.FC<React.SVGProps<SVGSVGElement>>;
  unreadCount?: number;
}

const Sidebar = ({ role, onNavigate }: SidebarProps) => {
  const location = useLocation();
  const { t } = useLanguage();
  const { theme } = useTheme();
  const isActive = (path: string) => location.pathname === path;

  const clientLinks: NavLink[] = [
    { name: t('dashboard'), to: '/', icon: Home },
    { name: t('shipments'), to: '/shipments', icon: Package },
    { name: t('documents'), to: '/documents', icon: FileText },
    { name: t('messages'), to: '/messages', icon: MessageSquare, unreadCount: 5 },
    { name: t('invoices'), to: '/invoices', icon: Receipt },
  ];

  const agentLinks: NavLink[] = [
    { name: t('dashboard'), to: '/', icon: Home },
    { name: t('shipments'), to: '/shipments', icon: Package },
  ];

  const operationsLinks: NavLink[] = [
    ...agentLinks,
    { name: 'Warehouse', to: '/warehouse', icon: TruckIcon },
    { name: t('messages'), to: '/messages', icon: MessageSquare, unreadCount: 5 },
  ];

  const customsLinks: NavLink[] = [
    ...agentLinks,
    { name: 'Declarations', to: '/declarations', icon: Clipboard },
    { name: t('messages'), to: '/messages', icon: MessageSquare, unreadCount: 5 },
  ];

  const financeLinks: NavLink[] = [
    ...agentLinks,
    { name: 'Invoices', to: '/invoices', icon: FileText },
    { name: t('messages'), to: '/messages', icon: MessageSquare, unreadCount: 5 },
  ];

  const supervisorLinks: NavLink[] = [
    ...agentLinks,
    { name: 'Staff', to: '/staff', icon: Users },
    { name: 'Analytics', to: '/analytics', icon: BarChart },
    { name: 'Issues', to: '/issues', icon: AlertTriangle },
    { name: t('messages'), to: '/messages', icon: MessageSquare, unreadCount: 5 },
  ];

  const adminLinks: NavLink[] = [
    ...supervisorLinks,
    { name: t('settings'), to: '/settings', icon: Settings },
  ];

  let links;
  switch (role) {
    case 'client':
      links = clientLinks;
      break;
    case 'operations':
      links = operationsLinks;
      break;
    case 'customs':
      links = customsLinks;
      break;
    case 'finance':
      links = financeLinks;
      break;
    case 'supervisor':
      links = supervisorLinks;
      break;
    case 'admin':
      links = adminLinks;
      break;
    default:
      links = clientLinks;
  }

  return (
    <div 
      className="h-full w-64 bg-gradient-to-b from-blue-900 to-blue-950 dark:from-gray-800 dark:to-gray-900 text-white flex flex-col relative"
      style={{
        backgroundImage: `url(${backgroundImage})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat'
      }}
    >
      {/* Overlay transparent pour maintenir la lisibilité */}
      <div className="absolute inset-0 bg-gradient-to-b from-blue-900/80 to-blue-950/80 dark:from-gray-800/80 dark:to-gray-900/80"></div>
      
      {/* Contenu de la sidebar */}
      <div className="relative z-10 flex flex-col h-full">
        <div className="flex items-center justify-center h-16 border-b border-blue-800/50 dark:border-gray-700/50">
          <Link to="/" className="flex items-center justify-center" onClick={onNavigate}>
            <img
              src={theme === 'dark' ? darkModeLogo : lightModeLogo}
              alt="ShipTrack Logo"
              className="h-8 w-auto"
            />
          </Link>
        </div>

        <div className="flex flex-col flex-1 overflow-y-auto pt-5 pb-4">
          <div className="px-2 space-y-1">
            {links.map((link) => {
              const Icon = link.icon;
              return (
                <Link
                  key={link.to}
                  to={link.to}
                  onClick={onNavigate}
                  className={cn(
                    "group flex items-center px-2 py-2 text-sm font-medium rounded-md transition-colors relative",
                    isActive(link.to)
                      ? "bg-blue-800/70 dark:bg-gray-700/70 text-white backdrop-blur-sm"
                      : "text-blue-100 dark:text-gray-300 hover:bg-blue-700/50 dark:hover:bg-gray-700/50"
                  )}
                >
                  <Icon
                    className={cn(
                      "mr-3 flex-shrink-0 h-5 w-5",
                      isActive(link.to)
                        ? "text-blue-200 dark:text-gray-300"
                        : "text-blue-300 dark:text-gray-400 group-hover:text-blue-200 dark:group-hover:text-gray-300"
                    )}
                  />
                  {link.name}
                  {link.unreadCount && link.unreadCount > 0 && (
                    <div className="absolute right-2 flex items-center justify-center">
                      <span className="flex items-center justify-center bg-red-500 text-white text-xs font-bold rounded-full min-w-5 h-5 px-1">
                        {link.unreadCount > 99 ? '99+' : link.unreadCount}
                      </span>
                    </div>
                  )}
                </Link>
              );
            })}
          </div>
        </div>

        <div className="p-4 bg-blue-800/80 dark:bg-gray-700/80 text-xs text-blue-300 dark:text-gray-400 backdrop-blur-sm">
          <p>{role.charAt(0).toUpperCase() + role.slice(1)} Portal • v0.1.0</p>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;