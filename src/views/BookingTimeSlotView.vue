<template>
  <div class="p-6">
    <el-card shadow="never" class="rounded-lg bg-white border border-slate-200">
      <!-- HEADER & ACTIONS -->
      <div class="flex justify-between items-center mb-5 gap-4">
        <div>
          <h1 class="text-xl font-bold text-slate-800 m-0">Booking Time Slots</h1>
          <p class="text-sm text-slate-500 m-0 mt-1">Manage operating hours and slot availability for bookings.</p>
        </div>
        <el-button 
          type="primary" 
          color="#136cb3" 
          class="font-semibold" 
          @click="openForm('Create Time Slot')"
        >
          Add Time Slot
        </el-button>
      </div>

      <!-- DATA TABLE -->
      <el-table :data="timeSlots" style="width: 100%" v-loading="loading">
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
            class="w-full"
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
import moment from 'moment'
import { supabase } from '../utils/supabaseClient' // Adjust path to your Supabase client

export default {
  name: 'BookingTimeSlotView',
  data() {
    return {
      // UI States
      loading: false,
      submitLoading: false,
      dialogVisible: false,
      formTitle: '',
      timeSlots: [],

      // Form Model
      slotForm: {
        id: null,
        slotTime: '',
        isActive: true
      }
    }
  },

  mounted() {
    this.getTimeSlots()
  },

  methods: {
    // 1. READ: Fetch Time Slots
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
        console.error(error)
        ElMessage.error(`Failed to load time slots: ${error.message}`)
      } finally {
        this.loading = false
      }
    },

    // 2. CREATE & UPDATE: Submit Handler
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

        await this.getTimeSlots()
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

    // 3. DELETE: Remove Time Slot
    async handleDelete(id) {
      try {
        await ElMessageBox.confirm(
          'Are you sure you want to delete this time slot?',
          'Warning',
          { confirmButtonText: 'Delete', cancelButtonText: 'Cancel', type: 'warning' }
        )

        this.loading = true
        const { error } = await supabase
          .from('TimeSlot')
          .delete()
          .eq('id', id)

        if (error) throw error

        ElMessage.success('Time slot deleted successfully.')
        await this.getTimeSlots()
      } catch (error) {
        if (error !== 'cancel') {
          console.error(error)
          ElMessage.error('Failed to delete time slot.')
        }
      } finally {
        this.loading = false
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