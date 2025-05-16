import { useState } from 'react';
import { useLanguage } from '../../contexts/LanguageContext';
import { Search, Filter, Download, Eye, CreditCard, ChevronDown, X, AlertCircle, Calendar } from 'lucide-react';
import { format } from 'date-fns';
import { Link, useNavigate } from 'react-router-dom';

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
    amount: 2500.00,
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
    amount: 1800.00,
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
    amount: 3200.00,
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
    amount: 1500.00,
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
    amount: 2800.00,
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
    switch (status) {
      case 'paid':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'unpaid':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'overdue':
        return 'bg-red-100 text-red-800 border-red-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
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

  return (
    <div className="p-4 sm:p-6 max-w-7xl mx-auto">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8">
        <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-4 md:mb-0">{t('my_invoices')}</h1>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
        <div className="bg-white rounded-xl shadow p-4 border border-gray-100 transition-all hover:shadow-md">
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-green-100 text-green-600">
              <CreditCard size={20} />
            </div>
            <div className="ml-4">
              <h3 className="text-sm font-medium text-gray-500">{t('total_paid')}</h3>
              <p className="text-xl font-semibold text-gray-900">
                {totalPaid.toLocaleString('fr-FR', { style: 'currency', currency: 'XOF' })}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow p-4 border border-gray-100 transition-all hover:shadow-md">
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-yellow-100 text-yellow-600">
              <Calendar size={20} />
            </div>
            <div className="ml-4">
              <h3 className="text-sm font-medium text-gray-500">{t('total_unpaid')}</h3>
              <p className="text-xl font-semibold text-gray-900">
                {totalUnpaid.toLocaleString('fr-FR', { style: 'currency', currency: 'XOF' })}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow p-4 border border-gray-100 transition-all hover:shadow-md sm:col-span-2 lg:col-span-1">
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-red-100 text-red-600">
              <AlertCircle size={20} />
            </div>
            <div className="ml-4">
              <h3 className="text-sm font-medium text-gray-500">{t('total_overdue')}</h3>
              <p className="text-xl font-semibold text-gray-900">
                {totalOverdue.toLocaleString('fr-FR', { style: 'currency', currency: 'XOF' })}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Search and Filters */}
      <div className="mb-6 flex flex-col sm:flex-row sm:items-center gap-4">
        <div className="flex-1 relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Search size={18} className="text-gray-400" />
          </div>
          <input
            type="text"
            placeholder={t('search_invoices')}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="block w-full pl-10 pr-10 py-2.5 border border-gray-300 rounded-lg bg-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
          />
          {searchQuery && (
            <button
              className="absolute inset-y-0 right-0 pr-3 flex items-center"
              onClick={clearSearch}
            >
              <X size={16} className="text-gray-400 hover:text-gray-600" />
            </button>
          )}
        </div>
        <div className="relative">
          <button
            className="inline-flex items-center px-4 py-2.5 border border-gray-300 rounded-lg shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 w-full sm:w-auto justify-center"
            onClick={() => setIsFilterOpen(!isFilterOpen)}
          >
            <Filter size={16} className="mr-2" />
            <span>{statusFilter === 'all' ? t('filter_by_status') : t(statusFilter)}</span>
            <ChevronDown size={16} className="ml-2" />
          </button>

          {isFilterOpen && (
            <div className="absolute z-10 mt-1 w-56 bg-white rounded-lg shadow-lg overflow-hidden border border-gray-200 right-0">
              <div className="py-1">
                <button
                  className={`block px-4 py-2 text-sm w-full text-left ${statusFilter === 'all' ? 'bg-blue-50 text-blue-700' : 'text-gray-700 hover:bg-gray-50'}`}
                  onClick={() => handleStatusFilter('all')}
                >
                  {t('all')}
                </button>
                <button
                  className={`flex items-center px-4 py-2 text-sm w-full text-left ${statusFilter === 'paid' ? 'bg-blue-50 text-blue-700' : 'text-gray-700 hover:bg-gray-50'}`}
                  onClick={() => handleStatusFilter('paid')}
                >
                  {getStatusIcon('paid')} {t('paid')}
                </button>
                <button
                  className={`flex items-center px-4 py-2 text-sm w-full text-left ${statusFilter === 'unpaid' ? 'bg-blue-50 text-blue-700' : 'text-gray-700 hover:bg-gray-50'}`}
                  onClick={() => handleStatusFilter('unpaid')}
                >
                  {getStatusIcon('unpaid')} {t('unpaid')}
                </button>
                <button
                  className={`flex items-center px-4 py-2 text-sm w-full text-left ${statusFilter === 'overdue' ? 'bg-blue-50 text-blue-700' : 'text-gray-700 hover:bg-gray-50'}`}
                  onClick={() => handleStatusFilter('overdue')}
                >
                  {getStatusIcon('overdue')} {t('overdue')}
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Empty state */}
      {filteredInvoices.length === 0 && (
        <div className="bg-white border border-gray-200 rounded-lg p-8 text-center">
          <div className="flex justify-center mb-4">
            <div className="p-3 rounded-full bg-blue-100 text-blue-600">
              <CreditCard size={24} />
            </div>
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">{t('no_invoices_found')}</h3>
          <p className="text-gray-500 mb-4">{t('no_invoices_match_filters')}</p>
          <button
            className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            onClick={() => {
              setSearchQuery('');
              setStatusFilter('all');
            }}
          >
            {t('clear_filters')}
          </button>
        </div>
      )}

      {/* Table - Hidden on mobile */}
      {filteredInvoices.length > 0 && (
        <div className="hidden lg:block bg-white shadow rounded-lg border border-gray-200 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    {t('invoice_number')}
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    {t('amount')}
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider hidden sm:table-cell">
                    {t('due_date')}
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    {t('payment_status')}
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider hidden md:table-cell">
                    {t('description')}
                  </th>
                  <th scope="col" className="relative px-6 py-3">
                    <span className="sr-only">{t('actions')}</span>
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredInvoices.map((invoice) => (
                  <tr key={invoice.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {invoice.number}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {invoice.amount.toLocaleString('fr-FR', { style: 'currency', currency: invoice.currency })}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 hidden sm:table-cell">
                      {format(new Date(invoice.dueDate), 'dd/MM/yyyy')}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 py-1 inline-flex items-center text-xs leading-5 font-semibold rounded-full ${getStatusColor(invoice.status)}`}>
                        {getStatusIcon(invoice.status)}
                        {t(invoice.status)}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-500 hidden md:table-cell">
                      <div className="max-w-xs truncate">
                        {invoice.description}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <div className="flex justify-end space-x-3">
                        <button
                          className="text-blue-600 hover:text-blue-900 p-1.5 rounded-full hover:bg-blue-50 transition-colors"
                          onClick={() => handleViewInvoice(invoice.id)}
                          title={t('view_invoice')}
                        >
                          <Eye size={18} />
                        </button>
                        <button
                          className="text-blue-600 hover:text-blue-900 p-1.5 rounded-full hover:bg-blue-50 transition-colors"
                          title={t('download_invoice')}
                        >
                          <Download size={18} />
                        </button>
                        {invoice.status !== 'paid' && (
                          <button
                            className="text-green-600 hover:text-green-900 p-1.5 rounded-full hover:bg-green-50 transition-colors"
                            title={t('pay_invoice')}
                          >
                            <CreditCard size={18} />
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Mobile view for small screens - Card layout */}
      <div className="lg:hidden mt-6">
        <div className="space-y-4">
          {filteredInvoices.map((invoice) => (
            <div key={invoice.id} className="bg-white rounded-lg shadow border border-gray-200 p-4">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h3 className="font-medium text-gray-900">{invoice.number}</h3>
                  <p className="text-sm text-gray-500 mt-1">{invoice.description}</p>
                </div>
                <span className={`px-2 py-1 inline-flex items-center text-xs leading-5 font-semibold rounded-full ${getStatusColor(invoice.status)}`}>
                  {getStatusIcon(invoice.status)}
                  {t(invoice.status)}
                </span>
              </div>
              <div className="border-t border-gray-200 pt-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-xs text-gray-500">{t('amount')}</p>
                    <p className="text-sm font-medium text-gray-900">
                      {invoice.amount.toLocaleString('fr-FR', { style: 'currency', currency: invoice.currency })}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500">{t('due_date')}</p>
                    <p className="text-sm font-medium text-gray-900">
                      {format(new Date(invoice.dueDate), 'dd/MM/yyyy')}
                    </p>
                  </div>
                </div>
              </div>
              <div className="mt-4 flex justify-end space-x-2">
                <button
                  className="p-2 rounded-full bg-blue-50 text-blue-600 hover:bg-blue-100"
                  onClick={() => handleViewInvoice(invoice.id)}
                >
                  <Eye size={16} />
                </button>
                <button className="p-2 rounded-full bg-blue-50 text-blue-600 hover:bg-blue-100">
                  <Download size={16} />
                </button>
                {invoice.status !== 'paid' && (
                  <button className="p-2 rounded-full bg-green-50 text-green-600 hover:bg-green-100">
                    <CreditCard size={16} />
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default InvoicesPage;