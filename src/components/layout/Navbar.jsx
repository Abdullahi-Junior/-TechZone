import { Link } from 'react-router-dom';

export default function Navbar() {
  return (
    <nav style={styles.nav}>
      <div style={styles.logo}>
        <Link to="/" style={styles.logoLink}>TechZone Electronics</Link>
      </div>
      <div style={styles.links}>
        <Link to="/" style={styles.link}>Home</Link>
        <Link to="/products" style={styles.link}>Products</Link>
        <Link to="/contact" style={styles.link}>Contact</Link>
      </div>
    </nav>
  );
}

const styles = {
  nav: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '1rem 2rem', backgroundColor: '#1a1a1a', color: 'white' },
  logo: { fontSize: '1.5rem', fontWeight: 'bold' },
  logoLink: { color: 'white', textDecoration: 'none' },
  links: { display: 'flex', gap: '1.5rem' },
  link: { color: '#ccc', textDecoration: 'none', fontSize: '1rem' }
};