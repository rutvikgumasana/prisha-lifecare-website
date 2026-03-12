import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '../firebase';
import Header from '../components/Header/Header';
import Footer from '../components/Footer/Footer';
import WhatsAppButton from '../components/WhatsAppButton/WhatsAppButton';
import InquiryModal from '../components/InquiryModal/InquiryModal';
import styles from './ProductDetail.module.css';

interface Product {
  id: string;
  title: string;
  description: string;
  imageBase64?: string;
  images?: string[];
}

const getImages = (p: Product): string[] => {
  if (p.images && p.images.length > 0) return p.images;
  if (p.imageBase64) return [p.imageBase64];
  return [];
};

const ProductDetail = () => {
  const { id } = useParams<{ id: string }>();
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [showInquiry, setShowInquiry] = useState(false);

  useEffect(() => {
    window.scrollTo(0, 0);
    const fetchProduct = async () => {
      if (!id) return;
      try {
        const docSnap = await getDoc(doc(db, 'products', id));
        if (docSnap.exists()) {
          setProduct({ id: docSnap.id, ...docSnap.data() } as Product);
        }
      } catch (e) {
        console.error('Error fetching product:', e);
      } finally {
        setLoading(false);
      }
    };
    fetchProduct();
  }, [id]);

  if (loading) {
    return (
      <div className="app">
        <Header />
        <div className={styles.loadingPage}><p>Loading product...</p></div>
        <Footer />
      </div>
    );
  }

  if (!product) {
    return (
      <div className="app">
        <Header />
        <div className={styles.notFound}>
          <h2>Product Not Found</h2>
          <p>The product you're looking for doesn't exist.</p>
          <Link to="/products" className="btn btn-primary">View All Products</Link>
        </div>
        <Footer />
      </div>
    );
  }

  const images = getImages(product);

  const nextSlide = () => setCurrentSlide((prev) => (prev + 1) % images.length);
  const prevSlide = () => setCurrentSlide((prev) => (prev - 1 + images.length) % images.length);

  return (
    <div className="app">
      <Header />
      <main>
        <section className={styles.detailSection}>
          <div className={`container ${styles.detailContainer}`}>
            <div className={styles.breadcrumb}>
              <Link to="/">Home</Link> / <Link to="/products">Products</Link> / <span>{product.title}</span>
            </div>

            <div className={styles.productLayout}>
              {/* Image Slider */}
              <div className={styles.sliderWrapper}>
                <div className={styles.mainImage}>
                  <img src={images[currentSlide]} alt={product.title} />
                  {images.length > 1 && (
                    <>
                      <button className={`${styles.sliderBtn} ${styles.prevBtn}`} onClick={prevSlide}>‹</button>
                      <button className={`${styles.sliderBtn} ${styles.nextBtn}`} onClick={nextSlide}>›</button>
                      <div className={styles.slideCounter}>{currentSlide + 1} / {images.length}</div>
                    </>
                  )}
                </div>
                {images.length > 1 && (
                  <div className={styles.thumbnails}>
                    {images.map((img, i) => (
                      <button
                        key={i}
                        className={`${styles.thumb} ${i === currentSlide ? styles.thumbActive : ''}`}
                        onClick={() => setCurrentSlide(i)}
                      >
                        <img src={img} alt={`Thumb ${i + 1}`} />
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {/* Product Info */}
              <div className={styles.productInfo}>
                <h1 className={styles.productTitle}>{product.title}</h1>
                <p className={styles.productDesc}>{product.description}</p>

                <div className={styles.actionButtons}>
                  <button className={styles.inquiryBtn} onClick={() => setShowInquiry(true)}>
                    📩 Send Inquiry
                  </button>
                  <a
                    href={`https://wa.me/916352953127?text=${encodeURIComponent(`Hi, I'm interested in: ${product.title}. Please share more details.`)}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={styles.whatsappBtn}
                  >
                    💬 WhatsApp
                  </a>
                  <a href="tel:+916352953127" className={styles.callBtn}>
                    📞 Call Us
                  </a>
                </div>

                <div className={styles.infoCard}>
                  <div className={styles.infoItem}>
                    <span className={styles.infoIcon}>🏭</span>
                    <div><strong>Manufacturer</strong><p>WHO-GMP Certified</p></div>
                  </div>
                  <div className={styles.infoItem}>
                    <span className={styles.infoIcon}>🛡️</span>
                    <div><strong>Quality</strong><p>100% Quality Assured</p></div>
                  </div>
                  <div className={styles.infoItem}>
                    <span className={styles.infoIcon}>🚚</span>
                    <div><strong>Delivery</strong><p>Pan India & Global Export</p></div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
      <WhatsAppButton />

      {showInquiry && (
        <InquiryModal productName={product.title} onClose={() => setShowInquiry(false)} />
      )}
    </div>
  );
};

export default ProductDetail;
