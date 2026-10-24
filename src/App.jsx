import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import Navbar from './components/layout/Navbar'
import Footer from './components/layout/Footer'
import Home from './pages/Home'
import ProductDetails from './pages/ProductDetails'
import AdminLogin from './pages/admin/login'
import AdminDashboard from './pages/admin/Dashboard'
import ManageReservations from './pages/admin/manageReservations'
import ManageProducts from './pages/admin/ManageProducts'
import ManageCategories from './pages/admin/ManageCategories'

function App() {
  return (
    <Router>
      <Routes>
        {/* Public routes */}
        <Route path="/" element={
          <>
            <Navbar />
            <main style={{ flex: 1 }}>
              <Home />
            </main>
            <Footer />
          </>
        } />
        
        <Route path="/product/:slug" element={
          <>
            <Navbar />
            <main style={{ flex: 1 }}>
              <ProductDetails />
            </main>
            <Footer />
          </>
        } />

        {/* Admin routes */}
        <Route path="/admin/login" element={<AdminLogin />} />
        <Route path="/admin" element={<AdminDashboard />} />
        <Route path="/admin/reservations" element={<ManageReservations />} />
        <Route path="/admin/products" element={<ManageProducts />} />
        <Route path="/admin/categories" element={<ManageCategories />} />
      </Routes>
    </Router>
  )
}

export default App