<template>
  <AdminLayout title="Tickers" subtitle="Manage breaking news ticker (max 10 active)">
    <template #actions>
      <button class="btn btn-primary" @click="openModal()">+ Add Ticker</button>
    </template>

    <div class="tickers-page">
      <!-- Active count bar -->
      <div class="active-bar">
        <div class="active-info">
          <span class="live-dot"></span>
          <strong>{{ activeCount }}</strong> / 10 active tickers
        </div>
        <div class="active-track">
          <div class="active-fill" :style="{ width: (activeCount / 10 * 100) + '%' }"></div>
        </div>
      </div>

      <!-- Loading -->
      <div v-if="loading" class="tickers-list">
        <div v-for="i in 5" :key="i" class="ticker-skeleton"></div>
      </div>

      <!-- List -->
      <div v-else class="tickers-list">
        <div v-if="!tickers.length" class="empty-state">
          <div class="empty-icon">⚡</div>
          <h3>No tickers yet</h3>
          <p>Add your first breaking news ticker</p>
          <button class="btn btn-primary" style="margin-top:16px;" @click="openModal()">Add Ticker</button>
        </div>

        <div
          v-for="ticker in sortedTickers"
          :key="ticker.id"
          class="ticker-row"
          :class="{ disabled: !ticker.isActive }"
        >
          <div class="ticker-priority">
            <span class="priority-badge" :class="getPriorityClass(ticker.priority)">
              P{{ ticker.priority }}
            </span>
          </div>

          <div class="ticker-content-wrap">
            <div class="ticker-type-badge" :class="ticker.type?.toLowerCase()">{{ ticker.type || 'UPDATE' }}</div>
            <div class="ticker-text">{{ ticker.content }}</div>
            <div class="ticker-meta">
              <span>{{ formatDate(ticker.createdAt) }}</span>
              <span v-if="ticker.createdBy">· by {{ ticker.createdBy }}</span>
              <span v-if="!ticker.isActive" class="disabled-badge">· Disabled {{ formatDate(ticker.disabledAt) }}</span>
            </div>
          </div>

          <div class="ticker-actions">
            <button class="icon-btn edit" @click="openModal(ticker)" title="Edit">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="15"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>
            </button>
            <button v-if="ticker.isActive" class="icon-btn disable" @click="toggleTicker(ticker)" title="Disable">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="15"><circle cx="12" cy="12" r="10"/><line x1="4.93" y1="4.93" x2="19.07" y2="19.07"/></svg>
            </button>
            <button v-else class="icon-btn enable" @click="toggleTicker(ticker)" title="Enable">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="15"><polyline points="20 6 9 17 4 12"/></svg>
            </button>
            <button class="icon-btn delete" @click="deleteTicker(ticker.id)" title="Delete">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="15"><polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6"/><path d="M10 11v6M14 11v6"/><path d="M9 6V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2"/></svg>
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Modal -->
    <Teleport to="body">
      <div v-if="showModal" class="modal-overlay" @click.self="closeModal">
        <div class="modal">
          <div class="modal-header">
            <h3 class="modal-title">{{ editing ? 'Edit Ticker' : 'Add New Ticker' }}</h3>
            <button class="modal-close" @click="closeModal">✕</button>
          </div>
          <div class="modal-body">
            <div class="form-group">
              <label class="form-label">Ticker Content *</label>
              <textarea v-model="form.content" class="form-input form-textarea" placeholder="Breaking news text..." rows="3"></textarea>
            </div>

            <div class="form-row">
              <div class="form-group">
                <label class="form-label">Type</label>
                <div class="radio-group">
                  <label v-for="t in tickerTypes" :key="t.value" class="radio-option" :class="{ selected: form.type === t.value }">
                    <input type="radio" v-model="form.type" :value="t.value" hidden />
                    <span class="radio-dot" :style="{ background: t.color }"></span>
                    {{ t.label }}
                  </label>
                </div>
              </div>

              <div class="form-group">
                <label class="form-label">Priority (0 = low, 10 = highest)</label>
                <div class="priority-control">
                  <button type="button" class="p-btn" @click="form.priority = Math.max(0, form.priority - 1)">−</button>
                  <div class="priority-radios">
                    <label v-for="n in [0,1,2,3,4,5,6,7,8,9,10]" :key="n" class="p-radio" :class="{ active: form.priority === n }">
                      <input type="radio" v-model="form.priority" :value="n" hidden />
                      {{ n }}
                    </label>
                  </div>
                  <button type="button" class="p-btn" @click="form.priority = Math.min(10, form.priority + 1)">+</button>
                </div>
              </div>
            </div>

            <div class="form-group">
              <label class="form-label">Created By</label>
              <input v-model="form.createdBy" type="text" class="form-input" placeholder="Editor name..." />
            </div>

            <div class="form-group">
              <label class="form-check">
                <input type="checkbox" v-model="form.isActive" />
                <span>Active (visible on website)</span>
              </label>
            </div>
          </div>
          <div class="modal-footer">
            <button class="btn btn-outline" @click="closeModal">Cancel</button>
            <button class="btn btn-primary" @click="saveTicker" :disabled="saving">
              {{ saving ? 'Saving...' : (editing ? 'Update Ticker' : 'Add Ticker') }}
            </button>
          </div>
        </div>
      </div>
    </Teleport>
  </AdminLayout>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import AdminLayout from './AdminLayout.vue'
