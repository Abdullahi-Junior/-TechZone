import { Link } from 'react-router-dom'

export default function Contact() {
  const team = [
    {
      name: 'Abdullahi',
      role: 'CEO & Founder',
      phone: '+234 800 000 0000',
      whatsapp: '2348000000000',
      email: 'ceo@techzone.com.ng'
    },
    {
      name: 'Ahmed',
      role: 'Store Manager',
      phone: '+234 801 111 1111',
      whatsapp: '2348011111111',
      email: 'manager@techzone.com.ng'
    },
    {
      name: 'Maryam',
      role: 'Customer Support',
      phone: '+234 802 222 2222',
      whatsapp: '2348022222222',
      email: 'support@techzone.com.ng'
    }
  ]

  return (
    <div style={styles.container}>
      {/* Header */}
      <div style={styles.header}>
        <h1 style={styles.title}>Contact Us</h1>
        <p style={styles.subtitle}>
          Have questions about a product or your reservation? Our team is here to help.
        </p>
      </div>

      {/* Business Info */}
      <div style={styles.businessInfo}>
        <div style={styles.infoCard}>
          <h3 style={styles.infoTitle}>📍 Visit Our Store</h3>
          <p style={styles.infoText}>
            123 Electronics Market Road,<br />
            Computer Village, Ikeja, Lagos, Nigeria
          </p>
        </div>
        <div style={styles.infoCard}>
          <h3 style={styles.infoTitle}>🕒 Working Hours</h3>
          <p style={styles.infoText}>
            Monday - Saturday: 8:00 AM - 6:00 PM<br />
            Sunday: 10:00 AM - 4:00 PM
          </p>
        </div>
      </div>

      {/* Team Section */}
      <div style={styles.teamSection}>
        <h2 style={styles.sectionTitle}>Reach Out to Our Team</h2>
        <div style={styles.teamGrid}>
          {team.map((person, index) => (
            <div key={index} style={styles.teamCard}>
              <div style={styles.avatar}>
                {person.name.split(' ').map(n => n[0]).join('')}
              </div>
              <h3 style={styles.personName}>{person.name}</h3>
              <p style={styles.personRole}>{person.role}</p>
              
              <div style={styles.contactDetails}>
                <p style={styles.contactItem}>📞 {person.phone}</p>
                <p style={styles.contactItem}>✉️ {person.email}</p>
              </div>

              <a 
                href={`https://wa.me/${person.whatsapp}?text=Hello ${person.name}, I have a question about TechZone Electronics.`}
                target="_blank"
                rel="noopener noreferrer"
                style={styles.whatsappButton}
              >
                💬 Chat on WhatsApp
              </a>
            </div>
          ))}
        </div>
      </div>

      {/* Back to Home */}
      <div style={styles.backHome}>
        <Link to="/" style={styles.backLink}>← Back to Homepage</Link>
      </div>
    </div>
  )
}

const styles = {
  container: { padding: '2rem', maxWidth: '1200px', margin: '0 auto' },
  header: { textAlign: 'center', marginBottom: '3rem' },
  title: { fontSize: '2.5rem', color: '#1f2937', marginBottom: '1rem' },
  subtitle: { fontSize: '1.1rem', color: '#6b7280', maxWidth: '600px', margin: '0 auto' },
  
  businessInfo: { 
    display: 'grid', 
    gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', 
    gap: '1.5rem', 
    marginBottom: '4rem' 
  },
  infoCard: { 
    backgroundColor: '#f9fafb', 
    padding: '2rem', 
    borderRadius: '12px', 
    textAlign: 'center',
    border: '1px solid #e5e7eb'
  },
  infoTitle: { fontSize: '1.25rem', marginBottom: '1rem', color: '#1f2937' },
  infoText: { color: '#4b5563', lineHeight: '1.6', fontSize: '1.05rem' },

  teamSection: { marginBottom: '3rem' },
  sectionTitle: { textAlign: 'center', fontSize: '2rem', color: '#1f2937', marginBottom: '2rem' },
  teamGrid: { 
    display: 'grid', 
    gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', 
    gap: '2rem' 
  },
  teamCard: { 
    backgroundColor: 'white', 
    padding: '2rem', 
    borderRadius: '12px', 
    textAlign: 'center',
    boxShadow: '0 4px 6px rgba(0,0,0,0.05)',
    border: '1px solid #e5e7eb',
    transition: 'transform 0.2s'
  },
  avatar: { 
    width: '80px', 
    height: '80px', 
    backgroundColor: '#2563eb', 
    color: 'white', 
    borderRadius: '50%', 
    display: 'flex', 
    alignItems: 'center', 
    justifyContent: 'center', 
    fontSize: '1.5rem', 
    fontWeight: 'bold', 
    margin: '0 auto 1rem' 
  },
  personName: { fontSize: '1.25rem', color: '#1f2937', marginBottom: '0.25rem' },
  personRole: { color: '#6b7280', fontSize: '0.95rem', marginBottom: '1.5rem', fontWeight: '500' },
  contactDetails: { marginBottom: '1.5rem' },
  contactItem: { color: '#4b5563', marginBottom: '0.5rem', fontSize: '0.95rem' },
  whatsappButton: { 
    display: 'inline-block', 
    padding: '0.75rem 1.5rem', 
    backgroundColor: '#25D366', 
    color: 'white', 
    borderRadius: '8px', 
    textDecoration: 'none', 
    fontWeight: '600',
    width: '100%'
  },
  backHome: { textAlign: 'center', marginTop: '2rem' },
  backLink: { color: '#2563eb', textDecoration: 'none', fontWeight: '600', fontSize: '1.1rem' }
}