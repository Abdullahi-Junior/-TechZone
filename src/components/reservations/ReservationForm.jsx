 import { useState } from 'react'
import { createReservation } from '../../services/reservations'

export default function ReservationForm({ product }) {
  const [formData, setFormData] = useState({
    customer_name: '',
    phone: '',
    quantity: 1,
    message: ''
  })
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)
  const [error, setError] = useState(null)

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: name === 'quantity' ? parseInt(value) || 1 : value
    }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError(null)
    setSuccess(false)

    if (!formData.customer_name.trim()) {
      setError('Please enter your name')
      setLoading(false)
      return
    }

    if (!formData.phone.trim() || formData.phone.length < 10) {
      setError('Please enter a valid phone number')
      setLoading(false)
      return
    }

    if (formData.quantity < 1 || formData.quantity > 10) {
      setError('Quantity must be between 1 and 10')
      setLoading(false)
      return
    }

    try {
      const reservationData = {
        product_id: product.id,
        customer_name: formData.customer_name.trim(),
        phone: formData.phone.trim(),
        quantity: formData.quantity,
        message: formData.message.trim() || null
      }

      const result = await createReservation(reservationData)
      
      setSuccess(true)
      setFormData({
        customer_name: '',
        phone: '',
        quantity: 1,
        message: ''
      })
      
      console.log('Reservation created:', result)
    } catch (err) {
      setError('Failed to submit reservation. Please try again.')
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  if (success) {
    return (
      <div style={styles.successBox}>
        <h3 style={styles.successTitle}>✓ Reservation Request Submitted!</h3>
        <p style={styles.successText}>
          Thank you for your interest. The shop will review your request and contact you shortly.
        </p>
        <button 
          style={styles.newRequestButton}
          onClick={() => setSuccess(false)}
        >
          Submit Another Request
        </button>
      </div>
    )
  }

  return (
    <div style={styles.formContainer}>
      <h2 style={styles.formTitle}>Reserve This Product</h2>
      
      {error && <div style={styles.errorBox}>{error}</div>}
      
      <form onSubmit={handleSubmit} style={styles.form}>
        <div style={styles.field}>
          <label style={styles.label}>Your Name *</label>
          <input
            type="text"
            name="customer_name"
            value={formData.customer_name}
            onChange={handleChange}
            style={styles.input}
            placeholder="Enter your full name"
            required
          />
        </div>

        <div style={styles.field}>
          <label style={styles.label}>Phone Number *</label>
          <input
            type="tel"
            name="phone"
            value={formData.phone}
            onChange={handleChange}
            style={styles.input}
            placeholder="e.g., +1234567890"
            required
          />
        </div>

        <div style={styles.field}>
          <label style={styles.label}>Quantity *</label>
          <input
            type="number"
            name="quantity"
            value={formData.quantity}
            onChange={handleChange}
            style={styles.input}
            min="1"
            max={Math.min(10, product.stock_quantity)}
            required
          />
          <p style={styles.hint}>
            Available: {product.stock_quantity} | Max per order: 10
          </p>
        </div>

        <div style={styles.field}>
          <label style={styles.label}>Message (Optional)</label>
          <textarea
            name="message"
            value={formData.message}
            onChange={handleChange}
            style={styles.textarea}
            placeholder="Any questions or special requests?"
            rows="4"
          />
        </div>

        <button 
          type="submit" 
          style={styles.submitButton}
          disabled={loading}
        >
          {loading ? 'Submitting...' : 'Submit Reservation Request'}
        </button>

        <p style={styles.disclaimer}>
          This is a reservation request, not a confirmed booking. The shop will contact you to confirm availability.
        </p>
      </form>
    </div>
  )
}

const styles = {
  formContainer: {
    marginTop: '2rem',
    padding: '2rem',
    backgroundColor: '#f9f9f9',
    borderRadius: '8px',
    border: '1px solid #ddd'
  },
  formTitle: {
    marginBottom: '1.5rem',
    fontSize: '1.5rem',
    color: '#333'
  },
  form: {
    display: 'flex',
    flexDirection: 'column',
    gap: '1.5rem'
  },
  field: {
    display: 'flex',
    flexDirection: 'column',
    gap: '0.5rem'
  },
  label: {
    fontWeight: '600',
    color: '#333',
    fontSize: '0.95rem'
  },
  input: {
    padding: '0.75rem',
    border: '1px solid #ccc',
    borderRadius: '4px',
    fontSize: '1rem',
    fontFamily: 'inherit'
  },
  textarea: {
    padding: '0.75rem',
    border: '1px solid #ccc',
    borderRadius: '4px',
    fontSize: '1rem',
    fontFamily: 'inherit',
    resize: 'vertical'
  },
  hint: {
    fontSize: '0.85rem',
    color: '#666',
    marginTop: '0.25rem'
  },
  submitButton: {
    padding: '1rem',
    backgroundColor: '#2563eb',
    color: 'white',
    border: 'none',
    borderRadius: '4px',
    fontSize: '1.1rem',
    fontWeight: '600',
    cursor: 'pointer',
    marginTop: '0.5rem'
  },
  disclaimer: {
    fontSize: '0.85rem',
    color: '#666',
    fontStyle: 'italic',
    textAlign: 'center',
    marginTop: '0.5rem'
  },
  errorBox: {
    padding: '1rem',
    backgroundColor: '#fee',
    border: '1px solid #fcc',
    borderRadius: '4px',
    color: '#c33',
    marginBottom: '1rem'
  },
  successBox: {
    marginTop: '2rem',
    padding: '2rem',
    backgroundColor: '#efe',
    border: '1px solid #cfc',
    borderRadius: '8px',
    textAlign: 'center'
  },
  successTitle: {
    color: '#2a2',
    marginBottom: '1rem'
  },
  successText: {
    color: '#333',
    marginBottom: '1.5rem',
    lineHeight: '1.6'
  },
  newRequestButton: {
    padding: '0.75rem 1.5rem',
    backgroundColor: '#2563eb',
    color: 'white',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer',
    fontSize: '1rem'
  }
}