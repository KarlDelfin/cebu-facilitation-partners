<template>
  <div class="flex w-full gap-x-4">
    <div class="space-y-6 w-[85%]">
      <el-row :gutter="20">
        <el-col :span="12">
          <el-card shadow="hover" class="!rounded-lg">
            <template #header>
              <span class="text-slate-500 font-semibold text-sm uppercase tracking-wider">Total Bookings</span>
            </template>
            <div class="text-3xl font-bold text-slate-800">{{ metrics.totalBookings.toLocaleString() }}</div>
          </el-card>
        </el-col>
        <el-col :span="12">
          <el-card shadow="hover" class="!rounded-lg">
            <template #header>
              <span class="text-slate-500 font-semibold text-sm uppercase tracking-wider">Pending Bookings</span>
            </template>
            <div class="text-3xl font-bold text-amber-500">{{ metrics.pendingBookings.toLocaleString() }}</div>
          </el-card>
        </el-col>
    <!-- <el-col :span="8">
          <el-card shadow="hover" class="!rounded-lg">
            <template #header>
              <span class="text-slate-500 font-semibold text-sm uppercase tracking-wider">Total Value</span>
            </template>
            <div class="text-3xl font-bold text-[#136cb3]">₱245,000</div>
          </el-card>
        </el-col> -->
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

        <el-table class="!mt-5" :data="bookings" style="width: 100%" v-loading="loading" :row-class-name="tableRowClassName">
          
        <!--   <el-table-column label="Date/Time Created" min-width="100">
            <template #default="scope">
              <div class="text-slate-800 font-medium text-sm">
                {{ scope.row.dateTimeCreated }}
              </div>
            </template>
          </el-table-column> -->

          <el-table-column label="Client" min-width="150">
            <template #default="scope">
              <div class="flex flex-col">
                <div class="font-bold text-slate-800 text-sm">{{ scope.row.fullName }}</div>
                <div class="text-xs text-slate-500 mt-0.5">
                  {{ scope.row.email }} | {{ scope.row.phone }}
                </div>
              </div>
            </template>
          </el-table-column>

          <el-table-column label="Service" min-width="80">
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

          <el-table-column label="No of Participants" align="center">
            <template #default="scope">
              <div class="inline-flex items-center gap-2 bg-slate-100 !px-2 py-1 rounded-md text-slate-700 font-semibold text-sm">
                <span class="w-2 h-2 rounded-full bg-emerald-500"></span> <!-- Status dot indicator -->
                <span>{{ scope.row.noOfParticipants }}</span>
              </div>
            </template>
          </el-table-column>

          <el-table-column label="Scheduled Date" align="center">
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
    <div v-loading="loading" class="w-[15%] rounded-xl bg-white !p-5 border border-slate-200 flex flex-col gap-4 shadow-sm">
      <div class="flex items-center justify-between border-b border-slate-100 pb-3">
        <div class="flex flex-col">
          <h3 class="font-bold text-slate-800 text-sm tracking-wide uppercase m-0">Upcoming Bookings</h3>
        </div>
        <span class="bg-[#136cb3]/10 text-[#136cb3] text-xs font-bold !px-2 py-0.5 rounded-full">
          {{ upcomingBookings.length }}
        </span>
      </div>

      <div class="flex flex-col divide-y divide-slate-100 overflow-y-auto max-h-[calc(100vh-200px)] custom-scrollbar !gap-y-4">
        <div 
          v-for="(upcomingBooking, index) in upcomingBookings" 
          :key="index"
          class="flex flex-col gap-2 py-3.5 first:pt-0 last:pb-0 group hover:bg-slate-50/50 transition-colors duration-150 rounded-lg px-1"
        >
          <div class="flex items-center gap-1.5">
            <el-tag size="small" type="primary" effect="light" class="!font-semibold !text-[11px] !px-2">
              {{ upcomingBooking.bookingDateTime }}
            </el-tag>
          </div>

          <div class="flex flex-col pl-0.5">
            <div class="font-bold text-slate-800 !text-xs group-hover:text-[#136cb3] transition-colors duration-150">
              {{ upcomingBooking.fullName }}
            </div>
            <div class="text-[11px] text-slate-500 !text-xs font-medium mt-0.5 break-all">
              {{ upcomingBooking.email }}
            </div>
            <div class="text-[11px] text-slate-400 !text-xs font-medium mt-0.5">
              {{ upcomingBooking.phone }}
            </div>
          </div>
        </div>

        <div v-if="upcomingBookings.length === 0" class="text-center py-8 flex flex-col items-center justify-center gap-2">
          <el-empty description="No bookings yet."/>
        </div>
      </div>
    </div>
  </div>

  <!-- BOOKING FORM -->
  <el-dialog v-model="dialog.bookingForm" :title="title" center :before-close="clear">
    <el-form ref="bookingFormRef" @submit.prevent="submitForm" label-position="top" :model="bookingForm" v-loading="loading">
      <el-form-item 
        label="Service"
        prop="serviceId"
        :rules="[
          { required: true, message: 'Please select service', trigger: 'blur', },
        ]">
        <el-select 
          @click="getServices('')" 
          filterable 
          @input="searchService" 
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
            { pattern: /^09\d{9}$/, message: 'Must be a valid PH mobile number starting with 09', trigger: ['blur', 'change'] }
          ]">
          <el-input v-model="bookingForm.phone" maxlength="11" placeholder="Enter Client Phone Number"/>
        </el-form-item>

        <el-form-item 
          label="No of Participants" 
          prop="noOfParticipants"
          :rules="[
            { required: true, message: 'Please input a digit', trigger: 'blur', },
          ]">
          <el-input-number v-model="bookingForm.noOfParticipants" placeholder="Enter No of Participants"/>
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
import { markRaw } from 'vue'
import { throttle } from 'lodash';

