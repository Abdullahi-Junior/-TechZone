import { useState, useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'
import { getProductBySlug } from '../services/products'
import ReservationForm from '../components/reservations/ReservationForm'

export default function ProductDetails() {
  const { slug } = useParams()
  const [product, setProduct] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    async function loadProduct() {
      try {
        const data = await getProductBySlug(slug)
        setProduct(data)
      } catch (err) {
        setError('Product not found')
        console.error(err)
      } finally {
        setLoading(false)
      }
    }

    loadProduct()
  }, [slug])

  if (loading) {
    return <div style={{ textAlign: 'center', padding: '2rem' }}>Loading...</div>
  }

  if (error || !product) {
    return (
      <div style={{ textAlign: 'center', padding: '2rem' }}>
        <h2>Product Not Found</h2>
        <Link to="/" style={{ color: '#2563eb' }}>← Back to Home</Link>
      </div>
    )
  }

  return (
    <div style={styles.container}>
      <Link to="/" style={styles.backLink}>← Back to Products</Link>
      
      <div style={styles.grid}>
        <div style={styles.imageContainer}>
          <img src={product.image_url} alt={product.name} style={styles.image} />
        </div>
        
        <div style={styles.info}>
          <h1 style={styles.title}>{product.name}</h1>
          <p style={styles.category}>Category: {product.categories?.name}</p>
          
          {/* CORRECT NAIRA FORMAT HERE */}
          <p style={styles.price}>₦{product.price.toLocaleString('en-NG')}</p>
          
          {/* CORRECT STOCK FORMAT HERE */}
          <p style={product.stock_quantity > 0 ? styles.inStock : styles.outOfStock}>
            {product.stock_quantity > 0 
              ? `✓ In Stock (${product.stock_quantity} available)` 
              : '✗ Out of Stock'}
          </p>
          
          <div style={styles.description}>
            <h3>Description</h3>
            <p>{product.description}</p>
          </div>

          {product.stock_quantity > 0 && (
            <ReservationForm product={product} />
          )}
        </div>
      </div>
    </div>
  )
}

const styles = {
  container: { padding: '2rem', maxWidth: '1200px', margin: '0 auto' },
  backLink: { display: 'inline-block', marginBottom: '2rem', color: '#2563eb', textDecoration: 'none' },
  grid: { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '3rem' },
  imageContainer: { borderRadius: '8px', overflow: 'hidden' },
  image: { width: '100%', height: 'auto', display: 'block' },
  info: { display: 'flex', flexDirection: 'column', gap: '1rem' },
  title: { fontSize: '2rem', marginBottom: '0.5rem' },
  category: { color: '#666', fontSize: '0.9rem' },
  price: { fontSize: '2rem', fontWeight: 'bold', color: '#2563eb' },
  inStock: { color: 'green', fontWeight: 'bold', fontSize: '1.1rem' },
  outOfStock: { color: 'red', fontWeight: 'bold', fontSize: '1.1rem' },
  description: { marginTop: '1.5rem', padding: '1rem', backgroundColor: '#f9f9f9', borderRadius: '8px' }
}