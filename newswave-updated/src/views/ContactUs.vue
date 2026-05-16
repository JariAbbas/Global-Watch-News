<template>
  <div class="static-page">
    <div class="static-hero">
      <div class="hero-bg-lines" aria-hidden="true"></div>
      <div class="container">
        <div class="hero-tag">Get In Touch</div>
        <h1 class="hero-title">Contact Us</h1>
        <p class="hero-sub">{{ content.tagline || 'We would love to hear from you.' }}</p>
      </div>
    </div>

    <div class="container static-body">
      <div v-if="loading" class="skel-wrap">
        <div class="skel-block" style="height:120px"></div>
        <div class="skel-block" style="height:80px"></div>
        <div class="skel-block" style="height:160px"></div>
      </div>

      <div v-else class="contact-layout">
        <!-- Content -->
        <div class="static-content" v-html="renderedContent"></div>

        <!-- Contact details from admin -->
        <div class="contact-cards" v-if="content.email || content.phone || content.address">
          <div class="contact-card" v-if="content.email">
            <div class="cc-icon">✉️</div>
            <div class="cc-label">Email</div>
            <a :href="`mailto:${content.email}`" class="cc-val">{{ content.email }}</a>
          </div>
          <div class="contact-card" v-if="content.phone">
            <div class="cc-icon">📞</div>
            <div class="cc-label">Phone</div>
            <span class="cc-val">{{ content.phone }}</span>
          </div>
          <div class="contact-card" v-if="content.address">
            <div class="cc-icon">📍</div>
            <div class="cc-label">Address</div>
            <span class="cc-val">{{ content.address }}</span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { supabase } from '../services/supabase.js'

const loading = ref(true)
const content = ref({ tagline: '', body: '', email: '', phone: '', address: '' })

const renderedContent = computed(() => {
  return (content.value.body || '').replace(/\n/g, '<br/>')
})

onMounted(async () => {
  try {
    const { data } = await supabase
      .from('static_pages')
      .select('*')
      .eq('slug', 'contact-us')
      .single()
    if (data) content.value = data
  } catch (e) {
    console.error('ContactUs load error:', e)
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
.hero-bg-lines {
  position: absolute; inset: 0;
  background-image: repeating-linear-gradient(90deg, rgba(255,255,255,0.02) 0px, rgba(255,255,255,0.02) 1px, transparent 1px, transparent 60px);
  pointer-events: none;
}
.container { max-width: 860px; margin: 0 auto; padding: 0 24px; }
.hero-tag { display: inline-block; font-family: var(--font-mono); font-size: 10px; text-transform: uppercase; letter-spacing: 0.16em; color: var(--accent-red); border: 1px solid rgba(230,57,70,0.3); padding: 4px 12px; border-radius: 2px; margin-bottom: 16px; }
.hero-title { font-family: var(--font-display); font-size: clamp(2.8rem, 6vw, 5rem); letter-spacing: 0.02em; color: var(--text-primary); margin: 0 0 12px; line-height: 1; }
.hero-sub { font-size: 1rem; color: var(--text-muted); }

.static-body { padding: 56px 24px 96px; }
.skel-wrap { display: flex; flex-direction: column; gap: 16px; }
.skel-block { border-radius: var(--radius); background: linear-gradient(90deg, var(--bg-card) 0%, var(--bg-card-hover) 50%, var(--bg-card) 100%); background-size: 200% 100%; animation: shimmer 1.5s infinite; }
@keyframes shimmer { 0% { background-position: 200% 0; } 100% { background-position: -200% 0; } }

.contact-layout { display: flex; flex-direction: column; gap: 40px; }
.static-content { font-family: var(--font-body); font-size: 1rem; line-height: 1.85; color: var(--text-secondary); max-width: 760px; }
.static-content :deep(h2) { font-family: var(--font-display); font-size: 1.6rem; color: var(--text-primary); margin: 2em 0 0.6em; }
.static-content :deep(h3) { font-family: var(--font-headline); font-size: 1.15rem; color: var(--text-primary); margin: 1.6em 0 0.4em; }
.static-content :deep(p) { margin-bottom: 1.2em; }
.static-content :deep(strong) { color: var(--text-primary); font-weight: 600; }

.contact-cards { display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 16px; }
.contact-card { background: var(--bg-card); border: 1px solid var(--border); border-radius: var(--radius-lg); padding: 24px; display: flex; flex-direction: column; gap: 6px; transition: border-color 0.2s; }
.contact-card:hover { border-color: rgba(230,57,70,0.3); }
.cc-icon { font-size: 1.4rem; }
.cc-label { font-family: var(--font-mono); font-size: 10px; text-transform: uppercase; letter-spacing: 0.1em; color: var(--text-muted); }
.cc-val { font-size: 0.9rem; color: var(--text-primary); word-break: break-all; }
a.cc-val { color: var(--accent-red); text-decoration: none; }
a.cc-val:hover { text-decoration: underline; }
</style>
