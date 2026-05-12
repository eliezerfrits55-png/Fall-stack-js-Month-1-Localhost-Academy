import { useState, useMemo, useCallback } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useBank } from '../../context/BankContext';

// Configuration
const CURRENCY = 'XAF';
const STATUS_STYLES = {
  active: 'bg-green-100 text-green-800 border-green-300',
  inactive: 'bg-red-100 text-red-800 border-red-300',
  pending: 'bg-yellow-100 text-yellow-800 border-yellow-300',
  suspended: 'bg-gray-100 text-gray-800 border-gray-300',
  closed: 'bg-red-50 text-red-700 border-red-200'
};

const ACCOUNT_TYPE_ICONS = {
  checking: 'M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z',
  savings: 'M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z',
  credit: 'M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z',
  default: 'M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z'
};

const ClientAccounts = () => {
  const { user, isLoading: authLoading, error: authError } = useAuth();
  const { 
    getAccountsByUserId, 
    getBranchById,
    isLoading: bankLoading,
    error: bankError,
    dispatch,
    ACTIONS 
  } = useBank();
  
  const [selectedAccount, setSelectedAccount] = useState(null);
  const [showDetails, setShowDetails] = useState(false);

  // Mémoïsation des données
  const accounts = useMemo(() => 
    getAccountsByUserId(user?.id) || [], 
    [getAccountsByUserId, user?.id]
  );

  // Calcul du solde total
  const totalBalance = useMemo(() => 
    accounts.reduce((sum, acc) => sum + (acc.balance || 0), 0),
    [accounts]
  );

  // Enrichissement des données des comptes
  const enrichedAccounts = useMemo(() => {
    return accounts.map(account => ({
      ...account,
      branch: getBranchById(account.branchId),
      formattedBalance: (account.balance || 0).toLocaleString('fr-FR'),
      displayType: formatAccountType(account.accountType),
      statusStyle: STATUS_STYLES[account.status] || STATUS_STYLES.default,
      isActive: account.status === 'active',
      accountIcon: ACCOUNT_TYPE_ICONS[account.accountType] || ACCOUNT_TYPE_ICONS.default
    }));
  }, [accounts, getBranchById]);

  // Formatage du type de compte
  function formatAccountType(type) {
    if (!type) return 'Unknown';
    return type
      .split('_')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
      .join(' ');
  }

  // Gestionnaire pour voir les détails
  const handleViewDetails = useCallback((account) => {
    setSelectedAccount(account);
    setShowDetails(true);
  }, []);

  // Gestionnaire pour demander un nouveau compte
  const handleRequestAccount = useCallback(() => {
    if (dispatch && ACTIONS) {
      dispatch({ type: ACTIONS.REQUEST_ACCOUNT });
    }
  }, [dispatch, ACTIONS]);

  // Gestion des états de chargement
  if (authLoading || bankLoading) {
    return (
      <div className="flex flex-col justify-center items-center h-64 space-y-4" role="status">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        <p className="text-gray-600">Loading your accounts...</p>
      </div>
    );
  }

  // Gestion des erreurs
  if (authError || bankError) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-lg p-6" role="alert">
        <div className="flex items-center mb-4">
          <svg className="w-6 h-6 text-red-600 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} 
              d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" 
            />
          </svg>
          <h2 className="text-lg font-semibold text-red-800">Error Loading Accounts</h2>
        </div>
        <p className="text-red-600 mb-4">
          {authError || bankError || 'An unexpected error occurred. Please try again.'}
        </p>
        <button 
          onClick={() => window.location.reload()} 
          className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700 transition-colors focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2"
        >
          Retry
        </button>
      </div>
    );
  }

  // Session expirée
  if (!user) {
    return (
      <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6 text-center" role="alert">
        <svg className="mx-auto h-12 w-12 text-yellow-400 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} 
            d="M12 15v2m0 0v2m0-2h2m-2 0H10m9.364-9.364A9 9 0 1112 3a9 9 0 019.364 9.364z" 
          />
        </svg>
        <h2 className="text-lg font-semibold text-yellow-800 mb-2">Session Expired</h2>
        <p className="text-yellow-600">Please log in again to view your accounts.</p>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto">
      {/* En-tête avec résumé */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 space-y-4 sm:space-y-0">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">My Accounts</h1>
          <p className="text-gray-600 mt-2">
            Manage your bank accounts and view balances
          </p>
        </div>
        <button
          onClick={handleRequestAccount}
          className="inline-flex items-center bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
          aria-label="Request a new account"
        >
          <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          Request New Account
        </button>
      </div>

      {/* Résumé des finances */}
      {accounts.length > 0 && (
        <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl p-6 mb-8 border border-blue-200">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            <div>
              <p className="text-sm text-gray-600 mb-1">Total Balance</p>
              <p className="text-3xl font-bold text-blue-600">
                {totalBalance.toLocaleString('fr-FR')} {CURRENCY}
              </p>
            </div>
            <div>
              <p className="text-sm text-gray-600 mb-1">Active Accounts</p>
              <p className="text-3xl font-bold text-green-600">
                {accounts.filter(acc => acc.status === 'active').length}
              </p>
            </div>
            <div>
              <p className="text-sm text-gray-600 mb-1">Total Accounts</p>
              <p className="text-3xl font-bold text-purple-600">
                {accounts.length}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Liste des comptes */}
      {accounts.length === 0 ? (
        <div className="text-center py-16 bg-white rounded-xl shadow-sm border border-gray-200">
          <svg className="mx-auto h-16 w-16 text-gray-400 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} 
              d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" 
            />
          </svg>
          <h2 className="text-xl font-semibold text-gray-900 mb-2">No Accounts Yet</h2>
          <p className="text-gray-600 mb-6 max-w-md mx-auto">
            You don't have any bank accounts yet. Open a new account to start managing your finances.
          </p>
          <button
            onClick={handleRequestAccount}
            className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
          >
            Open Your First Account
          </button>
        </div>
      ) : (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {enrichedAccounts.map(account => (
            <article 
              key={account.id} 
              className="bg-white rounded-xl shadow-sm border border-gray-200 hover:shadow-md transition-all duration-200 overflow-hidden"
            >
              {/* En-tête de la carte */}
              <div className={`p-1 ${account.isActive ? 'bg-green-500' : 'bg-gray-300'}`}></div>
              
              <div className="p-6">
                <div className="flex justify-between items-start mb-4">
                  <div className="flex items-start space-x-2">
                    <svg className="w-8 h-8 text-blue-600 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d={account.accountIcon} />
                    </svg>
                    <div>
                      <h3 className="font-semibold text-gray-900">{account.displayType}</h3>
                      <p className="text-xs text-gray-500 mt-1 font-mono">Acc: {account.id}</p>
                    </div>
                  </div>
                  <span className={`px-2 py-1 rounded-full text-xs font-medium border ${account.statusStyle}`}>
                    {account.status.charAt(0).toUpperCase() + account.status.slice(1)}
                  </span>
                </div>
                
                <div className="space-y-3 border-t pt-4">
                  <div className="flex justify-between items-baseline">
                    <span className="text-sm text-gray-600">Current Balance</span>
                    <span className="text-2xl font-bold text-blue-600">
                      {account.formattedBalance} {CURRENCY}
                    </span>
                  </div>
                  
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-500 flex items-center">
                      <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} 
                          d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" 
                        />
                      </svg>
                      Branch
                    </span>
                    <span className="font-medium text-gray-900">
                      {account.branch?.name || 'N/A'}
                    </span>
                  </div>
                  
                  {account.interestRate && (
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-500 flex items-center">
                        <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} 
                            d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" 
                          />
                        </svg>
                        Interest Rate
                      </span>
                      <span className="font-medium text-green-600">
                        {account.interestRate}%
                      </span>
                    </div>
                  )}
                  
                  {account.openingDate && (
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-500">Opened</span>
                      <span className="text-gray-700">
                        {new Date(account.openingDate).toLocaleDateString('fr-FR', {
                          year: 'numeric',
                          month: 'short',
                          day: 'numeric'
                        })}
                      </span>
                    </div>
                  )}
                </div>
                
                {/* Actions */}
                <div className="flex gap-2 mt-6">
                  <button
                    onClick={() => handleViewDetails(account)}
                    className="flex-1 bg-blue-50 text-blue-700 px-3 py-2 rounded-lg hover:bg-blue-100 transition-colors text-sm font-medium focus:outline-none focus:ring-2 focus:ring-blue-500"
                    aria-label={`View details for ${account.displayType}`}
                  >
                    View Details
                  </button>
                  {account.isActive && (
                    <button
                      className="flex-1 bg-gray-50 text-gray-700 px-3 py-2 rounded-lg hover:bg-gray-100 transition-colors text-sm font-medium focus:outline-none focus:ring-2 focus:ring-gray-500"
                      aria-label={`Manage ${account.displayType}`}
                    >
                      Manage
                    </button>
                  )}
                </div>
              </div>
            </article>
          ))}
        </div>
      )}

      {/* Modal de détails du compte (à implémenter) */}
      {showDetails && selectedAccount && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4" role="dialog" aria-modal="true">
          <div className="bg-white rounded-xl p-6 max-w-md w-full">
            <h2 className="text-xl font-bold mb-4">{selectedAccount.displayType} Details</h2>
            {/* Détails additionnels ici */}
            <button
              onClick={() => setShowDetails(false)}
              className="mt-4 bg-gray-300 px-4 py-2 rounded hover:bg-gray-400"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ClientAccounts;