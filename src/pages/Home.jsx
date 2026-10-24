 import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { getProducts } from '../services/products'

export default function Home() {
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    async function loadProducts() {
      try {
        const data = await getProducts()
        setProducts(data)
      } catch (err) {
        setError('Failed to load products. Please try again.')
        console.error(err)
      } finally {
        setLoading(false)
      }
    }

    loadProducts()
  }, [])

  if (loading) {
    return <div style={{ textAlign: 'center', padding: '2rem' }}>Loading products...</div>
  }

  if (error) {
    return <div style={{ textAlign: 'center', padding: '2rem', color: 'red' }}>{error}</div>
  }

  return (
    <div style={{ padding: '2rem' }}>
      <h1 style={{ textAlign: 'center', marginBottom: '2rem' }}>Welcome to TechZone Electronics</h1>
      
      <h2 style={{ marginBottom: '1rem' }}>Featured Products</h2>
      <div style={styles.grid}>
        {products.map((product) => (
          <div key={product.id} style={styles.card}>
            <img src={product.image_url} alt={product.name} style={styles.image} />
            <div style={styles.cardBody}>
              <h3>{product.name}</h3>
              
              {/* CORRECT NAIRA FORMAT HERE */}
              <p style={styles.price}>₦{product.price.toLocaleString('en-NG')}</p>
              
              <p style={product.stock_quantity > 0 ? styles.inStock : styles.outOfStock}>
                {product.stock_quantity > 0 ? `In Stock (${product.stock_quantity})` : 'Out of Stock'}
              </p>
              
              <Link to={`/product/${product.slug}`} style={styles.button}>
  View Details
</Link>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

const styles = {
  grid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))', gap: '2rem' },
  card: { border: '1px solid #ddd', borderRadius: '8px', overflow: 'hidden', boxShadow: '0 2px 5px rgba(0,0,0,0.1)' },
  image: { width: '100%', height: '200px', objectFit: 'cover' },
  cardBody: { padding: '1rem' },
  price: { fontSize: '1.25rem', fontWeight: 'bold', color: '#2563eb' },
  inStock: { color: 'green', fontWeight: 'bold' },
  outOfStock: { color: 'red', fontWeight: 'bold' },
  button: { 
    display: 'block',
    width: '100%', 
    padding: '0.75rem', 
    backgroundColor: '#2563eb', 
    color: 'white', 
    border: 'none', 
    borderRadius: '4px', 
    cursor: 'pointer', 
    marginTop: '1rem',
    textAlign: 'center',
    textDecoration: 'none'
  }
}