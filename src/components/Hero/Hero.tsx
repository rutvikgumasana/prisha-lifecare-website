import React from 'react';
import styles from './Hero.module.css';

const Hero: React.FC = () => {
    return (
        <section id="home" className={styles.hero}>
            {/* Background visual element */}
            <div className={styles.heroBackground}>
                <div className={styles.gradientOrb}></div>
                <div className={styles.gradientOrb2}></div>
            </div>

            <div className={`container ${styles.heroContainer}`}>
                <div className={styles.heroContent}>
                    <span className={styles.heroBadge}>Welcome to Prishalifecare</span>
                    <h1 className={styles.heroTitle}>
                        <span className={styles.highlight}>Passion</span> for <br />
                        better health.
                    </h1>
                    <p className={styles.heroDescription}>
                        We have embarked on a mission to reach out on a global scale to ensure the supply and export of generic and branded medicines, driven by our commitment to healthier lives.
                    </p>
                    <div className={styles.heroActions}>
                        <a href="#products" className="btn btn-primary">Explore Products</a>
                        <a href="#about" className="btn btn-outline">Learn More</a>
                    </div>
                </div>

                <div className={styles.heroVisual}>
                    <div className={`${styles.glassCard} glass`}>
                        <div className={styles.statsRow}>
                            <div className={styles.statItem}>
                                <h3 className={styles.statLabel}>Global</h3>
                                <p className={styles.statValue}>Reach</p>
                            </div>
                            <div className={styles.statItem}>
                                <h3 className={styles.statLabel}>Premium</h3>
                                <p className={styles.statValue}>Quality</p>
                            </div>
                        </div>
                        <div className={styles.trustedBadge}>
                            <span className={styles.shieldIcon}>🛡️</span>
                            Trusted Healthcare Partner
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default Hero;
