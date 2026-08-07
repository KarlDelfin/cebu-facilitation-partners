<template>
  <div class="p-6">
    <el-card shadow="never" class="rounded-lg bg-white border border-slate-200">
      <!-- HEADER & ACTIONS -->
      <div class="flex justify-between items-center !mb-5 gap-4">
        <div>
          <h1 class="text-xl font-bold text-slate-800 m-0">{{ $router.name }}</h1>
          <p class="text-sm text-slate-500 m-0 mt-1">Manage operating hours and slot availability for bookings.</p>
        </div>
        
        <div class="flex items-center gap-2">
          <!-- REFRESH BUTTON -->
          <el-button 
            :icon="Refresh" 
            circle 
            :loading="store.loading" 
            @click="store.getTimeSlots()" 
            title="Refresh Time Slots"
          />
          <el-button 
            type="primary" 
            color="#136cb3" 
            class="font-semibold" 
            @click="openForm('Create Time Slot')"
          >
            Create Time Slot
          </el-button>
        </div>
      </div>

      <!-- DATA TABLE -->
      <el-table :data="store.timeSlots" style="width: 100%" v-loading="store.loading">
        <el-table-column label="Time Slot" min-width="160">
          <template #default="scope">
            <span class="font-bold text-slate-800 text-sm">
              {{ formatTime(scope.row.slotTime) }}
            </span>
          </template>
        </el-table-column>

        <el-table-column label="Status" width="140" align="center">
          <template #default="scope">
            <el-switch
              v-model="scope.row.isActive"
              active-color="#136cb3"
              @change="(val) => handleStatusToggle(scope.row, val)"
            />
          </template>
        </el-table-column>

        <el-table-column label="Operations" width="160" fixed="right" align="center">
          <template #default="scope">
            <el-button 
              size="small" 
              type="primary" 
              link 
              class="!text-[#136cb3] !font-bold"
              @click="openForm('Edit Time Slot', scope.row)"
            >
              Edit
            </el-button>
            <el-button 
              size="small" 
              type="primary" 
              link 
              class="!text-rose-500 !font-bold"
              @click="handleDelete(scope.row.id)"
            >
              Delete
            </el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-card>

    <!-- FORM DIALOG (CREATE / EDIT) -->
    <el-dialog 
      v-model="dialogVisible" 
      :title="formTitle" 
      width="420px" 
      center 
      :before-close="clearForm"
      class="!w-[92vw] sm:!w-[480px] !max-w-[480px] !rounded-2xl"
    >
      <el-form 
        ref="timeSlotFormRef" 
        label-position="top" 
        :model="slotForm"
        @submit.prevent="submitForm"
      >
        <el-form-item 
          label="Slot Time" 
          prop="slotTime"
          :rules="[{ required: true, message: 'Please select a time slot', trigger: 'change' }]"
        >
          <el-time-picker
            v-model="slotForm.slotTime"
            value-format="HH:mm:ss"
            format="hh:mm A"
            placeholder="Select time"
            class="!w-full"
          />
        </el-form-item>

        <el-form-item label="Active Status" prop="isActive">
          <el-switch v-model="slotForm.isActive" active-text="Active" inactive-text="Inactive" />
        </el-form-item>

        <div class="flex justify-end mt-6">
          <el-button @click="clearForm">Cancel</el-button>
          <el-button type="primary" color="#136cb3" @click="submitForm" :loading="submitLoading">
            Confirm
          </el-button>
        </div>
      </el-form>
    </el-dialog>
  </div>
</template>

<script>
import { ElMessage, ElMessageBox } from 'element-plus'
import { Refresh } from '@element-plus/icons-vue'
import moment from 'moment'
import { markRaw } from 'vue'
import { supabase } from '../utils/supabaseClient'
import { useTimeSlotStore } from '@/store/useTimeSlotStore'

