import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowDown, faArrowUp, faArrowRightArrowLeft } from '@fortawesome/free-solid-svg-icons';
import { formatCurrency, formatDateTime } from '../utils/formatters';

const config = {
  deposit:    { icon: faArrowDown,              color:'var(--success)', bg:'var(--success-bg)', label:'Deposit',    sign:'+' },
  withdrawal: { icon: faArrowUp,                color:'var(--danger)',  bg:'var(--danger-bg)',  label:'Withdrawal', sign:'-' },
  transfer:   { icon: faArrowRightArrowLeft,    color:'var(--info)',    bg:'var(--info-bg)',    label:'Transfer',   sign:'-' },
};

export default function TransactionItem({ tx, showAccount, accounts }) {
  const c = config[tx.type] || config.deposit;
  const accountName = accounts?.find(a => a.id === tx.accountId)?.memberName;

  return (
    <div style={{
      display:'flex', alignItems:'center', gap:'14px',
      padding:'14px 20px', borderBottom:'1px solid var(--border)',
      transition:'background var(--transition)',
      cursor:'default',
    }}
      onMouseEnter={e => e.currentTarget.style.background='var(--bg)'}
      onMouseLeave={e => e.currentTarget.style.background='transparent'}
    >
      <div style={{ width:'36px', height:'36px', borderRadius:'10px', background:c.bg, display:'flex', alignItems:'center', justifyContent:'center', flexShrink:0 }}>
        <FontAwesomeIcon icon={c.icon} style={{ fontSize:'13px', color:c.color }} />
      </div>
      <div style={{ flex:1, minWidth:0 }}>
        <div style={{ fontSize:'14px', fontWeight:500, color:'var(--text-primary)', whiteSpace:'nowrap', overflow:'hidden', textOverflow:'ellipsis' }}>
          {tx.description || c.label}
        </div>
        <div style={{ fontSize:'12px', color:'var(--text-muted)', marginTop:'2px' }}>
          {formatDateTime(tx.date)}{showAccount && accountName ? ` · ${accountName}` : ''}
        </div>
      </div>
      <div style={{ textAlign:'right', flexShrink:0 }}>
        <div style={{ fontSize:'14px', fontWeight:700, color: c.sign === '+' ? 'var(--success)' : 'var(--danger)' }}>
          {c.sign}{formatCurrency(tx.amount)}
        </div>
        <div style={{ fontSize:'11px', color:'var(--text-muted)', marginTop:'2px' }}>
          Bal: {formatCurrency(tx.balanceAfter)}
        </div>
      </div>
    </div>
  );
}
