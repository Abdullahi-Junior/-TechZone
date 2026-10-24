import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { getAllCategoriesAdmin, createCategory, updateCategory, deleteCategory } from '../../services/adminCategories'

export default function ManageCategories() {
  const [categories, setCategories] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [showForm, setShowForm] = useState(false)
  const [editingCategory, setEditingCategory] = useState(null)
  const [formData, setFormData] = useState({ name: '' })

  useEffect(() => {
    loadCategories()
  }, [])

  async function loadCategories() {
    try {
      const data = await getAllCategoriesAdmin()
      setCategories(data)
    } catch (err) {
      setError('Failed to load categories')
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  function openCreateForm() {
    setEditingCategory(null)
    setFormData({ name: '' })
    setShowForm(true)
  }

  function openEditForm(category) {
    setEditingCategory(category)
    setFormData({ name: category.name })
    setShowForm(true)
  }

  async function handleSubmit(e) {
    e.preventDefault()
    
    if (!formData.name.trim()) {
      alert('Please enter a category name')
      return
    }

    try {
      if (editingCategory) {
        await updateCategory(editingCategory.id, formData.name.trim())
        alert('Category updated!')
      } else {
        await createCategory(formData.name.trim())
        alert('Category created!')
      }
      
      setShowForm(false)
      await loadCategories()
    } catch (err) {
      alert('Failed to save category. Make sure the name is unique.')
      console.error(err)
    }
  }

  async function handleDelete(id, name) {
    if (!confirm(`Are you sure you want to delete "${name}"? Products in this category will lose their category assignment.`)) return
    
    try {
      await deleteCategory(id)
      setCategories(prev => prev.filter(c => c.id !== id))
      alert('Category deleted')
    } catch (err) {
      alert('Failed to delete category. It may have products assigned to it.')
      console.error(err)
    }
  }

  if (loading) {
    return <div style={{ padding: '2rem', textAlign: 'center' }}>Loading categories...</div>
  }

  if (error) {
    return <div style={{ padding: '2rem', textAlign: 'center', color: 'red' }}>{error}</div>
  }

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <h1 style={styles.title}>Manage Categories</h1>
        <div style={styles.headerActions}>
          <Link to="/admin" style={styles.backLink}>← Back to Dashboard</Link>
          <button onClick={openCreateForm} style={styles.addButton}>
            + Add New Category
          </button>
        </div>
      </div>

      {showForm && (
        <div style={styles.formOverlay}>
          <div style={styles.formCard}>
            <h2 style={styles.formTitle}>
              {editingCategory ? 'Edit Category' : 'Create New Category'}
            </h2>
            <form onSubmit={handleSubmit} style={styles.form}>
              <div style={styles.field}>
                <label style={styles.label}>Category Name *</label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ name: e.target.value })}
                  style={styles.input}
                  placeholder="e.g., Home Theater Systems"
                  required
                  autoFocus
                />
                <p style={styles.hint}>
                  URL slug will be auto-generated: {formData.name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '') || 'category-name'}
                </p>
              </div>

              <div style={styles.formActions}>
                <button type="button" onClick={() => setShowForm(false)} style={styles.cancelButton}>
                  Cancel
                </button>
                <button type="submit" style={styles.submitButton}>
                  {editingCategory ? 'Update Category' : 'Create Category'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <div style={styles.categoryList}>
        {categories.length === 0 ? (
          <div style={styles.empty}>No categories found. Click "Add New Category" to create one.</div>
        ) : (
          categories.map(category => (
            <div key={category.id} style={styles.categoryCard}>
              <div style={styles.categoryInfo}>
                <h3 style={styles.categoryName}>{category.name}</h3>
                <p style={styles.categorySlug}>Slug: {category.slug}</p>
              </div>
              <div style={styles.categoryActions}>
                <button onClick={() => openEditForm(category)} style={styles.editButton}>
                  Edit
                </button>
                <button onClick={() => handleDelete(category.id, category.name)} style={styles.deleteButton}>
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
    zIndex: 1000
  },
  formCard: {
    backgroundColor: 'white',
    padding: '2rem',
    borderRadius: '8px',
    maxWidth: '500px',
    width: '100%'
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
  hint: { fontSize: '0.85rem', color: '#666' },
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
  categoryList: { display: 'flex', flexDirection: 'column', gap: '1rem' },
  categoryCard: {
    backgroundColor: 'white',
    padding: '1.5rem',
    borderRadius: '8px',
    boxShadow: '0 2px 5px rgba(0,0,0,0.1)',
    border: '1px solid #e5e7eb',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center'
  },
  categoryInfo: { flex: 1 },
  categoryName: { fontSize: '1.25rem', marginBottom: '0.25rem' },
  categorySlug: { color: '#666', fontSize: '0.9rem' },
  categoryActions: { display: 'flex', gap: '0.5rem' },
  editButton: {
    padding: '0.5rem 1rem',
    backgroundColor: '#2563eb',
    color: 'white',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer'
  },
  deleteButton: {
    padding: '0.5rem 1rem',
    backgroundColor: '#ef4444',
    color: 'white',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer'
  },
  empty: { textAlign: 'center', padding: '3rem', color: '#666' }
}