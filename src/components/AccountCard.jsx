import { Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUser, faArrowRight } from '@fortawesome/free-solid-svg-icons';
import { formatCurrency, formatDate } from '../utils/formatters';

const typeColors = {
  savings: { color:'#1A5FAB', bg:'#EBF2FB' },
  current: { color:'#2D7D46', bg:'#EBF5EE' },
  fixed:   { color:'#B07D1A', bg:'#FDF3DC' },
};

export default function AccountCard({ account }) {
  const tc = typeColors[account.accountType] || typeColors.savings;
  const isDormant = account.status === 'dormant';

  return (
    <Link to={`/accounts/${account.id}`} style={{
      display:'block', background:'var(--surface)', border:'1px solid var(--border)',
      borderRadius:'var(--radius-lg)', padding:'20px',
      boxShadow:'var(--shadow-sm)', transition:'all var(--transition)',
      opacity: isDormant ? 0.75 : 1,
    }}
      onMouseEnter={e => { e.currentTarget.style.boxShadow='var(--shadow-md)'; e.currentTarget.style.transform='translateY(-2px)'; e.currentTarget.style.borderColor='var(--border-strong)'; }}
      onMouseLeave={e => { e.currentTarget.style.boxShadow='var(--shadow-sm)'; e.currentTarget.style.transform='translateY(0)'; e.currentTarget.style.borderColor='var(--border)'; }}
    >
      <div style={{ display:'flex', justifyContent:'space-between', alignItems:'flex-start', marginBottom:'16px' }}>
        <div style={{ display:'flex', alignItems:'center', gap:'12px' }}>
          <div style={{ width:'40px', height:'40px', borderRadius:'50%', background: isDormant ? '#f0f0f0' : 'var(--navy)', display:'flex', alignItems:'center', justifyContent:'center' }}>
            <FontAwesomeIcon icon={faUser} style={{ fontSize:'15px', color: isDormant ? '#999' : 'var(--gold)' }} />
          </div>
          <div>
            <div style={{ fontWeight:600, fontSize:'15px', color:'var(--text-primary)' }}>{account.memberName}</div>
            <div style={{ fontSize:'12px', color:'var(--text-muted)' }}>{account.memberNumber}</div>
          </div>
        </div>
        <span style={{ fontSize:'11px', fontWeight:600, padding:'4px 10px', borderRadius:'20px', background: isDormant ? 'rgba(0,0,0,0.06)' : 'var(--success-bg)', color: isDormant ? 'var(--text-muted)' : 'var(--success)', textTransform:'uppercase', letterSpacing:'0.5px' }}>
          {account.status}
        </span>
      </div>
      <div style={{ marginBottom:'12px' }}>
        <div style={{ fontSize:'11px', color:'var(--text-muted)', marginBottom:'4px', textTransform:'uppercase', letterSpacing:'1px' }}>Balance</div>
        <div style={{ fontSize:'22px', fontWeight:700, fontFamily:'var(--font-display)', color:'var(--text-primary)' }}>
          {formatCurrency(account.balance)}
        </div>
      </div>
      <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center' }}>
        <span style={{ fontSize:'11px', fontWeight:600, padding:'3px 10px', borderRadius:'20px', background:tc.bg, color:tc.color, textTransform:'capitalize' }}>
          {account.accountType}
        </span>
        <div style={{ display:'flex', alignItems:'center', gap:'6px', fontSize:'12px', color:'var(--text-muted)' }}>
          <span>Since {formatDate(account.createdAt)}</span>
          <FontAwesomeIcon icon={faArrowRight} style={{ fontSize:'10px' }} />
        </div>
      </div>
    </Link>
  );
}
