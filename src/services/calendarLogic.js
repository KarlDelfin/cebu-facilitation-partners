import { supabase } from '@/utils/supabaseClient'

/**
 * Fetches booking records from Supabase and formats them as FullCalendar events.
 */
export async function fetchCalendarEvents() {
  const { data, error } = await supabase
    .from('Booking')
    .select(`
      id,
      bookingDateTime,
      status,
      fullName,
      Service ( name )
    `)

  if (error) throw error

  return (data || []).map(item => {
    const isConfirmed = item.status === 'confirmed'

    return {
      id: item.id,
      title: `${item.Service?.name || 'Event'} - ${item.fullName}`,
      start: item.bookingDateTime,
      backgroundColor: isConfirmed ? '#136cb3' : '#feb841', // Blue if Confirmed, Gold if Pending
      borderColor: isConfirmed ? '#0f5690' : '#d9962b',
      textColor: '#ffffff',
      extendedProps: {
        status: item.status,
        client: item.fullName
      }
    }
  })
}