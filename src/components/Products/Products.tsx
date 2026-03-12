import React, { useEffect, useState, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { collection, getDocs, orderBy, query, limit } from 'firebase/firestore';
import { db } from '../../firebase';
import InquiryModal from '../InquiryModal/InquiryModal';
import styles from './Products.module.css';

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

    useEffect(() => {
        if (images.length <= 1) return;
        const timer = setInterval(() => setSlide(prev => (prev + 1) % images.length), 3500);
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
                    <h4 className={styles.productTitle}>{product.title}</h4>
                </Link>
                <p className={styles.productDesc}>{product.description}</p>
                <button className={styles.inquiryBtn} onClick={() => onInquire(product.title)}>📩 Inquire Now</button>
            </div>
        </div>
    );
};

const Products: React.FC = () => {
    const [products, setProducts] = useState<Product[]>([]);
    const [loading, setLoading] = useState(true);
    const [inquiryProduct, setInquiryProduct] = useState<string | null>(null);

    useEffect(() => {
        const fetchProducts = async () => {
            try {
                const q = query(collection(db, 'products'), orderBy('createdAt', 'desc'), limit(6));
                const snapshot = await getDocs(q);
                setProducts(snapshot.docs.map(d => ({ id: d.id, ...d.data() })) as Product[]);
            } catch (e) { console.error(e); }
            finally { setLoading(false); }
        };
        fetchProducts();
    }, []);

    return (
        <section id="products" className={`section-padding ${styles.productsSection}`}>
            <div className={`container ${styles.productsContainer}`}>
                <div className={styles.header}>
                    <span className={styles.sectionBadge}>Our Portfolio</span>
                    <h2 className={styles.sectionTitle}>Extensive Range of Products</h2>
                    <p className={styles.description}>We offer a comprehensive portfolio covering a wide array of therapeutic segments, manufacturing forms, and healthcare applications.</p>
                </div>

                {loading ? (
                    <p className={styles.loadingText}>Loading products...</p>
                ) : products.length === 0 ? (
                    <p className={styles.loadingText}>No products available yet.</p>
                ) : (
                    <>
                        <div className={styles.productGrid}>
                            {products.map(product => (
                                <ProductCard key={product.id} product={product} onInquire={setInquiryProduct} />
                            ))}
                        </div>
                        <div className={styles.viewAllWrapper}>
                            <Link to="/products" className="btn btn-primary">
                                View All Products
                                <svg width="16" height="16" viewBox="0 0 16 16" fill="none"><path d="M3 8H13M13 8L9 4M13 8L9 12" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
                            </Link>
                        </div>
                    </>
                )}
            </div>

            {inquiryProduct && <InquiryModal productName={inquiryProduct} onClose={() => setInquiryProduct(null)} />}
        </section>
    );
};

export default Products;
