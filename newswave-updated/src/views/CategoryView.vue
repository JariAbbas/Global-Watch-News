<template>
  <div class="category-page">
    <div class="cat-hero" :style="{ '--cat-color': catMeta?.color || '#e63946' }">
      <div class="cat-hero-bg"></div>
      <div class="container cat-hero-content">
        <span class="tag" :class="slug">{{ catMeta?.label || slug }}</span>
        <h1 class="cat-hero-title">{{ catMeta?.label || slug }} News</h1>
        <p class="cat-hero-sub">Comprehensive coverage from around the world</p>
      </div>
    </div>
    <div class="container cat-body">
      <div class="cat-layout">
        <div class="cat-main">
          <div v-if="loading" class="news-grid news-grid-3">
            <div v-for="i in 6" :key="i" class="skeleton-card"></div>
          </div>
          <template v-else>
            <router-link v-if="articles[0]" :to="`/article/${articles[0].id}`" class="cat-featured-card card">
              <div class="cat-feat-img-wrap">
                <img :src="articles[0].imageUrl || articles[0].image" :alt="articles[0].title" class="cat-feat-img" loading="lazy" />
                <div class="cat-feat-overlay"></div>
                <span class="tag" :class="articles[0].category">{{ articles[0].category }}</span>
              </div>
              <div class="card-body">
                <h2 class="cat-feat-title">{{ articles[0].title }}</h2>
                <p class="card-excerpt">{{ articles[0].excerpt }}</p>
                <div class="card-meta">
                  <span>{{ articles[0].author }}</span><span>·</span>
                  <span>{{ articles[0].date || articles[0].publishedAt?.slice(0,10) }}</span>
                  <span class="meta-views">{{ (articles[0].views||0).toLocaleString() }}</span>
                </div>
              </div>
            </router-link>
            <div v-if="articles.length > 1" class="section-header" style="margin-top:40px;">
              <h2 class="section-title">More Stories</h2>
            </div>
            <div class="news-grid news-grid-3">
              <NewsCard v-for="article in articles.slice(1)" :key="article.id" :article="article" />
            </div>
            <div v-if="!articles.length" class="empty-state">
              <div class="empty-icon"></div>
              <h3>No stories yet</h3>
              <router-link to="/" class="btn btn-primary" style="margin-top:20px;">Back to Home</router-link>
            </div>
          </template>
        </div>
        <aside class="cat-sidebar">
          <TrendingSidebar />
          <div class="divider"></div>
          <div class="widget">
            <div class="widget-header"><span class="widget-title">Other Sections</span></div>
            <ul class="cat-other-list">
              <li v-for="cat in otherCategories" :key="cat.slug">
                <router-link :to="`/category/${cat.slug}`" class="cat-other-link">
                  <span class="cat-dot" :style="{ background: cat.color }"></span>{{ cat.label }}
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="14"><path d="M9 18l6-6-6-6"/></svg>
                </router-link>
              </li>
            </ul>
          </div>
        </aside>
      </div>
    </div>
  </div>
</template>
<script setup>
import { ref, computed, onMounted, watch } from 'vue'
import { useRoute } from 'vue-router'
import NewsCard from '../components/NewsCard.vue'
import TrendingSidebar from '../components/TrendingSidebar.vue'
import { newsAPI } from '../services/api.js'
import { getArticlesByCategory, categories } from '../store/newsData.js'

const route = useRoute()
const slug = computed(() => route.params.slug)
const catMeta = computed(() => categories.find(c => c.slug === slug.value))
const otherCategories = computed(() => categories.filter(c => c.slug !== slug.value))
const articles = ref([])
const loading = ref(true)

async function load() {
  loading.value = true
  try {
    const data = await newsAPI.getByCategory(slug.value, 0, 12)
    articles.value = data && data.length ? data : getArticlesByCategory(slug.value)
  } catch { articles.value = getArticlesByCategory(slug.value) }
  finally { loading.value = false }
}
onMounted(load)
watch(slug, load)
</script>
<style scoped>
.cat-hero { position:relative; padding:80px 0 60px; overflow:hidden; background:var(--bg-secondary); border-bottom:1px solid var(--border); }
.cat-hero-bg { position:absolute; inset:0; background:radial-gradient(ellipse at top left, color-mix(in srgb, var(--cat-color) 15%, transparent) 0%, transparent 70%); pointer-events:none; }
.cat-hero-content { position:relative; z-index:1; }
.cat-hero-title { font-family:var(--font-display); font-size:clamp(2.5rem,6vw,5rem); letter-spacing:0.04em; margin:16px 0 10px; background:linear-gradient(135deg, var(--text-primary) 60%, var(--cat-color)); -webkit-background-clip:text; -webkit-text-fill-color:transparent; background-clip:text; }
.cat-hero-sub { font-size:1rem; color:var(--text-secondary); }
.cat-body { padding:50px 0 80px; }
.cat-layout { display:grid; grid-template-columns:1fr 300px; gap:40px; align-items:start; }
.cat-sidebar { position:sticky; top:120px; }
.skeleton-card { height:280px; background:linear-gradient(90deg, var(--bg-card) 0%, var(--bg-card-hover) 50%, var(--bg-card) 100%); background-size:200% 100%; animation:shimmer 1.5s infinite; border-radius:var(--radius-lg); }
.cat-featured-card { display:block; }
.cat-feat-img-wrap { position:relative; overflow:hidden; border-radius:var(--radius-lg) var(--radius-lg) 0 0; }
.cat-feat-img { width:100%; height:380px; object-fit:cover; transition:transform 0.6s ease; }
.cat-featured-card:hover .cat-feat-img { transform:scale(1.03); }
.cat-feat-overlay { position:absolute; inset:0; background:linear-gradient(to top, rgba(0,0,0,0.4), transparent 50%); }
.cat-feat-title { font-family:var(--font-headline); font-size:1.6rem; font-weight:900; line-height:1.3; margin:12px 0 10px; }
.cat-feat-title:hover { color:var(--accent-red); }
.meta-views { margin-left:auto; font-size:10px; color:var(--text-muted); }
.empty-state { text-align:center; padding:80px 20px; }
.empty-icon { font-size:3rem; margin-bottom:16px; }
.empty-state h3 { font-family:var(--font-headline); font-size:1.4rem; margin-bottom:8px; }
.widget { background:var(--bg-card); border:1px solid var(--border); border-radius:var(--radius-lg); padding:20px; }
.widget-header { margin-bottom:14px; }
.widget-title { font-family:var(--font-mono); font-size:11px; text-transform:uppercase; letter-spacing:0.1em; color:var(--text-primary); }
.cat-other-list { display:flex; flex-direction:column; gap:2px; }
.cat-other-link { display:flex; align-items:center; gap:10px; padding:10px 8px; border-radius:var(--radius); font-size:0.88rem; color:var(--text-secondary); transition:all 0.2s; }
.cat-other-link:hover { background:rgba(255,255,255,0.04); color:var(--text-primary); }
.cat-other-link svg { margin-left:auto; opacity:0.4; }
.cat-dot { width:8px; height:8px; border-radius:50%; flex-shrink:0; }
@media (max-width:900px) { .cat-layout { grid-template-columns:1fr; } .cat-sidebar { position:static; } .cat-feat-img { height:240px; } }
</style>
