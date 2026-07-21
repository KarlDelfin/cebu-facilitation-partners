<template>
  <el-aside width="240px" class="h-screen flex flex-col bg-[#333]">
    <div class="p-6 text-center border-b border-slate-600">
      <h2 class="text-white m-0 text-lg font-bold tracking-wider uppercase !mb-3 !p-5">
        Upskills Partners
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
      <el-menu-item index="/admin/bookings">
        <el-icon><Calendar /></el-icon>
        <span>Bookings</span>
      </el-menu-item>
      
      <el-menu-item index="/admin/services">
        <el-icon><Notebook /></el-icon>
        <span>Services</span>
      </el-menu-item>
    </el-menu>
  </el-aside>
</template>

<script>
import { Calendar, Notebook } from '@element-plus/icons-vue'

export default {
  name: 'AdminSidebar',
  components: {
    Calendar,
    Notebook
  }
}
</script>