import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import About from './pages/About';
import Contact from './pages/Contact';
import Login from './pages/Login';
import Signup from './pages/Signup';
import ProductDetails from './pages/ProductDetails';
import BrandDashboard from './pages/BrandDashboard';
import BrandProducts from './pages/BrandProducts';
import ProductForm from './pages/ProductForm';
import Profile from './pages/Profile';
import ProfileEdit from './pages/ProfileEdit';
import PaymentSettings from './pages/PaymentSettings';
import Checkout from './pages/Checkout';
import OrderSuccess from './pages/OrderSuccess';
import MyOrders from './pages/MyOrders';
import SellerOrders from './pages/SellerOrders';
import './index.css';

function App() {
  return (
    <AuthProvider>
      <Router future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
        <Navbar />
        <div className="main-content">
          <Routes>
            {/* Public Routes */}
            <Route path="/" element={<Home />} />
            <Route path="/about" element={<About />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />
            <Route path="/product/:id" element={<ProductDetails />} />
            
            {/* Brand Protected Routes */}
            <Route path="/brand" element={
              <ProtectedRoute allowedRoles={['brand']}>
                <BrandDashboard />
              </ProtectedRoute>
            } />
            <Route path="/brand/products" element={
              <ProtectedRoute allowedRoles={['brand']}>
                <BrandProducts />
              </ProtectedRoute>
            } />
            <Route path="/brand/products/new" element={
              <ProtectedRoute allowedRoles={['brand']}>
                <ProductForm />
              </ProtectedRoute>
            } />
            <Route path="/brand/products/:id/edit" element={
              <ProtectedRoute allowedRoles={['brand']}>
                <ProductForm />
              </ProtectedRoute>
            } />
            <Route path="/brand/payment-settings" element={
              <ProtectedRoute allowedRoles={['brand']}>
                <PaymentSettings />
              </ProtectedRoute>
            } />
            
            {/* User Profile Routes - Protected for both brand and customer */}
            <Route path="/profile" element={
              <ProtectedRoute allowedRoles={['brand', 'customer']}>
                <Profile />
              </ProtectedRoute>
            } />
            <Route path="/profile/edit" element={
              <ProtectedRoute allowedRoles={['brand', 'customer']}>
                <ProfileEdit />
              </ProtectedRoute>
            } />
            
            {/* Order Routes - Customer */}
            <Route path="/checkout" element={
              <ProtectedRoute allowedRoles={['customer']}>
                <Checkout />
              </ProtectedRoute>
            } />
            <Route path="/order/success" element={
              <ProtectedRoute allowedRoles={['customer']}>
                <OrderSuccess />
              </ProtectedRoute>
            } />
            <Route path="/my-orders" element={
              <ProtectedRoute allowedRoles={['customer']}>
                <MyOrders />
              </ProtectedRoute>
            } />
            
            {/* Seller Orders - Brand */}
            <Route path="/seller/orders" element={
              <ProtectedRoute allowedRoles={['brand']}>
                <SellerOrders />
              </ProtectedRoute>
            } />
            
            {/* Fallback */}
            <Route path="*" element={<Navigate to="/" />} />
          </Routes>
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;

