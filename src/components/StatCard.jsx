import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

export default function StatCard({ label, value, icon, color, bgColor, trend }) {
  return (
    <div className="fade-up" style={{
      background:'var(--surface)', border:'1px solid var(--border)',
      borderRadius:'var(--radius-lg)', padding:'24px',
      boxShadow:'var(--shadow-sm)', position:'relative', overflow:'hidden',
      transition:'box-shadow var(--transition), transform var(--transition)',
    }}
      onMouseEnter={e => { e.currentTarget.style.boxShadow='var(--shadow-md)'; e.currentTarget.style.transform='translateY(-2px)'; }}
      onMouseLeave={e => { e.currentTarget.style.boxShadow='var(--shadow-sm)'; e.currentTarget.style.transform='translateY(0)'; }}
    >
      {/* Decorative accent */}
      <div style={{ position:'absolute', top:0, left:0, width:'4px', height:'100%', background:color, borderRadius:'16px 0 0 16px' }} />
      <div style={{ display:'flex', justifyContent:'space-between', alignItems:'flex-start', marginBottom:'16px' }}>
        <span style={{ fontSize:'12px', fontWeight:600, color:'var(--text-muted)', textTransform:'uppercase', letterSpacing:'1px' }}>
          {label}
        </span>
        <div style={{ width:'40px', height:'40px', borderRadius:'10px', background: bgColor || color + '18', display:'flex', alignItems:'center', justifyContent:'center' }}>
          <FontAwesomeIcon icon={icon} style={{ fontSize:'16px', color }} />
        </div>
      </div>
      <div style={{ fontSize:'26px', fontWeight:700, color:'var(--text-primary)', fontFamily:'var(--font-display)', letterSpacing:'-0.5px' }}>
        {value}
      </div>
      {trend && (
        <div style={{ marginTop:'8px', fontSize:'12px', color:'var(--text-muted)' }}>{trend}</div>
      )}
    </div>
  );
}
