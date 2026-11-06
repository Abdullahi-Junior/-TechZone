import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import Navbar from './components/layout/Navbar'
import Footer from './components/layout/Footer'
import Home from './pages/Home'
import Products from './pages/Products'
import ProductDetails from './pages/ProductDetails'
import Contact from './pages/Contact' // <-- ADD THIS
import AdminLogin from './pages/admin/Login'
import AdminDashboard from './pages/admin/Dashboard'
import ManageReservations from './pages/admin/ManageReservations'
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
        
        <Route path="/products" element={
          <>
            <Navbar />
            <main style={{ flex: 1 }}>
              <Products />
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

        <Route path="/contact" element={ // <-- ADD THIS ROUTE
          <>
            <Navbar />
            <main style={{ flex: 1 }}>
              <Contact />
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