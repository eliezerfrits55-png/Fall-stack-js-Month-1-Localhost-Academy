import { Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faHouseChimney } from '@fortawesome/free-solid-svg-icons';

export default function NotFound() {
  return (
    <div style={{ display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center', height:'100vh', background:'var(--bg)', gap:'16px', fontFamily:'var(--font-body)', textAlign:'center', padding:'40px' }}>
      <div style={{ fontFamily:'var(--font-display)', fontSize:'100px', fontWeight:700, color:'var(--border)', lineHeight:1 }}>404</div>
      <h1 style={{ fontFamily:'var(--font-display)', fontSize:'26px', fontWeight:700, color:'var(--text-primary)', margin:0 }}>Page not found</h1>
      <p style={{ fontSize:'15px', color:'var(--text-muted)' }}>The page you're looking for doesn't exist.</p>
      <Link to="/dashboard" style={{ display:'inline-flex', alignItems:'center', gap:'8px', background:'var(--navy)', color:'#fff', padding:'12px 24px', borderRadius:'10px', fontSize:'14px', fontWeight:600, marginTop:'8px' }}>
        <FontAwesomeIcon icon={faHouseChimney} /> Back to Dashboard
      </Link>
    </div>
  );
}
