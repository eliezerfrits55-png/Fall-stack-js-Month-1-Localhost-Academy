import { useState, useMemo, useCallback } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useBank } from '../../context/BankContext';

// Configuration
const CURRENCY = 'XAF';
const ITEMS_PER_PAGE = 10;
const TRANSACTION_TYPES = {
  deposit: { 
    label: 'Deposit', 
    icon: 'M5 10l7-7m0 0l7 7m-7-7v18',
    style: 'bg-green-100 text-green-800 border-green-300',
    amountStyle: 'text-green-600',
    prefix: '+'
  },
  withdrawal: { 
    label: 'Withdrawal', 
    icon: 'M19 14l-7 7m0 0l-7-7m7 7V3',
    style: 'bg-red-100 text-red-800 border-red-300',
    amountStyle: 'text-red-600',
    prefix: '-'
  },
  transfer: { 
    label: 'Transfer', 
    icon: 'M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4',
    style: 'bg-blue-100 text-blue-800 border-blue-300',
    amountStyle: 'text-blue-600',
    prefix: '↔'
  },
  payment: { 
    label: 'Payment', 
    icon: 'M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2z',
    style: 'bg-purple-100 text-purple-800 border-purple-300',
    amountStyle: 'text-purple-600',
    prefix: '-'
  },
  default: {
    label: 'Transaction',
    icon: 'M13 7h8m0 0v8m0-8l-8 8-4-4-6 6',
    style: 'bg-gray-100 text-gray-800 border-gray-300',
    amountStyle: 'text-gray-600',
    prefix: ''
  }
};

