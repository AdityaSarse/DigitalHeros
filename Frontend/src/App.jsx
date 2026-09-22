import React, { useEffect } from 'react';
import { BrowserRouter, Routes, Route, useLocation, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import ProtectedRoute from './routes/ProtectedRoute';
import AdminRoute from './routes/AdminRoute';

// Layout
import Navbar from './components/layout/Navbar';
import Footer from './components/layout/Footer';
import GridLines from './components/layout/GridLines';

// Pages
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import Scores from './pages/Scores';
import Charities from './pages/Charities';
import Subscription from './pages/Subscription';
import Draws from './pages/Draws';
import Winners from './pages/Winners';
import AdminDashboard from './pages/admin/AdminDashboard';

// Scroll to top on route change
function ScrollToTop() {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);
  return null;
}

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <ScrollToTop />
        <div className="relative flex flex-col min-h-screen bg-[#F9F8F6] text-[#1A1A1A] selection:bg-[#D4AF37]/30 selection:text-[#1A1A1A]">
          <div className="paper-grain" />
          <GridLines />
          <Navbar />
          <main className="flex-grow">
            <Routes>
              {/* Public Routes */}
              <Route path="/" element={<Home />} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route path="/charities" element={<Charities />} />
              <Route path="/draws" element={<Draws />} />

              {/* Authenticated Member Routes */}
              <Route
                path="/dashboard"
                element={
                  <ProtectedRoute>
                    <Dashboard />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/scores"
                element={
                  <ProtectedRoute>
                    <Scores />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/subscription"
                element={
                  <ProtectedRoute>
                    <Subscription />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/winners"
                element={
                  <ProtectedRoute>
                    <Winners />
                  </ProtectedRoute>
                }
              />

              {/* Admin Routes */}
              <Route
                path="/admin"
                element={
                  <AdminRoute>
                    <AdminDashboard />
                  </AdminRoute>
                }
              />
              <Route
                path="/admin/*"
                element={
                  <AdminRoute>
                    <AdminDashboard />
                  </AdminRoute>
                }
              />

              {/* Fallback */}
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </main>
          <Footer />
        </div>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;
