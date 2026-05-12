/* eslint-disable react-refresh/only-export-components */
import { createContext, useContext, useReducer, useEffect } from 'react';
import { initializeStorage, saveToStorage } from '../data/seed';

const BankContext = createContext();

export const useBank = () => {
  const context = useContext(BankContext);
  if (!context) throw new Error('useBank must be used within BankProvider');
  return context;
};

// Actions
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
        transactions: [...state.transactions, action.payload]
      };
      break;

    default:
      return state;
  }

  // Sauvegarder dans localStorage
  saveToStorage(newState);
  return newState;
};

export const BankProvider = ({ children }) => {
  const [state, dispatch] = useReducer(bankReducer, {
    branches: [],
    users: [],
    accounts: [],
    transactions: []
  });

  useEffect(() => {
    const data = initializeStorage();
    dispatch({ type: ACTIONS.SET_STATE, payload: data });
  }, []);

  // Helpers pour obtenir les données liées
  const getBranchById = (id) => state.branches.find(b => b.id === id);
  const getUserById = (id) => state.users.find(u => u.id === id);
  const getAccountsByUserId = (userId) => 
    state.accounts.filter(a => a.userId === userId);
  const getAccountsByBranchId = (branchId) => 
    state.accounts.filter(a => a.branchId === branchId);
  const getTransactionsByAccountId = (accountId) => 
    state.transactions.filter(t => t.accountId === accountId);
  const getTransactionsByUserId = (userId) => {
    const userAccounts = getAccountsByUserId(userId);
    const accountIds = userAccounts.map(a => a.id);
    return state.transactions.filter(t => accountIds.includes(t.accountId));
  };

  // Statistiques par branche
  const getBranchStats = (branchId) => {
    const branchAccounts = getAccountsByBranchId(branchId);
    return {
      accountCount: branchAccounts.length,
      totalBalance: branchAccounts.reduce((sum, a) => sum + a.balance, 0)
    };
  };

  const generateAccountId = () => {
    const existingIds = state.accounts.map(account => account.id);
    let id;
    do {
      const nextId = state.accounts.length + 1;
      id = `ACC${String(nextId).padStart(3, '0')}`;
    } while (existingIds.includes(id));
    return id;
  };

  const createAccount = (accountData) => {
    const account = {
      id: generateAccountId(),
      memberNumber: `MB${Date.now().toString().slice(-6)}`,
      balance: typeof accountData.initialDeposit === 'number' ? accountData.initialDeposit : 0,
      status: accountData.initialDeposit > 0 ? 'active' : 'active',
      createdAt: new Date().toISOString(),
      ...accountData
    };

    dispatch({ type: ACTIONS.CREATE_ACCOUNT, payload: account });
    return account;
  };

  const value = {
    ...state,
    dispatch,
    getBranchById,
    getUserById,
    getAccountsByUserId,
    getAccountsByBranchId,
    getTransactionsByAccountId,
    getTransactionsByUserId,
    getBranchStats,
    createAccount
  };

  return (
    <BankContext.Provider value={value}>
      {children}
    </BankContext.Provider>
  );
};