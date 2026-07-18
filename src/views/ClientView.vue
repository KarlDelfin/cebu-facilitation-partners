<!-- src/components/AdminClientPanel.vue -->
<template>
  <div>
    <!-- Client Overview Stats -->
    <el-row :gutter="20" class="metrics-row">
      <el-col :span="8">
        <el-card shadow="hover" class="metric-card">
          <template #header><span class="metric-title">Active Organizations</span></template>
          <div class="metric-value text-pri">{{ clients.length }}</div>
        </el-card>
      </el-col>
      <el-col :span="8">
        <el-card shadow="hover" class="metric-card">
          <template #header><span class="metric-title">Total Upskilled Trainees</span></template>
          <div class="metric-value">{{ totalParticipants }}</div>
        </el-card>
      </el-col>
      <el-col :span="8">
        <el-card shadow="hover" class="metric-card">
          <template #header><span class="metric-title">Average Cohort Size</span></template>
          <div class="metric-value text-sec">{{ averageCohortSize }}</div>
        </el-card>
      </el-col>
    </el-row>

    <!-- Clients Table Card -->
    <el-card shadow="never" class="table-card">
      <div class="table-actions">
        <el-input
          v-model="searchQuery"
          placeholder="Search by client name or email..."
          class="search-input"
          :prefix-icon="SearchIcon"
          clearable
        />
        <el-button type="primary" color="#136cb3">Register New Client</el-button>
      </div>

      <el-table :data="filteredClients" style="width: 100%" v-loading="loading">
        <el-table-column label="Client Name" min-width="180">
          <template #default="scope">
            <div class="client-name-cell">{{ scope.row.fullName }}</div>
          </template>
        </el-table-column>

        <el-table-column prop="email" label="Corporate Email" min-width="200" />
        <el-table-column prop="phone" label="Contact Line" min-width="150" />

        <el-table-column label="Trainees / Participants" width="180" align="center">
          <template #default="scope">
            <el-tag color="#136cb3" style="color: #fff; font-weight: 600; border: none;">
              {{ scope.row.noOfParticipants }} Registered
            </el-tag>
          </template>
        </el-table-column>

        <el-table-column label="Date Joined" min-width="150">
          <template #default="scope">
            <span class="date-text">{{ formatDate(scope.row.dateTimeCreated) }}</span>
          </template>
        </el-table-column>

        <el-table-column label="Management" width="120" fixed="right" align="center">
          <template #default="scope">
            <el-button 
              size="small" 
              type="primary" 
              link 
              style="color: #136cb3; font-weight: 600;"
              @click="editClient(scope.row)"
            >
              Edit Profile
            </el-button>
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
  name: 'AdminClientPanel',
  data() {
    return {
      searchQuery: '',
      loading: false,
      SearchIcon: Search,
      clients: [
        {
          id: 'c1',
          fullName: 'Annette Block',
          email: 'Annettb81@gmail.com',
          phone: '(252) 555-0126',
          noOfParticipants: 15,
          dateTimeCreated: '2026-07-16T15:50:38Z'
        },
        {
          id: 'c2',
          fullName: 'Eleanor Pena',
          email: 'eleanor.p@example.ph',
          phone: '(316) 555-0116',
          noOfParticipants: 28,
          dateTimeCreated: '2026-07-17T10:12:00Z'
        }
      ]
    }
  },
  computed: {
    filteredClients() {
      return this.clients.filter(client => 
        client.fullName.toLowerCase().includes(this.searchQuery.toLowerCase()) ||
        client.email.toLowerCase().includes(this.searchQuery.toLowerCase())
      )
    },
    totalParticipants() {
      return this.clients.reduce((acc, curr) => acc + Number(curr.noOfParticipants || 0), 0)
    },
    averageCohortSize() {
      return this.clients.length ? Math.round(this.totalParticipants / this.clients.length) : 0
    }
  },
  methods: {
    formatDate(dateStr) {
      const options = { year: 'numeric', month: 'short', day: 'numeric' }
      return new Date(dateStr).toLocaleDateString('en-US', options)
    },
    editClient(client) {
      ElMessage({
        message: `Opening corporate modifier framework for: ${client.fullName}`,
        type: 'info'
      })
    }
  }
}
</script>

<style scoped>
.client-name-cell {
  font-weight: 700;
  color: #333;
}
.date-text {
  color: #64748b;
  font-weight: 500;
}
</style>