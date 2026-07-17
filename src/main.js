import './assets/style.css'

import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'
import { store } from './store'
import VCalendar from 'v-calendar';
import 'v-calendar/style.css';
import { supabase } from './utils/supabaseClient.js'
import '@fortawesome/fontawesome-free/css/all.css'

async function supabaseSession() {
  const { data: { session } } = await supabase.auth.getSession()

  if (session) {
    store.dispatch('setUser', session.user)
  }

  supabase.auth.onAuthStateChange((event, session) => {
    if (session) {
      store.dispatch('setUser', session.user)
    } else {
      store.dispatch('setUser', null)
    }
  })

  const app = createApp(App)

  app.use(store)
  app.use(router)
  app.use(ElementPlus)
  app.use(VCalendar, {})

  app.mount('#app')
}

supabaseSession()