import { supabase } from '../lib/supabase'

// Upload image to Supabase Storage
export async function uploadProductImage(file) {
  // Validate file type
  const allowedTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/gif']
  if (!allowedTypes.includes(file.type)) {
    throw new Error('Only JPEG, PNG, WebP, and GIF images are allowed')
  }

  // Validate file size (max 5MB)
  const maxSize = 5 * 1024 * 1024 // 5MB
  if (file.size > maxSize) {
    throw new Error('Image must be smaller than 5MB')
  }

  // Generate unique filename
  const fileExt = file.name.split('.').pop()
  const fileName = `${Date.now()}-${Math.random().toString(36).substring(7)}.${fileExt}`
  const filePath = `products/${fileName}`

  // Upload to Supabase Storage
  const { data, error } = await supabase.storage
    .from('product-images')
    .upload(filePath, file)

  if (error) {
    console.error('Error uploading image:', error)
    throw error
  }

  // Get public URL
  const { data: { publicUrl } } = supabase.storage
    .from('product-images')
    .getPublicUrl(data.path)

  return publicUrl
}

// Delete image from Supabase Storage
export async function deleteProductImage(imageUrl) {
  try {
    // Extract file path from URL
    const urlParts = imageUrl.split('/product-images/')
    if (urlParts.length < 2) return

    const filePath = urlParts[1]

    await supabase.storage
      .from('product-images')
      .remove([filePath])
  } catch (error) {
    console.error('Error deleting image:', error)
    // Don't throw error - image deletion failure shouldn't block product deletion
  }
}