<template>
  <div class="static-page">
    <div class="static-hero">
      <div class="hero-bg-lines" aria-hidden="true"></div>
      <div class="container">
        <div class="hero-tag">Legal</div>
        <h1 class="hero-title">Disclaimer</h1>
        <p class="hero-sub">{{ content.tagline || 'Important information about our content and liability.' }}</p>
        <div v-if="content.updated_at" class="hero-date">
          Last updated: {{ formatDate(content.updated_at) }}
        </div>
      </div>
    </div>

    <div class="container static-body">
      <div v-if="loading" class="skel-wrap">
        <div class="skel-block" style="height:100px"></div>
        <div class="skel-block" style="height:180px"></div>
        <div class="skel-block" style="height:140px"></div>
      </div>
      <div v-else class="static-content" v-html="renderedContent"></div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { supabase } from '../services/supabase.js'

const loading = ref(true)
const content = ref({ tagline: '', body: '', updated_at: null })

const renderedContent = computed(() => {
  return (content.value.body || '').replace(/\n/g, '<br/>')
})

function formatDate(d) {
  if (!d) return ''
  return new Date(d).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })
}

onMounted(async () => {
  try {
    const { data } = await supabase
      .from('static_pages')
      .select('*')
      .eq('slug', 'disclaimer')
      .single()
    if (data) content.value = data
  } catch (e) {
    console.error('Disclaimer load error:', e)
  } finally {
    loading.value = false
  }
})
</script>

<style scoped>
.static-page { min-height: 100vh; background: var(--bg-primary); }
.static-hero {
  position: relative; padding: 80px 0 52px;
  background: linear-gradient(135deg, var(--bg-secondary) 0%, var(--bg-primary) 100%);
  border-bottom: 1px solid var(--border); overflow: hidden;
}
.hero-bg-lines { position: absolute; inset: 0; background-image: repeating-linear-gradient(90deg, rgba(255,255,255,0.02) 0px, rgba(255,255,255,0.02) 1px, transparent 1px, transparent 60px); pointer-events: none; }
.container { max-width: 860px; margin: 0 auto; padding: 0 24px; }
.hero-tag { display: inline-block; font-family: var(--font-mono); font-size: 10px; text-transform: uppercase; letter-spacing: 0.16em; color: var(--accent-red); border: 1px solid rgba(230,57,70,0.3); padding: 4px 12px; border-radius: 2px; margin-bottom: 16px; }
.hero-title { font-family: var(--font-display); font-size: clamp(2.8rem, 6vw, 5rem); letter-spacing: 0.02em; color: var(--text-primary); margin: 0 0 12px; line-height: 1; }
.hero-sub { font-size: 1rem; color: var(--text-muted); margin-bottom: 10px; }
.hero-date { font-family: var(--font-mono); font-size: 10px; color: var(--text-muted); letter-spacing: 0.06em; }

.static-body { padding: 56px 24px 96px; }
.skel-wrap { display: flex; flex-direction: column; gap: 16px; }
.skel-block { border-radius: var(--radius); background: linear-gradient(90deg, var(--bg-card) 0%, var(--bg-card-hover) 50%, var(--bg-card) 100%); background-size: 200% 100%; animation: shimmer 1.5s infinite; }
@keyframes shimmer { 0% { background-position: 200% 0; } 100% { background-position: -200% 0; } }

.static-content { font-family: var(--font-body); font-size: 1rem; line-height: 1.85; color: var(--text-secondary); max-width: 760px; }
.static-content :deep(h2) { font-family: var(--font-display); font-size: 1.6rem; color: var(--text-primary); margin: 2em 0 0.6em; padding-bottom: 8px; border-bottom: 1px solid var(--border); }
.static-content :deep(h3) { font-family: var(--font-headline); font-size: 1.15rem; color: var(--text-primary); margin: 1.6em 0 0.4em; }
.static-content :deep(p) { margin-bottom: 1.2em; }
.static-content :deep(strong) { color: var(--text-primary); font-weight: 600; }
.static-content :deep(ul), .static-content :deep(ol) { padding-left: 1.4em; margin-bottom: 1.2em; display: flex; flex-direction: column; gap: 6px; }
.static-content :deep(a) { color: var(--accent-red); text-decoration: none; }
.static-content :deep(a:hover) { text-decoration: underline; }
</style>
