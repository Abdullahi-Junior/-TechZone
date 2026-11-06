import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { getProducts, getCategories } from '../services/products'

export default function Home() {
  const [products, setProducts] = useState([])
  const [categories, setCategories] = useState([])
  const [loading, setLoading] = useState(true)

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
        console.error('Failed to load data:', err)
      } finally {
        setLoading(false)
      }
    }

    loadData()
  }, [])

  // Get 4 featured products (first 4 active ones)
  const featuredProducts = products.slice(0, 4)

  if (loading) {
    return <div style={{ padding: '4rem', textAlign: 'center' }}>Loading...</div>
  }

  return (
    <div>
      {/* ============ HERO SECTION ============ */}
      <section style={styles.hero}>
        <div style={styles.heroContent}>
          <h1 style={styles.heroTitle}>Welcome to TechZone Electronics</h1>
          <p style={styles.heroSubtitle}>
            Home of Quality Products • Trusted by Thousands of Nigerian Families
          </p>
          <p style={styles.heroDescription}>
            From premium TVs to energy-efficient refrigerators, powerful ACs to modern home theaters — 
            we bring you the best electronics at unbeatable prices with genuine warranty and reliable service.
          </p>
        </div>
      </section>

      {/* ============ CATEGORY SHOWCASE ============ */}
      <section style={styles.section}>
        <div style={styles.sectionHeader}>
          <h2 style={styles.sectionTitle}>Shop by Category</h2>
          <p style={styles.sectionSubtitle}>
            Find exactly what you need for your home
          </p>
        </div>

        <div style={styles.categoryGrid}>
          {categories.map(category => (
            <Link 
              to={`/products?category=${category.slug}`}
              key={category.id}
              style={styles.categoryCard}
            >
              <div style={styles.categoryIcon}>
                {getCategoryIcon(category.slug)}
              </div>
              <h3 style={styles.categoryName}>{category.name}</h3>
              <p style={styles.categoryCount}>
                {products.filter(p => p.categories?.slug === category.slug).length} products
              </p>
            </Link>
          ))}
        </div>
      </section>

      {/* ============ FEATURED PRODUCTS ============ */}
      <section style={{ ...styles.section, backgroundColor: '#f9fafb' }}>
        <div style={styles.sectionHeader}>
          <h2 style={styles.sectionTitle}>Featured Products</h2>
          <p style={styles.sectionSubtitle}>
            Our most popular items this week
          </p>
        </div>

        <div style={styles.productGrid}>
          {featuredProducts.map(product => (
            <Link 
              to={`/product/${product.slug}`} 
              key={product.id} 
              style={styles.productCard}
            >
              <img 
                src={product.image_url} 
                alt={product.name} 
                style={styles.productImage} 
              />
              <div style={styles.productCardBody}>
                <p style={styles.productCategory}>{product.categories?.name}</p>
                <h3 style={styles.productName}>{product.name}</h3>
                <p style={styles.productPrice}>₦{product.price.toLocaleString('en-NG')}</p>
                <p style={product.stock_quantity > 0 ? styles.inStock : styles.outOfStock}>
                  {product.stock_quantity > 0 ? `✓ In Stock (${product.stock_quantity})` : '✗ Out of Stock'}
                </p>
                <span style={styles.viewDetails}>View Details →</span>
              </div>
            </Link>
          ))}
        </div>

        <div style={{ textAlign: 'center', marginTop: '2rem' }}>
          <Link to="/products" style={styles.viewAllButton}>
            View All Products →
          </Link>
        </div>
      </section>
    </div>
  )
}

// Helper function for category icons
function getCategoryIcon(slug) {
  const icons = {
    'tvs': '📺',
    'refrigerators': '🧊',
    'air-conditioners': '❄️',
    'washing-machines': '🧺',
    'gas-cookers': '🔥',
    'home-theater': '🔊'
  }
  return icons[slug] || '📦'
}

