import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faLock, faCheck } from '@fortawesome/free-solid-svg-icons';

export default function ResetPasswordPage() {
  const navigate = useNavigate();
  const [form, setForm] = useState({ password:'', confirm:'' });
  const [error, setError] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (form.password !== form.confirm) { setError('Passwords do not match.'); return; }
    if (form.password.length < 6) { setError('Password must be at least 6 characters.'); return; }
    setTimeout(() => navigate('/login'), 1500);
  };

  return (
    <div style={{ display:'flex', minHeight:'100vh', background:'var(--bg)', alignItems:'center', justifyContent:'center', padding:'40px', fontFamily:'var(--font-body)' }}>
      <div style={{ width:'100%', maxWidth:'380px', animation:'fadeUp 0.4s ease both' }}>
        <Link to="/" style={{ fontFamily:'var(--font-display)', fontSize:'18px', fontWeight:700, color:'var(--navy)', display:'block', marginBottom:'32px' }}>MBECCUL</Link>
        <h1 style={{ fontFamily:'var(--font-display)', fontSize:'26px', fontWeight:700, color:'var(--text-primary)', marginBottom:'8px' }}>Set New Password</h1>
        <p style={{ fontSize:'14px', color:'var(--text-muted)', marginBottom:'28px' }}>Choose a strong password for your account.</p>

        <div style={{ background:'var(--surface)', border:'1px solid var(--border)', borderRadius:'var(--radius-lg)', padding:'28px', boxShadow:'var(--shadow-sm)' }}>
          <form onSubmit={handleSubmit}>
            {[['New Password','password'],['Confirm Password','confirm']].map(([label,key]) => (
              <div key={key} style={{ marginBottom:'16px' }}>
                <label style={{ fontSize:'13px', fontWeight:600, color:'var(--text-secondary)', display:'block', marginBottom:'6px' }}>{label}</label>
                <div style={{ position:'relative' }}>
                  <FontAwesomeIcon icon={faLock} style={{ position:'absolute', left:'14px', top:'50%', transform:'translateY(-50%)', fontSize:'13px', color:'var(--text-muted)' }} />
                  <input type="password" required value={form[key]} onChange={e => setForm({...form,[key]:e.target.value})} placeholder="••••••••"
                    style={{ width:'100%', padding:'12px 14px 12px 40px', border:'1.5px solid var(--border)', borderRadius:'9px', fontSize:'14px', background:'var(--bg)', outline:'none', color:'var(--text-primary)' }}
                    onFocus={e => e.target.style.borderColor='var(--navy)'}
                    onBlur={e => e.target.style.borderColor='var(--border)'}
                  />
                </div>
              </div>
            ))}
            {error && <div style={{ background:'var(--danger-bg)', border:'1px solid var(--danger)', borderRadius:'8px', padding:'10px 14px', fontSize:'13px', color:'var(--danger)', marginBottom:'16px' }}>{error}</div>}
            <button type="submit" style={{ width:'100%', background:'var(--navy)', color:'#fff', border:'none', borderRadius:'10px', padding:'13px', fontSize:'15px', fontWeight:600, display:'flex', alignItems:'center', justifyContent:'center', gap:'10px' }}>
              <FontAwesomeIcon icon={faCheck} /> Update Password
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
