import { supabase } from '../lib/supabase'

// Get all categories (admin)
export async function getAllCategoriesAdmin() {
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

// Create a new category
export async function createCategory(name) {
  const slug = name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '')
  
  const { data, error } = await supabase
    .from('categories')
    .insert([{ name, slug }])
    .select()

  if (error) {
    console.error('Error creating category:', error)
    throw error
  }

  return data[0]
}

// Update a category
export async function updateCategory(id, name) {
  const slug = name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '')
  
  const { data, error } = await supabase
    .from('categories')
    .update({ name, slug })
    .eq('id', id)
    .select()

  if (error) {
    console.error('Error updating category:', error)
    throw error
  }

  return data[0]
}

// Delete a category
export async function deleteCategory(id) {
  const { error } = await supabase
    .from('categories')
    .delete()
    .eq('id', id)

  if (error) {
    console.error('Error deleting category:', error)
    throw error
  }

  return { success: true }
}