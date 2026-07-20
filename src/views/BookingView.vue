<template>
  <div class="space-y-6">
    <el-row :gutter="20">
      <el-col :span="8">
        <el-card shadow="hover" class="!rounded-lg">
          <template #header>
            <span class="text-slate-500 font-semibold text-sm uppercase tracking-wider">Total Bookings</span>
          </template>
          <div class="text-3xl font-bold text-slate-800">1,248</div>
        </el-card>
      </el-col>
      <el-col :span="8">
        <el-card shadow="hover" class="!rounded-lg">
          <template #header>
            <span class="text-slate-500 font-semibold text-sm uppercase tracking-wider">Pending Bootcamps</span>
          </template>
          <div class="text-3xl font-bold text-amber-500">4</div>
        </el-card>
      </el-col>
      <el-col :span="8">
        <el-card shadow="hover" class="!rounded-lg">
          <template #header>
            <span class="text-slate-500 font-semibold text-sm uppercase tracking-wider">Total Value</span>
          </template>
          <div class="text-3xl font-bold text-[#136cb3]">₱245,000</div>
        </el-card>
      </el-col>
    </el-row>

    <el-card shadow="never" class="!rounded-lg !border-slate-200 !mt-5">
      <div class="flex justify-between items-center mb-6 gap-4">
        <el-input
          v-model="search.bookingName"
          placeholder="Search by booking..."
          class="w-96"
          :prefix-icon="SearchIcon"
          clearable
          @input="searchBooking"
        />
        <el-button type="primary" color="#136cb3" class="font-semibold" @click="formController('Create Booking')">
          Create Booking
        </el-button>
      </div>

      <el-table class="!mt-5" :data="bookings" style="width: 100%" v-loading="loading">
        
        <el-table-column label="Date/Time Created" min-width="160">
          <template #default="scope">
            <div class="text-slate-800 font-medium text-sm">
              {{ scope.row.dateTimeCreated }}
            </div>
          </template>
        </el-table-column>

        <el-table-column label="Client" min-width="200">
          <template #default="scope">
            <div class="flex flex-col">
              <div class="font-bold text-slate-800 text-sm">{{ scope.row.fullName }}</div>
              <div class="text-xs text-slate-500 mt-0.5">
                {{ scope.row.email }} | {{ scope.row.phone }}
              </div>
            </div>
          </template>
        </el-table-column>

        <el-table-column label="Service" min-width="180">
          <template #default="scope">
            <el-tooltip
              :content="scope.row.Service.description"
              placement="top"
              effect="dark"
            >
              <el-tag effect="plain" class="!border-[#136cb3] !text-[#136cb3] !font-bold !bg-white cursor-pointer">
                {{ scope.row.Service.name }}
              </el-tag>
            </el-tooltip>
            
            <div class="text-xs text-slate-500 mt-1">
              Rate: ₱{{ scope.row.Service.price.toLocaleString() }}
            </div>
          </template>
        </el-table-column>

        <el-table-column label="Scheduled Date" min-width="160">
          <template #default="scope">
            <div class="text-slate-800 font-medium text-sm">
              <el-tag>{{ scope.row.bookingDateTime }}</el-tag>
            </div>
          </template>
        </el-table-column>

        <el-table-column label="Status" width="130">
          <template #default="scope">
            <el-select 
              v-model="scope.row.status" 
              size="small" 
              @change="handleStatusChange(scope.row)"
            >
              <el-option label="Pending" value="pending" />
              <el-option label="Confirmed" value="confirmed" />
              <el-option label="Cancelled" value="cancelled" />
              <el-option label="Completed" value="completed" />
            </el-select>
          </template>
        </el-table-column>

        <el-table-column label="Operation" width="120" fixed="right" align="center">
          <template #default="scope">
            <el-button 
              size="small" 
              type="primary" 
              link 
              class="!text-[#136cb3] !font-bold"
              @click="formController('Edit Booking', scope.row)"
            >
              Edit
            </el-button>
            <el-button 
              size="small" 
              type="primary" 
              link 
              class="!text-rose-500 !font-bold"
              @click="deleteBooking(scope.row.id)"
            >
              Delete
            </el-button>
          </template>
        </el-table-column>
      </el-table>

      <el-pagination
        class="mt-5! flex p-5!"
        v-model:current-page="bookingPagination.currentPage"
        v-model:page-size="bookingPagination.elementsPerPage"
        :page-sizes="[5, 10, 25, 50]"
        :total="bookingPagination.totalElements"
        layout="total, sizes, prev, pager, next, jumper"
        @current-change="getBookings"
        @size-change="getBookings"
      />
    </el-card>
  </div>

  <!-- BOOKING FORM -->
  <el-dialog v-model="dialog.bookingForm" :title="title" center :before-close="clear">
    <el-form ref="bookingFormRef" @submit.prevent="submitForm" label-position="top" :model="bookingForm">
      <el-form-item label="Service">
        <el-select 
          @click="getServices" 
          filterable 
          :filter-method="searchService" 
          :loading="loading" 
          placeholder="Select Service"
          v-model="bookingForm.serviceId"
          >
          <el-option v-for="(service, index) in services" :key="index" :label="service.name" :value="service.id"/>
        </el-select>
      </el-form-item>
      <div class="flex gap-10">
        <el-form-item class="!w-[50%]" label="Preferred Date">
          <VCalendar expanded @dayclick="handleSelectDate" :min-date="new Date()" :attributes="vCalendarEvents"/>
        </el-form-item>
        <el-form-item class="!w-[50%]" label="Preferred Time">
          <div class="flex justify-between gap-2 flex-wrap">
            <button
                type="button"
                v-for="slot in timeSlots"
                :key="slot.value"
                class="!w-[32%] border border-[#ccc] rounded-[5px] py-2 px-4"
                :class="{ active: selectedTime === slot.value, disabled: slot.disabled }"
                @click="!slot.disabled && handleSelectTime(slot.value)"
                :disabled="slot.disabled"
            >
                {{ slot.label }}
            </button>
          </div>
        </el-form-item>
      </div>
      <div class="grid grid-cols-2 gap-x-5 gap-y-0">
        <el-form-item 
          label="Full Name"
          prop="fullName"
          :rules="[
            { required: true, message: 'Please input full name', trigger: 'blur', },
          ]">
          <el-input v-model="bookingForm.fullName" placeholder="Enter Client Full Name"/>
        </el-form-item>

        <el-form-item 
          label="Email" 
          prop="email"
          :rules="[
            { required: true, message: 'Please input email address', trigger: 'blur', },
            { pattern: /^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$/, message: 'Please input correct email address', trigger: ['blur', 'change'], },
          ]">
          <el-input v-model="bookingForm.email" placeholder="Enter Client Email"/>
        </el-form-item>

        <el-form-item 
          label="Phone" 
          prop="phone"
          :rules="[
            { required: true, message: 'Please input phone number', trigger: 'blur', },
            { pattern: /^(\+?\d{10,15})$/, message: 'Please input correct phone number', trigger: ['blur', 'change'], },
          ]">
          <el-input v-model="bookingForm.phone" placeholder="Enter Client Phone"/>
        </el-form-item>
      </div>
      <div class="mt-5 flex justify-end">
        <el-button type="primary" @click="submitForm">Confirm</el-button>
      </div>
    </el-form>
  </el-dialog>
