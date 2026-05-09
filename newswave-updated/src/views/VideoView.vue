<template>
  <div class="video-page">
    <div class="video-hero">
      <div class="container">
        <h1 class="video-hero-title">Video Reports</h1>
        <p class="video-hero-sub">Watch our latest news videos, documentaries, and live coverage</p>
        <div class="video-filters">
          <button
            v-for="f in filters" :key="f"
            class="filter-btn" :class="{ active: activeFilter === f }"
            @click="activeFilter = f"
          >{{ f }}</button>
        </div>
      </div>
    </div>

    <div class="container video-body">

      <!-- Loading -->
      <div v-if="loading" class="grid-skeleton">
        <div v-for="i in 8" :key="i" class="skel-card"></div>
      </div>

      <!-- Empty -->
      <div v-else-if="!filteredVideos.length" class="empty-state">
        <div class="empty-icon">🎬</div>
        <h3>No videos found</h3>
        <p>Check back soon or try a different category.</p>
      </div>

      <template v-else>
        <!-- Featured Video -->
        <div v-if="featuredVideo" class="featured-video card" @click="goTo(featuredVideo)">
          <div class="feat-vid-thumb">
            <img :src="featuredVideo.thumbnailUrl" :alt="featuredVideo.title" />
            <div class="feat-vid-overlay"></div>
            <button class="feat-play-btn" @click.stop="goTo(featuredVideo)">
              <svg viewBox="0 0 24 24" fill="currentColor" width="28"><path d="M8 5v14l11-7z"/></svg>
            </button>
            <span class="feat-duration">{{ featuredVideo.duration }}</span>
            <span v-if="featuredVideo.isFeatured" class="feat-badge">Featured</span>
          </div>
          <div class="feat-vid-info card-body">
            <span class="tag" :class="featuredVideo.category">{{ featuredVideo.category }}</span>
            <h2 class="feat-vid-title">{{ featuredVideo.title }}</h2>
            <p class="card-excerpt">{{ featuredVideo.excerpt }}</p>
            <div class="card-meta">
              <span>{{ featuredVideo.views }} views</span>
              <span>·</span>
              <span>{{ formatDate(featuredVideo.publishedAt) }}</span>
            </div>
            <button class="watch-btn" @click.stop="goTo(featuredVideo)">
              <svg viewBox="0 0 24 24" fill="currentColor" width="16"><path d="M8 5v14l11-7z"/></svg>
              Watch Now
            </button>
          </div>
        </div>

        <!-- Grid -->
        <div class="section-header" style="margin-top:48px;">
          <h2 class="section-title">{{ activeFilter === 'All' ? 'All Videos' : activeFilter }}</h2>
          <span class="tag">{{ filteredVideos.length }} videos</span>
        </div>
        <div class="video-grid">
          <div
            v-for="video in gridVideos" :key="video.id"
            class="video-card card"
            @click="goTo(video)"
          >
            <div class="vid-thumb-wrap">
              <img :src="video.thumbnailUrl" :alt="video.title" class="vid-thumb" loading="lazy" />
              <div class="vid-overlay"></div>
              <button class="vid-play">
                <svg viewBox="0 0 24 24" fill="currentColor" width="20"><path d="M8 5v14l11-7z"/></svg>
              </button>
              <span class="vid-duration">{{ video.duration }}</span>
            </div>
            <div class="vid-body card-body">
              <span class="tag" :class="video.category" style="font-size:9px;padding:2px 7px;">{{ video.category }}</span>
              <h3 class="vid-title card-title">{{ video.title }}</h3>
              <p class="vid-excerpt">{{ video.excerpt }}</p>
              <div class="card-meta">
                <span>{{ video.views }} views</span>
                <span>·</span>
                <span>{{ formatDate(video.publishedAt) }}</span>
              </div>
            </div>
          </div>
        </div>
      </template>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { videoAPI } from '../services/api.js'

const router = useRouter()
const activeFilter = ref('All')
const videos = ref([])
const loading = ref(true)

// 1. Dynamic Filters logic
const filters = computed(() => {
  // Pehle 'All' filter add karein
  const base = ['All']
  
  // Videos se unique categories nikaalein (sirf wahi jo empty na hon)
  const dynamicCategories = [...new Set(
    videos.value
      .map(v => v.category)
      .filter(c => c && c.trim() !== '')
  )]
  
  // All aur Dynamic categories ko combine kar dein
  return [...base, ...dynamicCategories]
})

onMounted(async () => {
  try {
    const data = await videoAPI.getAll(0, 50)
    videos.value = Array.isArray(data) ? data : (data.content || [])
  } catch (e) {
    console.error(e)
  } finally {
    loading.value = false 
  }
})

const featuredVideo = computed(() =>
  videos.value.find(v => v.isFeatured) || videos.value[0] || null
)

const filteredVideos = computed(() => {
  let list = videos.value
  if (activeFilter.value !== 'All')
    list = list.filter(v => v.category?.toLowerCase() === activeFilter.value.toLowerCase())
  return list
})

const gridVideos = computed(() =>
  filteredVideos.value.filter(v => v.id !== featuredVideo.value?.id)
)

function goTo(video) {
  router.push(`/video/${video.id}`)
}

