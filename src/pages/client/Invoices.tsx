import { useState } from 'react';
import { useLanguage } from '../../contexts/LanguageContext';
import { Search, Filter, Download, Eye, CreditCard } from 'lucide-react';
import { format } from 'date-fns';

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
    currency: 'EUR',
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
    currency: 'EUR',
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
    currency: 'EUR',
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
    currency: 'EUR',
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
    currency: 'EUR',
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

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">{t('my_invoices')}</h1>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-green-100 text-green-600">
              <CreditCard size={24} />
            </div>
            <div className="ml-4">
              <h3 className="text-sm font-medium text-gray-500">{t('total_paid')}</h3>
              <p className="text-2xl font-semibold text-gray-900">
                {totalPaid.toLocaleString('fr-FR', { style: 'currency', currency: 'EUR' })}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-yellow-100 text-yellow-600">
              <CreditCard size={24} />
            </div>
            <div className="ml-4">
              <h3 className="text-sm font-medium text-gray-500">{t('total_unpaid')}</h3>
              <p className="text-2xl font-semibold text-gray-900">
                {totalUnpaid.toLocaleString('fr-FR', { style: 'currency', currency: 'EUR' })}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-red-100 text-red-600">
              <CreditCard size={24} />
            </div>
            <div className="ml-4">
              <h3 className="text-sm font-medium text-gray-500">{t('total_overdue')}</h3>
              <p className="text-2xl font-semibold text-gray-900">
                {totalOverdue.toLocaleString('fr-FR', { style: 'currency', currency: 'EUR' })}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Search and Filters */}
      <div className="mb-6 flex flex-col sm:flex-row sm:items-center space-y-4 sm:space-y-0 sm:space-x-4">
        <div className="flex-1 relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Search size={18} className="text-gray-400" />
          </div>
          <input
            type="text"
            placeholder={t('search_invoices')}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
          />
        </div>
        <div className="relative">
          <button className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500">
            <Filter size={16} className="mr-2" />
            <span>{t('filter_by_payment_status')}</span>
            <select
              className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
            >
              <option value="all">{t('all')}</option>
              <option value="paid">{t('paid')}</option>
              <option value="unpaid">{t('unpaid')}</option>
              <option value="overdue">{t('overdue')}</option>
            </select>
          </button>
        </div>
      </div>

      {/* Invoices Table */}
      <div className="bg-white shadow-sm rounded-lg border border-gray-200">
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
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  {t('due_date')}
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  {t('payment_status')}
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  {t('description')}
                </th>
                <th scope="col" className="relative px-6 py-3">
                  <span className="sr-only">Actions</span>
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredInvoices.map((invoice) => (
                <tr key={invoice.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    {invoice.number}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {invoice.amount.toLocaleString('fr-FR', { style: 'currency', currency: invoice.currency })}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {format(new Date(invoice.dueDate), 'dd/MM/yyyy')}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusColor(invoice.status)}`}>
                      {t(invoice.status)}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-500">
                    <div className="max-w-xs truncate">
                      {invoice.description}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <div className="flex justify-end space-x-3">
                      <button className="text-blue-600 hover:text-blue-900">
                        <Eye size={18} />
                      </button>
                      <button className="text-blue-600 hover:text-blue-900">
                        <Download size={18} />
                      </button>
                      {invoice.status !== 'paid' && (
                        <button className="text-green-600 hover:text-green-900">
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
    </div>
  );
};

export default InvoicesPage;