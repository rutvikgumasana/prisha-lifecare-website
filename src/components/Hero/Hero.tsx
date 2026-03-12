import React from 'react';
import { Link } from 'react-router-dom';
import styles from './Hero.module.css';

const Hero: React.FC = () => {
    return (
        <section id="home" className={styles.hero}>
            <div className={styles.heroBg}>
                <div className={styles.bgPattern}></div>
                <div className={styles.gradientOverlay}></div>
                <div className={styles.floatingOrb1}></div>
                <div className={styles.floatingOrb2}></div>
                <div className={styles.floatingOrb3}></div>
            </div>

            <div className={`container ${styles.heroContainer}`}>
                <div className={styles.heroContent}>
                    <div className={styles.heroBadge}>
                        <span className={styles.badgeDot}></span>
                        Trusted Pharmaceutical Partner
                    </div>
                    <h1 className={styles.heroTitle}>
                        Advancing <span className={styles.highlight}>Healthcare</span> with Quality & Innovation
                    </h1>
                    <p className={styles.heroDescription}>
                        We are committed to improving lives globally through the supply and export of premium generic and branded medicines, ensuring accessible healthcare for all.
                    </p>
                    <div className={styles.heroActions}>
                        <Link to="/products" className="btn btn-primary">
                            Explore Products
                            <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M3 8H13M13 8L9 4M13 8L9 12" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                            </svg>
                        </Link>
                        <a href="#about" className="btn btn-outline">Learn More</a>
                    </div>
                </div>

                <div className={styles.heroRight}>
                    <div className={styles.statsGrid}>
                        <div className={styles.statCard}>
                            <div className={styles.statIcon}>🧬</div>
                            <div className={styles.statNumber}>500+</div>
                            <div className={styles.statLabel}>Products Range</div>
                        </div>
                        <div className={`${styles.statCard} ${styles.statCardAccent}`}>
                            <div className={styles.statIcon}>🌍</div>
                            <div className={styles.statNumber}>Global</div>
                            <div className={styles.statLabel}>Export Network</div>
                        </div>
                        <div className={`${styles.statCard} ${styles.statCardAccent}`}>
                            <div className={styles.statIcon}>🔬</div>
                            <div className={styles.statNumber}>WHO</div>
                            <div className={styles.statLabel}>GMP Certified</div>
                        </div>
                        <div className={styles.statCard}>
                            <div className={styles.statIcon}>🛡️</div>
                            <div className={styles.statNumber}>100%</div>
                            <div className={styles.statLabel}>Quality Assured</div>
                        </div>
                    </div>
                </div>
            </div>

            <div className={styles.scrollIndicator}>
                <div className={styles.scrollLine}></div>
            </div>
        </section>
    );
};

export default Hero;
