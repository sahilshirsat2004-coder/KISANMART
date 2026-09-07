import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import Auth from './pages/Auth';
import FarmerDashboard from './pages/FarmerDashboard';
import ShopkeeperMarketplace from './pages/ShopkeeperMarketplace';
import DriverDashboard from './pages/DriverDashboard';
import AdminDashboard from './pages/AdminDashboard';
import LiveTrackingPage from './pages/LiveTrackingPage';

// Role-Based Route Guard
const ProtectedRoute = ({ children, allowedRoles }) => {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-[70vh] flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-emerald-600"></div>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  if (allowedRoles && !allowedRoles.includes(user.role)) {
    if (user.role === 'FARMER') return <Navigate to="/farmer" replace />;
    if (user.role === 'SHOPKEEPER') return <Navigate to="/shop" replace />;
    if (user.role === 'DRIVER') return <Navigate to="/driver" replace />;
    if (user.role === 'ADMIN') return <Navigate to="/admin" replace />;
    return <Navigate to="/login" replace />;
  }

  return children;
};

export default function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="min-h-screen bg-[#F7FCF8] flex flex-col font-sans text-slate-900">
          <Navbar />
          <main className="flex-1">
            <Routes>
              {/* Public Routes */}
              <Route path="/" element={<Home />} />
              <Route path="/shop" element={<ShopkeeperMarketplace />} />
              <Route path="/login" element={<Auth />} />

              {/* Standalone Live Delivery Telematics */}
              <Route path="/tracking/:orderId" element={<LiveTrackingPage />} />

              {/* Farmer Workspace */}
              <Route
                path="/farmer"
                element={
                  <ProtectedRoute allowedRoles={['FARMER', 'ADMIN']}>
                    <FarmerDashboard />
                  </ProtectedRoute>
                }
              />

              {/* Driver Partner Workspace */}
              <Route
                path="/driver"
                element={
                  <ProtectedRoute allowedRoles={['DRIVER', 'ADMIN']}>
                    <DriverDashboard />
                  </ProtectedRoute>
                }
              />

              {/* Platform Administration */}
              <Route
                path="/admin"
                element={
                  <ProtectedRoute allowedRoles={['ADMIN']}>
                    <AdminDashboard />
                  </ProtectedRoute>
                }
              />

              {/* Catch-all */}
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </main>
        </div>
      </Router>
    </AuthProvider>
  );
}