</template>

<script>
import { supabase } from '@/utils/supabaseClient';
import { Search } from '@element-plus/icons-vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import moment from 'moment';
import debounce from 'lodash/debounce'

export default {
  data() {
    return {
      title: '',
      loading: false,
      SearchIcon: Search,
      bookings: [],
      services: [],
      vCalendarEvents: [],
      selectedTime: '',
      
      timeSlots: [
          { label: '9:00 AM', value: '09:00:00', disabled: true },
          { label: '10:00 AM', value: '10:00:00', disabled: true },
          { label: '11:00 AM', value: '11:00:00', disabled: true },
          { label: '12:00 PM', value: '12:00:00', disabled: true },
          { label: '1:00 PM', value: '13:00:00', disabled: true },
          { label: '2:00 PM', value: '14:00:00', disabled: true },
          { label: '3:00 PM', value: '15:00:00', disabled: true },
          { label: '4:00 PM', value: '16:00:00', disabled: true },
          { label: '5:00 PM', value: '17:00:00', disabled: true },
          { label: '6:00 PM', value: '18:00:00', disabled: true },
        ],

      bookingForm: {
        id: '',
        serviceId: '',
        bookingDateTime: '',
        status: '',
        fullName: '',
        email: '',
        phone: '',
        status: 'confirmed'
      },

      dialog: {
        bookingForm: false
      },

      search: {
        bookingName: '',
        serviceName: ''
      },

      bookingPagination: {
        elementsPerPage: 10,
        currentPage: 1,
        totalElements: 0
      }, 

      servicePagination: {
        elementsPerPage: 10,
        currentPage: 1,
        totalElements: 0
      }, 
    }
  },
  methods: {
    /* HANDLE SELECT DATE */
    async handleSelectDate(day) {
        if (moment(new Date()).startOf('day') > moment(day.date).startOf('day')) {
            ElMessage.warning('Cannot select past date');
            return;
        }
        
        this.bookingForm.bookingDateTime = moment(day.date).format('YYYY-MM-DD');
        this.vCalendarEvents = [];
        this.vCalendarEvents.push({
            highlight: {
                backgroundColor: '#ff8080',
            },
            dates: new Date(day.date),
        });

        const selectedDate = moment(day.date).format('YYYY-MM-DD');
        
        const { data, error } = await supabase
            .from('Booking')
            .select('bookingDateTime')
            .gte('bookingDateTime', `${selectedDate} 00:00:00`)
            .lt('bookingDateTime', `${selectedDate} 23:59:59`);

        if (error) {
            console.error(error);
            return;
        }

        const bookedTimes = data.map(item => moment(item.bookingDateTime).format('HH:mm:ss'));

        this.timeSlots = this.timeSlots.map(slot => ({
            ...slot,
            disabled: bookedTimes.includes(slot.value)
        }));
    },

    /* HANDLE SELECT TIME */
    handleSelectTime(time) {
      console.log(time)
        this.selectedTime = time
        const current = moment(this.bookingForm.bookingDateTime || new Date());
        const [hours, minutes] = time.split(':').map(Number);
        current.hours(hours).minutes(minutes).seconds(0);
        current.add(8, 'hours');
        this.bookingForm.bookingDateTime = current.toISOString();
        console.log(this.bookingForm.bookingDateTime);
    },

    /* SUBMIT FORM */
    async submitForm() {
      try {
        const isValid = await this.$refs.bookingFormRef.validate()
            
        if(!isValid) return

        if(this.title == 'Create Booking') {
          const payload = {
            serviceId: this.bookingForm.serviceId,
            bookingDateTime: this.bookingForm.bookingDateTime,
            status: 'confirmed',
            fullName: this.bookingForm.fullName,
            email: this.bookingForm.email,
            phone: this.bookingForm.phone,
          }

          const {data, error} = await supabase
            .from('Booking') 
            .insert(payload)

          if(error) throw error

          ElMessage.success('Booking submitted successfully.')
          this.clear()
          this.getBookings()
        }

        if(this.title == 'Edit Booking') {
          const payload = {
            serviceId: this.bookingForm.serviceId,
            bookingDateTime: this.bookingForm.bookingDateTime,
            status: 'confirmed',
            fullName: this.bookingForm.fullName,
            email: this.bookingForm.email,
            phone: this.bookingForm.phone,
          }

        }
      }
      catch(error){
        console.error(error)
      }
    },

    /* FORM CONTROLLER */
    formController(title, data) {
      this.title = title
      this.dialog.bookingForm = true

      if(title == 'Create Booking') {

      }

      if(title == 'Edit Booking') {
        this.bookingForm.serviceId = data.serviceId
        this.bookingForm.fullName = data.fullName
        this.bookingForm.email = data.email,
        this.bookingForm.phone = data.phone,

        this.handleSelectDate({date:moment(data.bookingDateTime).format('YYYY-MM-DD')})
        this.handleSelectTime(moment(data.bookingDateTime).format('HH:mm:ss'))
        console.log(moment(data.bookingDateTime).format('HH:mm:ss'))
      }
    },

    /* SEARCH BOOKING */
    searchBooking() {
      if (!this.debouncedSearch) {
        this.debouncedSearch = debounce(() => {
          this.getBookings()
        }, 500)
      }

      this.debouncedSearch(this.search.bookingName)
    },

    /* GET BOOKINGS */
    async getBookings() {
      try {
        this.loading = true;
        const limit = this.bookingPagination.elementsPerPage;
        const from = (this.bookingPagination.currentPage - 1) * limit;
        const to = from + limit - 1;

        let query = supabase
            .from('Booking')
            .select(`
              *,
              Service (
                id,
                name,
                description,
                price,
                dateTimeCreated
              )
            `, { count: 'exact' });

        if (this.search.bookingName && this.search.bookingName.trim() !== '') {
          const searchPattern = `%${this.search.bookingName}%`;
          
          query = query.or(`fullName.ilike.${searchPattern},email.ilike.${searchPattern},phone.ilike.${searchPattern}`);
        }

        query = query.order('dateTimeCreated', { ascending: false }).range(from, to);

        const { data, error, count } = await query;

        if (error) throw error;

        this.bookings = data.map((item) => ({
            id: item.id,
            status: item.status,
            fullName: item.fullName,
            bookingDateTime: moment(item.bookingDateTime).format('LLL'),
            email: item.email,
            phone: item.phone,
            dateTimeCreated: moment(item.dateTimeCreated).format('LLL'),
            Service: {
              id: item.Service.id,
              name: item.Service.name,
              price: item.Service.price,
              description: item.Service.description
            }
        }));

        this.bookingPagination.totalElements = count || 0
      }
      catch(error) {
        console.log(error)
      }
      finally {
        this.loading = false;
      }
    },

    /* SEARCH SERVICE */
    searchService(e) {
      if (!this.debouncedSearch) {
        this.debouncedSearch = debounce(() => {
          this.getServices()
        }, 500)
      }

      this.debouncedSearch(this.search.serviceName)
    },

    /* GET SERVICES */
    async getServices() {
      this.loading = true
      try {
        this.loading = true;
        const limit = this.servicePagination.elementsPerPage;
        const from = (this.servicePagination.currentPage - 1) * limit;
        const to = from + limit - 1;

        let query = supabase
            .from('Service')
            .select('*', { count: 'exact' })

        if (this.search.serviceName && this.search.serviceName.trim() !== '') {
            const searchPattern = `%${this.search.serviceName}%`;
          
          query = query.or(`fullName.ilike.${searchPattern},email.ilike.${searchPattern},phone.ilike.${searchPattern}`);
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

    /* DELETE BOOKING */
    async deleteBooking(bookingId) {
      try{
        await ElMessageBox.confirm( 'Do you want to delete this booking?', 'Warning', { confirmButtonText: 'OK', cancelButtonText: 'Cancel', type: 'warning', } )
        const { data, error } = await supabase
          .from('Booking')
          .delete()
          .eq('id', bookingId)

          if(error) throw error

          this.clear()
          this.getBookings()
          ElMessage.success('Booking deleted successfully.')
      }
      catch(error) {
      }
    },

    /* CLEAR */
    clear() {
      this.bookingForm.serviceId = ''
      this.bookingForm.clientId = ''
      this.bookingForm.bookingDateTime = ''
      this.bookingForm.status = 'confirmed'
      this.bookingForm.fullName = ''
      this.bookingForm.email = ''
      this.bookingForm.phone = ''
      this.bookingForm.noOfParticipants = 1
      this.vCalendarEvents = []
      this.selectedTime = ''

      this.dialog.bookingForm = false
    }
  },
  mounted() {
    this.getBookings()
  }
}
</script>


<style>
.el-form-item__content button.active { background: #409eff !important; color: #fff !important; }

.el-form-item__content button.disabled { color: #7f8c8d; opacity: 0.6; cursor: not-allowed; background-color: #ccc; }
</style>