function formatDate(dt) {
  if (!dt) return ''
  return new Date(dt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
}
</script>

<style scoped>
.video-hero { background: var(--bg-secondary); border-bottom: 1px solid var(--border); padding: 60px 0 0; }
.video-hero-title { font-family: var(--font-display); font-size: clamp(2.5rem, 5vw, 4.5rem); letter-spacing: 0.04em; margin-bottom: 10px; }
.video-hero-sub { font-size: 1rem; color: var(--text-secondary); margin-bottom: 28px; }
.video-filters { display: flex; gap: 6px; flex-wrap: wrap; }
.filter-btn { padding: 8px 18px; font-family: var(--font-mono); font-size: 11px; font-weight: 500; text-transform: uppercase; letter-spacing: 0.08em; border: 1px solid var(--border); border-radius: 2px; color: var(--text-secondary); background: transparent; cursor: pointer; transition: all 0.2s; margin-bottom: 1px; }
.filter-btn:hover { border-color: var(--border-bright); color: var(--text-primary); }
.filter-btn.active { background: var(--accent-red); border-color: var(--accent-red); color: #fff; }

.video-body { padding: 50px 0 80px; }

/* Featured */
.featured-video { display: grid; grid-template-columns: 1.6fr 1fr; cursor: pointer; transition: transform 0.2s; }
.featured-video:hover { transform: translateY(-2px); }
.feat-vid-thumb { position: relative; aspect-ratio: 16/9; overflow: hidden; background: #000; }
.feat-vid-thumb img { width: 100%; height: 100%; object-fit: cover; transition: transform 0.3s; }
.featured-video:hover .feat-vid-thumb img { transform: scale(1.03); }
.feat-vid-overlay { position: absolute; inset: 0; background: rgba(0,0,0,0.3); transition: background 0.2s; }
.featured-video:hover .feat-vid-overlay { background: rgba(0,0,0,0.15); }
.feat-play-btn { position: absolute; top: 50%; left: 50%; transform: translate(-50%,-50%); width: 64px; height: 64px; background: rgba(230,57,70,0.9); border-radius: 50%; border: none; color: #fff; display: flex; align-items: center; justify-content: center; cursor: pointer; transition: all 0.2s; padding-left: 4px; }
.feat-play-btn:hover { transform: translate(-50%,-50%) scale(1.1); }
.feat-duration { position: absolute; bottom: 12px; right: 12px; background: rgba(0,0,0,0.8); padding: 2px 8px; font-family: var(--font-mono); font-size: 11px; color: #fff; border-radius: 2px; }
.feat-badge { position: absolute; top: 12px; left: 12px; background: var(--accent-red); color: #fff; font-family: var(--font-mono); font-size: 10px; text-transform: uppercase; letter-spacing: 0.1em; padding: 3px 8px; border-radius: 2px; }
.feat-vid-info { display: flex; flex-direction: column; gap: 10px; }
.feat-vid-title { font-family: var(--font-headline); font-size: 1.3rem; font-weight: 900; line-height: 1.35; margin: 0; }
.watch-btn { display: inline-flex; align-items: center; gap: 8px; margin-top: 8px; padding: 10px 20px; background: var(--accent-red); color: #fff; border: none; border-radius: var(--radius); font-family: var(--font-mono); font-size: 11px; text-transform: uppercase; letter-spacing: 0.08em; cursor: pointer; width: fit-content; transition: background 0.2s; }
.watch-btn:hover { background: #c62b38; }

/* Grid */
.video-grid { display: grid; grid-template-columns: repeat(4, 1fr); gap: 20px; }
.video-card { cursor: pointer; transition: transform 0.2s; }
.video-card:hover { transform: translateY(-3px); }
.vid-thumb-wrap { position: relative; overflow: hidden; aspect-ratio: 16/9; }
.vid-thumb { width: 100%; height: 100%; object-fit: cover; transition: transform 0.3s; }
.video-card:hover .vid-thumb { transform: scale(1.05); }
.vid-overlay { position: absolute; inset: 0; background: rgba(0,0,0,0.35); transition: background 0.2s; }
.video-card:hover .vid-overlay { background: rgba(0,0,0,0.1); }
.vid-play { position: absolute; top: 50%; left: 50%; transform: translate(-50%,-50%); width: 44px; height: 44px; background: rgba(230,57,70,0.85); border-radius: 50%; border: none; color: #fff; display: flex; align-items: center; justify-content: center; cursor: pointer; padding-left: 3px; transition: all 0.2s; opacity: 0; }
.video-card:hover .vid-play { opacity: 1; }
.vid-duration { position: absolute; bottom: 8px; right: 8px; background: rgba(0,0,0,0.8); padding: 2px 7px; font-family: var(--font-mono); font-size: 10px; color: #fff; border-radius: 2px; }
.vid-body { padding: 12px; display: flex; flex-direction: column; gap: 6px; }
.vid-title { font-size: 0.88rem; }
.vid-excerpt { font-size: 0.78rem; color: var(--text-muted); line-height: 1.5; display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical; overflow: hidden; }

/* Skeleton */
.grid-skeleton { display: grid; grid-template-columns: repeat(4,1fr); gap: 20px; margin-top: 40px; }
.skel-card { aspect-ratio: 16/9; background: var(--bg-secondary); border-radius: var(--radius); animation: pulse 1.4s ease-in-out infinite; }
@keyframes pulse { 0%,100%{opacity:1} 50%{opacity:.4} }

/* Empty */
.empty-state { text-align: center; padding: 80px 0; color: var(--text-muted); }
.empty-icon { font-size: 3rem; margin-bottom: 16px; }

@media (max-width: 1100px) { .video-grid { grid-template-columns: repeat(2,1fr); } .grid-skeleton { grid-template-columns: repeat(2,1fr); } }
@media (max-width: 800px) { .featured-video { grid-template-columns: 1fr; } }
@media (max-width: 540px) { .video-grid { grid-template-columns: 1fr; } .grid-skeleton { grid-template-columns: 1fr; } }
</style>