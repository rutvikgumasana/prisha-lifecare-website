import React from 'react';
import styles from './Footer.module.css';

const Footer: React.FC = () => {
    return (
        <footer className={styles.footer}>
            <div className={`container ${styles.footerContainer}`}>
                <div className={styles.footerTop}>

                    <div className={styles.footerBrand}>
                        <div className={styles.logo}>
                            <a href="/">
                                <img src="/prisha-logo.png" alt="Prisha Lifecare" className={styles.logoImg} />
                            </a>
                        </div>
                        <p className={styles.brandDescription}>
                            Passion for better health. Ensuring supply and export of generic and branded medicines globally.
                        </p>
                        <div className={styles.socialLinks}>
                            <a href="https://www.instagram.com/prisha_lifecare/" target="_blank" rel="noopener noreferrer" className={styles.socialIcon} aria-label="Instagram">
                                📸
                            </a>
                        </div>
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
                        <h4 className={styles.footerHeading}>Segments</h4>
                        <ul className={styles.footerLinks}>
                            <li><a href="#products">Tablets & Capsules</a></li>
                            <li><a href="#products">Injectables</a></li>
                            <li><a href="#products">Syrups & Suspensions</a></li>
                            <li><a href="#products">Ayurvedic Range</a></li>
                        </ul>
                    </div>

                    <div className={styles.footerContact}>
                        <h4 className={styles.footerHeading}>Contact Us</h4>
                        <div className={styles.contactItem}>
                            <span className={styles.contactIcon}>📍</span>
                            <p>Dwarkesh Estate, Office no. 7, Ground Floor, Aslali, Ahmedabad - 382 427</p>
                        </div>
                        <div className={styles.contactItem}>
                            <span className={styles.contactIcon}>📞</span>
                            <div>
                                <a href="tel:+916352953127">+91 63529 53127</a>
                                <br />
                                <a href="tel:+917700077779">+91 77000 77779</a>
                            </div>
                        </div>
                        <div className={styles.contactItem}>
                            <span className={styles.contactIcon}>✉️</span>
                            <a href="mailto:prishalifecare99@gmail.com">prishalifecare99@gmail.com</a>
                        </div>
                    </div>
                </div>

                <div className={styles.footerBottom}>
                    <p className={styles.copyright}>
                        &copy; {new Date().getFullYear()} Prishalifecare. All Rights Reserved.
                    </p>
                    <p className={styles.madeWith}>
                        Made with ❤️ in India
                    </p>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
