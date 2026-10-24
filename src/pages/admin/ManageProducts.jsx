import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { getAllProductsAdmin, deleteProduct, updateProduct, getAllCategories, createProduct } from '../../services/adminProducts'
import { uploadProductImage, deleteProductImage } from '../../services/imageUpload'

export default function ManageProducts() {
  const [products, setProducts] = useState([])
  const [categories, setCategories] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [showForm, setShowForm] = useState(false)
  const [editingProduct, setEditingProduct] = useState(null)
  const [imageFile, setImageFile] = useState(null)
  const [imagePreview, setImagePreview] = useState(null)
  const [uploading, setUploading] = useState(false)
  const [formData, setFormData] = useState({
    name: '',
    slug: '',
    description: '',
    price: '',
    stock_quantity: '',
    image_url: '',
    category_id: '',
    is_active: true
  })

  useEffect(() => {
    loadData()
  }, [])

  async function loadData() {
    try {
      const [productsData, categoriesData] = await Promise.all([
        getAllProductsAdmin(),
        getAllCategories()
      ])
      setProducts(productsData)
      setCategories(categoriesData)
    } catch (err) {
      setError('Failed to load data')
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  function generateSlug(name) {
    return name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '')
  }

  function handleNameChange(name) {
    setFormData(prev => ({
      ...prev,
      name,
      slug: generateSlug(name)
    }))
  }

  function handleImageFileChange(e) {
    const file = e.target.files[0]
    if (file) {
      setImageFile(file)
      setImagePreview(URL.createObjectURL(file))
      setFormData(prev => ({ ...prev, image_url: '' })) // Clear URL if file is selected
    }
  }

  function handleImageUrlChange(url) {
    setFormData(prev => ({ ...prev, image_url: url }))
    setImageFile(null)
    setImagePreview(null)
  }

  function openCreateForm() {
    setEditingProduct(null)
    setFormData({
      name: '',
      slug: '',
      description: '',
      price: '',
      stock_quantity: '',
      image_url: '',
      category_id: categories[0]?.id || '',
      is_active: true
    })
    setImageFile(null)
    setImagePreview(null)
    setShowForm(true)
  }

  function openEditForm(product) {
    setEditingProduct(product)
    setFormData({
      name: product.name,
      slug: product.slug,
      description: product.description || '',
      price: product.price,
      stock_quantity: product.stock_quantity,
      image_url: product.image_url || '',
      category_id: product.category_id,
      is_active: product.is_active
    })
    setImageFile(null)
    setImagePreview(product.image_url)
    setShowForm(true)
  }

  async function handleSubmit(e) {
    e.preventDefault()
    setUploading(true)
    
    try {
      let finalImageUrl = formData.image_url

      // If a new file was uploaded, upload it first
      if (imageFile) {
        finalImageUrl = await uploadProductImage(imageFile)
      }

      // If no image at all, use a placeholder
      if (!finalImageUrl) {
        finalImageUrl = 'https://via.placeholder.com/500x500?text=No+Image'
      }
      
      const productData = {
        ...formData,
        image_url: finalImageUrl,
        price: parseFloat(formData.price),
        stock_quantity: parseInt(formData.stock_quantity),
        category_id: parseInt(formData.category_id)
      }

      if (editingProduct) {
        // If editing and image changed, delete old image
        if (imageFile && editingProduct.image_url && editingProduct.image_url.includes('product-images')) {
          await deleteProductImage(editingProduct.image_url)
        }
        
        await updateProduct(editingProduct.id, productData)
        alert('Product updated successfully!')
      } else {
        await createProduct(productData)
        alert('Product created successfully!')
      }
      
      setShowForm(false)
      setImageFile(null)
      setImagePreview(null)
      await loadData()
    } catch (err) {
      alert(`Failed to save product: ${err.message}`)
      console.error(err)
    } finally {
      setUploading(false)
    }
  }

  async function handleDelete(id, name, imageUrl) {
    if (!confirm(`Are you sure you want to delete "${name}"?`)) return
    
    try {
      // Delete image from storage if it exists
      if (imageUrl && imageUrl.includes('product-images')) {
        await deleteProductImage(imageUrl)
      }
      
      await deleteProduct(id)
      setProducts(prev => prev.filter(p => p.id !== id))
      alert('Product deleted')
    } catch (err) {
      alert('Failed to delete product')
      console.error(err)
    }
  }

  async function toggleActive(product) {
    try {
      await updateProduct(product.id, { is_active: !product.is_active })
      setProducts(prev =>
        prev.map(p => p.id === product.id ? { ...p, is_active: !p.is_active } : p)
      )
    } catch (err) {
      alert('Failed to update product')
      console.error(err)
    }
  }

  if (loading) {
    return <div style={{ padding: '2rem', textAlign: 'center' }}>Loading products...</div>
  }

  if (error) {
    return <div style={{ padding: '2rem', textAlign: 'center', color: 'red' }}>{error}</div>
  }

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <h1 style={styles.title}>Manage Products</h1>
        <div style={styles.headerActions}>
          <Link to="/admin" style={styles.backLink}>← Back to Dashboard</Link>
          <button onClick={openCreateForm} style={styles.addButton}>
            + Add New Product
          </button>
        </div>
      </div>

      {showForm && (
        <div style={styles.formOverlay}>
          <div style={styles.formCard}>
            <h2 style={styles.formTitle}>
              {editingProduct ? 'Edit Product' : 'Create New Product'}
            </h2>
            <form onSubmit={handleSubmit} style={styles.form}>
              <div style={styles.field}>
                <label style={styles.label}>Product Name *</label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => handleNameChange(e.target.value)}
                  style={styles.input}
                  required
                />
              </div>

              <div style={styles.field}>
                <label style={styles.label}>Slug (URL-friendly name) *</label>
                <input
                  type="text"
                  value={formData.slug}
                  onChange={(e) => setFormData(prev => ({ ...prev, slug: e.target.value }))}
                  style={styles.input}
                  required
                />
              </div>

              <div style={styles.field}>
                <label style={styles.label}>Category *</label>
                <select
                  value={formData.category_id}
                  onChange={(e) => setFormData(prev => ({ ...prev, category_id: e.target.value }))}
                  style={styles.input}
                  required
                >
                  <option value="">Select a category</option>
                  {categories.map(cat => (
                    <option key={cat.id} value={cat.id}>{cat.name}</option>
                  ))}
                </select>
              </div>

              <div style={styles.field}>
                <label style={styles.label}>Price (₦) *</label>
                <input
                  type="number"
                  value={formData.price}
                  onChange={(e) => setFormData(prev => ({ ...prev, price: e.target.value }))}
                  style={styles.input}
                  min="0"
                  step="0.01"
                  required
                />
              </div>

              <div style={styles.field}>
                <label style={styles.label}>Stock Quantity *</label>
                <input
                  type="number"
                  value={formData.stock_quantity}
                  onChange={(e) => setFormData(prev => ({ ...prev, stock_quantity: e.target.value }))}
                  style={styles.input}
                  min="0"
                  required
                />
              </div>

              <div style={styles.field}>
                <label style={styles.label}>Product Image</label>
                
                {imagePreview && (
                  <div style={styles.imagePreview}>
                    <img src={imagePreview} alt="Preview" style={styles.previewImage} />
                  </div>
                )}

                <div style={styles.imageOptions}>
                  <div style={styles.imageOption}>
                    <label style={styles.radioLabel}>
                      <input
                        type="radio"
                        name="imageType"
                        value="upload"
                        checked={imageFile !== null}
                        onChange={() => {
                          setFormData(prev => ({ ...prev, image_url: '' }))
                        }}
                      />
                      Upload from computer
                    </label>
                    <input
                      type="file"
                      accept="image/jpeg,image/png,image/webp,image/gif"
                      onChange={handleImageFileChange}
                      style={styles.fileInput}
                    />
                    <p style={styles.hint}>Max 5MB. JPEG, PNG, WebP, or GIF</p>
                  </div>

                  <div style={styles.imageOption}>
                    <label style={styles.radioLabel}>
                      <input
                        type="radio"
                        name="imageType"
                        value="url"
                        checked={formData.image_url !== '' && imageFile === null}
                        onChange={() => {
                          setImageFile(null)
                          setImagePreview(null)
                        }}
                      />
                      Use image URL
                    </label>
                    <input
                      type="url"
                      value={formData.image_url}
                      onChange={(e) => handleImageUrlChange(e.target.value)}
                      style={styles.input}
                      placeholder="https://example.com/image.jpg"
                      disabled={imageFile !== null}
                    />
                  </div>
                </div>
              </div>

              <div style={styles.field}>
                <label style={styles.label}>Description</label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                  style={styles.textarea}
                  rows="4"
                />
              </div>

              <div style={styles.checkboxField}>
                <input
                  type="checkbox"
                  id="is_active"
                  checked={formData.is_active}
                  onChange={(e) => setFormData(prev => ({ ...prev, is_active: e.target.checked }))}
                />
                <label htmlFor="is_active">Active (visible to customers)</label>
              </div>

              <div style={styles.formActions}>
                <button type="button" onClick={() => setShowForm(false)} style={styles.cancelButton}>
                  Cancel
                </button>
                <button 
                  type="submit" 
                  style={styles.submitButton}
                  disabled={uploading}
                >
                  {uploading ? 'Uploading...' : (editingProduct ? 'Update Product' : 'Create Product')}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <div style={styles.productList}>
        {products.length === 0 ? (
          <div style={styles.empty}>No products found. Click "Add New Product" to create one.</div>
        ) : (
          products.map(product => (
            <div key={product.id} style={styles.productCard}>
              <img
                src={product.image_url}
                alt={product.name}
                style={styles.productImage}
              />
              <div style={styles.productInfo}>
                <h3 style={styles.productName}>{product.name}</h3>
                <p style={styles.category}>{product.categories?.name}</p>
                <p style={styles.price}>₦{product.price.toLocaleString('en-NG')}</p>
                <p style={styles.stock}>Stock: {product.stock_quantity}</p>
                <p style={{ ...styles.status, color: product.is_active ? 'green' : 'red' }}>
                  {product.is_active ? '✓ Active' : '✗ Inactive'}
                </p>
              </div>
              <div style={styles.productActions}>
                <button onClick={() => openEditForm(product)} style={styles.editButton}>
                  Edit
                </button>
                <button onClick={() => toggleActive(product)} style={styles.toggleButton}>
                  {product.is_active ? 'Deactivate' : 'Activate'}
                </button>
                <button onClick={() => handleDelete(product.id, product.name, product.image_url)} style={styles.deleteButton}>
                  Delete
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  )
}

const styles = {
  container: { padding: '2rem', maxWidth: '1200px', margin: '0 auto' },
  header: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' },
  title: { fontSize: '2rem', color: '#333' },
  headerActions: { display: 'flex', gap: '1rem', alignItems: 'center' },
  backLink: { color: '#2563eb', textDecoration: 'none' },
  addButton: {
    padding: '0.75rem 1.5rem',
    backgroundColor: '#2563eb',
    color: 'white',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer',
    fontWeight: '600'
  },
  formOverlay: {
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0,0,0,0.5)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 1000,
    padding: '1rem'
  },
  formCard: {
    backgroundColor: 'white',
    padding: '2rem',
    borderRadius: '8px',
    maxWidth: '600px',
    width: '100%',
    maxHeight: '90vh',
    overflowY: 'auto'
  },
  formTitle: { marginBottom: '1.5rem' },
  form: { display: 'flex', flexDirection: 'column', gap: '1rem' },
  field: { display: 'flex', flexDirection: 'column', gap: '0.5rem' },
  label: { fontWeight: '600' },
  input: {
    padding: '0.75rem',
    border: '1px solid #ddd',
    borderRadius: '4px',
    fontSize: '1rem'
  },
  textarea: {
    padding: '0.75rem',
    border: '1px solid #ddd',
    borderRadius: '4px',
    fontSize: '1rem',
    fontFamily: 'inherit',
    resize: 'vertical'
  },
  imagePreview: {
    marginBottom: '1rem',
    border: '1px solid #ddd',
    borderRadius: '4px',
    overflow: 'hidden'
  },
  previewImage: {
    width: '100%',
    maxHeight: '300px',
    objectFit: 'contain',
    display: 'block'
  },
  imageOptions: {
    display: 'flex',
    flexDirection: 'column',
    gap: '1rem'
  },
  imageOption: {
    padding: '1rem',
    border: '1px solid #ddd',
    borderRadius: '4px'
  },
  radioLabel: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.5rem',
    marginBottom: '0.5rem',
    cursor: 'pointer'
  },
  fileInput: {
    marginTop: '0.5rem'
  },
  hint: {
    fontSize: '0.85rem',
    color: '#666',
    marginTop: '0.25rem'
  },
  checkboxField: { display: 'flex', alignItems: 'center', gap: '0.5rem' },
  formActions: { display: 'flex', gap: '1rem', justifyContent: 'flex-end', marginTop: '1rem' },
  cancelButton: {
    padding: '0.75rem 1.5rem',
    backgroundColor: '#f3f4f6',
    border: '1px solid #ddd',
    borderRadius: '4px',
    cursor: 'pointer'
  },
  submitButton: {
    padding: '0.75rem 1.5rem',
    backgroundColor: '#2563eb',
    color: 'white',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer',
    fontWeight: '600'
  },
  productList: { display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '1.5rem' },
  productCard: {
    backgroundColor: 'white',
    borderRadius: '8px',
    overflow: 'hidden',
    boxShadow: '0 2px 5px rgba(0,0,0,0.1)',
    border: '1px solid #e5e7eb'
  },
  productImage: { width: '100%', height: '200px', objectFit: 'cover' },
  productInfo: { padding: '1rem' },
  productName: { fontSize: '1.1rem', marginBottom: '0.5rem' },
  category: { color: '#666', fontSize: '0.9rem', marginBottom: '0.5rem' },
  price: { fontSize: '1.25rem', fontWeight: 'bold', color: '#2563eb', marginBottom: '0.5rem' },
  stock: { color: '#666', marginBottom: '0.5rem' },
  status: { fontWeight: '600', marginBottom: '1rem' },
  productActions: { padding: '1rem', borderTop: '1px solid #e5e7eb', display: 'flex', gap: '0.5rem' },
  editButton: {
    flex: 1,
    padding: '0.5rem',
    backgroundColor: '#2563eb',
    color: 'white',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer'
  },
  toggleButton: {
    flex: 1,
    padding: '0.5rem',
    backgroundColor: '#f59e0b',
    color: 'white',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer'
  },
  deleteButton: {
    flex: 1,
    padding: '0.5rem',
    backgroundColor: '#ef4444',
    color: 'white',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer'
  },
  empty: { textAlign: 'center', padding: '3rem', color: '#666', gridColumn: '1 / -1' }
}