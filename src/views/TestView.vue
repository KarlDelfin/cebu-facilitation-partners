<template>
  <div class="calendar-container">
    <!-- V-Calendar with dayclick and attributes -->
    <v-calendar
      :attributes="events"
      @dayclick="onDayClick"
    />

    <!-- Display area for clicked data -->
    <div v-if="selectedEvent" class="event-details">
      <h3>Event for {{ selectedEvent.date }}</h3>
      <p>{{ selectedEvent.description }}</p>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      selectedEvent: null,
      // Custom attributes to highlight specific dates
      events: [
        {
          key: 'meeting-1',
          highlight: {
            backgroundColor: '#ff8080',
          },
          contentStyle: {
            color: 'red',
            fontWeight: 'bold',
          },
          dates: new Date(2026, 6, 20), // Month is 0-indexed (July 20, 2026)
          customData: {
            title: 'Team Sync',
            description: 'Discuss Q3 deliverables and roadmap.'
          }
        }
      ]
    };
  },
  methods: {
    onDayClick(day) {
      // 'day' contains the exact date object and any attached attributes
      console.log('Clicked Date Object:', day);

      // Search if there are any attributes on the clicked day
      const clickedAttributes = day.attributes;
      
      if (clickedAttributes && clickedAttributes.length > 0) {
        // Extract the customData from the first highlighted event found
        const event = clickedAttributes[0];
        this.selectedEvent = {
          date: day.date.toLocaleDateString(),
          description: event.customData ? event.customData.description : 'No description provided'
        };
      } else {
        this.selectedEvent = null; // Clear if an empty day is clicked
      }
    }
  }
};
</script>

<style scoped>
.calendar-container {
  max-width: 400px;
  margin: 0 auto;
}
.event-details {
  margin-top: 20px;
  padding: 15px;
  background: #f4f4f4;
  border-radius: 8px;
}
</style>
