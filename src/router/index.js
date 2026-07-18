import { createRouter, createWebHistory } from 'vue-router'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: () => import('../views/HomeView.vue'),
    },
    {
      path: '/test',
      name: 'test',
      component: () => import('../views/TestView.vue'),
    },
    {
      path: '/admin',
      name: 'admin',
      component: () => import('../views/AdminView.vue'),
      children: [
        {
          path: 'booking',
          name: 'booking',
          component: () => import('../views/BookingView.vue'),
        },
        {
          path: 'client',
          name: 'client',
          component: () => import('../views/ClientView.vue'),
        },
        {
          path: 'service',
          name: 'service',
          component: () => import('../views/ServiceView.vue'),
        },
      ]
    },
  ],
})

export default router