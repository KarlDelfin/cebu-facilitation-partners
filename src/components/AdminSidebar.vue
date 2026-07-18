<template>
  <el-aside width="240px" class="sidebar">
    <div class="logo-container">
      <h2>Upskills Partners</h2>
    </div>
    
    <el-menu
      :default-active="$route.path"
      router
      background-color="#333"
      text-color="#fff"
      active-text-color="#feb841"
    >
      <el-menu-item index="/admin/booking">
        <el-icon><Calendar /></el-icon>
        <span>Bookings</span>
      </el-menu-item>
      
      <el-menu-item index="/admin/client">
        <el-icon><User /></el-icon>
        <span>Clients</span>
      </el-menu-item>
      
      <el-menu-item index="/admin/service">
        <el-icon><Notebook /></el-icon>
        <span>Services</span>
      </el-menu-item>
    </el-menu>
  </el-aside>
</template>

<script>
import { Calendar, User, Notebook } from '@element-plus/icons-vue'

export default {
  name: 'AdminSidebar',
  components: {
    Calendar,
    User,
    Notebook
  }
}
</script>

<style scoped>
.sidebar { background-color: #333; display: flex; flex-direction: column; }
.logo-container { padding: 24px; text-align: center; border-bottom: 1px solid #475569; }
.logo-container h2 { color: #fff; margin: 0; font-size: 1.15rem; font-weight: 700; letter-spacing: 0.5px; text-transform: uppercase; }
</style>