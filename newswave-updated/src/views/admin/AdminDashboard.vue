<template>
  <AdminLayout title="Dashboard" subtitle="GlobalWatch News Admin Panel">
    <div class="dashboard">
      <!-- Stats Cards -->
      <div class="stats-grid">
        <div class="stat-card" v-for="stat in stats" :key="stat.label" :style="{ '--c': stat.color }">
          <div class="stat-icon">{{ stat.icon }}</div>
          <div class="stat-body">
            <div class="stat-value">{{ stat.value }}</div>
            <div class="stat-label">{{ stat.label }}</div>
          </div>
          <div class="stat-glow"></div>
        </div>
      </div>

      <!-- Quick Actions -->
      <div class="quick-actions">
        <h2 class="section-heading">Quick Actions</h2>
        <div class="actions-grid">
          <router-link to="/admin/news/add" class="action-card">
            <div class="action-icon" style="background: rgba(230,57,70,0.1); color: var(--accent-red);">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="24"><path d="M12 5v14M5 12h14"/></svg>
            </div>
            <div class="action-label">Add News Article</div>
            <div class="action-sub">Create and publish a new story</div>
          </router-link>
          <router-link to="/admin/tickers" class="action-card">
            <div class="action-icon" style="background: rgba(76,201,240,0.1); color: var(--accent-cyan);">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="24"><path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z"/></svg>
            </div>
            <div class="action-label">Manage Tickers</div>
            <div class="action-sub">Update breaking news tickers</div>
          </router-link>
          <router-link to="/admin/news" class="action-card">
            <div class="action-icon" style="background: rgba(244,162,97,0.1); color: var(--accent-amber);">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="24"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>
            </div>
            <div class="action-label">Edit Articles</div>
            <div class="action-sub">Browse and manage all news</div>
          </router-link>
          <a href="/" target="_blank" class="action-card">
            <div class="action-icon" style="background: rgba(5,150,105,0.1); color: #10b981;">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="24"><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/><polyline points="15 3 21 3 21 9"/><line x1="10" y1="14" x2="21" y2="3"/></svg>
            </div>
            <div class="action-label">View Live Site</div>
            <div class="action-sub">See how the website looks</div>
          </a>
        </div>
      </div>

      <!-- Info Banner -->
      <div class="info-banner">
        <div class="info-icon">💡</div>
        <div class="info-text">
          <strong>API Backend Required</strong> — Make sure your Quarkus backend is running on
          <code>http://localhost:8080</code> for live data. Static mock data is shown when API is unavailable.
        </div>
      </div>
    </div>
  </AdminLayout>
</template>

<script setup>
import AdminLayout from './AdminLayout.vue'

const stats = [
  { label: 'Total Articles', value: '—', icon: '📰', color: '#e63946' },
  { label: 'Active Tickers', value: '—', icon: '⚡', color: '#4cc9f0' },
  { label: 'Trending Stories', value: '—', icon: '🔥', color: '#f4a261' },
  { label: 'Categories', value: '8', icon: '🗂', color: '#10b981' },
]
</script>

<style scoped>
.dashboard { display: flex; flex-direction: column; gap: 36px; }
.stats-grid { display: grid; grid-template-columns: repeat(4, 1fr); gap: 16px; }
.stat-card {
  background: var(--bg-card);
  border: 1px solid var(--border);
  border-radius: var(--radius-lg);
  padding: 24px;
  display: flex;
  align-items: center;
  gap: 16px;
  position: relative;
  overflow: hidden;
  transition: all 0.2s;
}
.stat-card:hover { border-color: var(--c); transform: translateY(-2px); }
.stat-glow { position: absolute; top: -30px; right: -30px; width: 80px; height: 80px; background: var(--c); opacity: 0.08; border-radius: 50%; pointer-events: none; }
.stat-icon { font-size: 2rem; flex-shrink: 0; }
.stat-value { font-family: var(--font-display); font-size: 2rem; color: var(--c); line-height: 1; }
.stat-label { font-family: var(--font-mono); font-size: 10px; text-transform: uppercase; letter-spacing: 0.08em; color: var(--text-muted); margin-top: 4px; }

.section-heading { font-family: var(--font-display); font-size: 1.4rem; letter-spacing: 0.04em; margin-bottom: 16px; }
.actions-grid { display: grid; grid-template-columns: repeat(4, 1fr); gap: 16px; }
.action-card {
  background: var(--bg-card);
  border: 1px solid var(--border);
  border-radius: var(--radius-lg);
  padding: 24px 20px;
  display: flex;
  flex-direction: column;
  gap: 10px;
  transition: all 0.2s;
  cursor: pointer;
}
.action-card:hover { border-color: var(--border-bright); transform: translateY(-3px); box-shadow: 0 12px 30px rgba(0,0,0,0.3); }
.action-icon { width: 48px; height: 48px; border-radius: 10px; display: flex; align-items: center; justify-content: center; }
.action-label { font-weight: 600; font-size: 0.95rem; }
.action-sub { font-size: 0.78rem; color: var(--text-muted); line-height: 1.4; }

.info-banner {
  display: flex;
  align-items: flex-start;
  gap: 14px;
  background: rgba(76,201,240,0.06);
  border: 1px solid rgba(76,201,240,0.2);
  border-radius: var(--radius-lg);
  padding: 16px 20px;
}
.info-icon { font-size: 1.4rem; flex-shrink: 0; }
.info-text { font-size: 0.88rem; color: var(--text-secondary); line-height: 1.6; }
.info-text strong { color: var(--accent-cyan); }
.info-text code { background: rgba(76,201,240,0.1); padding: 1px 6px; border-radius: 3px; font-family: var(--font-mono); font-size: 12px; color: var(--accent-cyan); }

@media (max-width: 900px) { .stats-grid, .actions-grid { grid-template-columns: 1fr 1fr; } }
@media (max-width: 540px) { .stats-grid, .actions-grid { grid-template-columns: 1fr; } }
</style>
