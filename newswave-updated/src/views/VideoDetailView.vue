<template>
  <div v-if="loading" class="loading-page">
    <div class="loading-spinner"></div>
    <p class="loading-text">Loading video...</p>
  </div>

  <div v-else-if="!video" class="not-found">
    <h2>Video not found</h2>
    <router-link to="/video" class="back-link">← Back to Videos</router-link>
  </div>

  <div v-else class="video-detail-page">

    <!-- Hero video player area -->
    <div class="vd-hero">
      <div class="container">
        <div class="vd-breadcrumb">
          <router-link to="/">Home</router-link>
          <span>›</span>
          <router-link to="/video">Videos</router-link>
          <span>›</span>
          <span>{{ video.title }}</span>
        </div>

        <!-- Player -->
        <div class="vd-player-wrap">
          <!-- If videoUrl is a direct mp4/webm -->
          <video
            v-if="isDirectVideo"
            class="vd-player"
            :src="video.videoUrl"
            :poster="video.thumbnailUrl"
            controls
            autoplay
            @play="trackView"
          ></video>

          <!-- If videoUrl is a YouTube/embed link -->
          <iframe
            v-else-if="embedUrl"
            class="vd-player"
            :src="embedUrl"
            frameborder="0"
            allowfullscreen
            allow="autoplay; encrypted-media"
          ></iframe>

          <!-- Fallback thumbnail with play indicator -->
          <div v-else class="vd-no-player">
            <img v-if="video.thumbnailUrl" :src="video.thumbnailUrl" :alt="video.title" />
            <div class="vd-no-msg">Video unavailable</div>
          </div>
        </div>
      </div>
    </div>

    <!-- Content below player -->
    <div class="container vd-content">
      <div class="vd-main">

        <!-- Title + meta -->
        <div class="vd-title-block">
          <span class="tag" :class="video.category">{{ video.category }}</span>
          <h1 class="vd-title">{{ video.title }}</h1>
          <div class="vd-meta-row">
            <span class="vd-views">{{ video.views }} views</span>
            <span class="vd-dot">·</span>
            <span class="vd-date">{{ formatDate(video.publishedAt) }}</span>
            <span v-if="video.duration" class="vd-dot">·</span>
            <span v-if="video.duration" class="vd-dur">{{ video.duration }}</span>
          </div>
        </div>

        <div class="vd-divider"></div>

        <!-- Author -->
        <div v-if="video.author" class="vd-author">
          <div class="vd-avatar">{{ video.author[0]?.toUpperCase() }}</div>
          <div>
            <div class="vd-author-name">{{ video.author }}</div>
            <div class="vd-author-role">{{ video.authorRole || 'Correspondent' }}</div>
          </div>
        </div>

        <!-- Description — wrapped text, full paragraphs -->
        <div class="vd-description">
          <p v-for="(para, i) in paragraphs" :key="i" class="vd-para">{{ para }}</p>
        </div>

        <!-- Source -->
        <div v-if="video.source" class="vd-source">
          <span>Source:</span>
          <a v-if="video.sourceUrl" :href="video.sourceUrl" target="_blank" rel="noopener">{{ video.source }}</a>
          <span v-else>{{ video.source }}</span>
        </div>

        <div class="vd-back-row">
          <router-link to="/video" class="back-link">← Back to Videos</router-link>
        </div>
      </div>

      <!-- Sidebar: related videos -->
      <div class="vd-sidebar">
        <div class="sidebar-heading">More Videos</div>
        <div v-if="related.length === 0" class="sidebar-empty">No related videos</div>
        <div
          v-for="rel in related" :key="rel.id"
          class="related-card"
          @click="$router.push(`/video/${rel.id}`)"
        >
          <div class="related-thumb">
            <img :src="rel.thumbnailUrl" :alt="rel.title" loading="lazy" />
            <span class="related-dur">{{ rel.duration }}</span>
          </div>
          <div class="related-info">
            <p class="related-title">{{ rel.title }}</p>
            <span class="related-meta">{{ rel.views }} views · {{ formatDate(rel.publishedAt) }}</span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, watch } from 'vue'
import { useRoute } from 'vue-router'
import { videoAPI } from '../services/api.js'

const route = useRoute()
const video = ref(null)
const allVideos = ref([])
const loading = ref(true)
let viewTracked = false

async function load(id) {
  loading.value = true
  viewTracked = false
  try {
    const [v, all] = await Promise.all([
      videoAPI.getById(id),
      videoAPI.getAll(0, 20)
    ])
    video.value = v
    allVideos.value = Array.isArray(all) ? all : (all.content || [])
  } catch (e) {
    console.error(e)
    video.value = null
  } finally {
    loading.value = false }
}

onMounted(() => load(route.params.id))
watch(() => route.params.id, id => load(id))

function trackView() {
  if (!viewTracked && video.value?.id) {
    viewTracked = true
    videoAPI.incrementViews(video.value.id).catch(() => {})
  }
}

const paragraphs = computed(() =>
  (video.value?.description || video.value?.body || '')
    .split(/\n+/)
    .map(p => p.trim())
    .filter(Boolean)
)

const related = computed(() =>
  allVideos.value
    .filter(v => v.id !== video.value?.id)
    .slice(0, 6)
)

const isDirectVideo = computed(() => {
  const url = video.value?.videoUrl || ''
  return /\.(mp4|webm|ogg)(\?|$)/i.test(url)
})

const embedUrl = computed(() => {
  const url = video.value?.videoUrl || ''
  // YouTube
  const yt = url.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/)([^&?/]+)/)
  if (yt) return `https://www.youtube.com/embed/${yt[1]}?autoplay=1`
  // Vimeo
  const vm = url.match(/vimeo\.com\/(\d+)/)
  if (vm) return `https://player.vimeo.com/video/${vm[1]}?autoplay=1`
  // Already an embed URL
  if (url.includes('embed')) return url
  return null
})

