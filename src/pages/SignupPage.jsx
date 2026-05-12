import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUser, faEnvelope, faLock, faUserPlus } from '@fortawesome/free-solid-svg-icons';

export default function SignupPage() {
  const navigate = useNavigate();
  const [form, setForm] = useState({ name:'', email:'', password:'', confirm:'' });
  const [error, setError] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (form.password !== form.confirm) { setError('Passwords do not match.'); return; }
    if (form.password.length < 6) { setError('Password must be at least 6 characters.'); return; }
    // In the real version this will hit an API — for now redirect to login
    navigate('/login');
  };

  const inputStyle = { width:'100%', padding:'12px 14px 12px 40px', border:'1.5px solid var(--border)', borderRadius:'9px', fontSize:'14px', background:'var(--surface)', outline:'none', transition:'border var(--transition)', color:'var(--text-primary)' };

  return (
    <div style={{ display:'flex', minHeight:'100vh', background:'var(--bg)', alignItems:'center', justifyContent:'center', padding:'40px', fontFamily:'var(--font-body)' }}>
      <div style={{ width:'100%', maxWidth:'420px', animation:'fadeUp 0.4s ease both' }}>
        <Link to="/" style={{ fontFamily:'var(--font-display)', fontSize:'18px', fontWeight:700, color:'var(--navy)', display:'block', marginBottom:'32px' }}>MBECCUL</Link>
        <h1 style={{ fontFamily:'var(--font-display)', fontSize:'28px', fontWeight:700, color:'var(--text-primary)', marginBottom:'6px' }}>Create Account</h1>
        <p style={{ fontSize:'14px', color:'var(--text-muted)', marginBottom:'28px' }}>
          Already have an account? <Link to="/login" style={{ color:'var(--navy)', fontWeight:600 }}>Sign In</Link>
        </p>

        <div style={{ background:'var(--surface)', border:'1px solid var(--border)', borderRadius:'var(--radius-lg)', padding:'32px', boxShadow:'var(--shadow-sm)' }}>
          <form onSubmit={handleSubmit}>
            {[
              { label:'Full Name', key:'name', icon:faUser, type:'text', placeholder:'Emmanuel Tabi' },
              { label:'Email Address', key:'email', icon:faEnvelope, type:'email', placeholder:'you@mbeccul.cm' },
              { label:'Password', key:'password', icon:faLock, type:'password', placeholder:'Min. 6 characters' },
              { label:'Confirm Password', key:'confirm', icon:faLock, type:'password', placeholder:'Repeat password' },
            ].map(({ label, key, icon, type, placeholder }) => (
              <div key={key} style={{ marginBottom:'16px' }}>
                <label style={{ fontSize:'13px', fontWeight:600, color:'var(--text-secondary)', display:'block', marginBottom:'6px' }}>{label}</label>
                <div style={{ position:'relative' }}>
                  <FontAwesomeIcon icon={icon} style={{ position:'absolute', left:'14px', top:'50%', transform:'translateY(-50%)', fontSize:'13px', color:'var(--text-muted)' }} />
                  <input type={type} required placeholder={placeholder} value={form[key]}
                    onChange={e => setForm({...form, [key]:e.target.value})}
                    style={inputStyle}
                    onFocus={e => e.target.style.borderColor='var(--navy)'}
                    onBlur={e => e.target.style.borderColor='var(--border)'}
                  />
                </div>
              </div>
            ))}

            {error && <div style={{ background:'var(--danger-bg)', border:'1px solid var(--danger)', borderRadius:'8px', padding:'10px 14px', fontSize:'13px', color:'var(--danger)', marginBottom:'16px' }}>{error}</div>}

            <button type="submit" style={{ width:'100%', background:'var(--navy)', color:'#fff', border:'none', borderRadius:'10px', padding:'13px', fontSize:'15px', fontWeight:600, display:'flex', alignItems:'center', justifyContent:'center', gap:'10px', marginTop:'4px' }}>
              <FontAwesomeIcon icon={faUserPlus} /> Create Account
            </button>
          </form>
        </div>

        <p style={{ textAlign:'center', fontSize:'12px', color:'var(--text-muted)', marginTop:'20px' }}>
          Account creation is managed by your system administrator. <br />Contact support if you need access.
        </p>
      </div>
    </div>
  );
}
