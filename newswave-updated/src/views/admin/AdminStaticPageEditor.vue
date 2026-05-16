<template>
  <AdminLayout :title="pageTitle" :subtitle="`Edit content shown on /${slug} page`">

    <div class="page-editor">

      <!-- Status banner -->
      <div v-if="saveMsg" class="save-banner" :class="saveMsg.type">
        {{ saveMsg.text }}
      </div>

      <!-- Editor card -->
      <div class="editor-card">
        <div class="editor-card-title">Page Settings</div>

        <!-- Tagline -->
        <div class="form-group">
          <label class="form-label">Tagline / Subtitle <span class="label-hint">(shown under page title)</span></label>
          <input v-model="form.tagline" type="text" class="form-input" :placeholder="`e.g. ${defaultTagline}`" />
        </div>

        <!-- Contact-specific fields -->
        <template v-if="slug === 'contact-us'">
          <div class="form-row">
            <div class="form-group">
              <label class="form-label">Email Address</label>
              <input v-model="form.email" type="email" class="form-input" placeholder="info@globalwatch.com" />
            </div>
            <div class="form-group">
              <label class="form-label">Phone Number</label>
              <input v-model="form.phone" type="text" class="form-input" placeholder="+92 300 0000000" />
            </div>
          </div>
          <div class="form-group">
            <label class="form-label">Office Address</label>
            <input v-model="form.address" type="text" class="form-input" placeholder="123 Street, Karachi, Pakistan" />
          </div>
        </template>

        <!-- Main content body -->
        <div class="form-group">
          <label class="form-label">
            Page Content
            <span class="label-hint">— supports HTML tags like &lt;h2&gt;, &lt;p&gt;, &lt;ul&gt;, &lt;strong&gt;</span>
          </label>
          <textarea
            v-model="form.body"
            class="form-input body-textarea"
            rows="20"
            :placeholder="bodyPlaceholder"
          ></textarea>
          <div class="textarea-hint">
            Tip: Use &lt;h2&gt;Section Title&lt;/h2&gt; for headings, &lt;p&gt; for paragraphs, &lt;ul&gt;&lt;li&gt; for lists.
          </div>
        </div>

        <button class="btn-save" @click="save" :disabled="saving">
          {{ saving ? 'Saving...' : '💾 Save Page' }}
        </button>
      </div>

      <!-- Live Preview -->
      <div class="preview-card">
        <div class="preview-card-title">
          <span>Live Preview</span>
          <span class="preview-url">{{ previewUrl }}</span>
        </div>
        <div class="preview-body">
          <div class="preview-hero">
            <div class="preview-tag">{{ heroTag }}</div>
            <div class="preview-title">{{ pageTitle }}</div>
            <div class="preview-sub">{{ form.tagline || defaultTagline }}</div>
          </div>
          <div class="preview-content" v-html="form.body || '<p style=\'color:rgba(255,255,255,0.3)\'>Content will appear here...</p>'"></div>
        </div>
      </div>

    </div>
  </AdminLayout>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import AdminLayout from './AdminLayout.vue'
import { supabase } from '../../services/supabase.js'

const props = defineProps({
  slug:         { type: String, required: true },
  pageTitle:    { type: String, required: true },
  heroTag:      { type: String, default: 'Page' },
  defaultTagline: { type: String, default: '' },
})

const saving  = ref(false)
const saveMsg = ref(null)

const form = ref({
  tagline:     '',
  body:        '',
  email:       '',
  phone:       '',
  address:     '',
})

const previewUrl = computed(() => `yoursite.com/${props.slug}`)

const bodyPlaceholder = computed(() => {
  return `<h2>Section Title</h2>\n<p>Your content goes here...</p>\n<ul>\n  <li>Point one</li>\n  <li>Point two</li>\n</ul>`
})

// ── LOAD ─────────────────────────────────────────
async function load() {
  try {
    const { data, error } = await supabase
      .from('static_pages')
      .select('*')
      .eq('slug', props.slug)
      .single()

    if (data && !error) {
      form.value = {
        tagline: data.tagline || '',
        body:    data.body    || '',
        email:   data.email   || '',
        phone:   data.phone   || '',
        address: data.address || '',
      }
    }
  } catch (e) {
    console.error('Load error:', e)
  }
}

// ── SAVE ─────────────────────────────────────────
async function save() {
  saving.value = true
  saveMsg.value = null

  const payload = {
    slug:       props.slug,
    tagline:    form.value.tagline,
    body:       form.value.body,
    email:      form.value.email   || null,
    phone:      form.value.phone   || null,
    address:    form.value.address || null,
    updated_at: new Date().toISOString(),
  }

  try {
    const { error } = await supabase
      .from('static_pages')
      .upsert(payload, { onConflict: 'slug' })

    if (error) throw error
    saveMsg.value = { type: 'success', text: `✅ "${props.pageTitle}" page saved successfully!` }
  } catch (err) {
    console.error('Save error:', err)
    saveMsg.value = { type: 'error', text: '❌ Error: ' + err.message }
  } finally {
    saving.value = false
    // Auto-hide message after 4s
    setTimeout(() => { saveMsg.value = null }, 4000)
  }
}

onMounted(load)
</script>

<style scoped>
.page-editor {
  display: flex;
  flex-direction: column;
  gap: 24px;
  max-width: 900px;
}

