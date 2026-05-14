import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useBank } from '../context/BankContext';
import AccountCard from '../components/AccountCard';
import PageHeader from '../components/PageHeader';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSearch, faPlus } from '@fortawesome/free-solid-svg-icons';

export default function Accounts() {
  const { accounts } = useBank();
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState('all');

  const filtered = accounts.filter(a => {
    const memberName = a.memberName || '';
    const memberNumber = a.memberNumber || '';
    const normalizedSearch = search.toLowerCase();
    const matchSearch = memberName.toLowerCase().includes(normalizedSearch) ||
                        memberNumber.toLowerCase().includes(normalizedSearch);
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
    <div className="accounts-page">
      <PageHeader
        title="Member Accounts"
        subtitle={`${accounts.length} total accounts · ${accounts.filter(a => a.status === 'active').length} active`}
        action={
          <Link to="/accounts/new" className="button-primary button-small">
            <FontAwesomeIcon icon={faPlus} className="button-icon" /> New Account
          </Link>
        }
      />

      <div className="accounts-toolbar">
        <div className="search-input-group">
          <FontAwesomeIcon icon={faSearch} className="search-icon" />
          <input
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Search by name or member number…"
            className="search-input"
          />
        </div>

        <div className="accounts-filter-group">
          {filters.map(f => (
            <button
              key={f.value}
              onClick={() => setFilter(f.value)}
              className={`filter-pill ${filter === f.value ? 'active' : ''}`}
            >
              {f.label}
            </button>
          ))}
        </div>
      </div>

      {filtered.length === 0 ? (
        <div className="no-results">
          <div className="no-results-icon">🔍</div>
          <p>No accounts found matching your search.</p>
        </div>
      ) : (
        <div className="accounts-grid stagger">
          {filtered.map(acc => <AccountCard key={acc.id} account={acc} />)}
        </div>
      )}
    </div>
  );
}