export default {
  name: 'BookingTimeSlotView',
  components: {
    Refresh: markRaw(Refresh)
  },
  setup() {
    const store = useTimeSlotStore()
    return { store }
  },
  data() {
    return {
      Refresh,
      submitLoading: false,
      dialogVisible: false,
      formTitle: '',

      // Form Model
      slotForm: {
        id: null,
        slotTime: '',
        isActive: true
      }
    }
  },

  async mounted() {
    // Only fetch if store doesn't have cached data yet
    if (this.store.timeSlots.length === 0) {
      await this.store.getTimeSlots()
    }
  },

  methods: {
    // CREATE & UPDATE: Submit Handler
    async submitForm() {
      const formRef = this.$refs.timeSlotFormRef
      if (!formRef) return

      try {
        await formRef.validate()
        this.submitLoading = true

        if (this.formTitle === 'Create Time Slot') {
          // INSERT
          const { error } = await supabase
            .from('TimeSlot')
            .insert([
              {
                slotTime: this.slotForm.slotTime,
                isActive: this.slotForm.isActive
              }
            ])

          if (error) throw error
          ElMessage.success('Time slot created successfully.')
        } else if (this.formTitle === 'Edit Time Slot') {
          // UPDATE
          const { error } = await supabase
            .from('TimeSlot')
            .update({
              slotTime: this.slotForm.slotTime,
              isActive: this.slotForm.isActive
            })
            .eq('id', this.slotForm.id)

          if (error) throw error
          ElMessage.success('Time slot updated successfully.')
        }

        await this.store.getTimeSlots()
        this.clearForm()
      } catch (error) {
        if (error && error !== false) {
          console.error(error)
          ElMessage.error(error.message || 'Failed to save time slot.')
        }
      } finally {
        this.submitLoading = false
      }
    },

    // Toggle Active/Inactive directly in table
    async handleStatusToggle(row, newValue) {
      try {
        const { error } = await supabase
          .from('TimeSlot')
          .update({ isActive: newValue })
          .eq('id', row.id)

        if (error) throw error
        ElMessage.success(`Status updated to ${newValue ? 'Active' : 'Inactive'}.`)
      } catch (error) {
        row.isActive = !newValue // Revert switch position on error
        console.error(error)
        ElMessage.error('Failed to update status.')
      }
    },

    // DELETE: Remove Time Slot
    async handleDelete(id) {
      try {
        await ElMessageBox.confirm(
          'Are you sure you want to delete this time slot?',
          'Warning',
          { confirmButtonText: 'Delete', cancelButtonText: 'Cancel', type: 'warning' }
        )

        this.store.loading = true
        const { error } = await supabase
          .from('TimeSlot')
          .delete()
          .eq('id', id)

        if (error) throw error

        ElMessage.success('Time slot deleted successfully.')
        await this.store.getTimeSlots()
      } catch (error) {
        if (error !== 'cancel') {
          console.error(error)
          ElMessage.error('Failed to delete time slot.')
        }
      } finally {
        this.store.loading = false
      }
    },

    // Form Dialog Controls
    openForm(title, rowData = {}) {
      this.formTitle = title
      this.dialogVisible = true

      if (title === 'Edit Time Slot' && rowData.id) {
        this.slotForm.id = rowData.id
        this.slotForm.slotTime = rowData.slotTime
        this.slotForm.isActive = rowData.isActive
      }
    },

    clearForm(done) {
      this.slotForm = {
        id: null,
        slotTime: '',
        isActive: true
      }

      if (this.$refs.timeSlotFormRef) {
        this.$refs.timeSlotFormRef.resetFields()
      }
      this.dialogVisible = false

      if (typeof done === 'function') {
        done()
      }
    },

    // Moment.js Formatters
    formatTime(timeString) {
      if (!timeString) return ''
      return moment(timeString, 'HH:mm:ss').format('hh:mm A')
    },

    formatDate(dateString) {
      if (!dateString) return ''
      return moment(dateString).format('MMM DD, YYYY hh:mm A')
    }
  }
}
</script>