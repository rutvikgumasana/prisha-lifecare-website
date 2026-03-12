import { useState, useEffect, type FormEvent } from 'react';
import { signOut } from 'firebase/auth';
import { collection, addDoc, getDocs, deleteDoc, doc, updateDoc, orderBy, query, Timestamp } from 'firebase/firestore';
import { useNavigate } from 'react-router-dom';
import { auth, db } from '../firebase';
import styles from './AdminDashboard.module.css';

interface Product {
  id: string;
  title: string;
  description: string;
  imageBase64: string;
  createdAt: Timestamp;
}

interface ContactLead {
  id: string;
  name: string;
  email: string;
  subject: string;
  message: string;
  createdAt: Timestamp;
}

const compressImage = (file: File, maxWidth = 800, quality = 0.7): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement('canvas');
        let width = img.width;
        let height = img.height;

        if (width > maxWidth) {
          height = (height * maxWidth) / width;
          width = maxWidth;
        }

        canvas.width = width;
        canvas.height = height;

        const ctx = canvas.getContext('2d');
        if (!ctx) return reject('Canvas not supported');
        ctx.drawImage(img, 0, 0, width, height);

        const base64 = canvas.toDataURL('image/jpeg', quality);
        resolve(base64);
      };
      img.onerror = reject;
      img.src = e.target?.result as string;
    };
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
};

