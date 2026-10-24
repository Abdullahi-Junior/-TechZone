import { useState, useEffect } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { getCurrentUser, isAdmin, signOut } from '../../services/auth'

export default function AdminDashboard() {
  const [user, setUser] = useState(null)
  const [isAdminUser, setIsAdminUser] = useState(false)
  const [loading, setLoading] = useState(true)
  const navigate = useNavigate()

  useEffect(() => {
    async function checkAuth() {
      try {
        const currentUser = await getCurrentUser()
        
        if (!currentUser) {
          navigate('/admin/login')
          return
        }

        const adminStatus = await isAdmin(currentUser.id)
        
        if (!adminStatus) {
          alert('You do not have admin access')
          navigate('/admin/login')
          return
        }

        setUser(currentUser)
        setIsAdminUser(true)
      } catch (err) {
        console.error('Auth check failed:', err)
        navigate('/admin/login')
      } finally {
        setLoading(false)
      }
    }

    checkAuth()
  }, [navigate])

  const handleSignOut = async () => {
    await signOut()
    navigate('/admin/login')
  }

  if (loading) {
    return <div style={{ padding: '2rem', textAlign: 'center' }}>Loading...</div>
  }

  if (!isAdminUser) {
    return null
  }

  return (
    <div style={styles.container}>
      <header style={styles.header}>
        <h1 style={styles.headerTitle}>Admin Dashboard</h1>
        <div style={styles.headerRight}>
          <span style={styles.userEmail}>{user?.email}</span>
          <button onClick={handleSignOut} style={styles.signOutButton}>
            Sign Out
          </button>
        </div>
      </header>

      <div style={styles.content}>
        <h2 style={styles.sectionTitle}>Management</h2>
        <div style={styles.cardGrid}>
          <Link to="/admin/reservations" style={styles.card}>
            <h3 style={styles.cardTitle}>📋 Reservations</h3>
            <p style={styles.cardDescription}>
              Review and manage customer reservation requests
            </p>
          </Link>

          <Link to="/admin/products" style={styles.card}>
            <h3 style={styles.cardTitle}>📦 Products</h3>
            <p style={styles.cardDescription}>
              Add, edit, and manage your product catalog
            </p>
          </Link>
          // Find the cardGrid section and add this card:
<Link to="/admin/categories" style={styles.card}>
  <h3 style={styles.cardTitle}>📁 Categories</h3>
  <p style={styles.cardDescription}>
    Add, edit, and manage product categories
  </p>
</Link>
        </div>
      </div>
    </div>
  )
}

const styles = {
  container: {
    minHeight: '100vh',
    backgroundColor: '#f5f5f5'
  },
  header: {
    backgroundColor: '#1a1a1a',
    color: 'white',
    padding: '1rem 2rem',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center'
  },
  headerTitle: {
    fontSize: '1.5rem',
    margin: 0
  },
  headerRight: {
    display: 'flex',
    alignItems: 'center',
    gap: '1rem'
  },
  userEmail: {
    color: '#ccc'
  },
  signOutButton: {
    padding: '0.5rem 1rem',
    backgroundColor: '#dc2626',
    color: 'white',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer'
  },
  content: {
    padding: '2rem',
    maxWidth: '1200px',
    margin: '0 auto'
  },
  sectionTitle: {
    marginBottom: '1.5rem',
    color: '#333'
  },
  cardGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
    gap: '1.5rem'
  },
  card: {
    backgroundColor: 'white',
    padding: '2rem',
    borderRadius: '8px',
    boxShadow: '0 2px 5px rgba(0,0,0,0.1)',
    textDecoration: 'none',
    color: 'inherit',
    transition: 'transform 0.2s'
  },
  cardTitle: {
    fontSize: '1.5rem',
    marginBottom: '0.5rem',
    color: '#333'
  },
  cardDescription: {
    color: '#666'
  }
}