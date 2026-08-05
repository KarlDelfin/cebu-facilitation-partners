<template>
  <div class="!p-6 !bg-white !rounded-2xl !shadow-lg !font-sans">
    <!-- Main Calendar Component -->
    <FullCalendar ref="calendarRef" :options="calendarOptions" v-loading="loading" />

    <!-- Booking Details Dialog -->
    <el-dialog 
      v-model="detailsDialogVisible" 
      title="Booking Details" 
      width="420px" 
      center 
      destroy-on-close
    >
      <div v-if="selectedBooking" class="space-y-4 text-slate-700">
        <div class="flex items-center justify-between border-b pb-3">
          <span class="font-semibold text-slate-500">Status</span>
          <span 
            class="px-3 py-1 text-xs font-bold rounded-full text-white shadow-sm"
            :style="{ backgroundColor: selectedBooking.backgroundColor || '#3b82f6' }"
          >
            {{ selectedBooking.extendedProps.status }}
          </span>
        </div>

        <div class="grid grid-cols-3 gap-2 text-sm pt-1">
          <span class="text-slate-500 font-medium">Title / Client:</span>
          <span class="col-span-2 font-bold text-slate-800">{{ selectedBooking.title }}</span>

          <span class="text-slate-500 font-medium">Scheduled:</span>
          <span class="col-span-2 font-semibold text-slate-700">
            {{ formatBookingTime(selectedBooking.start) }}
          </span>

          <span class="text-slate-500 font-medium">Email:</span>
          <span class="col-span-2 text-slate-700 break-all">{{ selectedBooking.extendedProps.email || 'N/A' }}</span>

          <span class="text-slate-500 font-medium">Phone:</span>
          <span class="col-span-2 text-slate-700">{{ selectedBooking.extendedProps.phone || 'N/A' }}</span>

          <span class="text-slate-500 font-medium">Participants:</span>
          <span class="col-span-2 text-slate-700 font-semibold">
            {{ selectedBooking.extendedProps.noOfParticipants }} pax
          </span>
        </div>
      </div>

      <template #footer>
        <div class="flex justify-end gap-2">
          <el-button @click="detailsDialogVisible = false">Close</el-button>
        </div>
      </template>
    </el-dialog>
  </div>
</template>

<script>
import FullCalendar from '@fullcalendar/vue3';
import rrulePlugin from '@fullcalendar/rrule';
import dayGridPlugin from '@fullcalendar/daygrid';
import interactionPlugin from '@fullcalendar/interaction';
import timeGridPlugin from '@fullcalendar/timegrid';
import list from '@fullcalendar/list';
import moment from 'moment';
import { ElMessage } from 'element-plus';
import { supabase } from '@/utils/supabaseClient';