const styles = {
  // Hero Section
  hero: {
    background: 'linear-gradient(135deg, #1e3a8a 0%, #2563eb 100%)',
    color: 'white',
    padding: '4rem 2rem', // Increased padding slightly since buttons are gone
    textAlign: 'center'
  },
  heroContent: {
    maxWidth: '800px',
    margin: '0 auto'
  },
  heroTitle: {
    fontSize: '3rem',
    marginBottom: '1rem',
    fontWeight: '800'
  },
  heroSubtitle: {
    fontSize: '1.25rem',
    marginBottom: '1.5rem',
    opacity: 0.95,
    fontWeight: '500'
  },
  heroDescription: {
    fontSize: '1.1rem',
    marginBottom: '0', // Removed bottom margin since buttons are gone
    lineHeight: '1.7',
    opacity: 0.9,
    maxWidth: '800px', // Fixed typo from '8c00px'
    marginLeft: 'auto',
    marginRight: 'auto'
  },

  // Section Styles
  section: {
    padding: '4rem 2rem',
    maxWidth: '1400px',
    margin: '0 auto'
  },
  sectionHeader: {
    textAlign: 'center',
    marginBottom: '3rem'
  },
  sectionTitle: {
    fontSize: '2.25rem',
    marginBottom: '0.75rem',
    color: '#1f2937'
  },
  sectionSubtitle: {
    fontSize: '1.1rem',
    color: '#6b7280'
  },

  // Category Grid
  categoryGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))',
    gap: '1.5rem'
  },
  categoryCard: {
    backgroundColor: 'white',
    padding: '2rem 1.5rem',
    borderRadius: '12px',
    textAlign: 'center',
    textDecoration: 'none',
    color: 'inherit',
    boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
    border: '1px solid #e5e7eb',
    transition: 'transform 0.2s, box-shadow 0.2s'
  },
  categoryIcon: {
    fontSize: '3rem',
    marginBottom: '1rem'
  },
  categoryName: {
    fontSize: '1.15rem',
    marginBottom: '0.5rem',
    color: '#1f2937'
  },
  categoryCount: {
    fontSize: '0.85rem',
    color: '#6b7280'
  },

  // Product Grid
  productGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))',
    gap: '1.5rem'
  },
  productCard: {
    backgroundColor: 'white',
    borderRadius: '12px',
    overflow: 'hidden',
    boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
    border: '1px solid #e5e7eb',
    textDecoration: 'none',
    color: 'inherit',
    transition: 'transform 0.2s, box-shadow 0.2s'
  },
  productImage: {
    width: '100%',
    height: '220px',
    objectFit: 'cover'
  },
  productCardBody: {
    padding: '1.25rem'
  },
  productCategory: {
    fontSize: '0.75rem',
    color: '#6b7280',
    textTransform: 'uppercase',
    marginBottom: '0.5rem',
    letterSpacing: '0.5px'
  },
  productName: {
    fontSize: '1.1rem',
    marginBottom: '0.75rem',
    color: '#1f2937',
    lineHeight: '1.4'
  },
  productPrice: {
    fontSize: '1.35rem',
    fontWeight: 'bold',
    color: '#2563eb',
    marginBottom: '0.5rem'
  },
  inStock: {
    color: '#16a34a',
    fontWeight: '600',
    fontSize: '0.9rem',
    marginBottom: '0.75rem'
  },
  outOfStock: {
    color: '#dc2626',
    fontWeight: '600',
    fontSize: '0.9rem',
    marginBottom: '0.75rem'
  },
  viewDetails: {
    display: 'inline-block',
    color: '#2563eb',
    fontWeight: '600',
    fontSize: '0.9rem'
  },
  viewAllButton: {
    display: 'inline-block',
    padding: '1rem 2.5rem',
    backgroundColor: '#2563eb',
    color: 'white',
    borderRadius: '8px',
    textDecoration: 'none',
    fontWeight: '600',
    fontSize: '1.05rem'
  }
}