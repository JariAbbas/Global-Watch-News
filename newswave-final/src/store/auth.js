import { ref } from 'vue'

const ADMIN_USER = 'globalWatchNews'
const ADMIN_PASS = 'globalWatchNews'
const SESSION_KEY = 'nw_admin_auth'

export const isAuthenticated = ref(!!sessionStorage.getItem(SESSION_KEY))

export function login(username, password) {
  if (username === ADMIN_USER && password === ADMIN_PASS) {
    sessionStorage.setItem(SESSION_KEY, '1')
    isAuthenticated.value = true
    return true
  }
  return false
}

export function logout() {
  sessionStorage.removeItem(SESSION_KEY)
  isAuthenticated.value = false
}
