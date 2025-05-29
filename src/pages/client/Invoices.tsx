import { useState } from 'react';
import { useLanguage } from '../../contexts/LanguageContext';
import { useTheme } from '../../contexts/ThemeContext';
import { Search, Filter, TrendingUp, Download, Eye, CreditCard, ChevronDown, X, AlertCircle, Calendar } from 'lucide-react';
import { format } from 'date-fns';
import { Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import backImage from '../../utils/invoices.png';

interface Invoice {
  id: string;
  number: string;
  amount: number;
  currency: string;
  dueDate: string;
  status: 'paid' | 'unpaid' | 'overdue';
  shipmentId: string;
  description: string;
  issuedDate: string;
  paidDate?: string;
}

const mockInvoices: Invoice[] = [
  {
    id: '1',
    number: 'INV-2024-001',
    amount: 2500000.00,
    currency: 'XOF',
    dueDate: '2024-03-15',
    status: 'unpaid',
    shipmentId: 'SHIP-1001',
    description: 'Transport maritime Shanghai - Paris',
    issuedDate: '2024-02-15'
  },
  {
    id: '2',
    number: 'INV-2024-002',
    amount: 180000.00,
    currency: 'XOF',
    dueDate: '2024-02-28',
    status: 'overdue',
    shipmentId: 'SHIP-1002',
    description: 'Transport aérien Dubai - Paris',
    issuedDate: '2024-02-01'
  },
  {
    id: '3',
    number: 'INV-2024-003',
    amount: 3250000.00,
    currency: 'XOF',
    dueDate: '2024-01-30',
    status: 'paid',
    shipmentId: 'SHIP-1003',
    description: 'Transport maritime Rotterdam - Marseille',
    issuedDate: '2024-01-15',
    paidDate: '2024-01-25'
  },
  {
    id: '4',
    number: 'INV-2024-004',
    amount: 1500000.00,
    currency: 'XOF',
    dueDate: '2024-03-20',
    status: 'unpaid',
    shipmentId: 'SHIP-1004',
    description: 'Transport routier Paris - Lyon',
    issuedDate: '2024-02-20'
  },
  {
    id: '5',
    number: 'INV-2024-005',
    amount: 2800000.00,
    currency: 'XOF',
    dueDate: '2024-01-15',
    status: 'paid',
    shipmentId: 'SHIP-1005',
    description: 'Transport maritime Hambourg - Le Havre',
    issuedDate: '2024-01-01',
    paidDate: '2024-01-10'
  }
];

const InvoicesPage = () => {
  const { t } = useLanguage();
  const { theme } = useTheme();
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const navigate = useNavigate();

  const filteredInvoices = mockInvoices
    .filter(invoice =>
      statusFilter === 'all' || invoice.status === statusFilter
    )
    .filter(invoice =>
      searchQuery === '' ||
      invoice.number.toLowerCase().includes(searchQuery.toLowerCase()) ||
      invoice.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      invoice.shipmentId.toLowerCase().includes(searchQuery.toLowerCase())
    );

  const totalPaid = mockInvoices
    .filter(inv => inv.status === 'paid')
    .reduce((sum, inv) => sum + inv.amount, 0);

  const totalUnpaid = mockInvoices
    .filter(inv => inv.status === 'unpaid')
    .reduce((sum, inv) => sum + inv.amount, 0);

  const totalOverdue = mockInvoices
    .filter(inv => inv.status === 'overdue')
    .reduce((sum, inv) => sum + inv.amount, 0);

  const getStatusColor = (status: string) => {
    const isDark = theme === 'dark';
    switch (status) {
      case 'paid':
        return isDark 
          ? 'bg-green-900/30 text-green-300 border-green-700' 
          : 'bg-green-100 text-green-800 border-green-200';
      case 'unpaid':
        return isDark 
          ? 'bg-yellow-900/30 text-yellow-300 border-yellow-700' 
          : 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'overdue':
        return isDark 
          ? 'bg-red-900/30 text-red-300 border-red-700' 
          : 'bg-red-100 text-red-800 border-red-200';
      default:
        return isDark 
          ? 'bg-gray-800 text-gray-300 border-gray-600' 
          : 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'paid':
        return <CreditCard className="w-4 h-4 mr-1 text-green-600" />;
      case 'unpaid':
        return <Calendar className="w-4 h-4 mr-1 text-yellow-600" />;
      case 'overdue':
        return <AlertCircle className="w-4 h-4 mr-1 text-red-600" />;
      default:
        return null;
    }
  };

  const handleViewInvoice = (invoiceId: string) => {
    navigate(`/invoices/${invoiceId}`);
  };

  const clearSearch = () => {
    setSearchQuery('');
  };

  const handleStatusFilter = (status: string) => {
    setStatusFilter(status);
    setIsFilterOpen(false);
  };

  // Theme-aware classes
  const isDark = theme === 'dark';
  const shadowClass = isDark ? 'shadow-gray-900/20' : 'shadow-sm';
  const hoverShadow = isDark ? 'hover:shadow-gray-900/30' : 'hover:shadow-md';
  const textPrimary = isDark ? 'text-white' : 'text-gray-900';
  const textSecondary = isDark ? 'text-gray-300' : 'text-gray-600';
  const borderColor = isDark ? 'border-gray-700' : 'border-gray-200';

  const themeClasses = {
    container: isDark ? 'bg-gray-900 text-white' : 'bg-gray-50 text-gray-900',
    card: isDark ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-100',
    cardHover: isDark ? 'hover:bg-gray-700' : 'hover:bg-gray-50',
    text: {
      primary: isDark ? 'text-white' : 'text-gray-900',
      secondary: isDark ? 'text-gray-300' : 'text-gray-500',
      muted: isDark ? 'text-gray-400' : 'text-gray-500'
    },
    input: isDark 
      ? 'bg-gray-800 border-gray-600 text-white placeholder-gray-400 focus:ring-blue-400 focus:border-blue-400' 
      : 'bg-white border-gray-300 text-gray-900 placeholder-gray-500 focus:ring-blue-500 focus:border-blue-500',
    button: isDark 
      ? 'bg-gray-800 border-gray-600 text-gray-300 hover:bg-gray-700' 
      : 'bg-white border-gray-300 text-gray-700 hover:bg-gray-50',
    table: {
      header: isDark ? 'bg-gray-800' : 'bg-gray-50',
      row: isDark ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200',
      rowHover: isDark ? 'hover:bg-gray-700' : 'hover:bg-gray-50'
    },
    dropdown: isDark 
      ? 'bg-gray-800 border-gray-600 shadow-xl' 
      : 'bg-white border-gray-200 shadow-lg'
  };

  return (
    <div className={`max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 transition-opacity duration-500 ease-in-out`}>
      {/* New Header Section */}
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
          <h1 className={`text-2xl md:text-3xl font-bold ${textPrimary}`}>
            {t('my_invoices')}
          </h1>
          <p className={`mt-2 ${textSecondary} text-lg`}>{t('manage_invoices')}</p>
        </div>
      </div>

      {/* Statistics Cards - Version Redesignée */}
{/* Statistics Cards - Version Harmonisée */}
<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
  {[
    {
      icon: <CreditCard size={24} strokeWidth={2} />,
      iconBg: isDark ? "bg-green-500/20" : "bg-green-50",
      iconColor: "text-green-500",
      title: t('total_paid'),
      value: totalPaid.toLocaleString('fr-FR', { style: 'currency', currency: 'XOF' }),
      trend: <ChevronDown size={16} className="ml-2 text-green-500 rotate-180" />,
      accentColor: "bg-gradient-to-r from-green-500 to-emerald-600"
    },
    {
      icon: <Calendar size={24} strokeWidth={2} />,
      iconBg: isDark ? "bg-yellow-500/20" : "bg-yellow-50",
      iconColor: "text-yellow-500",
      title: t('total_unpaid'),
      value: totalUnpaid.toLocaleString('fr-FR', { style: 'currency', currency: 'XOF' }),
      trend: <ChevronDown size={16} className="ml-2 text-yellow-500 rotate-180" />,
      accentColor: "bg-gradient-to-r from-yellow-500 to-orange-500"
    },
    {
      icon: <AlertCircle size={24} strokeWidth={2} />,
      iconBg: isDark ? "bg-red-500/20" : "bg-red-50",
      iconColor: totalOverdue > 0 ? "text-red-500" : "text-gray-500",
      title: t('total_overdue'),
      value: totalOverdue.toLocaleString('fr-FR', { style: 'currency', currency: 'XOF' }),
      trend: totalOverdue > 0 && <span className="ml-2 animate-ping text-red-500">●</span>,
      accentColor: totalOverdue > 0 
        ? "bg-gradient-to-r from-red-500 to-pink-500" 
        : "bg-gradient-to-r from-gray-500 to-gray-600"
    }
  ].map((stat, index) => (
    <div
    
      key={index}
      className={`${themeClasses.card} rounded-xl ${shadowClass} border ${isDark ? 'border-gray-700' : borderColor} ${hoverShadow} transition-all duration-300 transform hover:translate-y-[-2px] hover:scale-105 overflow-hidden group`}
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
          <h3 className={`text-sm font-medium ${themeClasses.text.secondary} uppercase tracking-wide`}>
            {stat.title}
          </h3>
          <p className={`text-3xl font-bold ${themeClasses.text.primary} transition-all duration-300 group-hover:scale-105`}>
            {stat.value}
          </p>
        </div>
      </div>
      
      {/* Effet de glow subtil au hover */}
      <div className={`absolute inset-0 opacity-0 group-hover:opacity-5 transition-opacity duration-300 pointer-events-none ${stat.accentColor.replace('bg-gradient-to-r', 'bg-gradient-to-br')}`}></div>
    </div>
  ))}
</div>

      {/* Search and Filters */}
      <motion.div
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.4 }}
        className="mb-6 flex flex-col sm:flex-row sm:items-center gap-4"
      >
        <div className="flex-1 relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Search size={18} className={themeClasses.text.muted} />
          </div>
          <motion.input
            whileFocus={{ scale: 1.01 }}
            type="text"
            placeholder={t('search_invoices')}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className={`block w-full pl-10 pr-10 py-2.5 border rounded-lg focus:outline-none focus:ring-2 text-sm ${themeClasses.input}`}
          />
          {searchQuery && (
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              className="absolute inset-y-0 right-0 pr-3 flex items-center"
              onClick={clearSearch}
            >
              <X size={16} className={`${themeClasses.text.muted} hover:${themeClasses.text.secondary}`} />
            </motion.button>
          )}
        </div>
        <div className="relative">
          <motion.button
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            className={`inline-flex items-center px-4 py-2.5 border rounded-lg shadow-sm text-sm font-medium focus:outline-none focus:ring-2 focus:ring-blue-500 w-full sm:w-auto justify-center ${themeClasses.button}`}
            onClick={() => setIsFilterOpen(!isFilterOpen)}
          >
            <Filter size={16} className="mr-2" />
            <span>{statusFilter === 'all' ? t('filter_by_status') : t(statusFilter)}</span>
            <motion.div
              animate={{ rotate: isFilterOpen ? 180 : 0 }}
              transition={{ duration: 0.3 }}
            >
              <ChevronDown size={16} className="ml-2" />
            </motion.div>
          </motion.button>

          <AnimatePresence>
            {isFilterOpen && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.2 }}
                className={`absolute z-10 mt-1 w-56 rounded-lg overflow-hidden right-0 ${themeClasses.dropdown}`}
              >
                <div className="py-1">
                  <motion.button
                    whileHover={{ backgroundColor: isDark ? (statusFilter === 'all' ? '#1e40af' : '#374151') : (statusFilter === 'all' ? '#dbeafe' : '#f9fafb') }}
                    className={`block px-4 py-2 text-sm w-full text-left ${
                      statusFilter === 'all' 
                        ? isDark ? 'bg-blue-900 text-blue-300' : 'bg-blue-50 text-blue-700'
                        : isDark ? 'text-gray-300 hover:bg-gray-700' : 'text-gray-700 hover:bg-gray-50'
                    }`}
                    onClick={() => handleStatusFilter('all')}
                  >
                    {t('all')}
                  </motion.button>
                  <motion.button
                    whileHover={{ backgroundColor: isDark ? (statusFilter === 'paid' ? '#1e40af' : '#374151') : (statusFilter === 'paid' ? '#dbeafe' : '#f9fafb') }}
                    className={`flex items-center px-4 py-2 text-sm w-full text-left ${
                      statusFilter === 'paid' 
                        ? isDark ? 'bg-blue-900 text-blue-300' : 'bg-blue-50 text-blue-700'
                        : isDark ? 'text-gray-300 hover:bg-gray-700' : 'text-gray-700 hover:bg-gray-50'
                    }`}
                    onClick={() => handleStatusFilter('paid')}
                  >
                    {getStatusIcon('paid')} {t('paid')}
                  </motion.button>
                  <motion.button
                    whileHover={{ backgroundColor: isDark ? (statusFilter === 'unpaid' ? '#1e40af' : '#374151') : (statusFilter === 'unpaid' ? '#dbeafe' : '#f9fafb') }}
                    className={`flex items-center px-4 py-2 text-sm w-full text-left ${
                      statusFilter === 'unpaid' 
                        ? isDark ? 'bg-blue-900 text-blue-300' : 'bg-blue-50 text-blue-700'
                        : isDark ? 'text-gray-300 hover:bg-gray-700' : 'text-gray-700 hover:bg-gray-50'
                    }`}
                    onClick={() => handleStatusFilter('unpaid')}
                  >
                    {getStatusIcon('unpaid')} {t('unpaid')}
                  </motion.button>
                  <motion.button
                    whileHover={{ backgroundColor: isDark ? (statusFilter === 'overdue' ? '#1e40af' : '#374151') : (statusFilter === 'overdue' ? '#dbeafe' : '#f9fafb') }}
                    className={`flex items-center px-4 py-2 text-sm w-full text-left ${
                      statusFilter === 'overdue' 
                        ? isDark ? 'bg-blue-900 text-blue-300' : 'bg-blue-50 text-blue-700'
                        : isDark ? 'text-gray-300 hover:bg-gray-700' : 'text-gray-700 hover:bg-gray-50'
                    }`}
                    onClick={() => handleStatusFilter('overdue')}
                  >
                    {getStatusIcon('overdue')} {t('overdue')}
                  </motion.button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </motion.div>

      {/* Empty state */}
      <AnimatePresence>
        {filteredInvoices.length === 0 && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.3 }}
            className={`${themeClasses.card} rounded-lg p-8 text-center`}
          >
            <motion.div
              initial={{ y: 10, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.2 }}
              className="flex justify-center mb-4"
            >
              <div className="p-3 rounded-full bg-blue-100 text-blue-600">
                <motion.div animate={{ rotate: [0, 10, -10, 0] }} transition={{ repeat: Infinity, repeatDelay: 3 }}>
                  <CreditCard size={24} />
                </motion.div>
              </div>
            </motion.div>
            <motion.h3
              initial={{ y: 10, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.3 }}
              className={`text-lg font-medium mb-2 ${themeClasses.text.primary}`}
            >
              {t('no_invoices_found')}
            </motion.h3>
            <motion.p
              initial={{ y: 10, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.4 }}
              className={`mb-4 ${themeClasses.text.secondary}`}
            >
              {t('no_invoices_match_filters')}
            </motion.p>
            <motion.button
              initial={{ y: 10, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.5 }}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              onClick={() => {
                setSearchQuery('');
                setStatusFilter('all');
              }}
            >
              {t('clear_filters')}
            </motion.button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Table - Hidden on mobile */}
      {filteredInvoices.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.5 }}
          className={`hidden lg:block shadow rounded-lg overflow-hidden ${themeClasses.card}`}
        >
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
              <thead className={themeClasses.table.header}>
                <tr>
                  <th scope="col" className={`px-6 py-3 text-left text-xs font-medium uppercase tracking-wider ${themeClasses.text.secondary}`}>
                    {t('invoice_number')}
                  </th>
                  <th scope="col" className={`px-6 py-3 text-left text-xs font-medium uppercase tracking-wider ${themeClasses.text.secondary}`}>
                    {t('amount')}
                  </th>
                  <th scope="col" className={`px-6 py-3 text-left text-xs font-medium uppercase tracking-wider hidden sm:table-cell ${themeClasses.text.secondary}`}>
                    {t('due_date')}
                  </th>
                  <th scope="col" className={`px-6 py-3 text-left text-xs font-medium uppercase tracking-wider ${themeClasses.text.secondary}`}>
                    {t('payment_status')}
                  </th>
                  <th scope="col" className={`px-6 py-3 text-left text-xs font-medium uppercase tracking-wider hidden md:table-cell ${themeClasses.text.secondary}`}>
                    {t('description')}
                  </th>
                  <th scope="col" className="relative px-6 py-3">
                    <span className="sr-only">{t('actions')}</span>
                  </th>
                </tr>
              </thead>
              <tbody className={`divide-y ${isDark ? 'divide-gray-700' : 'divide-gray-200'}`}>
                {filteredInvoices.map((invoice, index) => (
                  <motion.tr
                    key={invoice.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3, delay: 0.1 * index }}
                    whileHover={{ backgroundColor: isDark ? '#374151' : '#f9fafb' }}
                    className={`transition-colors ${themeClasses.table.rowHover}`}
                  >
                    <td className={`px-6 py-4 whitespace-nowrap text-sm font-medium ${themeClasses.text.primary}`}>
                      {invoice.number}
                    </td>
                    <td className={`px-6 py-4 whitespace-nowrap text-sm ${themeClasses.text.primary}`}>
                      {invoice.amount.toLocaleString('fr-FR', { style: 'currency', currency: invoice.currency })}
                    </td>
                    <td className={`px-6 py-4 whitespace-nowrap text-sm hidden sm:table-cell ${themeClasses.text.secondary}`}>
                      {format(new Date(invoice.dueDate), 'dd/MM/yyyy')}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <motion.span
                        whileHover={{ scale: 1.05 }}
                        className={`px-2 py-1 inline-flex items-center text-xs leading-5 font-semibold rounded-full border ${getStatusColor(invoice.status)}`}
                      >
                        {getStatusIcon(invoice.status)}
                        {t(invoice.status)}
                      </motion.span>
                    </td>
                    <td className={`px-6 py-4 text-sm hidden md:table-cell ${themeClasses.text.secondary}`}>
                      <div className="max-w-xs truncate">
                        {invoice.description}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <div className="flex justify-end space-x-3">
                        <motion.button
                          whileHover={{ scale: 1.15, backgroundColor: isDark ? '#1e40af' : '#dbeafe' }}
                          whileTap={{ scale: 0.95 }}
                          className="text-blue-600 hover:text-blue-900 p-1.5 rounded-full hover:bg-blue-50 dark:hover:bg-blue-900/30 transition-colors"
                          onClick={() => handleViewInvoice(invoice.id)}
                          title={t('view_invoice')}
                        >
                          <Eye size={18} />
                        </motion.button>
                        <motion.button
                          whileHover={{ scale: 1.15, backgroundColor: isDark ? '#1e40af' : '#dbeafe' }}
                          whileTap={{ scale: 0.95 }}
                          className="text-blue-600 hover:text-blue-900 p-1.5 rounded-full hover:bg-blue-50 dark:hover:bg-blue-900/30 transition-colors"
                          title={t('download_invoice')}
                        >
                          <Download size={18} />
                        </motion.button>
                        {invoice.status !== 'paid' && (
                          <motion.button
                            whileHover={{ scale: 1.15, backgroundColor: isDark ? '#14532d' : '#dcfce7' }}
                            whileTap={{ scale: 0.95 }}
                            className="text-green-600 hover:text-green-900 p-1.5 rounded-full hover:bg-green-50 dark:hover:bg-green-900/30 transition-colors"
                            title={t('pay_invoice')}
                          >
                            <CreditCard size={18} />
                          </motion.button>
                        )}
                      </div>
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>
        </motion.div>
      )}

      {/* Mobile view for small screens - Card layout */}
      <div className="lg:hidden mt-6">
        <div className="space-y-4">
          {filteredInvoices.map((invoice, index) => (
            <motion.div
              key={invoice.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: 0.1 * index }}
              whileHover={{ 
                scale: 1.01, 
                boxShadow: isDark 
                  ? "0 4px 6px -1px rgba(0, 0, 0, 0.3), 0 2px 4px -1px rgba(0, 0, 0, 0.2)" 
                  : "0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)" 
              }}
              className={`rounded-lg shadow p-4 ${themeClasses.card}`}
            >
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h3 className={`font-medium ${themeClasses.text.primary}`}>{invoice.number}</h3>
                  <p className={`text-sm mt-1 ${themeClasses.text.secondary}`}>{invoice.description}</p>
                </div>
                <motion.span
                  whileHover={{ scale: 1.05 }}
                  className={`px-2 py-1 inline-flex items-center text-xs leading-5 font-semibold rounded-full border ${getStatusColor(invoice.status)}`}
                >
                  {getStatusIcon(invoice.status)}
                  {t(invoice.status)}
                </motion.span>
              </div>
              
              <div className="grid grid-cols-2 gap-4 mb-4">
                <div>
                  <p className={`text-xs ${themeClasses.text.secondary}`}>{t('amount')}</p>
                  <p className={`font-semibold ${themeClasses.text.primary}`}>
                    {invoice.amount.toLocaleString('fr-FR', { style: 'currency', currency: invoice.currency })}
                  </p>
                </div>
                <div>
                  <p className={`text-xs ${themeClasses.text.secondary}`}>{t('due_date')}</p>
                  <p className={`font-semibold ${themeClasses.text.primary}`}>
                    {format(new Date(invoice.dueDate), 'dd/MM/yyyy')}
                  </p>
                </div>
              </div>

              <div className="flex justify-end space-x-3 pt-3 border-t border-gray-200 dark:border-gray-700">
                <motion.button
                  whileHover={{ scale: 1.15, backgroundColor: isDark ? '#1e40af' : '#dbeafe' }}
                  whileTap={{ scale: 0.95 }}
                  className="text-blue-600 hover:text-blue-900 p-2 rounded-full hover:bg-blue-50 dark:hover:bg-blue-900/30 transition-colors"
                  onClick={() => handleViewInvoice(invoice.id)}
                  title={t('view_invoice')}
                >
                  <Eye size={18} />
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.15, backgroundColor: isDark ? '#1e40af' : '#dbeafe' }}
                  whileTap={{ scale: 0.95 }}
                  className="text-blue-600 hover:text-blue-900 p-2 rounded-full hover:bg-blue-50 dark:hover:bg-blue-900/30 transition-colors"
                  title={t('download_invoice')}
                >
                  <Download size={18} />
                </motion.button>
                {invoice.status !== 'paid' && (
                  <motion.button
                    whileHover={{ scale: 1.15, backgroundColor: isDark ? '#14532d' : '#dcfce7' }}
                    whileTap={{ scale: 0.95 }}
                    className="text-green-600 hover:text-green-900 p-2 rounded-full hover:bg-green-50 dark:hover:bg-green-900/30 transition-colors"
                    title={t('pay_invoice')}
                  >
                    <CreditCard size={18} />
                  </motion.button>
                )}
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default InvoicesPage;