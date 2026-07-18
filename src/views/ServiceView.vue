<!-- src/components/AdminServicePanel.vue -->
<template>
  <div>
    <!-- Service Metrics Overview -->
    <el-row :gutter="20" class="metrics-row">
      <el-col :span="8">
        <el-card shadow="hover" class="metric-card">
          <template #header><span class="metric-title">Active Bootcamps</span></template>
          <div class="metric-value text-pri">{{ services.length }}</div>
        </el-card>
      </el-col>
      <el-col :span="8">
        <el-card shadow="hover" class="metric-card">
          <template #header><span class="metric-title">Premium Formats</span></template>
          <div class="metric-value">{{ premiumCount }}</div>
        </el-card>
      </el-col>
      <el-col :span="8">
        <el-card shadow="hover" class="metric-card">
          <template #header><span class="metric-title">Average Corporate Investment</span></template>
          <div class="metric-value text-sec">₱{{ averagePrice }}</div>
        </el-card>
      </el-col>
    </el-row>

    <!-- Services Management Table -->
    <el-card shadow="never" class="table-card">
      <div class="table-actions">
        <el-input
          v-model="searchQuery"
          placeholder="Search program names or details..."
          class="search-input"
          :prefix-icon="SearchIcon"
          clearable
        />
        <el-button type="primary" color="#136cb3">Design New Program</el-button>
      </div>

      <el-table :data="filteredServices" style="width: 100%" v-loading="loading">
        <el-table-column label="Program Name" min-width="200">
          <template #default="scope">
            <div class="service-name-text">{{ scope.row.name }}</div>
          </template>
        </el-table-column>

        <el-table-column prop="description" label="Bespoke Objectives & Scope" min-width="280" show-overflow-tooltip />
        
        <el-table-column label="Base Price" width="160" align="right">
          <template #default="scope">
            <span class="price-text">₱{{ scope.row.price.toLocaleString('en-US', { minimumFractionDigits: 2 }) }}</span>
          </template>
        </el-table-column>

        <el-table-column label="Date Configured" min-width="150">
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
              @click="editService(scope.row)"
            >
              Modify Scope
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
  name: 'AdminServicePanel',
  data() {
    return {
      searchQuery: '',
      loading: false,
      SearchIcon: Search,
      services: [
        {
          id: 's1',
          name: 'High-Impact Project Leadership',
          description: 'Accelerating professional readiness through high-impact corporate management training structures.',
          price: 45000.00,
          dateTimeCreated: '2026-01-10T12:00:00Z'
        },
        {
          id: 's2',
          name: 'Bespoke Operational Readiness Training',
          description: 'Tailor-made organizational bootcamp aligning local teams to meet technical industry requirements.',
          price: 60000.00,
          dateTimeCreated: '2026-01-12T09:00:00Z'
        }
      ]
    }
  },
  computed: {
    filteredServices() {
      return this.services.filter(service => 
        service.name.toLowerCase().includes(this.searchQuery.toLowerCase()) ||
        service.description.toLowerCase().includes(this.searchQuery.toLowerCase())
      )
    },
    premiumCount() {
      return this.services.filter(s => s.price >= 50000).length
    },
    averagePrice() {
      if (!this.services.length) return '0.00'
      const total = this.services.reduce((acc, curr) => acc + curr.price, 0)
      return Math.round(total / this.services.length).toLocaleString()
    }
  },
  methods: {
    formatDate(dateStr) {
      const options = { year: 'numeric', month: 'short', day: 'numeric' }
      return new Date(dateStr).toLocaleDateString('en-US', options)
    },
    editService(service) {
      ElMessage({
        message: `Modifying program catalog parameters for: ${service.name}`,
        type: 'info'
      })
    }
  }
}
</script>

<style scoped>
.service-name-text {
  font-weight: 700;
  color: #333;
}
.price-text {
  font-weight: 700;
  color: #136cb3;
}
.date-text {
  color: #64748b;
  font-weight: 500;
}
</style>