import { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useLanguage } from '../../contexts/LanguageContext';
import {
  ArrowLeft,
  Download,
  CreditCard,
  FileText,
  Building,
  Calendar,
  Check,
  Clock,
  AlertTriangle
} from 'lucide-react';
import { format } from 'date-fns';

const InvoiceDetails = () => {
  const { id } = useParams();
  const { t } = useLanguage();
  const [invoice] = useState({
    id: 'INV-2024-001',
    number: 'INV-2024-001',
    amount: 2500.00,
    currency: 'XOF',
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
      name: 'Cheikh Client',
      company: 'Demo Enterprise',
      address: '456 Avenue du Commerce',
      city: 'Lyon',
      postalCode: '69001',
      country: 'France',
      vatNumber: 'FR98765432109'
    }
  });

  const getStatusInfo = (status) => {
    switch (status) {
      case 'paid':
        return {
          color: 'bg-green-100 text-green-800 border-green-200',
          icon: <Check size={14} className="mr-1.5" />,
          label: 'Payée'
        };
      case 'unpaid':
        return {
          color: 'bg-yellow-100 text-yellow-800 border-yellow-200',
          icon: <Clock size={14} className="mr-1.5" />,
          label: 'Non payée'
        };
      case 'overdue':
        return {
          color: 'bg-red-100 text-red-800 border-red-200',
          icon: <AlertTriangle size={14} className="mr-1.5" />,
          label: 'En retard'
        };
      default:
        return {
          color: 'bg-gray-100 text-gray-800 border-gray-200',
          icon: null,
          label: status
        };
    }
  };

  const statusInfo = getStatusInfo(invoice.status);
  const totalHT = invoice.amount;
  const tva = totalHT * 0.2;
  const totalTTC = totalHT * 1.2;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <Link to="/invoices" className="inline-flex items-center text-sm font-medium text-blue-600 hover:text-blue-800 transition">
            <ArrowLeft size={16} className="mr-1.5" />
            Retour aux factures
          </Link>
          <h1 className="mt-2 text-2xl md:text-3xl font-bold text-gray-900">Facture {invoice.number}</h1>
        </div>
        <div className="flex flex-col sm:flex-row gap-3">
          <button
            type="button"
            className="inline-flex items-center justify-center px-4 py-2.5 border border-gray-300 shadow-sm text-sm font-medium rounded-lg text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
          >
            <Download size={16} className="mr-2" />
            Télécharger PDF
          </button>
          {invoice.status !== 'paid' && (
            <button
              type="button"
              className="inline-flex items-center justify-center px-4 py-2.5 border border-transparent shadow-sm text-sm font-medium rounded-lg text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
            >
              <CreditCard size={16} className="mr-2" />
              Payer maintenant
            </button>
          )}
        </div>
      </div>

      <div className="bg-white shadow rounded-xl border border-gray-200 overflow-hidden">
        {/* En-tête de la facture */}
        <div className="px-6 py-5 border-b border-gray-200 bg-gray-50">
          <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
            <div>
              <div className="flex items-center">
                <div className="flex-shrink-0 bg-blue-100 rounded-lg p-2 mr-3">
                  <FileText size={24} className="text-blue-600" />
                </div>
                <div>
                  <h2 className="text-xl font-semibold text-gray-900">Facture #{invoice.number}</h2>
                  <p className="mt-1 text-sm text-gray-500">
                    Expédition: <span className="font-medium text-gray-700">{invoice.shipmentId}</span>
                  </p>
                </div>
              </div>
            </div>
            <span className={`inline-flex items-center px-3 py-1.5 rounded-full text-xs font-medium border ${statusInfo.color}`}>
              {statusInfo.icon}
              {statusInfo.label}
            </span>
          </div>
        </div>

        {/* Informations de l'entreprise et du client */}
        <div className="px-6 py-6 border-b border-gray-200 grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="bg-gray-50 rounded-lg p-4">
            <div className="flex items-center mb-3">
              <Building size={18} className="text-gray-500 mr-2" />
              <h3 className="text-sm font-medium text-gray-900">De</h3>
            </div>
            <div className="text-sm text-gray-600 space-y-1">
              <p className="font-medium text-gray-900">{invoice.company.name}</p>
              <p>{invoice.company.address}</p>
              <p>{invoice.company.postalCode} {invoice.company.city}</p>
              <p>{invoice.company.country}</p>
              <p className="mt-2 pt-2 border-t border-gray-200">TVA: <span className="font-medium">{invoice.company.vatNumber}</span></p>
            </div>
          </div>
          <div className="bg-gray-50 rounded-lg p-4">
            <div className="flex items-center mb-3">
              <Building size={18} className="text-gray-500 mr-2" />
              <h3 className="text-sm font-medium text-gray-900">Facturer à</h3>
            </div>
            <div className="text-sm text-gray-600 space-y-1">
              <p className="font-medium text-gray-900">{invoice.client.company}</p>
              <p>{invoice.client.name}</p>
              <p>{invoice.client.address}</p>
              <p>{invoice.client.postalCode} {invoice.client.city}</p>
              <p>{invoice.client.country}</p>
              <p className="mt-2 pt-2 border-t border-gray-200">TVA: <span className="font-medium">{invoice.client.vatNumber}</span></p>
            </div>
          </div>
        </div>

        {/* Dates importantes */}
        <div className="px-6 py-5 border-b border-gray-200 bg-white">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div className="flex items-start sm:items-center">
              <div className="bg-blue-50 rounded-md p-2 mr-3">
                <Calendar size={18} className="text-blue-600" />
              </div>
              <div>
                <h3 className="text-sm font-medium text-gray-900">Date d'émission</h3>
                <p className="mt-1 text-sm text-gray-600">
                  {format(new Date(invoice.issuedDate), 'dd/MM/yyyy')}
                </p>
              </div>
            </div>
            <div className="flex items-start sm:items-center">
              <div className="bg-blue-50 rounded-md p-2 mr-3">
                <Calendar size={18} className="text-blue-600" />
              </div>
              <div>
                <h3 className="text-sm font-medium text-gray-900">Date d'échéance</h3>
                <p className="mt-1 text-sm text-gray-600">
                  {format(new Date(invoice.dueDate), 'dd/MM/yyyy')}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Détails des articles */}
        <div className="px-4 sm:px-6 py-6">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead>
                <tr>
                  <th scope="col" className="text-left text-xs font-medium text-gray-500 uppercase tracking-wider py-3 px-4">Description</th>
                  <th scope="col" className="text-right text-xs font-medium text-gray-500 uppercase tracking-wider py-3 px-4">Quantité</th>
                  <th scope="col" className="text-right text-xs font-medium text-gray-500 uppercase tracking-wider py-3 px-4">Prix unitaire</th>
                  <th scope="col" className="text-right text-xs font-medium text-gray-500 uppercase tracking-wider py-3 px-4">Total</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 bg-white">
                {invoice.items.map((item) => (
                  <tr key={item.id} className="hover:bg-gray-50">
                    <td className="py-4 px-4 text-sm text-gray-900">{item.description}</td>
                    <td className="py-4 px-4 text-sm text-gray-900 text-right">{item.quantity}</td>
                    <td className="py-4 px-4 text-sm text-gray-900 text-right">
                      {item.unitPrice.toLocaleString('fr-FR', { style: 'currency', currency: invoice.currency })}
                    </td>
                    <td className="py-4 px-4 text-sm font-medium text-gray-900 text-right">
                      {item.total.toLocaleString('fr-FR', { style: 'currency', currency: invoice.currency })}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="mt-8 border-t border-gray-200 pt-6">
            <div className="flex flex-col items-end">
              <div className="w-full max-w-xs space-y-2">
                <div className="flex justify-between py-2 text-sm">
                  <span className="font-medium text-gray-700">Total HT</span>
                  <span className="text-gray-900">
                    {totalHT.toLocaleString('fr-FR', { style: 'currency', currency: invoice.currency })}
                  </span>
                </div>
                <div className="flex justify-between py-2 text-sm border-b border-gray-200">
                  <span className="font-medium text-gray-700">TVA (20%)</span>
                  <span className="text-gray-900">
                    {tva.toLocaleString('fr-FR', { style: 'currency', currency: invoice.currency })}
                  </span>
                </div>
                <div className="flex justify-between py-2 text-base">
                  <span className="font-bold text-gray-900">Total TTC</span>
                  <span className="font-bold text-gray-900">
                    {totalTTC.toLocaleString('fr-FR', { style: 'currency', currency: invoice.currency })}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Pied de page
        <div className="px-6 py-4 bg-gray-50 border-t border-gray-200 text-xs text-gray-500 text-center">
          Merci pour votre confiance. Pour toute question concernant cette facture, veuillez nous contacter.
        </div>*/}
      </div>
    </div>
  );
};

export default InvoiceDetails;