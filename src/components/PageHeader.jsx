export default function PageHeader({ title, subtitle, action }) {
  return (
    <div style={{ display:'flex', justifyContent:'space-between', alignItems:'flex-start', marginBottom:'28px' }}>
      <div>
        <h1 style={{ fontFamily:'var(--font-display)', fontSize:'26px', fontWeight:700, color:'var(--text-primary)', letterSpacing:'-0.3px', margin:0 }}>{title}</h1>
        {subtitle && <p style={{ fontSize:'14px', color:'var(--text-muted)', marginTop:'4px' }}>{subtitle}</p>}
      </div>
      {action && <div>{action}</div>}
    </div>
  );
}
