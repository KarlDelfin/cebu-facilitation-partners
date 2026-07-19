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
          path: 'bookings',
          name: 'bookings',
          component: () => import('../views/BookingView.vue'),
        },
        {
          path: 'services',
          name: 'services',
          component: () => import('../views/ServiceView.vue'),
        },
      ]
    },
  ],
})

export default router