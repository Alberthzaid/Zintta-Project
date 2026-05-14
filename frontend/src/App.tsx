import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { Toaster } from 'react-hot-toast'
import HomePage from './pages/HomePage'
import ProductDetailPage from './pages/ProductDetailPage'
import { AuthProvider } from './context/AuthContext'
import ProtectedRoute from './components/admin/ProtectedRoute'
import AdminLayout from './components/admin/AdminLayout'
import AdminLogin from './pages/admin/AdminLogin'
import AdminHome from './pages/admin/AdminHome'
import CategoriesPage from './pages/admin/CategoriesPage'
import SizesPage from './pages/admin/SizesPage'
import ProductsPage from './pages/admin/ProductsPage'
import VariantsPage from './pages/admin/VariantsPage'
import HistoryPage from './pages/admin/HistoryPage'

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Toaster
          position="top-right"
          toastOptions={{
            style: {
              background: '#181014',
              color: '#fff',
              border: '1px solid #3a2730',
            },
            success: { iconTheme: { primary: '#ff1a88', secondary: '#fff' } },
            error: { iconTheme: { primary: '#ef4444', secondary: '#fff' } },
          }}
        />
        <Routes>
          {/* Public */}
          <Route path="/" element={<HomePage />} />
          <Route path="/product/:id" element={<ProductDetailPage />} />

          {/* Admin */}
          <Route path="/dashboard-admin/login" element={<AdminLogin />} />
          <Route
            path="/dashboard-admin"
            element={
              <ProtectedRoute>
                <AdminLayout />
              </ProtectedRoute>
            }
          >
            <Route index element={<AdminHome />} />
            <Route path="categorias" element={<CategoriesPage />} />
            <Route path="tallas" element={<SizesPage />} />
            <Route path="productos" element={<ProductsPage />} />
            <Route path="productos/:productId/variantes" element={<VariantsPage />} />
            <Route path="historial" element={<HistoryPage />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  )
}
