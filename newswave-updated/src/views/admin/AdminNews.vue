<template>
  <AdminLayout title="News Articles" subtitle="Manage all news stories">
    <template #actions>
      <router-link to="/admin/news/add" class="btn btn-primary">+ Add Article</router-link>
    </template>

    <div class="news-admin-page">
      <!-- Filters bar -->
      <div class="filters-bar">
        <div class="search-wrap">
          <svg class="search-icon-f" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="16"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/></svg>
          <input v-model="searchQ" type="text" placeholder="Search articles..." class="filter-input search-input-f" @input="onSearch" />
        </div>
        <select v-model="filterCat" class="filter-input" @change="loadNews">
          <option value="">All Categories</option>
          <option v-for="c in categories" :key="c.slug" :value="c.slug">{{ c.label }}</option>
        </select>
        <select v-model="filterStatus" class="filter-input" @change="loadNews">
          <option value="">All Status</option>
          <option value="active">Active</option>
          <option value="inactive">Inactive</option>
          <option value="trending">Trending</option>
          <option value="featured">Featured</option>
        </select>
      </div>

      <!-- Table -->
      <div class="news-table-wrap">
        <div v-if="loading" class="table-loading">
          <div v-for="i in 6" :key="i" class="row-skeleton"></div>
        </div>
        <div v-else-if="!filteredNews.length" class="empty-state">
          <div class="empty-icon">📰</div>
          <h3>No articles found</h3>
          <p>Try changing filters or add a new article</p>
          <router-link to="/admin/news/add" class="btn btn-primary" style="margin-top:16px;">+ Add Article</router-link>
        </div>
        <table v-else class="news-table">
          <thead>
            <tr>
              <th>Article</th>
              <th>Category</th>
              <th>Author</th>
              <th>Status</th>
              <th>Views</th>
              <th>Date</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="article in filteredNews" :key="article.id" :class="{ inactive: !article.isActive }">
              <td class="col-title">
                <div class="article-thumb-wrap">
                  <img v-if="article.imageUrl || article.image" :src="article.imageUrl || article.image" class="article-thumb" />
                  <div v-else class="article-thumb-placeholder">📰</div>
                  <div>
                    <div class="article-title-cell">{{ article.title }}</div>
                    <div class="article-excerpt-cell">{{ (article.excerpt || '').slice(0, 70) }}...</div>
                  </div>
                </div>
              </td>
              <td><span class="tag" :class="article.category">{{ article.category }}</span></td>
              <td class="col-author">
                <div class="author-name">{{ article.author }}</div>
                <div class="author-role-cell">{{ article.authorRole }}</div>
              </td>
              <td>
                <div class="status-badges">
                  <span class="status-badge" :class="article.isActive ? 'active' : 'inactive'">{{ article.isActive ? 'Active' : 'Inactive' }}</span>
                  <span v-if="article.isTrending" class="status-badge trending">🔥 Trending</span>
                  <span v-if="article.isFeatured" class="status-badge featured">⭐ Featured</span>
                </div>
              </td>
              <td class="col-views">{{ (article.views || 0).toLocaleString() }}</td>
              <td class="col-date">{{ formatDate(article.publishedAt || article.date) }}</td>
              <td>
                <div class="row-actions">
                  <router-link :to="`/admin/news/edit/${article.id}`" class="icon-btn edit" title="Edit">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="14"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>
                  </router-link>
                  <button class="icon-btn" :class="article.isTrending ? 'trending-on' : 'trending-off'" @click="toggleTrending(article)" title="Toggle Trending">🔥</button>
                  <button v-if="article.isActive" class="icon-btn disable" @click="toggleActive(article)" title="Disable">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="14"><circle cx="12" cy="12" r="10"/><line x1="4.93" y1="4.93" x2="19.07" y2="19.07"/></svg>
                  </button>
                  <button v-else class="icon-btn enable" @click="toggleActive(article)" title="Enable">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="14"><polyline points="20 6 9 17 4 12"/></svg>
                  </button>
                  <button class="icon-btn delete" @click="deleteArticle(article.id)" title="Delete">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="14"><polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6"/><path d="M10 11v6M14 11v6"/></svg>
                  </button>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <!-- Pagination -->
      <div v-if="totalPages > 1" class="pagination">
        <button class="page-btn" :disabled="page === 0" @click="changePage(page - 1)">← Prev</button>
        <span class="page-info">Page {{ page + 1 }} of {{ totalPages }}</span>
        <button class="page-btn" :disabled="page >= totalPages - 1" @click="changePage(page + 1)">Next →</button>
      </div>
    </div>
  </AdminLayout>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import AdminLayout from './AdminLayout.vue'
import { newsAPI } from '../../services/api.js'
import { articles as mockArticles, categories } from '../../store/newsData.js'

