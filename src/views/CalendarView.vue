<template>
  <div class="!p-6 !bg-white !rounded-2xl !shadow-lg !font-sans">
    <!-- Main Calendar Component -->
    <FullCalendar ref="calendarRef" :options="calendarOptions" v-loading="loading" />

    <!-- Booking Details Dialog -->
    <el-dialog 
      v-model="detailsDialogVisible" 
      title="Booking Details" 
      width="440px" 
      center 
      destroy-on-close
    >
      <div v-if="selectedBooking" v-loading="slotLoading" class="space-y-4 text-slate-700">
        <div class="flex items-center justify-between border-b pb-3">
          <span class="font-semibold text-slate-500">Status</span>
          <span 
            class="!px-3 !py-1 text-xs font-bold rounded-full text-white shadow-sm"
            :style="{ backgroundColor: selectedBooking.backgroundColor || '#136cb3' }"
          >
            {{ selectedBooking.extendedProps.status }}
          </span>
        </div>

        <div class="grid grid-cols-3 gap-2 text-sm pt-1 items-center">
          <span class="text-slate-500 font-medium">Title / Client:</span>
          <span class="col-span-2 font-bold text-slate-800">{{ selectedBooking.title }}</span>

          <span class="text-slate-500 font-medium">Scheduled Date:</span>
          <span class="col-span-2 font-semibold text-slate-700 flex flex-col gap-2">
            <div>{{ formatBookingTime(selectedBooking.start) }}</div>
            <el-select
              v-model="selectedSlotId"
              placeholder="Select a time slot"
              class="w-full"
              size="large"
              @change="handleSlotChange"
            >
              <el-option
                v-for="slot in availableSlots"
                :key="slot.id"
                :label="slot.formattedLabel"
                :value="slot.id"
                :disabled="slot.disabled"
              >
                <div class="flex items-center justify-between">
                  <span>{{ slot.formattedLabel }}</span>
                  <span v-if="slot.disabled" class="text-xs text-red-500 font-semibold">Booked</span>
                </div>
              </el-option>
            </el-select>
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

    <!-- Reschedule / Drag & Drop Select Time Slot Dialog -->
    <el-dialog
      v-model="rescheduleDialogVisible"
      title="Select Time Slot"
      width="440px"
      center
      :before-close="handleRescheduleCancel"
    >
      <div v-loading="slotLoading" class="space-y-4">
        <p class="text-sm text-slate-600">
          Target Date: <strong class="text-slate-800">{{ targetDateFormatted }}</strong>
        </p>

        <div class="space-y-2">
          <label class="block text-sm font-medium text-slate-700">Available Time Slots:</label>
          <el-select
            v-model="selectedSlotId"
            placeholder="Select a time slot"
            class="w-full"
            size="large"
          >
            <el-option
              v-for="slot in availableSlots"
              :key="slot.id"
              :label="slot.formattedLabel"
              :value="slot.id"
              :disabled="slot.disabled"
            >
              <div class="flex items-center justify-between">
                <span>{{ slot.formattedLabel }}</span>
                <span v-if="slot.disabled" class="text-xs text-red-500 font-semibold">Booked</span>
              </div>
            </el-option>
          </el-select>
        </div>
      </div>

      <template #footer>
        <div class="flex justify-end gap-2">
          <el-button @click="handleRescheduleCancel">Cancel</el-button>
          <el-button 
            type="primary" 
            :loading="savingReschedule" 
            :disabled="!selectedSlotId" 
            @click="confirmReschedule"
          >
            Confirm Reschedule
          </el-button>
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

      // Reschedule / Slot State Variables
      rescheduleDialogVisible: false,
      slotLoading: false,
      savingReschedule: false,
      pendingDropInfo: null,
      targetDate: '',
      selectedSlotId: null,
      availableSlots: [],

      weekClicked: false,
      dayClicked: false,
      pickerKey: 0,
      today: new Date(),
      calendarOptions: {
        height: 720,
        plugins: [dayGridPlugin, interactionPlugin, timeGridPlugin, list, rrulePlugin],
        timeZone: 'UTC',
        editable: true,
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
        datesSet: this.handleDatesSet,
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
    },
    targetDateFormatted() {
      return this.targetDate ? moment(this.targetDate).format('MMMM DD, YYYY') : '';
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
          TimeSlot ( id, slotTime )
        `);

      if (startDate && endDate) {
        query = query.gte('bookingDate', startDate).lte('bookingDate', endDate);
      }

      const { data, error } = await query;
      if (error) throw error;

      return (data || []).map((booking) => {
        const dateOnly = moment(booking.bookingDate).format('YYYY-MM-DD');
        const timeOnly = booking.TimeSlot?.slotTime || '00:00:00';
        const startDateTime = `${dateOnly}T${timeOnly}`;

        const cardColor = booking.Status?.color || '#136cb3';

        return {
          id: booking.id,
          title: `${booking.fullName} - ${booking.Service?.name || 'Booking'}`,
          start: startDateTime,
          end: moment(startDateTime).add(1, 'hour').toISOString(),
          backgroundColor: cardColor,
          borderColor: cardColor,
          textColor: '#ffffff',
          extendedProps: {
            status: booking.Status?.name || 'Pending',
            phone: booking.phone,
            email: booking.email,
            noOfParticipants: booking.noOfParticipants,
            timeSlotId: booking.timeSlotId || booking.TimeSlot?.id,
            bookingDate: dateOnly
          }
        };
      });
    },

    /* AUTOMATIC DATES RANGE CHANGE HOOK */
    async handleDatesSet(dateInfo) {
      await this.loadBookings(dateInfo.startStr, dateInfo.endStr);
    },

    /* OPEN DETAILS DIALOG ON EVENT CLICK AND LOAD TIME SLOTS */
    async handleEventClick(info) {
      this.selectedBooking = info.event;
      this.selectedSlotId = info.event.extendedProps.timeSlotId;
      this.detailsDialogVisible = true;

      const dateStr = info.event.extendedProps.bookingDate;
      await this.loadTimeSlotsForTargetDate(dateStr, info.event.id);
    },

    /* AUTOMATICALLY UPDATE TIME SLOT ON SELECT CHANGE */
    async handleSlotChange(newSlotId) {
      if (!this.selectedBooking || !newSlotId) return;

      try {
        this.slotLoading = true;
        const bookingId = this.selectedBooking.id;

        const { error } = await supabase
          .from('Booking')
          .update({ timeSlotId: newSlotId })
          .eq('id', bookingId);

        if (error) throw error;

        ElMessage.success('Booking time slot updated successfully.');

        // Update local event prop
        this.selectedBooking.setExtendedProp('timeSlotId', newSlotId);

        // Refresh calendar view
        if (this.calendarApi) {
          const view = this.calendarApi.view;
          await this.loadBookings(view.activeStart.toISOString(), view.activeEnd.toISOString());
        }
      } catch (error) {
        console.error('Failed to update booking slot:', error);
        ElMessage.error('Failed to update booking time slot.');
      } finally {
        this.slotLoading = false;
      }
    },

    /* DRAG & DROP INTERCEPTION & SLOT DIALOG TRIGGER */
    async handleEventDrop(info) {
      if (new Date(info.event.startStr) < new Date().setHours(0,0,0,0)) {
        ElMessage.warning('Cannot move booking on past dates.')
        info.revert();
        return
      }
      this.pendingDropInfo = info;
      this.targetDate = moment(info.event.start).format('YYYY-MM-DD');
      this.rescheduleDialogVisible = true;

      await this.loadTimeSlotsForTargetDate(this.targetDate, info.event.id);
    },

    /* FETCH TIME SLOTS & DISABLE TAKEN ONES */
    async loadTimeSlotsForTargetDate(dateStr, currentBookingId) {
      try {
        this.slotLoading = true;

        const { data: slots, error: slotsErr } = await supabase
          .from('TimeSlot')
          .select('*')
          .order('slotTime', { ascending: true });

        if (slotsErr) throw slotsErr;

        const { data: existingBookings, error: bookingsErr } = await supabase
          .from('Booking')
          .select('id, timeSlotId')
          .eq('bookingDate', dateStr);

        if (bookingsErr) throw bookingsErr;

        const takenSlotIds = (existingBookings || [])
          .filter(b => String(b.id) !== String(currentBookingId))
          .map(b => b.timeSlotId);

        this.availableSlots = (slots || []).map(slot => {
          const isTaken = takenSlotIds.includes(slot.id);
          const formattedTime = moment(slot.slotTime, 'HH:mm:ss').format('h:mm A');

          return {
            ...slot,
            formattedLabel: formattedTime,
            disabled: isTaken
          };
        });
      } catch (error) {
        console.error('Failed to load slots:', error);
        ElMessage.error('Could not load time slots.');
      } finally {
        this.slotLoading = false;
      }
    },

    /* CONFIRM RESCHEDULE AND UPDATE SUPABASE */
    async confirmReschedule() {
      if (!this.selectedSlotId || !this.pendingDropInfo) return;

      try {
        this.savingReschedule = true;
        const bookingId = this.pendingDropInfo.event.id;

        const { error } = await supabase
          .from('Booking')
          .update({
            bookingDate: this.targetDate,
            timeSlotId: this.selectedSlotId
          })
          .eq('id', bookingId);

        if (error) throw error;

        ElMessage.success('Booking rescheduled successfully.');
        this.rescheduleDialogVisible = false;
        this.pendingDropInfo = null;

        if (this.calendarApi) {
          const view = this.calendarApi.view;
          await this.loadBookings(view.activeStart.toISOString(), view.activeEnd.toISOString());
        }
      } catch (error) {
        console.error('Reschedule failed:', error);
        ElMessage.error('Failed to reschedule booking.');
        this.handleRescheduleCancel();
      } finally {
        this.savingReschedule = false;
      }
    },

    /* CANCEL RESCHEDULE AND REVERT EVENT POSITION */
    handleRescheduleCancel() {
      if (this.pendingDropInfo) {
        this.pendingDropInfo.revert();
        this.pendingDropInfo = null;
      }
      this.rescheduleDialogVisible = false;
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
      return moment(dateString).format('MMMM DD, YYYY');
    },

    /* NAVIGATION BUTTON HANDLERS */
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
  border: none !important;
  background-color: transparent !important;
  cursor: pointer;
}

:deep(.fc-event-main) {
  padding: 0 !important;
  background-color: transparent !important;
}

:deep(.fc-h-event) {
  background-color: transparent !important;
  border: none !important;
}
</style>