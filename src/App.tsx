import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import Website from './pages/Website';
import AdminLogin from './pages/AdminLogin';
import AdminDashboard from './pages/AdminDashboard';
import ProductDetails from './pages/ProductDetails';
import GalleryPage from './pages/GalleryPage';
import PolicyPage from './pages/PolicyPage';
import NotFound from './pages/NotFound';

// Admin is accessible only via secret URL: /manage-durva-xk92
const ADMIN_PATH = '/manage-durva-xk92';

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route path="/" element={<Website />} />
          <Route path="/product_detail/:id" element={<ProductDetails />} />
          <Route path="/gallery" element={<GalleryPage />} />
          <Route path="/policy/:slug" element={<PolicyPage />} />
          {/* Admin — secret URL */}
          <Route path={ADMIN_PATH} element={<AdminLogin />} />
          <Route path={`${ADMIN_PATH}/dashboard`} element={<AdminDashboard />} />
          <Route path="/admin" element={<NotFound />} />
          <Route path="/admin/dashboard" element={<NotFound />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;
