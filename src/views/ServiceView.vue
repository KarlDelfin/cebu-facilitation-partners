<template>
  <div>
    <el-card shadow="never" class="rounded-lg bg-white border border-slate-200 p-0">
      <div class="flex justify-between items-center mb-5 gap-4">
        <el-input
          v-model="searchQuery"
          placeholder="Search by service..."
          class="w-80"
          :prefix-icon="SearchIcon"
          clearable
          @input="handleSearch"
          @clear="clearSearch"
        />
        <el-button 
          type="primary" 
          color="#136cb3" 
          class="font-semibold" 
          @click="openForm('Create Service')"
        >
          Create Service
        </el-button>
      </div>

      <el-table class="mt-5!" :data="services" style="width: 100%" v-loading="loading">
        <el-table-column label="Date/Time Created" min-width="150">
          <template #default="scope">
            <span class="text-slate-500 font-medium text-sm">{{ scope.row.dateTimeCreated }}</span>
          </template>
        </el-table-column>

        <el-table-column label="Service Name" min-width="200">
          <template #default="scope">
            <div class="font-bold text-slate-800 text-sm">{{ scope.row.name }}</div>
          </template>
        </el-table-column>

        <el-table-column prop="description" label="Service Description" min-width="280" show-overflow-tooltip />
        
        <el-table-column label="Price" width="160" align="right">
          <template #default="scope">
            <span class="font-bold text-[#136cb3] text-sm">
              ₱{{ Number(scope.row.price || 0).toLocaleString('en-US', { minimumFractionDigits: 2 }) }}
            </span>
          </template>
        </el-table-column>

        <el-table-column label="Operation" width="120" fixed="right" align="center">
          <template #default="scope">
            <el-button 
              size="small" 
              type="primary" 
              link 
              class="!text-[#136cb3] !font-bold"
              @click="openForm('Edit Service', scope.row)"
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

      <el-pagination
        class="mt-5! flex p-5!"
        v-model:current-page="servicePagination.currentPage"
        v-model:page-size="servicePagination.elementsPerPage"
        :page-sizes="[5, 10, 25, 50]"
        :total="servicePagination.totalElements"
        layout="total, sizes, prev, pager, next, jumper"
        @current-change="getServices"
        @size-change="getServices"
      />
    </el-card>

    <!-- SERVICE FORM DIALOG -->
    <el-dialog v-model="dialogVisible" :title="formTitle" center :before-close="clearForm">
      <el-form 
        ref="serviceFormRef" 
        label-position="top" 
        :model="serviceForm"
        @submit.prevent="submitForm"
      >
        <el-form-item 
          label="Name"
          prop="name"
          :rules="[{ required: true, message: 'Please input name', trigger: 'blur' }]"
        >
          <el-input v-model="serviceForm.name" placeholder="Enter name" />
        </el-form-item>

        <el-form-item 
          label="Description" 
          prop="description"
          :rules="[{ required: true, message: 'Please input description', trigger: 'blur' }]"
        >
          <el-input v-model="serviceForm.description" type="textarea" placeholder="Enter description" />
        </el-form-item>

        <el-form-item 
          label="Price" 
          prop="price"
          :rules="[
            { required: true, message: 'Please input price', trigger: 'blur' },
            { 
              validator: validatePrice, 
              trigger: 'blur' 
            }
          ]"
        >
          <el-input v-model.number="serviceForm.price" placeholder="Enter price" />
        </el-form-item>

        <div class="flex justify-end !mt-5">
          <el-button type="primary" @click="submitForm" :loading="loading">Confirm</el-button>
        </div>
      </el-form>
    </el-dialog>
  </div>
</template>

<script>
import { Search as SearchIcon } from '@element-plus/icons-vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import debounce from 'lodash/debounce'
import { 
  fetchServices, 
  createService, 
  updateService, 
  deleteServiceById 
} from '../services/serviceLogic'

export default {
  name: 'ServicesList',
  data() {
    return {
      // Icons
      SearchIcon,

      // UI State
      loading: false,
      dialogVisible: false,
      formTitle: '',
      searchQuery: '',
      services: [],

      // Form State
      serviceForm: {
        id: '',
        name: '',
        description: '',
        price: ''
      },

      // Pagination State
      servicePagination: {
        elementsPerPage: 10,
        currentPage: 1,
        totalElements: 0
      },

      // Debounced function holder
      debouncedFetch: null
    }
  },

  created() {
    // Setup debounced function during component creation
    this.debouncedFetch = debounce(() => {
      this.servicePagination.currentPage = 1
      this.getServices()
    }, 500)
  },

  mounted() {
    this.getServices()
  },

  methods: {
    // Custom Form Validation Rule
    validatePrice(rule, value, callback) {
      if (value === '' || value === null || isNaN(value)) {
        callback(new Error('Price must be a valid number'))
      } else {
        callback()
      }
    },

    // Fetch Services Data
    async getServices() {
      this.loading = true
      try {
        const { services: data, totalElements } = await fetchServices({
          currentPage: this.servicePagination.currentPage,
          elementsPerPage: this.servicePagination.elementsPerPage,
          searchQuery: this.searchQuery
        })

        this.services = data
        this.servicePagination.totalElements = totalElements
      } catch (error) {
        console.error(error)
        ElMessage.error(`Error loading services: ${error.message || error}`)
      } finally {
        this.loading = false
      }
    },

    // Search Handlers
    handleSearch() {
      if (this.debouncedFetch) {
        this.debouncedFetch()
      }
    },

    clearSearch() {
      this.searchQuery = ''
      this.servicePagination.currentPage = 1
      this.getServices()
    },

    // Dialog & Form Handlers
    openForm(title, rowData = {}) {
      this.formTitle = title
      this.dialogVisible = true

      if (title === 'Edit Service' && rowData.id) {
        this.serviceForm.id = rowData.id
        this.serviceForm.name = rowData.name
        this.serviceForm.description = rowData.description
        this.serviceForm.price = rowData.price
      }
    },

    clearForm(done) {
      this.serviceForm = {
        id: '',
        name: '',
        description: '',
        price: ''
      }
      
      if (this.$refs.serviceFormRef) {
        this.$refs.serviceFormRef.resetFields()
      }
      this.dialogVisible = false

      if (typeof done === 'function') {
        done()
      }
    },

    async submitForm() {
      const formRef = this.$refs.serviceFormRef
      if (!formRef) return

      try {
        await formRef.validate()
        this.loading = true

        if (this.formTitle === 'Create Service') {
          await createService(this.serviceForm)
          ElMessage.success('Service created successfully.')
        } else if (this.formTitle === 'Edit Service') {
          await updateService(this.serviceForm.id, this.serviceForm)
          ElMessage.success('Service updated successfully.')
        }

        await this.getServices()
        this.clearForm()
      } catch (error) {
        if (error && error !== false) {
          console.error(error)
          ElMessage.error(error.message || 'Failed to save service.')
        }
      } finally {
        this.loading = false
      }
    },

    // Delete Logic
    async handleDelete(serviceId) {
      try {
        await ElMessageBox.confirm(
          'Do you want to delete this service?',
          'Warning',
          { confirmButtonText: 'OK', cancelButtonText: 'Cancel', type: 'warning' }
        )

        this.loading = true
        await deleteServiceById(serviceId)

        ElMessage.success('Service deleted successfully.')
        await this.getServices()
      } catch (error) {
        if (error !== 'cancel') {
          console.error(error)
          ElMessage.error('Failed to delete service.')
        }
      } finally {
        this.loading = false
      }
    }
  }
}
</script>