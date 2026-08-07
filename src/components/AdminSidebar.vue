<template>
  <div>
    <!-- Mobile Backdrop Overlay -->
    <div
      v-if="isMobile && !isCollapsed"
      class="fixed inset-0 bg-black/50 z-40 md:hidden"
      @click="isCollapsed = true"
    ></div>

    <!-- Responsive Sidebar Container -->
    <el-aside
      :width="isCollapsed ? '64px' : '240px'"
      class="h-screen flex flex-col bg-[#333] transition-all duration-300 relative z-50 overflow-hidden"
      :class="{
        'fixed left-0 top-0': isMobile,
      }"
    >
      <div class="p-4 text-center border-b border-slate-600 flex items-center justify-between min-h-[64px]">
        <h2 
          v-show="!isCollapsed" 
          class="text-white m-0 text-sm md:text-base font-bold tracking-wider uppercase truncate px-2"
        >
          <a href="/" class="hover:text-[#feb841] transition-colors">Upskills Facilitation</a>
        </h2>

        <button
          @click="isCollapsed = !isCollapsed"
          class="text-white hover:text-[#feb841] p-2 rounded-md focus:outline-none mx-auto"
          :title="isCollapsed ? 'Expand Sidebar' : 'Collapse Sidebar'"
        >
          <el-icon :size="20">
            <Expand v-if="isCollapsed" />
            <Fold v-else />
          </el-icon>
        </button>
      </div>

      <!-- Navigation Menu -->
      <el-menu
        :default-active="$route.path"
        router
        background-color="#333"
        text-color="#fff"
        active-text-color="#feb841"
        :collapse="isCollapsed"
        :collapse-transition="false"
        class="border-none flex-1 overflow-y-auto"
      >
        <el-sub-menu index="booking-menu">
          <template #title>
            <el-icon><Calendar /></el-icon>
            <span>Bookings</span>
          </template>

          <el-menu-item index="/admin/booking">
            <el-icon><Notebook /></el-icon>
            <template #title>All Bookings</template>
          </el-menu-item>

          <el-menu-item index="/admin/status">
            <el-icon><CollectionTag /></el-icon>
            <template #title>Booking Status</template>
          </el-menu-item>

          <el-menu-item index="/admin/timeslot">
            <el-icon><Clock /></el-icon>
            <template #title>Time Slots</template>
          </el-menu-item>
        </el-sub-menu>

        <el-menu-item index="/admin/calendar">
          <el-icon><Calendar /></el-icon>
          <template #title>Calendar</template>
        </el-menu-item>

        <el-menu-item index="/admin/services">
          <el-icon><Notebook /></el-icon>
          <template #title>Services</template>
        </el-menu-item>
      </el-menu>
    </el-aside>
  </div>
</template>

<script>
import { 
  Calendar, 
  Notebook, 
  Clock, 
  CollectionTag, 
  Fold, 
  Expand 
} from '@element-plus/icons-vue'

export default {
  name: 'AdminSidebar',
  components: {
    Calendar,
    Notebook,
    Clock,
    CollectionTag,
    Fold,
    Expand
  },
  data() {
    return {
      isCollapsed: false,
      isMobile: false
    }
  },
  mounted() {
    this.handleResize();
    window.addEventListener('resize', this.handleResize);
  },
  beforeUnmount() {
    window.removeEventListener('resize', this.handleResize);
  },
  methods: {
    handleResize() {
      const width = window.innerWidth;
      this.isMobile = width < 768;

      if (width < 1024) {
        this.isCollapsed = true;
      } else {
        this.isCollapsed = false;
      }
    }
  }
}
</script>

<style scoped>
/* Smooth Element Plus Menu Collapse Override */
:deep(.el-menu--collapse) {
  width: 64px !important;
}

:deep(.el-menu-item .el-icon),
:deep(.el-sub-menu__title .el-icon) {
  font-size: 18px;
}
</style>