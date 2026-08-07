<template>
  <div class="p-6">
    <el-card shadow="never" class="rounded-lg bg-white border border-slate-200">
      <div class="flex flex-col sm:flex-row justify-between items-start sm:items-center !mb-5 gap-4">
        <div>
          <h1 class="text-xl font-bold text-slate-800 m-0">Booking Status</h1>
          <p class="text-sm text-slate-500 m-0 mt-1">Manage statuses for bookings.</p>
        </div>
        
        <div class="flex items-center gap-2">
          <!-- REFRESH BUTTON -->
          <el-button 
            :icon="Refresh" 
            circle 
            :loading="store.loading" 
            @click="store.getStatuses()" 
            title="Refresh Statuses"
          />
          <el-button 
            type="primary" 
            color="#136cb3" 
            class="font-semibold" 
            @click="openForm('Create Booking Status')"
          >
            Add Status
          </el-button>
        </div>
      </div>

      <el-table :data="store.statusList" style="width: 100%" v-loading="store.loading">
        <el-table-column label="Status Name" min-width="200">
          <template #default="scope">
            <span class="font-bold text-slate-800 text-sm">
              {{ scope.row.name }}
            </span>
          </template>
        </el-table-column>

        <el-table-column label="Color" min-width="150">
          <template #default="scope">
            <div class="flex items-center gap-2">
              <span 
                class="w-4 h-4 rounded-full border border-slate-200 inline-block shadow-sm" 
                :style="{ backgroundColor: scope.row.color || '#94a3b8' }"
              ></span>
              <span class="text-xs font-mono font-semibold text-slate-600">
                {{ scope.row.color || 'N/A' }}
              </span>
            </div>
          </template>
        </el-table-column>

        <el-table-column label="Operations" width="160" fixed="right" align="center">
          <template #default="scope">
            <el-button 
              size="small" 
              type="primary" 
              link 
              class="!text-[#136cb3] !font-bold"
              @click="openForm('Edit Booking Status', scope.row)"
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

    <el-dialog 
      v-model="dialogVisible" 
      :title="formTitle" 
      width="420px" 
      center 
      :before-close="clearForm"
      class="!w-[92vw] sm:!w-[480px] !max-w-[480px] !rounded-2xl"
    >
      <el-form 
        ref="statusFormRef" 
        label-position="top" 
        :model="statusForm"
        @submit.prevent="submitForm"
      >
        <el-form-item 
          label="Status Name" 
          prop="name"
          :rules="[{ required: true, message: 'Please input status name', trigger: 'blur' }]"
        >
          <el-input v-model="statusForm.name" placeholder="e.g. Pending, Confirmed, Cancelled" />
        </el-form-item>

        <el-form-item 
          label="Status Color" 
          prop="color"
          :rules="[{ required: true, message: 'Please select status color', trigger: 'change' }]"
        >
          <div class="flex items-center gap-3">
            <el-color-picker v-model="statusForm.color" :show-alpha="false" />
            <el-input v-model="statusForm.color" placeholder="#136cb3" class="w-32" />
          </div>
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
import { ElMessage, ElMessageBox } from 'element-plus';
import { Refresh } from '@element-plus/icons-vue';
import moment from 'moment';
import { markRaw } from 'vue';
import { supabase } from '../utils/supabaseClient';
import { useStatusStore } from '@/store/useStatusStore';

export default {
  name: 'StatusView',
  components: {
    Refresh: markRaw(Refresh)
  },
  setup() {
    const store = useStatusStore();
    return { store };
  },
  data() {
    return {
      Refresh,
      submitLoading: false,
      dialogVisible: false,
      formTitle: '',

      statusForm: {
        id: null,
        name: '',
        color: '#136cb3'
      }
    };
  },

  async mounted() {
    if (this.store.statusList.length === 0) {
      await this.store.getStatuses();
    }
  },

  methods: {
    async submitForm() {
      const formRef = this.$refs.statusFormRef;
      if (!formRef) return;

      try {
        await formRef.validate();
        this.submitLoading = true;

        const payload = {
          name: this.statusForm.name,
          color: this.statusForm.color
        };

        if (this.formTitle === 'Create Booking Status') {
          const { error } = await supabase
            .from('Status')
            .insert([payload]);

          if (error) throw error;
          ElMessage.success('Booking status created successfully.');
        } else if (this.formTitle === 'Edit Booking Status') {
          const { error } = await supabase
            .from('Status')
            .update(payload)
            .eq('id', this.statusForm.id);

          if (error) throw error;
          ElMessage.success('Booking status updated successfully.');
        }

        await this.store.getStatuses();
        this.clearForm();
      } catch (error) {
        if (error && error !== false) {
          console.error(error);
          ElMessage.error(error.message || 'Failed to save booking status.');
        }
      } finally {
        this.submitLoading = false;
      }
    },

    async handleDelete(id) {
      try {
        await ElMessageBox.confirm(
          'Are you sure you want to delete this status?',
          'Warning',
          { confirmButtonText: 'Delete', cancelButtonText: 'Cancel', type: 'warning' }
        );

        this.store.loading = true;
        const { error } = await supabase
          .from('Status')
          .delete()
          .eq('id', id);

        if (error) throw error;

        ElMessage.success('Status deleted successfully.');
        await this.store.getStatuses();
      } catch (error) {
        if (error !== 'cancel') {
          console.error(error);
          ElMessage.error('Failed to delete status.');
        }
      } finally {
        this.store.loading = false;
      }
    },

    openForm(title, rowData = {}) {
      this.formTitle = title;
      this.dialogVisible = true;

      if (title === 'Edit Booking Status' && rowData.id) {
        this.statusForm.id = rowData.id;
        this.statusForm.name = rowData.name;
        this.statusForm.color = rowData.color || '#136cb3';
      } else {
        this.statusForm.color = '#136cb3';
      }
    },

    clearForm(done) {
      this.statusForm = {
        id: null,
        name: '',
        color: '#136cb3'
      };

      if (this.$refs.statusFormRef) {
        this.$refs.statusFormRef.resetFields();
      }
      this.dialogVisible = false;

      if (typeof done === 'function') {
        done();
      }
    },

    formatDate(dateString) {
      if (!dateString) return '';
      return moment(dateString).format('MMM DD, YYYY hh:mm A');
    }
  }
};
</script>