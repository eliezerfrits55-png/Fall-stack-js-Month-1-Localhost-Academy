import { Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faShieldHalved, faChartLine, faUsers, faLock, faArrowRight } from '@fortawesome/free-solid-svg-icons';

const features = [
  { icon: faShieldHalved, title:'Secure & Trusted',      desc:'Bank-grade security protecting every member transaction.' },
  { icon: faChartLine,    title:'Real-time Analytics',   desc:'Live dashboards showing assets, activity, and trends.' },
  { icon: faUsers,        title:'Member Management',     desc:'Create accounts, track history, manage portfolios.' },
  { icon: faLock,         title:'Protected Access',      desc:'Role-based login with full audit trail.' },
];

export default function LandingPage() {
  return (
    <div style={{ minHeight:'100vh', background:'var(--cream)', fontFamily:'var(--font-body)' }}>

      {/* Nav */}
      <header style={{
        display:'flex', justifyContent:'space-between', alignItems:'center',
        padding:'0 60px', height:'72px',
        background:'var(--navy)',
        position:'sticky', top:0, zIndex:100,
      }}>
        <div>
          <span style={{ fontFamily:'var(--font-display)', fontSize:'20px', fontWeight:700, color:'#fff' }}>MBECCUL</span>
          <span style={{ fontSize:'11px', color:'var(--gold-light)', marginLeft:'10px', letterSpacing:'2px', textTransform:'uppercase' }}>Credit Union</span>
        </div>
        <div style={{ display:'flex', gap:'12px', alignItems:'center' }}>
          <Link to="/login" style={{ fontSize:'14px', fontWeight:500, color:'rgba(255,255,255,0.75)', padding:'8px 16px', borderRadius:'8px', transition:'color var(--transition)' }}>
            Sign In
          </Link>
          <Link to="/signup" style={{ fontSize:'14px', fontWeight:600, color:'var(--navy)', background:'var(--gold)', padding:'9px 20px', borderRadius:'8px', transition:'opacity var(--transition)' }}>
            Get Started
          </Link>
        </div>
      </header>

      {/* Hero */}
      <section style={{
        background: `linear-gradient(135deg, var(--navy) 0%, var(--navy-light) 100%)`,
        padding:'100px 60px 80px',
        position:'relative', overflow:'hidden',
      }}>
        {/* Decorative circles */}
        <div style={{ position:'absolute', top:'-80px', right:'-80px', width:'400px', height:'400px', borderRadius:'50%', border:'1px solid rgba(201,168,76,0.12)', pointerEvents:'none' }} />
        <div style={{ position:'absolute', top:'-40px', right:'-40px', width:'280px', height:'280px', borderRadius:'50%', border:'1px solid rgba(201,168,76,0.08)', pointerEvents:'none' }} />

        <div style={{ maxWidth:'680px', animation:'fadeUp 0.6s ease both' }}>
          <div style={{ display:'inline-flex', alignItems:'center', gap:'8px', background:'rgba(201,168,76,0.15)', border:'1px solid rgba(201,168,76,0.3)', borderRadius:'20px', padding:'6px 14px', marginBottom:'28px' }}>
            <FontAwesomeIcon icon={faShieldHalved} style={{ fontSize:'12px', color:'var(--gold)' }} />
            <span style={{ fontSize:'12px', color:'var(--gold-light)', fontWeight:500, letterSpacing:'0.5px' }}>Mbengwi Cooperative Credit Union League</span>
          </div>
          <h1 style={{ fontFamily:'var(--font-display)', fontSize:'52px', fontWeight:700, color:'#fff', lineHeight:1.15, marginBottom:'20px', letterSpacing:'-1px' }}>
            Modern Finance<br />
            <span style={{ color:'var(--gold)' }}>Built for Members.</span>
          </h1>
          <p style={{ fontSize:'17px', color:'rgba(255,255,255,0.65)', lineHeight:1.7, maxWidth:'520px', marginBottom:'40px' }}>
            A professional dashboard for managing member accounts, processing transactions, and tracking every franc — with full transparency and control.
          </p>
          <div style={{ display:'flex', gap:'14px', flexWrap:'wrap' }}>
            <Link to="/login" style={{ display:'inline-flex', alignItems:'center', gap:'10px', background:'var(--gold)', color:'var(--navy)', fontWeight:700, fontSize:'15px', padding:'14px 28px', borderRadius:'10px', transition:'opacity var(--transition)' }}>
              Access Dashboard <FontAwesomeIcon icon={faArrowRight} style={{ fontSize:'13px' }} />
            </Link>
            <Link to="/signup" style={{ display:'inline-flex', alignItems:'center', gap:'10px', background:'rgba(255,255,255,0.1)', color:'#fff', fontWeight:500, fontSize:'15px', padding:'14px 28px', borderRadius:'10px', border:'1px solid rgba(255,255,255,0.2)', transition:'background var(--transition)' }}>
              Create Account
            </Link>
          </div>
        </div>
      </section>

      {/* Stats bar */}
      <section style={{ background:'var(--navy-mid)', padding:'24px 60px' }}>
        <div style={{ display:'flex', gap:'60px', flexWrap:'wrap' }}>
          {[['5,000+','Members Served'],['XAF 2B+','Assets Managed'],['99.9%','Uptime'],['2010','Founded']].map(([val,lab]) => (
            <div key={lab}>
              <div style={{ fontFamily:'var(--font-display)', fontSize:'24px', fontWeight:700, color:'var(--gold)' }}>{val}</div>
              <div style={{ fontSize:'12px', color:'rgba(255,255,255,0.5)', marginTop:'2px', letterSpacing:'0.5px' }}>{lab}</div>
            </div>
          ))}
        </div>
      </section>

      {/* Features */}
      <section style={{ padding:'80px 60px', background:'var(--cream)' }}>
        <div style={{ textAlign:'center', marginBottom:'60px' }}>
          <h2 style={{ fontFamily:'var(--font-display)', fontSize:'36px', fontWeight:700, color:'var(--navy)', marginBottom:'12px' }}>Everything you need</h2>
          <p style={{ fontSize:'16px', color:'var(--text-secondary)', maxWidth:'480px', margin:'0 auto' }}>Built for credit union staff who need speed, clarity, and trust in every interaction.</p>
        </div>
        <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fit, minmax(240px, 1fr))', gap:'24px', maxWidth:'1000px', margin:'0 auto' }}>
          {features.map(({ icon, title, desc }) => (
            <div key={title} style={{ background:'var(--white)', border:'1px solid var(--border)', borderRadius:'var(--radius-lg)', padding:'28px', boxShadow:'var(--shadow-sm)' }}>
              <div style={{ width:'44px', height:'44px', borderRadius:'12px', background:'rgba(11,28,61,0.06)', display:'flex', alignItems:'center', justifyContent:'center', marginBottom:'16px' }}>
                <FontAwesomeIcon icon={icon} style={{ fontSize:'18px', color:'var(--navy)' }} />
              </div>
              <h3 style={{ fontSize:'16px', fontWeight:600, color:'var(--navy)', marginBottom:'8px' }}>{title}</h3>
              <p style={{ fontSize:'14px', color:'var(--text-secondary)', lineHeight:1.6 }}>{desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section style={{ background:'var(--navy)', padding:'70px 60px', textAlign:'center' }}>
        <h2 style={{ fontFamily:'var(--font-display)', fontSize:'34px', fontWeight:700, color:'#fff', marginBottom:'14px' }}>Ready to get started?</h2>
        <p style={{ fontSize:'16px', color:'rgba(255,255,255,0.55)', marginBottom:'32px' }}>Demo credentials: admin@localhost.ac · react123</p>
        <div style={{ display:'flex', gap:'12px', justifyContent:'center' }}>
          <Link to="/login" style={{ background:'var(--gold)', color:'var(--navy)', fontWeight:700, fontSize:'15px', padding:'14px 32px', borderRadius:'10px' }}>
            Sign In to Dashboard
          </Link>
          <Link to="/signup" style={{ background:'rgba(255,255,255,0.1)', color:'#fff', fontWeight:500, fontSize:'15px', padding:'14px 32px', borderRadius:'10px', border:'1px solid rgba(255,255,255,0.2)' }}>
            Create Account
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer style={{ background:'var(--navy-mid)', padding:'24px 60px', display:'flex', justifyContent:'space-between', alignItems:'center' }}>
        <span style={{ fontSize:'13px', color:'rgba(255,255,255,0.35)' }}>© 2026 MBECCUL · All rights reserved</span>
        <span style={{ fontSize:'13px', color:'rgba(255,255,255,0.3)' }}>Build by Mr. Borista Localhost Academy · Month 1 Capstone</span>
      </footer>
    </div>
  );
}