import { tickerAPI } from '../../services/api.js'

const tickers = ref([])
const loading = ref(true)
const showModal = ref(false)
const saving = ref(false)
const editing = ref(null)

const defaultForm = () => ({ content: '', type: 'UPDATE', priority: 0, isActive: true, createdBy: '' })
const form = ref(defaultForm())

const activeCount = computed(() => tickers.value.filter(t => t.isActive).length)
const sortedTickers = computed(() => [...tickers.value].sort((a, b) => b.priority - a.priority))

const tickerTypes = [
  { value: 'BREAKING', label: 'Breaking', color: '#e63946' },
  { value: 'UPDATE',   label: 'Update',   color: '#4cc9f0' },
  { value: 'ALERT',    label: 'Alert',    color: '#f4a261' },
  { value: 'INFO',     label: 'Info',     color: '#10b981' },
]

function getPriorityClass(p) {
  if (p >= 8) return 'p-high'
  if (p >= 4) return 'p-mid'
  return 'p-low'
}

function formatDate(d) {
  if (!d) return ''
  return new Date(d).toLocaleDateString('en-US', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })
}

function openModal(ticker = null) {
  if (ticker) {
    editing.value = ticker
    form.value = { content: ticker.content, type: ticker.type || 'UPDATE', priority: ticker.priority || 0, isActive: ticker.isActive, createdBy: ticker.createdBy || '' }
  } else {
    editing.value = null
    form.value = defaultForm()
  }
  showModal.value = true
}

function closeModal() { showModal.value = false; editing.value = null }

async function loadTickers() {
  loading.value = true
  try { tickers.value = await tickerAPI.getAll() }
  catch { tickers.value = [] }
  finally { loading.value = false }
}

async function saveTicker() {
  if (!form.value.content.trim()) return
  saving.value = true
  try {
    if (editing.value) {
      await tickerAPI.update(editing.value.id, form.value)
    } else {
      await tickerAPI.create(form.value)
    }
    await loadTickers()
    closeModal()
  } catch (e) { alert('Error saving ticker. Is the API running?') }
  finally { saving.value = false }
}

async function toggleTicker(ticker) {
  try {
    if (ticker.isActive) await tickerAPI.disable(ticker.id)
    else await tickerAPI.enable(ticker.id)
    await loadTickers()
  } catch { alert('Error updating ticker') }
}

async function deleteTicker(id) {
  if (!confirm('Delete this ticker permanently?')) return
  try { await tickerAPI.remove(id); await loadTickers() }
  catch { alert('Error deleting ticker') }
}

onMounted(loadTickers)
</script>

