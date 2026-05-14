/* eslint-disable react-refresh/only-export-components */
import { createContext, useContext, useReducer, useState } from 'react';
import { initializeStorage, saveToStorage } from '../data/seed';

const BankContext = createContext();

export const useBank = () => {
  const context = useContext(BankContext);
  if (!context) throw new Error('useBank must be used within BankProvider');
  return context;
};

export const ACTIONS = {
  CREATE_BRANCH: 'CREATE_BRANCH',
  UPDATE_BRANCH: 'UPDATE_BRANCH',
  DELETE_BRANCH: 'DELETE_BRANCH',
  CREATE_USER: 'CREATE_USER',
  UPDATE_USER: 'UPDATE_USER',
  DELETE_USER: 'DELETE_USER',
  CREATE_ACCOUNT: 'CREATE_ACCOUNT',
  UPDATE_ACCOUNT: 'UPDATE_ACCOUNT',
  DELETE_ACCOUNT: 'DELETE_ACCOUNT',
  ADD_TRANSACTION: 'ADD_TRANSACTION',
  SET_STATE: 'SET_STATE'
};

const bankReducer = (state, action) => {
  let newState;

  switch (action.type) {
    case ACTIONS.SET_STATE:
      return action.payload;

    case ACTIONS.CREATE_BRANCH:
      newState = {
        ...state,
        branches: [...state.branches, action.payload]
      };
      break;

    case ACTIONS.UPDATE_BRANCH:
      newState = {
        ...state,
        branches: state.branches.map(b => 
          b.id === action.payload.id ? action.payload : b
        )
      };
      break;

    case ACTIONS.DELETE_BRANCH:
      newState = {
        ...state,
        branches: state.branches.filter(b => b.id !== action.payload)
      };
      break;

    case ACTIONS.CREATE_USER:
      newState = {
        ...state,
        users: [...state.users, action.payload]
      };
      break;

    case ACTIONS.UPDATE_USER:
      newState = {
        ...state,
        users: state.users.map(u => 
          u.id === action.payload.id ? action.payload : u
        )
      };
      break;

    case ACTIONS.DELETE_USER:
      newState = {
        ...state,
        users: state.users.filter(u => u.id !== action.payload)
      };
      break;

    case ACTIONS.CREATE_ACCOUNT:
      newState = {
        ...state,
        accounts: [...state.accounts, action.payload]
      };
      break;

    case ACTIONS.UPDATE_ACCOUNT:
      newState = {
        ...state,
        accounts: state.accounts.map(a => 
          a.id === action.payload.id ? action.payload : a
        )
      };
      break;

    case ACTIONS.DELETE_ACCOUNT:
      newState = {
        ...state,
        accounts: state.accounts.filter(a => a.id !== action.payload)
      };
      break;

    case ACTIONS.ADD_TRANSACTION:
      newState = {
        ...state,
        transactions: [...state.transactions, action.payload.transaction],
        accounts: state.accounts.map(account => {
          const update = action.payload.accountUpdates?.find(u => u.id === account.id);
          return update ? update : account;
        })
      };
      break;

    default:
      return state;
  }

  saveToStorage(newState);
  return newState;
};

