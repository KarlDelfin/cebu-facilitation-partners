import { defineStore } from 'pinia';
import { supabase } from '@/utils/supabaseClient';
import moment from 'moment';

export const useBookingStore = defineStore('booking', {
  state: () => ({
    loading: false,
    bookings: [],
    services: [],
    statuses: [],
    timeSlots: [],
    upcomingBookings: [],
    metrics: {
      totalBookings: 0,
      pendingBookings: 0
    },
    search: {
      bookingName: ''
    },
    bookingPagination: {
      elementsPerPage: 5,
      currentPage: 1,
      totalElements: 0
    }
  }),

  actions: {
    async fetchDashboardData() {
      this.loading = true;
      try {
        await Promise.all([
          this.getStatuses(),
          this.getTimeSlots(),
          this.getBookings(),
          this.getUpcomingBookings()
        ]);
        // Call metrics after statuses are available
        await this.getBookingMetrics();
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
      } finally {
        this.loading = false;
      }
    },

    async getStatuses() {
      try {
        const { data, error } = await supabase.from('Status').select('*');
        if (error) throw error;
        this.statuses = data || [];
      } catch (error) {
        console.error('Error fetching statuses:', error);
      }
    },

    async getTimeSlots() {
      try {
        const { data, error } = await supabase
          .from('TimeSlot')
          .select('*')
          .eq('isActive', true)
          .order('slotTime', { ascending: true });

        if (error) throw error;

        this.timeSlots = (data || []).map((slot) => ({
          ...slot,
          formattedTime: moment(slot.slotTime, 'HH:mm:ss').format('h:mm A'),
          disabled: false
        }));
      } catch (error) {
        console.error('Error fetching time slots:', error);
      }
    },

    async getBookings() {
      try {
        this.loading = true;
        const limit = this.bookingPagination.elementsPerPage;
        const from = (this.bookingPagination.currentPage - 1) * limit;
        const to = from + limit - 1;

        let query = supabase
          .from('Booking')
          .select(
            `
            *,
            Service ( id, name, description, price ),
            Status ( id, name, color ),
            TimeSlot ( id, slotTime )
          `,
            { count: 'exact' }
          );

        if (this.search.bookingName && this.search.bookingName.trim() !== '') {
          const searchPattern = `%${this.search.bookingName.trim()}%`;
          query = query.or(
            `fullName.ilike.${searchPattern},email.ilike.${searchPattern},phone.ilike.${searchPattern}`
          );
        }

        query = query.order('dateTimeCreated', { ascending: false }).range(from, to);

        const { data, error, count } = await query;
        if (error) throw error;

        this.bookings = (data || []).map((item) => ({
          ...item,
          formattedBookingDate: moment(item.bookingDate).format('LL'),
          formattedSlotTime: item.TimeSlot?.slotTime
            ? moment(item.TimeSlot.slotTime, 'HH:mm:ss').format('h:mm A')
            : '',
          dateTimeCreated: moment(item.dateTimeCreated).format('LLL')
        }));

        this.bookingPagination.totalElements = count || 0;
      } catch (error) {
        console.error('Error fetching bookings:', error);
      } finally {
        this.loading = false;
      }
    },

    async getUpcomingBookings() {
      try {
        const startOfToday = moment().startOf('day').toISOString();

        const { data, error } = await supabase
          .from('Booking')
          .select(
            `
            *,
            TimeSlot ( id, slotTime )
          `
          )
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
        console.error('Error fetching upcoming bookings:', error);
      }
    },

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
        console.error('Error fetching services:', error);
      }
    },

    async getBookingMetrics() {
      try {
        const pendingStatus = this.statuses.find(
          (s) => s.name?.toLowerCase() === 'pending'
        );

        const [totalBookings, totalPending] = await Promise.all([
          supabase.from('Booking').select('*', { count: 'exact', head: true }),
          pendingStatus
            ? supabase
                .from('Booking')
                .select('*', { count: 'exact', head: true })
                .eq('statusId', pendingStatus.id)
            : { count: 0, error: null }
        ]);

        if (totalBookings.error) throw totalBookings.error;

        this.metrics.totalBookings = totalBookings.count || 0;
        this.metrics.pendingBookings = totalPending.count || 0;
      } catch (error) {
        console.error('Error fetching booking metrics:', error);
      }
    }
  }
});