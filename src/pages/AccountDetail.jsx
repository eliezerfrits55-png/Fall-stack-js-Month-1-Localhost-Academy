import { useParams, Link, useNavigate } from 'react-router-dom';
import { useBank } from '../context/BankContext';
import TransactionItem from '../components/TransactionItem';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowLeft, faPlus, faPhone, faEnvelope, faCalendar, faCreditCard } from '@fortawesome/free-solid-svg-icons';
import { formatCurrency, formatDate } from '../utils/formatters';

const typeBadge = { savings:{ color:'#1A5FAB', bg:'#EBF2FB' }, current:{ color:'#2D7D46', bg:'#EBF5EE' }, fixed:{ color:'#B07D1A', bg:'#FDF3DC' } };

export default function AccountDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { accounts, transactions } = useBank();
  const account = accounts.find(a => a.id === id);
  const acctTxns = transactions.filter(t => t.accountId === id);

  if (!account) return (
    <div style={{ padding:'40px', textAlign:'center' }}>
      <h2 style={{ color:'var(--text-primary)' }}>Account not found</h2>
      <Link to="/accounts" style={{ color:'var(--navy)', marginTop:'12px', display:'inline-block' }}>← Back to Accounts</Link>
    </div>
  );

  const tc = typeBadge[account.accountType] || typeBadge.savings;

  return (
    <div style={{ padding:'32px', maxWidth:'900px' }}>
      <button onClick={() => navigate(-1)} style={{ display:'flex', alignItems:'center', gap:'8px', background:'none', border:'none', color:'var(--text-muted)', fontSize:'14px', marginBottom:'24px', padding:0, cursor:'pointer' }}>
        <FontAwesomeIcon icon={faArrowLeft} style={{ fontSize:'12px' }} /> Back
      </button>

      {/* Account hero card */}
      <div style={{ background:'linear-gradient(135deg, var(--navy) 0%, var(--navy-light) 100%)', borderRadius:'var(--radius-lg)', padding:'32px', marginBottom:'24px', position:'relative', overflow:'hidden' }}>
        <div style={{ position:'absolute', top:'-40px', right:'-40px', width:'200px', height:'200px', borderRadius:'50%', border:'1px solid rgba(255,255,255,0.06)' }} />
        <div style={{ display:'flex', justifyContent:'space-between', alignItems:'flex-start', marginBottom:'24px' }}>
          <div>
            <p style={{ fontSize:'12px', color:'rgba(255,255,255,0.45)', letterSpacing:'1px', textTransform:'uppercase', marginBottom:'6px' }}>{account.memberNumber}</p>
            <h1 style={{ fontFamily:'var(--font-display)', fontSize:'28px', fontWeight:700, color:'#fff', margin:0 }}>{account.memberName}</h1>
          </div>
          <div style={{ display:'flex', gap:'10px', alignItems:'center' }}>
            <span style={{ fontSize:'12px', fontWeight:600, padding:'5px 12px', borderRadius:'20px', background:tc.bg, color:tc.color, textTransform:'capitalize' }}>{account.accountType}</span>
            <span style={{ fontSize:'12px', fontWeight:600, padding:'5px 12px', borderRadius:'20px', background: account.status==='active' ? 'var(--success-bg)' : 'rgba(0,0,0,0.2)', color: account.status==='active' ? 'var(--success)' : 'rgba(255,255,255,0.5)', textTransform:'capitalize' }}>{account.status}</span>
          </div>
        </div>
        <div style={{ marginBottom:'24px' }}>
          <p style={{ fontSize:'13px', color:'rgba(255,255,255,0.45)', marginBottom:'4px' }}>Current Balance</p>
          <p style={{ fontFamily:'var(--font-display)', fontSize:'42px', fontWeight:700, color:'#fff', margin:0, letterSpacing:'-1px' }}>{formatCurrency(account.balance)}</p>
        </div>
        <div style={{ display:'flex', gap:'24px', flexWrap:'wrap' }}>
          {[
            { icon:faPhone,    label:'Phone',   value:account.phone },
            { icon:faEnvelope, label:'Email',   value:account.email },
            { icon:faCalendar, label:'Opened',  value:formatDate(account.createdAt) },
            { icon:faCreditCard, label:'Account', value:account.id },
          ].map(({ icon, label, value }) => (
            <div key={label}>
              <p style={{ fontSize:'11px', color:'rgba(255,255,255,0.4)', marginBottom:'2px', textTransform:'uppercase', letterSpacing:'0.5px' }}>{label}</p>
              <p style={{ fontSize:'13px', color:'rgba(255,255,255,0.8)', fontWeight:500, margin:0, display:'flex', alignItems:'center', gap:'6px' }}>
                <FontAwesomeIcon icon={icon} style={{ fontSize:'11px', color:'var(--gold-light)' }} />{value}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* Transactions */}
      <div style={{ background:'var(--surface)', border:'1px solid var(--border)', borderRadius:'var(--radius-lg)', boxShadow:'var(--shadow-sm)', overflow:'hidden' }}>
        <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', padding:'20px', borderBottom:'1px solid var(--border)' }}>
          <div>
            <h2 style={{ fontSize:'16px', fontWeight:700, color:'var(--text-primary)', margin:0 }}>Transaction History</h2>
            <p style={{ fontSize:'12px', color:'var(--text-muted)', marginTop:'2px' }}>{acctTxns.length} transactions</p>
          </div>
          <Link to="/transactions/new" style={{ display:'flex', alignItems:'center', gap:'8px', background:'var(--navy)', color:'#fff', padding:'9px 16px', borderRadius:'8px', fontSize:'13px', fontWeight:600 }}>
            <FontAwesomeIcon icon={faPlus} style={{ fontSize:'11px' }} /> New Transaction
          </Link>
        </div>
        {acctTxns.length === 0
          ? <p style={{ padding:'32px', textAlign:'center', color:'var(--text-muted)' }}>No transactions for this account yet.</p>
          : acctTxns.map(tx => <TransactionItem key={tx.id} tx={tx} />)
        }
      </div>
    </div>
  );
}
