import { NavLink, useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faChartLine, faUsers, faArrowRightArrowLeft,
  faChartBar, faRightFromBracket, faSun, faMoon,
  faShield, faBars, faXmark
} from '@fortawesome/free-solid-svg-icons';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { useState } from 'react';

const baseLinks = [
  { to: '/dashboard',    label: 'Dashboard',    icon: faChartLine },
  { to: '/accounts',     label: 'Accounts',     icon: faUsers },
  { to: '/transactions', label: 'Transactions', icon: faArrowRightArrowLeft },
  { to: '/reports',      label: 'Reports',      icon: faChartBar },
];

export default function Navbar() {
  const { user, logout } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const navigate = useNavigate();
  const links = [...baseLinks];

  if (user?.role === 'admin') {
    links.splice(1, 0, { to: '/users', label: 'Users', icon: faShield });
  }
  const [collapsed, setCollapsed] = useState(false);

  const handleLogout = () => { logout(); navigate('/login'); };

  return (
    <aside style={{
      width: collapsed ? '64px' : 'var(--sidebar-width)',
      minHeight: '100vh',
      background: 'var(--navy)',
      display: 'flex',
      flexDirection: 'column',
      flexShrink: 0,
      transition: 'width 0.25s ease',
      overflow: 'hidden',
      position: 'relative',
      zIndex: 10,
    }}>
      {/* Logo */}
      <div style={{
        padding: collapsed ? '24px 0' : '28px 24px 20px',
        borderBottom: '1px solid rgba(255,255,255,0.08)',
        display: 'flex', alignItems: 'center', gap: '12px',
        justifyContent: collapsed ? 'center' : 'space-between',
      }}>
        {!collapsed && (
          <div>
            <div style={{ fontFamily:'var(--font-display)', fontSize:'18px', fontWeight:700, color:'#fff', letterSpacing:'0.5px' }}>
              MBECCUL
            </div>
            <div style={{ fontSize:'10px', color:'var(--gold-light)', letterSpacing:'2px', textTransform:'uppercase', marginTop:'2px' }}>
              Credit Union
            </div>
          </div>
        )}
        <button
          onClick={() => setCollapsed(c => !c)}
          style={{ background:'rgba(255,255,255,0.08)', border:'none', color:'#fff', width:'32px', height:'32px', borderRadius:'8px', display:'flex', alignItems:'center', justifyContent:'center', flexShrink:0, transition:'background var(--transition)' }}
        >
          <FontAwesomeIcon icon={collapsed ? faBars : faXmark} style={{ fontSize:'13px' }} />
        </button>
      </div>

      {/* Nav links */}
      <nav style={{ flex:1, padding:'16px 0' }}>
        {links.map(({ to, label, icon }) => (
          <NavLink key={to} to={to} style={({ isActive }) => ({
            display: 'flex',
            alignItems: 'center',
            gap: '12px',
            padding: collapsed ? '13px 0' : '13px 24px',
            justifyContent: collapsed ? 'center' : 'flex-start',
            color: isActive ? '#fff' : 'rgba(255,255,255,0.55)',
            background: isActive ? 'rgba(201,168,76,0.15)' : 'transparent',
            borderLeft: isActive ? '3px solid var(--gold)' : '3px solid transparent',
            fontSize: '14px',
            fontWeight: isActive ? 600 : 400,
            transition: 'all var(--transition)',
            whiteSpace: 'nowrap',
          })}>
            <FontAwesomeIcon icon={icon} style={{ fontSize:'15px', flexShrink:0 }} />
            {!collapsed && label}
          </NavLink>
        ))}
      </nav>

      {/* Bottom section */}
      <div style={{ borderTop:'1px solid rgba(255,255,255,0.08)', padding: collapsed ? '16px 0' : '16px 24px' }}>
        {/* User info */}
        {!collapsed && user && (
          <div style={{ display:'flex', alignItems:'center', gap:'10px', marginBottom:'16px' }}>
            <div style={{ width:'34px', height:'34px', borderRadius:'50%', background:'var(--gold)', display:'flex', alignItems:'center', justifyContent:'center', flexShrink:0 }}>
              <FontAwesomeIcon icon={faShield} style={{ fontSize:'14px', color:'var(--navy)' }} />
            </div>
            <div>
              <div style={{ fontSize:'13px', fontWeight:600, color:'#fff' }}>{user.name}</div>
              <div style={{ fontSize:'11px', color:'rgba(255,255,255,0.45)' }}>{user.role}</div>
            </div>
          </div>
        )}
        {/* Theme toggle */}
        <button
          onClick={toggleTheme}
          style={{
            display:'flex', alignItems:'center', gap:'10px',
            justifyContent: collapsed ? 'center' : 'flex-start',
            width:'100%', background:'rgba(255,255,255,0.07)', border:'none',
            color:'rgba(255,255,255,0.7)', borderRadius:'8px',
            padding: collapsed ? '10px 0' : '10px 14px',
            fontSize:'13px', marginBottom:'8px', transition:'background var(--transition)',
          }}
        >
          <FontAwesomeIcon icon={theme === 'light' ? faMoon : faSun} />
          {!collapsed && (theme === 'light' ? 'Dark Mode' : 'Light Mode')}
        </button>
        {/* Logout */}
        <button
          onClick={handleLogout}
          style={{
            display:'flex', alignItems:'center', gap:'10px',
            justifyContent: collapsed ? 'center' : 'flex-start',
            width:'100%', background:'none', border:'none',
            color:'rgba(255,255,255,0.5)', borderRadius:'8px',
            padding: collapsed ? '10px 0' : '10px 14px',
            fontSize:'13px', transition:'color var(--transition)',
          }}
        >
          <FontAwesomeIcon icon={faRightFromBracket} />
          {!collapsed && 'Sign Out'}
        </button>
      </div>
    </aside>
  );
}
