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
  imageBase64?: string;
  images?: string[];
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

interface ProductInquiry {
  id: string;
  productName: string;
  name: string;
  email: string;
  phone: string;
  message: string;
  createdAt: Timestamp;
}

/** Get images array from product (backward compatible) */
const getProductImages = (product: Product): string[] => {
  if (product.images && product.images.length > 0) return product.images;
  if (product.imageBase64) return [product.imageBase64];
  return [];
};

const compressImage = (file: File, maxWidth = 800, quality = 0.65): Promise<string> => {
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
        resolve(canvas.toDataURL('image/jpeg', quality));
      };
      img.onerror = reject;
      img.src = e.target?.result as string;
    };
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
};

const AdminDashboard = () => {
  const [activeTab, setActiveTab] = useState<'products' | 'inquiries' | 'contacts'>('products');
  const [products, setProducts] = useState<Product[]>([]);
  const [contacts, setContacts] = useState<ContactLead[]>([]);
  const [inquiries, setInquiries] = useState<ProductInquiry[]>([]);
  const [loading, setLoading] = useState(true);

  // Add product form
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [imageFiles, setImageFiles] = useState<File[]>([]);
  const [imagePreviews, setImagePreviews] = useState<string[]>([]);
  const [submitting, setSubmitting] = useState(false);

  // Edit product
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [editTitle, setEditTitle] = useState('');
  const [editDescription, setEditDescription] = useState('');
  const [editExistingImages, setEditExistingImages] = useState<string[]>([]);
  const [editNewFiles, setEditNewFiles] = useState<File[]>([]);
  const [editNewPreviews, setEditNewPreviews] = useState<string[]>([]);
  const [editSubmitting, setEditSubmitting] = useState(false);

  const navigate = useNavigate();

  useEffect(() => { fetchProducts(); fetchContacts(); fetchInquiries(); }, []);

  const fetchProducts = async () => {
    try {
      const q = query(collection(db, 'products'), orderBy('createdAt', 'desc'));
      const snapshot = await getDocs(q);
      setProducts(snapshot.docs.map(d => ({ id: d.id, ...d.data() })) as Product[]);
    } catch (e) { console.error('Error fetching products:', e); }
    finally { setLoading(false); }
  };

  const fetchContacts = async () => {
    try {
      const q = query(collection(db, 'contacts'), orderBy('createdAt', 'desc'));
      const snapshot = await getDocs(q);
      setContacts(snapshot.docs.map(d => ({ id: d.id, ...d.data() })) as ContactLead[]);
    } catch (e) { console.error('Error fetching contacts:', e); }
  };

  const fetchInquiries = async () => {
    try {
      const q = query(collection(db, 'product_inquiries'), orderBy('createdAt', 'desc'));
      const snapshot = await getDocs(q);
      setInquiries(snapshot.docs.map(d => ({ id: d.id, ...d.data() })) as ProductInquiry[]);
    } catch (e) { console.error('Error fetching inquiries:', e); }
  };

  const handleDeleteInquiry = async (id: string) => {
    if (!confirm('Delete this inquiry?')) return;
    try { await deleteDoc(doc(db, 'product_inquiries', id)); await fetchInquiries(); }
    catch (e) { console.error(e); }
  };

  // --- Multi Image Handlers ---
  const handleImagesChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    const validFiles = files.filter(f => f.size <= 5 * 1024 * 1024);
    if (validFiles.length !== files.length) alert('Some images exceeded 5MB and were skipped');
    setImageFiles(prev => [...prev, ...validFiles]);
    validFiles.forEach(file => {
      const reader = new FileReader();
      reader.onloadend = () => setImagePreviews(prev => [...prev, reader.result as string]);
      reader.readAsDataURL(file);
    });
  };

  const removePreview = (index: number) => {
    setImageFiles(prev => prev.filter((_, i) => i !== index));
    setImagePreviews(prev => prev.filter((_, i) => i !== index));
  };

  const handleAddProduct = async (e: FormEvent) => {
    e.preventDefault();
    if (imageFiles.length === 0) return alert('Please select at least one image');
    setSubmitting(true);
    try {
      const images = await Promise.all(imageFiles.map(f => compressImage(f)));
      await addDoc(collection(db, 'products'), {
        title, description, images,
        imageBase64: images[0],
        createdAt: Timestamp.now()
      });
      setTitle(''); setDescription(''); setImageFiles([]); setImagePreviews([]);
      const fileInput = document.getElementById('productImage') as HTMLInputElement;
      if (fileInput) fileInput.value = '';
      await fetchProducts();
      alert('Product added successfully!');
    } catch (e) { console.error(e); alert('Error adding product.'); }
    finally { setSubmitting(false); }
  };

  // --- Edit ---
  const openEditModal = (product: Product) => {
    setEditingProduct(product);
    setEditTitle(product.title);
    setEditDescription(product.description);
    setEditExistingImages(getProductImages(product));
    setEditNewFiles([]); setEditNewPreviews([]);
  };

  const closeEditModal = () => {
    setEditingProduct(null);
    setEditTitle(''); setEditDescription('');
    setEditExistingImages([]); setEditNewFiles([]); setEditNewPreviews([]);
  };

  const removeExistingImage = (index: number) => {
    setEditExistingImages(prev => prev.filter((_, i) => i !== index));
  };

  const handleEditImagesChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    const validFiles = files.filter(f => f.size <= 5 * 1024 * 1024);
    setEditNewFiles(prev => [...prev, ...validFiles]);
    validFiles.forEach(file => {
      const reader = new FileReader();
      reader.onloadend = () => setEditNewPreviews(prev => [...prev, reader.result as string]);
      reader.readAsDataURL(file);
    });
  };

  const removeEditNewPreview = (index: number) => {
    setEditNewFiles(prev => prev.filter((_, i) => i !== index));
    setEditNewPreviews(prev => prev.filter((_, i) => i !== index));
  };

  const handleEditProduct = async (e: FormEvent) => {
    e.preventDefault();
    if (!editingProduct) return;
    const allImages = [...editExistingImages];
    if (allImages.length === 0 && editNewFiles.length === 0) return alert('Product must have at least one image');
    setEditSubmitting(true);
    try {
      if (editNewFiles.length > 0) {
        const newCompressed = await Promise.all(editNewFiles.map(f => compressImage(f)));
        allImages.push(...newCompressed);
      }
      await updateDoc(doc(db, 'products', editingProduct.id), {
        title: editTitle, description: editDescription,
        images: allImages, imageBase64: allImages[0]
      });
      closeEditModal(); await fetchProducts();
      alert('Product updated successfully!');
    } catch (e) { console.error(e); alert('Error updating product.'); }
    finally { setEditSubmitting(false); }
  };

  const handleDeleteProduct = async (product: Product) => {
    if (!confirm('Delete this product?')) return;
    try { await deleteDoc(doc(db, 'products', product.id)); await fetchProducts(); }
    catch (e) { console.error(e); }
  };

  const handleDeleteContact = async (id: string) => {
    if (!confirm('Delete this message?')) return;
    try { await deleteDoc(doc(db, 'contacts', id)); await fetchContacts(); }
    catch (e) { console.error(e); }
  };

  const handleLogout = async () => { await signOut(auth); navigate('/admin/login'); };

  const formatDate = (ts: Timestamp) => {
    if (!ts?.toDate) return 'N/A';
    return ts.toDate().toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' });
  };

  return (
    <div className={styles.dashboard}>
      <aside className={styles.sidebar}>
        <div className={styles.sidebarLogo}>
          <a href="/"><img src="/prisha-logo.png" alt="Prisha Lifecare" className={styles.logoImg} /></a>
          <span className={styles.adminBadge}>Admin</span>
        </div>
        <nav className={styles.sidebarNav}>
          <button className={`${styles.navItem} ${activeTab === 'products' ? styles.active : ''}`} onClick={() => setActiveTab('products')}>📦 Products</button>
          <button className={`${styles.navItem} ${activeTab === 'inquiries' ? styles.active : ''}`} onClick={() => setActiveTab('inquiries')}>
            📦 Product Inquiries {inquiries.length > 0 && <span className={styles.badge}>{inquiries.length}</span>}
          </button>
          <button className={`${styles.navItem} ${activeTab === 'contacts' ? styles.active : ''}`} onClick={() => setActiveTab('contacts')}>
            📩 Contact Messages {contacts.length > 0 && <span className={styles.badge}>{contacts.length}</span>}
          </button>
        </nav>
        <div className={styles.sidebarFooter}>
          <a href="/" className={styles.viewSiteLink}>🌐 View Website</a>
          <button className={styles.logoutBtn} onClick={handleLogout}>🚪 Logout</button>
        </div>
      </aside>

      <main className={styles.mainContent}>
        {activeTab === 'products' && (
          <div>
            <div className={styles.pageHeader}>
              <h1>Products Management</h1>
              <p>Add, view and manage your product catalog</p>
            </div>

            <div className={styles.card}>
              <h2 className={styles.cardTitle}>Add New Product</h2>
              <form onSubmit={handleAddProduct} className={styles.productForm}>
                <div className={styles.formRow}>
                  <div className={styles.formGroup}>
                    <label htmlFor="productTitle">Product Title</label>
                    <input type="text" id="productTitle" value={title} onChange={(e) => setTitle(e.target.value)} placeholder="e.g. Amoxicillin 500mg" required />
                  </div>
                  <div className={styles.formGroup}>
                    <label htmlFor="productImage">Product Images (max 5MB each)</label>
                    <input type="file" id="productImage" accept="image/*" multiple onChange={handleImagesChange} />
                  </div>
                </div>
                <div className={styles.formGroup}>
                  <label htmlFor="productDesc">Description</label>
                  <textarea id="productDesc" value={description} onChange={(e) => setDescription(e.target.value)} placeholder="Brief product description..." rows={3} required />
                </div>
                {imagePreviews.length > 0 && (
                  <div className={styles.imagePreviewGrid}>
                    {imagePreviews.map((preview, i) => (
                      <div key={i} className={styles.previewItem}>
                        <img src={preview} alt={`Preview ${i + 1}`} />
                        <button type="button" className={styles.removePreviewBtn} onClick={() => removePreview(i)}>✕</button>
                      </div>
                    ))}
                  </div>
                )}
                <button type="submit" className={styles.submitBtn} disabled={submitting}>
                  {submitting ? 'Compressing & Uploading...' : '+ Add Product'}
                </button>
              </form>
            </div>

            <div className={styles.card}>
              <h2 className={styles.cardTitle}>All Products <span className={styles.countBadge}>{products.length}</span></h2>
              {loading ? <p className={styles.emptyState}>Loading...</p> : products.length === 0 ? <p className={styles.emptyState}>No products yet.</p> : (
                <div className={styles.productsGrid}>
                  {products.map((product) => {
                    const imgs = getProductImages(product);
                    return (
                      <div key={product.id} className={styles.productCard}>
                        <div className={styles.productImage}>
                          <img src={imgs[0]} alt={product.title} />
                          {imgs.length > 1 && <span className={styles.imgCount}>📷 {imgs.length}</span>}
                        </div>
                        <div className={styles.productInfo}>
                          <h3>{product.title}</h3>
                          <p>{product.description}</p>
                          <span className={styles.date}>{formatDate(product.createdAt)}</span>
                        </div>
                        <div className={styles.productActions}>
                          <button className={styles.editBtn} onClick={() => openEditModal(product)} title="Edit">✏️</button>
                          <button className={styles.deleteBtn} onClick={() => handleDeleteProduct(product)} title="Delete">🗑️</button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </div>
        )}

        {activeTab === 'inquiries' && (
          <div>
            <div className={styles.pageHeader}><h1>Product Inquiries</h1><p>Inquiries from users interested in specific products</p></div>
            <div className={styles.card}>
              {inquiries.length === 0 ? <p className={styles.emptyState}>No product inquiries yet.</p> : (
                <div className={styles.contactsList}>
                  {inquiries.map((inq) => (
                    <div key={inq.id} className={styles.contactCard}>
                      <div className={styles.contactHeader}>
                        <div>
                          <h3>{inq.name}</h3>
                          <div className={styles.inquiryMeta}>
                            <a href={`mailto:${inq.email}`} className={styles.contactEmail}>{inq.email}</a>
                            <span className={styles.phoneBadge}>📞 {inq.phone}</span>
                          </div>
                        </div>
                        <div className={styles.contactActions}>
                          <span className={styles.date}>{formatDate(inq.createdAt)}</span>
                          <button className={styles.deleteBtn} onClick={() => handleDeleteInquiry(inq.id)} title="Delete">🗑️</button>
                        </div>
                      </div>
                      <div className={styles.contactBody}>
                        <span className={styles.productTag}>📦 {inq.productName}</span>
                        {inq.message && <p className={styles.contactMessage}>{inq.message}</p>}
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
            <div className={styles.pageHeader}><h1>Contact Messages</h1><p>Messages from the contact form</p></div>
            <div className={styles.card}>
              {contacts.length === 0 ? <p className={styles.emptyState}>No messages yet.</p> : (
                <div className={styles.contactsList}>
                  {contacts.map((c) => (
                    <div key={c.id} className={styles.contactCard}>
                      <div className={styles.contactHeader}>
                        <div>
                          <h3>{c.name}</h3>
                          <a href={`mailto:${c.email}`} className={styles.contactEmail}>{c.email}</a>
                        </div>
                        <div className={styles.contactActions}>
                          <span className={styles.date}>{formatDate(c.createdAt)}</span>
                          <button className={styles.deleteBtn} onClick={() => handleDeleteContact(c.id)} title="Delete">🗑️</button>
                        </div>
                      </div>
                      <div className={styles.contactBody}>
                        <p className={styles.contactSubject}><strong>Subject:</strong> {c.subject}</p>
                        <p className={styles.contactMessage}>{c.message}</p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}
      </main>

      {/* Edit Modal */}
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
                <input type="text" id="editTitle" value={editTitle} onChange={(e) => setEditTitle(e.target.value)} required />
              </div>
              <div className={styles.formGroup}>
                <label htmlFor="editDesc">Description</label>
                <textarea id="editDesc" value={editDescription} onChange={(e) => setEditDescription(e.target.value)} rows={3} required />
              </div>

              {editExistingImages.length > 0 && (
                <div className={styles.formGroup}>
                  <label>Current Images</label>
                  <div className={styles.imagePreviewGrid}>
                    {editExistingImages.map((img, i) => (
                      <div key={i} className={styles.previewItem}>
                        <img src={img} alt={`Image ${i + 1}`} />
                        <button type="button" className={styles.removePreviewBtn} onClick={() => removeExistingImage(i)}>✕</button>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              <div className={styles.formGroup}>
                <label htmlFor="editImages">Add More Images</label>
                <input type="file" id="editImages" accept="image/*" multiple onChange={handleEditImagesChange} />
              </div>
              {editNewPreviews.length > 0 && (
                <div className={styles.imagePreviewGrid}>
                  {editNewPreviews.map((preview, i) => (
                    <div key={i} className={styles.previewItem}>
                      <img src={preview} alt={`New ${i + 1}`} />
                      <button type="button" className={styles.removePreviewBtn} onClick={() => removeEditNewPreview(i)}>✕</button>
                    </div>
                  ))}
                </div>
              )}

              <div className={styles.modalActions}>
                <button type="button" className={styles.cancelBtn} onClick={closeEditModal}>Cancel</button>
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
