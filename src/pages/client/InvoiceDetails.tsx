import { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useLanguage } from '../../contexts/LanguageContext';
import { ArrowLeft, Download, CreditCard, FileText, Building, Calendar } from 'lucide-react';
import { format } from 'date-fns';

const InvoiceDetails = () => {
  const { id } = useParams();
  const { t } = useLanguage();
  const [invoice] = useState({
    id: 'INV-2024-001',
    number: 'INV-2024-001',
    amount: 2500.00,
    currency: 'EUR',
    dueDate: '2024-03-15',
    status: 'unpaid',
    shipmentId: 'SHIP-1001',
    description: 'Transport maritime Shanghai - Paris',
    issuedDate: '2024-02-15',
    items: [
      {
        id: 1,
        description: 'Transport maritime international',
        quantity: 1,
        unitPrice: 1800.00,
        total: 1800.00
      },
      {
        id: 2,
        description: 'Frais de documentation',
        quantity: 1,
        unitPrice: 350.00,
        total: 350.00
      },
      {
        id: 3,
        description: 'Assurance transport',
        quantity: 1,
        unitPrice: 350.00,
        total: 350.00
      }
    ],
    company: {
      name: 'HollyTrans Logistics',
      address: '123 Rue de la Logistique',
      city: 'Paris',
      postalCode: '75001',
      country: 'France',
      vatNumber: 'FR12345678901'
    },
    client: {
      name: 'Client Demo',
      company: 'Demo Enterprise',
      address: '456 Avenue du Commerce',
      city: 'Lyon',
      postalCode: '69001',
      country: 'France',
      vatNumber: 'FR98765432109'
    }
  });

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
      <div className="mb-6 flex items-center justify-between">
        <div>
          <Link to="/invoices" className="inline-flex items-center text-sm text-blue-600 hover:text-blue-800">
            <ArrowLeft size={16} className="mr-1" /> Retour aux factures
          </Link>
          <h1 className="mt-2 text-2xl font-bold text-gray-900">Facture {invoice.number}</h1>
        </div>
        <div className="flex space-x-3">
          <button
            type="button"
            className="inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            <Download size={16} className="mr-2" />
            Télécharger PDF
          </button>
          {invoice.status !== 'paid' && (
            <button
              type="button"
              className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              <CreditCard size={16} className="mr-2" />
              Payer maintenant
            </button>
          )}
        </div>
      </div>

      <div className="bg-white shadow-sm rounded-lg border border-gray-200 overflow-hidden">
        {/* En-tête de la facture */}
        <div className="px-6 py-5 border-b border-gray-200">
          <div className="flex justify-between items-start">
            <div>
              <div className="flex items-center">
                <FileText size={24} className="text-blue-600 mr-2" />
                <h2 className="text-xl font-semibold text-gray-900">Facture #{invoice.number}</h2>
              </div>
              <p className="mt-1 text-sm text-gray-600">
                Expédition: {invoice.shipmentId}
              </p>
            </div>
            <span className={`px-3 py-1 rounded-full text-sm font-medium border ${getStatusColor(invoice.status)}`}>
              {invoice.status === 'paid' ? 'Payée' : invoice.status === 'unpaid' ? 'Non payée' : 'En retard'}
            </span>
          </div>
        </div>

        {/* Informations de l'entreprise et du client */}
        <div className="px-6 py-5 border-b border-gray-200 grid grid-cols-2 gap-8">
          <div>
            <div className="flex items-center mb-3">
              <Building size={18} className="text-gray-400 mr-2" />
              <h3 className="text-sm font-medium text-gray-900">De</h3>
            </div>
            <div className="text-sm text-gray-600">
              <p className="font-medium text-gray-900">{invoice.company.name}</p>
              <p>{invoice.company.address}</p>
              <p>{invoice.company.postalCode} {invoice.company.city}</p>
              <p>{invoice.company.country}</p>
              <p className="mt-2">TVA: {invoice.company.vatNumber}</p>
            </div>
          </div>
          <div>
            <div className="flex items-center mb-3">
              <Building size={18} className="text-gray-400 mr-2" />
              <h3 className="text-sm font-medium text-gray-900">Facturer à</h3>
            </div>
            <div className="text-sm text-gray-600">
              <p className="font-medium text-gray-900">{invoice.client.company}</p>
              <p>{invoice.client.name}</p>
              <p>{invoice.client.address}</p>
              <p>{invoice.client.postalCode} {invoice.client.city}</p>
              <p>{invoice.client.country}</p>
              <p className="mt-2">TVA: {invoice.client.vatNumber}</p>
            </div>
          </div>
        </div>

        {/* Dates importantes */}
        <div className="px-6 py-5 border-b border-gray-200">
          <div className="grid grid-cols-2 gap-8">
            <div>
              <div className="flex items-center">
                <Calendar size={18} className="text-gray-400 mr-2" />
                <h3 className="text-sm font-medium text-gray-900">Date d'émission</h3>
              </div>
              <p className="mt-1 text-sm text-gray-600">
                {format(new Date(invoice.issuedDate), 'dd/MM/yyyy')}
              </p>
            </div>
            <div>
              <div className="flex items-center">
                <Calendar size={18} className="text-gray-400 mr-2" />
                <h3 className="text-sm font-medium text-gray-900">Date d'échéance</h3>
              </div>
              <p className="mt-1 text-sm text-gray-600">
                {format(new Date(invoice.dueDate), 'dd/MM/yyyy')}
              </p>
            </div>
          </div>
        </div>

        {/* Détails des articles */}
        <div className="px-6 py-5">
          <table className="min-w-full divide-y divide-gray-200">
            <thead>
              <tr>
                <th scope="col" className="text-left text-sm font-medium text-gray-500 py-3">Description</th>
                <th scope="col" className="text-right text-sm font-medium text-gray-500 py-3">Quantité</th>
                <th scope="col" className="text-right text-sm font-medium text-gray-500 py-3">Prix unitaire</th>
                <th scope="col" className="text-right text-sm font-medium text-gray-500 py-3">Total</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {invoice.items.map((item) => (
                <tr key={item.id}>
                  <td className="py-4 text-sm text-gray-900">{item.description}</td>
                  <td className="py-4 text-sm text-gray-900 text-right">{item.quantity}</td>
                  <td className="py-4 text-sm text-gray-900 text-right">
                    {item.unitPrice.toLocaleString('fr-FR', { style: 'currency', currency: invoice.currency })}
                  </td>
                  <td className="py-4 text-sm text-gray-900 text-right">
                    {item.total.toLocaleString('fr-FR', { style: 'currency', currency: invoice.currency })}
                  </td>
                </tr>
              ))}
            </tbody>
            <tfoot>
              <tr>
                <th scope="row" colSpan={3} className="pt-6 text-right text-sm font-medium text-gray-900">
                  Total HT
                </th>
                <td className="pt-6 text-right text-sm text-gray-900">
                  {invoice.amount.toLocaleString('fr-FR', { style: 'currency', currency: invoice.currency })}
                </td>
              </tr>
              <tr>
                <th scope="row" colSpan={3} className="pt-2 text-right text-sm font-medium text-gray-900">
                  TVA (20%)
                </th>
                <td className="pt-2 text-right text-sm text-gray-900">
                  {(invoice.amount * 0.2).toLocaleString('fr-FR', { style: 'currency', currency: invoice.currency })}
                </td>
              </tr>
              <tr>
                <th scope="row" colSpan={3} className="pt-2 text-right text-sm font-bold text-gray-900">
                  Total TTC
                </th>
                <td className="pt-2 text-right text-sm font-bold text-gray-900">
                  {(invoice.amount * 1.2).toLocaleString('fr-FR', { style: 'currency', currency: invoice.currency })}
                </td>
              </tr>
            </tfoot>
          </table>
        </div>
      </div>
    </div>
  );
};

export default InvoiceDetails;