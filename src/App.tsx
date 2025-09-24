import React, { Suspense, lazy } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { motion } from 'framer-motion';
import { AuthProvider, useAuth } from './hooks/useAuth';
import { CartProvider } from './hooks/useCart';
import { Layout } from './components/Layout';

// Lazy loading des pages pour optimiser les performances
const Home = lazy(() => import('./pages/Home'));
const Search = lazy(() => import('./pages/Search'));
const Profile = lazy(() => import('./pages/Profile'));
const ProductDetail = lazy(() => import('./pages/ProductDetail'));
const Cart = lazy(() => import('./pages/Cart'));
const Payment = lazy(() => import('./pages/Payment'));
const Auth = lazy(() => import('./pages/Auth'));
const LiveShopping = lazy(() => import('./pages/LiveShopping'));
const CreateProduct = lazy(() => import('./pages/CreateProduct'));
const ProductManagement = lazy(() => import('./pages/ProductManagement'));
const EditProduct = lazy(() => import('./pages/EditProduct'));
const Settings = lazy(() => import('./pages/Settings'));
const TestGemini = lazy(() => import('./pages/TestGemini'));

// Loading Component
function LoadingScreen({ message = "Chargement..." }: { message?: string }) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-600 via-blue-600 to-primary-800 flex items-center justify-center relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-white/10 rounded-full blur-3xl animate-float" />
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-white/10 rounded-full blur-3xl animate-float" style={{ animationDelay: '1s' }} />
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-white/5 rounded-full blur-3xl animate-pulse" />
      </div>

      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="text-center space-y-4 relative z-10"
      >
        <motion.div
          className="w-16 h-16 bg-white/20 backdrop-blur-lg rounded-2xl flex items-center justify-center mx-auto"
          animate={{ rotate: [0, 360] }}
          transition={{ rotate: { duration: 2, repeat: Infinity, ease: "linear" } }}
        >
          <span className="text-white font-bold text-xl">SC</span>
        </motion.div>
        <h2 className="text-white text-xl font-semibold">{message}</h2>
        <motion.div
          className="w-40 h-1 bg-white/30 rounded-full mx-auto overflow-hidden"
          initial={{ width: 0 }}
          animate={{ width: "100%" }}
          transition={{ duration: 1.5, ease: "easeOut" }}
        />
      </motion.div>
    </div>
  );
}


function Notifications() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 via-blue-50 to-surface-50 flex items-center justify-center">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center space-y-6 p-8"
      >
        <div className="w-24 h-24 bg-gradient-secondary rounded-3xl flex items-center justify-center mx-auto shadow-glow border border-white/30 backdrop-blur-sm">
          <span className="text-white font-bold text-3xl">🔔</span>
        </div>
        <div className="space-y-2">
          <h2 className="text-3xl font-bold text-surface-900">Notifications</h2>
          <p className="text-surface-600 text-lg">Vos dernières mises à jour et alertes</p>
        </div>
      </motion.div>
    </div>
  );
}

function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { user, loading } = useAuth();

  if (loading) {
    return <LoadingScreen message="Vérification de l'authentification..." />;
  }

  if (!user) {
    return <Navigate to="/auth" replace />;
  }

  return <>{children}</>;
}

function AppRoutes() {
  return (
    <Suspense fallback={<LoadingScreen message="Chargement de la page..." />}>
      <Routes>
        <Route path="/auth" element={<Auth />} />
        <Route path="/" element={<Layout />}>
          <Route index element={<Home />} />
          <Route path="search" element={<Search />} />
          <Route path="create" element={
            <ProtectedRoute>
              <CreateProduct />
            </ProtectedRoute>
          } />
          <Route path="create-product" element={
            <ProtectedRoute>
              <CreateProduct />
            </ProtectedRoute>
          } />
          <Route path="products" element={
            <ProtectedRoute>
              <ProductManagement />
            </ProtectedRoute>
          } />
          <Route path="edit-product/:id" element={
            <ProtectedRoute>
              <EditProduct />
            </ProtectedRoute>
          } />
          <Route path="notifications" element={
            <ProtectedRoute>
              <Notifications />
            </ProtectedRoute>
          } />
          <Route path="profile" element={<Profile />} />
          <Route path="product/:id" element={<ProductDetail />} />
          <Route path="cart" element={<Cart />} />
          <Route path="payment" element={
            <ProtectedRoute>
              <Payment />
            </ProtectedRoute>
          } />
          <Route path="live" element={<LiveShopping />} />
          <Route path="settings" element={
            <ProtectedRoute>
              <Settings />
            </ProtectedRoute>
          } />
          <Route path="test-gemini" element={<TestGemini />} />
        </Route>
      </Routes>
    </Suspense>
  );
}

function AppInner() {
  const { loading } = useAuth();

  if (loading) {
    return <LoadingScreen message="Initialisation de l'application..." />;
  }

  return (
    <Router>
      <div className="font-inter">
        <AppRoutes />
        <Toaster
          position="top-center"
          toastOptions={{
            className: 'surface-glass text-surface-900 shadow-large rounded-2xl border border-white/20',
            duration: 4000,
            style: {
              background: 'rgba(255, 255, 255, 0.9)',
              backdropFilter: 'blur(12px)',
            },
          }}
        />
      </div>
    </Router>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <CartProvider>
        <AppInner />
      </CartProvider>
    </AuthProvider>
  );
}