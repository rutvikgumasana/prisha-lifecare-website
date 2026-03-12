import { useState, type FormEvent } from 'react';
import { collection, addDoc, Timestamp } from 'firebase/firestore';
import { db } from '../../firebase';
import styles from './InquiryModal.module.css';

interface InquiryModalProps {
  productName: string;
  onClose: () => void;
}

const InquiryModal = ({ productName, onClose }: InquiryModalProps) => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    message: ''
  });
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setSubmitting(true);

    try {
      await addDoc(collection(db, 'product_inquiries'), {
        productName,
        ...formData,
        createdAt: Timestamp.now()
      });
      setSubmitted(true);
    } catch (error) {
      console.error('Error submitting inquiry:', error);
      alert('Something went wrong. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className={styles.overlay} onClick={onClose}>
      <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
        <button className={styles.closeBtn} onClick={onClose}>✕</button>

        {submitted ? (
          <div className={styles.successState}>
            <div className={styles.successIcon}>✅</div>
            <h3>Inquiry Sent!</h3>
            <p>Thank you for your interest in <strong>{productName}</strong>. Our team will get back to you shortly.</p>
            <button className={styles.doneBtn} onClick={onClose}>Done</button>
          </div>
        ) : (
          <>
            <div className={styles.modalHeader}>
              <h2>Product Inquiry</h2>
              <div className={styles.productBadge}>📦 {productName}</div>
            </div>

            <form onSubmit={handleSubmit} className={styles.form}>
              <div className={styles.formRow}>
                <div className={styles.formGroup}>
                  <label htmlFor="inq-name">Full Name</label>
                  <input
                    type="text"
                    id="inq-name"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    placeholder="John Doe"
                    required
                  />
                </div>
                <div className={styles.formGroup}>
                  <label htmlFor="inq-phone">Phone Number</label>
                  <input
                    type="tel"
                    id="inq-phone"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    placeholder="+91 99999 99999"
                    required
                  />
                </div>
              </div>

              <div className={styles.formGroup}>
                <label htmlFor="inq-email">Email Address</label>
                <input
                  type="email"
                  id="inq-email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="john@example.com"
                  required
                />
              </div>

              <div className={styles.formGroup}>
                <label htmlFor="inq-message">Message (optional)</label>
                <textarea
                  id="inq-message"
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  placeholder="I'm interested in this product..."
                  rows={3}
                />
              </div>

              <button type="submit" className={styles.submitBtn} disabled={submitting}>
                {submitting ? 'Sending...' : 'Send Inquiry'}
              </button>
            </form>
          </>
        )}
      </div>
    </div>
  );
};

export default InquiryModal;
