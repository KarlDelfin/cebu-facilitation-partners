<template>
  <div>
    <el-card shadow="never" class="rounded-lg bg-white border border-slate-200 p-0">
      
      <div class="flex justify-between items-center mb-5 gap-4">
        <el-input
          v-model="search.serviceName"
          placeholder="Search by service..."
          class="w-80"
          :prefix-icon="SearchIcon"
          clearable
          @input="searchService"
          @clear="clearSearch"
        />
        <el-button type="primary" color="#136cb3" class="font-semibold" @click="formController('Create Service', {})">
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
              @click="formController('Edit Service', scope.row)"
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
  </div>

  <!-- SERVICE FORM -->
  <el-dialog v-model="dialog.serviceForm" :title="title" center :before-close="clearForm">
    <el-form ref="serviceFormRef" label-position="top" @submit.prevent="submitForm" :model="serviceForm">
      <el-form-item 
        label="Name"
        prop="name"
        :rules="[{ required: true, message: 'Please input name', trigger: 'blur' }]">
        <el-input v-model="serviceForm.name" placeholder="Enter name"/>
      </el-form-item>

      <el-form-item 
        label="Description" 
        prop="description"
        :rules="[{ required: true, message: 'Please input description', trigger: 'blur' }]">
        <el-input v-model="serviceForm.description" type="textarea" placeholder="Enter description"/>
      </el-form-item>

      <el-form-item 
        label="Price" 
        prop="price"
        :rules="[
          { required: true, message: 'Please input price', trigger: 'blur' },
          { 
            validator: (rule, value, callback) => {
              if (isNaN(value) || value === '') {
                callback(new Error('Price must be a valid number'));
              } else {
                callback();
              }
            }, 
            trigger: 'blur' 
          }
        ]">
        <el-input v-model.number="serviceForm.price" placeholder="Enter price"/>
      </el-form-item>

      <div class="flex justify-end !mt-5">
        <el-button type="primary" @click="submitForm" :loading="loading">Confirm</el-button>
      </div>
    </el-form>
  </el-dialog>
</template>

<script>
import { Search } from '@element-plus/icons-vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import debounce from 'lodash/debounce'
import { 
  fetchServices, 
  createService, 
  updateService, 
  deleteServiceById 
} from '../services/serviceLogic'

export default {
  name: 'ServiceView',
  data() {
    return {
      SearchIcon: Search,
      loading: false,
      title: '',

      dialog: {
        serviceForm: false
      },

      serviceForm: {
        id: '',
        name: '',
        description: '',
        price: ''
      },

      search: {
        serviceName: ''
      },

      servicePagination: {
        elementsPerPage: 10,
        currentPage: 1,
        totalElements: 0
      },

      services: [],
      debouncedSearch: null
    }
  },
  methods: {
    /* GET SERVICES */
    async getServices() {
      this.loading = true;
      try {
        const { services, totalElements } = await fetchServices({
          currentPage: this.servicePagination.currentPage,
          elementsPerPage: this.servicePagination.elementsPerPage,
          searchQuery: this.search.serviceName
        });

        this.services = services;
        this.servicePagination.totalElements = totalElements;
      } catch (error) {
        console.error(error);
        ElMessage.error(`Error loading services: ${error.message}`);
      } finally {
        this.loading = false;
      }
    },

    /* SEARCH SERVICE */
    searchService() {
      if (!this.debouncedSearch) {
        this.debouncedSearch = debounce(() => {
          this.servicePagination.currentPage = 1;
          this.getServices();
        }, 500);
      }
      this.debouncedSearch();
    },

    clearSearch() {
      this.search.serviceName = '';
      this.servicePagination.currentPage = 1;
      this.getServices();
    },

    /* SUBMIT FORM */
    async submitForm() {
      try {
        await this.$refs.serviceFormRef.validate();
        this.loading = true;

        if (this.title === 'Create Service') {
          await createService(this.serviceForm);
          ElMessage.success('Service created successfully.');
        } else if (this.title === 'Edit Service') {
          await updateService(this.serviceForm.id, this.serviceForm);
          ElMessage.success('Service updated successfully.');
        }

        this.getServices();
        this.clearForm();
      } catch (error) {
        if (error !== false) {
          console.error(error);
          ElMessage.error(error.message || 'Failed to save service.');
        }
      } finally {
        this.loading = false;
      }
    },

    /* DELETE SERVICE */
    async handleDelete(serviceId) {
      try {
        await ElMessageBox.confirm(
          'Do you want to delete this service?',
          'Warning',
          { confirmButtonText: 'OK', cancelButtonText: 'Cancel', type: 'warning' }
        );

        this.loading = true;
        await deleteServiceById(serviceId);
        
        ElMessage.success('Service deleted successfully.');
        this.getServices();
      } catch (error) {
        if (error !== 'cancel') {
          console.error(error);
          ElMessage.error('Failed to delete service.');
        }
      } finally {
        this.loading = false;
      }
    },

    formController(title, data = {}) {
      this.title = title;
      this.dialog.serviceForm = true;

      if (title === 'Edit Service') {
        this.serviceForm.id = data.id;
        this.serviceForm.name = data.name;
        this.serviceForm.description = data.description;
        this.serviceForm.price = data.price;
      }
    },

    clearForm() {
      this.serviceForm = { id: '', name: '', description: '', price: '' };
      if (this.$refs.serviceFormRef) {
        this.$refs.serviceFormRef.resetFields();
      }
      this.dialog.serviceForm = false;
    }
  },
  mounted() {
    this.getServices();
  }
}
</script>