import { createRouter, createWebHashHistory, RouteRecordRaw } from 'vue-router'
import { 
  Serialport,
} from '../views'
import { DashboardContainer } from '../components'

const routes:RouteRecordRaw[] = [
 
  { 
    path: '/dashboard', 
    component: DashboardContainer,
    children: [
      { path: 'serialport', component: Serialport },
      { path: 'other', component: Serialport },
    ]
  },
  { 
    path: '/', 
    redirect: '/dashboard/serialport'
  },

]

export const appRouter = createRouter({
  history: createWebHashHistory(),
  routes,
})

