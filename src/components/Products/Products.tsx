import React from 'react';
import styles from './Products.module.css';

const categories = [
    { id: 1, title: 'Tablet / Capsules', icon: '💊' },
    { id: 2, title: 'Soft Gel Capsules', icon: '💊' },
    { id: 3, title: 'Injectables', icon: '💉' },
    { id: 4, title: 'Syrup / Suspension', icon: 'bottles' }, // placeholder
    { id: 5, title: 'Dry Syrups', icon: '🍼' },
    { id: 6, title: 'Drops / Spray', icon: '💧' },
    { id: 7, title: 'Ointments', icon: '🩹' },
    { id: 8, title: 'Ayurvedic Preparation', icon: '🌿' },
    { id: 9, title: 'Cardiac Products', icon: '❤️' },
    { id: 10, title: 'Gummies', icon: '🍬' },
];

const Products: React.FC = () => {
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

                <div className={styles.grid}>
                    {categories.map((category) => (
                        <div key={category.id} className={styles.card}>
                            <div className={styles.cardIcon}>
                                {category.icon === 'bottles' ? '🧪' : category.icon}
                            </div>
                            <h3 className={styles.cardTitle}>{category.title}</h3>
                            <div className={styles.cardHoverEffect}></div>
                        </div>
                    ))}
                </div>

            </div>
        </section>
    );
};

export default Products;
