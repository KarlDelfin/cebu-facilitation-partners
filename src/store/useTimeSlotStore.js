import { defineStore } from 'pinia'
import { supabase } from '@/utils/supabaseClient'
import { ElMessage } from 'element-plus'

export const useTimeSlotStore = defineStore('timeSlot', {
  state: () => ({
    loading: false,
    timeSlots: []
  }),

  actions: {
    async getTimeSlots() {
      this.loading = true
      try {
        const { data, error } = await supabase
          .from('TimeSlot')
          .select('*')
          .order('slotTime', { ascending: true })

        if (error) throw error
        this.timeSlots = data || []
      } catch (error) {
        console.error('Error fetching time slots:', error)
        ElMessage.error(`Failed to load time slots: ${error.message}`)
      } finally {
        this.loading = false
      }
    }
  }
})