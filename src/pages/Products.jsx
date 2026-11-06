import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { getProducts, getCategories } from '../services/products'

export default function Products() {
  const [products, setProducts] = useState([])
  const [categories, setCategories] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [drawerOpen, setDrawerOpen] = useState(false)
  
  // New states for Search and Category filtering
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('all')

  useEffect(() => {
    async function loadData() {
      try {
        const [productsData, categoriesData] = await Promise.all([
          getProducts(),
          getCategories()
        ])
        setProducts(productsData)
        setCategories(categoriesData)
      } catch (err) {
        setError('Failed to load products')
        console.error(err)
      } finally {
        setLoading(false)
      }
    }
    loadData()
  }, [])

  // Filter by BOTH category AND search query
  const filteredProducts = products.filter(product => {
    const matchesCategory = selectedCategory === 'all' || product.categories?.slug === selectedCategory
    const matchesSearch = product.name.toLowerCase().includes(searchQuery.toLowerCase())
    return matchesCategory && matchesSearch
  })

  function getCategoryIcon(slug) {
    const icons = {
      'tvs': '📺', 'refrigerators': '🧊', 'air-conditioners': '❄️',
      'washing-machines': '🧺', 'gas-cookers': '🔥', 'home-theater': '🔊'
    }
    return icons[slug] || '📦'
  }

  if (loading) return <div style={{ padding: '4rem', textAlign: 'center' }}>Loading products...</div>
  if (error) return <div style={{ padding: '4rem', textAlign: 'center', color: 'red' }}>{error}</div>

  return (
    <div style={styles.container}>
      {/* ============ MOBILE-FRIENDLY FILTER BAR ============ */}
      <div style={styles.filterBar}>
        {/* Search Input */}
        <input
          type="text"
          placeholder="🔍 Search products ..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          style={styles.searchInput}
        />

        {/* Category Dropdown (Native mobile picker) */}
        <select
          value={selectedCategory}
          onChange={(e) => setSelectedCategory(e.target.value)}
          style={styles.categorySelect}
        >
          <option value="all">All Categories</option>
          {categories.map(cat => (
            <option key={cat.id} value={cat.slug}>{cat.name}</option>
          ))}
        </select>

        {/* Drawer Toggle (Optional, for browsing) */}
        <button onClick={() => setDrawerOpen(true)} style={styles.drawerButton}>
          ☰
        </button>
      </div>

      <p style={styles.resultCount}>
        Showing {filteredProducts.length} product{filteredProducts.length !== 1 ? 's' : ''}
      </p>

      {/* ============ DRAWER SIDEBAR (Unchanged) ============ */}
      {drawerOpen && <div style={styles.overlay} onClick={() => setDrawerOpen(false)} />}
      <div style={{ ...styles.drawer, transform: drawerOpen ? 'translateX(0)' : 'translateX(-100%)' }}>
        <div style={styles.drawerHeader}>
          <h3 style={styles.drawerTitle}>Browse Categories</h3>
          <button onClick={() => setDrawerOpen(false)} style={styles.closeButton}>✕</button>
        </div>
        <div style={styles.drawerContent}>
          <button onClick={() => { setSelectedCategory('all'); setDrawerOpen(false); }} style={styles.categoryItem}>
            🛍️ All Products
          </button>
          {categories.map(category => (
            <button
              key={category.id}
              onClick={() => { setSelectedCategory(category.slug); setDrawerOpen(false); }}
              style={{ ...styles.categoryItem, ...(selectedCategory === category.slug ? styles.categoryItemActive : {}) }}
            >
              {getCategoryIcon(category.slug)} {category.name}
            </button>
          ))}
        </div>
      </div>

      {/* ============ PRODUCTS GRID ============ */}
      {filteredProducts.length === 0 ? (
        <div style={styles.empty}>
          <h3>No products found</h3>
          <p>Try adjusting your search or category filter</p>
        </div>
      ) : (
        <div style={styles.grid}>
          {filteredProducts.map(product => (
            <Link to={`/product/${product.slug}`} key={product.id} style={styles.card}>
              <img src={product.image_url} alt={product.name} style={styles.image} />
              <div style={styles.cardBody}>
                <p style={styles.categoryTag}>{product.categories?.name}</p>
                <h3 style={styles.productName}>{product.name}</h3>
                <p style={styles.price}>₦{product.price.toLocaleString('en-NG')}</p>
                <p style={product.stock_quantity > 0 ? styles.inStock : styles.outOfStock}>
                  {product.stock_quantity > 0 ? `✓ In Stock (${product.stock_quantity})` : '✗ Out of Stock'}
                </p>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  )
}

const styles = {
  container: { padding: '1.5rem', maxWidth: '1400px', margin: '0 auto' },
  
  // New Filter Bar Styles
  filterBar: {
    display: 'flex',
    gap: '0.75rem',
    marginBottom: '1.5rem',
    flexWrap: 'wrap'
  },
  searchInput: {
    flex: '2',
    minWidth: '200px',
    padding: '0.85rem 1rem',
    border: '1px solid #d1d5db',
    borderRadius: '8px',
    fontSize: '1rem',
    outline: 'none'
  },
  categorySelect: {
    flex: '1',
    minWidth: '150px',
    padding: '0.85rem',
    border: '1px solid #d1d5db',
    borderRadius: '8px',
    fontSize: '1rem',
    backgroundColor: 'white',
    cursor: 'pointer'
  },
  drawerButton: {
    padding: '0.85rem 1.2rem',
    backgroundColor: '#1f2937',
    color: 'white',
    border: 'none',
    borderRadius: '8px',
    fontSize: '1.2rem',
    cursor: 'pointer'
  },
  resultCount: {
    color: '#6b7280',
    fontSize: '0.9rem',
    marginBottom: '1.5rem'
  },

  // Drawer Styles
  overlay: { position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0,0,0,0.5)', zIndex: 998 },
  drawer: {
    position: 'fixed', top: 0, left: 0, width: '280px', maxWidth: '80vw', height: '100vh',
    backgroundColor: 'white', boxShadow: '2px 0 10px rgba(0,0,0,0.1)', zIndex: 999,
    transition: 'transform 0.3s ease', display: 'flex', flexDirection: 'column'
  },
  drawerHeader: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '1.5rem', borderBottom: '1px solid #e5e7eb', backgroundColor: '#1f2937', color: 'white' },
  drawerTitle: { margin: 0, fontSize: '1.1rem' },
  closeButton: { background: 'none', border: 'none', color: 'white', fontSize: '1.5rem', cursor: 'pointer' },
  drawerContent: { flex: 1, overflowY: 'auto', padding: '1rem' },
  categoryItem: { display: 'block', width: '100%', padding: '1rem', backgroundColor: 'transparent', border: 'none', borderBottom: '1px solid #f3f4f6', textAlign: 'left', fontSize: '1rem', cursor: 'pointer', borderRadius: '6px', marginBottom: '0.25rem' },
  categoryItemActive: { backgroundColor: '#dbeafe', color: '#1e40af', fontWeight: '600' },

  // Grid & Card Styles
  grid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))', gap: '1.5rem' },
  card: { border: '1px solid #e5e7eb', borderRadius: '12px', overflow: 'hidden', backgroundColor: 'white', boxShadow: '0 2px 5px rgba(0,0,0,0.05)', textDecoration: 'none', color: 'inherit', transition: 'transform 0.2s' },
  image: { width: '100%', height: '220px', objectFit: 'cover' },
  cardBody: { padding: '1.25rem' },
  categoryTag: { fontSize: '0.75rem', color: '#6b7280', textTransform: 'uppercase', marginBottom: '0.5rem', letterSpacing: '0.5px' },
  productName: { fontSize: '1.1rem', marginBottom: '0.5rem', color: '#1f2937', lineHeight: '1.4' },
  price: { fontSize: '1.25rem', fontWeight: 'bold', color: '#2563eb', marginBottom: '0.5rem' },
  inStock: { color: '#16a34a', fontWeight: '600', fontSize: '0.9rem' },
  outOfStock: { color: '#dc2626', fontWeight: '600', fontSize: '0.9rem' },
  empty: { textAlign: 'center', padding: '4rem 2rem', color: '#6b7280' }
}