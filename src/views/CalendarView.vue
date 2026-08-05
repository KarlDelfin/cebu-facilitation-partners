<template>
  <div class="!p-6 !bg-white !rounded-2xl !shadow-lg !font-sans">
    <!-- Component Shell -->
    <FullCalendar ref="refCalendar" :options="calendarOptions" v-loading="loading"/>
  </div>
</template>

<script>
import FullCalendar from '@fullcalendar/vue3'
import rrulePlugin from '@fullcalendar/rrule'
import dayGridPlugin from '@fullcalendar/daygrid'
import interactionPlugin from '@fullcalendar/interaction'
import timeGridPlugin from '@fullcalendar/timegrid'
import list from '@fullcalendar/list'
import moment from 'moment'
import { fetchCalendarEvents } from '@/services/calendarLogic'

export default {
  name: 'CalendarView',
  components: { FullCalendar },
  data() {
    return {
      loading: false,
      calendarApi: null,
      weekClicked: false,
      dayClicked: false,
      pickerKey: 0,
      today: new Date(),

      calendarOptions: {
        height: 700,
        plugins: [dayGridPlugin, interactionPlugin, timeGridPlugin, list, rrulePlugin],
        timeZone: 'UTC',
        views: {
          dayGridMonth: {
            dayMaxEventRows: 2,
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
            click: () => {
              this.pickerKey++
              this.today = new Date()
              this.calendarApi.today()
            },
          },
          prevCustom: {
            text: 'prev',
            click: () => {
              this.pickerKey++
              this.calendarApi.prev()
              const currentDate = moment(this.calendarApi.getDate()).format()
              this.calendarApi.gotoDate(currentDate)
            },
          },
          nextCustom: {
            text: 'next',
            click: () => {
              this.pickerKey++
              this.calendarApi.next()
              const currentDate = moment(this.calendarApi.getDate()).format()
              this.calendarApi.gotoDate(currentDate)
            },
          },
          monthCustom: {
            text: 'month',
            click: () => {
              this.weekClicked = false
              this.dayClicked = false
              this.calendarApi.changeView('dayGridMonth')
            },
          },
          weekCustom: {
            text: 'week',
            click: () => {
              this.weekClicked = true
              this.dayClicked = false
              this.calendarApi.changeView('timeGridWeek')
            },
          },
          dayCustom: {
            text: 'day',
            click: () => {
              this.weekClicked = false
              this.dayClicked = true
              this.calendarApi.changeView('timeGridDay')
            },
          },
          listCustom: {
            text: 'list',
            click: () => {
              this.calendarApi.changeView('listMonth')
            },
          },
        },
        events: [],
        firstDay: 0,
        initialView: 'dayGridMonth',
        eventClick: this.handleEventClick,
        allDaySlot: false,
        eventLongPressDelay: 200,
        eventOverlap: true,
        forceEventDuration: true,
        displayEventTime: true,
        showNonCurrentDates: false,
      }
    }
  },

  methods: {
    async loadBookings() {
      try {
        this.loading = true
        this.calendarOptions.events = await fetchCalendarEvents()
      } catch (error) {
        console.error('Failed to load bookings:', error)
      } finally {
        this.loading = false
      }
    },

    handleEventClick(info) {
      alert(`Booking: ${info.event.title}\nStatus: ${info.event.extendedProps.status}`)
    }
  },

  mounted() {
    this.calendarApi = this.$refs.refCalendar.getApi()
    this.loadBookings()
  }
}
</script>