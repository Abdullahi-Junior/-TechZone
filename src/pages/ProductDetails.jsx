import { useState, useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'
import { getProductBySlug } from '../services/products'
import ReservationForm from '../components/reservations/ReservationForm'

// ⚠️ CHANGE THIS to the shop's real WhatsApp number (with country code, no + or spaces)
// Example: 2348012345678 for Nigeria
const SHOP_WHATSAPP_NUMBER = '8801952689089'

export default function ProductDetails() {
  const { slug } = useParams()
  const [product, setProduct] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [showReservationForm, setShowReservationForm] = useState(false)

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

  // Build the WhatsApp message
  const whatsappMessage = encodeURIComponent(
    `Hello TechZone! 👋\n\nI'm interested in this product:\n\n` +
    `📦 *${product.name}*\n` +
    `💰 Price: ₦${product.price.toLocaleString('en-NG')}\n` +
    `📂 Category: ${product.categories?.name || 'N/A'}\n\n` +
    `Is it still available?`
  )
  const whatsappLink = `https://wa.me/${SHOP_WHATSAPP_NUMBER}?text=${whatsappMessage}`

  return (
    <div style={styles.container}>
      <Link to="/" style={styles.backLink}>← Back to Products</Link>
      
      <div style={styles.grid}>
        {/* LEFT: Product Image */}
        <div style={styles.imageContainer}>
          <img src={product.image_url} alt={product.name} style={styles.image} />
        </div>
        
        {/* RIGHT: Product Info */}
        <div style={styles.info}>
          <h1 style={styles.title}>{product.name}</h1>
          <p style={styles.category}>Category: {product.categories?.name}</p>
          <p style={styles.price}>₦{product.price.toLocaleString('en-NG')}</p>
          
          <p style={product.stock_quantity > 0 ? styles.inStock : styles.outOfStock}>
            {product.stock_quantity > 0 
              ? `✓ In Stock (${product.stock_quantity} available)` 
              : '✗ Out of Stock'}
          </p>
          
          <div style={styles.description}>
            <h3>Description</h3>
            <p>{product.description}</p>
          </div>

          {/* ACTION BUTTONS - Only show if in stock */}
          {product.stock_quantity > 0 && (
            <div style={styles.actionsSection}>
              <h3 style={styles.actionsTitle}>Interested? Choose how to reach us:</h3>
              
              {/* Primary: Reservation Form Toggle */}
              <button 
                onClick={() => setShowReservationForm(!showReservationForm)}
                style={styles.reserveButton}
              >
                {showReservationForm ? '✕ Hide Reservation Form' : '📋 Reserve This Product'}
              </button>

              {/* Secondary: WhatsApp Quick Inquiry */}
              <a 
                href={whatsappLink}
                target="_blank"
                rel="noopener noreferrer"
                style={styles.whatsappButton}
              >
                💬 Quick Inquiry via WhatsApp
              </a>

              <p style={styles.helperText}>
                💡 <strong>Reservation:</strong> Fill the form and we'll contact you to confirm.<br/>
                💡 <strong>WhatsApp:</strong> Chat instantly with our team for quick questions.
              </p>
            </div>
          )}

          {/* Reservation Form - Only shows when toggled */}
          {showReservationForm && (
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
  description: { 
    marginTop: '1.5rem', 
    padding: '1rem', 
    backgroundColor: '#f9f9f9', 
    borderRadius: '8px',
    lineHeight: '1.6'
  },
  actionsSection: {
    marginTop: '2rem',
    padding: '1.5rem',
    backgroundColor: '#f0f9ff',
    borderRadius: '8px',
    border: '1px solid #bae6fd'
  },
  actionsTitle: {
    fontSize: '1.1rem',
    marginBottom: '1rem',
    color: '#0c4a6e'
  },
  reserveButton: {
    width: '100%',
    padding: '1rem',
    backgroundColor: '#2563eb',
    color: 'white',
    border: 'none',
    borderRadius: '8px',
    fontSize: '1.1rem',
    fontWeight: '600',
    cursor: 'pointer',
    marginBottom: '0.75rem'
  },
  whatsappButton: {
    display: 'block',
    width: '100%',
    padding: '1rem',
    backgroundColor: '#25D366',
    color: 'white',
    textDecoration: 'none',
    borderRadius: '8px',
    fontSize: '1.1rem',
    fontWeight: '600',
    textAlign: 'center',
    boxShadow: '0 2px 5px rgba(37, 211, 102, 0.3)'
  },
  helperText: {
    marginTop: '1rem',
    fontSize: '0.85rem',
    color: '#475569',
    lineHeight: '1.6'
  }
}