import { Routes, Route, Navigate } from 'react-router-dom';
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
  return (
    <Routes>
      <Route path="/" element={<LandingPage />} />
      <Route path="/login" element={<LoginPage />} />

      <Route path="/donor/*" element={
        <ProtectedRoute requiredRole="donor">
          <DonorDashboard />
        </ProtectedRoute>
      } />

      <Route path="/ngo/*" element={
        <ProtectedRoute requiredRole="ngo">
          <NGODashboard />
        </ProtectedRoute>
      } />

      {/* Admin Route (Demo: Assuming role='admin' or unrestricted for demo) */}
      <Route path="/admin" element={
        <ProtectedRoute requiredRole="admin">
          <AdminDashboard />
        </ProtectedRoute>
      } />
    </Routes>
  );
}

export default App;