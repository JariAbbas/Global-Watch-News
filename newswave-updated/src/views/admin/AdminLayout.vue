<template>
  <div class="admin-layout">
    <!-- Sidebar -->
    <aside class="admin-sidebar" :class="{ collapsed: sidebarCollapsed }">
      <div class="sidebar-header">
        <div class="sidebar-logo">
          <span class="logo-mark">GW</span>
          <span v-if="!sidebarCollapsed" class="logo-text">Admin</span>
        </div>
        <button class="collapse-btn" @click="sidebarCollapsed = !sidebarCollapsed">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="16">
            <path v-if="!sidebarCollapsed" d="M15 18l-6-6 6-6"/>
            <path v-else d="M9 18l6-6-6-6"/>
          </svg>
        </button>
      </div>

      <nav class="sidebar-nav">
        <router-link to="/admin/dashboard" class="nav-item" active-class="active">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="18"><rect width="7" height="9" x="3" y="3" rx="1"/><rect width="7" height="5" x="14" y="3" rx="1"/><rect width="7" height="9" x="14" y="12" rx="1"/><rect width="7" height="5" x="3" y="16" rx="1"/></svg>
          <span v-if="!sidebarCollapsed">Dashboard</span>
        </router-link>
        <router-link to="/admin/tickers" class="nav-item" active-class="active">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="18"><path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z"/></svg>
          <span v-if="!sidebarCollapsed">Tickers</span>
        </router-link>
        <router-link to="/admin/live" class="nav-item" active-class="active">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="18"><circle cx="12" cy="12" r="10"/><polygon points="10 8 16 12 10 16 10 8"/></svg>
          <span v-if="!sidebarCollapsed">Live TV</span>
        </router-link>
        <router-link to="/admin/news" class="nav-item" active-class="active">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="18"><path d="M4 22h16a2 2 0 0 0 2-2V4a2 2 0 0 0-2-2H8a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2z"/><path d="M16 2v4"/><path d="M8 2v4"/><path d="M3 10h18"/></svg>
          <span v-if="!sidebarCollapsed">News Articles</span>
        </router-link>
        <router-link to="/admin/videos" class="nav-item" active-class="active">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="18"><path d="M4 22h16a2 2 0 0 0 2-2V4a2 2 0 0 0-2-2H8a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2z"/><path d="M16 2v4"/><path d="M8 2v4"/><path d="M3 10h18"/></svg>
          <span v-if="!sidebarCollapsed">Videos</span>
        </router-link>
        <div class="nav-divider"></div>
        <router-link to="/" class="nav-item" target="_blank">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="18"><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/><polyline points="15 3 21 3 21 9"/><line x1="10" y1="14" x2="21" y2="3"/></svg>
          <span v-if="!sidebarCollapsed">View Website</span>
        </router-link>
        <button class="nav-item nav-logout" @click="handleLogout">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="18"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/></svg>
          <span v-if="!sidebarCollapsed">Logout</span>
        </button>
      </nav>
    </aside>

    <!-- Main -->
    <div class="admin-main">
      <header class="admin-topbar">
        <div class="topbar-left">
          <h1 class="topbar-title">{{ title }}</h1>
          <p v-if="subtitle" class="topbar-sub">{{ subtitle }}</p>
        </div>
        <div class="topbar-right">
          <slot name="actions"></slot>
        </div>
      </header>
      <div class="admin-content">
        <slot></slot>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { logout } from '../../store/auth.js'

defineProps({ title: String, subtitle: String })
const router = useRouter()
const sidebarCollapsed = ref(false)

function handleLogout() {
  logout()
  router.push('/admin')
}
</script>

<style scoped>
.admin-layout { display: flex; min-height: 100vh; background: var(--bg-primary); }

/* SIDEBAR */
.admin-sidebar {
  width: 240px;
  background: var(--bg-secondary);
  border-right: 1px solid var(--border);
  display: flex;
  flex-direction: column;
  flex-shrink: 0;
  transition: width 0.3s ease;
  position: sticky;
  top: 0;
  height: 100vh;
  overflow: hidden;
}
.admin-sidebar.collapsed { width: 64px; }
.sidebar-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 20px 16px;
  border-bottom: 1px solid var(--border);
}
.sidebar-logo { display: flex; align-items: center; gap: 10px; }
.logo-mark { width: 32px; height: 32px; background: var(--accent-red); color: #fff; font-family: var(--font-display); font-size: 13px; display: flex; align-items: center; justify-content: center; border-radius: 6px; flex-shrink: 0; }
.logo-text { font-family: var(--font-display); font-size: 1.1rem; letter-spacing: 0.06em; white-space: nowrap; }
.collapse-btn { background: none; border: 1px solid var(--border); border-radius: 4px; color: var(--text-muted); padding: 4px; cursor: pointer; display: flex; align-items: center; justify-content: center; transition: all 0.2s; flex-shrink: 0; }
.collapse-btn:hover { border-color: var(--accent-red); color: var(--accent-red); }

.sidebar-nav { flex: 1; padding: 16px 8px; display: flex; flex-direction: column; gap: 4px; overflow: hidden; }
.nav-item {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 10px 12px;
  border-radius: var(--radius);
  font-family: var(--font-mono);
  font-size: 12px;
  color: var(--text-secondary);
  transition: all 0.2s;
  white-space: nowrap;
  cursor: pointer;
  background: none;
  border: none;
  text-align: left;
  width: 100%;
}
.nav-item:hover { background: rgba(255,255,255,0.05); color: var(--text-primary); }
.nav-item.active { background: rgba(230,57,70,0.12); color: var(--accent-red); }
.nav-item svg { flex-shrink: 0; }
.nav-divider { height: 1px; background: var(--border); margin: 8px 0; }
.nav-logout:hover { color: var(--accent-red); }

/* MAIN */
.admin-main { flex: 1; display: flex; flex-direction: column; min-width: 0; }
.admin-topbar {
  background: var(--bg-secondary);
  border-bottom: 1px solid var(--border);
  padding: 20px 32px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 20px;
  flex-wrap: wrap;
  position: sticky;
  top: 0;
  z-index: 10;
}
.topbar-title { font-family: var(--font-display); font-size: 1.6rem; letter-spacing: 0.04em; }
.topbar-sub { font-family: var(--font-mono); font-size: 11px; color: var(--text-muted); margin-top: 2px; }
.topbar-right { display: flex; gap: 10px; align-items: center; }
.admin-content { padding: 32px; flex: 1; }

@media (max-width: 768px) {
  .admin-sidebar { position: fixed; z-index: 100; height: 100vh; transform: translateX(-100%); }
  .admin-sidebar.collapsed { transform: translateX(0); width: 64px; }
  .admin-content { padding: 20px 16px; }
}
</style>
