import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useBank } from '../context/BankContext';
import PageHeader from '../components/PageHeader';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUser, faPhone, faEnvelope, faArrowLeft, faCheck } from '@fortawesome/free-solid-svg-icons';

const inputStyle = { width:'100%', padding:'11px 14px 11px 42px', border:'1.5px solid var(--border)', borderRadius:'9px', fontSize:'14px', background:'var(--bg)', outline:'none', color:'var(--text-primary)', transition:'border var(--transition)' };

export default function NewAccount() {
  const navigate = useNavigate();
  const { createAccount } = useBank();
  const [form, setForm] = useState({ memberName:'', phone:'', email:'', accountType:'savings', initialDeposit:'' });
  const [success, setSuccess] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    createAccount({ ...form, initialDeposit: parseFloat(form.initialDeposit) || 0 });
    setSuccess(true);
    setTimeout(() => navigate('/accounts'), 1500);
  };

  if (success) return (
    <div style={{ display:'flex', alignItems:'center', justifyContent:'center', height:'80vh', flexDirection:'column', gap:'16px' }}>
      <div style={{ width:'64px', height:'64px', borderRadius:'50%', background:'var(--success-bg)', display:'flex', alignItems:'center', justifyContent:'center' }}>
        <FontAwesomeIcon icon={faCheck} style={{ fontSize:'26px', color:'var(--success)' }} />
      </div>
      <h2 style={{ fontFamily:'var(--font-display)', fontSize:'22px', color:'var(--text-primary)' }}>Account Created!</h2>
      <p style={{ color:'var(--text-muted)' }}>Redirecting to accounts…</p>
    </div>
  );

  return (
    <div style={{ padding:'32px', maxWidth:'600px' }}>
      <button onClick={() => navigate(-1)} style={{ display:'flex', alignItems:'center', gap:'8px', background:'none', border:'none', color:'var(--text-muted)', fontSize:'14px', marginBottom:'24px', padding:0, cursor:'pointer' }}>
        <FontAwesomeIcon icon={faArrowLeft} style={{ fontSize:'12px' }} /> Back
      </button>
      <PageHeader title="New Member Account" subtitle="Register a new MBECCUL member" />

      <div style={{ background:'var(--surface)', border:'1px solid var(--border)', borderRadius:'var(--radius-lg)', padding:'32px', boxShadow:'var(--shadow-sm)' }}>
        <form onSubmit={handleSubmit}>
          <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:'20px' }}>

            {/* Full Name */}
            <div style={{ gridColumn:'1/-1' }}>
              <label style={{ fontSize:'13px', fontWeight:600, color:'var(--text-secondary)', display:'block', marginBottom:'6px' }}>Full Name *</label>
              <div style={{ position:'relative' }}>
                <FontAwesomeIcon icon={faUser} style={{ position:'absolute', left:'14px', top:'50%', transform:'translateY(-50%)', fontSize:'13px', color:'var(--text-muted)' }} />
                <input required value={form.memberName} onChange={e => setForm({...form, memberName:e.target.value})} placeholder="Emmanuel Tabi" style={inputStyle}
                  onFocus={e => e.target.style.borderColor='var(--navy)'}
                  onBlur={e => e.target.style.borderColor='var(--border)'}
                />
              </div>
            </div>

            {/* Phone */}
            <div>
              <label style={{ fontSize:'13px', fontWeight:600, color:'var(--text-secondary)', display:'block', marginBottom:'6px' }}>Phone Number *</label>
              <div style={{ position:'relative' }}>
                <FontAwesomeIcon icon={faPhone} style={{ position:'absolute', left:'14px', top:'50%', transform:'translateY(-50%)', fontSize:'13px', color:'var(--text-muted)' }} />
                <input required value={form.phone} onChange={e => setForm({...form, phone:e.target.value})} placeholder="+237 670 000 000" style={inputStyle}
                  onFocus={e => e.target.style.borderColor='var(--navy)'}
                  onBlur={e => e.target.style.borderColor='var(--border)'}
                />
              </div>
            </div>

            {/* Email */}
            <div>
              <label style={{ fontSize:'13px', fontWeight:600, color:'var(--text-secondary)', display:'block', marginBottom:'6px' }}>Email Address</label>
              <div style={{ position:'relative' }}>
                <FontAwesomeIcon icon={faEnvelope} style={{ position:'absolute', left:'14px', top:'50%', transform:'translateY(-50%)', fontSize:'13px', color:'var(--text-muted)' }} />
                <input type="email" value={form.email} onChange={e => setForm({...form, email:e.target.value})} placeholder="member@email.com" style={inputStyle}
                  onFocus={e => e.target.style.borderColor='var(--navy)'}
                  onBlur={e => e.target.style.borderColor='var(--border)'}
                />
              </div>
            </div>

            {/* Account Type */}
            <div>
              <label style={{ fontSize:'13px', fontWeight:600, color:'var(--text-secondary)', display:'block', marginBottom:'6px' }}>Account Type *</label>
              <select required value={form.accountType} onChange={e => setForm({...form, accountType:e.target.value})}
                style={{ ...inputStyle, paddingLeft:'14px', appearance:'none', cursor:'pointer' }}>
                <option value="savings">Savings Account</option>
                <option value="current">Current Account</option>
                <option value="fixed">Fixed Deposit</option>
              </select>
            </div>

            {/* Initial Deposit */}
            <div>
              <label style={{ fontSize:'13px', fontWeight:600, color:'var(--text-secondary)', display:'block', marginBottom:'6px' }}>Initial Deposit (XAF)</label>
              <input type="number" min="0" value={form.initialDeposit} onChange={e => setForm({...form, initialDeposit:e.target.value})} placeholder="0"
                style={{ ...inputStyle, paddingLeft:'14px' }}
                onFocus={e => e.target.style.borderColor='var(--navy)'}
                onBlur={e => e.target.style.borderColor='var(--border)'}
              />
            </div>
          </div>

          <div style={{ display:'flex', gap:'12px', marginTop:'28px' }}>
            <button type="submit" style={{ flex:1, background:'var(--navy)', color:'#fff', border:'none', borderRadius:'10px', padding:'13px', fontSize:'15px', fontWeight:600, display:'flex', alignItems:'center', justifyContent:'center', gap:'8px' }}>
              <FontAwesomeIcon icon={faCheck} /> Create Account
            </button>
            <button type="button" onClick={() => navigate('/accounts')} style={{ flex:1, background:'var(--surface)', color:'var(--text-secondary)', border:'1px solid var(--border)', borderRadius:'10px', padding:'13px', fontSize:'15px', fontWeight:600 }}>
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
