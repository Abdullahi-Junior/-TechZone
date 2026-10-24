import { supabase } from '../lib/supabase'

// Get all products including inactive (admin only)
export async function getAllProductsAdmin() {
  const { data, error } = await supabase
    .from('products')
    .select(`
      *,
      categories (
        name,
        slug
      )
    `)
    .order('created_at', { ascending: false })

  if (error) {
    console.error('Error fetching products:', error)
    throw error
  }

  return data
}

// Create a new product
export async function createProduct(productData) {
  const { data, error } = await supabase
    .from('products')
    .insert([productData])
    .select()

  if (error) {
    console.error('Error creating product:', error)
    throw error
  }

  return data[0]
}

// Update a product
export async function updateProduct(id, productData) {
  const { data, error } = await supabase
    .from('products')
    .update(productData)
    .eq('id', id)
    .select()

  if (error) {
    console.error('Error updating product:', error)
    throw error
  }

  return data[0]
}

// Delete a product
export async function deleteProduct(id) {
  const { error } = await supabase
    .from('products')
    .delete()
    .eq('id', id)

  if (error) {
    console.error('Error deleting product:', error)
    throw error
  }

  return { success: true }
}

// Get all categories
export async function getAllCategories() {
  const { data, error } = await supabase
    .from('categories')
    .select('*')
    .order('name')

  if (error) {
    console.error('Error fetching categories:', error)
    throw error
  }

  return data
}