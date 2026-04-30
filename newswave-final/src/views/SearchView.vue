<template>
  <div class="search-page">
    <div class="search-hero">
      <div class="container search-hero-content">
        <h1 class="search-page-title">Search NewsWave</h1>
        <div class="search-bar-wrap">
          <div class="search-input-wrap">
            <svg class="search-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="20"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/></svg>
            <input ref="inputRef" v-model="query" type="text" placeholder="Search for news, topics, people..." class="search-input" @keyup.enter="doSearch" @input="doSearch" />
            <button v-if="query" class="search-clear" @click="query='';results=[]">✕</button>
          </div>
          <button class="btn btn-primary" @click="doSearch" style="padding:14px 28px;">Search</button>
        </div>
        <div class="search-suggestions" v-if="!query">
          <span class="sugg-label">Trending:</span>
          <button v-for="s in suggestions" :key="s" class="sugg-btn" @click="query=s;doSearch()">{{ s }}</button>
        </div>
      </div>
    </div>
    <div class="container search-body">
      <div v-if="query && results.length">
        <div class="section-header">
          <h2 class="section-title">Results</h2>
          <span class="tag">{{ results.length }} found</span>
        </div>
        <div class="results-list">
          <router-link v-for="article in results" :key="article.id" :to="`/article/${article.id}`" class="result-item card">
            <img :src="article.imageUrl || article.image" :alt="article.title" class="result-img" loading="lazy" />
            <div class="result-body card-body">
              <span class="tag" :class="article.category">{{ article.category }}</span>
              <h3 class="result-title" v-html="highlight(article.title)"></h3>
              <p class="result-excerpt" v-html="highlight(article.excerpt)"></p>
              <div class="card-meta">
                <span>{{ article.author }}</span><span>·</span>
                <span>{{ article.date || article.publishedAt?.slice(0,10) }}</span>
                <span class="meta-views">{{ (article.views||0).toLocaleString() }}</span>
              </div>
            </div>
          </router-link>
        </div>
      </div>
      <div v-else-if="query && !results.length && !searching" class="no-results">
        <div class="no-res-icon">🔍</div>
        <h3>No results for "{{ query }}"</h3>
        <p>Try different keywords or browse categories below.</p>
        <div class="no-res-cats">
          <router-link v-for="cat in categories" :key="cat.slug" :to="`/category/${cat.slug}`" class="cat-bubble" :style="{ '--cat-color': cat.color }">{{ cat.label }}</router-link>
        </div>
      </div>
      <div v-else>
        <div class="section-header"><h2 class="section-title">Trending Now</h2></div>
        <div class="news-grid news-grid-3">
          <NewsCard v-for="a in trending" :key="a.id" :article="a" />
        </div>
      </div>
    </div>
  </div>
