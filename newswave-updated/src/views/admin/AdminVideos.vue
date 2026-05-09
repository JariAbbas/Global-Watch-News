<template>
  <AdminLayout title="Videos" subtitle="Manage all video content">
    <template #actions>
      <router-link to="/admin/videos/add" class="btn btn-primary">+ Add Video</router-link>
    </template>

    <div class="video-admin-container">
      <div class="filters-bar">
        <input v-model="search" type="text" placeholder="Search videos or categories..." class="filter-input" />
      </div>

      <div v-if="loading" class="table-loading">
        <div v-for="i in 5" :key="i" class="row-skeleton"></div>
      </div>

      <div v-else-if="!filtered.length" class="empty-state">
        <div class="empty-icon">🎬</div>
        <h3>No videos found</h3>
        <router-link to="/admin/videos/add" class="btn btn-primary" style="margin-top:16px;">+ Add Video</router-link>
      </div>

      <table v-else class="news-table">
        <thead>
          <tr>
            <th>Video</th>
            <th>Category</th>
            <th>Status</th>
            <th>Views</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          <!-- Class inactive lagayi hai opacity ke liye -->
          <tr v-for="v in filtered" :key="v.id" :class="{ 'row-inactive': !v.isActive }">
            <td>
              <div class="video-row">
                <div class="video-thumb-mini">
                  <img v-if="v.thumbnailUrl" :src="v.thumbnailUrl" alt="" />
                  <div v-else class="no-thumb">🎬</div>
                </div>
                <div class="video-info">
                  <div class="video-title-cell">{{ v.title }}</div>
                  <div class="video-excerpt-cell">{{ v.excerpt }}</div>
                </div>
              </div>
            </td>
            <td><span class="tag" :class="v.category">{{ v.category }}</span></td>
            <td>
              <div class="status-badges">
                <span class="status-dot" :class="v.isActive ? 'active' : 'inactive'">
                  {{ v.isActive ? 'Active' : 'Inactive' }}
                </span>
                <span v-if="v.isFeatured" class="status-dot featured">⭐ Featured</span>
              </div>
            </td>
            <td><span class="mono-text">{{ (v.views || 0).toLocaleString() }}</span></td>
            <td>
              <div class="action-btns">
                <router-link :to="`/admin/videos/edit/${v.id}`" class="icon-btn edit" title="Edit">✏️</router-link>
                
                <!-- Toggle Button -->
                <button class="icon-btn" @click="toggleActive(v)" :title="v.isActive ? 'Disable' : 'Enable'">
                  {{ v.isActive ? '🚫' : '✅' }}
                </button>

                <button class="icon-btn delete" @click="remove(v)" title="Delete">🗑️</button>
              </div>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </AdminLayout>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import AdminLayout from './AdminLayout.vue'
import { videoAPI } from '../../services/api.js'

const videos = ref([])
const loading = ref(true)
const search = ref('')

onMounted(async () => {
  await loadVideos()
})

async function loadVideos() {
  loading.value = true
  try {
    const data = await videoAPI.getAll(0, 100)
    videos.value = Array.isArray(data) ? data : (data.content || [])
  } catch (err) {
    console.error("Failed to load videos", err)
  } finally {
    loading.value = false
  }
}

const filtered = computed(() => {
  let list = videos.value
  if (search.value) {
    const q = search.value.toLowerCase()
    list = list.filter(v => v.title?.toLowerCase().includes(q) || v.category?.toLowerCase().includes(q))
  }
  // Inactive videos gayab nahi honge, sirf faded dikhenge logic niche template mein hai
  return list
})

// Toggle Active/Inactive Status
async function toggleActive(video) {
  try {
    const originalState = video.isActive
    // Frontend par foran update karein
    video.isActive = !originalState
    
    // Note: ensure karein ke aapki videoAPI mein update ya toggle ka method ho
    // Agar specific toggle method nahi hai to update use karein:
    await videoAPI.update(video.id, { ...video, isActive: !originalState })
    
  } catch (err) {
    console.error("Toggle failed", err)
    alert("Could not update status")
    video.isActive = !video.isActive // Rollback
  }
}

async function remove(v) {
  if (!confirm(`Delete "${v.title}" permanently from database?`)) return
  try {
    await videoAPI.remove(v.id)
    videos.value = videos.value.filter(x => x.id !== v.id)
  } catch (err) {
    // Handle non-JSON success response
    if (err.message?.includes('JSON') || err.name === 'SyntaxError') {
      videos.value = videos.value.filter(x => x.id !== v.id)
    } else {
      console.error(err)
      alert("Delete failed on server")
    }
  }
}