<style scoped>
.tickers-page { display: flex; flex-direction: column; gap: 24px; }
.active-bar { background: var(--bg-card); border: 1px solid var(--border); border-radius: var(--radius-lg); padding: 16px 20px; display: flex; align-items: center; gap: 20px; }
.active-info { display: flex; align-items: center; gap: 8px; font-family: var(--font-mono); font-size: 12px; color: var(--text-secondary); white-space: nowrap; }
.live-dot { width: 8px; height: 8px; background: var(--accent-red); border-radius: 50%; animation: tagPulse 1.5s infinite; display: inline-block; }
.active-info strong { color: var(--text-primary); font-size: 1rem; }
.active-track { flex: 1; height: 6px; background: rgba(255,255,255,0.06); border-radius: 3px; overflow: hidden; }
.active-fill { height: 100%; background: var(--accent-red); border-radius: 3px; transition: width 0.4s ease; }

.tickers-list { display: flex; flex-direction: column; gap: 10px; }
.ticker-skeleton { height: 72px; background: linear-gradient(90deg, var(--bg-card) 0%, var(--bg-card-hover) 50%, var(--bg-card) 100%); background-size: 200% 100%; animation: shimmer 1.5s infinite; border-radius: var(--radius-lg); }

.ticker-row {
  display: flex;
  align-items: center;
  gap: 16px;
  background: var(--bg-card);
  border: 1px solid var(--border);
  border-radius: var(--radius-lg);
  padding: 14px 20px;
  transition: all 0.2s;
}
.ticker-row:hover { border-color: var(--border-bright); }
.ticker-row.disabled { opacity: 0.5; }

.priority-badge { font-family: var(--font-mono); font-size: 10px; font-weight: 700; padding: 3px 8px; border-radius: 3px; }
.p-high { background: rgba(230,57,70,0.2); color: var(--accent-red); }
.p-mid { background: rgba(244,162,97,0.2); color: var(--accent-amber); }
.p-low { background: rgba(255,255,255,0.06); color: var(--text-muted); }

