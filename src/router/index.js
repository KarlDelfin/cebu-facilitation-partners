import { createRouter, createWebHistory } from 'vue-router'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: () => import('../views/HomeView.vue'),
    },
    
  ],
  // scrollBehavior(to, from, savedPosition) {
  //   return { top: 0 } 
  // }
})

export default router
