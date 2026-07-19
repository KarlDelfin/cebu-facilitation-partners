<template>
  <div class="space-y-6">
    <!-- Metric Overview Cards -->
    <el-row :gutter="20">
      <el-col :span="6">
        <el-card shadow="hover" class="!rounded-lg">
          <template #header>
            <span class="text-slate-500 font-semibold text-sm uppercase tracking-wider">Total Bookings</span>
          </template>
          <div class="text-3xl font-bold text-slate-800">1,248</div>
        </el-card>
      </el-col>
      <el-col :span="6">
        <el-card shadow="hover" class="!rounded-lg">
          <template #header>
            <span class="text-slate-500 font-semibold text-sm uppercase tracking-wider">Pending Bootcamps</span>
          </template>
          <div class="text-3xl font-bold text-amber-500">4</div>
        </el-card>
      </el-col>
      <el-col :span="6">
        <el-card shadow="hover" class="!rounded-lg">
          <template #header>
            <span class="text-slate-500 font-semibold text-sm uppercase tracking-wider">Total Participants</span>
          </template>
          <div class="text-3xl font-bold text-slate-800">3,852</div>
        </el-card>
      </el-col>
      <el-col :span="6">
        <el-card shadow="hover" class="!rounded-lg">
          <template #header>
            <span class="text-slate-500 font-semibold text-sm uppercase tracking-wider">Total Value</span>
          </template>
          <div class="text-3xl font-bold text-[#136cb3]">₱245,000</div>
        </el-card>
      </el-col>
    </el-row>

    <el-card shadow="never" class="!rounded-lg !border-slate-200 !mt-5">
      <div class="flex justify-between items-center mb-6 gap-4">
        <el-input
          v-model="search.bookingName"
          placeholder="Search by client name..."
          class="w-96"
          :prefix-icon="SearchIcon"
          clearable
        />
        <el-button type="primary" color="#136cb3" class="font-semibold">
          Create Booking
        </el-button>
      </div>

      <el-table :data="bookings" style="width: 100%" v-loading="loading">
        <el-table-column label="Client" min-width="200">
          <template #default="scope">
            <div class="flex flex-col">
              <div class="font-bold text-slate-800 text-sm">{{ scope.row.fullName }}</div>
              <div class="text-xs text-slate-500 mt-0.5">
                {{ scope.row.email }} | {{ scope.row.phone }}
              </div>
            </div>
          </template>
        </el-table-column>

        <el-table-column label="Service" min-width="180">
          <template #default="scope">
            <el-tooltip
              :content="scope.row.Service.description"
              placement="top"
              effect="dark"
            >
              <el-tag effect="plain" class="!border-[#136cb3] !text-[#136cb3] !font-bold !bg-white cursor-pointer">
                {{ scope.row.Service.name }}
              </el-tag>
            </el-tooltip>
            
            <div class="text-xs text-slate-500 mt-1">
              Rate: ₱{{ scope.row.Service.price.toLocaleString() }}
            </div>
          </template>
        </el-table-column>

        <el-table-column label="Scheduled Date" min-width="160">
          <template #default="scope">
            <div class="text-slate-800 font-medium text-sm">
              {{ scope.row.bookingDateTime }}
            </div>
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
import { supabase } from '@/utils/supabaseClient';
import { Search } from '@element-plus/icons-vue'
import { ElMessage } from 'element-plus'
import moment from 'moment';

export default {
  data() {
    return {
      loading: false,
      SearchIcon: Search,
      bookings: [],

      search: {
        bookingName: ''
      },
      bookingPagination: {
        elementsPerPage: 10,
        currentPage: 1,
        totalElements: 0
      }, 
    }
  },
  methods: {
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
            query = query.ilike('name', `%${this.search.bookingName}%`);
        }

        query = query.order('dateTimeCreated', { ascending: false }).range(from, to);

        const { data, error, count } = await query;

        if (error) throw error;

        this.bookings = data.map((item) => ({
            id: item.id,
            status: item.status,
            fullName: item.fullName,
            bookingDateTime: moment(item.bookingDateTime).format('MMMM DD, YYYY HH:mm:ss'),
            email: item.email,
            phone: item.phone,
            dateTimeCreated: moment(item.dateTimeCreated).format('MMMM DD, YYYY HH:mm:ss'),
            Service: {
              id: item.Service.id,
              name: item.Service.name,
              price: item.Service.price,
              description: item.Service.description
            }
        }));

        this.bookingPagination.totalElements = count || 0
      }
      catch(error) {
        console.log(error)
      }
      finally {
        this.loading = false;
      }
    },
  },
  mounted() {
    this.getBookings()
  }
}
</script>