const news = ref([])
const loading = ref(true)
const searchQ = ref('')
const filterCat = ref('')
const filterStatus = ref('') // Iska default '' rakhein (All)
const page = ref(0)
const pageSize = 20
const totalPages = ref(1)


const filteredNews = computed(() => {
  let list = news.value
  
  // 1. Search Filter
  if (searchQ.value) {
    const q = searchQ.value.toLowerCase()
    list = list.filter(a => a.title?.toLowerCase().includes(q) || a.author?.toLowerCase().includes(q))
  }
  
  // 2. Status Filter 
  // IMPORTANT: Hum sirf tab filter karenge jab user ne specifically select kiya ho
  // Warna isActive false wale articles bhi list mein dikhte rahenge (bas visually faded honge)
  if (filterStatus.value === 'active') {
    list = list.filter(a => a.isActive)
  } else if (filterStatus.value === 'inactive') {
    list = list.filter(a => !a.isActive)
  } else if (filterStatus.value === 'trending') {
    list = list.filter(a => a.isTrending)
  } else if (filterStatus.value === 'featured') {
    list = list.filter(a => a.isFeatured)
  }
  
  return list
})


function formatDate(d) {
  if (!d) return '—'
  // Date parsing logic
  const date = new Date(d)
  if (isNaN(date.getTime())) return '—' // Invalid date check
  return date.toLocaleDateString('en-US', { 
    month: 'short', 
    day: 'numeric', 
    year: 'numeric' 
  })
}

async function loadNews() {
  loading.value = true
  try {
    const data = filterCat.value
      ? await newsAPI.getByCategory(filterCat.value, page.value, pageSize)
      : await newsAPI.getAll(page.value, pageSize)
    
    // Check if data is array or object with content
    const result = Array.isArray(data) ? data : (data?.content || [])
    news.value = result
    
    // Fallback to mock only if really empty
    if (!news.value.length && page.value === 0 && !filterCat.value) {
       news.value = mockArticles 
    }
  } catch (err) { 
    console.error("Load failed", err)
    news.value = mockArticles 
  } finally { 
    loading.value = false 
  }
}

async function toggleActive(article) {
  try {
    // Current status save karein
    const currentState = article.isActive;
    
    if (currentState) {
      await newsAPI.disable(article.id);
    } else {
      await newsAPI.enable(article.id);
    }
    
    // Sirf is article ki local state update karein taake page refresh na ho
    article.isActive = !currentState;
    
    // Optional: Full refresh if you want to be 100% sure
    // await loadNews(); 
  } catch (err) {
    console.error("Status update failed:", err);
    alert('API Error: Could not update status');
  }
}

async function deleteArticle(id) {
  if (!confirm('Delete this article permanently from database?')) return
  try {
    // API call for hard delete
    await newsAPI.remove(id);
    
    // Successfully deleted from DB, now remove from local array immediately
    news.value = news.value.filter(a => a.id !== id);
    alert('Article deleted successfully');
  } catch (err) {
    /* 
      Handle Non-JSON response (Parsing error)
      Agar article delete ho gaya hai par response text hai, tab bhi array filter karein
    */
    if (err.message?.includes('JSON') || err.name === 'SyntaxError') {
      news.value = news.value.filter(a => a.id !== id);
    } else {
      console.error(err);
      alert('Delete failed: Server error');
    }
  }
}

function changePage(p) { page.value = p; loadNews() }
onMounted(loadNews)
</script>

<style scoped>
.news-admin-page { display: flex; flex-direction: column; gap: 20px; }
.filters-bar { display: flex; gap: 12px; flex-wrap: wrap; background: var(--bg-card); border: 1px solid var(--border); border-radius: var(--radius-lg); padding: 16px; }
.search-wrap { flex: 1; min-width: 200px; position: relative; display: flex; align-items: center; }
.search-icon-f { position: absolute; left: 12px; color: var(--text-muted); pointer-events: none; }
.search-input-f { padding-left: 38px !important; }
.filter-input { background: var(--bg-secondary); border: 1px solid var(--border); border-radius: var(--radius); padding: 9px 14px; font-family: var(--font-body); font-size: 0.88rem; color: var(--text-primary); outline: none; transition: border-color 0.2s; width: 100%; }
.filter-input:focus { border-color: var(--accent-red); }
select.filter-input { min-width: 160px; cursor: pointer; }

.news-table-wrap { background: var(--bg-card); border: 1px solid var(--border); border-radius: var(--radius-lg); overflow: hidden; }
.table-loading { padding: 16px; display: flex; flex-direction: column; gap: 10px; }
.row-skeleton { height: 60px; background: linear-gradient(90deg, var(--bg-card) 0%, var(--bg-card-hover) 50%, var(--bg-card) 100%); background-size: 200% 100%; animation: shimmer 1.5s infinite; border-radius: var(--radius); }

