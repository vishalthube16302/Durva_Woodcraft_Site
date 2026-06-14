import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import Website from './pages/Website';
import AdminLogin from './pages/AdminLogin';
import AdminDashboard from './pages/AdminDashboard';
import ProductDetails from './pages/ProductDetails';
import NotFound from './pages/NotFound';

// Admin is accessible only via secret URL: /manage-durva-xk92
// Never linked from the public site — security through obscurity + auth guard
const ADMIN_PATH = '/manage-durva-xk92';

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route path="/" element={<Website />} />
          <Route path="/product_detail/:id" element={<ProductDetails />} />
          {/* Admin — secret URL, not linked from public site */}
          <Route path={ADMIN_PATH} element={<AdminLogin />} />
          <Route path={`${ADMIN_PATH}/dashboard`} element={<AdminDashboard />} />
          {/* Catch old /admin URL — redirect to 404 so it can't be discovered */}
          <Route path="/admin" element={<NotFound />} />
          <Route path="/admin/dashboard" element={<NotFound />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;
