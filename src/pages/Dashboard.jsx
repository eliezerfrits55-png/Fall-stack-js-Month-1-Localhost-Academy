import { useBank } from '../context/BankContext';
import { useAuth } from '../context/AuthContext';
import StatCard from '../components/StatCard';
import TransactionItem from '../components/TransactionItem';
import PageHeader from '../components/PageHeader';
import { Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faDollarSign, faUsers, faArrowTrendUp, faArrowTrendDown, faPlus, faArrowRight } from '@fortawesome/free-solid-svg-icons';
import { formatCurrency } from '../utils/formatters';

export default function Dashboard() {
  const { totalBalance, activeAccounts, totalDeposits, totalWithdrawals, transactions, accounts } = useBank();
  const { user } = useAuth();
  const recentTx = transactions.slice(0, 6);

  const today = new Date().toLocaleDateString('en-GB', { weekday:'long', day:'numeric', month:'long', year:'numeric' });

  return (
    <div style={{ padding:'32px', maxWidth:'1200px' }}>
      <div style={{ display:'flex', justifyContent:'space-between', alignItems:'flex-start', marginBottom:'32px' }}>
        <div>
          <p style={{ fontSize:'13px', color:'var(--text-muted)', marginBottom:'4px', textTransform:'uppercase', letterSpacing:'1px' }}>{today}</p>
          <h1 style={{ fontFamily:'var(--font-display)', fontSize:'28px', fontWeight:700, color:'var(--text-primary)', margin:0 }}>
            Good morning, <span style={{ color:'var(--navy)' }}>{user?.name}</span>
          </h1>
          <p style={{ fontSize:'14px', color:'var(--text-muted)', marginTop:'4px' }}>Here's your credit union at a glance.</p>
        </div>
        <Link to="/transactions/new" style={{ display:'inline-flex', alignItems:'center', gap:'8px', background:'var(--navy)', color:'#fff', padding:'11px 20px', borderRadius:'10px', fontSize:'14px', fontWeight:600, boxShadow:'var(--shadow-md)' }}>
          <FontAwesomeIcon icon={faPlus} style={{ fontSize:'12px' }} /> New Transaction
        </Link>
      </div>

      {/* Stat Cards */}
      <div className="stagger" style={{ display:'grid', gridTemplateColumns:'repeat(auto-fit, minmax(220px,1fr))', gap:'20px', marginBottom:'32px' }}>
        <StatCard label="Total Assets" value={formatCurrency(totalBalance)} icon={faDollarSign} color="var(--navy)" trend="All member balances combined" />
        <StatCard label="Active Accounts" value={activeAccounts} icon={faUsers} color="var(--success)" trend={`${accounts.length} total accounts`} />
        <StatCard label="Total Deposits" value={formatCurrency(totalDeposits)} icon={faArrowTrendUp} color="var(--info)" trend="All time deposits" />
        <StatCard label="Total Withdrawals" value={formatCurrency(totalWithdrawals)} icon={faArrowTrendDown} color="var(--danger)" trend="All time withdrawals" />
      </div>

      {/* Recent Transactions + Quick Stats */}
      <div style={{ display:'grid', gridTemplateColumns:'1fr 320px', gap:'24px' }}>

        {/* Transactions */}
        <div style={{ background:'var(--surface)', border:'1px solid var(--border)', borderRadius:'var(--radius-lg)', boxShadow:'var(--shadow-sm)', overflow:'hidden' }}>
          <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', padding:'20px 20px 16px', borderBottom:'1px solid var(--border)' }}>
            <div>
              <h2 style={{ fontSize:'16px', fontWeight:700, color:'var(--text-primary)', margin:0 }}>Recent Transactions</h2>
              <p style={{ fontSize:'12px', color:'var(--text-muted)', marginTop:'2px' }}>Last {recentTx.length} activities</p>
            </div>
            <Link to="/transactions" style={{ fontSize:'13px', fontWeight:600, color:'var(--navy)', display:'flex', alignItems:'center', gap:'5px' }}>
              View all <FontAwesomeIcon icon={faArrowRight} style={{ fontSize:'11px' }} />
            </Link>
          </div>
          {recentTx.length === 0
            ? <p style={{ padding:'32px', textAlign:'center', color:'var(--text-muted)' }}>No transactions yet.</p>
            : recentTx.map(tx => <TransactionItem key={tx.id} tx={tx} showAccount accounts={accounts} />)
          }
        </div>

        {/* Account summary */}
        <div style={{ display:'flex', flexDirection:'column', gap:'16px' }}>
          <div style={{ background:'var(--surface)', border:'1px solid var(--border)', borderRadius:'var(--radius-lg)', padding:'20px', boxShadow:'var(--shadow-sm)' }}>
            <h3 style={{ fontSize:'14px', fontWeight:700, color:'var(--text-primary)', marginBottom:'16px' }}>Account Breakdown</h3>
            {['savings','current','fixed'].map(type => {
              const count = accounts.filter(a => a.accountType === type).length;
              const bal   = accounts.filter(a => a.accountType === type).reduce((s,a) => s+a.balance, 0);
              const colors = { savings:'var(--info)', current:'var(--success)', fixed:'var(--warning)' };
              return (
                <div key={type} style={{ display:'flex', justifyContent:'space-between', alignItems:'center', padding:'10px 0', borderBottom:'1px solid var(--border)' }}>
                  <div style={{ display:'flex', alignItems:'center', gap:'10px' }}>
                    <div style={{ width:'8px', height:'8px', borderRadius:'50%', background:colors[type] }} />
                    <span style={{ fontSize:'13px', fontWeight:500, color:'var(--text-primary)', textTransform:'capitalize' }}>{type}</span>
                    <span style={{ fontSize:'11px', color:'var(--text-muted)' }}>({count})</span>
                  </div>
                  <span style={{ fontSize:'13px', fontWeight:600, color:'var(--text-primary)' }}>{formatCurrency(bal)}</span>
                </div>
              );
            })}
          </div>

          <div style={{ background: 'linear-gradient(135deg, var(--navy) 0%, var(--navy-light) 100%)', borderRadius:'var(--radius-lg)', padding:'24px', boxShadow:'var(--shadow-md)' }}>
            <p style={{ fontSize:'12px', color:'var(--gold-light)', fontWeight:600, letterSpacing:'1px', textTransform:'uppercase', marginBottom:'10px' }}>Quick Actions</p>
            {[
              { label:'New Account',     to:'/accounts/new' },
              { label:'New Transaction', to:'/transactions/new' },
              { label:'View Reports',    to:'/reports' },
            ].map(({ label, to }) => (
              <Link key={to} to={to} style={{ display:'flex', alignItems:'center', justifyContent:'space-between', padding:'10px 0', borderBottom:'1px solid rgba(255,255,255,0.08)', color:'rgba(255,255,255,0.8)', fontSize:'13px', fontWeight:500 }}>
                {label} <FontAwesomeIcon icon={faArrowRight} style={{ fontSize:'11px' }} />
              </Link>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