</template>
<script setup>
import { ref, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import NewsCard from '../components/NewsCard.vue'
import { newsAPI } from '../services/api.js'
import { searchArticles, getTrendingArticles, categories } from '../store/newsData.js'

const route = useRoute()
const query = ref(route.query.q || '')
const results = ref([])
const searching = ref(false)
const inputRef = ref(null)
const trending = ref(getTrendingArticles(6))
const suggestions = ['Climate Summit','Quantum Computing','Mars','AI Regulation','Champions League','Markets']

let debounceTimer = null
async function doSearch() {
  if (!query.value.trim()) { results.value = []; return }
  clearTimeout(debounceTimer)
  debounceTimer = setTimeout(async () => {
    searching.value = true
    try {
      const data = await newsAPI.search(query.value.trim())
      results.value = data && data.length ? data : searchArticles(query.value.trim())
    } catch { results.value = searchArticles(query.value.trim()) }
    finally { searching.value = false }
  }, 300)
}

function highlight(text) {
  if (!query.value || !text) return text
  const re = new RegExp(`(${query.value.replace(/[.*+?^${}()|[\]\\]/g,'\\$&')})`, 'gi')
  return text.replace(re, '<mark>$1</mark>')
}

onMounted(async () => {
  try {
    const data = await newsAPI.getTrending()
    if (data && data.length) trending.value = data.slice(0, 6)
  } catch {}
  if (query.value) doSearch()
  inputRef.value?.focus()
})
</script>
<style scoped>
.search-hero { background:var(--bg-secondary); border-bottom:1px solid var(--border); padding:70px 0 50px; }
.search-page-title { font-family:var(--font-display); font-size:clamp(2.5rem,5vw,4.5rem); letter-spacing:0.04em; margin-bottom:28px; }
.search-bar-wrap { display:flex; gap:12px; align-items:center; max-width:700px; margin-bottom:20px; }
.search-input-wrap { flex:1; position:relative; display:flex; align-items:center; }
.search-icon { position:absolute; left:14px; color:var(--text-muted); pointer-events:none; }
.search-input { width:100%; background:var(--bg-card); border:1px solid var(--border-bright); border-radius:var(--radius); padding:14px 42px 14px 44px; font-family:var(--font-body); font-size:1rem; color:var(--text-primary); outline:none; transition:border-color 0.2s; }
.search-input:focus { border-color:var(--accent-red); box-shadow:0 0 0 3px var(--accent-red-glow); }
.search-input::placeholder { color:var(--text-muted); }
.search-clear { position:absolute; right:12px; background:none; border:none; color:var(--text-muted); cursor:pointer; font-size:14px; }
.search-suggestions { display:flex; align-items:center; gap:10px; flex-wrap:wrap; }
.sugg-label { font-family:var(--font-mono); font-size:11px; color:var(--text-muted); text-transform:uppercase; }
.sugg-btn { padding:5px 14px; background:transparent; border:1px solid var(--border-bright); border-radius:20px; font-family:var(--font-mono); font-size:11px; color:var(--text-secondary); cursor:pointer; transition:all 0.2s; }
.sugg-btn:hover { border-color:var(--accent-red); color:var(--accent-red); }
.search-body { padding:50px 0 80px; }
.results-list { display:flex; flex-direction:column; gap:16px; }
.result-item { display:grid; grid-template-columns:200px 1fr; }
.result-img { width:200px; height:130px; object-fit:cover; }
.result-title { font-family:var(--font-headline); font-size:1.1rem; font-weight:700; margin:8px 0 6px; line-height:1.35; }
.result-excerpt { font-size:0.85rem; color:var(--text-secondary); line-height:1.6; margin-bottom:8px; display:-webkit-box; -webkit-line-clamp:2; -webkit-box-orient:vertical; overflow:hidden; }
.meta-views { margin-left:auto; font-size:10px; color:var(--text-muted); }
:deep(mark) { background:rgba(230,57,70,0.25); color:var(--accent-red); padding:0 2px; border-radius:2px; }
.no-results { text-align:center; padding:80px 20px; }
.no-res-icon { font-size:3rem; margin-bottom:16px; }
.no-results h3 { font-family:var(--font-headline); font-size:1.5rem; margin-bottom:10px; }
.no-results p { color:var(--text-muted); margin-bottom:28px; }
.no-res-cats { display:flex; flex-wrap:wrap; gap:10px; justify-content:center; }
.cat-bubble { padding:7px 16px; border-radius:20px; font-family:var(--font-mono); font-size:11px; text-transform:uppercase; letter-spacing:0.08em; border:1px solid color-mix(in srgb, var(--cat-color) 40%, transparent); color:var(--cat-color); transition:all 0.2s; }
.cat-bubble:hover { background:var(--cat-color); color:#fff; }
.btn { display:inline-flex; align-items:center; padding:10px 24px; font-family:var(--font-mono); font-size:12px; font-weight:500; text-transform:uppercase; letter-spacing:0.1em; border-radius:var(--radius); transition:all 0.2s; cursor:pointer; border:1px solid transparent; }
.btn-primary { background:var(--accent-red); color:#fff; border-color:var(--accent-red); }
.btn-primary:hover { background:#c62b38; }
@media (max-width:600px) { .result-item { grid-template-columns:1fr; } .result-img { width:100%; height:180px; } .search-bar-wrap { flex-direction:column; align-items:stretch; } }
</style>
