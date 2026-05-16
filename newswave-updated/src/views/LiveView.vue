<template>
  <div class="live-page">

    <div v-if="streamData?.isActive && streamData?.embedId" class="live-active">

      <div class="live-topbar">
        <div class="topbar-left">
          <span v-if="logoErr" class="topbar-logo-text">GlobalWatch News</span>
          </div>

        <div class="topbar-center">
          {{ streamData.title || 'GlobalWatch News — Live Coverage' }}
        </div>

        <div class="topbar-right">
          <div class="viewer-count" v-if="viewerCount > 0">
            <span class="pulse-dot green"></span>
            {{ viewerCount }} watching
          </div>
          <a :href="streamData.youtubeUrl || '#'" target="_blank" class="yt-btn" rel="noopener">
            <svg viewBox="0 0 24 24" fill="currentColor" width="14" height="14"><path d="M19.615 3.184c-3.604-.246-11.631-.245-15.23 0-3.897.266-4.356 2.62-4.385 8.816.029 6.185.484 8.549 4.385 8.816 3.6.245 11.626.246 15.23 0 3.897-.266 4.356-2.62 4.385-8.816-.029-6.185-.484-8.549-4.385-8.816zm-10.615 12.816v-8l8 3.993-8 4.007z"/></svg>
            YouTube
          </a>
        </div>
      </div>

      <div class="live-body">
        <div class="video-wrap">
          <iframe
            :src="`https://www.youtube.com/embed/${streamData.embedId}?autoplay=1&rel=0&modestbranding=1&showinfo=0`"
            frameborder="0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowfullscreen
            class="video-iframe"
          ></iframe>
          <div class="video-live-badge">
            <span class="pulse-dot"></span> LIVE
          </div>
        </div>

        <div class="chat-panel">
          <div class="chat-header">
            <span class="chat-title">
              <span class="pulse-dot small"></span>
              Live Chat
            </span>
          </div>

          <div class="chat-messages" ref="chatBox">
            <div
              v-for="msg in chatMessages"
              :key="msg.id"
              class="chat-msg"
              :class="{ 'chat-msg-own': msg.isOwn, 'chat-msg-system': msg.isSystem }"
            >
              <template v-if="msg.isSystem">
                <span class="msg-system-text">{{ msg.text }}</span>
              </template>
              <template v-else>
                <span class="msg-avatar" :style="{ background: msg.color }">{{ msg.initials }}</span>
                <div class="msg-body">
                  <span class="msg-name" :style="{ color: msg.color }">{{ msg.name }}</span>
                  <span class="msg-text">{{ msg.text }}</span>
                </div>
              </template>
            </div>
          </div>

          <div v-if="showNameForm" class="chat-name-form">
            <p class="chat-name-label">Enter your name to join chat</p>
            <div class="chat-name-row">
              <input
                v-model="chatName"
                type="text"
                class="chat-input"
                placeholder="Your name..."
                maxlength="30"
                @keyup.enter="joinChat"
              />
              <button class="chat-join-btn" @click="joinChat" :disabled="!chatName.trim()">
                Join
              </button>
            </div>
          </div>

          <div v-else class="chat-input-wrap">
            <span class="chat-user-badge" :style="{ background: myColor }">
              {{ initials(chatName) }}
            </span>
            <input
              v-model="chatInput"
              type="text"
              class="chat-input"
              placeholder="Say something..."
              maxlength="120"
              @keyup.enter="sendChat"
            />
            <button class="chat-send" @click="sendChat" :disabled="!chatInput.trim() || sending">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="15" height="15"><path d="M22 2L11 13M22 2L15 22l-4-9-9-4 20-7z"/></svg>
            </button>
          </div>
        </div>
      </div>

      <div class="live-description" v-if="streamData.description">
        <span class="desc-icon">📢</span>
        {{ streamData.description }}
      </div>
    </div>

    <div v-else class="live-offline">
      <div class="offline-bg" aria-hidden="true">
        <div class="bg-orb orb1"></div>
        <div class="bg-orb orb2"></div>
        <div class="bg-orb orb3"></div>
        <div class="scanlines"></div>
      </div>

      <div class="offline-content">
        <div class="offline-logo-wrap">
          <img src="@/assets/logo.png" alt="GlobalWatch News" class="offline-logo" @error="logoErr=true" v-if="!logoErr" />
          <span v-if="logoErr" class="offline-logo-fallback">GlobalWatch News</span>
        </div>

        <div class="signal-wrap" aria-hidden="true">
          <div class="signal-ring sr1"></div>
          <div class="signal-ring sr2"></div>
          <div class="signal-ring sr3"></div>
          <div class="signal-core">📡</div>
        </div>

        <div class="offline-badge">
          <span class="offline-dot"></span>
          OFF AIR
        </div>

        <h1 class="offline-title">No Live Broadcast Right Now</h1>
        <p class="offline-sub">
          We are currently off air. Our journalists are preparing the next live broadcast.
          Stay tuned or explore our latest video reports and breaking news below.
        </p>

        <div class="offline-ticker" aria-label="Latest news ticker">
          <span class="ticker-badge">LATEST</span>
          <div class="ticker-track">
            <span class="ticker-text">
              GlobalWatch News &nbsp;·&nbsp; Breaking news when it happens &nbsp;·&nbsp;
              Live coverage 24 hours a day &nbsp;·&nbsp; Stay informed with GlobalWatch &nbsp;·&nbsp;
              Trusted journalism, delivered live &nbsp;·&nbsp; GlobalWatch News &nbsp;·&nbsp;
              Breaking news when it happens &nbsp;·&nbsp; Live coverage 24 hours a day
            </span>
          </div>
        </div>

        <div class="offline-actions">
          <router-link to="/video" class="btn-watch">
            <svg viewBox="0 0 24 24" fill="currentColor" width="18" height="18"><path d="M8 5v14l11-7z"/></svg>
            Watch Video Reports
          </router-link>
          <router-link to="/" class="btn-news">
            Read Latest News
          </router-link>
        </div>

        <p class="offline-hint">Check back soon — we broadcast live daily</p>
      </div>
    </div>

    <section class="latest-section">
      <div class="container">
        <div class="section-header">
          <h2 class="section-title">Latest News</h2>
          <router-link to="/" class="view-all">View All →</router-link>
        </div>

        <div v-if="loadingNews" class="news-skeleton-row">
          <div v-for="i in 4" :key="i" class="news-skeleton"></div>
        </div>

        <div v-else class="news-cards-row">
          <router-link
            v-for="article in latestNews"
            :key="article.id"
            :to="`/article/${article.id}`"
            class="news-mini-card card"
          >
            <div class="mini-img-wrap">
              <img
                :src="article.imageUrl || article.image_url || article.image || DEFAULT_IMG"
                :alt="article.title"
                class="mini-img card-img"
                loading="lazy"
                @error="(e) => e.target.src = DEFAULT_IMG"
              />
              <span class="tag mini-tag" :class="article.category">{{ article.category }}</span>
            </div>
            <div class="card-body mini-body">
              <h3 class="mini-title">{{ article.title }}</h3>
              <div class="mini-meta card-meta">
                <span>{{ article.author || 'Staff' }}</span>
                <span class="meta-sep">·</span>
                <span>{{ formatDate(article.publishedAt || article.date) }}</span>
              </div>
            </div>
          </router-link>
        </div>
      </div>
    </section>

  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted, nextTick } from 'vue'
