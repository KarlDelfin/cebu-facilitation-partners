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
import { supabase } from '@/utils/supabaseClient'
import moment from 'moment'

export default {
  components: { FullCalendar },
  data() {
    return {
      loading: false,

      calendarApi: null,

      weekClicked: false,
      dayClicked: false,

      calendarOptions: {
        
        height: 700,
        plugins: [dayGridPlugin, interactionPlugin, timeGridPlugin, list, rrulePlugin],
        timeZone: 'UTC',
        headerToolbar: {
          left: 'prev,next today',
          center: 'title',
          right: 'dayGridMonth,dayGridWeek'
        },
        views: {
          dayGridMonth: {
            dayMaxEventRows: 2,
            titleFormat: { year: 'numeric', month: 'long', day: 'numeric' },
          },

          timeGridWeek: {
            slotLabelFormat: {
              hour: '2-digit',
              minute: '2-digit',
              hour12: false, // 24-hour format
            },
            eventTimeFormat: {
              hour: '2-digit',
              minute: '2-digit',
              hour12: false, // 24-hour format
            },
          },

          timeGridDay: {
            slotLabelFormat: {
              hour: '2-digit',
              minute: '2-digit',
              hour12: false, // 24-hour format
            },
          },

          listMonth: {
            eventTimeFormat: {
              hour: '2-digit',
              minute: '2-digit',
              hour12: false, // 24-hour format
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
              const currentDate = moment(this.calendarApi.getDate()).format();
              this.calendarApi.gotoDate(currentDate)
            },
          },

          nextCustom: {
            text: 'next',
            click: () => {
              this.pickerKey++
              this.calendarApi.next()

              const currentDate = moment(this.calendarApi.getDate()).format();
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
              this.getCalendarEventsByCalendarId(this.selectedCalendarId)
            },
          },

          listCustom: {
            text: 'list',
            click: () => {
              this.calendarApi.changeView('listMonth')
              this.getCalendarEventsByCalendarId(this.selectedCalendarId)
            },
          },
        },
        events: [], // 👈 This will hold our mapped schema events
        firstDay: 0,
        initialView: 'dayGridMonth',
        eventClick: this.handleEventClick,
        allDaySlot: false, // Show/hide non-recurring events false
        eventLongPressDelay: 200, // Mobile drog n drop events
        eventOverlap: true,
        forceEventDuration: true,
        displayEventTime: true, // Display time for recurring event
        showNonCurrentDates: false, // Disable last week of previous month and first week of next month
      }
    }
  },
 
  methods: {
    async fetchBookings() {
      try {
        this.loading = true

        const { data, error } = await supabase
          .from('Booking')
          .select(`
            id,
            bookingDateTime,
            status,
            fullName,
            Service ( name )
          `)

        if (error) throw error

        this.calendarOptions.events = data.map(item => {
          const isConfirmed = item.status === 'confirmed'
          
          return {
            id: item.id,
            title: `${item.Service?.name || 'Event'} - ${item.fullName}`,
            start: item.bookingDateTime, // Maps timestamp directly
            backgroundColor: isConfirmed ? '#136cb3' : '#feb841', // Blue if Confirmed, Gold if Pending
            borderColor: isConfirmed ? '#0f5690' : '#d9962b',
            textColor: '#ffffff',
            extendedProps: {
              status: item.status,
              client: item.fullName
            }
          }
        })
      } catch (error) {
        console.error(error)
      }
      finally {
        this.loading = false
      }
    },

    handleEventClick(info) {
      alert(`Booking: ${info.event.title}\nStatus: ${info.event.extendedProps.status}`)
    }
  },
  mounted() {
    this.calendarApi = this.$refs.refCalendar.getApi()

    this.fetchBookings()
  },
}
</script>