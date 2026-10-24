 import { supabase } from '../lib/supabase'

// Submit a reservation request
export async function createReservation(reservationData) {
  const { error } = await supabase
    .from('reservations')
    .insert([reservationData])

  if (error) {
    console.error('Error creating reservation:', error)
    throw error
  }

  return { success: true }
}