import { liveAPI, newsAPI } from '../services/api.js'
import { supabase } from '../services/supabase.js'

// ── CONSTANTS ────────────────────────────────────
const DEFAULT_IMG = '/placeholder.jpg'

// ── STATE ────────────────────────────────────────
const streamData  = ref(null)
const loadingNews = ref(true)
const latestNews  = ref([])
const logoErr     = ref(false)

// Chat
const chatBox      = ref(null)
const chatMessages = ref([])
const chatInput    = ref('')
const chatName     = ref('')
const showNameForm = ref(true)
const sending      = ref(false)
const myColor      = ref('')

// Viewer count (Supabase Presence)
const viewerCount = ref(0)

// Supabase realtime channels
let chatChannel     = null
let presenceChannel = null

// Unique session ID — har browser tab ka alag ID (viewer tracking ke liye)
const sessionId = crypto.randomUUID ? crypto.randomUUID() : Math.random().toString(36).slice(2)

// ── HELPERS ──────────────────────────────────────
function formatDate(dateStr) {
  if (!dateStr) return ''
  try {
    return new Date(dateStr).toLocaleDateString('en-PK', {
      day: 'numeric', month: 'short', year: 'numeric'
    })
  } catch { return dateStr }
}

function colorFromName(name = '') {
  const colors = [
    '#e63946','#f4a261','#2a9d8f','#457b9d',
    '#6a4c93','#e76f51','#2196f3','#4caf50',
  ]
  let hash = 0
  for (let i = 0; i < name.length; i++) hash += name.charCodeAt(i)
  return colors[hash % colors.length]
}

