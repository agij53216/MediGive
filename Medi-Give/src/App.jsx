import { Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';
import PageTransition from './components/PageTransition';
import LandingPage from './pages/LandingPage';
import LoginPage from './pages/LoginPage';
import DonorDashboard from './pages/donor/DonorDashboard';
import NGODashboard from './pages/ngo/NGODashboard';
import AdminDashboard from './pages/admin/AdminDashboard';
import { useAuth } from './contexts/AuthContext';

function ProtectedRoute({ children, requiredRole }) {
  const { currentUser, userRole, loading } = useAuth();

  if (loading) return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
  if (!currentUser) return <Navigate to="/login" />;
  // For Hackathon demo ease: if role is missing/mismatch, we might want to let them fix it or just redirect
  // For now strict:
  if (requiredRole && userRole !== requiredRole) return <Navigate to="/" />;

  return children;
}

function App() {
  const location = useLocation();

  return (
    <AnimatePresence mode="wait">
      <Routes location={location} key={location.pathname}>
        <Route path="/" element={
          <PageTransition>
            <LandingPage />
          </PageTransition>
        } />
        <Route path="/login" element={
          <PageTransition>
            <LoginPage />
          </PageTransition>
        } />

        <Route path="/donor/*" element={
          <PageTransition>
            <ProtectedRoute requiredRole="donor">
              <DonorDashboard />
            </ProtectedRoute>
          </PageTransition>
        } />

        <Route path="/ngo/*" element={
          <PageTransition>
            <ProtectedRoute requiredRole="ngo">
              <NGODashboard />
            </ProtectedRoute>
          </PageTransition>
        } />

        {/* Admin Route (Demo: Assuming role='admin' or unrestricted for demo) */}
        <Route path="/admin" element={
          <PageTransition>
            <ProtectedRoute requiredRole="admin">
              <AdminDashboard />
            </ProtectedRoute>
          </PageTransition>
        } />
      </Routes>
    </AnimatePresence>
  );
}

export default App;