<template>
  <el-aside width="240px" class="h-screen flex flex-col bg-[#333]">
    <div class="p-6 text-center border-b border-slate-600">
      <h2 class="text-white m-0 text-lg font-bold tracking-wider uppercase !mb-3 !p-5">
        <a href="/">Upskills Facilitation Partners</a>
      </h2>
    </div>
    
    <el-menu
      :default-active="$route.path"
      router
      background-color="#333"
      text-color="#fff"
      active-text-color="#feb841"
      class="border-none flex-1"
    >
      <el-sub-menu index="booking-menu">
        <template #title>
          <el-icon><Calendar /></el-icon>
          <span>Bookings</span>
        </template>

        <el-menu-item index="/admin/booking">
          <el-icon><Notebook /></el-icon>
          <span>All Bookings</span>
        </el-menu-item>

        <el-menu-item index="/admin/status">
          <el-icon><CollectionTag /></el-icon>
          <span>Booking Status</span>
        </el-menu-item>

        <el-menu-item index="/admin/timeslot">
          <el-icon><Clock /></el-icon>
          <span>Time Slots</span>
        </el-menu-item>
      </el-sub-menu>

      <el-menu-item index="/admin/calendar">
        <el-icon><Calendar /></el-icon>
        <span>Calendar</span>
      </el-menu-item>
    
      <el-menu-item index="/admin/services">
        <el-icon><Notebook /></el-icon>
        <span>Services</span>
      </el-menu-item>
    </el-menu>
  </el-aside>
</template>

<script>
import { Calendar, Notebook, Clock, CollectionTag } from '@element-plus/icons-vue'

export default {
  name: 'AdminSidebar',
  components: {
    Calendar,
    Notebook,
    Clock,
    CollectionTag
  }
}
</script>