export default {
  name: 'CalendarView',
  components: {
    FullCalendar
  },
  data() {
    return {
      loading: false,
      detailsDialogVisible: false,
      selectedBooking: null,
      weekClicked: false,
      dayClicked: false,
      pickerKey: 0,
      today: new Date(),
      calendarOptions: {
        height: 720,
        plugins: [dayGridPlugin, interactionPlugin, timeGridPlugin, list, rrulePlugin],
        timeZone: 'UTC',
        editable: true, // Allows drag-and-drop rescheduling
        eventStartEditable: true,
        eventDurationEditable: false,
        views: {
          dayGridMonth: {
            dayMaxEventRows: 3,
            titleFormat: { year: 'numeric', month: 'long', day: 'numeric' },
          },
          timeGridWeek: {
            slotLabelFormat: {
              hour: '2-digit',
              minute: '2-digit',
              hour12: false,
            },
            eventTimeFormat: {
              hour: '2-digit',
              minute: '2-digit',
              hour12: false,
            },
          },
          timeGridDay: {
            slotLabelFormat: {
              hour: '2-digit',
              minute: '2-digit',
              hour12: false,
            },
          },
          listMonth: {
            eventTimeFormat: {
              hour: '2-digit',
              minute: '2-digit',
              hour12: false,
            },
          },
        },
        headerToolbar: {
          start: 'todayCustom,prevCustom,nextCustom',
          center: 'title',
          end: 'monthCustom,weekCustom,dayCustom,listCustom',
        },
        customButtons: {
          todayCustom: {
            text: 'today',
            click: () => this.handleTodayClick(),
          },
          prevCustom: {
            text: 'prev',
            click: () => this.handlePrevClick(),
          },
          nextCustom: {
            text: 'next',
            click: () => this.handleNextClick(),
          },
          monthCustom: {
            text: 'month',
            click: () => this.handleMonthClick(),
          },
          weekCustom: {
            text: 'week',
            click: () => this.handleWeekClick(),
          },
          dayCustom: {
            text: 'day',
            click: () => this.handleDayClick(),
          },
          listCustom: {
            text: 'list',
            click: () => this.handleListClick(),
          },
        },
        events: [],
        firstDay: 0,
        initialView: 'dayGridMonth',
        eventClick: this.handleEventClick,
        eventDrop: this.handleEventDrop,
        datesSet: this.handleDatesSet, // Fetch events dynamically on view/date change
        allDaySlot: false,
        eventLongPressDelay: 200,
        eventOverlap: true,
        forceEventDuration: true,
        displayEventTime: true,
        showNonCurrentDates: false,
      }
    };
  },
  computed: {
    calendarApi() {
      return this.$refs.calendarRef ? this.$refs.calendarRef.getApi() : null;
    }
  },
  methods: {
    /* FETCH CALENDAR EVENTS IN ACTIVE DATE RANGE */
    async fetchCalendarEvents(startDate, endDate) {
      let query = supabase
        .from('Booking')
        .select(`
          *,
          Service ( name ),
          Status ( name, color ),
          TimeSlot ( slotTime )
        `);

      // Filter query dynamically if date bounds are provided
      if (startDate && endDate) {
        query = query.gte('bookingDate', startDate).lte('bookingDate', endDate);
      }

      const { data, error } = await query;
      if (error) throw error;

      return (data || []).map((booking) => {
        const dateOnly = moment(booking.bookingDate).format('YYYY-MM-DD');
        const timeOnly = booking.TimeSlot?.slotTime || '00:00:00';
        const startDateTime = `${dateOnly}T${timeOnly}`;

        return {
          id: booking.id,
          title: `${booking.fullName} - ${booking.Service?.name || 'Booking'}`,
          start: startDateTime,
          end: moment(startDateTime).add(1, 'hour').toISOString(),
          backgroundColor: booking.Status?.color || '#3b82f6',
          borderColor: booking.Status?.color || '#3b82f6',
          extendedProps: {
            status: booking.Status?.name || 'Pending',
            phone: booking.phone,
            email: booking.email,
            noOfParticipants: booking.noOfParticipants
          }
        };
      });
    },

    /* CUSTOM EVENT CARD UI */

    /* AUTOMATIC DATES RANGE CHANGE HOOK */
    async handleDatesSet(dateInfo) {
      await this.loadBookings(dateInfo.startStr, dateInfo.endStr);
    },

    /* OPEN DETAILS DIALOG ON EVENT CLICK */
    handleEventClick(info) {
      this.selectedBooking = info.event;
      this.detailsDialogVisible = true;
    },

    /* DRAG & DROP RESCHEDULING */
    async handleEventDrop(info) {
      try {
        this.loading = true;
        const newBookingDate = moment(info.event.start).format('YYYY-MM-DDTHH:mm:ss');

        const { error } = await supabase
          .from('Booking')
          .update({ bookingDate: newBookingDate })
          .eq('id', info.event.id);

        if (error) throw error;

        ElMessage.success('Booking rescheduled successfully.');
      } catch (error) {
        console.error('Failed to reschedule booking:', error);
        ElMessage.error('Could not reschedule booking.');
        info.revert(); // Rollback calendar event to original position
      } finally {
        this.loading = false;
      }
    },

    /* LOAD BOOKINGS */
    async loadBookings(startDate, endDate) {
      try {
        this.loading = true;
        const events = await this.fetchCalendarEvents(startDate, endDate);

        if (this.calendarApi) {
          this.calendarApi.removeAllEventSources();
          this.calendarApi.addEventSource(events);
        } else {
          this.calendarOptions = {
            ...this.calendarOptions,
            events
          };
        }
      } catch (error) {
        console.error('Failed to load bookings:', error);
        ElMessage.error('Failed to load calendar events.');
      } finally {
        this.loading = false;
      }
    },

    /* DATE FORMATTER HELPER */
    formatBookingTime(dateString) {
      if (!dateString) return '';
      return moment(dateString).format('MMMM DD, YYYY - h:mm A');
    },

    /* CUSTOM NAVIGATION BUTTON HANDLERS */
    handleTodayClick() {
      this.pickerKey++;
      this.today = new Date();
      this.calendarApi?.today();
    },

    handlePrevClick() {
      this.pickerKey++;
      this.calendarApi?.prev();
    },

    handleNextClick() {
      this.pickerKey++;
      this.calendarApi?.next();
    },

    handleMonthClick() {
      this.weekClicked = false;
      this.dayClicked = false;
      this.calendarApi?.changeView('dayGridMonth');
    },

    handleWeekClick() {
      this.weekClicked = true;
      this.dayClicked = false;
      this.calendarApi?.changeView('timeGridWeek');
    },

    handleDayClick() {
      this.weekClicked = false;
      this.dayClicked = true;
      this.calendarApi?.changeView('timeGridDay');
    },

    handleListClick() {
      this.calendarApi?.changeView('listMonth');
    }
  }
};
</script>

<style scoped>
:deep(.fc-event) {
  border-radius: 6px !important;
  cursor: pointer;
}
:deep(.fc-h-event) {
  border: none !important;
}
</style>