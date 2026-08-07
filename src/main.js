import './assets/style.css'
import './assets/tailwind.css'

import { createApp } from 'vue'
import { createPinia } from 'pinia'

import App from './App.vue'
import router from './router'

import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'
import 'element-plus/theme-chalk/dark/css-vars.css'

import VCalendar from 'v-calendar'
import 'v-calendar/style.css'

import { supabase } from './utils/supabaseClient.js'

import '@fortawesome/fontawesome-free/css/all.css'

import { useAuthStore } from './store/useAuthStore'

async function initApp() {
  const app = createApp(App)
  
  const pinia = createPinia()
  app.use(pinia)

  const authStore = useAuthStore(pinia)

  const { data: { session } } = await supabase.auth.getSession()
  if (session) {
    authStore.setUser(session)
  }

  supabase.auth.onAuthStateChange((event, session) => {
    if (session) {
      authStore.setUser(session)
    } else {
      authStore.setUser(null)
    }
  })

  // 5. Mount remaining plugins and app
  app.use(router)
  app.use(ElementPlus)
  app.use(VCalendar, {})

  app.mount('#app')
}

initApp()