function initials(name = '') {
  return name.trim().split(' ').map(w => w[0]).join('').toUpperCase().slice(0, 2) || '?'
}

function scrollChat() {
  nextTick(() => {
    if (chatBox.value) chatBox.value.scrollTop = chatBox.value.scrollHeight
  })
}

// ── CHAT ─────────────────────────────────────────

// Purane messages load karo (last 50)
async function loadRecentMessages() {
  const { data, error } = await supabase
    .from('live_chat')
    .select('*')
    .order('created_at', { ascending: true })
    .limit(50)

  if (error) {
    console.error('loadRecentMessages error:', error)
    return
  }

  chatMessages.value = data.map(row => ({
    id:       row.id,
    name:     row.name,
    initials: initials(row.name),
    color:    row.color || colorFromName(row.name),
    text:     row.message,
    isOwn:    false,
  }))

  scrollChat()
}

// Realtime new messages subscribe karo
function subscribeChat() {
  chatChannel = supabase
    .channel('live_chat_realtime')
    .on(
      'postgres_changes',
      { event: 'INSERT', schema: 'public', table: 'live_chat' },
      (payload) => {
        const row = payload.new
        // Duplicate check — apna optimistic message already hai
        const alreadyExists = chatMessages.value.some(m => m.id === row.id)
        if (!alreadyExists) {
          chatMessages.value.push({
            id:       row.id,
            name:     row.name,
            initials: initials(row.name),
            color:    row.color || colorFromName(row.name),
            text:     row.message,
            isOwn:    false,
          })
          // Max 100 messages rakhein
          if (chatMessages.value.length > 100) chatMessages.value.splice(0, 20)
          scrollChat()
        }
      }
    )
    .subscribe()
}

// Join chat function
function joinChat() {
  const name = chatName.value.trim()
  if (!name) return
  myColor.value    = colorFromName(name)
  showNameForm.value = false
}

// Send chat function
async function sendChat() {
  const text = chatInput.value.trim()
  if (!text || sending.value) return

  sending.value = true

  // Optimistic UI — apna message turant dikhao
  const tempId = 'temp-' + Date.now()
  chatMessages.value.push({
    id:       tempId,
    name:     chatName.value,
    initials: initials(chatName.value),
    color:    myColor.value,
    text,
    isOwn:    true,
  })
  chatInput.value = ''
  scrollChat()

  // Supabase mein insert karo
  const { data, error } = await supabase
    .from('live_chat')
    .insert({
      name:    chatName.value,
      message: text,
      color:   myColor.value,
    })
    .select()
    .single()

  if (error) {
    console.error('sendChat error:', error)
    // Fail ho toh temp message hata do
    chatMessages.value = chatMessages.value.filter(m => m.id !== tempId)
  } else {
    // Temp ID ko real DB id se replace karo
    const idx = chatMessages.value.findIndex(m => m.id === tempId)
    if (idx !== -1) chatMessages.value[idx].id = data.id
  }

  sending.value = false
}

