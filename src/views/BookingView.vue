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
      </el-row>

      <el-card shadow="never" class="!rounded-lg !border-slate-200 !mt-5">
        <div class="flex justify-between items-center mb-6 gap-4">
          <el-input
            v-model="search.bookingName"
            placeholder="Search by booking..."
            class="w-96"
            :prefix-icon="Search"
            clearable
          />
          <el-button type="primary" color="#136cb3" class="font-semibold" @click="formController('Create Booking')">
            Create Booking
          </el-button>
        </div>

        <el-table class="!mt-5" :data="bookings" style="width: 100%" v-loading="loading" :row-class-name="tableRowClassName">
          <el-table-column label="Client" min-width="150">
            <template #default="scope">
              <div class="flex flex-col">
                <div class="font-bold text-slate-800 text-sm">{{ scope.row.fullName }}</div>
                <div class="text-xs text-slate-500 mt-0.5">
                  <a :href="`mailto:${scope.row.email}`" class="text-blue-500 no-underline hover:!underline">
                    {{ scope.row.email }}
                  </a>
                  |
                  <a :href="`tel:${scope.row.phone}`" class="text-blue-500 no-underline hover:!underline">
                    {{ scope.row.phone }}
                  </a>
                </div>
              </div>
            </template>
          </el-table-column>

          <el-table-column label="Service" min-width="80">
            <template #default="scope">
              <el-tooltip
                v-if="scope.row.Service"
                :content="scope.row.Service.description"
                placement="top"
                effect="dark"
              >
                <el-tag effect="plain" class="!border-[#136cb3] !text-[#136cb3] !font-bold !bg-white cursor-pointer">
                  {{ scope.row.Service.name }}
                </el-tag>
              </el-tooltip>
              
              <div v-if="scope.row.Service" class="text-xs text-slate-500 mt-1">
                Rate: ₱{{ scope.row.Service.price?.toLocaleString() }}
              </div>
            </template>
          </el-table-column>

          <el-table-column label="No of Participants" align="center">
            <template #default="scope">
              <div class="inline-flex items-center gap-2 bg-slate-100 !px-2 py-1 rounded-md text-slate-700 font-semibold text-sm">
                <span class="w-2 h-2 rounded-full bg-emerald-500"></span>
                <span>{{ scope.row.noOfParticipants }} pax</span>
              </div>
            </template>
          </el-table-column>

          <el-table-column label="Scheduled Date & Time" align="center">
            <template #default="scope">
              <div class="text-slate-800 font-medium text-sm flex flex-col items-center gap-1">
                <el-tag>{{ scope.row.formattedBookingDate }} {{ scope.row.formattedSlotTime }}</el-tag>
              </div>
            </template>
          </el-table-column>

          <el-table-column label="Status" width="140">
            <template #default="scope">
              <el-select 
                v-model="scope.row.statusId" 
                size="small" 
                @change="handleStatusChange(scope.row)"
              >
                <el-option 
                  v-for="status in statuses" 
                  :key="status.id" 
                  :label="status.name" 
                  :value="status.id" 
                />
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
          <div class="flex items-center gap-1.5 flex-wrap">
            <el-tag size="small" type="primary" effect="light" class="!font-semibold !text-[11px] !px-2">
              {{ upcomingBooking.formattedBookingDate }}  {{ upcomingBooking.formattedSlotTime }}
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

  <!-- BOOKING FORM DIALOG -->
  <el-dialog v-model="dialog.bookingForm" :title="title" center :before-close="clear">
    <el-form ref="bookingFormRef" @submit.prevent="submitForm" label-position="top" :model="bookingForm" v-loading="loading">
      
      <div class="grid grid-cols-2 gap-x-5">
        <el-form-item 
          label="Service"
          prop="serviceId"
          :rules="[
            { required: true, message: 'Please select service', trigger: 'change' },
          ]">
          <el-select 
            @focus="getServices('')" 
            filterable 
            :loading="loading" 
            placeholder="Select Service"
            v-model="bookingForm.serviceId"
          >
            <el-option v-for="service in services" :key="service.id" :label="service.name" :value="service.id"/>
          </el-select>
        </el-form-item>

        <el-form-item 
          label="Status"
          prop="statusId"
          :rules="[
            { required: true, message: 'Please select status', trigger: 'change' },
          ]">
          <el-select 
            placeholder="Select Status"
            v-model="bookingForm.statusId"
          >
            <el-option v-for="status in statuses" :key="status.id" :label="status.name" :value="status.id"/>
          </el-select>
        </el-form-item>
      </div>
      
      <div class="grid grid-cols-2 gap-5">
        <el-form-item class="!w-full" label="Preferred Date">
          <VCalendar expanded @dayclick="handleSelectDate" :min-date="new Date()" :attributes="vCalendarEvents"/>
        </el-form-item>
        <el-form-item class="!w-full" label="Preferred Time">
          <div class="grid grid-cols-3 gap-2 !w-full">
            <button
              type="button"
              v-for="slot in timeSlots"
              :key="slot.id"
              class="!w-full border border-[#ccc] rounded-[5px] py-2 px-4"
              :class="{ active: bookingForm.timeSlotId === slot.id, disabled: slot.disabled }"
              @click="!slot.disabled && handleSelectTime(slot.id)"
              :disabled="slot.disabled"
            >
              {{ slot.formattedTime }}
            </button>
          </div>
        </el-form-item>
      </div>

      <div class="grid grid-cols-2 gap-x-5 gap-y-0">
        <el-form-item 
          label="Full Name"
          prop="fullName"
          :rules="[
            { required: true, message: 'Please input full name', trigger: 'blur' },
          ]">
          <el-input v-model="bookingForm.fullName" placeholder="Enter Client Full Name"/>
        </el-form-item>

        <el-form-item 
          label="Email" 
          prop="email"
          :rules="[
            { required: true, message: 'Please input email address', trigger: 'blur' },
            { pattern: /^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$/, message: 'Please input correct email address', trigger: ['blur', 'change'] },
          ]">
          <el-input v-model="bookingForm.email" placeholder="Enter Client Email"/>
        </el-form-item>

        <el-form-item 
          label="Phone" 
          prop="phone"
          :rules="[
            { required: true, message: 'Please input phone number', trigger: 'blur' },
            { pattern: /^09\d{9}$/, message: 'Must be a valid PH mobile number starting with 09', trigger: ['blur', 'change'] }
          ]">
          <el-input v-model="bookingForm.phone" maxlength="11" placeholder="Enter Client Phone Number"/>
        </el-form-item>

        <el-form-item 
          label="No of Participants" 
          prop="noOfParticipants"
          :rules="[
            { required: true, message: 'Please input a digit', trigger: 'blur' },
          ]">
          <el-input-number v-model="bookingForm.noOfParticipants" :min="1" placeholder="Enter No of Participants"/>
        </el-form-item>
      </div>

      <div class="mt-5 flex justify-end">
        <el-button type="primary" @click="submitForm">Confirm</el-button>
      </div>
    </el-form>
  </el-dialog>