// Format Date function
function formatDate(d) {
  if (!d) return '—'
  const date = new Date(d)
  return isNaN(date) ? '—' : date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
}
</script>

<style scoped>
.filters-bar { margin-bottom: 20px; }
.filter-input { background: var(--bg-secondary); border: 1px solid var(--border); border-radius: var(--radius); padding: 8px 14px; font-family: var(--font-body); font-size: 0.88rem; color: var(--text-primary); outline: none; width: 300px; }
.filter-input:focus { border-color: var(--accent-red); }
.table-loading { display: flex; flex-direction: column; gap: 10px; }
.row-skeleton { height: 56px; background: var(--bg-secondary); border-radius: var(--radius); animation: pulse 1.4s ease-in-out infinite; }
@keyframes pulse { 0%,100%{opacity:1} 50%{opacity:.4} }
.empty-state { text-align: center; padding: 60px 0; color: var(--text-muted); }
.empty-icon { font-size: 2.5rem; margin-bottom: 12px; }
.news-table { width: 100%; border-collapse: collapse; }
.news-table th { font-family: var(--font-mono); font-size: 10px; text-transform: uppercase; letter-spacing: 0.1em; color: var(--text-muted); padding: 10px 12px; text-align: left; border-bottom: 1px solid var(--border); }
.news-table td { padding: 12px; border-bottom: 1px solid var(--border); vertical-align: middle; }
.video-row { display: flex; align-items: center; gap: 12px; }
.video-thumb-mini { width: 80px; height: 45px; border-radius: 4px; overflow: hidden; flex-shrink: 0; background: var(--bg-secondary); display: flex; align-items: center; justify-content: center; }
.video-thumb-mini img { width: 100%; height: 100%; object-fit: cover; }
.no-thumb { font-size: 1.2rem; }
.video-title-cell { font-size: 0.88rem; font-weight: 600; line-height: 1.3; }
.video-excerpt-cell { font-size: 0.76rem; color: var(--text-muted); margin-top: 2px; display: -webkit-box; -webkit-line-clamp: 1; -webkit-box-orient: vertical; overflow: hidden; }
.mono-text { font-family: var(--font-mono); font-size: 12px; color: var(--text-muted); }
.status-badges { display: flex; flex-direction: column; gap: 4px; }
.status-dot { font-family: var(--font-mono); font-size: 10px; padding: 2px 8px; border-radius: 2px; width: fit-content; }
.status-dot.active { background: rgba(16,185,129,0.1); color: #10b981; }
.status-dot.inactive { background: rgba(255,255,255,0.05); color: var(--text-muted); }
.status-dot.featured { background: rgba(230,57,70,0.1); color: var(--accent-red); }
.action-btns { display: flex; gap: 6px; }
.action-btn { font-family: var(--font-mono); font-size: 10px; text-transform: uppercase; padding: 4px 10px; border-radius: 2px; cursor: pointer; border: 1px solid; text-decoration: none; }
.action-btn.edit { border-color: var(--border-bright); color: var(--text-secondary); background: transparent; }
.action-btn.edit:hover { color: var(--text-primary); }
.action-btn.delete { border-color: rgba(230,57,70,0.3); color: var(--accent-red); background: transparent; }
.action-btn.delete:hover { background: rgba(230,57,70,0.08); }
.btn { display: inline-flex; align-items: center; gap: 8px; padding: 9px 20px; font-family: var(--font-mono); font-size: 12px; font-weight: 500; text-transform: uppercase; letter-spacing: 0.08em; border-radius: var(--radius); cursor: pointer; transition: all 0.2s; border: 1px solid transparent; text-decoration: none; }
.btn-primary { background: var(--accent-red); color: #fff; border-color: var(--accent-red); }
.btn-primary:hover { background: #c62b38; }
.row-inactive { opacity: 0.5; }
.icon-btn { 
  background: transparent; 
  border: 1px solid var(--border); 
  border-radius: 4px; 
  padding: 4px 8px; 
  cursor: pointer; 
  font-size: 14px; 
  transition: all 0.2s;
}
.icon-btn:hover { border-color: var(--accent-red); background: rgba(255,255,255,0.05); }
</style>