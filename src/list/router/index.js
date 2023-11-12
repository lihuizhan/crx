import { createRouter, createWebHashHistory } from 'vue-router'
import Home from '../Home.vue'
import DetailPages from '../components/DetailPages.vue'

const routes = [
  {
    path: '/',
    name: 'Home',
    component: Home
  },
  {
    path: '/DetailPages',
    name: 'DetailPages',
    component: DetailPages
  }
]

const router = createRouter({
  history: createWebHashHistory(),
  routes
})

export default router
