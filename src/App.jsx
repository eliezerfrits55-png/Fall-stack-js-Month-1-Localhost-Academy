// *1. on separe les interface Admin,Manger et client pour :
// -Pourla securisation car meme ci les elements sont caches dans l'inferface, un utilisateur avec des connaissances techniques peut inspecter le code source, le modifier ou desactiver le CSS pour l'afficher des section non autoriser
// -pour la comcentration si un client veut voir ses comptes et transactions rapident, pas un tableau de bord complexe avec des radios bancaires, un manager doit ce concentrer sur sa branche uniquement
// -la maintenance: la separation permet de modifier le portail client sans risquer de casser le panneau d'administration
// 2. La difference entre une route protegee par authentification et une route protegee par role
// -Roule protegee par authentification: Elle verifie uniquement la presence d'un utilisateur connecte, independamment de son role. l'objr=ectif etant de rediriger les personnes non connectees vers une autres page de login 
// comme exemple nous avons :  La route /client/dashboard.
//-Route protegee par role : Elle verifie d'abord l'authentification, puis verifie si le role de l'utilisateur connecte fait partie d'une liste de roles autorises.c'est une couche de securiter supplementaire.
// comme exemple nous avons : La route /admin/branches.
//3. les limites de cette approche et comment un vrai backent (note.js + MongoDB) changerait
//*Pour la limite de localStorage
//- securites inexistante : les donnees stockees dans localStorage sont facilement accessibles et modifiables par les utilisateurs
//- pas de persistance multi-appareils/sessions : les donnees ne sont accessibles que sur le navigateur et l'appareil
//-persistance des donnees : les donnees peuvent etre perdues si l'utilisateur efface le cache ou utilise un autre navigateur ou appareil.

import { Routes, Route } from 'react-router-dom';
import ProtectedRoute from './components/ProtectedRoute';
import Navbar from './components/Navbar';

// Public pages
import LandingPage from './pages/LandingPage';
import LoginPage from './pages/LoginPage';
import SignupPage from './pages/SignupPage';
import ForgotPasswordPage from './pages/ForgotPasswordPage';
import ResetPasswordPage from './pages/ResetPasswordPage';

// Admin/Manager pages
import Dashboard from './pages/Dashboard';
import Branches from './pages/Branches';
import Users from './pages/Users';
import Accounts from './pages/Accounts';
import AccountDetail from './pages/AccountDetail';
import NewAccount from './pages/NewAccount';
import Transactions from './pages/Transactions';
import NewTransaction from './pages/NewTransaction';
import Reports from './pages/Reports';

// Client pages
import ClientDashboard from './pages/Client/ClientDashboard';
import ClientAccounts from './pages/Client/ClientAccounts';
import ClientTransactions from './pages/Client/ClientTransactions';

// Error page
import NotFound from './pages/NotFound';

// Layout wrapper with Navbar and main content area
function AppShell({ children }) {
  return (
    <div style={{ display: 'flex', minHeight: '100vh' }}>
      <Navbar />
      <main style={{ flex: 1, overflowY: 'auto', minHeight: '100vh' }}>
        {children}
      </main>
    </div>
  );
}

export default function App() {
  return (
    <Routes>
              {/* Public routes */}
              <Route path="/" element={<LandingPage />} />
              <Route path="/login" element={<LoginPage />} />
              <Route path="/signup" element={<SignupPage />} />
              <Route path="/forgot-password" element={<ForgotPasswordPage />} />
              <Route path="/reset-password" element={<ResetPasswordPage />} />

              {/* Admin-only routes */}
              <Route
                path="/branches"
                element={
                  <ProtectedRoute roles={['admin']}>
                    <AppShell><Branches /></AppShell>
                  </ProtectedRoute>
                }
              />
              <Route
                path="/users"
                element={
                  <ProtectedRoute roles={['admin']}>
                    <AppShell><Users /></AppShell>
                  </ProtectedRoute>
                }
              />

              {/* Admin + Manager routes */}
              <Route
                path="/dashboard"
                element={
                  <ProtectedRoute roles={['admin', 'manager']}>
                    <AppShell><Dashboard /></AppShell>
                  </ProtectedRoute>
                }
              />
              <Route
                path="/accounts"
                element={
                  <ProtectedRoute roles={['admin', 'manager']}>
                    <AppShell><Accounts /></AppShell>
                  </ProtectedRoute>
                }
              />
              <Route
                path="/accounts/new"
                element={
                  <ProtectedRoute roles={['admin', 'manager']}>
                    <AppShell><NewAccount /></AppShell>
                  </ProtectedRoute>
                }
              />
              <Route
                path="/accounts/:id"
                element={
                  <ProtectedRoute roles={['admin', 'manager']}>
                    <AppShell><AccountDetail /></AppShell>
                  </ProtectedRoute>
                }
              />
              <Route
                path="/transactions"
                element={
                  <ProtectedRoute roles={['admin', 'manager']}>
                    <AppShell><Transactions /></AppShell>
                  </ProtectedRoute>
                }
              />
              <Route
                path="/transactions/new"
                element={
                  <ProtectedRoute roles={['admin', 'manager']}>
                    <AppShell><NewTransaction /></AppShell>
                  </ProtectedRoute>
                }
              />
              <Route
                path="/reports"
                element={
                  <ProtectedRoute roles={['admin', 'manager']}>
                    <AppShell><Reports /></AppShell>
                  </ProtectedRoute>
                }
              />

              {/* Client-only routes */}
              <Route
                path="/client/dashboard"
                element={
                  <ProtectedRoute roles={['client']}>
                    <AppShell><ClientDashboard /></AppShell>
                  </ProtectedRoute>
                }
              />
              <Route
                path="/client/accounts"
                element={
                  <ProtectedRoute roles={['client']}>
                    <AppShell><ClientAccounts /></AppShell>
                  </ProtectedRoute>
                }
              />
              <Route
                path="/client/transactions"
                element={
                  <ProtectedRoute roles={['client']}>
                    <AppShell><ClientTransactions /></AppShell>
                  </ProtectedRoute>
                }
              />

              {/* Default route */}
              <Route path="*" element={<NotFound />} />
            </Routes>
  );
}