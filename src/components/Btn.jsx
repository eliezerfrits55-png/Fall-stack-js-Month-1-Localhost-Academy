import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

export default function Btn({ children, icon, onClick, variant='primary', size='md', disabled=false, type='button' }) {
  const styles = {
    primary:   { background:'var(--navy)',    color:'#fff', border:'1px solid var(--navy)' },
    secondary: { background:'var(--surface)', color:'var(--text-primary)', border:'1px solid var(--border)' },
    danger:    { background:'var(--danger)',  color:'#fff', border:'1px solid var(--danger)' },
    gold:      { background:'var(--gold)',    color:'var(--navy)', border:'1px solid var(--gold)' },
    ghost:     { background:'transparent',   color:'var(--text-secondary)', border:'1px solid var(--border)' },
  };
  const sizes = {
    sm: { padding:'7px 14px', fontSize:'12px', borderRadius:'7px' },
    md: { padding:'10px 20px', fontSize:'14px', borderRadius:'8px' },
    lg: { padding:'13px 28px', fontSize:'15px', borderRadius:'10px' },
  };
  const s = styles[variant] || styles.primary;
  const sz = sizes[size] || sizes.md;
  return (
    <button type={type} onClick={onClick} disabled={disabled} style={{
      ...s, ...sz,
      display:'inline-flex', alignItems:'center', gap:'8px',
      fontWeight:600, cursor: disabled ? 'not-allowed' : 'pointer',
      opacity: disabled ? 0.6 : 1,
      transition:'all var(--transition)',
      fontFamily:'var(--font-body)',
    }}
      onMouseEnter={e => { if (!disabled) e.currentTarget.style.opacity='0.88'; }}
      onMouseLeave={e => { e.currentTarget.style.opacity='1'; }}
    >
      {icon && <FontAwesomeIcon icon={icon} style={{ fontSize: size === 'sm' ? '11px' : '13px' }} />}
      {children}
    </button>
  );
}