export default {
  data() {
    return {
      title: '',
      loading: false,
      SearchIcon: markRaw(Search),
      bookings: [],
      services: [],
      vCalendarEvents: [],
      upcomingBookings: [],
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

      metrics: {
        totalBookings: 0,
        pendingBookings: 0
      },

      bookingForm: {
        id: '',
        serviceId: '',
        bookingDateTime: '',
        status: '',
        fullName: '',
        email: '',
        phone: '',
        status: 'pending',
        noOfParticipants: 1
      },

      dialog: {
        bookingForm: false
      },

      search: {
        bookingName: '',
        serviceName: ''
      },

      bookingPagination: {
        elementsPerPage: 5,
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
        try {
          const selected = moment(day.date).startOf('day');
          const today = moment().startOf('day');
          
          if (selected.isBefore(today) && this.title === 'Create Booking') {
              ElMessage.warning('Cannot select past date');
              return;
          }
          
          this.bookingForm.bookingDateTime = selected.format('YYYY-MM-DD');
          this.vCalendarEvents = [{
              highlight: { backgroundColor: '#ff8080' },
              dates: day.date instanceof Date ? day.date : new Date(day.date)
          }];
          
          const startOfDay = selected.format('YYYY-MM-DD HH:mm:ss');
          const endOfDay = selected.endOf('day').format('YYYY-MM-DD HH:mm:ss');
          
          const { data, error } = await supabase
              .from('Booking')
              .select('bookingDateTime')
              .gte('bookingDateTime', startOfDay)
              .lt('bookingDateTime', endOfDay);

          if (error) throw error;

          const bookedTimes = new Set(
              data.map(item => moment(item.bookingDateTime).format('HH:mm:ss'))
          );

          this.timeSlots = this.timeSlots.map(slot => ({
              ...slot,
              disabled: bookedTimes.has(slot.value)
          }));

        } catch (error) {
            console.error('Error fetching bookings:', error);
            ElMessage.error('Failed to load available times');
        }
    },

    /* HANDLE SELECT TIME */
    handleSelectTime(time) {
        this.selectedTime = time
        const current = moment(this.bookingForm.bookingDateTime || new Date());
        const [hours, minutes] = time.split(':').map(Number);
        current.hours(hours).minutes(minutes).seconds(0);
        current.add(8, 'hours');
        this.bookingForm.bookingDateTime = current.toISOString();
    },

    /* HANDLE STATUS CHANGE */
    async handleStatusChange(row) {
      try {
        this.loading = true;
        const { data, error } = await supabase
          .from('Booking')
          .update({ status: row.status })
          .eq('id', row.id);

        if (error) throw error;

        ElMessage.success('Booking status updated successfully.');
        this.getBookings();
        this.getBookingMetrics();
      } catch (error) {
        console.error(error);
        ElMessage.error(`Error updating booking status: ${error.message}`);
      } finally {
        this.loading = false;
      }
    },

    /* SUBMIT FORM */
    async submitForm() {
      try {
        this.loading = true

        const isValid = await this.$refs.bookingFormRef.validate()
            
        if(!isValid) return

        if(this.title == 'Create Booking') {
          const payload = {
            serviceId: this.bookingForm.serviceId,
            bookingDateTime: this.bookingForm.bookingDateTime,
            status: 'pending',
            fullName: this.bookingForm.fullName,
            email: this.bookingForm.email,
            phone: this.bookingForm.phone,
            noOfParticipants: this.bookingForm.noOfParticipants
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
            status: this.bookingForm.status,
            fullName: this.bookingForm.fullName,
            email: this.bookingForm.email,
            phone: this.bookingForm.phone,
            noOfParticipants: this.bookingForm.noOfParticipants
          }

          const {data, error} = await supabase
            .from('Booking') 
            .update(payload)
            .eq('id', this.bookingForm.id)

          if(error) throw error

          ElMessage.success('Booking updated successfully.')
          this.clear()
          this.getBookings()
        }
      }
      catch(error){
        console.error(error)
      }
      finally {
        this.loading = false
      }
    },

    /* FORM CONTROLLER */
    async formController(title, data) {
      try{
        this.title = title
        this.dialog.bookingForm = true
        this.loading = true

        if(title == 'Create Booking') {

        }

        if(title == 'Edit Booking') {
          this.bookingForm.id = data.id;
          this.bookingForm.serviceId = data.Service.id;
          this.bookingForm.fullName = data.fullName;
          this.bookingForm.email = data.email;
          this.bookingForm.phone = data.phone;

          this.handleSelectDate({ date: moment(data.bookingDateTime).format('YYYY-MM-DD') });
          this.handleSelectTime(moment(data.bookingDateTime).format('HH:mm:ss'));

          const { data: serviceData, error } = await supabase
            .from('Service')
            .select('*')
            .eq('id', data.Service.id);

          if (error) throw error
          
          this.services = serviceData
        }
      }
      catch(error) {
        console.error(error)
      }
      finally {
        this.loading = false
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
            noOfParticipants: item.noOfParticipants,
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
        console.error(error)
      }
      finally {
        this.loading = false;
      }
    },

    /* GET UPCOMING BOOKINGS */
    async getUpcomingBookings(searchValue = '') {
      this.loading = true;
      try {

        let query = supabase
          .from('Booking')
          .select('*', { count: 'exact' });

        const now = new Date();
        query = query.gte('bookingDateTime', now.toISOString());

        if (searchValue !== '') {
          const searchPattern = `%${searchValue}%`;
          query = query.or(`fullName.ilike.${searchPattern},email.ilike.${searchPattern}`);
        }

        query = query.order('bookingDateTime', { ascending: true });

        const { data, error, count } = await query;

        if (error) throw error;

        this.upcomingBookings = data.map((item) => ({
          id: item.id,
          serviceId: item.serviceId,
          fullName: item.fullName,
          email: item.email,
          phone: item.phone,
          status: item.status,
          noOfParticipants: item.noOfParticipants,
          bookingDateTime: moment(item.bookingDateTime).format('MMMM DD, YYYY hh:mm A')
        }));
      }
      catch (error) {
        console.error(error);
      } finally {
        this.loading = false;
      }
    },

    /* SEARCH SERVICE */
    searchService(e) {
      if (!this.debouncedSearch) {
        this.debouncedSearch = debounce(() => {
          this.getServices(e.target.value)
        }, 500)
      }

      this.debouncedSearch()
    },

    /* GET SERVICES */
    async getServices(searchValue) {
      this.loading = true
      try {
        this.loading = true;
        const limit = this.servicePagination.elementsPerPage;
        const from = (this.servicePagination.currentPage - 1) * limit;
        const to = from + limit - 1;

        let query = supabase
            .from('Service')
            .select('*', { count: 'exact' })

        if (searchValue !== '') {
          const searchPattern = `%${searchValue}%`;
          
          query = query.or(`name.ilike.${searchPattern},description.ilike.${searchPattern}`);
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
        throw error
      }
    },

    /* BOOKING METRICS */
    async getBookingMetrics() {
      try {
        const [totalBookings, totalPending, totalValue] = await Promise.all([
          supabase.from('Booking').select('*', { count: 'exact', head: true }),
          supabase.from('Booking').select('*', { count: 'exact', head: true }).eq('status', 'pending'),
        ]);

        if (totalBookings.error) throw totalBookings.error;
        if (totalPending.error) throw totalPending.error;

        this.metrics.totalBookings = totalBookings.count || 0;
        this.metrics.pendingBookings = totalPending.count || 0;

      } catch (error) {
        console.error(error)
      }
    },

    /* CLEAR */
    clear() {
      this.bookingForm.serviceId = ''
      this.bookingForm.clientId = ''
      this.bookingForm.bookingDateTime = ''
      this.bookingForm.status = 'pending'
      this.bookingForm.fullName = ''
      this.bookingForm.email = ''
      this.bookingForm.phone = ''
      this.bookingForm.noOfParticipants = 1
      this.vCalendarEvents = []
      this.selectedTime = ''

      this.timeSlots = this.timeSlots.map(slot => ({
          ...slot,
          disabled: false
      }));

      this.dialog.bookingForm = false
    },

    tableRowClassName({ row }) {
      if (row.status === 'confirmed') {
        return 'primary-row'
      }
      if (row.status === 'completed') {
        return 'success-row'
      }
      if (row.status === 'pending') {
        return 'warning-row'
      }
      if (row.status === 'cancelled') {
        return 'danger-row'
      }
    },
    async fetchDashboardData() {
      this.loading = true;
      try {
        await Promise.all([
          this.getBookings(),
          this.getBookingMetrics(),
          this.getUpcomingBookings()
        ]);
      } catch (error) {
        console.error("Error loading dashboard data:", error);
      } finally {
        this.loading = false;
      }
    }
  },
  created() {
    this.throttledFetchDashboard = throttle(this.fetchDashboardData, 3000, {
      leading: true,
      trailing: false,
    });
  },
  async mounted() {
    await this.throttledFetchDashboard();
  }
}
</script>


<style>
.el-form-item__content button.active { background: #409eff !important; color: #fff !important; }

.el-form-item__content button.disabled { color: #7f8c8d; opacity: 0.6; cursor: not-allowed; background-color: #ccc; }

.el-table .primary-row {
  --el-table-tr-bg-color: var(--el-color-primary-light-9);
}
.el-table .success-row {
  --el-table-tr-bg-color: var(--el-color-success-light-9);
}
.el-table .warning-row {
  --el-table-tr-bg-color: var(--el-color-warning-light-9);
}
.el-table .danger-row {
  --el-table-tr-bg-color: var(--el-color-danger-light-9);
}

</style>