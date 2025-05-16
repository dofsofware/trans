import { useState, useEffect } from 'react';
import { getMockShipments } from '../../services/shipmentService';
import { Shipment, Document } from '../../types/shipment';
import { useAuth } from '../../contexts/AuthContext';
import { FileText, Download, Plus, Search, ChevronDown, Filter } from 'lucide-react';
import { format } from 'date-fns';

const DocumentsPage = () => {
  const { user } = useAuth();
  const [documents, setDocuments] = useState([]);
  const [filteredDocuments, setFilteredDocuments] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [shipmentMap, setShipmentMap] = useState({});
  const [searchTerm, setSearchTerm] = useState('');
  const [activeFilter, setActiveFilter] = useState('all');
  const [sortConfig, setSortConfig] = useState({ key: 'uploadedAt', direction: 'desc' });

  useEffect(() => {
    const fetchDocuments = async () => {
      try {
        if (user) {
          const shipments = await getMockShipments(user.id);

          // Create a map of shipment IDs to shipments for easy lookup
          const shipmentMapData = {};
          shipments.forEach(shipment => {
            shipmentMapData[shipment.id] = shipment;
          });
          setShipmentMap(shipmentMapData);

          // Collect all documents from all shipments
          const allDocuments = shipments.flatMap(shipment => shipment.documents);
          setDocuments(allDocuments);
          setFilteredDocuments(allDocuments);
        }
      } catch (error) {
        console.error('Error fetching documents:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchDocuments();
  }, [user]);

  // Apply filters and search
  useEffect(() => {
    let result = [...documents];

    // Apply document type filter
    if (activeFilter !== 'all') {
      result = result.filter(doc => doc.type === activeFilter);
    }

    // Apply search
    if (searchTerm) {
      const lowerSearchTerm = searchTerm.toLowerCase();
      result = result.filter(doc =>
        doc.name.toLowerCase().includes(lowerSearchTerm) ||
        (shipmentMap[doc.shipmentId]?.reference || '').toLowerCase().includes(lowerSearchTerm)
      );
    }

    // Apply sorting
    result.sort((a, b) => {
      let comparison = 0;
      if (sortConfig.key === 'uploadedAt') {
        comparison = new Date(a.uploadedAt) - new Date(b.uploadedAt);
      } else if (sortConfig.key === 'name') {
        comparison = a.name.localeCompare(b.name);
      } else if (sortConfig.key === 'type') {
        comparison = a.type.localeCompare(b.type);
      } else if (sortConfig.key === 'shipment') {
        const shipmentA = shipmentMap[a.shipmentId]?.reference || '';
        const shipmentB = shipmentMap[b.shipmentId]?.reference || '';
        comparison = shipmentA.localeCompare(shipmentB);
      }

      return sortConfig.direction === 'asc' ? comparison : -comparison;
    });

    setFilteredDocuments(result);
  }, [documents, activeFilter, searchTerm, sortConfig, shipmentMap]);

  const handleSort = (key) => {
    setSortConfig(prevConfig => ({
      key,
      direction: prevConfig.key === key && prevConfig.direction === 'asc' ? 'desc' : 'asc'
    }));
  };

  const documentTypeLabels = {
    invoice: 'Invoice',
    customs: 'Customs Declaration',
    bill_of_lading: 'Bill of Lading',
    certificate: 'Certificate',
    other: 'Other Document'
  };

  const filterOptions = [
    { value: 'all', label: 'All Documents' },
    { value: 'invoice', label: 'Invoices' },
    { value: 'customs', label: 'Customs Declarations' },
    { value: 'bill_of_lading', label: 'Bills of Lading' },
    { value: 'certificate', label: 'Certificates' },
    { value: 'other', label: 'Other Documents' }
  ];

  const renderSortIcon = (key) => {
    if (sortConfig.key !== key) return null;
    return (
      <ChevronDown
        size={16}
        className={`ml-1 transition-transform ${sortConfig.direction === 'asc' ? 'transform rotate-180' : ''}`}
      />
    );
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
      <div className="mb-6 md:mb-8 flex flex-col md:flex-row md:justify-between md:items-center gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-gray-900">Documents</h1>
          <p className="mt-1 text-sm md:text-base text-gray-600">Manage all your shipment documents</p>
        </div>
      </div>

      {/* Search and Filter Controls */}
      <div className="mb-6 flex flex-col sm:flex-row gap-4">
        <div className="relative flex-grow">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Search size={18} className="text-gray-400" />
          </div>
          <input
            type="text"
            placeholder="Search documents..."
            className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 text-sm"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <div className="relative w-full sm:w-64">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Filter size={18} className="text-gray-400" />
          </div>
          <select
            value={activeFilter}
            onChange={(e) => setActiveFilter(e.target.value)}
            className="block w-full pl-10 pr-10 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 text-sm appearance-none bg-white"
          >
            {filterOptions.map(option => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
          <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
            <ChevronDown size={16} className="text-gray-400" />
          </div>
        </div>
      </div>

      {isLoading ? (
        <div className="flex justify-center items-center h-64 bg-white shadow rounded-lg border border-gray-200">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
        </div>
      ) : (
        <>
          {filteredDocuments.length > 0 ? (
            <>
              {/* Desktop table view - hidden on mobile */}
              <div className="hidden md:block bg-white shadow rounded-lg border border-gray-200 overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th
                          scope="col"
                          className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                          onClick={() => handleSort('name')}
                        >
                          <div className="flex items-center">
                            Document
                            {renderSortIcon('name')}
                          </div>
                        </th>
                        <th
                          scope="col"
                          className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                          onClick={() => handleSort('shipment')}
                        >
                          <div className="flex items-center">
                            Shipment
                            {renderSortIcon('shipment')}
                          </div>
                        </th>
                        <th
                          scope="col"
                          className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                          onClick={() => handleSort('type')}
                        >
                          <div className="flex items-center">
                            Type
                            {renderSortIcon('type')}
                          </div>
                        </th>
                        <th
                          scope="col"
                          className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                          onClick={() => handleSort('uploadedAt')}
                        >
                          <div className="flex items-center">
                            Uploaded
                            {renderSortIcon('uploadedAt')}
                          </div>
                        </th>
                        <th scope="col" className="relative px-6 py-3">
                          <span className="sr-only">Actions</span>
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {filteredDocuments.map((document) => (
                        <tr key={`desktop-${document.id}`} className="hover:bg-gray-50 transition-colors">
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="flex items-center">
                              <div className="flex-shrink-0 h-8 w-8 flex items-center justify-center bg-blue-100 rounded-md">
                                <FileText size={16} className="text-blue-600" />
                              </div>
                              <div className="ml-3 truncate max-w-xs">
                                <div className="text-sm font-medium text-gray-900">
                                  {document.name}
                                </div>
                              </div>
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm text-gray-900 truncate max-w-xs">
                              {shipmentMap[document.shipmentId]?.reference || document.shipmentId}
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-blue-100 text-blue-800">
                              {documentTypeLabels[document.type]}
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {format(new Date(document.uploadedAt), 'MMM d, yyyy')}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                            <button
                              type="button"
                              className="inline-flex items-center text-blue-600 hover:text-blue-900 transition-colors"
                            >
                              <Download size={16} className="mr-1" />
                              <span>Download</span>
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Mobile card view - shown only on mobile */}
              <div className="md:hidden space-y-4">
                <div className="bg-white shadow rounded-lg overflow-hidden border border-gray-200 p-4">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-sm font-medium text-gray-700">Sort by</h3>
                    <div className="relative w-40">
                      <select
                        value={sortConfig.key}
                        onChange={(e) => setSortConfig({ key: e.target.value, direction: sortConfig.direction })}
                        className="block w-full pr-10 py-2 text-sm border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 appearance-none bg-white"
                      >
                        <option value="name">Document Name</option>
                        <option value="shipment">Shipment</option>
                        <option value="type">Document Type</option>
                        <option value="uploadedAt">Upload Date</option>
                      </select>
                      <div className="absolute inset-y-0 right-0 pr-3 flex items-center">
                        <button
                          onClick={() => setSortConfig(prev => ({ ...prev, direction: prev.direction === 'asc' ? 'desc' : 'asc' }))}
                          className="focus:outline-none"
                        >
                          <ChevronDown
                            size={16}
                            className={`text-gray-400 transition-transform ${sortConfig.direction === 'asc' ? 'transform rotate-180' : ''}`}
                          />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>

                {filteredDocuments.map((document) => (
                  <div
                    key={`mobile-${document.id}`}
                    className="bg-white shadow rounded-lg overflow-hidden border border-gray-200"
                  >
                    <div className="p-4">
                      <div className="flex items-start justify-between">
                        <div className="flex items-center">
                          <div className="h-10 w-10 flex items-center justify-center bg-blue-100 rounded-md">
                            <FileText size={20} className="text-blue-600" />
                          </div>
                          <div className="ml-3">
                            <h3 className="text-sm font-medium text-gray-900 break-words pr-2">
                              {document.name}
                            </h3>
                          </div>
                        </div>
                        <span className="px-2 py-1 text-xs font-semibold rounded-full bg-blue-100 text-blue-800 whitespace-nowrap">
                          {documentTypeLabels[document.type]}
                        </span>
                      </div>

                      <div className="mt-4 grid grid-cols-2 gap-4 text-sm">
                        <div>
                          <p className="text-gray-500 text-xs">Shipment</p>
                          <p className="text-gray-900 font-medium truncate">
                            {shipmentMap[document.shipmentId]?.reference || document.shipmentId}
                          </p>
                        </div>
                        <div>
                          <p className="text-gray-500 text-xs">Uploaded</p>
                          <p className="text-gray-900 font-medium">
                            {format(new Date(document.uploadedAt), 'MMM d, yyyy')}
                          </p>
                        </div>
                      </div>
                    </div>

                    <div className="bg-gray-50 px-4 py-3 flex justify-end">
                      <button
                        type="button"
                        className="inline-flex items-center px-3 py-1 border border-transparent text-sm rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
                      >
                        <Download size={14} className="mr-1" />
                        Download
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </>
          ) : (
            <div className="bg-white shadow rounded-lg border border-gray-200 p-6">
              <div className="text-center py-12">
                <div className="mx-auto h-12 w-12 flex items-center justify-center rounded-full bg-blue-100">
                  <FileText size={24} className="text-blue-600" />
                </div>
                <h3 className="mt-4 text-lg font-medium text-gray-900">Aucun document trouvé</h3>
                <p className="mt-2 text-sm text-gray-500">
                  {searchTerm || activeFilter !== 'all'
                    ? "Aucun document ne correspond à vos critères de recherche."
                    : "Vous n'avez pas encore de documents associés à vos expéditions."}
                </p>
                <div className="mt-6">
                  <button
                    type="button"
                    className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
                  >
                    <Plus size={16} className="mr-2" />
                    Upload a Document
                  </button>
                </div>
              </div>
            </div>
          )}
        </>
      )}

      {/* Document count display */}
      {filteredDocuments.length > 0 && (
        <div className="mt-4 text-sm text-gray-500 text-right">
          Showing {filteredDocuments.length} {filteredDocuments.length === 1 ? 'document' : 'documents'}
          {(searchTerm || activeFilter !== 'all') && ' (filtered)'}
        </div>
      )}
    </div>
  );
};

export default DocumentsPage;