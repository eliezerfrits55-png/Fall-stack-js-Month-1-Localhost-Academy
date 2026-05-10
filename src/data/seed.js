export const seedData = {
  accounts: [
    { id:'ACC001', memberName:'Emmanuel Tabi',  memberNumber:'MBR-001', accountType:'savings', balance:450000,  status:'active',  createdAt:'2024-01-15T08:00:00Z', phone:'+237 670 000 001', email:'etabi@mbeccul.cm' },
    { id:'ACC002', memberName:'Grace Nkeng',    memberNumber:'MBR-002', accountType:'current', balance:1200000, status:'active',  createdAt:'2024-02-10T09:30:00Z', phone:'+237 680 000 002', email:'gnkeng@mbeccul.cm' },
    { id:'ACC003', memberName:'Peter Mbah',     memberNumber:'MBR-003', accountType:'savings', balance:85000,   status:'active',  createdAt:'2024-03-01T10:00:00Z', phone:'+237 655 000 003', email:'pmbah@mbeccul.cm' },
    { id:'ACC004', memberName:'Mary Fon',       memberNumber:'MBR-004', accountType:'fixed',   balance:3000000, status:'active',  createdAt:'2024-03-20T11:15:00Z', phone:'+237 699 000 004', email:'mfon@mbeccul.cm' },
    { id:'ACC005', memberName:'Samuel Che',     memberNumber:'MBR-005', accountType:'savings', balance:0,       status:'dormant', createdAt:'2023-11-05T08:45:00Z', phone:'+237 677 000 005', email:'sche@mbeccul.cm' },
    { id:'ACC006', memberName:'Beatrice Ndong', memberNumber:'MBR-006', accountType:'current', balance:675000,  status:'active',  createdAt:'2024-04-01T07:30:00Z', phone:'+237 651 000 006', email:'bndong@mbeccul.cm' },
  ],
  transactions: [
    { id:'TXN001', accountId:'ACC001', type:'deposit',    amount:200000, description:'Monthly savings',       date:'2024-04-01T09:00:00Z', balanceAfter:450000  },
    { id:'TXN002', accountId:'ACC002', type:'withdrawal', amount:50000,  description:'ATM Withdrawal',        date:'2024-04-02T10:30:00Z', balanceAfter:1200000 },
    { id:'TXN003', accountId:'ACC003', type:'deposit',    amount:30000,  description:'Member contribution',   date:'2024-04-03T08:15:00Z', balanceAfter:85000   },
    { id:'TXN004', accountId:'ACC001', type:'transfer',   amount:100000, description:'Transfer to MBR-002',   date:'2024-04-04T14:00:00Z', balanceAfter:350000  },
    { id:'TXN005', accountId:'ACC004', type:'deposit',    amount:500000, description:'Fixed deposit top-up',  date:'2024-04-05T11:00:00Z', balanceAfter:3000000 },
    { id:'TXN006', accountId:'ACC002', type:'deposit',    amount:300000, description:'Salary credit',         date:'2024-04-06T09:00:00Z', balanceAfter:1500000 },
    { id:'TXN007', accountId:'ACC006', type:'deposit',    amount:675000, description:'Opening deposit',       date:'2024-04-07T07:30:00Z', balanceAfter:675000  },
  ],
};