export const BankProvider = ({ children }) => {
  const [initialData] = useState(() => {
    try {
      return {
        data: initializeStorage(),
        error: null
      };
    } catch (err) {
      console.error('Failed to initialize bank storage:', err);
      return {
        data: {
          branches: [],
          users: [],
          accounts: [],
          transactions: []
        },
        error: 'Unable to load bank data.'
      };
    }
  }, []);
  const [state, dispatch] = useReducer(bankReducer, initialData.data);
  const isLoading = false;
  const error = initialData.error;

  const getBranchById = (id) => state.branches.find(b => b.id === id);
  const getUserById = (id) => state.users.find(u => u.id === id);
  const getAccountsByUserId = (userId) =>
    state.accounts.filter(a => a.userId === userId);
  const getAccountsByBranchId = (branchId) =>
    state.accounts.filter(a => a.branchId === branchId);
  const getTransactionsByAccountId = (accountId) =>
    state.transactions.filter(t => t.accountId === accountId);
  const getTransactionsByUserId = (userId) => {
    if (!userId) return [];
    const userAccounts = getAccountsByUserId(userId);
    const accountIds = userAccounts.map(a => a.id);
    return state.transactions.filter(t => accountIds.includes(t.accountId));
  };

  const getBranchStats = (branchId) => {
    const branchAccounts = getAccountsByBranchId(branchId);
    return {
      accountCount: branchAccounts.length,
      totalBalance: branchAccounts.reduce((sum, a) => sum + (a.balance || 0), 0)
    };
  };

  const generateAccountId = () => {
    const existingIds = state.accounts.map(account => account.id);
    let nextId = state.accounts.length + 1;
    let newId = `ACC${String(nextId).padStart(3, '0')}`;

    while (existingIds.includes(newId)) {
      nextId += 1;
      newId = `ACC${String(nextId).padStart(3, '0')}`;
    }

    return newId;
  };

  const createAccount = (accountData) => {
    const account = {
      id: generateAccountId(),
      memberNumber: `MB${Date.now().toString().slice(-6)}`,
      balance: typeof accountData.initialDeposit === 'number' ? accountData.initialDeposit : 0,
      status: 'active',
      createdAt: new Date().toISOString(),
      branchId: accountData.branchId || state.branches[0]?.id || '',
      ...accountData
    };

    dispatch({ type: ACTIONS.CREATE_ACCOUNT, payload: account });
    return account;
  };

  const generateTransactionId = () => {
    const existingIds = state.transactions.map(tx => tx.id);
    let id;
    do {
      id = `TXN${Math.floor(Math.random() * 900000 + 100000)}`;
    } while (existingIds.includes(id));
    return id;
  };

  const addTransaction = ({ transaction, accountUpdates }) => {
    dispatch({
      type: ACTIONS.ADD_TRANSACTION,
      payload: { transaction, accountUpdates }
    });
  };

  const deposit = ({ accountId, amount, description }) => {
    const account = state.accounts.find(a => a.id === accountId);
    if (!account) return null;
    const newBalance = (account.balance || 0) + amount;
    const transaction = {
      id: generateTransactionId(),
      accountId,
      type: 'deposit',
      amount,
      date: new Date().toISOString(),
      description: description || 'Deposit',
      balanceAfter: newBalance
    };
    addTransaction({ transaction, accountUpdates: [{ ...account, balance: newBalance }] });
    return transaction;
  };

  const withdraw = ({ accountId, amount, description }) => {
    const account = state.accounts.find(a => a.id === accountId);
    if (!account) return null;
    const newBalance = (account.balance || 0) - amount;
    const transaction = {
      id: generateTransactionId(),
      accountId,
      type: 'withdrawal',
      amount,
      date: new Date().toISOString(),
      description: description || 'Withdrawal',
      balanceAfter: newBalance
    };
    addTransaction({ transaction, accountUpdates: [{ ...account, balance: newBalance }] });
    return transaction;
  };

  const transfer = ({ fromId, toId, amount, description }) => {
    const fromAccount = state.accounts.find(a => a.id === fromId);
    const toAccount = state.accounts.find(a => a.id === toId);
    if (!fromAccount || !toAccount) return null;

    const fromBalance = (fromAccount.balance || 0) - amount;
    const toBalance = (toAccount.balance || 0) + amount;
    const transaction = {
      id: generateTransactionId(),
      accountId: fromId,
      type: 'transfer',
      amount,
      date: new Date().toISOString(),
      description: description || `Transfer to ${toAccount.memberNumber}`,
      balanceAfter: fromBalance
    };

    addTransaction({
      transaction,
      accountUpdates: [
        { ...fromAccount, balance: fromBalance },
        { ...toAccount, balance: toBalance }
      ]
    });
    return transaction;
  };

  const totalBalance = state.accounts.reduce((sum, account) => sum + (account.balance || 0), 0);
  const activeAccounts = state.accounts.filter(account => account.status === 'active').length;
  const totalDeposits = state.transactions
    .filter(tx => tx.type === 'deposit')
    .reduce((sum, tx) => sum + (tx.amount || 0), 0);
  const totalWithdrawals = state.transactions
    .filter(tx => tx.type === 'withdrawal')
    .reduce((sum, tx) => sum + (tx.amount || 0), 0);

  const value = {
    ...state,
    dispatch,
    ACTIONS,
    isLoading,
    error,
    totalBalance,
    activeAccounts,
    totalDeposits,
    totalWithdrawals,
    getBranchById,
    getUserById,
    getAccountsByUserId,
    getAccountsByBranchId,
    getTransactionsByAccountId,
    getTransactionsByUserId,
    getBranchStats,
    createAccount,
    deposit,
    withdraw,
    transfer
  };

  return (
    <BankContext.Provider value={value}>
      {children}
    </BankContext.Provider>
  );
};
