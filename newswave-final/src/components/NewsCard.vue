<template>
  <router-link :to="`/article/${article.id}`" class="card news-card" :class="size">
    <div class="card-img-wrap">
      <img
        :src="cardImage"
        :alt="article.title"
        class="card-img"
        loading="lazy"
        @error="imgErr = true"
      />
      <div class="card-img-overlay"></div>
      <span class="tag" :class="article.category">{{ article.category }}</span>
      <span v-if="isTrending" class="card-trending">🔥 Trending</span>
    </div>
    <div class="card-body">
      <h3 class="card-title" :class="{ large: size === 'large' }">{{ article.title }}</h3>
      <p v-if="size !== 'small'" class="card-excerpt">{{ article.excerpt }}</p>
      <div class="card-meta">
        <span>{{ article.author || 'Staff' }}</span>
        <span class="meta-sep">·</span>
        <span>{{ formatDate(article.publishedAt || article.published_at || article.date) }}</span>
        <span class="meta-sep" v-if="readTime">·</span>
        <span v-if="readTime">{{ readTime }} min</span>
        <span class="meta-views">{{ Number(article.views || 0).toLocaleString() }}</span>
      </div>
    </div>
  </router-link>
</template>

<script setup>
import { ref, computed } from 'vue'

const props = defineProps({
  article: { type: Object, required: true },
  size: { type: String, default: 'normal' }
})

const imgErr = ref(false)
const DEFAULT_IMG = 'https://images.unsplash.com/photo-1504711434969-e33886168f5c?w=800&q=80'

const cardImage = computed(() => {
  if (imgErr.value) return DEFAULT_IMG
  return props.article.imageUrl
    || props.article.image_url
    || props.article.image
    || DEFAULT_IMG
})

const isTrending = computed(() =>
  props.article.isTrending || props.article.is_trending || props.article.trending
)

const readTime = computed(() =>
  props.article.readTimeMin || props.article.read_time_min || props.article.readTime || ''
)

function formatDate(d) {
  if (!d) return ''
  try {
    return new Date(d).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
  } catch { return d }
}
</script>

<style scoped>
.news-card { display: block; }
.card-img-wrap { position: relative; overflow: hidden; }
.card-img-overlay { position: absolute; inset: 0; background: linear-gradient(to top, rgba(0,0,0,0.7) 0%, transparent 60%); pointer-events: none; }
.tag { position: absolute; top: 12px; left: 12px; z-index: 1; }
.card-trending { position: absolute; top: 12px; right: 12px; background: rgba(0,0,0,0.7); backdrop-filter: blur(4px); padding: 3px 8px; font-family: var(--font-mono); font-size: 10px; color: var(--accent-amber); border-radius: 2px; }
.card-title.large { font-size: 1.4rem; }
.meta-sep { color: var(--text-muted); }
.meta-views { margin-left: auto; font-size: 10px; color: var(--text-muted); }
</style>
