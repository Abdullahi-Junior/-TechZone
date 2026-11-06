import { useState } from 'react';
import { Link } from 'react-router-dom';

export default function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <nav style={styles.nav}>
      <div style={styles.logo}>
        <Link to="/" style={styles.logoLink} onClick={() => setIsMenuOpen(false)}>
          TechZone Electronics
        </Link>
      </div>

      {/* Desktop Links (Hidden on mobile via CSS, but we'll use a simple toggle for now) */}
      <div style={styles.desktopLinks}>
        <Link to="/" style={styles.link} onClick={() => setIsMenuOpen(false)}>Home</Link>
        <Link to="/products" style={styles.link} onClick={() => setIsMenuOpen(false)}>Products</Link>
        <Link to="/contact" style={styles.link} onClick={() => setIsMenuOpen(false)}>Contact</Link>
      </div>

      {/* Mobile Hamburger Button */}
      <button 
        style={styles.hamburger} 
        onClick={() => setIsMenuOpen(!isMenuOpen)}
        aria-label="Toggle menu"
      >
        {isMenuOpen ? '✕' : '☰'}
      </button>

      {/* Mobile Dropdown Menu */}
      {isMenuOpen && (
        <div style={styles.mobileMenu}>
          <Link to="/" style={styles.mobileLink} onClick={() => setIsMenuOpen(false)}>Home</Link>
          <Link to="/products" style={styles.mobileLink} onClick={() => setIsMenuOpen(false)}>Products</Link>
          <Link to="/contact" style={styles.mobileLink} onClick={() => setIsMenuOpen(false)}>Contact</Link>
        </div>
      )}
    </nav>
  );
}

const styles = {
  nav: { 
    display: 'flex', 
    justifyContent: 'space-between', 
    alignItems: 'center', 
    padding: '1rem 2rem', 
    backgroundColor: '#1a1a1a', 
    color: 'white',
    position: 'relative'
  },
  logo: { fontSize: '1.5rem', fontWeight: 'bold' },
  logoLink: { color: 'white', textDecoration: 'none' },
  
  // Desktop links (we will hide this on mobile using a media query in index.css)
  desktopLinks: { display: 'flex', gap: '1.5rem' },
  link: { color: '#ccc', textDecoration: 'none', fontSize: '1rem', transition: 'color 0.2s' },
  
  // Hamburger button (hidden on desktop by default, we'll control via CSS)
  hamburger: {
    display: 'none', // Hidden on desktop
    background: 'none',
    border: 'none',
    color: 'white',
    fontSize: '1.8rem',
    cursor: 'pointer',
    padding: '0.5rem'
  },
  
  // Mobile menu dropdown
  mobileMenu: {
    position: 'absolute',
    top: '100%',
    left: 0,
    right: 0,
    backgroundColor: '#2d2d2d',
    display: 'flex',
    flexDirection: 'column',
    padding: '1rem 2rem',
    boxShadow: '0 4px 6px rgba(0,0,0,0.3)',
    zIndex: 1000
  },
  mobileLink: {
    color: '#ccc',
    textDecoration: 'none',
    fontSize: '1.1rem',
    padding: '0.75rem 0',
    borderBottom: '1px solid #404040'
  }
};