import React from 'react';
import styles from './Contact.module.css';

const Contact: React.FC = () => {
    return (
        <section id="contact" className={`section-padding ${styles.contactSection}`}>
            <div className={`container ${styles.contactContainer}`}>

                <div className={styles.contactInfo}>
                    <span className={styles.sectionBadge}>Get In Touch</span>
                    <h2 className={styles.sectionTitle}>Partner with Prishalifecare</h2>
                    <p className={styles.description}>
                        We are dedicated to fulfilling global healthcare needs. Contact us today to learn more about our products, partnering opportunities, or general inquiries.
                    </p>

                    <div className={styles.contactDetails}>
                        <div className={styles.detailItem}>
                            <div className={styles.iconBox}>📍</div>
                            <div className={styles.detailText}>
                                <h4>Corporate Office</h4>
                                <p>B2-1208 Palladium, Corporate road, B/h Divya bhaskar, Makarba, Ahmedabad-380051 (Guj.), India</p>
                            </div>
                        </div>

                        <div className={styles.detailItem}>
                            <div className={styles.iconBox}>📞</div>
                            <div className={styles.detailText}>
                                <h4>Call Us</h4>
                                <p><a href="tel:+919909976108">+91 99099 76108</a></p>
                            </div>
                        </div>

                        <div className={styles.detailItem}>
                            <div className={styles.iconBox}>✉️</div>
                            <div className={styles.detailText}>
                                <h4>Email Us</h4>
                                <p><a href="mailto:info@prishalifecare.com">info@prishalifecare.com</a></p>
                            </div>
                        </div>
                    </div>
                </div>

                <div className={styles.contactFormContainer}>
                    <div className={`${styles.formWrapper} glass`}>
                        <h3>Send us a message</h3>
                        <form className={styles.contactForm} onSubmit={(e) => e.preventDefault()}>
                            <div className={styles.formGroup}>
                                <label htmlFor="name">Full Name</label>
                                <input type="text" id="name" placeholder="John Doe" required />
                            </div>

                            <div className={styles.formGroup}>
                                <label htmlFor="email">Email Address</label>
                                <input type="email" id="email" placeholder="john@example.com" required />
                            </div>

                            <div className={styles.formGroup}>
                                <label htmlFor="subject">Subject</label>
                                <input type="text" id="subject" placeholder="How can we help?" required />
                            </div>

                            <div className={styles.formGroup}>
                                <label htmlFor="message">Message</label>
                                <textarea id="message" rows={4} placeholder="Your message here..." required></textarea>
                            </div>

                            <button type="submit" className="btn btn-primary">Send Message</button>
                        </form>
                    </div>
                </div>

            </div>
        </section>
    );
};

export default Contact;
