import React from 'react';
import styles from './About.module.css';

const features = [
    { icon: '💊', title: 'Generic & Branded Medicines', desc: 'Extensive range of pharmaceutical products across therapeutic segments' },
    { icon: '🔬', title: 'Quality Assurance', desc: 'Rigorous quality control at every step from manufacturing to delivery' },
    { icon: '🌍', title: 'Global Export Network', desc: 'Serving healthcare needs across international markets' },
    { icon: '🏭', title: 'WHO-GMP Manufacturing', desc: 'Partnered with certified manufacturing facilities' },
];

const About: React.FC = () => {
    return (
        <section id="about" className={`section-padding ${styles.aboutSection}`}>
            <div className={`container ${styles.aboutContainer}`}>

                <div className={styles.aboutTop}>
                    <div className={styles.aboutHeader}>
                        <span className={styles.sectionBadge}>About Us</span>
                        <h2 className={styles.sectionTitle}>
                            Delivering Healthcare Excellence Worldwide
                        </h2>
                    </div>
                    <div className={styles.aboutDesc}>
                        <p className={styles.description}>
                            Health being the paramount of livelihood, we at <strong>Symbiosis Bioscience Pvt. Ltd. (Prishalifecare)</strong> have embarked on a mission to reach out on a global scale to ensure supply and export of generic and branded medicines.
                        </p>
                        <p className={styles.description}>
                            Based in Ahmedabad, Gujarat, we strive to improve lives by providing accessible, premium healthcare solutions backed by uncompromising quality standards.
                        </p>
                    </div>
                </div>

                <div className={styles.featuresGrid}>
                    {features.map((feature, index) => (
                        <div key={index} className={styles.featureCard}>
                            <div className={styles.featureIcon}>{feature.icon}</div>
                            <h3 className={styles.featureTitle}>{feature.title}</h3>
                            <p className={styles.featureDesc}>{feature.desc}</p>
                        </div>
                    ))}
                </div>

                <div className={styles.ctaBanner}>
                    <div className={styles.ctaContent}>
                        <h3>Ready to partner with us?</h3>
                        <p>Let's discuss how we can support your healthcare business needs.</p>
                    </div>
                    <a href="#contact" className="btn btn-primary">Contact Us Today</a>
                </div>

            </div>
        </section>
    );
};

export default About;
