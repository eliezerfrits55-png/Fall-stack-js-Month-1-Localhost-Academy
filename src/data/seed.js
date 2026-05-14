export const seedData = {
  branches: [
    {
      id: 'BR001',
      name: 'Mbengwi Main Branch',
      location: 'Mbengwi Town Center',
      phone: '+237670100001',
      manager: 'USR002',
      status: 'active'
    },
    {
      id: 'BR002',
      name: 'Bamenda Branch',
      location: 'Commercial Avenue, Bamenda',
      phone: '+237670100002',
      manager: 'USR003',
      status: 'active'
    }
  ],
  users: [
    {
      id: 'USR001',
      name: 'Super Admin',
      role: 'admin',
      email: 'admin@localhost.ac',
      password: 'react123',
      branchId: null
    },
    {
      id: 'USR002',
      name: 'Alice Fomben',
      role: 'manager',
      email: 'alice@localhost.cm',
      password: 'manager1',
      branchId: 'BR001'
    },
    {
      id: 'USR003',
      name: 'Boris Nkwenti',
      role: 'manager',
      email: 'boris@localhost.cm',
      password: 'manager2',
      branchId: 'BR002'
    },
    {
      id: 'USR004',
      name: 'Emmanuel Tabi',
      role: 'client',
      email: 'etabi@localhost.cm',
      password: 'client1',
      branchId: 'BR001'
    }
  ],
  accounts: [
    {
      id: 'ACC001',
      userId: 'USR004',
      memberName: 'Emmanuel Tabi',
      accountType: 'savings',
      balance: 450000,
      branchId: 'BR001',
      status: 'active',
      createdAt: '2026-04-15T12:00:00Z',
      phone: '+237670100004',
      email: 'etabi@localhost.cm'
    }
  ],
  transactions: [
    {
      id: 'TXN001',
      accountId: 'ACC001',
      type: 'deposit',
      amount: 50000,
      date: '2026-05-01T09:00:00Z',
      description: 'Initial deposit',
      balanceAfter: 50000
    },
    {
      id: 'TXN002',
      accountId: 'ACC001',
      type: 'withdrawal',
      amount: 10000,
      date: '2026-05-05T11:15:00Z',
      description: 'ATM withdrawal',
      balanceAfter: 40000
    }
  ]
};

const STORAGE_KEY = 'mdeccul_data';
const DATA_VERSION = 'v2';

const withDefaults = (data = {}) => {
  const branches = Array.isArray(data.branches) ? data.branches : seedData.branches;
  const users = Array.isArray(data.users) ? data.users : seedData.users;
  const accounts = (Array.isArray(data.accounts) ? data.accounts : seedData.accounts).map((account, index) => ({
    memberNumber: `MB${String(index + 1).padStart(6, '0')}`,
    accountType: 'savings',
    balance: 0,
    status: 'active',
    createdAt: new Date().toISOString(),
    ...account,
  }));
  const transactions = Array.isArray(data.transactions) ? data.transactions : seedData.transactions;

  return {
    version: DATA_VERSION,
    branches,
    users,
    accounts,
    transactions,
  };
};

export const initializeStorage = () => {
  const stored = localStorage.getItem(STORAGE_KEY);

  if (!stored) {
    const initialData = withDefaults(seedData);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(initialData));
    return initialData;
  }

  try {
    const parsed = JSON.parse(stored);

    if (!parsed.version || parsed.version !== DATA_VERSION) {
      console.log('Data version mismatch. Resetting to seed data...');
      const resetData = withDefaults(seedData);
      localStorage.setItem(STORAGE_KEY, JSON.stringify(resetData));
      return resetData;
    }

    const normalized = withDefaults(parsed);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(normalized));
    return normalized;
  } catch {
    console.error('Corrupted data. Resetting...');
    const resetData = withDefaults(seedData);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(resetData));
    return resetData;
  }
};

export const saveToStorage = (data) => {
  const storageData = withDefaults(data);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(storageData));
};

export const getFromStorage = () => {
  const stored = localStorage.getItem(STORAGE_KEY);
  return stored ? withDefaults(JSON.parse(stored)) : withDefaults(seedData);
};
