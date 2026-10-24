import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { getAllReservations, updateReservationStatus } from '../../services/adminReservations'

export default function ManageReservations() {
  const [reservations, setReservations] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [filter, setFilter] = useState('all')

  useEffect(() => {
    loadReservations()
  }, [])

  async function loadReservations() {
    try {
      const data = await getAllReservations()
      setReservations(data)
    } catch (err) {
      setError('Failed to load reservations')
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  async function handleStatusChange(id, newStatus) {
    try {
      await updateReservationStatus(id, newStatus)
      setReservations(prev =>
        prev.map(r => r.id === id ? { ...r, status: newStatus } : r)
      )
    } catch (err) {
      alert('Failed to update status')
      console.error(err)
    }
  }

  const filteredReservations = filter === 'all'
    ? reservations
    : reservations.filter(r => r.status === filter)

  if (loading) {
    return <div style={{ padding: '2rem', textAlign: 'center' }}>Loading reservations...</div>
  }

  if (error) {
    return <div style={{ padding: '2rem', textAlign: 'center', color: 'red' }}>{error}</div>
  }

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <h1 style={styles.title}>Reservation Requests</h1>
        <Link to="/admin" style={styles.backLink}>← Back to Dashboard</Link>
      </div>

      <div style={styles.filters}>
        {['all', 'pending', 'approved', 'rejected', 'completed'].map(status => (
          <button
            key={status}
            onClick={() => setFilter(status)}
            style={{
              ...styles.filterButton,
              ...(filter === status ? styles.filterButtonActive : {})
            }}
          >
            {status.charAt(0).toUpperCase() + status.slice(1)}
            {status !== 'all' && (
              <span style={styles.badge}>
                {reservations.filter(r => r.status === status).length}
              </span>
            )}
          </button>
        ))}
      </div>

      {filteredReservations.length === 0 ? (
        <div style={styles.empty}>No reservations found</div>
      ) : (
        <div style={styles.list}>
          {filteredReservations.map(reservation => (
            <div key={reservation.id} style={styles.card}>
              <div style={styles.cardHeader}>
                <div>
                  <h3 style={styles.customerName}>{reservation.customer_name}</h3>
                  <p style={styles.phone}>📞 {reservation.phone}</p>
                </div>
                <span style={{
                  ...styles.statusBadge,
                  backgroundColor: getStatusColor(reservation.status)
                }}>
                  {reservation.status}
                </span>
              </div>

              <div style={styles.productInfo}>
                <img
                  src={reservation.products?.image_url}
                  alt={reservation.products?.name}
                  style={styles.productImage}
                />
                <div>
                  <p style={styles.productName}>{reservation.products?.name}</p>
                  <p style={styles.productPrice}>
                    ₦{reservation.products?.price?.toLocaleString('en-NG')}
                  </p>
                  <p style={styles.quantity}>Quantity: {reservation.quantity}</p>
                </div>
              </div>

              {reservation.message && (
                <div style={styles.message}>
                  <strong>Message:</strong> {reservation.message}
                </div>
              )}

              <div style={styles.date}>
                Submitted: {new Date(reservation.created_at).toLocaleString()}
              </div>

              <div style={styles.actions}>
                {reservation.status === 'pending' && (
                  <>
                    <button
                      onClick={() => handleStatusChange(reservation.id, 'approved')}
                      style={styles.approveButton}
                    >
                      ✓ Approve
                    </button>
                    <button
                      onClick={() => handleStatusChange(reservation.id, 'rejected')}
                      style={styles.rejectButton}
                    >
                      ✗ Reject
                    </button>
                  </>
                )}
                {reservation.status === 'approved' && (
                  <button
                    onClick={() => handleStatusChange(reservation.id, 'completed')}
                    style={styles.completeButton}
                  >
                    Mark as Completed
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

function getStatusColor(status) {
  const colors = {
    pending: '#f59e0b',
    approved: '#10b981',
    rejected: '#ef4444',
    completed: '#6b7280'
  }
  return colors[status] || '#6b7280'
}

const styles = {
  container: { padding: '2rem', maxWidth: '1200px', margin: '0 auto' },
  header: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' },
  title: { fontSize: '2rem', color: '#333' },
  backLink: { color: '#2563eb', textDecoration: 'none' },
  filters: { display: 'flex', gap: '0.5rem', marginBottom: '2rem', flexWrap: 'wrap' },
  filterButton: {
    padding: '0.5rem 1rem',
    backgroundColor: '#f3f4f6',
    border: '1px solid #ddd',
    borderRadius: '4px',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    gap: '0.5rem'
  },
  filterButtonActive: {
    backgroundColor: '#2563eb',
    color: 'white',
    borderColor: '#2563eb'
  },
  badge: {
    backgroundColor: 'rgba(255,255,255,0.3)',
    padding: '0.1rem 0.5rem',
    borderRadius: '10px',
    fontSize: '0.85rem'
  },
  empty: { textAlign: 'center', padding: '3rem', color: '#666' },
  list: { display: 'flex', flexDirection: 'column', gap: '1rem' },
  card: {
    backgroundColor: 'white',
    padding: '1.5rem',
    borderRadius: '8px',
    boxShadow: '0 2px 5px rgba(0,0,0,0.1)',
    border: '1px solid #e5e7eb'
  },
  cardHeader: { display: 'flex', justifyContent: 'space-between', alignItems: 'start', marginBottom: '1rem' },
  customerName: { fontSize: '1.25rem', marginBottom: '0.25rem' },
  phone: { color: '#666', fontSize: '0.9rem' },
  statusBadge: {
    padding: '0.25rem 0.75rem',
    borderRadius: '12px',
    color: 'white',
    fontSize: '0.85rem',
    fontWeight: '600',
    textTransform: 'uppercase'
  },
  productInfo: { display: 'flex', gap: '1rem', marginBottom: '1rem', padding: '1rem', backgroundColor: '#f9fafb', borderRadius: '8px' },
  productImage: { width: '80px', height: '80px', objectFit: 'cover', borderRadius: '4px' },
  productName: { fontWeight: '600', marginBottom: '0.25rem' },
  productPrice: { color: '#2563eb', fontWeight: 'bold', marginBottom: '0.25rem' },
  quantity: { color: '#666', fontSize: '0.9rem' },
  message: { padding: '1rem', backgroundColor: '#fef3c7', borderRadius: '4px', marginBottom: '1rem', fontSize: '0.9rem' },
  date: { color: '#666', fontSize: '0.85rem', marginBottom: '1rem' },
  actions: { display: 'flex', gap: '0.5rem' },
  approveButton: {
    padding: '0.5rem 1rem',
    backgroundColor: '#10b981',
    color: 'white',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer',
    fontWeight: '600'
  },
  rejectButton: {
    padding: '0.5rem 1rem',
    backgroundColor: '#ef4444',
    color: 'white',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer',
    fontWeight: '600'
  },
  completeButton: {
    padding: '0.5rem 1rem',
    backgroundColor: '#6b7280',
    color: 'white',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer',
    fontWeight: '600'
  }
}