function formatDate(dt) {
  if (!dt) return ''
  return new Date(dt).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })
}
</script>

<style scoped>
/* Hero */
.vd-hero { background: #000; padding: 24px 0 0; }
.vd-breadcrumb { font-family: var(--font-mono); font-size: 11px; color: rgba(255,255,255,0.5); display: flex; gap: 6px; align-items: center; margin-bottom: 16px; flex-wrap: wrap; }
.vd-breadcrumb a { color: rgba(255,255,255,0.6); text-decoration: none; }
.vd-breadcrumb a:hover { color: #fff; }
.vd-breadcrumb span:last-child { color: rgba(255,255,255,0.85); overflow: hidden; text-overflow: ellipsis; white-space: nowrap; max-width: 320px; }

.vd-player-wrap { width: 100%; aspect-ratio: 16/9; background: #000; border-radius: var(--radius-lg) var(--radius-lg) 0 0; overflow: hidden; }
.vd-player { width: 100%; height: 100%; display: block; }
.vd-no-player { width: 100%; height: 100%; position: relative; display: flex; align-items: center; justify-content: center; }
.vd-no-player img { width: 100%; height: 100%; object-fit: cover; opacity: 0.5; }
.vd-no-msg { position: absolute; color: rgba(255,255,255,0.7); font-size: 1rem; }

/* Content layout */
.vd-content { display: grid; grid-template-columns: 1fr 340px; gap: 40px; padding: 36px 0 80px; align-items: start; }
.vd-main { min-width: 0; }

/* Title block */
.vd-title-block { display: flex; flex-direction: column; gap: 10px; margin-bottom: 20px; }
.vd-title { font-family: var(--font-headline); font-size: clamp(1.5rem, 3vw, 2.2rem); font-weight: 900; line-height: 1.3; margin: 0; }
.vd-meta-row { display: flex; align-items: center; gap: 8px; font-family: var(--font-mono); font-size: 12px; color: var(--text-muted); flex-wrap: wrap; }
.vd-dot { opacity: 0.4; }

.vd-divider { height: 1px; background: var(--border); margin: 20px 0; }

/* Author */
.vd-author { display: flex; align-items: center; gap: 14px; margin-bottom: 24px; }
.vd-avatar { width: 44px; height: 44px; border-radius: 50%; background: var(--accent-red); color: #fff; display: flex; align-items: center; justify-content: center; font-family: var(--font-mono); font-weight: 700; font-size: 1rem; flex-shrink: 0; }
.vd-author-name { font-weight: 600; font-size: 0.95rem; }
.vd-author-role { font-size: 0.8rem; color: var(--text-muted); margin-top: 2px; }

/* Description */
.vd-description { margin-bottom: 28px; }
.vd-para { font-family: var(--font-body); font-size: 1.05rem; line-height: 1.85; color: var(--text-primary); margin-bottom: 1.4em; text-wrap: pretty; }
.vd-para:last-child { margin-bottom: 0; }

/* Source */
.vd-source { font-size: 0.82rem; color: var(--text-muted); margin-bottom: 24px; }
.vd-source a { color: var(--accent-red); text-decoration: underline; }

.vd-back-row { margin-top: 32px; }
.back-link { font-family: var(--font-mono); font-size: 12px; text-transform: uppercase; letter-spacing: 0.08em; color: var(--text-secondary); text-decoration: none; }
.back-link:hover { color: var(--accent-red); }

/* Sidebar */
.vd-sidebar { position: sticky; top: 80px; }
.sidebar-heading { font-family: var(--font-mono); font-size: 11px; text-transform: uppercase; letter-spacing: 0.12em; color: var(--text-muted); margin-bottom: 16px; padding-bottom: 10px; border-bottom: 1px solid var(--border); }
.sidebar-empty { font-size: 0.85rem; color: var(--text-muted); }
.related-card { display: grid; grid-template-columns: 140px 1fr; gap: 12px; margin-bottom: 16px; cursor: pointer; border-radius: var(--radius); overflow: hidden; transition: transform 0.2s; }
.related-card:hover { transform: translateX(3px); }
.related-thumb { position: relative; aspect-ratio: 16/9; overflow: hidden; border-radius: var(--radius); }
.related-thumb img { width: 100%; height: 100%; object-fit: cover; }
.related-dur { position: absolute; bottom: 4px; right: 4px; background: rgba(0,0,0,0.8); font-family: var(--font-mono); font-size: 9px; color: #fff; padding: 1px 5px; border-radius: 2px; }
.related-info { display: flex; flex-direction: column; justify-content: center; gap: 4px; min-width: 0; }
.related-title { font-size: 0.82rem; font-weight: 600; line-height: 1.4; display: -webkit-box; -webkit-line-clamp: 3; -webkit-box-orient: vertical; overflow: hidden; margin: 0; }
.related-meta { font-size: 0.72rem; color: var(--text-muted); font-family: var(--font-mono); }

/* Loading / Not found */
.loading-page { display: flex; flex-direction: column; align-items: center; justify-content: center; min-height: 60vh; gap: 16px; }
.loading-spinner { width: 36px; height: 36px; border: 3px solid var(--border); border-top-color: var(--accent-red); border-radius: 50%; animation: spin 0.7s linear infinite; }
@keyframes spin { to { transform: rotate(360deg); } }
.loading-text { font-family: var(--font-mono); font-size: 12px; text-transform: uppercase; color: var(--text-muted); }
.not-found { text-align: center; padding: 80px 0; }

@media (max-width: 900px) { .vd-content { grid-template-columns: 1fr; } .vd-sidebar { position: static; } }
</style>