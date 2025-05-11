import { useState, useEffect } from 'react';
import { getMockShipments } from '../../services/shipmentService';
import { Shipment, Document } from '../../types/shipment';
import { useAuth } from '../../contexts/AuthContext';
import { FileText, Download, Plus } from 'lucide-react';
import { format } from 'date-fns';

const DocumentsPage = () => {
  const { user } = useAuth();
  const [documents, setDocuments] = useState<Document[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [shipmentMap, setShipmentMap] = useState<Record<string, Shipment>>({});

  useEffect(() => {
    const fetchDocuments = async () => {
      try {
        if (user) {
          const shipments = await getMockShipments(user.id);
          
          // Create a map of shipment IDs to shipments for easy lookup
          const shipmentMapData: Record<string, Shipment> = {};
          shipments.forEach(shipment => {
            shipmentMapData[shipment.id] = shipment;
          });
          setShipmentMap(shipmentMapData);
          
          // Collect all documents from all shipments
          const allDocuments = shipments.flatMap(shipment => shipment.documents);
          setDocuments(allDocuments);
        }
      } catch (error) {
        console.error('Error fetching documents:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchDocuments();
  }, [user]);

  const documentTypeLabels = {
    invoice: 'Invoice',
    customs: 'Customs Declaration',
    bill_of_lading: 'Bill of Lading',
    certificate: 'Certificate',
    other: 'Other Document'
  };

  return (
    <div>
      <div className="mb-8 flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Documents</h1>
          <p className="mt-1 text-gray-600">Manage all your shipment documents</p>
        </div>
        {/*<button
          type="button"
          className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
        >
          <Plus size={16} className="mr-2" />
          Upload New Document
        </button>*/}
      </div>

      {isLoading ? (
        <div className="flex justify-center items-center h-64">
          <div className="spinner"></div>
        </div>
      ) : (
        <>
          {documents.length > 0 ? (
            <div className="bg-white shadow overflow-hidden sm:rounded-lg border border-gray-200">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Document
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Shipment
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Type
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Uploaded
                    </th>
                    <th scope="col" className="relative px-6 py-3">
                      <span className="sr-only">Actions</span>
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {documents.map((document) => (
                    <tr key={document.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <FileText size={18} className="text-gray-400 mr-2" />
                          <div className="text-sm font-medium text-gray-900">
                            {document.name}
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">
                          {shipmentMap[document.shipmentId]?.reference || document.shipmentId}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">
                          {documentTypeLabels[document.type]}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {format(new Date(document.uploadedAt), 'MMM d, yyyy')}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <button
                          type="button"
                          className="inline-flex items-center text-blue-600 hover:text-blue-900"
                        >
                          <Download size={16} className="mr-1" />
                          Download
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="bg-white shadow overflow-hidden sm:rounded-lg border border-gray-200 p-6">
              <div className="text-center">
                <FileText size={48} className="mx-auto text-gray-400" />
                <h3 className="mt-2 text-sm font-medium text-gray-900">No documents</h3>
                <p className="mt-1 text-sm text-gray-500">
                  You don't have any documents associated with your shipments yet.
                </p>
                <div className="mt-6">
                  <button
                    type="button"
                    className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                  >
                    <Plus size={16} className="-ml-1 mr-2" />
                    Upload a Document
                  </button>
                </div>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default DocumentsPage;