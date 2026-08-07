import { defineStore } from 'pinia';
import { supabase } from '@/utils/supabaseClient';
import { ElMessage } from 'element-plus';

export const useStatusStore = defineStore('status', {
  state: () => ({
    loading: false,
    statusList: []
  }),

  actions: {
    async getStatuses() {
      this.loading = true;
      try {
        const { data, error } = await supabase
          .from('Status')
          .select('*')
          .order('id', { ascending: true });

        if (error) throw error;
        this.statusList = data || [];
      } catch (error) {
        console.error('Error fetching statuses:', error);
        ElMessage.error(`Failed to load statuses: ${error.message}`);
      } finally {
        this.loading = false;
      }
    }
  }
});