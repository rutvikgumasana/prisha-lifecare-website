import { useEffect, useState } from 'react';
import { collection, getDocs, orderBy, query } from 'firebase/firestore';
import { db } from '../firebase';
import Header from '../components/Header/Header';
import Footer from '../components/Footer/Footer';
import styles from './ProductsPage.module.css';

interface Product {
  id: string;
  title: string;
  description: string;
  imageBase64: string;
}

const ProductsPage = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    window.scrollTo(0, 0);
    const fetchProducts = async () => {
      try {
        const q = query(collection(db, 'products'), orderBy('createdAt', 'desc'));
        const snapshot = await getDocs(q);
        const productsList = snapshot.docs.map(docSnap => ({
          id: docSnap.id,
          ...docSnap.data()
        })) as Product[];
        setProducts(productsList);
      } catch (error) {
        console.error('Error fetching products:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, []);

  return (
    <div className="app">
      <Header />
      <main>
        {/* Page Hero */}
        <section className={styles.pageHero}>
          <div className={styles.heroBg}>
            <div className={styles.bgPattern}></div>
            <div className={styles.gradientOverlay}></div>
          </div>
          <div className={`container ${styles.heroContent}`}>
            <span className={styles.badge}>Our Portfolio</span>
            <h1 className={styles.pageTitle}>Our Products</h1>
            <p className={styles.pageDesc}>
              Explore our comprehensive range of pharmaceutical products across various therapeutic segments.
            </p>
          </div>
        </section>

        {/* Products Grid */}
        <section className={styles.productsSection}>
          <div className="container">
            {loading ? (
              <div className={styles.loadingState}>
                <p>Loading products...</p>
              </div>
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
                  {products.map((product) => (
                    <div key={product.id} className={styles.productCard}>
                      <div className={styles.productImage}>
                        <img src={product.imageBase64} alt={product.title} />
                      </div>
                      <div className={styles.productInfo}>
                        <h3 className={styles.productTitle}>{product.title}</h3>
                        <p className={styles.productDesc}>{product.description}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </>
            )}
          </div>
        </section>

        {/* CTA */}
        <section className={styles.ctaSection}>
          <div className="container">
            <div className={styles.ctaBanner}>
              <div className={styles.ctaContent}>
                <h2>Looking for a specific product?</h2>
                <p>Contact us to discuss your pharmaceutical needs. We offer customized solutions for healthcare businesses.</p>
              </div>
              <div className={styles.ctaActions}>
                <a href="tel:+916352953127" className="btn btn-outline" style={{ borderColor: 'rgba(255,255,255,0.2)', color: 'white' }}>
                  📞 Call Us
                </a>
                <a href="/#contact" className="btn btn-primary">
                  Send Inquiry
                </a>
              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default ProductsPage;
