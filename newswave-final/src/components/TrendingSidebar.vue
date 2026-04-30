<template>
  <aside class="trending-sidebar">
    <div class="section-header">
      <h2 class="section-title">Trending</h2>
    </div>
    <div v-if="loading" class="ts-loading">
      <div v-for="i in 5" :key="i" class="ts-skeleton"></div>
    </div>
    <ol v-else class="trending-list">
      <li v-for="(article, i) in trending" :key="article.id" class="trending-item">
        <span class="trending-num">{{ String(i + 1).padStart(2, '0') }}</span>
        <div class="trending-body">
          <span class="tag" :class="article.category" style="font-size:9px;padding:2px 7px;">{{ article.category }}</span>
          <router-link :to="`/article/${article.id}`" class="trending-title">{{ article.title }}</router-link>
          <div class="trending-meta">
            <span>{{ article.readTimeMin || article.readTime || '3' }} min</span>
            <span>·</span>
            <span>{{ article.views?.toLocaleString() || 0 }} views</span>
          </div>
        </div>
      </li>
    </ol>
  </aside>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { newsAPI } from '../services/api.js'
import { getTrendingArticles } from '../store/newsData.js'

const trending = ref([])
const loading = ref(true)

onMounted(async () => {
  try {
    const data = await newsAPI.getTrending()
    trending.value = data && data.length ? data.slice(0, 5) : getTrendingArticles(5)
  } catch {
    trending.value = getTrendingArticles(5)
  } finally {
    loading.value = false
  }
})
</script>

<style scoped>
.trending-sidebar { background: var(--bg-card); border: 1px solid var(--border); border-radius: var(--radius-lg); padding: 20px; }
.ts-loading { display: flex; flex-direction: column; gap: 16px; }
.ts-skeleton { height: 60px; background: linear-gradient(90deg, var(--bg-card) 0%, var(--bg-card-hover) 50%, var(--bg-card) 100%); background-size: 200% 100%; animation: shimmer 1.5s infinite; border-radius: var(--radius); }
.trending-list { list-style: none; }
.trending-item { display: flex; gap: 16px; padding: 14px 0; border-bottom: 1px solid var(--border); }
.trending-item:last-child { border-bottom: none; }
.trending-num { font-family: var(--font-display); font-size: 2rem; color: var(--text-muted); line-height: 1; flex-shrink: 0; min-width: 32px; }
.trending-item:first-child .trending-num { color: var(--accent-red); }
.trending-body { display: flex; flex-direction: column; gap: 6px; min-width: 0; }
.trending-title { font-family: var(--font-headline); font-size: 0.88rem; font-weight: 700; line-height: 1.4; color: var(--text-primary); display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical; overflow: hidden; transition: color 0.2s; }
.trending-title:hover { color: var(--accent-red); }
.trending-meta { display: flex; gap: 6px; font-family: var(--font-mono); font-size: 10px; color: var(--text-muted); }
</style>