const ClientTransactions = () => {
  const { user, isLoading: authLoading, error: authError } = useAuth();
  const { 
    getTransactionsByUserId,
    getAccountsByUserId,
    isLoading: bankLoading,
    error: bankError 
  } = useBank();
  
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState('all');
  const [filterAccount, setFilterAccount] = useState('all');
  const [currentPage, setCurrentPage] = useState(1);
  const [sortConfig, setSortConfig] = useState({ key: 'date', direction: 'desc' });
  const [selectedTransaction, setSelectedTransaction] = useState(null);

  // Mémoïsation des données
  const allTransactions = useMemo(() => 
    getTransactionsByUserId(user?.id) || [], 
    [getTransactionsByUserId, user?.id]
  );

  const userAccounts = useMemo(() => 
    getAccountsByUserId(user?.id) || [],
    [getAccountsByUserId, user?.id]
  );

  // Enrichissement et filtrage des transactions
  const processedTransactions = useMemo(() => {
    return allTransactions
      .map(transaction => ({
        ...transaction,
        formattedDate: formatTransactionDate(transaction.date),
        formattedAmount: Math.abs(transaction.amount).toLocaleString('fr-FR'),
        typeConfig: TRANSACTION_TYPES[transaction.type] || TRANSACTION_TYPES.default,
        accountName: userAccounts.find(acc => acc.id === transaction.accountId)?.accountType || 'N/A',
        isIncoming: ['deposit', 'refund'].includes(transaction.type)
      }))
      .filter(transaction => {
        const matchesSearch = !searchTerm || 
          transaction.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          transaction.id?.toLowerCase().includes(searchTerm.toLowerCase());
        
        const matchesType = filterType === 'all' || transaction.type === filterType;
        const matchesAccount = filterAccount === 'all' || transaction.accountId === filterAccount;
        
        return matchesSearch && matchesType && matchesAccount;
      })
      .sort((a, b) => {
        if (sortConfig.key === 'date') {
          return sortConfig.direction === 'asc' 
            ? new Date(a.date) - new Date(b.date)
            : new Date(b.date) - new Date(a.date);
        }
        
        if (sortConfig.key === 'amount') {
          return sortConfig.direction === 'asc' 
            ? a.amount - b.amount
            : b.amount - a.amount;
        }
        
        return 0;
      });
  }, [allTransactions, userAccounts, searchTerm, filterType, filterAccount, sortConfig]);

  // Pagination
  const totalPages = Math.ceil(processedTransactions.length / ITEMS_PER_PAGE);
  const paginatedTransactions = useMemo(() => {
    const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
    return processedTransactions.slice(startIndex, startIndex + ITEMS_PER_PAGE);
  }, [processedTransactions, currentPage]);

  // Statistiques
  const stats = useMemo(() => {
    const totalCredits = allTransactions
      .filter(t => t.type === 'deposit')
      .reduce((sum, t) => sum + t.amount, 0);
    
    const totalDebits = allTransactions
      .filter(t => ['withdrawal', 'payment'].includes(t.type))
      .reduce((sum, t) => sum + t.amount, 0);

    return {
      totalTransactions: allTransactions.length,
      totalCredits,
      totalDebits,
      netFlow: totalCredits - totalDebits
    };
  }, [allTransactions]);

  // Formatage de date intelligent
  function formatTransactionDate(dateString) {
    if (!dateString) return 'N/A';
    
    try {
      const date = new Date(dateString);
      const now = new Date();
      const diffTime = Math.abs(now - date);
      const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
      
      const timeString = date.toLocaleTimeString('fr-FR', { 
        hour: '2-digit', 
        minute: '2-digit' 
      });
      
      if (diffDays === 0) return `Today, ${timeString}`;
      if (diffDays === 1) return `Yesterday, ${timeString}`;
      if (diffDays < 7) return `${diffDays} days ago, ${timeString}`;
      
      return date.toLocaleDateString('fr-FR', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      });
    } catch {
      return 'Invalid date';
    }
  }

  // Gestionnaire de tri
  const handleSort = useCallback((key) => {
    setSortConfig(prev => ({
      key,
      direction: prev.key === key && prev.direction === 'asc' ? 'desc' : 'asc'
    }));
  }, []);

  // Gestionnaire de page
  const handlePageChange = useCallback((page) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  // Réinitialiser la page lors du changement de filtre
  const handleFilterChange = useCallback((setter) => (value) => {
    setter(value);
    setCurrentPage(1);
  }, []);

  // États de chargement et d'erreur
  if (authLoading || bankLoading) {
    return (
      <div className="flex flex-col justify-center items-center h-64 space-y-4" role="status">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        <p className="text-gray-600">Loading transactions...</p>
      </div>
    );
  }

  if (authError || bankError) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-lg p-6" role="alert">
        <h2 className="text-lg font-semibold text-red-800 mb-2">Error Loading Transactions</h2>
        <p className="text-red-600 mb-4">{authError || bankError}</p>
        <button 
          onClick={() => window.location.reload()} 
          className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700"
        >
          Retry
        </button>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6 text-center" role="alert">
        <h2 className="text-lg font-semibold text-yellow-800 mb-2">Session Expired</h2>
        <p className="text-yellow-600">Please log in again to view your transactions.</p>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto">
      {/* En-tête */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 space-y-4 sm:space-y-0">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Transaction History</h1>
          <p className="text-gray-600 mt-1">
            Track your financial activity
          </p>
        </div>
        
        {allTransactions.length > 0 && (
          <button
            onClick={() => window.print()}
            className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-lg text-gray-700 bg-white hover:bg-gray-50 transition-colors"
          >
            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} 
                d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z" />
            </svg>
            Export
          </button>
        )}
      </div>

      {/* Résumé financier */}
      {allTransactions.length > 0 && (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          <div className="bg-white rounded-lg p-4 border">
            <p className="text-sm text-gray-600">Total Transactions</p>
            <p className="text-2xl font-bold text-gray-900">{stats.totalTransactions}</p>
          </div>
          <div className="bg-white rounded-lg p-4 border">
            <p className="text-sm text-gray-600">Total Credits</p>
            <p className="text-2xl font-bold text-green-600">
              +{stats.totalCredits.toLocaleString('fr-FR')} {CURRENCY}
            </p>
          </div>
          <div className="bg-white rounded-lg p-4 border">
            <p className="text-sm text-gray-600">Total Debits</p>
            <p className="text-2xl font-bold text-red-600">
              -{stats.totalDebits.toLocaleString('fr-FR')} {CURRENCY}
            </p>
          </div>
          <div className="bg-white rounded-lg p-4 border">
            <p className="text-sm text-gray-600">Net Flow</p>
            <p className={`text-2xl font-bold ${stats.netFlow >= 0 ? 'text-green-600' : 'text-red-600'}`}>
              {stats.netFlow >= 0 ? '+' : ''}{stats.netFlow.toLocaleString('fr-FR')} {CURRENCY}
            </p>
          </div>
        </div>
      )}

      {/* Filtres et recherche */}
      <div className="bg-white rounded-lg shadow-sm border p-4 mb-6">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div>
            <label htmlFor="search-transactions" className="sr-only">Search transactions</label>
            <div className="relative">
              <svg className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
              <input
                id="search-transactions"
                type="text"
                placeholder="Search transactions..."
                value={searchTerm}
                onChange={(e) => handleFilterChange(setSearchTerm)(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
          </div>
          
          <div>
            <label htmlFor="filter-type" className="sr-only">Filter by type</label>
            <select
              id="filter-type"
              value={filterType}
              onChange={(e) => handleFilterChange(setFilterType)(e.target.value)}
              className="w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="all">All Types</option>
              {Object.entries(TRANSACTION_TYPES).map(([key, config]) => (
                key !== 'default' && (
                  <option key={key} value={key}>{config.label}</option>
                )
              ))}
            </select>
          </div>
          
          <div>
            <label htmlFor="filter-account" className="sr-only">Filter by account</label>
            <select
              id="filter-account"
              value={filterAccount}
              onChange={(e) => handleFilterChange(setFilterAccount)(e.target.value)}
              className="w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="all">All Accounts</option>
              {userAccounts.map(account => (
                <option key={account.id} value={account.id}>
                  {account.accountType} ({account.id})
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Tableau des transactions */}
      {paginatedTransactions.length === 0 ? (
        <div className="bg-white rounded-lg shadow-sm border p-12 text-center">
          <svg className="mx-auto h-12 w-12 text-gray-400 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} 
              d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" 
            />
          </svg>
          <h3 className="text-lg font-medium text-gray-900 mb-2">No transactions found</h3>
          <p className="text-gray-500">
            {allTransactions.length === 0 
              ? "You haven't made any transactions yet."
              : "No transactions match your current filters."}
          </p>
        </div>
      ) : (
        <>
          {/* Vue mobile */}
          <div className="block lg:hidden space-y-4">
            {paginatedTransactions.map(transaction => (
              <div 
                key={transaction.id}
                className="bg-white rounded-lg shadow-sm border p-4 hover:shadow-md transition-shadow"
                onClick={() => setSelectedTransaction(transaction)}
              >
                <div className="flex justify-between items-start mb-3">
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${transaction.typeConfig.style}`}>
                    {transaction.typeConfig.label}
                  </span>
                  <span className="text-sm text-gray-500">{transaction.formattedDate}</span>
                </div>
                
                <p className="font-medium text-gray-900 mb-2">{transaction.description}</p>
                
                <div className="flex justify-between items-baseline">
                  <span className="text-sm text-gray-500">{transaction.accountName}</span>
                  <span className={`text-lg font-bold ${transaction.typeConfig.amountStyle}`}>
                    {transaction.typeConfig.prefix}{transaction.formattedAmount} {CURRENCY}
                  </span>
                </div>
              </div>
            ))}
          </div>

          {/* Vue desktop */}
          <div className="hidden lg:block bg-white rounded-lg shadow-sm border overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full" role="table">
                <thead className="bg-gray-50 border-b">
                  <tr>
                    <th 
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                      onClick={() => handleSort('date')}
                    >
                      <div className="flex items-center">
                        Date
                        {sortConfig.key === 'date' && (
                          <svg className={`w-4 h-4 ml-1 ${sortConfig.direction === 'desc' ? '' : 'transform rotate-180'}`} 
                            fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
                          </svg>
                        )}
                      </div>
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Description
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Account
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Type
                    </th>
                    <th 
                      className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                      onClick={() => handleSort('amount')}
                    >
                      <div className="flex items-center justify-end">
                        Amount
                        {sortConfig.key === 'amount' && (
                          <svg className={`w-4 h-4 ml-1 ${sortConfig.direction === 'desc' ? '' : 'transform rotate-180'}`} 
                            fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
                          </svg>
                        )}
                      </div>
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {paginatedTransactions.map(transaction => (
                    <tr 
                      key={transaction.id}
                      className="hover:bg-gray-50 transition-colors cursor-pointer"
                      onClick={() => setSelectedTransaction(transaction)}
                    >
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {transaction.formattedDate}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-900">
                        <div className="max-w-xs truncate">
                          {transaction.description}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {transaction.accountName}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${transaction.typeConfig.style}`}>
                          <svg className="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={transaction.typeConfig.icon} />
                          </svg>
                          {transaction.typeConfig.label}
                        </span>
                      </td>
                      <td className={`px-6 py-4 whitespace-nowrap text-sm font-semibold text-right ${transaction.typeConfig.amountStyle}`}>
                        {transaction.typeConfig.prefix}{transaction.formattedAmount} {CURRENCY}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex items-center justify-between bg-white px-4 py-3 border-t sm:px-6 mt-4 rounded-lg shadow-sm">
              <div className="flex-1 flex justify-between sm:hidden">
                <button
                  onClick={() => handlePageChange(currentPage - 1)}
                  disabled={currentPage === 1}
                  className="relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Previous
                </button>
                <button
                  onClick={() => handlePageChange(currentPage + 1)}
                  disabled={currentPage === totalPages}
                  className="ml-3 relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Next
                </button>
              </div>
              <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
                <div>
                  <p className="text-sm text-gray-700">
                    Showing <span className="font-medium">{(currentPage - 1) * ITEMS_PER_PAGE + 1}</span> to{' '}
                    <span className="font-medium">
                      {Math.min(currentPage * ITEMS_PER_PAGE, processedTransactions.length)}
                    </span> of{' '}
                    <span className="font-medium">{processedTransactions.length}</span> results
                  </p>
                </div>
                <div>
                  <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px" aria-label="Pagination">
                    <button
                      onClick={() => handlePageChange(currentPage - 1)}
                      disabled={currentPage === 1}
                      className="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      <span className="sr-only">Previous</span>
                      <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                      </svg>
                    </button>
                    
                    {[...Array(totalPages)].map((_, index) => (
                      <button
                        key={index}
                        onClick={() => handlePageChange(index + 1)}
                        className={`relative inline-flex items-center px-4 py-2 border text-sm font-medium ${
                          currentPage === index + 1
                            ? 'z-10 bg-blue-50 border-blue-500 text-blue-600'
                            : 'bg-white border-gray-300 text-gray-500 hover:bg-gray-50'
                        }`}
                      >
                        {index + 1}
                      </button>
                    ))}
                    
                    <button
                      onClick={() => handlePageChange(currentPage + 1)}
                      disabled={currentPage === totalPages}
                      className="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      <span className="sr-only">Next</span>
                      <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                      </svg>
                    </button>
                  </nav>
                </div>
              </div>
            </div>
          )}
        </>
      )}

      {/* Modal de détails de transaction */}
      {selectedTransaction && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4" onClick={() => setSelectedTransaction(null)}>
          <div className="bg-white rounded-xl p-6 max-w-md w-full" onClick={e => e.stopPropagation()} role="dialog" aria-modal="true">
            <div className="flex justify-between items-start mb-4">
              <h2 className="text-xl font-bold text-gray-900">Transaction Details</h2>
              <button
                onClick={() => setSelectedTransaction(null)}
                className="text-gray-400 hover:text-gray-600"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            
            <div className="space-y-3">
              <div>
                <p className="text-sm text-gray-500">Transaction ID</p>
                <p className="font-mono text-sm">{selectedTransaction.id}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Date</p>
                <p className="font-medium">{selectedTransaction.formattedDate}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Description</p>
                <p className="font-medium">{selectedTransaction.description}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Type</p>
                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${selectedTransaction.typeConfig.style}`}>
                  {selectedTransaction.typeConfig.label}
                </span>
              </div>
              <div>
                <p className="text-sm text-gray-500">Amount</p>
                <p className={`text-lg font-bold ${selectedTransaction.typeConfig.amountStyle}`}>
                  {selectedTransaction.typeConfig.prefix}{selectedTransaction.formattedAmount} {CURRENCY}
                </p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ClientTransactions;