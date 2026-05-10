import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useBank } from '../context/BankContext';
import AccountCard from '../components/AccountCard';
import PageHeader from '../components/PageHeader';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSearch, faPlus, faFilter } from '@fortawesome/free-solid-svg-icons';

export default function Accounts() {
  const { accounts } = useBank();
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState('all');

  const filtered = accounts.filter(a => {
    const matchSearch = a.memberName.toLowerCase().includes(search.toLowerCase()) ||
                        a.memberNumber.toLowerCase().includes(search.toLowerCase());
    const matchFilter = filter === 'all' || a.status === filter || a.accountType === filter;
    return matchSearch && matchFilter;
  });

  const filters = [
    { value:'all', label:'All' },
    { value:'active', label:'Active' },
    { value:'dormant', label:'Dormant' },
    { value:'savings', label:'Savings' },
    { value:'current', label:'Current' },
    { value:'fixed', label:'Fixed' },
  ];

  return (
    <div style={{ padding:'32px', maxWidth:'1200px' }}>
      <PageHeader
        title="Member Accounts"
        subtitle={`${accounts.length} total accounts · ${accounts.filter(a=>a.status==='active').length} active`}
        action={
          <Link to="/accounts/new" style={{ display:'inline-flex', alignItems:'center', gap:'8px', background:'var(--navy)', color:'#fff', padding:'11px 20px', borderRadius:'10px', fontSize:'14px', fontWeight:600 }}>
            <FontAwesomeIcon icon={faPlus} style={{ fontSize:'12px' }} /> New Account
          </Link>
        }
      />

      {/* Search + filters */}
      <div style={{ display:'flex', gap:'12px', marginBottom:'24px', flexWrap:'wrap' }}>
        <div style={{ position:'relative', flex:'1', minWidth:'240px' }}>
          <FontAwesomeIcon icon={faSearch} style={{ position:'absolute', left:'14px', top:'50%', transform:'translateY(-50%)', fontSize:'13px', color:'var(--text-muted)' }} />
          <input
            value={search} onChange={e => setSearch(e.target.value)}
            placeholder="Search by name or member number…"
            style={{ width:'100%', padding:'11px 14px 11px 40px', border:'1.5px solid var(--border)', borderRadius:'9px', fontSize:'14px', background:'var(--surface)', outline:'none', color:'var(--text-primary)' }}
            onFocus={e => e.target.style.borderColor='var(--navy)'}
            onBlur={e => e.target.style.borderColor='var(--border)'}
          />
        </div>
        <div style={{ display:'flex', gap:'6px', flexWrap:'wrap' }}>
          {filters.map(f => (
            <button key={f.value} onClick={() => setFilter(f.value)} style={{
              padding:'9px 14px', borderRadius:'8px', fontSize:'13px', fontWeight:500,
              background: filter === f.value ? 'var(--navy)' : 'var(--surface)',
              color: filter === f.value ? '#fff' : 'var(--text-secondary)',
              border: filter === f.value ? '1px solid var(--navy)' : '1px solid var(--border)',
              transition:'all var(--transition)',
            }}>{f.label}</button>
          ))}
        </div>
      </div>

      {filtered.length === 0 ? (
        <div style={{ textAlign:'center', padding:'60px', color:'var(--text-muted)' }}>
          <div style={{ fontSize:'40px', marginBottom:'12px' }}>🔍</div>
          <p>No accounts found matching your search.</p>
        </div>
      ) : (
        <div className="stagger" style={{ display:'grid', gridTemplateColumns:'repeat(auto-fill, minmax(280px,1fr))', gap:'20px' }}>
          {filtered.map(acc => <AccountCard key={acc.id} account={acc} />)}
        </div>
      )}
    </div>
  );
}
