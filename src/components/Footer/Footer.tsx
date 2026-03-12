import React from 'react';
import styles from './Footer.module.css';

const Footer: React.FC = () => {
    return (
        <footer className={styles.footer}>
            <div className={`container ${styles.footerContainer}`}>
                <div className={styles.footerTop}>

                    <div className={styles.footerBrand}>
                        <div className={styles.logo}>
                            <span className={styles.logoText}>Prisha</span>
                            <span className={styles.logoHighlight}>lifecare</span>
                        </div>
                        <p className={styles.brandDescription}>
                            Passion for better health. Ensuring supply and export of generic and branded medicines globally.
                        </p>
                    </div>

                    <div className={styles.footerLinksGroup}>
                        <h4 className={styles.footerHeading}>Quick Links</h4>
                        <ul className={styles.footerLinks}>
                            <li><a href="#home">Home</a></li>
                            <li><a href="#about">About Us</a></li>
                            <li><a href="#products">Products</a></li>
                            <li><a href="#contact">Contact</a></li>
                        </ul>
                    </div>

                    <div className={styles.footerLinksGroup}>
                        <h4 className={styles.footerHeading}>Categories</h4>
                        <ul className={styles.footerLinks}>
                            <li><a href="#products">Tablet / Capsules</a></li>
                            <li><a href="#products">Injectables</a></li>
                            <li><a href="#products">Syrup / Suspension</a></li>
                            <li><a href="#products">Ayurvedic</a></li>
                        </ul>
                    </div>

                    <div className={styles.footerContact}>
                        <h4 className={styles.footerHeading}>Contact Us</h4>
                        <div className={styles.contactItem}>
                            <span className={styles.contactIcon}>📍</span>
                            <p>Ahmedabad (Guj.), India</p>
                        </div>
                        <div className={styles.contactItem}>
                            <span className={styles.contactIcon}>📞</span>
                            <a href="tel:+919909976108">+91 99099 76108</a>
                        </div>
                        <div className={styles.contactItem}>
                            <span className={styles.contactIcon}>✉️</span>
                            <a href="mailto:info@prishalifecare.com">info@prishalifecare.com</a>
                        </div>
                    </div>
                </div>

                <div className={styles.footerBottom}>
                    <p className={styles.copyright}>
                        &copy; {new Date().getFullYear()} Prishalifecare. All Rights Reserved.
                    </p>
                    <div className={styles.socialLinks}>
                        <a href="https://www.instagram.com/prisha_lifecare/" target="_blank" rel="noopener noreferrer" className={styles.socialIcon} aria-label="Instagram">
                            📸
                        </a>
                    </div>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
