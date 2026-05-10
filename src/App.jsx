import { Suspense, lazy } from 'react';
import { Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import ProtectedRoute from './components/ProtectedRoute';

// Public pages
const LandingPage = lazy(() => import('./pages/LandingPage'));
const LoginPage = lazy(() => import('./pages/LoginPage'));
const SignupPage = lazy(() => import('./pages/SignupPage'));
const ForgotPasswordPage = lazy(() => import('./pages/ForgotPasswordPage'));
const ResetPasswordPage = lazy(() => import('./pages/ResetPasswordPage'));

// App pages
const Dashboard = lazy(() => import('./pages/Dashboard'));
const Accounts = lazy(() => import('./pages/Accounts'));
const AccountDetail = lazy(() => import('./pages/AccountDetail'));
const NewAccount = lazy(() => import('./pages/NewAccount'));
const Transactions = lazy(() => import('./pages/Transactions'));
const NewTransaction = lazy(() => import('./pages/NewTransaction'));
const Reports = lazy(() => import('./pages/Reports'));
const NotFound = lazy(() => import('./pages/NotFound'));

function RouteFallback() {
  return (
    <div style={{ padding: '32px', color: 'var(--text-muted)', fontSize: '14px' }}>
      Loading...
    </div>
  );
}

function LazyPage({ children }) {
  return <Suspense fallback={<RouteFallback />}>{children}</Suspense>;
}

function AppShell({ children }) {
  return (
    <div style={{ display:'flex', minHeight:'100vh' }}>
      <Navbar />
      <main style={{ flex:1, overflowY:'auto', minHeight:'100vh' }}>
        {children}
      </main>
    </div>
  );
}

export default function App() {
  return (
    <Routes>
      {/* Public */}
      <Route path="/"                element={<LazyPage><LandingPage /></LazyPage>} />
      <Route path="/login"           element={<LazyPage><LoginPage /></LazyPage>} />
      <Route path="/signup"          element={<LazyPage><SignupPage /></LazyPage>} />
      <Route path="/forgot-password" element={<LazyPage><ForgotPasswordPage /></LazyPage>} />
      <Route path="/reset-password"  element={<LazyPage><ResetPasswordPage /></LazyPage>} />

      {/* Protected app pages */}
      <Route element={<ProtectedRoute />}>
        <Route path="/dashboard"         element={<AppShell><LazyPage><Dashboard /></LazyPage></AppShell>} />
        <Route path="/accounts"          element={<AppShell><LazyPage><Accounts /></LazyPage></AppShell>} />
        <Route path="/accounts/new"      element={<AppShell><LazyPage><NewAccount /></LazyPage></AppShell>} />
        <Route path="/accounts/:id"      element={<AppShell><LazyPage><AccountDetail /></LazyPage></AppShell>} />
        <Route path="/transactions"      element={<AppShell><LazyPage><Transactions /></LazyPage></AppShell>} />
        <Route path="/transactions/new"  element={<AppShell><LazyPage><NewTransaction /></LazyPage></AppShell>} />
        <Route path="/reports"           element={<AppShell><LazyPage><Reports /></LazyPage></AppShell>} />
      </Route>

      <Route path="*" element={<LazyPage><NotFound /></LazyPage>} />
    </Routes>
  );
}
