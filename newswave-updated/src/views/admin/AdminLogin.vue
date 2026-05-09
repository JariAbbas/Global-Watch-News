<template>
  <div class="login-page">
    <div class="login-bg"></div>
    <div class="login-card">
      <div class="login-logo">
        <span class="logo-mark">GW</span>
        <div>
          <div class="login-brand">GlobalWatch News</div>
          <div class="login-sub">Admin Control Panel</div>
        </div>
      </div>

      <form class="login-form" @submit.prevent="handleLogin">
        <div class="form-group">
          <label class="form-label">Username</label>
          <div class="input-wrap">
            <svg class="input-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="16"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
            <input v-model="username" type="text" class="form-input" placeholder="Enter username" autocomplete="username" />
          </div>
        </div>

        <div class="form-group">
          <label class="form-label">Password</label>
          <div class="input-wrap">
            <svg class="input-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="16"><rect width="18" height="11" x="3" y="11" rx="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>
            <input v-model="password" :type="showPass ? 'text' : 'password'" class="form-input" placeholder="Enter password" autocomplete="current-password" />
            <button type="button" class="pass-toggle" @click="showPass = !showPass">
              {{ showPass ? '🙈' : '👁' }}
            </button>
          </div>
        </div>

        <div v-if="error" class="login-error">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="16"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
          {{ error }}
        </div>

        <button type="submit" class="btn-login" :class="{ loading: loggingIn }">
          <span v-if="!loggingIn">Sign In to Admin</span>
          <span v-else class="btn-spinner"></span>
        </button>
      </form>

      <div class="login-footer">
        <router-link to="/" class="back-link">← Back to Website</router-link>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { login } from '../../store/auth.js'

const router = useRouter()
const username = ref('')
const password = ref('')
const error = ref('')
const showPass = ref(false)
const loggingIn = ref(false)

async function handleLogin() {
  if (!username.value || !password.value) { error.value = 'Please fill in all fields'; return }
  loggingIn.value = true
  error.value = ''
  await new Promise(r => setTimeout(r, 600))
  if (login(username.value, password.value)) {
    router.push('/admin/dashboard')
  } else {
    error.value = 'Invalid username or password'
    loggingIn.value = false
  }
}
</script>

<style scoped>
.login-page {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
  background: var(--bg-primary);
}
.login-bg {
  position: absolute;
  inset: 0;
  background:
    radial-gradient(ellipse at 20% 50%, rgba(230,57,70,0.08) 0%, transparent 50%),
    radial-gradient(ellipse at 80% 20%, rgba(76,201,240,0.05) 0%, transparent 50%);
  pointer-events: none;
}
.login-card {
  position: relative;
  z-index: 1;
  background: var(--bg-card);
  border: 1px solid var(--border-bright);
  border-radius: 16px;
  padding: 48px 40px;
  width: 100%;
  max-width: 420px;
  box-shadow: 0 40px 80px rgba(0,0,0,0.5);
  animation: fadeUp 0.5s ease forwards;
}
.login-logo {
  display: flex;
  align-items: center;
  gap: 14px;
  margin-bottom: 36px;
}
.logo-mark {
  width: 48px; height: 48px;
  background: var(--accent-red);
  color: #fff;
  font-family: var(--font-display);
  font-size: 18px;
  letter-spacing: 0.1em;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 10px;
  flex-shrink: 0;
}
.login-brand { font-family: var(--font-display); font-size: 1.3rem; letter-spacing: 0.06em; }
.login-sub { font-family: var(--font-mono); font-size: 10px; color: var(--accent-red); text-transform: uppercase; letter-spacing: 0.1em; margin-top: 2px; }

.login-form { display: flex; flex-direction: column; gap: 20px; }
.form-group { display: flex; flex-direction: column; gap: 8px; }
.form-label { font-family: var(--font-mono); font-size: 11px; text-transform: uppercase; letter-spacing: 0.1em; color: var(--text-muted); }
.input-wrap { position: relative; display: flex; align-items: center; }
.input-icon { position: absolute; left: 14px; color: var(--text-muted); pointer-events: none; }
.form-input {
  width: 100%;
  background: var(--bg-secondary);
  border: 1px solid var(--border);
  border-radius: var(--radius);
  padding: 12px 40px 12px 42px;
  font-family: var(--font-body);
  font-size: 0.95rem;
  color: var(--text-primary);
  outline: none;
  transition: border-color 0.2s, box-shadow 0.2s;
}
.form-input:focus { border-color: var(--accent-red); box-shadow: 0 0 0 3px var(--accent-red-glow); }
.form-input::placeholder { color: var(--text-muted); }
.pass-toggle { position: absolute; right: 12px; background: none; border: none; cursor: pointer; font-size: 14px; color: var(--text-muted); padding: 4px; }

.login-error {
  display: flex;
  align-items: center;
  gap: 8px;
  background: rgba(230,57,70,0.1);
  border: 1px solid rgba(230,57,70,0.3);
  border-radius: var(--radius);
  padding: 10px 14px;
  font-size: 0.85rem;
  color: var(--accent-red);
}
.btn-login {
  background: var(--accent-red);
  color: #fff;
  border: none;
  border-radius: var(--radius);
  padding: 14px;
  font-family: var(--font-mono);
  font-size: 13px;
  font-weight: 500;
  text-transform: uppercase;
  letter-spacing: 0.1em;
  cursor: pointer;
  transition: all 0.2s;
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 48px;
  margin-top: 4px;
}
.btn-login:hover:not(.loading) { background: #c62b38; box-shadow: 0 8px 20px rgba(230,57,70,0.4); transform: translateY(-1px); }
.btn-login.loading { opacity: 0.7; cursor: not-allowed; }
.btn-spinner { width: 18px; height: 18px; border: 2px solid rgba(255,255,255,0.3); border-top-color: #fff; border-radius: 50%; animation: spin 0.7s linear infinite; }

.login-footer { margin-top: 24px; text-align: center; }
.back-link { font-family: var(--font-mono); font-size: 11px; color: var(--text-muted); transition: color 0.2s; }
.back-link:hover { color: var(--accent-red); }
</style>
