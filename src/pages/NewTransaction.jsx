import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useBank } from '../context/BankContext';
import PageHeader from '../components/PageHeader';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowDown, faArrowUp, faArrowRightArrowLeft, faCheck, faArrowLeft } from '@fortawesome/free-solid-svg-icons';
import { formatCurrency } from '../utils/formatters';

export default function NewTransaction() {
  const navigate = useNavigate();
  const { accounts, deposit, withdraw, transfer } = useBank();
  const [form, setForm] = useState({ type:'deposit', accountId:'', toAccountId:'', amount:'', description:'' });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  const active = accounts.filter(a => a.status === 'active');
  const selectedAccount = accounts.find(a => a.id === form.accountId);

  const typeButtons = [
    { value:'deposit',    label:'Deposit',    icon:faArrowDown,              color:'var(--success)' },
    { value:'withdrawal', label:'Withdrawal', icon:faArrowUp,                color:'var(--danger)' },
    { value:'transfer',   label:'Transfer',   icon:faArrowRightArrowLeft,    color:'var(--info)' },
  ];

  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');
    const amount = parseFloat(form.amount);
    if (!form.accountId) return setError('Please select an account.');
    if (!amount || amount <= 0) return setError('Enter a valid amount greater than 0.');

    if (form.type === 'deposit') {
      deposit({ accountId:form.accountId, amount, description:form.description || 'Deposit' });
    } else if (form.type === 'withdrawal') {
      if (selectedAccount.balance < amount) return setError(`Insufficient funds. Balance: ${formatCurrency(selectedAccount.balance)}`);
      withdraw({ accountId:form.accountId, amount, description:form.description || 'Withdrawal' });
    } else if (form.type === 'transfer') {
      if (!form.toAccountId) return setError('Select a destination account.');
      if (form.toAccountId === form.accountId) return setError('Cannot transfer to the same account.');
      if (selectedAccount.balance < amount) return setError('Insufficient funds.');
      transfer({ fromId:form.accountId, toId:form.toAccountId, amount, description:form.description });
    }
    setSuccess(true);
    setTimeout(() => navigate('/transactions'), 1500);
  };

  if (success) return (
    <div style={{ display:'flex', alignItems:'center', justifyContent:'center', height:'80vh', flexDirection:'column', gap:'16px', fontFamily:'var(--font-body)' }}>
      <div style={{ width:'64px', height:'64px', borderRadius:'50%', background:'var(--success-bg)', display:'flex', alignItems:'center', justifyContent:'center' }}>
        <FontAwesomeIcon icon={faCheck} style={{ fontSize:'26px', color:'var(--success)' }} />
      </div>
      <h2 style={{ fontFamily:'var(--font-display)', fontSize:'22px', color:'var(--text-primary)' }}>Transaction Successful!</h2>
      <p style={{ color:'var(--text-muted)' }}>Redirecting to transaction log…</p>
    </div>
  );

  const selStyle = { width:'100%', padding:'11px 14px', border:'1.5px solid var(--border)', borderRadius:'9px', fontSize:'14px', background:'var(--bg)', outline:'none', color:'var(--text-primary)', cursor:'pointer' };
  const inpStyle = { width:'100%', padding:'11px 14px', border:'1.5px solid var(--border)', borderRadius:'9px', fontSize:'14px', background:'var(--bg)', outline:'none', color:'var(--text-primary)' };

  return (
    <div style={{ padding:'32px', maxWidth:'560px' }}>
      <button onClick={() => navigate(-1)} style={{ display:'flex', alignItems:'center', gap:'8px', background:'none', border:'none', color:'var(--text-muted)', fontSize:'14px', marginBottom:'24px', padding:0, cursor:'pointer' }}>
        <FontAwesomeIcon icon={faArrowLeft} style={{ fontSize:'12px' }} /> Back
      </button>
      <PageHeader title="New Transaction" subtitle="Process a deposit, withdrawal, or transfer" />

      <div style={{ background:'var(--surface)', border:'1px solid var(--border)', borderRadius:'var(--radius-lg)', padding:'32px', boxShadow:'var(--shadow-sm)' }}>
        <form onSubmit={handleSubmit}>

          {/* Type selector */}
          <div style={{ marginBottom:'24px' }}>
            <label style={{ fontSize:'13px', fontWeight:600, color:'var(--text-secondary)', display:'block', marginBottom:'10px' }}>Transaction Type</label>
            <div style={{ display:'flex', gap:'10px' }}>
              {typeButtons.map(({ value, label, icon, color }) => (
                <button key={value} type="button" onClick={() => setForm({...form, type:value})} style={{
                  flex:1, padding:'12px 8px', border:`2px solid ${form.type===value ? color : 'var(--border)'}`,
                  borderRadius:'10px', background: form.type===value ? color+'12' : 'var(--bg)',
                  color: form.type===value ? color : 'var(--text-muted)',
                  display:'flex', flexDirection:'column', alignItems:'center', gap:'6px',
                  fontSize:'12px', fontWeight:600, transition:'all var(--transition)',
                }}>
                  <FontAwesomeIcon icon={icon} style={{ fontSize:'16px' }} />
                  {label}
                </button>
              ))}
            </div>
          </div>

          {/* From account */}
          <div style={{ marginBottom:'16px' }}>
            <label style={{ fontSize:'13px', fontWeight:600, color:'var(--text-secondary)', display:'block', marginBottom:'6px' }}>
              {form.type === 'transfer' ? 'From Account' : 'Account'} *
            </label>
            <select required value={form.accountId} onChange={e => setForm({...form, accountId:e.target.value})} style={selStyle}
              onFocus={e => e.target.style.borderColor='var(--navy)'}
              onBlur={e => e.target.style.borderColor='var(--border)'}
            >
              <option value="">-- Select account --</option>
              {active.map(a => (
                <option key={a.id} value={a.id}>{a.memberName} ({a.id}) · {formatCurrency(a.balance)}</option>
              ))}
            </select>
          </div>

          {/* To account (transfer only) */}
          {form.type === 'transfer' && (
            <div style={{ marginBottom:'16px' }}>
              <label style={{ fontSize:'13px', fontWeight:600, color:'var(--text-secondary)', display:'block', marginBottom:'6px' }}>To Account *</label>
              <select required value={form.toAccountId} onChange={e => setForm({...form, toAccountId:e.target.value})} style={selStyle}>
                <option value="">-- Select destination --</option>
                {active.filter(a => a.id !== form.accountId).map(a => (
                  <option key={a.id} value={a.id}>{a.memberName} ({a.id})</option>
                ))}
              </select>
            </div>
          )}

          {/* Amount */}
          <div style={{ marginBottom:'16px' }}>
            <label style={{ fontSize:'13px', fontWeight:600, color:'var(--text-secondary)', display:'block', marginBottom:'6px' }}>Amount (XAF) *</label>
            <input type="number" min="1" required value={form.amount} onChange={e => setForm({...form, amount:e.target.value})} placeholder="0"
              style={inpStyle}
              onFocus={e => e.target.style.borderColor='var(--navy)'}
              onBlur={e => e.target.style.borderColor='var(--border)'}
            />
          </div>

          {/* Description */}
          <div style={{ marginBottom:'24px' }}>
            <label style={{ fontSize:'13px', fontWeight:600, color:'var(--text-secondary)', display:'block', marginBottom:'6px' }}>Description</label>
            <input value={form.description} onChange={e => setForm({...form, description:e.target.value})} placeholder="Optional note…"
              style={inpStyle}
              onFocus={e => e.target.style.borderColor='var(--navy)'}
              onBlur={e => e.target.style.borderColor='var(--border)'}
            />
          </div>

          {error && <div style={{ background:'var(--danger-bg)', border:'1px solid var(--danger)', borderRadius:'8px', padding:'11px 14px', fontSize:'13px', color:'var(--danger)', marginBottom:'16px' }}>{error}</div>}

          <div style={{ display:'flex', gap:'12px' }}>
            <button type="submit" style={{ flex:1, background:'var(--navy)', color:'#fff', border:'none', borderRadius:'10px', padding:'13px', fontSize:'15px', fontWeight:600, display:'flex', alignItems:'center', justifyContent:'center', gap:'8px' }}>
              <FontAwesomeIcon icon={faCheck} /> Confirm Transaction
            </button>
            <button type="button" onClick={() => navigate('/transactions')} style={{ flex:1, background:'var(--surface)', color:'var(--text-secondary)', border:'1px solid var(--border)', borderRadius:'10px', padding:'13px', fontSize:'15px', fontWeight:600 }}>
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
