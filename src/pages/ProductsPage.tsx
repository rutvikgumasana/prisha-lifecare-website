import { useEffect, useState, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { collection, getDocs, orderBy, query } from 'firebase/firestore';
import { db } from '../firebase';
import Header from '../components/Header/Header';
import Footer from '../components/Footer/Footer';
import WhatsAppButton from '../components/WhatsAppButton/WhatsAppButton';
import InquiryModal from '../components/InquiryModal/InquiryModal';
import styles from './ProductsPage.module.css';

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

const ProductCard = ({ product, onInquire }: { product: Product; onInquire: (name: string) => void }) => {
  const images = getImages(product);
  const [slide, setSlide] = useState(0);

  // Auto slide
  useEffect(() => {
    if (images.length <= 1) return;
    const timer = setInterval(() => setSlide(prev => (prev + 1) % images.length), 3000);
    return () => clearInterval(timer);
  }, [images.length]);

  const nextSlide = useCallback((e: React.MouseEvent) => {
    e.preventDefault(); e.stopPropagation();
    setSlide(prev => (prev + 1) % images.length);
  }, [images.length]);

  const prevSlide = useCallback((e: React.MouseEvent) => {
    e.preventDefault(); e.stopPropagation();
    setSlide(prev => (prev - 1 + images.length) % images.length);
  }, [images.length]);

  return (
    <div className={styles.productCard}>
      <Link to={`/products/${product.id}`} className={styles.productImageLink}>
        <div className={styles.productImage}>
          <img src={images[slide]} alt={product.title} />
          {images.length > 1 && (
            <>
              <button className={`${styles.cardSliderBtn} ${styles.cardPrev}`} onClick={prevSlide}>‹</button>
              <button className={`${styles.cardSliderBtn} ${styles.cardNext}`} onClick={nextSlide}>›</button>
              <div className={styles.dots}>
                {images.map((_, i) => (
                  <span key={i} className={`${styles.dot} ${i === slide ? styles.dotActive : ''}`} />
                ))}
              </div>
            </>
          )}
        </div>
      </Link>
      <div className={styles.productInfo}>
        <Link to={`/products/${product.id}`} className={styles.productTitleLink}>
          <h3 className={styles.productTitle}>{product.title}</h3>
        </Link>
        <p className={styles.productDesc}>{product.description}</p>
        <button className={styles.inquiryBtn} onClick={() => onInquire(product.title)}>📩 Inquire Now</button>
      </div>
    </div>
  );
};

const ProductsPage = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [inquiryProduct, setInquiryProduct] = useState<string | null>(null);

  useEffect(() => {
    window.scrollTo(0, 0);
    const fetchProducts = async () => {
      try {
        const q = query(collection(db, 'products'), orderBy('createdAt', 'desc'));
        const snapshot = await getDocs(q);
        setProducts(snapshot.docs.map(d => ({ id: d.id, ...d.data() })) as Product[]);
      } catch (e) { console.error(e); }
      finally { setLoading(false); }
    };
    fetchProducts();
  }, []);

  return (
    <div className="app">
      <Header />
      <main>
        <section className={styles.pageHero}>
          <div className={styles.heroBg}>
            <div className={styles.bgPattern}></div>
            <div className={styles.gradientOverlay}></div>
          </div>
          <div className={`container ${styles.heroContent}`}>
            <span className={styles.badge}>Our Portfolio</span>
            <h1 className={styles.pageTitle}>Our Products</h1>
            <p className={styles.pageDesc}>Explore our comprehensive range of pharmaceutical products across various therapeutic segments.</p>
          </div>
        </section>

        <section className={styles.productsSection}>
          <div className="container">
            {loading ? (
              <div className={styles.loadingState}><p>Loading products...</p></div>
            ) : products.length === 0 ? (
              <div className={styles.emptyState}>
                <div className={styles.emptyIcon}>📦</div>
                <h3>No Products Yet</h3>
                <p>Products will appear here once they are added.</p>
              </div>
            ) : (
              <>
                <p className={styles.productCount}>{products.length} Products Available</p>
                <div className={styles.productGrid}>
                  {products.map(product => (
                    <ProductCard key={product.id} product={product} onInquire={setInquiryProduct} />
                  ))}
                </div>
              </>
            )}
          </div>
        </section>

        <section className={styles.ctaSection}>
          <div className="container">
            <div className={styles.ctaBanner}>
              <div className={styles.ctaContent}>
                <h2>Looking for a specific product?</h2>
                <p>Contact us to discuss your pharmaceutical needs.</p>
              </div>
              <div className={styles.ctaActions}>
                <a href="tel:+916352953127" className="btn btn-outline" style={{ borderColor: 'rgba(255,255,255,0.2)', color: 'white' }}>📞 Call Us</a>
                <a href="/#contact" className="btn btn-primary">Send Inquiry</a>
              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
      <WhatsAppButton />
      {inquiryProduct && <InquiryModal productName={inquiryProduct} onClose={() => setInquiryProduct(null)} />}
    </div>
  );
};

export default ProductsPage;