</template>

<script>
import { Search } from '@element-plus/icons-vue';
import { ElMessage, ElMessageBox } from 'element-plus';
import { supabase } from '@/utils/supabaseClient';
import moment from 'moment';
import debounce from 'lodash/debounce';
import { markRaw } from 'vue';

export default {
  name: 'BookingView',
  components: {
    Search: markRaw(Search)
  },
  data() {
    return {
      Search,
      title: '',
      loading: false,
      bookings: [],
      services: [],
      statuses: [],
      timeSlots: [],
      vCalendarEvents: [],
      upcomingBookings: [],
      selectedDateStr: '',
      metrics: {
        totalBookings: 0,
        pendingBookings: 0
      },
      bookingForm: {
        id: '',
        serviceId: '',
        bookingDate: '',
        timeSlotId: '',
        statusId: '',
        fullName: '',
        email: '',
        phone: '',
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
      }
    };
  },

  methods: {
    async fetchDashboardData() {
      this.loading = true;
      try {
        await Promise.all([
          this.getBookings(),
          this.getBookingMetrics(),
          this.getUpcomingBookings()
        ]);
      } catch (error) {
        console.error(error);
      } finally {
        this.loading = false;
      }
    },

    /* GET STATUSES */
    async getStatuses() {
      try {
        const { data, error } = await supabase.from('Status').select('*');
        if (error) throw error;
        this.statuses = data || [];
      } catch (error) {
        console.error('Error fetching statuses:', error);
      }
    },

    /* GET TIME SLOTS */
    async getTimeSlots() {
      try {
        const { data, error } = await supabase
          .from('TimeSlot')
          .select('*')
          .eq('isActive', true)
          .order('slotTime', { ascending: true });

        if (error) throw error;

        this.timeSlots = (data || []).map(slot => ({
          ...slot,
          formattedTime: moment(slot.slotTime, 'HH:mm:ss').format('h:mm A'),
          disabled: false
        }));
      } catch (error) {
        console.error('Error fetching time slots:', error);
      }
    },

    /* HANDLE SELECT DATE */
    async handleSelectDate(day) {
      try {
        const selected = moment(day.date).startOf('day');
        const today = moment().startOf('day');
        
        if (selected.isBefore(today) && this.title === 'Create Booking') {
          ElMessage.warning('Cannot select past date');
          return;
        }
        
        this.selectedDateStr = selected.format('YYYY-MM-DD');
        this.bookingForm.bookingDate = selected.toISOString();
        this.vCalendarEvents = [{
          highlight: { backgroundColor: '#ff8080' },
          dates: day.date instanceof Date ? day.date : new Date(day.date)
        }];
        
        const startOfDay = selected.format('YYYY-MM-DD 00:00:00');
        const endOfDay = selected.clone().endOf('day').format('YYYY-MM-DD 23:59:59');
        
        const { data, error } = await supabase
          .from('Booking')
          .select('timeSlotId')
          .gte('bookingDate', startOfDay)
          .lte('bookingDate', endOfDay);

        if (error) throw error;

        const bookedTimeSlotIds = new Set(data.map(item => item.timeSlotId));

        this.timeSlots = this.timeSlots.map(slot => ({
          ...slot,
          disabled: bookedTimeSlotIds.has(slot.id) && slot.id !== this.bookingForm.timeSlotId
        }));

      } catch (error) {
        console.error(error);
      }
    },

    /* HANDLE SELECT TIME */
    handleSelectTime(timeSlotId) {
      this.bookingForm.timeSlotId = timeSlotId;
    },

    /* HANDLE STATUS CHANGE IN TABLE */
    async handleStatusChange(row) {
      try {
        this.loading = true;
        const { error } = await supabase
          .from('Booking')
          .update({ statusId: row.statusId })
          .eq('id', row.id);

        if (error) throw error;

        ElMessage.success('Booking status updated successfully.');
        await this.fetchDashboardData();
      } catch (error) {
        console.error(error);
      } finally {
        this.loading = false;
      }
    },

    /* SUBMIT FORM */
    async submitForm() {
      try {
        if (!this.$refs.bookingFormRef) return;
        const isValid = await this.$refs.bookingFormRef.validate();
        if (!isValid) return;

        if (!this.bookingForm.bookingDate || !this.bookingForm.timeSlotId) {
          ElMessage.warning('Please select both a preferred date and time slot.');
          return;
        }

        this.loading = true;

        const payload = {
          serviceId: this.bookingForm.serviceId,
          statusId: this.bookingForm.statusId,
          bookingDate: this.bookingForm.bookingDate,
          timeSlotId: this.bookingForm.timeSlotId,
          fullName: this.bookingForm.fullName,
          email: this.bookingForm.email,
          phone: this.bookingForm.phone,
          noOfParticipants: this.bookingForm.noOfParticipants
        };

        if (this.title === 'Create Booking') {
          const { error } = await supabase.from('Booking').insert(payload);
          if (error) throw error;
          ElMessage.success('Booking submitted successfully.');
        } else if (this.title === 'Edit Booking') {
          const { error } = await supabase
            .from('Booking') 
            .update(payload)
            .eq('id', this.bookingForm.id);

          if (error) throw error;
          ElMessage.success('Booking updated successfully.');
        }

        this.clear();
        await this.fetchDashboardData();
      } catch (error) {
        console.error(error);
      } finally {
        this.loading = false;
      }
    },

    /* FORM CONTROLLER */
    async formController(dialogTitle, data) {
      try {
        this.title = dialogTitle;
        this.dialog.bookingForm = true;
        this.loading = true;

        await Promise.all([this.getServices(''), this.getTimeSlots()]);

        if (dialogTitle === 'Create Booking') {
          const pendingStatus = this.statuses.find(s => s.name?.toLowerCase() === 'pending');
          if (pendingStatus) this.bookingForm.statusId = pendingStatus.id;
        } else if (dialogTitle === 'Edit Booking' && data) {
          this.bookingForm.id = data.id;
          this.bookingForm.serviceId = data.Service?.id || data.serviceId;
          this.bookingForm.statusId = data.Status?.id || data.statusId;
          this.bookingForm.timeSlotId = data.timeSlotId;
          this.bookingForm.fullName = data.fullName;
          this.bookingForm.email = data.email;
          this.bookingForm.phone = data.phone;
          this.bookingForm.noOfParticipants = data.noOfParticipants;

          const datePart = moment(data.bookingDate).format('YYYY-MM-DD');
          await this.handleSelectDate({ date: datePart });
        }
      } catch (error) {
        console.error(error);
      } finally {
        this.loading = false;
      }
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
            Service ( id, name, description, price ),
            Status ( id, name, color ),
            TimeSlot ( id, slotTime )
          `, { count: 'exact' });

        if (this.search.bookingName && this.search.bookingName.trim() !== '') {
          const searchPattern = `%${this.search.bookingName.trim()}%`;
          query = query.or(`fullName.ilike.${searchPattern},email.ilike.${searchPattern},phone.ilike.${searchPattern}`);
        }

        query = query.order('dateTimeCreated', { ascending: false }).range(from, to);

        const { data, error, count } = await query;
        if (error) throw error;

        this.bookings = (data || []).map((item) => ({
          ...item,
          formattedBookingDate: moment(item.bookingDate).format('LL'),
          formattedSlotTime: item.TimeSlot?.slotTime ? moment(item.TimeSlot.slotTime, 'HH:mm:ss').format('h:mm A') : '',
          dateTimeCreated: moment(item.dateTimeCreated).format('LLL')
        }));

        this.bookingPagination.totalElements = count || 0;
      } catch (error) {
        console.error(error);
      } finally {
        this.loading = false;
      }
    },

    /* GET UPCOMING BOOKINGS */
    async getUpcomingBookings() {
      try {
        const startOfToday = moment().startOf('day').toISOString();

        const { data, error } = await supabase
          .from('Booking')
          .select(`
            *,
            TimeSlot ( id, slotTime )
          `)
          .gte('bookingDate', startOfToday)
          .order('bookingDate', { ascending: true });

        if (error) throw error;

        this.upcomingBookings = (data || []).map((item) => ({
          ...item,
          formattedBookingDate: moment(item.bookingDate).format('MMMM DD, YYYY'),
          formattedSlotTime: item.TimeSlot?.slotTime 
            ? moment(item.TimeSlot.slotTime, 'HH:mm:ss').format('h:mm A') 
            : ''
        }));
      } catch (error) {
        console.error(error);
      }
    },

    /* GET SERVICES */
    async getServices(searchValue = '') {
      try {
        let query = supabase.from('Service').select('*');

        if (searchValue !== '') {
          const searchPattern = `%${searchValue}%`;
          query = query.or(`name.ilike.${searchPattern},description.ilike.${searchPattern}`);
        }

        query = query.order('dateTimeCreated', { ascending: false });

        const { data, error } = await query;
        if (error) throw error;

        this.services = data || [];
      } catch (error) {
        console.error(error);
      }
    },

    /* DELETE BOOKING */
    async deleteBooking(bookingId) {
      try {
        await ElMessageBox.confirm('Do you want to delete this booking?', 'Warning', { 
          confirmButtonText: 'OK', 
          cancelButtonText: 'Cancel', 
          type: 'warning' 
        });

        const { error } = await supabase
          .from('Booking')
          .delete()
          .eq('id', bookingId);

        if (error) throw error;

        ElMessage.success('Booking deleted successfully.');
        await this.fetchDashboardData();
      } catch (error) {
        console.error(error);
      }
    },

    /* GET BOOKING METRICS */
    async getBookingMetrics() {
      try {
        const pendingStatus = this.statuses.find(s => s.name?.toLowerCase() === 'pending');
        
        const [totalBookings, totalPending] = await Promise.all([
          supabase.from('Booking').select('*', { count: 'exact', head: true }),
          pendingStatus 
            ? supabase.from('Booking').select('*', { count: 'exact', head: true }).eq('statusId', pendingStatus.id)
            : { count: 0, error: null },
        ]);

        if (totalBookings.error) throw totalBookings.error;

        this.metrics.totalBookings = totalBookings.count || 0;
        this.metrics.pendingBookings = totalPending.count || 0;
      } catch (error) {
        console.error(error);
      }
    },

    /* CLEAR FORM */
    clear(done) {
      Object.assign(this.bookingForm, {
        id: '',
        serviceId: '',
        bookingDate: '',
        timeSlotId: '',
        statusId: '',
        fullName: '',
        email: '',
        phone: '',
        noOfParticipants: 1
      });
      
      this.vCalendarEvents = [];
      this.selectedDateStr = '';

      this.timeSlots = this.timeSlots.map(slot => ({
        ...slot,
        disabled: false
      }));

      this.dialog.bookingForm = false;
      if (typeof done === 'function') done();
    },

    /* SET TABLE ROW CLASS NAME BASED ON STATUS NAME */
    tableRowClassName({ row }) {
      const statusName = row.Status?.name;
      if (statusName === 'Confirmed') return 'primary-row';
      if (statusName === 'Completed') return 'success-row';
      if (statusName === 'Pending') return 'warning-row';
      if (statusName === 'Cancelled') return 'danger-row';
      return '';
    }
  },
  created() {
    this.debouncedSearch = debounce(() => {
      this.getBookings();
    }, 500);
  },
  async mounted() {
    await this.getStatuses();
    await this.getTimeSlots();
    this.fetchDashboardData();
  },
  unmounted() {
    if (this.debouncedSearch) {
      this.debouncedSearch.cancel();
    }
  },
  watch: {
    'search.bookingName'() {
      this.debouncedSearch();
    }
  },
};
</script>

<style scoped>
:deep(.el-form-item__content button.active) { background: #409eff !important; color: #fff !important; }
:deep(.el-form-item__content button.disabled) { color: #7f8c8d; opacity: 0.6; cursor: not-allowed; background-color: #ccc; }
:deep(.el-table .primary-row) { --el-table-tr-bg-color: var(--el-color-primary-light-9); }
:deep(.el-table .success-row) { --el-table-tr-bg-color: var(--el-color-success-light-9); }
:deep(.el-table .warning-row) { --el-table-tr-bg-color: var(--el-color-warning-light-9); }
:deep(.el-table .danger-row) { --el-table-tr-bg-color: var(--el-color-danger-light-9); }
</style>