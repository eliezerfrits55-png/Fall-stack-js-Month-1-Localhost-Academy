import { useBank } from '../context/BankContext';
import PageHeader from '../components/PageHeader';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, Legend } from 'recharts';
import { formatCurrency } from '../utils/formatters';

const COLORS = ['#1A5FAB','#2D7D46','#C9A84C','#B83232','#7C3AED','#0B1C3D'];

const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <div style={{ background:'var(--surface)', border:'1px solid var(--border)', borderRadius:'8px', padding:'10px 14px', boxShadow:'var(--shadow-md)', fontFamily:'var(--font-body)' }}>
        <p style={{ fontSize:'12px', fontWeight:600, color:'var(--text-primary)', marginBottom:'4px' }}>{label}</p>
        <p style={{ fontSize:'13px', color:'var(--navy)', fontWeight:700 }}>{formatCurrency(payload[0].value)}</p>
      </div>
    );
  }
  return null;
};

export default function Reports() {
  const { accounts, transactions, totalBalance, totalDeposits, totalWithdrawals } = useBank();

  const balanceData = accounts.map(a => ({
    name: a.memberName.split(' ')[0],
    balance: a.balance,
  }));

  const txByType = [
    { name:'Deposits',    value: transactions.filter(t=>t.type==='deposit').length },
    { name:'Withdrawals', value: transactions.filter(t=>t.type==='withdrawal').length },
    { name:'Transfers',   value: transactions.filter(t=>t.type==='transfer').length },
  ];

  const byType = ['savings','current','fixed'].map(type => ({
    name: type.charAt(0).toUpperCase()+type.slice(1),
    value: accounts.filter(a=>a.accountType===type).reduce((s,a)=>s+a.balance,0),
  }));

  return (
    <div style={{ padding:'32px', maxWidth:'1100px' }}>
      <PageHeader title="Reports & Analytics" subtitle="Financial overview and portfolio breakdown" />

      {/* Summary row */}
      <div style={{ display:'grid', gridTemplateColumns:'repeat(3,1fr)', gap:'16px', marginBottom:'32px' }}>
        {[
          { label:'Net Assets',    value:formatCurrency(totalBalance),     color:'var(--navy)' },
          { label:'Total In',      value:formatCurrency(totalDeposits),    color:'var(--success)' },
          { label:'Total Out',     value:formatCurrency(totalWithdrawals), color:'var(--danger)' },
        ].map(({ label, value, color }) => (
          <div key={label} style={{ background:'var(--surface)', border:'1px solid var(--border)', borderRadius:'var(--radius-lg)', padding:'24px', boxShadow:'var(--shadow-sm)' }}>
            <p style={{ fontSize:'12px', color:'var(--text-muted)', fontWeight:600, textTransform:'uppercase', letterSpacing:'1px', marginBottom:'10px' }}>{label}</p>
            <p style={{ fontFamily:'var(--font-display)', fontSize:'28px', fontWeight:700, color }}>{value}</p>
          </div>
        ))}
      </div>

      {/* Charts */}
      <div style={{ display:'grid', gridTemplateColumns:'2fr 1fr', gap:'24px', marginBottom:'24px' }}>

        {/* Bar chart */}
        <div style={{ background:'var(--surface)', border:'1px solid var(--border)', borderRadius:'var(--radius-lg)', padding:'24px', boxShadow:'var(--shadow-sm)' }}>
          <h3 style={{ fontSize:'15px', fontWeight:700, color:'var(--text-primary)', marginBottom:'6px' }}>Balance by Member</h3>
          <p style={{ fontSize:'12px', color:'var(--text-muted)', marginBottom:'20px' }}>Current account balances across all members</p>
          <ResponsiveContainer width="100%" height={220}>
            <BarChart data={balanceData} barSize={32}>
              <XAxis dataKey="name" tick={{ fontSize:12, fill:'var(--text-muted)' }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize:11, fill:'var(--text-muted)' }} axisLine={false} tickLine={false} tickFormatter={v => v >= 1000000 ? `${(v/1000000).toFixed(1)}M` : v>=1000 ? `${(v/1000).toFixed(0)}K` : v} />
              <Tooltip content={<CustomTooltip />} cursor={{ fill:'rgba(11,28,61,0.04)' }} />
              <Bar dataKey="balance" fill="var(--navy)" radius={[6,6,0,0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Pie chart */}
        <div style={{ background:'var(--surface)', border:'1px solid var(--border)', borderRadius:'var(--radius-lg)', padding:'24px', boxShadow:'var(--shadow-sm)' }}>
          <h3 style={{ fontSize:'15px', fontWeight:700, color:'var(--text-primary)', marginBottom:'6px' }}>By Account Type</h3>
          <p style={{ fontSize:'12px', color:'var(--text-muted)', marginBottom:'12px' }}>Portfolio distribution</p>
          <ResponsiveContainer width="100%" height={220}>
            <PieChart>
              <Pie data={byType} cx="50%" cy="50%" innerRadius={55} outerRadius={80} dataKey="value" paddingAngle={4}>
                {byType.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
              </Pie>
              <Tooltip formatter={v => formatCurrency(v)} />
              <Legend iconType="circle" iconSize={8} wrapperStyle={{ fontSize:'12px' }} />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Transaction count */}
      <div style={{ background:'var(--surface)', border:'1px solid var(--border)', borderRadius:'var(--radius-lg)', padding:'24px', boxShadow:'var(--shadow-sm)' }}>
        <h3 style={{ fontSize:'15px', fontWeight:700, color:'var(--text-primary)', marginBottom:'20px' }}>Transaction Activity</h3>
        <div style={{ display:'flex', gap:'32px' }}>
          {txByType.map(({ name, value }, i) => (
            <div key={name} style={{ display:'flex', alignItems:'center', gap:'12px' }}>
              <div style={{ width:'12px', height:'12px', borderRadius:'3px', background:COLORS[i] }} />
              <div>
                <div style={{ fontSize:'13px', color:'var(--text-muted)' }}>{name}</div>
                <div style={{ fontSize:'20px', fontWeight:700, color:'var(--text-primary)', fontFamily:'var(--font-display)' }}>{value}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
