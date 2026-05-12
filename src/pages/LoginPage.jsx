import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEnvelope, faLock, faRightToBracket, faEye, faEyeSlash } from '@fortawesome/free-solid-svg-icons';
import { useAuth } from '../context/AuthContext';

export default function LoginPage() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ email:'', password:'' });
  const [showPass, setShowPass] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    await new Promise(r => setTimeout(r, 600)); // simulate network
    const ok = login(form.email, form.password);
    setLoading(false);
    if (ok) navigate('/dashboard');
    else setError('Invalid email or password. Try admin@localhost.ac / react123');
  };

  return (
    <div style={{ display:'flex', minHeight:'100vh', fontFamily:'var(--font-body)' }}>
      {/* Left panel */}
      <div style={{ flex:'0 0 45%', background:`linear-gradient(145deg, var(--navy) 0%, var(--navy-light) 100%)`, display:'flex', flexDirection:'column', padding:'60px', justifyContent:'space-between', position:'relative', overflow:'hidden' }}>
        <div style={{ position:'absolute', bottom:'-80px', right:'-80px', width:'350px', height:'350px', borderRadius:'50%', border:'1px solid rgba(201,168,76,0.1)' }} />
        <Link to="/" style={{ fontFamily:'var(--font-display)', fontSize:'22px', fontWeight:700, color:'#fff' }}>
          MBECCUL <span style={{ fontSize:'11px', color:'var(--gold-light)', letterSpacing:'2px', fontFamily:'var(--font-body)', verticalAlign:'middle', marginLeft:'6px' }}>CREDIT UNION</span>
        </Link>
        <div>
          <h2 style={{ fontFamily:'var(--font-display)', fontSize:'40px', fontWeight:700, color:'#fff', lineHeight:1.2, marginBottom:'16px' }}>
            Welcome<br />back.
          </h2>
          <p style={{ fontSize:'15px', color:'rgba(255,255,255,0.55)', lineHeight:1.7, maxWidth:'320px' }}>
            Sign in to access the MBECCUL staff dashboard and manage member accounts.
          </p>
          <div style={{ marginTop:'40px', padding:'20px', background:'rgba(201,168,76,0.1)', border:'1px solid rgba(201,168,76,0.2)', borderRadius:'10px' }}>
            <div style={{ fontSize:'12px', color:'var(--gold-light)', fontWeight:600, marginBottom:'8px', letterSpacing:'1px', textTransform:'uppercase' }}>Demo Credentials</div>
            <div style={{ fontSize:'13px', color:'rgba(255,255,255,0.7)' }}>admin@localhost.ac</div>
            <div style={{ fontSize:'13px', color:'rgba(255,255,255,0.7)' }}>react123</div>
          </div>
        </div>
        <div style={{ fontSize:'12px', color:'rgba(255,255,255,0.25)' }}>© 2025 MBECCUL · Localhost Academy</div>
      </div>

      {/* Right panel */}
      <div style={{ flex:1, display:'flex', alignItems:'center', justifyContent:'center', background:'var(--bg)', padding:'40px' }}>
        <div style={{ width:'100%', maxWidth:'380px', animation:'fadeUp 0.4s ease both' }}>
          <h1 style={{ fontFamily:'var(--font-display)', fontSize:'28px', fontWeight:700, color:'var(--text-primary)', marginBottom:'6px' }}>Sign In</h1>
          <p style={{ fontSize:'14px', color:'var(--text-muted)', marginBottom:'32px' }}>
            Don&apos;t have an account? <Link to="/signup" style={{ color:'var(--navy)', fontWeight:600 }}>Sign Up</Link>
          </p>

          <form onSubmit={handleSubmit}>
            {/* Email */}
            <div style={{ marginBottom:'18px' }}>
              <label style={{ fontSize:'13px', fontWeight:600, color:'var(--text-secondary)', display:'block', marginBottom:'6px' }}>Email Address</label>
              <div style={{ position:'relative' }}>
                <FontAwesomeIcon icon={faEnvelope} style={{ position:'absolute', left:'14px', top:'50%', transform:'translateY(-50%)', fontSize:'13px', color:'var(--text-muted)' }} />
                <input
                  type="email" required value={form.email}
                  onChange={e => setForm({...form, email:e.target.value})}
                  placeholder="admin@localhost.ac"
                  style={{ width:'100%', padding:'12px 14px 12px 40px', border:'1.5px solid var(--border)', borderRadius:'9px', fontSize:'14px', background:'var(--surface)', outline:'none', transition:'border var(--transition)' }}
                  onFocus={e => e.target.style.borderColor='var(--navy)'}
                  onBlur={e => e.target.style.borderColor='var(--border)'}
                />
              </div>
            </div>

            {/* Password */}
            <div style={{ marginBottom:'14px' }}>
              <label style={{ fontSize:'13px', fontWeight:600, color:'var(--text-secondary)', display:'block', marginBottom:'6px' }}>Password</label>
              <div style={{ position:'relative' }}>
                <FontAwesomeIcon icon={faLock} style={{ position:'absolute', left:'14px', top:'50%', transform:'translateY(-50%)', fontSize:'13px', color:'var(--text-muted)' }} />
                <input
                  type={showPass ? 'text' : 'password'} required value={form.password}
                  onChange={e => setForm({...form, password:e.target.value})}
                  placeholder="••••••••"
                  style={{ width:'100%', padding:'12px 40px 12px 40px', border:'1.5px solid var(--border)', borderRadius:'9px', fontSize:'14px', background:'var(--surface)', outline:'none', transition:'border var(--transition)' }}
                  onFocus={e => e.target.style.borderColor='var(--navy)'}
                  onBlur={e => e.target.style.borderColor='var(--border)'}
                />
                <button type="button" onClick={() => setShowPass(p => !p)} style={{ position:'absolute', right:'14px', top:'50%', transform:'translateY(-50%)', background:'none', border:'none', color:'var(--text-muted)', padding:0 }}>
                  <FontAwesomeIcon icon={showPass ? faEyeSlash : faEye} style={{ fontSize:'13px' }} />
                </button>
              </div>
            </div>

            <div style={{ textAlign:'right', marginBottom:'24px' }}>
              <Link to="/forgot-password" style={{ fontSize:'13px', color:'var(--navy)', fontWeight:500 }}>Forgot password?</Link>
            </div>

            {error && (
              <div style={{ background:'var(--danger-bg)', border:'1px solid var(--danger)', borderRadius:'8px', padding:'11px 14px', fontSize:'13px', color:'var(--danger)', marginBottom:'18px' }}>
                {error}
              </div>
            )}

            <button type="submit" disabled={loading} style={{
              width:'100%', background:'var(--navy)', color:'#fff', border:'none',
              borderRadius:'10px', padding:'13px', fontSize:'15px', fontWeight:600,
              display:'flex', alignItems:'center', justifyContent:'center', gap:'10px',
              opacity: loading ? 0.75 : 1, transition:'opacity var(--transition)',
            }}>
              <FontAwesomeIcon icon={faRightToBracket} />
              {loading ? 'Signing in…' : 'Sign In'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
