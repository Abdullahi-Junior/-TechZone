import { supabase } from '../lib/supabase'

// Get all reservations (admin only)
export async function getAllReservations() {
  const { data, error } = await supabase
    .from('reservations')
    .select(`
      *,
      products (
        id,
        name,
        slug,
        image_url,
        price
      )
    `)
    .order('created_at', { ascending: false })

  if (error) {
    console.error('Error fetching reservations:', error)
    throw error
  }

  return data
}

// Update reservation status
export async function updateReservationStatus(id, status) {
  const { data, error } = await supabase
    .from('reservations')
    .update({ status })
    .eq('id', id)
    .select()

  if (error) {
    console.error('Error updating reservation:', error)
    throw error
  }

  return data[0]
}