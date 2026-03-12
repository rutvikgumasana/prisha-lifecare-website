import { useState, type FormEvent } from 'react';
import { collection, addDoc, Timestamp } from 'firebase/firestore';
import { db } from '../../firebase';
import styles from './Contact.module.css';

const Contact: React.FC = () => {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        subject: '',
        message: ''
    });
    const [submitting, setSubmitting] = useState(false);
    const [submitted, setSubmitted] = useState(false);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        setFormData(prev => ({ ...prev, [e.target.id]: e.target.value }));
    };

    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault();
        setSubmitting(true);

        try {
            await addDoc(collection(db, 'contacts'), {
                ...formData,
                createdAt: Timestamp.now()
            });
            setSubmitted(true);
            setFormData({ name: '', email: '', subject: '', message: '' });
            setTimeout(() => setSubmitted(false), 5000);
        } catch (error) {
            console.error('Error submitting form:', error);
            alert('Something went wrong. Please try again.');
        } finally {
            setSubmitting(false);
        }
    };

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
                                <p>Dwarkesh Estate, Office no. 7, Ground Floor, Aslali, Ahmedabad - 382 427</p>
                            </div>
                        </div>

                        <div className={styles.detailItem}>
                            <div className={styles.iconBox}>📞</div>
                            <div className={styles.detailText}>
                                <h4>Call Us</h4>
                                <p><a href="tel:+916352953127">+91 63529 53127</a></p>
                                <p><a href="tel:+917700077779">+91 77000 77779</a></p>
                            </div>
                        </div>

                        <div className={styles.detailItem}>
                            <div className={styles.iconBox}>✉️</div>
                            <div className={styles.detailText}>
                                <h4>Email Us</h4>
                                <p><a href="mailto:prishalifecare99@gmail.com">prishalifecare99@gmail.com</a></p>
                            </div>
                        </div>
                    </div>
                </div>

                <div className={styles.contactFormContainer}>
                    <div className={`${styles.formWrapper} glass`}>
                        <h3>Send us a message</h3>

                        {submitted && (
                            <div className={styles.successMessage}>
                                ✅ Thank you! Your message has been sent successfully. We'll get back to you soon.
                            </div>
                        )}

                        <form className={styles.contactForm} onSubmit={handleSubmit}>
                            <div className={styles.formGroup}>
                                <label htmlFor="name">Full Name</label>
                                <input
                                    type="text"
                                    id="name"
                                    placeholder="John Doe"
                                    value={formData.name}
                                    onChange={handleChange}
                                    required
                                />
                            </div>

                            <div className={styles.formGroup}>
                                <label htmlFor="email">Email Address</label>
                                <input
                                    type="email"
                                    id="email"
                                    placeholder="john@example.com"
                                    value={formData.email}
                                    onChange={handleChange}
                                    required
                                />
                            </div>

                            <div className={styles.formGroup}>
                                <label htmlFor="subject">Subject</label>
                                <input
                                    type="text"
                                    id="subject"
                                    placeholder="How can we help?"
                                    value={formData.subject}
                                    onChange={handleChange}
                                    required
                                />
                            </div>

                            <div className={styles.formGroup}>
                                <label htmlFor="message">Message</label>
                                <textarea
                                    id="message"
                                    rows={4}
                                    placeholder="Your message here..."
                                    value={formData.message}
                                    onChange={handleChange}
                                    required
                                ></textarea>
                            </div>

                            <button type="submit" className="btn btn-primary" disabled={submitting}>
                                {submitting ? 'Sending...' : 'Send Message'}
                            </button>
                        </form>
                    </div>
                </div>

            </div>
        </section>
    );
};

export default Contact;
