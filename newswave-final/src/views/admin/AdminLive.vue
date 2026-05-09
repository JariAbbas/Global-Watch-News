<template>
  <AdminLayout title="Live TV" subtitle="Manage live stream link shown on website">

    <div class="live-admin">

      <!-- Current Status Card -->
      <div class="status-card" :class="form.isActive ? 'online' : 'offline'">
        <div class="status-indicator">
          <span class="status-dot"></span>
          {{ form.isActive ? 'LIVE STREAM IS ACTIVE' : 'NO LIVE STREAM' }}
        </div>
        <div class="status-url" v-if="form.youtubeUrl">{{ form.youtubeUrl }}</div>
      </div>

      <!-- Form Card -->
      <div class="form-card">
        <div class="form-card-title">Live Stream Settings</div>

        <div class="form-group">
          <label class="form-label">YouTube Live / Video URL *</label>
          <input
            v-model="form.youtubeUrl"
            type="url"
            class="form-input"
            placeholder="https://www.youtube.com/watch?v=XXXXXXXXX  or  https://youtu.be/XXXXXXXXX"
            @input="parseEmbed"
          />
          <div class="input-hint">
            Paste any YouTube URL — live stream, premiere, or regular video.
            It will automatically convert to embed format.
          </div>
        </div>

        <div class="form-group">
          <label class="form-label">Stream Title (shown on website)</label>
          <input
            v-model="form.title"
            type="text"
            class="form-input"
            placeholder="e.g. GlobalWatch News — LIVE Coverage"
          />
        </div>

        <div class="form-group">
          <label class="form-label">Description (optional)</label>
          <textarea
            v-model="form.description"
            class="form-input"
            rows="2"
            placeholder="e.g. Live coverage of Pakistan elections 2026"
          ></textarea>
        </div>

        <div class="toggle-row">
          <div>
            <div class="toggle-label">Stream Active</div>
            <div class="toggle-sub">When OFF — "No Live Stream" shown on website</div>
          </div>
          <div class="toggle-switch" :class="{ on: form.isActive }" @click="form.isActive = !form.isActive">
            <div class="toggle-knob"></div>
          </div>
        </div>

        <!-- Preview -->
        <div v-if="embedId" class="preview-section">
          <div class="preview-title">Preview</div>
          <div class="preview-frame">
            <iframe
              :src="`https://www.youtube.com/embed/${embedId}?autoplay=0&rel=0`"
              frameborder="0"
              allowfullscreen
              style="width:100%;height:100%;border:0;"
            ></iframe>
          </div>
        </div>

        <div v-if="saveMsg" class="save-msg" :class="saveMsg.type">{{ saveMsg.text }}</div>

        <button class="btn-save" @click="save" :disabled="saving">
          {{ saving ? 'Saving...' : '💾 Save Live Settings' }}
        </button>
      </div>

      <!-- Info Box -->
      <div class="info-box">
        <div class="info-title">📺 How it works</div>
        <ol class="info-list">
          <li>Go to YouTube → your Live Stream or any video</li>
          <li>Copy the URL from the browser address bar</li>
          <li>Paste it above — preview will appear automatically</li>
          <li>Toggle "Stream Active" to ON</li>
          <li>Click Save — website Live TV page will show it instantly</li>
        </ol>
        <div class="info-examples">
          <div class="info-ex-title">Supported URL formats:</div>
          <code>https://www.youtube.com/watch?v=dQw4w9WgXcQ</code>
          <code>https://youtu.be/dQw4w9WgXcQ</code>
          <code>https://www.youtube.com/live/dQw4w9WgXcQ</code>
        </div>
      </div>

    </div>
  </AdminLayout>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import AdminLayout from './AdminLayout.vue'
import { liveAPI } from '../../services/api.js'

const saving  = ref(false)
const saveMsg = ref(null)
const embedId = ref('')

const form = ref({
  youtubeUrl:  '',
  title:       'GlobalWatch News — LIVE',
  description: '',
  isActive:    false,
})

// Extract YouTube video ID from any URL format
function extractYouTubeId(url) {
  if (!url) return ''
  const patterns = [
    /(?:youtube\.com\/watch\?v=)([a-zA-Z0-9_-]{11})/,
    /(?:youtu\.be\/)([a-zA-Z0-9_-]{11})/,
    /(?:youtube\.com\/live\/)([a-zA-Z0-9_-]{11})/,
    /(?:youtube\.com\/embed\/)([a-zA-Z0-9_-]{11})/,
  ]
  for (const p of patterns) {
    const m = url.match(p)
    if (m) return m[1]
  }
  return ''
}

function parseEmbed() {
  embedId.value = extractYouTubeId(form.value.youtubeUrl)
}

async function load() {
  try {
    const data = await liveAPI.get()
    if (data) {
      form.value = { ...form.value, ...data }
      parseEmbed()
    }
  } catch {
    // API not available yet — use defaults
  }
}

async function save() {
  if (!form.value.youtubeUrl && form.value.isActive) {
    saveMsg.value = { type: 'error', text: '❌ Please enter a YouTube URL before activating.' }
    return
  }
  saving.value = true
  saveMsg.value = null
  try {
    await liveAPI.save({ ...form.value, embedId: embedId.value })
    saveMsg.value = { type: 'success', text: '✅ Live settings saved! Website updated.' }
  } catch {
    // Save to localStorage as fallback when API not ready
    localStorage.setItem('nw_live', JSON.stringify({ ...form.value, embedId: embedId.value }))
    saveMsg.value = { type: 'success', text: '✅ Saved locally! (Connect Quarkus API to persist in DB)' }
  } finally {
    saving.value = false
  }
}

onMounted(load)
</script>

<style scoped>
.live-admin { display: flex; flex-direction: column; gap: 24px; max-width: 800px; }

