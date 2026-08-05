import { supabase } from '@/utils/supabaseClient';
import { ElMessage, ElMessageBox } from 'element-plus';
import moment from 'moment';
import debounce from 'lodash/debounce';

export const bookingLogic = {
  data() {
    return {
      title: '',
      loading: false,
      bookings: [],
      services: [],
      vCalendarEvents: [],
      upcomingBookings: [],
      selectedTime: '',
      selectedDateStr: '',

      timeSlots: [
        { label: '9:00 AM', value: '09:00:00', disabled: false },
        { label: '10:00 AM', value: '10:00:00', disabled: false },
        { label: '11:00 AM', value: '11:00:00', disabled: false },
        { label: '12:00 PM', value: '12:00:00', disabled: false },
        { label: '1:00 PM', value: '13:00:00', disabled: false },
        { label: '2:00 PM', value: '14:00:00', disabled: false },
        { label: '3:00 PM', value: '15:00:00', disabled: false },
        { label: '4:00 PM', value: '16:00:00', disabled: false },
        { label: '5:00 PM', value: '17:00:00', disabled: false },
        { label: '6:00 PM', value: '18:00:00', disabled: false },
      ],

      metrics: {
        totalBookings: 0,
        pendingBookings: 0
      },

      bookingForm: {
        id: '',
        serviceId: '',
        bookingDateTime: '',
        status: 'pending',
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
      }, 

      servicePagination: {
        elementsPerPage: 10,
        currentPage: 1,
        totalElements: 0
      }, 
    };
  },

  created() {
    this.debouncedSearchBooking = debounce(() => {
      this.getBookings();
    }, 500);
  },

  methods: {
    async refreshAllData() {
      await Promise.all([
        this.getBookings(),
        this.getBookingMetrics(),
        this.getUpcomingBookings()
      ]);
    },

    async fetchDashboardData() {
      this.loading = true;
      try {
        await this.refreshAllData();
      } catch (error) {
        console.error('Error loading dashboard data:', error);
      } finally {
        this.loading = false;
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
        this.vCalendarEvents = [{
          highlight: { backgroundColor: '#ff8080' },
          dates: day.date instanceof Date ? day.date : new Date(day.date)
        }];
        
        const startOfDay = selected.format('YYYY-MM-DD HH:mm:ss');
        const endOfDay = selected.clone().endOf('day').format('YYYY-MM-DD HH:mm:ss');
        
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

        if (this.selectedTime) {
          this.handleSelectTime(this.selectedTime);
        }

      } catch (error) {
        console.error('Error fetching bookings:', error);
        ElMessage.error('Failed to load available times');
      }
    },

    /* HANDLE SELECT TIME */
    handleSelectTime(time) {
      this.selectedTime = time;
      if (!this.selectedDateStr) return;

      const fullDateTime = `${this.selectedDateStr}T${time}`;
      this.bookingForm.bookingDateTime = moment(fullDateTime).toISOString();
    },

    /* HANDLE STATUS CHANGE */
    async handleStatusChange(row) {
      try {
        this.loading = true;
        const { error } = await supabase
          .from('Booking')
          .update({ status: row.status })
          .eq('id', row.id);

        if (error) throw error;

        ElMessage.success('Booking status updated successfully.');
        await this.refreshAllData();
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
        const isValid = await this.$refs.bookingFormRef.validate();
        if (!isValid) return;

        if (!this.bookingForm.bookingDateTime) {
          ElMessage.warning('Please select both a preferred date and time.');
          return;
        }

        this.loading = true;

        const payload = {
          serviceId: this.bookingForm.serviceId,
          bookingDateTime: this.bookingForm.bookingDateTime,
          fullName: this.bookingForm.fullName,
          email: this.bookingForm.email,
          phone: this.bookingForm.phone,
          noOfParticipants: this.bookingForm.noOfParticipants
        };

        if (this.title === 'Create Booking') {
          payload.status = 'pending';
          const { error } = await supabase.from('Booking').insert(payload);
          if (error) throw error;
          ElMessage.success('Booking submitted successfully.');
        } else if (this.title === 'Edit Booking') {
          payload.status = this.bookingForm.status;
          const { error } = await supabase
            .from('Booking') 
            .update(payload)
            .eq('id', this.bookingForm.id);

          if (error) throw error;
          ElMessage.success('Booking updated successfully.');
        }

        this.clear();
        await this.refreshAllData();
      } catch (error) {
        console.error(error);
        ElMessage.error('Failed to submit booking.');
      } finally {
        this.loading = false;
      }
    },

    /* FORM CONTROLLER */
    async formController(title, data) {
      try {
        this.title = title;
        this.dialog.bookingForm = true;
        this.loading = true;

        await this.getServices('');

        if (title === 'Edit Booking' && data) {
          this.bookingForm.id = data.id;
          this.bookingForm.serviceId = data.Service?.id || data.serviceId;
          this.bookingForm.fullName = data.fullName;
          this.bookingForm.email = data.email;
          this.bookingForm.phone = data.phone;
          this.bookingForm.status = data.status;
          this.bookingForm.noOfParticipants = data.noOfParticipants;

          const datePart = moment(data.bookingDateTime).format('YYYY-MM-DD');
          const timePart = moment(data.bookingDateTime).format('HH:mm:ss');
          
          await this.handleSelectDate({ date: datePart });
          this.handleSelectTime(timePart);
        }
      } catch (error) {
        console.error(error);
      } finally {
        this.loading = false;
      }
    },

    /* SEARCH BOOKING */
    onSearchBookingInput() {
      this.debouncedSearchBooking();
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
          const searchPattern = `%${this.search.bookingName.trim()}%`;
          query = query.or(`fullName.ilike.${searchPattern},email.ilike.${searchPattern},phone.ilike.${searchPattern}`);
        }

        query = query.order('dateTimeCreated', { ascending: false }).range(from, to);

        const { data, error, count } = await query;
        if (error) throw error;

        this.bookings = (data || []).map((item) => ({
          id: item.id,
          status: item.status,
          fullName: item.fullName,
          bookingDateTime: moment(item.bookingDateTime).format('LLL'),
          email: item.email,
          phone: item.phone,
          dateTimeCreated: moment(item.dateTimeCreated).format('LLL'),
          noOfParticipants: item.noOfParticipants,
          Service: item.Service ? {
            id: item.Service.id,
            name: item.Service.name,
            price: item.Service.price,
            description: item.Service.description
          } : null
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
        const now = new Date().toISOString();
        const { data, error } = await supabase
          .from('Booking')
          .select('*')
          .gte('bookingDateTime', now)
          .order('bookingDateTime', { ascending: true });

        if (error) throw error;

        this.upcomingBookings = (data || []).map((item) => ({
          id: item.id,
          serviceId: item.serviceId,
          fullName: item.fullName,
          email: item.email,
          phone: item.phone,
          status: item.status,
          noOfParticipants: item.noOfParticipants,
          bookingDateTime: moment(item.bookingDateTime).format('MMMM DD, YYYY hh:mm A')
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

        this.services = (data || []).map((item) => ({
          id: item.id,
          name: item.name,
          description: item.description,
          price: item.price,
          dateTimeCreated: moment(item.dateTimeCreated).format('MMMM DD, YYYY HH:mm:ss')
        }));
      } catch (error) {
        console.error(error);
        ElMessage.error(`Error loading services: ${error.message}`);
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
        await this.refreshAllData();
      } catch (error) {
        if (error !== 'cancel') {
          console.error(error);
        }
      }
    },

    /* BOOKING METRICS */
    async getBookingMetrics() {
      try {
        const [totalBookings, totalPending] = await Promise.all([
          supabase.from('Booking').select('*', { count: 'exact', head: true }),
          supabase.from('Booking').select('*', { count: 'exact', head: true }).eq('status', 'pending'),
        ]);

        if (totalBookings.error) throw totalBookings.error;
        if (totalPending.error) throw totalPending.error;

        this.metrics.totalBookings = totalBookings.count || 0;
        this.metrics.pendingBookings = totalPending.count || 0;
      } catch (error) {
        console.error(error);
      }
    },

    /* CLEAR FORM */
    clear(done) {
      this.bookingForm = {
        id: '',
        serviceId: '',
        bookingDateTime: '',
        status: 'pending',
        fullName: '',
        email: '',
        phone: '',
        noOfParticipants: 1
      };
      this.vCalendarEvents = [];
      this.selectedTime = '';
      this.selectedDateStr = '';

      this.timeSlots = this.timeSlots.map(slot => ({
        ...slot,
        disabled: false
      }));

      this.dialog.bookingForm = false;
      if (typeof done === 'function') done();
    },

    tableRowClassName({ row }) {
      if (row.status === 'confirmed') return 'primary-row';
      if (row.status === 'completed') return 'success-row';
      if (row.status === 'pending') return 'warning-row';
      if (row.status === 'cancelled') return 'danger-row';
      return '';
    }
  }
};