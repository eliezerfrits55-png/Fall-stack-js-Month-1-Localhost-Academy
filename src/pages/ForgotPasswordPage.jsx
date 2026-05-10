import { useState } from 'react';
import { Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEnvelope, faPaperPlane, faArrowLeft } from '@fortawesome/free-solid-svg-icons';

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('');
  const [sent, setSent] = useState(false);

  const handleSubmit = (e) => { e.preventDefault(); setSent(true); };

  return (
    <div style={{ display:'flex', minHeight:'100vh', background:'var(--bg)', alignItems:'center', justifyContent:'center', padding:'40px', fontFamily:'var(--font-body)' }}>
      <div style={{ width:'100%', maxWidth:'380px', animation:'fadeUp 0.4s ease both' }}>
        <Link to="/" style={{ fontFamily:'var(--font-display)', fontSize:'18px', fontWeight:700, color:'var(--navy)', display:'block', marginBottom:'32px' }}>MBECCUL</Link>

        {!sent ? (
          <>
            <h1 style={{ fontFamily:'var(--font-display)', fontSize:'26px', fontWeight:700, color:'var(--text-primary)', marginBottom:'8px' }}>Forgot Password?</h1>
            <p style={{ fontSize:'14px', color:'var(--text-muted)', marginBottom:'28px', lineHeight:1.6 }}>
              Enter your email and we'll send you a link to reset your password.
            </p>
            <div style={{ background:'var(--surface)', border:'1px solid var(--border)', borderRadius:'var(--radius-lg)', padding:'28px', boxShadow:'var(--shadow-sm)' }}>
              <form onSubmit={handleSubmit}>
                <div style={{ marginBottom:'20px' }}>
                  <label style={{ fontSize:'13px', fontWeight:600, color:'var(--text-secondary)', display:'block', marginBottom:'6px' }}>Email Address</label>
                  <div style={{ position:'relative' }}>
                    <FontAwesomeIcon icon={faEnvelope} style={{ position:'absolute', left:'14px', top:'50%', transform:'translateY(-50%)', fontSize:'13px', color:'var(--text-muted)' }} />
                    <input type="email" required value={email} onChange={e => setEmail(e.target.value)} placeholder="your@email.com"
                      style={{ width:'100%', padding:'12px 14px 12px 40px', border:'1.5px solid var(--border)', borderRadius:'9px', fontSize:'14px', background:'var(--bg)', outline:'none', color:'var(--text-primary)' }}
                      onFocus={e => e.target.style.borderColor='var(--navy)'}
                      onBlur={e => e.target.style.borderColor='var(--border)'}
                    />
                  </div>
                </div>
                <button type="submit" style={{ width:'100%', background:'var(--navy)', color:'#fff', border:'none', borderRadius:'10px', padding:'13px', fontSize:'15px', fontWeight:600, display:'flex', alignItems:'center', justifyContent:'center', gap:'10px' }}>
                  <FontAwesomeIcon icon={faPaperPlane} /> Send Reset Link
                </button>
              </form>
            </div>
          </>
        ) : (
          <div style={{ background:'var(--surface)', border:'1px solid var(--border)', borderRadius:'var(--radius-lg)', padding:'40px', boxShadow:'var(--shadow-sm)', textAlign:'center' }}>
            <div style={{ width:'56px', height:'56px', borderRadius:'50%', background:'var(--success-bg)', display:'flex', alignItems:'center', justifyContent:'center', margin:'0 auto 20px' }}>
              <FontAwesomeIcon icon={faPaperPlane} style={{ fontSize:'22px', color:'var(--success)' }} />
            </div>
            <h2 style={{ fontFamily:'var(--font-display)', fontSize:'22px', fontWeight:700, color:'var(--text-primary)', marginBottom:'10px' }}>Check your inbox</h2>
            <p style={{ fontSize:'14px', color:'var(--text-muted)', lineHeight:1.6 }}>
              We've sent a reset link to <strong>{email}</strong>. It expires in 30 minutes.
            </p>
          </div>
        )}

        <div style={{ textAlign:'center', marginTop:'24px' }}>
          <Link to="/login" style={{ fontSize:'14px', color:'var(--text-secondary)', display:'inline-flex', alignItems:'center', gap:'6px' }}>
            <FontAwesomeIcon icon={faArrowLeft} style={{ fontSize:'12px' }} /> Back to Sign In
          </Link>
        </div>
      </div>
    </div>
  );
}
