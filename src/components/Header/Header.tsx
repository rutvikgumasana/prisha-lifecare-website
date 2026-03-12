import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import styles from './Header.module.css';

const Header: React.FC = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const toggleMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen);
  };

  return (
    <header className={`${styles.header} ${isScrolled ? styles.scrolled : ''}`}>
      <div className={`container ${styles.headerContainer}`}>
        <div className={styles.logo}>
          <Link to="/">
            <img src="/prisha-logo.png" alt="Prisha Lifecare" className={styles.logoImg} />
          </Link>
        </div>

        <nav className={`${styles.nav} ${mobileMenuOpen ? styles.navOpen : ''}`}>
          <ul className={styles.navList}>
            <li><a href="/#home" onClick={() => setMobileMenuOpen(false)}>Home</a></li>
            <li><a href="/#about" onClick={() => setMobileMenuOpen(false)}>About Us</a></li>
            <li><Link to="/products" onClick={() => setMobileMenuOpen(false)}>Products</Link></li>
            <li><a href="/#contact" onClick={() => setMobileMenuOpen(false)}>Contact Us</a></li>
          </ul>
          <div className={styles.navActions}>
            <a href="tel:+916352953127" className={styles.phoneLink}>
              📞 +91 63529 53127
            </a>
            <a href="/#contact" className="btn btn-primary" onClick={() => setMobileMenuOpen(false)}>
              Get in Touch
            </a>
          </div>
        </nav>

        <button
          className={`${styles.mobileToggle} ${mobileMenuOpen ? styles.active : ''}`}
          onClick={toggleMenu}
          aria-label="Toggle menu"
        >
          <span className={styles.hamburgerLine}></span>
          <span className={styles.hamburgerLine}></span>
          <span className={styles.hamburgerLine}></span>
        </button>
      </div>
    </header>
  );
};

export default Header;
