import { ShipmentStatus } from '../../types/shipment';
import { cn } from '../../utils/cn';
import { 
  FileEdit, 
  PackageOpen, 
  Warehouse, 
  Building, 
  Ship, 
  PackageCheck, 
  AlertCircle 
} from 'lucide-react';

interface StatusProps {
  status: ShipmentStatus;
  className?: string;
  showIcon?: boolean;
  size?: 'sm' | 'md' | 'lg';
}

const statusConfig: Record<ShipmentStatus, {
  label: string;
  color: string;
  bgColor: string;
  borderColor: string;
  icon: React.ElementType;
}> = {
  draft: {
    label: 'Draft',
    color: 'text-gray-700',
    bgColor: 'bg-gray-100',
    borderColor: 'border-gray-200',
    icon: FileEdit
  },
  processing: {
    label: 'Processing',
    color: 'text-amber-700',
    bgColor: 'bg-amber-50',
    borderColor: 'border-amber-200',
    icon: PackageOpen
  },
  warehouse: {
    label: 'In Warehouse',
    color: 'text-blue-700',
    bgColor: 'bg-blue-50',
    borderColor: 'border-blue-200',
    icon: Warehouse
  },
  customs: {
    label: 'Customs Clearance',
    color: 'text-purple-700',
    bgColor: 'bg-purple-50',
    borderColor: 'border-purple-200',
    icon: Building
  },
  in_transit: {
    label: 'In Transit',
    color: 'text-indigo-700',
    bgColor: 'bg-indigo-50',
    borderColor: 'border-indigo-200',
    icon: Ship
  },
  delivered: {
    label: 'Delivered',
    color: 'text-emerald-700',
    bgColor: 'bg-emerald-50',
    borderColor: 'border-emerald-200',
    icon: PackageCheck
  },
  issue: {
    label: 'Issue',
    color: 'text-red-700',
    bgColor: 'bg-red-50',
    borderColor: 'border-red-200',
    icon: AlertCircle
  },
};

const Status = ({ status, className, showIcon = true, size = 'md' }: StatusProps) => {
  const config = statusConfig[status];
  
  const sizeClasses = {
    sm: 'text-xs px-2 py-0.5',
    md: 'text-sm px-2.5 py-0.5',
    lg: 'text-sm px-3 py-1'
  };
  
  return (
    <span 
      className={cn(
        'inline-flex items-center rounded-full border font-medium',
        config.color,
        config.bgColor,
        config.borderColor,
        sizeClasses[size],
        className
      )}
    >
      {showIcon && (
        <config.icon className={cn('mr-1', size === 'sm' ? 'h-3 w-3' : 'h-4 w-4')} />
      )}
      {config.label}
    </span>
  );
};

export default Status;