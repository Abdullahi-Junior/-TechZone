export default function Footer() {
  return (
    <footer style={styles.footer}>
      <p>© {new Date().getFullYear()} TechZone Electronics. All rights reserved.</p>
      <p>📞 Call us: +880 19526 89089 | 💬 WhatsApp available</p>
    </footer>
  );
}

const styles = {
  footer: { textAlign: 'center', padding: '2rem', backgroundColor: '#f4f4f4', color: '#333', marginTop: 'auto' }
};