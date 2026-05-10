import { createContext, useContext, useReducer, useEffect } from 'react';
import { loadState, saveState } from '../utils/storage';
import { seedData } from '../data/seed';

function getInitialState() {
  return loadState() || seedData;
}

function bankReducer(state, action) {
  switch (action.type) {
    case 'CREATE_ACCOUNT': {
      const num = state.accounts.length + 1;
      const id  = `ACC${String(num).padStart(3,'0')}`;
      const newAccount = {
        id,
        memberNumber: `MBR-${String(num).padStart(3,'0')}`,
        balance: action.payload.initialDeposit || 0,
        status: 'active',
        createdAt: new Date().toISOString(),
        ...action.payload,
      };
      const txns = [...state.transactions];
      if (newAccount.balance > 0) {
        txns.unshift({
          id: `TXN${Date.now()}`,
          accountId: id,
          type: 'deposit',
          amount: newAccount.balance,
          description: 'Opening deposit',
          date: new Date().toISOString(),
          balanceAfter: newAccount.balance,
        });
      }
      return { ...state, accounts: [...state.accounts, newAccount], transactions: txns };
    }
    case 'DEPOSIT': {
      const { accountId, amount, description } = action.payload;
      const txn = { id:`TXN${Date.now()}`, accountId, type:'deposit', amount, description, date:new Date().toISOString(), balanceAfter:0 };
      const accounts = state.accounts.map(acc => {
        if (acc.id !== accountId) return acc;
        const newBalance = acc.balance + amount;
        txn.balanceAfter = newBalance;
        return { ...acc, balance: newBalance, status:'active' };
      });
      return { ...state, accounts, transactions: [txn, ...state.transactions] };
    }
    case 'WITHDRAW': {
      const { accountId, amount, description } = action.payload;
      const account = state.accounts.find(a => a.id === accountId);
      if (!account || account.balance < amount) return state;
      const txn = { id:`TXN${Date.now()}`, accountId, type:'withdrawal', amount, description, date:new Date().toISOString(), balanceAfter:account.balance - amount };
      const accounts = state.accounts.map(acc => acc.id === accountId ? { ...acc, balance:acc.balance - amount } : acc);
      return { ...state, accounts, transactions: [txn, ...state.transactions] };
    }
    case 'TRANSFER': {
      const { fromId, toId, amount, description } = action.payload;
      const from = state.accounts.find(a => a.id === fromId);
      const to   = state.accounts.find(a => a.id === toId);
      if (!from || !to || from.balance < amount) return state;
      const txn = { id:`TXN${Date.now()}`, accountId:fromId, type:'transfer', amount, description: description || `Transfer to ${to.memberName}`, date:new Date().toISOString(), balanceAfter:from.balance - amount, toAccountId:toId };
      const accounts = state.accounts.map(acc => {
        if (acc.id === fromId) return { ...acc, balance:acc.balance - amount };
        if (acc.id === toId)   return { ...acc, balance:acc.balance + amount };
        return acc;
      });
      return { ...state, accounts, transactions: [txn, ...state.transactions] };
    }
    case 'RESET_DATA': return seedData;
    default: throw new Error(`Unknown action: ${action.type}`);
  }
}

const BankContext = createContext(null);

export function BankProvider({ children }) {
  const [state, dispatch] = useReducer(bankReducer, null, getInitialState);

  useEffect(() => { saveState(state); }, [state]);

  const createAccount = p => dispatch({ type:'CREATE_ACCOUNT', payload:p });
  const deposit       = p => dispatch({ type:'DEPOSIT',        payload:p });
  const withdraw      = p => dispatch({ type:'WITHDRAW',       payload:p });
  const transfer      = p => dispatch({ type:'TRANSFER',       payload:p });
  const resetData     = () => dispatch({ type:'RESET_DATA' });

  const totalBalance     = state.accounts.reduce((s,a) => s + a.balance, 0);
  const activeAccounts   = state.accounts.filter(a => a.status === 'active').length;
  const totalDeposits    = state.transactions.filter(t => t.type === 'deposit').reduce((s,t) => s+t.amount, 0);
  const totalWithdrawals = state.transactions.filter(t => t.type === 'withdrawal').reduce((s,t) => s+t.amount, 0);

  return (
    <BankContext.Provider value={{
      accounts: state.accounts,
      transactions: state.transactions,
      createAccount, deposit, withdraw, transfer, resetData,
      totalBalance, activeAccounts, totalDeposits, totalWithdrawals,
    }}>
      {children}
    </BankContext.Provider>
  );
}

export function useBank() {
  const ctx = useContext(BankContext);
  if (!ctx) throw new Error('useBank must be inside BankProvider');
  return ctx;
}
