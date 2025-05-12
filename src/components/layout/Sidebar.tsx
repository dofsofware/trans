import { Link, useLocation } from 'react-router-dom';
import { UserRole } from '../../types/user';
import { useLanguage } from '../../contexts/LanguageContext';
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
  AlertTriangle
} from 'lucide-react';
import { cn } from '../../utils/cn';

interface SidebarProps {
  role: UserRole;
}

const Sidebar = ({ role }: SidebarProps) => {
  const location = useLocation();
  const { t } = useLanguage();
  const isActive = (path: string) => location.pathname === path;

  const clientLinks = [
    { name: t('dashboard'), to: '/', icon: Home },
    { name: t('shipments'), to: '/shipments', icon: Package },
    { name: t('documents'), to: '/documents', icon: FileText },
    { name: t('messages'), to: '/messages', icon: MessageSquare },
//     { name: t('payments'), to: '/payments', icon: CreditCard },
  ];

  const agentLinks = [
    { name: t('dashboard'), to: '/', icon: Home },
    { name: t('shipments'), to: '/shipments', icon: Package },
  ];

  const operationsLinks = [
    ...agentLinks,
    { name: 'Warehouse', to: '/warehouse', icon: TruckIcon },
  ];

  const customsLinks = [
    ...agentLinks,
    { name: 'Declarations', to: '/declarations', icon: Clipboard },
  ];

  const financeLinks = [
    ...agentLinks,
    { name: 'Invoices', to: '/invoices', icon: FileText },
  ];

  const supervisorLinks = [
    ...agentLinks,
    { name: 'Staff', to: '/staff', icon: Users },
    { name: 'Analytics', to: '/analytics', icon: BarChart },
    { name: 'Issues', to: '/issues', icon: AlertTriangle },
  ];

  const adminLinks = [
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
    <div className="h-full w-64 bg-blue-900 dark:bg-gray-800 text-white flex flex-col">
      <div className="flex items-center justify-center h-16 border-b border-blue-800 dark:border-gray-700">
        <Link to="/" className="text-xl font-bold">
          Ship<span className="text-blue-400">Track</span>
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
                className={cn(
                  "group flex items-center px-2 py-2 text-sm font-medium rounded-md transition-colors",
                  isActive(link.to)
                    ? "bg-blue-800 dark:bg-gray-700 text-white"
                    : "text-blue-100 dark:text-gray-300 hover:bg-blue-700 dark:hover:bg-gray-700"
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
              </Link>
            );
          })}
        </div>
      </div>

      <div className="p-4 bg-blue-800 dark:bg-gray-700 text-xs text-blue-300 dark:text-gray-400">
        <p>{role.charAt(0).toUpperCase() + role.slice(1)} Portal • v0.1.0</p>
      </div>
    </div>
  );
};

export default Sidebar;