const AdminDashboard = () => {
  const [activeTab, setActiveTab] = useState<'products' | 'contacts'>('products');
  const [products, setProducts] = useState<Product[]>([]);
  const [contacts, setContacts] = useState<ContactLead[]>([]);
  const [loading, setLoading] = useState(true);

  // Add product form state
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  // Edit product state
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [editTitle, setEditTitle] = useState('');
  const [editDescription, setEditDescription] = useState('');
  const [editImageFile, setEditImageFile] = useState<File | null>(null);
  const [editImagePreview, setEditImagePreview] = useState<string | null>(null);
  const [editSubmitting, setEditSubmitting] = useState(false);

  const navigate = useNavigate();

  useEffect(() => {
    fetchProducts();
    fetchContacts();
  }, []);

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

  const fetchContacts = async () => {
    try {
      const q = query(collection(db, 'contacts'), orderBy('createdAt', 'desc'));
      const snapshot = await getDocs(q);
      const contactsList = snapshot.docs.map(docSnap => ({
        id: docSnap.id,
        ...docSnap.data()
      })) as ContactLead[];
      setContacts(contactsList);
    } catch (error) {
      console.error('Error fetching contacts:', error);
    }
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        alert('Image must be less than 5MB');
        return;
      }
      setImageFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleAddProduct = async (e: FormEvent) => {
    e.preventDefault();
    if (!imageFile) return alert('Please select an image');

    setSubmitting(true);
    try {
      const imageBase64 = await compressImage(imageFile);
      await addDoc(collection(db, 'products'), {
        title,
        description,
        imageBase64,
        createdAt: Timestamp.now()
      });

      setTitle('');
      setDescription('');
      setImageFile(null);
      setImagePreview(null);
      const fileInput = document.getElementById('productImage') as HTMLInputElement;
      if (fileInput) fileInput.value = '';

      await fetchProducts();
      alert('Product added successfully!');
    } catch (error) {
      console.error('Error adding product:', error);
      alert('Error adding product. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  // --- Edit handlers ---
  const openEditModal = (product: Product) => {
    setEditingProduct(product);
    setEditTitle(product.title);
    setEditDescription(product.description);
    setEditImagePreview(product.imageBase64);
    setEditImageFile(null);
  };

  const closeEditModal = () => {
    setEditingProduct(null);
    setEditTitle('');
    setEditDescription('');
    setEditImageFile(null);
    setEditImagePreview(null);
  };

  const handleEditImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        alert('Image must be less than 5MB');
        return;
      }
      setEditImageFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setEditImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleEditProduct = async (e: FormEvent) => {
    e.preventDefault();
    if (!editingProduct) return;

    setEditSubmitting(true);
    try {
      const updateData: Record<string, string> = {
        title: editTitle,
        description: editDescription,
      };

      // If a new image was selected, compress and update
      if (editImageFile) {
        updateData.imageBase64 = await compressImage(editImageFile);
      }

      await updateDoc(doc(db, 'products', editingProduct.id), updateData);
      closeEditModal();
      await fetchProducts();
      alert('Product updated successfully!');
    } catch (error) {
      console.error('Error updating product:', error);
      alert('Error updating product. Please try again.');
    } finally {
      setEditSubmitting(false);
    }
  };

  const handleDeleteProduct = async (product: Product) => {
    if (!confirm('Are you sure you want to delete this product?')) return;

    try {
      await deleteDoc(doc(db, 'products', product.id));
      await fetchProducts();
    } catch (error) {
      console.error('Error deleting product:', error);
      alert('Error deleting product');
    }
  };

  const handleDeleteContact = async (contactId: string) => {
    if (!confirm('Are you sure you want to delete this inquiry?')) return;

    try {
      await deleteDoc(doc(db, 'contacts', contactId));
      await fetchContacts();
    } catch (error) {
      console.error('Error deleting contact:', error);
    }
  };

  const handleLogout = async () => {
    await signOut(auth);
    navigate('/admin/login');
  };

  const formatDate = (timestamp: Timestamp) => {
    if (!timestamp?.toDate) return 'N/A';
    return timestamp.toDate().toLocaleDateString('en-IN', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className={styles.dashboard}>
      {/* Sidebar */}
      <aside className={styles.sidebar}>
        <div className={styles.sidebarLogo}>
          <a href="/">
            <img src="/prisha-logo.png" alt="Prisha Lifecare" className={styles.logoImg} />
          </a>
          <span className={styles.adminBadge}>Admin</span>
        </div>

        <nav className={styles.sidebarNav}>
          <button
            className={`${styles.navItem} ${activeTab === 'products' ? styles.active : ''}`}
            onClick={() => setActiveTab('products')}
          >
            📦 Products
          </button>
          <button
            className={`${styles.navItem} ${activeTab === 'contacts' ? styles.active : ''}`}
            onClick={() => setActiveTab('contacts')}
          >
            📩 Contact Inquiries
            {contacts.length > 0 && (
              <span className={styles.badge}>{contacts.length}</span>
            )}
          </button>
        </nav>

        <div className={styles.sidebarFooter}>
          <a href="/" className={styles.viewSiteLink}>🌐 View Website</a>
          <button className={styles.logoutBtn} onClick={handleLogout}>
            🚪 Logout
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className={styles.mainContent}>
        {activeTab === 'products' && (
          <div>
            <div className={styles.pageHeader}>
              <h1>Products Management</h1>
              <p>Add, view and manage your product catalog</p>
            </div>

            {/* Add Product Form */}
            <div className={styles.card}>
              <h2 className={styles.cardTitle}>Add New Product</h2>
              <form onSubmit={handleAddProduct} className={styles.productForm}>
                <div className={styles.formRow}>
                  <div className={styles.formGroup}>
                    <label htmlFor="productTitle">Product Title</label>
                    <input
                      type="text"
                      id="productTitle"
                      value={title}
                      onChange={(e) => setTitle(e.target.value)}
                      placeholder="e.g. Amoxicillin 500mg"
                      required
                    />
                  </div>
                  <div className={styles.formGroup}>
                    <label htmlFor="productImage">Product Image (max 5MB)</label>
                    <input
                      type="file"
                      id="productImage"
                      accept="image/*"
                      onChange={handleImageChange}
                      required
                    />
                  </div>
                </div>

                <div className={styles.formGroup}>
                  <label htmlFor="productDesc">Description</label>
                  <textarea
                    id="productDesc"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder="Brief product description..."
                    rows={3}
                    required
                  />
                </div>

                {imagePreview && (
                  <div className={styles.imagePreview}>
                    <img src={imagePreview} alt="Preview" />
                  </div>
                )}

                <button type="submit" className={styles.submitBtn} disabled={submitting}>
                  {submitting ? 'Uploading...' : '+ Add Product'}
                </button>
              </form>
            </div>

            {/* Products List */}
            <div className={styles.card}>
              <h2 className={styles.cardTitle}>
                All Products
                <span className={styles.countBadge}>{products.length}</span>
              </h2>

              {loading ? (
                <p className={styles.emptyState}>Loading products...</p>
              ) : products.length === 0 ? (
                <p className={styles.emptyState}>No products added yet. Add your first product above!</p>
              ) : (
                <div className={styles.productsGrid}>
                  {products.map((product) => (
                    <div key={product.id} className={styles.productCard}>
                      <div className={styles.productImage}>
                        <img src={product.imageBase64} alt={product.title} />
                      </div>
                      <div className={styles.productInfo}>
                        <h3>{product.title}</h3>
                        <p>{product.description}</p>
                        <span className={styles.date}>{formatDate(product.createdAt)}</span>
                      </div>
                      <div className={styles.productActions}>
                        <button
                          className={styles.editBtn}
                          onClick={() => openEditModal(product)}
                          title="Edit product"
                        >
                          ✏️
                        </button>
                        <button
                          className={styles.deleteBtn}
                          onClick={() => handleDeleteProduct(product)}
                          title="Delete product"
                        >
                          🗑️
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

        {activeTab === 'contacts' && (
          <div>
            <div className={styles.pageHeader}>
              <h1>Contact Inquiries</h1>
              <p>View messages submitted through the contact form</p>
            </div>

            <div className={styles.card}>
              {contacts.length === 0 ? (
                <p className={styles.emptyState}>No contact inquiries yet.</p>
              ) : (
                <div className={styles.contactsList}>
                  {contacts.map((contact) => (
                    <div key={contact.id} className={styles.contactCard}>
                      <div className={styles.contactHeader}>
                        <div>
                          <h3>{contact.name}</h3>
                          <a href={`mailto:${contact.email}`} className={styles.contactEmail}>
                            {contact.email}
                          </a>
                        </div>
                        <div className={styles.contactActions}>
                          <span className={styles.date}>{formatDate(contact.createdAt)}</span>
                          <button
                            className={styles.deleteBtn}
                            onClick={() => handleDeleteContact(contact.id)}
                            title="Delete inquiry"
                          >
                            🗑️
                          </button>
                        </div>
                      </div>
                      <div className={styles.contactBody}>
                        <p className={styles.contactSubject}><strong>Subject:</strong> {contact.subject}</p>
                        <p className={styles.contactMessage}>{contact.message}</p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}
      </main>

      {/* Edit Product Modal */}
      {editingProduct && (
        <div className={styles.modalOverlay} onClick={closeEditModal}>
          <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
            <div className={styles.modalHeader}>
              <h2>Edit Product</h2>
              <button className={styles.modalClose} onClick={closeEditModal}>✕</button>
            </div>

            <form onSubmit={handleEditProduct} className={styles.productForm}>
              <div className={styles.formGroup}>
                <label htmlFor="editTitle">Product Title</label>
                <input
                  type="text"
                  id="editTitle"
                  value={editTitle}
                  onChange={(e) => setEditTitle(e.target.value)}
                  placeholder="Product title"
                  required
                />
              </div>

              <div className={styles.formGroup}>
                <label htmlFor="editDesc">Description</label>
                <textarea
                  id="editDesc"
                  value={editDescription}
                  onChange={(e) => setEditDescription(e.target.value)}
                  placeholder="Product description..."
                  rows={3}
                  required
                />
              </div>

              <div className={styles.formGroup}>
                <label htmlFor="editImage">Change Image (optional)</label>
                <input
                  type="file"
                  id="editImage"
                  accept="image/*"
                  onChange={handleEditImageChange}
                />
              </div>

              {editImagePreview && (
                <div className={styles.imagePreview}>
                  <img src={editImagePreview} alt="Preview" />
                </div>
              )}

              <div className={styles.modalActions}>
                <button type="button" className={styles.cancelBtn} onClick={closeEditModal}>
                  Cancel
                </button>
                <button type="submit" className={styles.submitBtn} disabled={editSubmitting}>
                  {editSubmitting ? 'Saving...' : 'Save Changes'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminDashboard;
