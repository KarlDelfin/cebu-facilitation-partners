<!-- src/components/AdminBookingPanel.vue -->
<template>
  <div>
    <!-- Metric Overview Cards -->
    <el-row :gutter="20" class="metrics-row">
      <el-col :span="6">
        <el-card shadow="hover" class="metric-card">
          <template #header><span class="metric-title">Total Bookings</span></template>
          <div class="metric-value">1,248</div>
        </el-card>
      </el-col>
      <el-col :span="6">
        <el-card shadow="hover" class="metric-card">
          <template #header><span class="metric-title">Pending Bootcamps</span></template>
          <div class="metric-value text-sec">4</div>
        </el-card>
      </el-col>
      <el-col :span="6">
        <el-card shadow="hover" class="metric-card">
          <template #header><span class="metric-title">Total Participants</span></template>
          <div class="metric-value">3,852</div>
        </el-card>
      </el-col>
      <el-col :span="6">
        <el-card shadow="hover" class="metric-card">
          <template #header><span class="metric-title">Total Value</span></template>
          <div class="metric-value text-pri">₱245,000</div>
        </el-card>
      </el-col>
    </el-row>

    <!-- Main Data Table Section -->
    <el-card shadow="never" class="table-card">
      <div class="table-actions">
        <el-input
          v-model="search"
          placeholder="Search by client name..."
          class="search-input"
          :prefix-icon="SearchIcon"
          clearable
        />
        <el-button type="primary" color="#136cb3">Schedule Custom Cohort</el-button>
      </div>

      <!-- Appointments Table mapped to your database schema fields -->
      <el-table :data="filteredBookings" style="width: 100%" v-loading="loading">
        <el-table-column label="Client" min-width="200">
          <template #default="scope">
            <div class="client-cell">
              <div class="client-name">{{ scope.row.Client.fullName }}</div>
              <div class="client-sub">{{ scope.row.Client.email }} | {{ scope.row.Client.phone }}</div>
            </div>
          </template>
        </el-table-column>

        <el-table-column label="Service" min-width="180">
          <template #default="scope">
            <el-tag effect="plain" color="#fff" style="border-color: #136cb3; color: #136cb3; font-weight: 600;">
              {{ scope.row.Service.name }}
            </el-tag>
            <div class="service-sub">Rate: ₱{{ scope.row.Service.price.toLocaleString() }}</div>
          </template>
        </el-table-column>

        <el-table-column label="Participants" width="140" align="center">
          <template #default="scope">
            <el-badge :value="scope.row.Client.noOfParticipants" class="participant-badge" type="info" />
          </template>
        </el-table-column>

        <el-table-column label="Scheduled Date" min-width="160">
          <template #default="scope">
            <div class="booking-time-text">{{ formatDate(scope.row.bookingDateTime) }}</div>
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
      </el-table>
    </el-card>
  </div>
</template>

<script>
import { Search } from '@element-plus/icons-vue'
import { ElMessage } from 'element-plus'

export default {
  name: 'AdminBookingPanel',
  data() {
    return {
      search: '',
      loading: false,
      SearchIcon: Search,
      bookings: [
        {
          id: 'b1',
          clientId: 'c1',
          serviceId: 's1',
          bookingDateTime: '2026-08-12T09:00:00Z',
          status: 'confirmed',
          dateTimeCreated: '2026-07-16T15:50:00Z',
          Client: {
            id: 'c1',
            fullName: 'Annette Block',
            email: 'Annettb81@gmail.com',
            phone: '(252) 555-0126',
            dateTimeCreated: '2026-07-16T15:50:00Z',
            noOfParticipants: 15
          },
          Service: {
            id: 's1',
            name: 'High-Impact Project Leadership',
            description: 'Bespoke corporate management bootcamp.',
            price: 45000.00,
            dateTimeCreated: '2026-01-10T12:00:00Z'
          }
        },
        {
          id: 'b2',
          clientId: 'c2',
          serviceId: 's2',
          bookingDateTime: '2026-08-15T13:00:00Z',
          status: 'pending',
          dateTimeCreated: '2026-07-17T10:12:00Z',
          Client: {
            id: 'c2',
            fullName: 'Eleanor Pena',
            email: 'eleanor.p@example.ph',
            phone: '(316) 555-0116',
            dateTimeCreated: '2026-07-17T10:12:00Z',
            noOfParticipants: 28
          },
          Service: {
            id: 's2',
            name: 'Bespoke Operational Readiness',
            description: 'Tailor-made organizational alignments.',
            price: 60000.00,
            dateTimeCreated: '2026-01-12T09:00:00Z'
          }
        }
      ]
    }
  },
  computed: {
    filteredBookings() {
      return this.bookings.filter((booking) =>
        booking.Client.fullName.toLowerCase().includes(this.search.toLowerCase())
      )
    }
  },
  methods: {
    formatDate(dateStr) {
      const options = { month: 'short', day: 'numeric', year: 'numeric', hour: '2-digit', minute: '2-digit' }
      return new Date(dateStr).toLocaleDateString('en-US', options)
    },
    handleStatusChange(row) {
      ElMessage({
        message: `Workshop status for ${row.Client.fullName} changed to "${row.status}".`,
        type: 'success',
      })
    }
  }
}
</script>

<style scoped>
.client-cell {
  display: flex;
  flex-direction: column;
}
.client-name {
  font-weight: 700;
  color: #333;
}
.client-sub, .service-sub {
  font-size: 0.8rem;
  color: #64748b;
  margin-top: 2px;
}
.booking-time-text {
  color: #333;
  font-weight: 500;
}
:deep(.participant-badge .el-badge__content) {
  background-color: #136cb3;
  color: #fff;
  font-weight: 600;
}
</style>