import React from 'react';
import styles from './About.module.css';

const About: React.FC = () => {
    return (
        <section id="about" className={`section-padding ${styles.aboutSection}`}>
            <div className={`container ${styles.aboutContainer}`}>

                <div className={styles.aboutVisual}>
                    <div className={styles.imageWrapper}>
                        {/* We'll use CSS to create a placeholder style for the image if one is missing, 
                but giving it a structured feel */}
                        <div className={styles.imagePlaceholder}>
                            <div className={styles.imageOverlay}></div>
                        </div>
                        <div className={styles.experienceBadge}>
                            <span className={styles.years}>Global</span>
                            <span className={styles.text}>Presence</span>
                        </div>
                    </div>
                </div>

                <div className={styles.aboutContent}>
                    <span className={styles.sectionBadge}>About Us</span>
                    <h2 className={styles.sectionTitle}>
                        Delivering Healthcare Excellence Worldwide.
                    </h2>
                    <p className={styles.description}>
                        Health being the paramount of livelihood, we at <strong className={styles.highlight}>Symbiosis Bioscience Pvt. Ltd. (Prishalifecare)</strong> have embarked on a mission to reach out on a global scale to ensure supply and export of generic and branded medicines.
                    </p>
                    <p className={styles.description}>
                        Our base, established in Ahmedabad, Gujarat, serves as the heart of our operations, where quality meets dedication. We strive to improve lives by providing accessible, premium healthcare solutions.
                    </p>

                    <ul className={styles.featureList}>
                        <li className={styles.featureItem}>
                            <div className={styles.iconBox}>✓</div>
                            <span>Premium Generic & Branded Medicines</span>
                        </li>
                        <li className={styles.featureItem}>
                            <div className={styles.iconBox}>✓</div>
                            <span>Rigorous Quality Assurance</span>
                        </li>
                        <li className={styles.featureItem}>
                            <div className={styles.iconBox}>✓</div>
                            <span>Global Export Network</span>
                        </li>
                    </ul>

                    <div className={styles.actions}>
                        <a href="#contact" className="btn btn-primary">Contact Us Today</a>
                    </div>
                </div>

            </div>
        </section>
    );
};

export default About;
