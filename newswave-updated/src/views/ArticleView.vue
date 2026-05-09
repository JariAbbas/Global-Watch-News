<template>
  <div v-if="loading" class="loading-page">
    <div class="loading-spinner"></div>
    <p class="loading-text">Loading article...</p>
  </div>

  <div v-else-if="article" class="article-page">
    
    <div class="article-hero">
      <div class="article-hero-media">
        <img v-if="showImage" :src="heroImage" :alt="article.title" class="article-hero-img" @error="onImgError" />
        <div v-else class="no-image">No image available</div>
      </div>
      <div class="article-hero-overlay"></div>
      <div class="container article-hero-content">
        <div class="article-breadcrumb">
          <router-link to="/">Home</router-link>
          <span>›</span>
          <router-link :to="`/category/${article.category}`">{{ article.category }}</router-link>
        </div>
        <h1 class="article-title">{{ article.title }}</h1>
        <p v-if="article.excerpt" class="article-excerpt">{{ article.excerpt }}</p>
        
        <div class="article-byline">
          <div class="byline-avatar">{{ authorInitial }}</div>
          <div class="byline-info">
            <div class="byline-name">{{ article.author || 'NewsWave Staff' }}</div>
            <div class="byline-role">{{ article.authorRole || 'Correspondent' }}</div>
          </div>
          <div class="byline-divider"></div>
          <div class="byline-date">{{ formatDate(article.createdAt || article.date) }}</div>
          <div class="byline-read">{{ article.readTimeMin || 3 }} min read</div>
        </div>
      </div>
    </div>

    <div class="container article-layout">
      <article class="article-body">
        <div class="article-text" v-if="paragraphs.length">
          <p v-for="(p, i) in paragraphs" :key="i" class="article-para">{{ p }}</p>
        </div>
      </article>

      <aside class="article-sidebar">
        <div class="widget source-widget" v-if="article.source">
        <div class="widget-header">
          <span class="widget-title">Source</span>
        </div>

        <div class="source-content">
          <span class="source-badge">
            {{ article.source }}
          </span>
        </div>
      </div>

        <TrendingSidebar />
      </aside>
    </div>

    <section v-if="related.length" class="related-section">
      <div class="container">
        <h3 class="related-title">More in {{ article.category }}</h3>
        <div class="news-grid">
          <NewsCard v-for="rel in related" :key="rel.id" :article="rel" size="small" />
        </div>
      </div>
    </section>
  </div>

  <div v-else class="not-found-wrap">
    <h2>Article not found</h2>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, watch } from 'vue'
import { useRoute } from 'vue-router'
import NewsCard from '../components/NewsCard.vue'
import TrendingSidebar from '../components/TrendingSidebar.vue'
import { newsAPI } from '../services/api.js'

const route = useRoute()
const article = ref(null)
const related = ref([])
const loading = ref(true)
const imgErrored = ref(false)

const routeId = computed(() => route.params.id)

// ... (Existing Computed properties remain same) ...
const heroImage = computed(() => {
  if (imgErrored.value) return 'https://images.unsplash.com/photo-1504711434969-e33886168f5c?w=1200'
  return article.value?.imageUrl || article.value?.image || 'https://images.unsplash.com/photo-1504711434969-e33886168f5c?w=1200'
})
const showImage = computed(() => !!(article.value?.imageUrl || article.value?.image) && !imgErrored.value)
function onImgError() { imgErrored.value = true }
const authorInitial = computed(() => (article.value?.author || 'N')[0].toUpperCase())
const paragraphs = computed(() => (article.value?.body || '').split(/\n+/).filter(p => p.trim()))
function formatDate(d) { return d ? new Date(d).toLocaleDateString() : '' }

async function load(id) {
  loading.value = true
  article.value = null
  related.value = [] // Reset related
  
  try {
    // 1. Fetch Main Article
    const data = await newsAPI.getById(id)
    if (data) {
      article.value = data
      
      // 2. Fetch Related from DB based on Category
      try {
        const relatedData = await newsAPI.getByCategory(article.value.category, 0, 4)
        // Filter out the current article so it doesn't show in "More in..."
        related.value = (relatedData || []).filter(a => a.id !== Number(id)).slice(0, 4)
      } catch (err) {
        console.error("Could not fetch related articles", err)
      }
    }
  } catch (e) {
    console.error("Error loading article", e)
  }
  loading.value = false
}

