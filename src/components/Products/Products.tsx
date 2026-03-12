import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { collection, getDocs, orderBy, query, limit } from 'firebase/firestore';
import { db } from '../../firebase';
import styles from './Products.module.css';

interface Product {
    id: string;
    title: string;
    description: string;
    imageBase64: string;
}

const Products: React.FC = () => {
    const [products, setProducts] = useState<Product[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchProducts = async () => {
            try {
                const q = query(collection(db, 'products'), orderBy('createdAt', 'desc'), limit(6));
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
        <section id="products" className={`section-padding ${styles.productsSection}`}>
            <div className={`container ${styles.productsContainer}`}>

                <div className={styles.header}>
                    <span className={styles.sectionBadge}>Our Portfolio</span>
                    <h2 className={styles.sectionTitle}>Extensive Range of Products</h2>
                    <p className={styles.description}>
                        We offer a comprehensive portfolio covering a wide array of therapeutic segments, manufacturing forms, and healthcare applications.
                    </p>
                </div>

                {loading ? (
                    <p className={styles.loadingText}>Loading products...</p>
                ) : products.length === 0 ? (
                    <p className={styles.loadingText}>No products available yet.</p>
                ) : (
                    <>
                        <div className={styles.productGrid}>
                            {products.map((product) => (
                                <div key={product.id} className={styles.productCard}>
                                    <div className={styles.productImage}>
                                        <img src={product.imageBase64} alt={product.title} />
                                    </div>
                                    <div className={styles.productInfo}>
                                        <h4 className={styles.productTitle}>{product.title}</h4>
                                        <p className={styles.productDesc}>{product.description}</p>
                                    </div>
                                </div>
                            ))}
                        </div>

                        <div className={styles.viewAllWrapper}>
                            <Link to="/products" className="btn btn-primary">
                                View All Products
                                <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M3 8H13M13 8L9 4M13 8L9 12" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                                </svg>
                            </Link>
                        </div>
                    </>
                )}

            </div>
        </section>
    );
};

export default Products;
