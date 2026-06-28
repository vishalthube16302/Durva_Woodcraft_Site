import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import Website from './pages/Website';
import AdminLogin from './pages/AdminLogin';
import AdminDashboard from './pages/AdminDashboard';
import ProductDetails from './pages/ProductDetails';
import GalleryPage from './pages/GalleryPage';
import PolicyPage from './pages/PolicyPage';
import GovernmentSupplyPage from './pages/GovernmentSupplyPage';
import NotFound from './pages/NotFound';

const ADMIN_LOGIN = '/admin/login';
const ADMIN_DASHBOARD = '/admin/dashboard';

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route path="/" element={<Website />} />
          <Route path="/product_detail/:id" element={<ProductDetails />} />
          <Route path="/gallery" element={<GalleryPage />} />
          <Route path="/government-supply" element={<GovernmentSupplyPage />} />
          <Route path="/policy/:slug" element={<PolicyPage />} />
          {/* Admin routes */}
          <Route path={ADMIN_LOGIN} element={<AdminLogin />} />
          <Route path={ADMIN_DASHBOARD} element={<AdminDashboard />} />
          <Route path="/admin" element={<AdminLogin />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;