// ── VIEWER COUNT — Supabase Presence ─────────────
function subscribePresence() {
  presenceChannel = supabase.channel('live_viewers', {
    config: { presence: { key: sessionId } }
  })

  presenceChannel
    .on('presence', { event: 'sync' }, () => {
      const state = presenceChannel.presenceState()
      viewerCount.value = Object.keys(state).length
    })
    .on('presence', { event: 'join' }, () => {
      const state = presenceChannel.presenceState()
      viewerCount.value = Object.keys(state).length
    })
    .on('presence', { event: 'leave' }, () => {
      const state = presenceChannel.presenceState()
      viewerCount.value = Object.keys(state).length
    })
    .subscribe(async (status) => {
      if (status === 'SUBSCRIBED') {
        await presenceChannel.track({ joined_at: new Date().toISOString() })
      }
    })
}

// ── DATA FETCHING ────────────────────────────────
async function loadLiveStream() {
  try {
    const data = await liveAPI.get()
    console.log('Supabase Live Data:', data)
    if (data) {
      streamData.value = data
      if (data.isActive) {
        await loadRecentMessages()
        subscribeChat()
        subscribePresence()
      }
    }
  } catch (err) {
    console.error('Failed to load live stream:', err)
  }
}

async function loadNews() {
  try {
    const res = await newsAPI.getAll(0, 4)
    latestNews.value = Array.isArray(res) ? res : (res.content || res.data || [])
  } catch (err) {
    console.error('Failed to load news:', err)
  } finally {
    loadingNews.value = false
  }
}

// ── LIFECYCLE ────────────────────────────────────
onMounted(() => {
  loadLiveStream()
  loadNews()
})

onUnmounted(() => {
  if (chatChannel)     supabase.removeChannel(chatChannel)
  if (presenceChannel) supabase.removeChannel(presenceChannel)
})
</script>


<style scoped>
.live-page {
  min-height: 100vh;
  background: var(--bg-primary);
  display: flex;
  flex-direction: column;
}

/* ═══════════════════════════════════════════════
   LIVE ACTIVE
═══════════════════════════════════════════════ */
.live-active {
  flex: 1;
  display: flex;
  flex-direction: column;
  background: #000;
}

.live-topbar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  padding: 10px 20px;
  background: #0a0a0b;
  border-bottom: 1px solid rgba(255,255,255,0.06);
  flex-shrink: 0;
  flex-wrap: wrap;
}
.topbar-left  { display: flex; align-items: center; gap: 12px; }
.topbar-right { display: flex; align-items: center; gap: 12px; }