/* Save banner */
.save-banner {
  padding: 12px 16px;
  border-radius: var(--radius);
  font-family: var(--font-mono);
  font-size: 12px;
  animation: slideDown 0.3s ease;
}
.save-banner.success { background: rgba(16,185,129,0.1); border: 1px solid rgba(16,185,129,0.3); color: #10b981; }
.save-banner.error   { background: rgba(230,57,70,0.1);  border: 1px solid rgba(230,57,70,0.3);  color: var(--accent-red); }
@keyframes slideDown { from { opacity:0; transform: translateY(-8px); } to { opacity:1; transform: translateY(0); } }

/* Editor card */
.editor-card {
  background: var(--bg-card);
  border: 1px solid var(--border);
  border-radius: var(--radius-lg);
  padding: 24px;
  display: flex;
  flex-direction: column;
  gap: 20px;
}
.editor-card-title {
  font-family: var(--font-mono);
  font-size: 11px;
  text-transform: uppercase;
  letter-spacing: 0.12em;
  color: var(--text-muted);
  padding-bottom: 14px;
  border-bottom: 1px solid var(--border);
}

.form-row { display: grid; grid-template-columns: 1fr 1fr; gap: 16px; }
.form-group { display: flex; flex-direction: column; gap: 8px; }
.form-label {
  font-family: var(--font-mono);
  font-size: 10px;
  text-transform: uppercase;
  letter-spacing: 0.1em;
  color: var(--text-muted);
}
.label-hint { font-size: 9px; color: var(--text-muted); opacity: 0.7; text-transform: none; letter-spacing: 0; }
.form-input {
  background: var(--bg-secondary);
  border: 1px solid var(--border);
  border-radius: var(--radius);
  padding: 10px 14px;
  font-family: var(--font-body);
  font-size: 0.88rem;
  color: var(--text-primary);
  outline: none;
  transition: border-color 0.2s;
  width: 100%;
}
.form-input:focus { border-color: var(--accent-red); box-shadow: 0 0 0 2px rgba(230,57,70,0.1); }
.form-input::placeholder { color: var(--text-muted); opacity: 0.6; }
.body-textarea { resize: vertical; min-height: 280px; font-family: var(--font-mono); font-size: 12px; line-height: 1.7; }
.textarea-hint { font-family: var(--font-mono); font-size: 10px; color: var(--text-muted); }

.btn-save {
  background: var(--accent-red); color: #fff;
  border: none; border-radius: var(--radius);
  padding: 13px 28px;
  font-family: var(--font-mono); font-size: 12px;
  font-weight: 500; text-transform: uppercase; letter-spacing: 0.1em;
  cursor: pointer; transition: all 0.2s; align-self: flex-start;
}
.btn-save:hover:not(:disabled) { background: #c62b38; transform: translateY(-1px); }
.btn-save:disabled { opacity: 0.6; cursor: not-allowed; }

/* Preview card */
.preview-card {
  background: var(--bg-card);
  border: 1px solid var(--border);
  border-radius: var(--radius-lg);
  overflow: hidden;
}
.preview-card-title {
  display: flex; align-items: center; justify-content: space-between;
  padding: 14px 20px;
  background: var(--bg-secondary);
  border-bottom: 1px solid var(--border);
  font-family: var(--font-mono); font-size: 11px;
  text-transform: uppercase; letter-spacing: 0.1em; color: var(--text-muted);
}
.preview-url { font-size: 10px; color: var(--accent-red); }

.preview-body { padding: 0; }
.preview-hero {
  padding: 28px 28px 20px;
  background: linear-gradient(135deg, var(--bg-secondary) 0%, var(--bg-primary) 100%);
  border-bottom: 1px solid var(--border);
}
.preview-tag {
  display: inline-block;
  font-family: var(--font-mono); font-size: 9px;
  text-transform: uppercase; letter-spacing: 0.14em;
  color: var(--accent-red);
  border: 1px solid rgba(230,57,70,0.3);
  padding: 3px 10px; border-radius: 2px; margin-bottom: 10px;
}
.preview-title { font-family: var(--font-display); font-size: 1.8rem; color: var(--text-primary); margin-bottom: 6px; }
.preview-sub { font-size: 0.82rem; color: var(--text-muted); }

.preview-content {
  padding: 20px 28px 28px;
  font-family: var(--font-body);
  font-size: 0.85rem;
  line-height: 1.8;
  color: var(--text-secondary);
  max-height: 320px;
  overflow-y: auto;
}
.preview-content::-webkit-scrollbar { width: 3px; }
.preview-content::-webkit-scrollbar-thumb { background: var(--border); border-radius: 2px; }
.preview-content :deep(h2) { font-family: var(--font-display); font-size: 1.2rem; color: var(--text-primary); margin: 1.2em 0 0.4em; border-bottom: 1px solid var(--border); padding-bottom: 6px; }
.preview-content :deep(h3) { font-size: 1rem; color: var(--text-primary); margin: 1em 0 0.3em; }
.preview-content :deep(p) { margin-bottom: 0.8em; }
.preview-content :deep(strong) { color: var(--text-primary); }
.preview-content :deep(ul), .preview-content :deep(ol) { padding-left: 1.2em; margin-bottom: 0.8em; }
.preview-content :deep(li) { margin-bottom: 4px; }
.preview-content :deep(br) { display: none; }

@media (max-width: 640px) {
  .form-row { grid-template-columns: 1fr; }
}
</style>