.ticker-content-wrap { flex: 1; min-width: 0; display: flex; flex-direction: column; gap: 4px; }
.ticker-type-badge { display: inline-block; font-family: var(--font-mono); font-size: 9px; text-transform: uppercase; letter-spacing: 0.1em; padding: 2px 7px; border-radius: 2px; background: rgba(255,255,255,0.07); color: var(--text-muted); width: fit-content; }
.ticker-type-badge.breaking { background: rgba(230,57,70,0.15); color: var(--accent-red); }
.ticker-type-badge.alert { background: rgba(244,162,97,0.15); color: var(--accent-amber); }
.ticker-type-badge.info { background: rgba(16,185,129,0.15); color: #10b981; }
.ticker-type-badge.update { background: rgba(76,201,240,0.15); color: var(--accent-cyan); }
.ticker-text { font-size: 0.92rem; color: var(--text-primary); font-weight: 500; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
.ticker-meta { font-family: var(--font-mono); font-size: 10px; color: var(--text-muted); }
.disabled-badge { color: var(--accent-amber); }

.ticker-actions { display: flex; gap: 6px; flex-shrink: 0; }
.icon-btn { width: 32px; height: 32px; border: 1px solid var(--border); border-radius: var(--radius); background: transparent; color: var(--text-muted); display: flex; align-items: center; justify-content: center; cursor: pointer; transition: all 0.2s; }
.icon-btn.edit:hover { border-color: var(--accent-cyan); color: var(--accent-cyan); }
.icon-btn.disable:hover { border-color: var(--accent-amber); color: var(--accent-amber); }
.icon-btn.enable:hover { border-color: #10b981; color: #10b981; }
.icon-btn.delete:hover { border-color: var(--accent-red); color: var(--accent-red); }

/* EMPTY */
.empty-state { text-align: center; padding: 60px 20px; background: var(--bg-card); border: 1px solid var(--border); border-radius: var(--radius-lg); }
.empty-icon { font-size: 3rem; margin-bottom: 12px; }
.empty-state h3 { font-family: var(--font-headline); font-size: 1.2rem; margin-bottom: 6px; }
.empty-state p { color: var(--text-muted); font-size: 0.88rem; }

/* MODAL */
.modal-overlay { position: fixed; inset: 0; background: rgba(0,0,0,0.7); backdrop-filter: blur(4px); z-index: 1000; display: flex; align-items: center; justify-content: center; padding: 20px; }
.modal { background: var(--bg-card); border: 1px solid var(--border-bright); border-radius: 16px; width: 100%; max-width: 600px; max-height: 90vh; overflow-y: auto; animation: fadeUp 0.3s ease; }
.modal-header { display: flex; align-items: center; justify-content: space-between; padding: 20px 24px; border-bottom: 1px solid var(--border); }
.modal-title { font-family: var(--font-display); font-size: 1.3rem; letter-spacing: 0.04em; }
.modal-close { background: none; border: 1px solid var(--border); border-radius: 4px; color: var(--text-muted); width: 30px; height: 30px; cursor: pointer; display: flex; align-items: center; justify-content: center; transition: all 0.2s; }
.modal-close:hover { border-color: var(--accent-red); color: var(--accent-red); }
.modal-body { padding: 24px; display: flex; flex-direction: column; gap: 20px; }
.modal-footer { display: flex; justify-content: flex-end; gap: 10px; padding: 16px 24px; border-top: 1px solid var(--border); }

.form-group { display: flex; flex-direction: column; gap: 8px; }
.form-row { display: grid; grid-template-columns: 1fr 1fr; gap: 20px; }
.form-label { font-family: var(--font-mono); font-size: 11px; text-transform: uppercase; letter-spacing: 0.1em; color: var(--text-muted); }
.form-input { background: var(--bg-secondary); border: 1px solid var(--border); border-radius: var(--radius); padding: 10px 14px; font-family: var(--font-body); font-size: 0.9rem; color: var(--text-primary); outline: none; transition: border-color 0.2s; width: 100%; }
.form-input:focus { border-color: var(--accent-red); }
.form-textarea { resize: vertical; min-height: 80px; }

.radio-group { display: flex; flex-wrap: wrap; gap: 8px; }
.radio-option { display: flex; align-items: center; gap: 6px; padding: 6px 12px; border: 1px solid var(--border); border-radius: var(--radius); font-family: var(--font-mono); font-size: 11px; cursor: pointer; transition: all 0.2s; }
.radio-option.selected { border-color: var(--border-bright); background: rgba(255,255,255,0.05); }
.radio-dot { width: 8px; height: 8px; border-radius: 50%; flex-shrink: 0; }

.priority-control { display: flex; align-items: center; gap: 8px; }
.p-btn { width: 28px; height: 28px; background: var(--bg-secondary); border: 1px solid var(--border); border-radius: 4px; color: var(--text-primary); font-size: 1rem; cursor: pointer; display: flex; align-items: center; justify-content: center; transition: all 0.2s; flex-shrink: 0; }
.p-btn:hover { border-color: var(--accent-red); color: var(--accent-red); }
.priority-radios { display: flex; gap: 4px; flex-wrap: wrap; }
.p-radio { width: 28px; height: 28px; border: 1px solid var(--border); border-radius: 4px; font-family: var(--font-mono); font-size: 10px; cursor: pointer; display: flex; align-items: center; justify-content: center; transition: all 0.2s; }
.p-radio.active { background: var(--accent-red); border-color: var(--accent-red); color: #fff; }

.form-check { display: flex; align-items: center; gap: 10px; cursor: pointer; font-size: 0.9rem; color: var(--text-secondary); }
.form-check input[type="checkbox"] { width: 16px; height: 16px; accent-color: var(--accent-red); }

.btn { display: inline-flex; align-items: center; gap: 8px; padding: 9px 20px; font-family: var(--font-mono); font-size: 12px; font-weight: 500; text-transform: uppercase; letter-spacing: 0.08em; border-radius: var(--radius); cursor: pointer; transition: all 0.2s; border: 1px solid transparent; }
.btn-primary { background: var(--accent-red); color: #fff; border-color: var(--accent-red); }
.btn-primary:hover:not(:disabled) { background: #c62b38; }
.btn-primary:disabled { opacity: 0.6; cursor: not-allowed; }
.btn-outline { background: transparent; color: var(--text-secondary); border-color: var(--border-bright); }
.btn-outline:hover { color: var(--text-primary); border-color: var(--text-muted); }
</style>