.topbar-logo { height: 30px; width: auto; object-fit: contain; }
.topbar-logo-text { font-family: var(--font-display); font-size: 1rem; letter-spacing: 0.06em; color: #fff; }

.live-pill {
  display: inline-flex; align-items: center; gap: 6px;
  background: var(--accent-red); color: #fff;
  padding: 3px 10px; border-radius: 2px;
  font-family: var(--font-mono); font-size: 10px;
  font-weight: 700; letter-spacing: 0.15em;
}

.topbar-center {
  flex: 1; text-align: center;
  font-family: var(--font-mono); font-size: 11px;
  color: rgba(255,255,255,0.45); text-transform: uppercase;
  letter-spacing: 0.06em; white-space: nowrap;
  overflow: hidden; text-overflow: ellipsis;
}

.viewer-count {
  display: flex; align-items: center; gap: 6px;
  font-family: var(--font-mono); font-size: 11px;
  color: rgba(255,255,255,0.5);
}

.yt-btn {
  display: inline-flex; align-items: center; gap: 6px;
  padding: 6px 14px; background: #ff0000; color: #fff;
  border-radius: 3px; font-family: var(--font-mono); font-size: 10px;
  text-transform: uppercase; letter-spacing: 0.06em;
  text-decoration: none; transition: background 0.2s; white-space: nowrap;
}
.yt-btn:hover { background: #cc0000; }

.live-body {
  display: grid;
  grid-template-columns: 1fr 340px; /* Custom right panel width */
  height: calc(100vh - 120px); /* Topbar aur description minus kar ke exact height map karega */
  max-height: 680px; /* Ek standard desktop viewport restriction */
  background: #000;
  overflow: hidden;
}

.video-wrap {
  position: relative; 
  background: #000;
  height: 100%;
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
}
.video-iframe { 
  width: 100%; 
  height: 100%; 
  display: block; 
  border: 0; 
}
.video-live-badge {
  position: absolute; top: 12px; left: 12px;
  display: inline-flex; align-items: center; gap: 6px;
  background: rgba(230,57,70,0.92); backdrop-filter: blur(4px);
  color: #fff; padding: 4px 10px; border-radius: 2px;
  font-family: var(--font-mono); font-size: 10px;
  font-weight: 700; letter-spacing: 0.14em; pointer-events: none;
  z-index: 2;
}

.chat-panel {
  display: flex; 
  flex-direction: column;
  background: #0d0d0f;
  border-left: 1px solid rgba(255,255,255,0.06);
  height: 100%; 
  min-height: 0; /* Constraints nested child growth */
  overflow: hidden;
}
.chat-header {
  display: flex; align-items: center; justify-content: space-between;
  padding: 14px 16px;
  border-bottom: 1px solid rgba(255,255,255,0.06); flex-shrink: 0;
}
.chat-title {
  display: flex; align-items: center; gap: 7px;
  font-family: var(--font-mono); font-size: 11px;
  text-transform: uppercase; letter-spacing: 0.1em;
  color: rgba(255,255,255,0.7); font-weight: 600;
}

.chat-messages {
  flex: 1; 
  overflow-y: auto; 
  overflow-x: hidden;
  padding: 12px 0; 
  scroll-behavior: smooth;
  display: flex;
  flex-direction: column;
}
.chat-messages::-webkit-scrollbar { width: 4px; }
.chat-messages::-webkit-scrollbar-thumb { background: rgba(255,255,255,0.15); border-radius: 2px; }

.chat-msg { display: flex; align-items: flex-start; gap: 8px; padding: 6px 14px; transition: background 0.15s; flex-shrink: 0; }
.chat-msg:hover { background: rgba(255,255,255,0.03); }
.chat-msg-own { background: rgba(230,57,70,0.05); }
.chat-msg-system { justify-content: center; padding: 6px 14px; }
.msg-system-text {
  font-family: var(--font-mono); font-size: 10px;
  color: rgba(255,255,255,0.25); text-transform: uppercase; letter-spacing: 0.08em;
}
.msg-avatar {
  width: 24px; height: 24px; border-radius: 50%;
  display: flex; align-items: center; justify-content: center;
  font-family: var(--font-mono); font-size: 9px; font-weight: 700;
  color: #fff; flex-shrink: 0; margin-top: 1px;
}
.msg-body { display: flex; flex-direction: column; gap: 1px; min-width: 0; flex: 1; }
.msg-name { font-family: var(--font-mono); font-size: 10px; font-weight: 600; }
.msg-text { font-size: 12px; color: rgba(255,255,255,0.7); line-height: 1.4; word-break: break-word; }

.chat-input-wrap {
  display: flex; gap: 8px; padding: 12px;
  border-top: 1px solid rgba(255,255,255,0.06); flex-shrink: 0;
  background: #0d0d0f;
}
.chat-input {
  flex: 1;
  background: rgba(255,255,255,0.06); border: 1px solid rgba(255,255,255,0.1);
  border-radius: 3px; padding: 8px 12px;
  font-family: var(--font-body); font-size: 12px; color: #fff;
  outline: none; transition: border-color 0.2s;
}
.chat-input:focus { border-color: rgba(230,57,70,0.5); }
.chat-input::placeholder { color: rgba(255,255,255,0.25); }
.chat-send {
  width: 34px; height: 34px; background: var(--accent-red);
  border: none; border-radius: 3px; color: #fff;
  display: flex; align-items: center; justify-content: center;
  cursor: pointer; transition: all 0.2s; flex-shrink: 0;
}
.chat-send:hover:not(:disabled) { background: #c62b38; }
.chat-send:disabled { opacity: 0.4; cursor: not-allowed; }

.live-description {
  display: flex; align-items: center; gap: 10px;
  padding: 10px 20px; background: #0a0a0b;
  border-top: 1px solid rgba(255,255,255,0.06);
  font-size: 0.82rem; color: rgba(255,255,255,0.4); font-family: var(--font-mono);
  flex-shrink: 0;
}
.desc-icon { flex-shrink: 0; }

/* PULSE DOTS */
.pulse-dot {
  width: 7px; height: 7px; background: #fff; border-radius: 50%;
  animation: dotPulse 1.2s ease-in-out infinite;
  flex-shrink: 0; display: inline-block;
}
.pulse-dot.small { width: 5px; height: 5px; }
.pulse-dot.green { background: #10b981; }
@keyframes dotPulse {
  0%, 100% { opacity: 1; transform: scale(1); }
  50% { opacity: 0.35; transform: scale(0.65); }
}

/* ═══════════════════════════════════════════════
   OFFLINE
═══════════════════════════════════════════════ */
.live-offline {
  flex: 1; min-height: 70vh;
  display: flex; align-items: center; justify-content: center;
  position: relative; overflow: hidden;
}
.offline-bg { position: absolute; inset: 0; pointer-events: none; }
.bg-orb { position: absolute; border-radius: 50%; animation: orbFloat 9s ease-in-out infinite; }
.orb1 { width: 560px; height: 560px; background: var(--accent-red); opacity: 0.04; top: -180px; left: -180px; }
.orb2 { width: 380px; height: 380px; background: var(--accent-cyan); opacity: 0.04; bottom: -100px; right: -80px; animation-delay: 3s; }
.orb3 { width: 280px; height: 280px; background: var(--accent-amber); opacity: 0.03; top: 40%; left: 50%; }
@keyframes orbFloat { 0%,100% { transform: scale(1) translateY(0); } 50% { transform: scale(1.08) translateY(-16px); } }
.orb3 { animation: orb3Float 9s ease-in-out infinite 6s; }
@keyframes orb3Float { 0%,100% { transform: translate(-50%,-50%) scale(1); } 50% { transform: translate(-50%,-50%) scale(1.12); } }
.scanlines {
  position: absolute; inset: 0;
  background: repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(255,255,255,0.01) 2px, rgba(255,255,255,0.01) 4px);
  pointer-events: none;
}
.offline-content {
  position: relative; z-index: 1;
  display: flex; flex-direction: column; align-items: center;
  text-align: center; padding: 48px 24px; max-width: 580px; width: 100%; gap: 0;
}
.offline-logo-wrap { margin-bottom: 28px; animation: fadeUp 0.7s ease forwards; }
.offline-logo { height: 46px; width: auto; object-fit: contain; }
.offline-logo-fallback { font-family: var(--font-display); font-size: 1.4rem; letter-spacing: 0.08em; color: var(--text-primary); }
.signal-wrap { position: relative; width: 90px; height: 90px; display: flex; align-items: center; justify-content: center; margin-bottom: 24px; animation: fadeUp 0.7s ease 0.1s both; }
.signal-ring { position: absolute; border-radius: 50%; border: 1.5px solid var(--accent-red); top: 50%; left: 50%; transform: translate(-50%,-50%); animation: ringExpand 2.4s ease-out infinite; }
.sr1 { width: 36px; height: 36px; animation-delay: 0s; }
.sr2 { width: 62px; height: 62px; animation-delay: 0.8s; }
.sr3 { width: 88px; height: 88px; animation-delay: 1.6s; }
@keyframes ringExpand { 0% { opacity: 0.7; transform: translate(-50%,-50%) scale(0.8); } 100% { opacity: 0; transform: translate(-50%,-50%) scale(1.3); } }
.signal-core { font-size: 1.8rem; position: relative; z-index: 1; animation: coreBob 2s ease-in-out infinite; }
@keyframes coreBob { 0%,100% { transform: translateY(0); } 50% { transform: translateY(-5px); } }
.offline-badge {
  display: inline-flex; align-items: center; gap: 8px;
  background: rgba(255,255,255,0.06); border: 1px solid rgba(255,255,255,0.1);
  color: var(--text-muted); padding: 4px 14px; border-radius: 2px;
  font-family: var(--font-mono); font-size: 10px; font-weight: 700; letter-spacing: 0.14em;
  margin-bottom: 20px; animation: fadeUp 0.7s ease 0.15s both;
}
.offline-dot { width: 6px; height: 6px; border-radius: 50%; background: var(--text-muted); flex-shrink: 0; }
.offline-title { font-family: var(--font-display); font-size: clamp(1.6rem, 4vw, 2.6rem); letter-spacing: 0.03em; color: var(--text-primary); margin-bottom: 14px; animation: fadeUp 0.7s ease 0.2s both; }
.offline-sub { font-size: 0.95rem; color: var(--text-secondary); line-height: 1.75; margin-bottom: 28px; animation: fadeUp 0.7s ease 0.25s both; }
.offline-ticker {
  display: flex; align-items: center; width: 100%; height: 34px;
  background: rgba(230,57,70,0.07); border: 1px solid rgba(230,57,70,0.18);
  border-radius: 2px; overflow: hidden; margin-bottom: 32px; animation: fadeUp 0.7s ease 0.3s both;
}
.ticker-badge { background: var(--accent-red); color: #fff; padding: 0 14px; height: 100%; display: flex; align-items: center; font-family: var(--font-mono); font-size: 9px; font-weight: 700; letter-spacing: 0.14em; white-space: nowrap; flex-shrink: 0; }
.ticker-track { flex: 1; overflow: hidden; mask: linear-gradient(to right, transparent, black 16px, black calc(100% - 16px), transparent); }
.ticker-text { display: inline-block; white-space: nowrap; font-family: var(--font-mono); font-size: 11px; color: rgba(255,255,255,0.4); animation: tickerMove 28s linear infinite; padding-left: 100%; }
@keyframes tickerMove { 0% { transform: translateX(0); } 100% { transform: translateX(-50%); } }
.offline-actions { display: flex; gap: 12px; flex-wrap: wrap; justify-content: center; margin-bottom: 20px; animation: fadeUp 0.7s ease 0.35s both; }
.btn-watch { display: inline-flex; align-items: center; gap: 8px; padding: 12px 26px; background: var(--accent-red); color: #fff; border-radius: 3px; border: 1px solid var(--accent-red); font-family: var(--font-mono); font-size: 12px; font-weight: 600; text-transform: uppercase; letter-spacing: 0.08em; text-decoration: none; transition: all 0.2s; }
.btn-watch:hover { background: #c62b38; transform: translateY(-2px); box-shadow: 0 8px 20px rgba(230,57,70,0.3); }
.btn-news { display: inline-flex; align-items: center; padding: 12px 26px; background: transparent; color: var(--text-secondary); border-radius: 3px; border: 1px solid var(--border-bright); font-family: var(--font-mono); font-size: 12px; font-weight: 500; text-transform: uppercase; letter-spacing: 0.08em; text-decoration: none; transition: all 0.2s; }
.btn-news:hover { color: var(--text-primary); border-color: var(--text-muted); transform: translateY(-2px); }
.offline-hint { font-family: var(--font-mono); font-size: 11px; color: var(--text-muted); letter-spacing: 0.06em; animation: fadeUp 0.7s ease 0.4s both; }
@keyframes fadeUp { from { opacity: 0; transform: translateY(16px); } to { opacity: 1; transform: translateY(0); } }

/* ═══════════════════════════════════════════════
   LATEST NEWS
═══════════════════════════════════════════════ */
.latest-section { padding: 48px 0 64px; border-top: 1px solid var(--border); background: var(--bg-primary); }
.news-cards-row { display: grid; grid-template-columns: repeat(4, 1fr); gap: 16px; }
.news-skeleton-row { display: grid; grid-template-columns: repeat(4, 1fr); gap: 16px; }
.news-skeleton { height: 220px; background: linear-gradient(90deg, var(--bg-card) 0%, var(--bg-card-hover) 50%, var(--bg-card) 100%); background-size: 200% 100%; animation: shimmer 1.5s infinite; border-radius: var(--radius-lg); }
@keyframes shimmer { 0% { background-position: 200% 0; } 100% { background-position: -200% 0; } }
.news-mini-card { display: block; }
.mini-img-wrap { position: relative; overflow: hidden; }
.mini-img { width: 100%; aspect-ratio: 16/9; object-fit: cover; }
.mini-tag { position: absolute; top: 8px; left: 8px; font-size: 9px; padding: 2px 7px; }
.mini-body { padding: 12px; }
.mini-title { font-family: var(--font-headline); font-size: 0.85rem; font-weight: 700; line-height: 1.35; color: var(--text-primary); display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical; overflow: hidden; margin-bottom: 6px; transition: color 0.2s; }
.news-mini-card:hover .mini-title { color: var(--accent-red); }
.mini-meta { font-size: 11px; }
.meta-sep { color: var(--text-muted); }

/* CHAT NAME FORM */
.chat-name-form { padding: 12px; border-top: 1px solid rgba(255,255,255,0.06); flex-shrink: 0; background: #0d0d0f; }
.chat-name-label { font-family: var(--font-mono); font-size: 10px; color: rgba(255,255,255,0.35); text-transform: uppercase; letter-spacing: 0.08em; margin-bottom: 8px; }
.chat-name-row { display: flex; gap: 8px; }
.chat-join-btn { padding: 0 16px; background: var(--accent-red); color: #fff; border: none; border-radius: 3px; font-family: var(--font-mono); font-size: 11px; font-weight: 600; text-transform: uppercase; letter-spacing: 0.06em; cursor: pointer; transition: background 0.2s; white-space: nowrap; flex-shrink: 0; }
.chat-join-btn:hover:not(:disabled) { background: #c62b38; }
.chat-join-btn:disabled { opacity: 0.4; cursor: not-allowed; }
.chat-user-badge { width: 28px; height: 28px; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-family: var(--font-mono); font-size: 9px; font-weight: 700; color: #fff; flex-shrink: 0; }

/* RESPONSIVE */
@media (max-width: 1100px) { 
  .live-body { grid-template-columns: 1fr 280px; } 
}
@media (max-width: 900px) {
  .live-body { grid-template-columns: 1fr; height: auto; max-height: none; overflow: visible; }
  .video-wrap { aspect-ratio: 16/9; height: auto; }
  .chat-panel { 
    height: 400px; 
    border-left: none; 
    border-top: 1px solid rgba(255,255,255,0.06); 
  }
  .news-cards-row, .news-skeleton-row { grid-template-columns: repeat(2, 1fr); }
}
@media (max-width: 540px) {
  .topbar-center { display: none; }
  .news-cards-row, .news-skeleton-row { grid-template-columns: 1fr; }
}
</style>