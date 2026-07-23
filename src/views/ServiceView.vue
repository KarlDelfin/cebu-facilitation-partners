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
          @clear="clear"
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
              ₱{{ scope.row.price.toLocaleString('en-US', { minimumFractionDigits: 2 }) }}
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
              @click="deleteService(scope.row.id)"
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
  <el-dialog v-model="dialog.serviceForm" :title="title" center :before-close="clear">
    <el-form ref="serviceFormRef" label-position="top" @submit.prevent="submitForm" :model="serviceForm">
      <el-form-item 
        label="Name"
        prop="name"
        :rules="[
          { required: true, message: 'Please input name', trigger: 'blur', },
        ]">
        <el-input v-model="serviceForm.name" placeholder="Enter name"/>
      </el-form-item>
      <el-form-item 
        label="Description" 
        prop="description"
        :rules="[
          { required: true, message: 'Please input description', trigger: 'blur', },
        ]">
        <el-input v-model="serviceForm.description" type="textarea" placeholder="Enter description"/>
      </el-form-item>
      <el-form-item 
        label="Price" 
        prop="price"
        :rules="[
          { required: true, message: 'Please input price', trigger: 'blur', },
          { type: 'number', message: 'Price must be a digit' },
        ]">
        <el-input v-model="serviceForm.price" placeholder="Enter price"/>
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
import { supabase } from '@/utils/supabaseClient';
import moment from 'moment';
import debounce from 'lodash/debounce'

export default {
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
     
      services: []
    }
  },
  methods: {
    /* SEARCH SERVICE */
    searchService() {
      if (!this.debouncedSearch) {
        this.debouncedSearch = debounce(() => {
          this.getServices()
        }, 500)
      }

      this.debouncedSearch(this.search.serviceName)
    },

    /* SUBMIT FORM */
    async submitForm(){
      try{
        const isValid = this.$refs.serviceFormRef.validate()
        
        if(!isValid) return

        if(this.title == 'Create Service') {
          const payload = {
            name: this.serviceForm.name,
            description: this.serviceForm.description,
            price: this.serviceForm.price,
          }

          const { data, error} = await supabase
            .from('Service')
            .insert(payload)

            if(error) throw error

            ElMessage.success('Service created successfully.')
            this.getServices()
            this.clear()
        }

        if(this.title == 'Edit Service') {
          const payload = {
            name: this.serviceForm.name,
            description: this.serviceForm.description,
            price: this.serviceForm.price,
          }

          const { data, error} = await supabase
            .from('Service')
            .update(payload)
            .eq('id', this.serviceForm.id)

          if(error) throw error

          ElMessage.success('Service updated successfully.')
          this.getServices()
          this.clear()
        }
      }
      catch(error) {
        console.error(error)
      }

    },

    /* GET SERVICES */
    async getServices() {
      try {
        this.loading = true;
        const limit = this.servicePagination.elementsPerPage;
        const from = (this.servicePagination.currentPage - 1) * limit;
        const to = from + limit - 1;

        let query = supabase
            .from('Service')
            .select('*', { count: 'exact' })

        if (this.search.serviceName && this.search.serviceName.trim() !== '') {
            query = query.ilike('name', `%${this.search.serviceName}%`);
        }

        query = query.order('dateTimeCreated', { ascending: false }).range(from, to);

        const { data, error, count } = await query;

        if (error) throw error;

        this.services = data.map((item) => ({
            id: item.id,
            name: item.name,
            description: item.description,
            price: item.price,
            dateTimeCreated: moment(item.dateTimeCreated).format('MMMM DD, YYYY HH:mm:ss')
        }));

        this.servicePagination.totalElements = count || 0;
      }
      catch (error) {
        console.error(error);
        ElMessage.error(`Error loading services: ${error.message}`);
      } finally {
        this.loading = false;
      }
    },

    formController(title, data) {
      this.title = title
      this.dialog.serviceForm = true
      
      if(title == 'Create Service') {
        
      }

      if(title == 'Edit Service') {
        this.serviceForm.id = data.id
        this.serviceForm.name = data.name
        this.serviceForm.description = data.description
        this.serviceForm.price = data.price
      }
    },

    /* DELETE SERVICE */
    async deleteService(serviceId) {
      try{
        await ElMessageBox.confirm( 'Do you want to delete this service?', 'Warning', { confirmButtonText: 'OK', cancelButtonText: 'Cancel', type: 'warning', } )
        const { data, error } = await supabase
          .from('Service')
          .delete()
          .eq('id', serviceId)

          if(error) throw error

          this.clear()
          this.getServices()
          ElMessage.success('Service deleted successfully.')
      }
      catch(error) {
      }
    },

    clear() {
      this.serviceForm.name = ''
      this.serviceForm.description = ''
      this.serviceForm.price = ''

      this.dialog.serviceForm = false
    }
  },
  mounted() {
    this.getServices();
  }
}
</script>