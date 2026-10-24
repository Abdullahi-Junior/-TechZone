import { supabase } from '../lib/supabase'

// Fetch all active products
export async function getProducts() {
  const { data, error } = await supabase
    .from('products')
    .select(`
      *,
      categories (
        name,
        slug
      )
    `)
    .eq('is_active', true)
    .order('created_at', { ascending: false })

  if (error) {
    console.error('Error fetching products:', error)
    throw error
  }

  return data
}

// Fetch a single product by slug
export async function getProductBySlug(slug) {
  const { data, error } = await supabase
    .from('products')
    .select(`
      *,
      categories (
        name,
        slug
      )
    `)
    .eq('slug', slug)
    .eq('is_active', true)
    .single()

  if (error) {
    console.error('Error fetching product:', error)
    throw error
  }

  return data
}

// Fetch all categories
export async function getCategories() {
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