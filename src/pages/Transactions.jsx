import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useBank } from '../context/BankContext';
import TransactionItem from '../components/TransactionItem';
import PageHeader from '../components/PageHeader';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus, faSearch } from '@fortawesome/free-solid-svg-icons';

export default function Transactions() {
  const { transactions, accounts } = useBank();
  const [search, setSearch] = useState('');
  const [typeFilter, setTypeFilter] = useState('all');

  const filtered = transactions.filter(tx => {
    const acc = accounts.find(a => a.id === tx.accountId);
    const matchSearch = tx.description?.toLowerCase().includes(search.toLowerCase()) ||
                        acc?.memberName?.toLowerCase().includes(search.toLowerCase());
    const matchType = typeFilter === 'all' || tx.type === typeFilter;
    return matchSearch && matchType;
  });

  const filters = [
    { value:'all',        label:'All' },
    { value:'deposit',    label:'Deposits' },
    { value:'withdrawal', label:'Withdrawals' },
    { value:'transfer',   label:'Transfers' },
  ];

  return (
    <div style={{ padding:'32px', maxWidth:'1000px' }}>
      <PageHeader
        title="Transaction Log"
        subtitle={`${transactions.length} total transactions`}
        action={
          <Link to="/transactions/new" style={{ display:'inline-flex', alignItems:'center', gap:'8px', background:'var(--navy)', color:'#fff', padding:'11px 20px', borderRadius:'10px', fontSize:'14px', fontWeight:600 }}>
            <FontAwesomeIcon icon={faPlus} style={{ fontSize:'12px' }} /> New Transaction
          </Link>
        }
      />

      <div style={{ display:'flex', gap:'12px', marginBottom:'24px', flexWrap:'wrap' }}>
        <div style={{ position:'relative', flex:'1', minWidth:'220px' }}>
          <FontAwesomeIcon icon={faSearch} style={{ position:'absolute', left:'14px', top:'50%', transform:'translateY(-50%)', fontSize:'13px', color:'var(--text-muted)' }} />
          <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search by description or member…"
            style={{ width:'100%', padding:'11px 14px 11px 40px', border:'1.5px solid var(--border)', borderRadius:'9px', fontSize:'14px', background:'var(--surface)', outline:'none', color:'var(--text-primary)' }}
            onFocus={e => e.target.style.borderColor='var(--navy)'}
            onBlur={e => e.target.style.borderColor='var(--border)'}
          />
        </div>
        <div style={{ display:'flex', gap:'6px' }}>
          {filters.map(f => (
            <button key={f.value} onClick={() => setTypeFilter(f.value)} style={{
              padding:'9px 14px', borderRadius:'8px', fontSize:'13px', fontWeight:500,
              background: typeFilter===f.value ? 'var(--navy)' : 'var(--surface)',
              color: typeFilter===f.value ? '#fff' : 'var(--text-secondary)',
              border: typeFilter===f.value ? '1px solid var(--navy)' : '1px solid var(--border)',
            }}>{f.label}</button>
          ))}
        </div>
      </div>

      <div style={{ background:'var(--surface)', border:'1px solid var(--border)', borderRadius:'var(--radius-lg)', boxShadow:'var(--shadow-sm)', overflow:'hidden' }}>
        {filtered.length === 0
          ? <p style={{ padding:'40px', textAlign:'center', color:'var(--text-muted)' }}>No transactions found.</p>
          : filtered.map(tx => <TransactionItem key={tx.id} tx={tx} showAccount accounts={accounts} />)
        }
      </div>
    </div>
  );
}
