import { useMemo } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useBank } from '../../context/BankContext';

// Constantes pour la configuration
const CURRENCY = 'XAF';
const RECENT_TRANSACTIONS_LIMIT = 5;

const ClientDashboard = () => {
  const { user, isLoading: authLoading, error: authError } = useAuth();
  const { 
    getAccountsByUserId, 
    getTransactionsByUserId,
    isLoading: bankLoading,
    error: bankError 
  } = useBank();
  
  // Mémoïsation des données pour éviter les recalculs inutiles
  const accounts = useMemo(() => 
    getAccountsByUserId(user?.id) || [], 
    [getAccountsByUserId, user?.id]
  );
  
  const transactions = useMemo(() => 
    getTransactionsByUserId(user?.id) || [], 
    [getTransactionsByUserId, user?.id]
  );
  
  // Calculs mémoïsés
  const dashboardStats = useMemo(() => {
    const totalBalance = accounts.reduce((sum, acc) => sum + (acc.balance || 0), 0);
    const activeAccounts = accounts.filter(acc => acc.status === 'active').length;
    
    return {
      totalBalance,
      activeAccounts,
      totalAccounts: accounts.length,
      totalTransactions: transactions.length
    };
  }, [accounts, transactions]);
  
  const recentTransactions = useMemo(() => 
    transactions
      .slice(-RECENT_TRANSACTIONS_LIMIT)
      .reverse()
      .map(trx => ({
        ...trx,
        formattedDate: formatTransactionDate(trx.date),
        isDeposit: trx.type === 'deposit' || trx.amount > 0
      })),
    [transactions]
  );

  // Fonction utilitaire pour formater les dates
  function formatTransactionDate(dateString) {
    if (!dateString) return 'N/A';
    
    try {
      const date = new Date(dateString);
      const now = new Date();
      const diffTime = Math.abs(now - date);
      const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
      
      if (diffDays === 0) {
        return `Today at ${date.toLocaleTimeString('fr-FR', { 
          hour: '2-digit', 
          minute: '2-digit' 
        })}`;
      } else if (diffDays === 1) {
        return 'Yesterday';
      } else if (diffDays < 7) {
        return `${diffDays} days ago`;
      } else {
        return date.toLocaleDateString('fr-FR', {
          year: 'numeric',
          month: 'short',
          day: 'numeric'
        });
      }
    } catch {
      return 'Invalid date';
    }
  }

  // Gestion des états de chargement et d'erreur
  if (authLoading || bankLoading) {
    return (
      <div className="flex justify-center items-center h-64" role="status">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        <span className="sr-only">Loading...</span>
      </div>
    );
  }

  if (authError || bankError) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-lg p-6" role="alert">
        <h2 className="text-red-800 font-semibold">Error</h2>
        <p className="text-red-600 mt-2">
          {authError || bankError || 'An error occurred while loading your dashboard'}
        </p>
        <button 
          onClick={() => window.location.reload()} 
          className="mt-4 bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700"
        >
          Retry
        </button>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6" role="alert">
        <h2 className="text-yellow-800 font-semibold">Session Expired</h2>
        <p className="text-yellow-600 mt-2">Please log in again to access your dashboard.</p>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto">
      {/* En-tête avec message de bienvenue */}
      <header className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">
          Welcome back, <span className="text-blue-600">{user.name}</span>
        </h1>
        <p className="text-gray-600 mt-2">
          Here's your financial overview
        </p>
      </header>
      
      {/* Cartes de statistiques */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8" role="list">
        {/* Solde total */}
        <div 
          className="bg-gradient-to-br from-blue-500 to-blue-600 text-white rounded-xl p-6 shadow-lg hover:shadow-xl transition-shadow"
          role="listitem"
        >
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-medium opacity-90">Total Balance</h3>
            <svg className="w-8 h-8 opacity-80" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} 
                d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" 
              />
            </svg>
          </div>
          <p className="text-3xl font-bold">
            {dashboardStats.totalBalance.toLocaleString('fr-FR')} {CURRENCY}
          </p>
          <p className="text-sm mt-2 opacity-75">
            Across {dashboardStats.totalAccounts} account{dashboardStats.totalAccounts !== 1 ? 's' : ''}
          </p>
        </div>
        
        {/* Comptes actifs */}
        <div 
          className="bg-gradient-to-br from-green-500 to-green-600 text-white rounded-xl p-6 shadow-lg hover:shadow-xl transition-shadow"
          role="listitem"
        >
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-medium opacity-90">Active Accounts</h3>
            <svg className="w-8 h-8 opacity-80" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} 
                d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" 
              />
            </svg>
          </div>
          <p className="text-3xl font-bold">{dashboardStats.activeAccounts}</p>
          <p className="text-sm mt-2 opacity-75">
            {dashboardStats.totalAccounts - dashboardStats.activeAccounts} inactive
          </p>
        </div>
        
        {/* Total des transactions */}
        <div 
          className="bg-gradient-to-br from-purple-500 to-purple-600 text-white rounded-xl p-6 shadow-lg hover:shadow-xl transition-shadow"
          role="listitem"
        >
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-medium opacity-90">Transactions</h3>
            <svg className="w-8 h-8 opacity-80" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} 
                d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" 
              />
            </svg>
          </div>
          <p className="text-3xl font-bold">{dashboardStats.totalTransactions}</p>
          <p className="text-sm mt-2 opacity-75">Total transactions</p>
        </div>
        
        {/* Dernière activité */}
        <div 
          className="bg-gradient-to-br from-orange-500 to-orange-600 text-white rounded-xl p-6 shadow-lg hover:shadow-xl transition-shadow"
          role="listitem"
        >
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-medium opacity-90">Last Activity</h3>
            <svg className="w-8 h-8 opacity-80" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} 
                d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" 
              />
            </svg>
          </div>
          <p className="text-lg font-semibold">
            {recentTransactions.length > 0 
              ? recentTransactions[0].formattedDate 
              : 'No activity'}
          </p>
          <p className="text-sm mt-2 opacity-75">Most recent transaction</p>
        </div>
      </div>

      {/* Transactions récentes */}
      <section className="bg-white rounded-xl shadow-lg p-6">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-bold text-gray-900">Recent Transactions</h2>
          {transactions.length > RECENT_TRANSACTIONS_LIMIT && (
            <button className="text-blue-600 hover:text-blue-800 text-sm font-medium">
              View All ({transactions.length})
            </button>
          )}
        </div>
        
        {recentTransactions.length === 0 ? (
          <div className="text-center py-12" role="status">
            <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} 
                d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" 
              />
            </svg>
            <h3 className="mt-2 text-sm font-medium text-gray-900">No transactions</h3>
            <p className="mt-1 text-sm text-gray-500">Your transactions will appear here once you start using your account.</p>
          </div>
        ) : (
          <div className="space-y-3" role="list">
            {recentTransactions.map((trx, index) => (
              <div 
                key={trx.id}
                className="flex flex-col sm:flex-row sm:justify-between sm:items-center p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                role="listitem"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <div className="flex-1 mb-2 sm:mb-0">
                  <p className="font-medium text-gray-900">{trx.description || 'Transaction'}</p>
                  <div className="flex items-center text-sm text-gray-500 mt-1">
                    <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} 
                        d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" 
                      />
                    </svg>
                    {trx.formattedDate}
                  </div>
                </div>
                <div className="flex items-center">
                  <span 
                    className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-semibold ${
                      trx.isDeposit 
                        ? 'bg-green-100 text-green-800' 
                        : 'bg-red-100 text-red-800'
                    }`}
                    aria-label={`${trx.isDeposit ? 'Credit' : 'Debit'} of ${Math.abs(trx.amount).toLocaleString('fr-FR')} ${CURRENCY}`}
                  >
                    <svg 
                      className="w-4 h-4 mr-1" 
                      fill="none" 
                      stroke="currentColor" 
                      viewBox="0 0 24 24"
                    >
                      {trx.isDeposit ? (
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 10l7-7m0 0l7 7m-7-7v18" />
                      ) : (
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
                      )}
                    </svg>
                    {trx.isDeposit ? '+' : '-'}
                    {Math.abs(trx.amount).toLocaleString('fr-FR')} {CURRENCY}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  );
};

export default ClientDashboard;