.news-table { width: 100%; border-collapse: collapse; }
.news-table th { padding: 12px 16px; font-family: var(--font-mono); font-size: 10px; text-transform: uppercase; letter-spacing: 0.1em; color: var(--text-muted); text-align: left; border-bottom: 1px solid var(--border); background: var(--bg-secondary); }
.news-table td { padding: 12px 16px; border-bottom: 1px solid var(--border); vertical-align: middle; }
.news-table tr:last-child td { border-bottom: none; }
.news-table tr.inactive { opacity: 0.5; }
.news-table tr:hover td { background: rgba(255,255,255,0.02); }

.col-title { max-width: 320px; }
.article-thumb-wrap { display: flex; align-items: center; gap: 12px; }
.article-thumb { width: 56px; height: 40px; object-fit: cover; border-radius: 4px; flex-shrink: 0; }
.article-thumb-placeholder { width: 56px; height: 40px; background: var(--bg-secondary); border-radius: 4px; display: flex; align-items: center; justify-content: center; font-size: 1.2rem; flex-shrink: 0; }
.article-title-cell { font-size: 0.85rem; font-weight: 600; line-height: 1.3; display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical; overflow: hidden; }
.article-excerpt-cell { font-size: 0.75rem; color: var(--text-muted); margin-top: 2px; }

.col-author { min-width: 120px; }
.author-name { font-size: 0.85rem; font-weight: 500; }
.author-role-cell { font-size: 0.72rem; color: var(--text-muted); }
.col-views { font-family: var(--font-mono); font-size: 12px; color: var(--text-muted); }
.col-date { font-family: var(--font-mono); font-size: 11px; color: var(--text-muted); white-space: nowrap; }

.status-badges { display: flex; flex-direction: column; gap: 3px; }
.status-badge { display: inline-block; font-family: var(--font-mono); font-size: 9px; text-transform: uppercase; padding: 2px 7px; border-radius: 2px; width: fit-content; }
.status-badge.active { background: rgba(16,185,129,0.15); color: #10b981; }
.status-badge.inactive { background: rgba(255,255,255,0.06); color: var(--text-muted); }
.status-badge.trending { background: rgba(244,162,97,0.15); color: var(--accent-amber); }
.status-badge.featured { background: rgba(255,214,10,0.1); color: var(--accent-gold); }

.row-actions { display: flex; gap: 6px; }
.icon-btn { width: 30px; height: 30px; border: 1px solid var(--border); border-radius: var(--radius); background: transparent; color: var(--text-muted); display: flex; align-items: center; justify-content: center; cursor: pointer; transition: all 0.2s; font-size: 12px; text-decoration: none; }
.icon-btn.edit:hover { border-color: var(--accent-cyan); color: var(--accent-cyan); }
.icon-btn.trending-off { opacity: 0.3; }
.icon-btn.trending-on { opacity: 1; border-color: var(--accent-amber); }
.icon-btn.disable:hover { border-color: var(--accent-amber); color: var(--accent-amber); }
.icon-btn.enable:hover { border-color: #10b981; color: #10b981; }
.icon-btn.delete:hover { border-color: var(--accent-red); color: var(--accent-red); }

.empty-state { text-align: center; padding: 60px 20px; }
.empty-icon { font-size: 3rem; margin-bottom: 12px; }
.empty-state h3 { font-family: var(--font-headline); font-size: 1.2rem; margin-bottom: 6px; }
.empty-state p { color: var(--text-muted); font-size: 0.88rem; }

.pagination { display: flex; align-items: center; justify-content: center; gap: 16px; padding: 16px; }
.page-btn { padding: 8px 16px; background: var(--bg-card); border: 1px solid var(--border); border-radius: var(--radius); font-family: var(--font-mono); font-size: 11px; color: var(--text-secondary); cursor: pointer; transition: all 0.2s; }
.page-btn:hover:not(:disabled) { border-color: var(--accent-red); color: var(--accent-red); }
.page-btn:disabled { opacity: 0.4; cursor: not-allowed; }
.page-info { font-family: var(--font-mono); font-size: 12px; color: var(--text-muted); }

.btn { display: inline-flex; align-items: center; gap: 8px; padding: 9px 20px; font-family: var(--font-mono); font-size: 12px; font-weight: 500; text-transform: uppercase; letter-spacing: 0.08em; border-radius: var(--radius); cursor: pointer; transition: all 0.2s; border: 1px solid transparent; text-decoration: none; }
.btn-primary { background: var(--accent-red); color: #fff; border-color: var(--accent-red); }
.btn-primary:hover { background: #c62b38; }
</style>