onMounted(() => load(routeId.value))
watch(routeId, (id) => load(id))
</script>

<style scoped>
/* (Existing styles remain the same, just add these below) */

.source-widget {
  background: linear-gradient(135deg, #0f172a, #1e293b);
  border-radius: 14px;
  padding: 14px 16px;
  margin-top: 20px;
  box-shadow: 0 6px 18px rgba(0,0,0,0.25);
  border: 1px solid rgba(255,255,255,0.05);
}

.widget-header {
  margin-bottom: 8px;
}

.widget-title {
  font-size: 13px;
  letter-spacing: 1px;
  text-transform: uppercase;
  color: #94a3b8;
  font-weight: 600;
}

.source-content {
  display: flex;
  align-items: center;
}

.source-badge {
  background: linear-gradient(135deg, #2563eb, #3b82f6);
  color: #fff;
  font-size: 14px;
  font-weight: 600;
  padding: 6px 12px;
  border-radius: 999px;
  box-shadow: 0 4px 10px rgba(59,130,246,0.4);
  transition: all 0.3s ease;
  cursor: default;
}

.source-badge:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 14px rgba(59,130,246,0.6);
}

.source-widget {
  background: #1a1a1a;
  border-left: 3px solid #d32f2f;
  margin-bottom: 30px;
}
.source-content {
  padding: 10px 0;
}
.source-name {
  font-size: 1.1rem;
  font-weight: 600;
  color: #fff;
  display: block;
}

/* PAGE BACKGROUND */
.article-page {
  background-color: #0f0f0f;
  color: #ffffff;
  min-height: 100vh;
}

/* HERO SECTION */
.article-hero {
  position: relative;
  width: 100%;
  height: 65vh; /* Enforced height */
  min-height: 450px;
  overflow: hidden;
}

.article-hero-media {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
}

.article-hero-img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.article-hero-overlay {
  position: absolute;
  inset: 0;
  background: linear-gradient(to top, rgba(15,15,15,1) 0%, rgba(15,15,15,0.4) 50%, rgba(0,0,0,0.2) 100%);
  z-index: 1;
}

.article-hero-content {
  position: absolute;
  bottom: 40px;
  left: 50%;
  transform: translateX(-50%);
  width: 100%;
  max-width: 1100px;
  z-index: 2;
  padding: 0 20px;
}

/* TYPOGRAPHY */
.article-title {
  font-size: 3rem;
  margin: 15px 0;
  color: #fff;
  line-height: 1.2;
}

.article-excerpt {
  font-size: 1.1rem;
  color: rgba(255,255,255,0.7);
  margin-bottom: 25px;
  max-width: 700px;
}

/* BYLINE */
.article-byline {
  display: flex;
  align-items: center;
  gap: 15px;
}

.byline-avatar {
  width: 40px;
  height: 40px;
  background: #d32f2f;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 50%;
  font-weight: bold;
}

/* LAYOUT */
.article-layout {
  display: grid;
  grid-template-columns: 1fr 320px;
  gap: 50px;
  padding: 60px 20px;
  max-width: 1100px;
  margin: 0 auto;
}

/* BODY TEXT */
.article-para {
  font-size: 1.1rem;
  line-height: 1.8;
  color: rgba(255,255,255,0.85);
  margin-bottom: 20px;
}

/* SIDEBAR & RELATED */
.article-sidebar { position: sticky; top: 100px; }
.related-section { padding: 40px 20px; border-top: 1px solid #333; }
.related-title { margin-bottom: 30px; font-size: 1.5rem; }
.news-grid { display: grid; grid-template-columns: repeat(4, 1fr); gap: 20px; }

@media (max-width: 900px) {
  .article-layout { grid-template-columns: 1fr; }
  .news-grid { grid-template-columns: repeat(2, 1fr); }
  .article-title { font-size: 2rem; }
}
</style>