import { createRouter, createWebHistory } from 'vue-router'
import { isAuthenticated } from '../store/auth.js'
import { setGlobalLoading } from '../store/loader.js' // Global loader state import ki

const routes = [
  { path: '/',               name: 'Home',       component: () => import('../views/HomeView.vue') },
  { path: '/category/:slug', name: 'Category',   component: () => import('../views/CategoryView.vue') },
  { path: '/article/:id',    name: 'Article',    component: () => import('../views/ArticleView.vue') },
  { path: '/live',           name: 'Live',       component: () => import('../views/LiveView.vue') },
  { path: '/video',          name: 'Video',      component: () => import('../views/VideoView.vue') },
  { path: '/video/:id',      name: 'VideoDetail',component: () => import('../views/VideoDetailView.vue') },
  { path: '/weather',        name: 'Weather',    component: () => import('../views/WeatherView.vue') },
  { path: '/search',         name: 'Search',     component: () => import('../views/SearchView.vue') },
  { path: '/admin',          name: 'AdminLogin', component: () => import('../views/admin/AdminLogin.vue') },
  { path: '/admin/dashboard',name: 'AdminDashboard', component: () => import('../views/admin/AdminDashboard.vue'), meta: { requiresAuth: true } },
  { path: '/admin/tickers',  name: 'AdminTickers',   component: () => import('../views/admin/AdminTickers.vue'),   meta: { requiresAuth: true } },
  { path: '/admin/news',     name: 'AdminNews',       component: () => import('../views/admin/AdminNews.vue'),      meta: { requiresAuth: true } },
  { path: '/admin/live',     name: 'AdminLive',       component: () => import('../views/admin/AdminLive.vue'),      meta: { requiresAuth: true } },
  { path: '/admin/news/add', name: 'AdminNewsAdd',    component: () => import('../views/admin/AdminNewsForm.vue'),  meta: { requiresAuth: true } },
  { path: '/admin/news/edit/:id', name: 'AdminNewsEdit', component: () => import('../views/admin/AdminNewsForm.vue'), meta: { requiresAuth: true } },
  { path: '/admin/videos',   name: 'AdminVideos',     component: () => import('../views/admin/AdminVideos.vue'),    meta: { requiresAuth: true } },
  { path: '/admin/videos/add',    name: 'AdminVideoAdd',  component: () => import('../views/admin/AdminVideoForm.vue'), meta: { requiresAuth: true } },
  { path: '/admin/videos/edit/:id', name: 'AdminVideoEdit', component: () => import('../views/admin/AdminVideoForm.vue'), meta: { requiresAuth: true } },
  { path: '/:pathMatch(.*)*',name: 'NotFound',   component: () => import('../views/NotFoundView.vue') },
  // Frontend routes (views/)
  { path: '/about-us',       component: () => import('../views/AboutUs.vue') },
  { path: '/contact-us',     component: () => import('../views/ContactUs.vue') },
  { path: '/privacy-policy', component: () => import('../views/PrivacyPolicy.vue') },
  { path: '/terms-conditions', component: () => import('../views/TermsConditions.vue') },
  { path: '/disclaimer',     component: () => import('../views/Disclaimer.vue') },

  // Admin routes (admin/) — auth guard ke saath
  { path: '/admin/pages/about-us',        component: () => import('../views/admin/AdminAboutUs.vue'), meta: { requiresAuth: true } },
  { path: '/admin/pages/contact-us',      component: () => import('../views/admin/AdminContactUs.vue'), meta: { requiresAuth: true } },
  { path: '/admin/pages/privacy-policy',  component: () => import('../views/admin/AdminPrivacyPolicy.vue'), meta: { requiresAuth: true } },
  { path: '/admin/pages/terms-conditions',component: () => import('../views/admin/AdminTermsConditions.vue'), meta: { requiresAuth: true } },
  { path: '/admin/pages/disclaimer',      component: () => import('../views/admin/AdminDisclaimer.vue'), meta: { requiresAuth: true } },
  ]

  
const router = createRouter({
  history: createWebHistory(),
  routes,
  scrollBehavior(to, from, savedPosition) {
    if (savedPosition) return savedPosition
    return { top: 0, behavior: 'smooth' }
  }
})

// ── BEFORE GUARD: Handles Auth & Starts Loading ──
router.beforeEach((to, from, next) => {
  // 1. Pehle page loading ko true karein
  setGlobalLoading(true)

  // 2. Authentication check karein
  if (to.meta.requiresAuth && !isAuthenticated.value) {
    next('/admin')
  } else {
    next()
  }
})

// ── AFTER GUARD: Stops Loading After Component Mounts ──
router.afterEach(() => {
  // 600ms ka buffer lagaya hai taake dynamic components ko render hone ka time mile aur animation jhatke se khatam na ho
  setTimeout(() => {
    setGlobalLoading(false)
  }, 2000)
})

export default router