/* STATUS */
.status-card {
  padding: 18px 24px;
  border-radius: var(--radius-lg);
  border: 1px solid var(--border);
  display: flex;
  flex-direction: column;
  gap: 6px;
}
.status-card.online { background: rgba(16,185,129,0.08); border-color: rgba(16,185,129,0.3); }
.status-card.offline { background: rgba(255,255,255,0.03); border-color: var(--border); }
.status-indicator {
  display: flex;
  align-items: center;
  gap: 10px;
  font-family: var(--font-mono);
  font-size: 12px;
  font-weight: 700;
  letter-spacing: 0.1em;
  text-transform: uppercase;
}
.status-card.online .status-indicator { color: #10b981; }
.status-card.offline .status-indicator { color: var(--text-muted); }
.status-dot {
  width: 10px; height: 10px;
  border-radius: 50%;
  flex-shrink: 0;
}
.status-card.online .status-dot { background: #10b981; animation: tagPulse 1.5s infinite; }
.status-card.offline .status-dot { background: var(--text-muted); }
.status-url { font-family: var(--font-mono); font-size: 11px; color: var(--text-muted); word-break: break-all; }

/* FORM */
.form-card {
  background: var(--bg-card);
  border: 1px solid var(--border);
  border-radius: var(--radius-lg);
  padding: 24px;
  display: flex;
  flex-direction: column;
  gap: 20px;
}
.form-card-title {
  font-family: var(--font-mono);
  font-size: 11px;
  text-transform: uppercase;
  letter-spacing: 0.12em;
  color: var(--text-muted);
  padding-bottom: 14px;
  border-bottom: 1px solid var(--border);
}
.form-group { display: flex; flex-direction: column; gap: 8px; }
.form-label { font-family: var(--font-mono); font-size: 10px; text-transform: uppercase; letter-spacing: 0.1em; color: var(--text-muted); }
.form-input {
  background: var(--bg-secondary);
  border: 1px solid var(--border);
  border-radius: var(--radius);
  padding: 11px 14px;
  font-family: var(--font-body);
  font-size: 0.9rem;
  color: var(--text-primary);
  outline: none;
  transition: border-color 0.2s;
  width: 100%;
  resize: vertical;
}
.form-input:focus { border-color: var(--accent-red); box-shadow: 0 0 0 2px var(--accent-red-glow); }
.form-input::placeholder { color: var(--text-muted); }
.input-hint { font-size: 0.78rem; color: var(--text-muted); line-height: 1.5; }

/* TOGGLE */
.toggle-row { display: flex; align-items: center; justify-content: space-between; padding: 14px 0; border-top: 1px solid var(--border); border-bottom: 1px solid var(--border); }
.toggle-label { font-size: 0.95rem; font-weight: 600; margin-bottom: 3px; }
.toggle-sub { font-size: 0.78rem; color: var(--text-muted); }
.toggle-switch { width: 48px; height: 26px; background: rgba(255,255,255,0.08); border-radius: 13px; position: relative; cursor: pointer; transition: background 0.2s; flex-shrink: 0; }
.toggle-switch.on { background: #10b981; }
.toggle-knob { position: absolute; top: 3px; left: 3px; width: 20px; height: 20px; background: #fff; border-radius: 50%; transition: transform 0.2s; }
.toggle-switch.on .toggle-knob { transform: translateX(22px); }

/* PREVIEW */
.preview-section { display: flex; flex-direction: column; gap: 10px; }
.preview-title { font-family: var(--font-mono); font-size: 10px; text-transform: uppercase; letter-spacing: 0.1em; color: var(--text-muted); }
.preview-frame { width: 100%; aspect-ratio: 16/9; background: #000; border-radius: var(--radius-lg); overflow: hidden; border: 1px solid var(--border); }

/* SAVE */
.save-msg { padding: 10px 14px; border-radius: var(--radius); font-size: 0.88rem; }
.save-msg.success { background: rgba(16,185,129,0.1); border: 1px solid rgba(16,185,129,0.3); color: #10b981; }
.save-msg.error { background: rgba(230,57,70,0.1); border: 1px solid rgba(230,57,70,0.3); color: var(--accent-red); }
.btn-save {
  background: var(--accent-red);
  color: #fff;
  border: none;
  border-radius: var(--radius);
  padding: 13px 24px;
  font-family: var(--font-mono);
  font-size: 12px;
  font-weight: 500;
  text-transform: uppercase;
  letter-spacing: 0.1em;
  cursor: pointer;
  transition: all 0.2s;
}
.btn-save:hover:not(:disabled) { background: #c62b38; transform: translateY(-1px); }
.btn-save:disabled { opacity: 0.6; cursor: not-allowed; }

/* INFO */
.info-box {
  background: rgba(76,201,240,0.05);
  border: 1px solid rgba(76,201,240,0.15);
  border-radius: var(--radius-lg);
  padding: 20px 24px;
}
.info-title { font-weight: 600; font-size: 0.95rem; margin-bottom: 14px; color: var(--accent-cyan); }
.info-list { padding-left: 20px; display: flex; flex-direction: column; gap: 8px; font-size: 0.88rem; color: var(--text-secondary); line-height: 1.6; margin-bottom: 16px; }
.info-examples { display: flex; flex-direction: column; gap: 6px; }
.info-ex-title { font-family: var(--font-mono); font-size: 10px; text-transform: uppercase; color: var(--text-muted); margin-bottom: 6px; letter-spacing: 0.08em; }
.info-examples code { background: rgba(255,255,255,0.05); padding: 6px 12px; border-radius: var(--radius); font-family: var(--font-mono); font-size: 12px; color: var(--accent-cyan); border: 1px solid rgba(76,201,240,0.1); }
</style>
