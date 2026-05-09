<template>
  <AdminLayout :title="isEdit ? 'Edit Article' : 'Add Article'" :subtitle="isEdit ? `Editing: ${form.title || '...'}` : 'Create a new news story'">
    <template #actions>
      <router-link to="/admin/news" class="btn btn-outline">← Back to News</router-link>
      <button class="btn btn-primary" @click="saveArticle(true)" :disabled="saving">
        {{ saving ? 'Saving...' : (isEdit ? 'Update Article' : 'Publish Article') }}
      </button>
    </template>

    <div class="news-form">
      <div class="form-main">
        <!-- Title -->
        <div class="form-card">
          <div class="form-card-title">Article Content</div>
          <div class="form-group">
            <label class="form-label">Title *</label>
            <input v-model="form.title" type="text" class="form-input form-input-lg" placeholder="Enter article headline..." />
          </div>
          <div class="form-group">
            <label class="form-label">Excerpt / Summary *</label>
            <textarea v-model="form.excerpt" class="form-input" rows="3" placeholder="Short summary shown in article cards..."></textarea>
          </div>
          <div class="form-group">
            <label class="form-label">Full Body / Article Text *</label>
            <textarea v-model="form.body" class="form-input form-textarea-lg" rows="14" placeholder="Write the full article here. Use blank lines to separate paragraphs..."></textarea>
          </div>
        </div>

        <!-- Image -->
        <div class="form-card">
          <div class="form-card-title">Featured Image</div>

          <!-- Tab Switch -->
          <div class="img-tab-row">
            <button class="img-tab" :class="{ active: imgMode === 'upload' }" @click="imgMode = 'upload'" type="button">
              📁 Upload Image
            </button>
            <button class="img-tab" :class="{ active: imgMode === 'url' }" @click="imgMode = 'url'" type="button">
              🔗 Image URL
            </button>
          </div>

          <!-- Upload Mode -->
          <div v-if="imgMode === 'upload'" class="form-group">
            <label class="form-label">Upload from Device</label>

            <div
              class="drop-zone"
              :class="{ dragging: isDragging, uploading: uploading, 'has-image': !!form.imageUrl }"
              @click="triggerFileInput"
              @dragover.prevent="isDragging = true"
              @dragleave.prevent="isDragging = false"
              @drop.prevent="onDrop"
            >
              <input ref="fileInput" type="file" accept="image/*" style="display:none" @change="onFileChange" />

              <div v-if="form.imageUrl && !uploading" class="drop-preview">
                <img :src="form.imageUrl" alt="Uploaded preview" />
                <div class="drop-overlay"><span>Click or drop to replace</span></div>
              </div>

              <div v-else-if="uploading" class="drop-placeholder">
                <div class="upload-spinner"></div>
                <div class="drop-text">Uploading to Supabase...</div>
                <div class="drop-sub">{{ uploadProgress }}</div>
              </div>

              <div v-else class="drop-placeholder">
                <div class="drop-icon">🖼️</div>
                <div class="drop-text">Click to browse or drag &amp; drop</div>
                <div class="drop-sub">JPG, PNG, WebP, GIF — max 5MB</div>
              </div>
            </div>

            <div v-if="uploadError" class="upload-error">⚠️ {{ uploadError }}</div>

            <div v-if="form.imageUrl && imgMode === 'upload'" class="uploaded-url-row">
              <span class="uploaded-url-label">Stored URL:</span>
              <a :href="form.imageUrl" target="_blank" class="uploaded-url-link">{{ form.imageUrl }}</a>
            </div>
          </div>

          <!-- URL Mode -->
          <div v-if="imgMode === 'url'" class="form-group">
            <label class="form-label">Image URL</label>
            <input v-model="form.imageUrl" type="url" class="form-input" placeholder="https://example.com/image.jpg" @input="imgError = false" />
            <div v-if="form.imageUrl" class="img-preview" style="margin-top:12px;">
              <img :src="form.imageUrl" alt="Preview" @error="imgError = true" :class="{ error: imgError }" />
              <div v-if="imgError" class="img-error">⚠️ Image URL could not be loaded</div>
            </div>
          </div>

          <div class="form-group" style="margin-top:12px;">
            <label class="form-label">Image Caption (optional)</label>
            <input v-model="form.imageCaption" type="text" class="form-input" placeholder="Photo credit or caption..." />
          </div>
        </div>

        <!-- Source -->
        <div class="form-card">
          <div class="form-card-title">Source Information</div>
          <div class="form-row-2">
            <div class="form-group">
              <label class="form-label">Source Name</label>
              <input v-model="form.source" type="text" class="form-input" placeholder="e.g. Reuters, AP, BBC..." />
            </div>
            <div class="form-group">
              <label class="form-label">Source URL</label>
              <input v-model="form.sourceUrl" type="url" class="form-input" placeholder="https://..." />
            </div>
          </div>
        </div>
      </div>

      <!-- SIDEBAR -->
      <div class="form-sidebar">
        <div class="form-card">
          <div class="form-card-title">Publish Settings</div>
          <div class="toggle-group">
            <label class="toggle-row">
              <div class="toggle-info">
                <div class="toggle-label">Active</div>
                <div class="toggle-sub">Visible on website</div>
              </div>
              <div class="toggle-switch" :class="{ on: form.isActive }" @click="form.isActive = !form.isActive">
                <div class="toggle-knob"></div>
              </div>
            </label>
            <label class="toggle-row">
              <div class="toggle-info">
                <div class="toggle-label">🔥 Trending</div>
                <div class="toggle-sub">Show in trending section</div>
              </div>
              <div class="toggle-switch" :class="{ on: form.isTrending }" @click="form.isTrending = !form.isTrending">
                <div class="toggle-knob"></div>
              </div>
            </label>
            <label class="toggle-row">
              <div class="toggle-info">
                <div class="toggle-label">⭐ Featured</div>
                <div class="toggle-sub">Show in hero slider</div>
              </div>
              <div class="toggle-switch" :class="{ on: form.isFeatured }" @click="form.isFeatured = !form.isFeatured">
                <div class="toggle-knob"></div>
              </div>
            </label>
          </div>
        </div>

        <div class="form-card">
          <div class="form-card-title">Category *</div>
          <div class="cat-radio-grid">
            <label v-for="cat in categories" :key="cat.slug" class="cat-radio" :class="{ selected: form.category === cat.slug }" :style="{ '--cat-c': cat.color }">
              <input type="radio" v-model="form.category" :value="cat.slug" hidden />
              {{ cat.label }}
            </label>
          </div>
        </div>

        <div class="form-card">
          <div class="form-card-title">Author</div>
          <div class="form-group">
            <label class="form-label">Author Name</label>
            <input v-model="form.author" type="text" class="form-input" placeholder="Full name..." />
          </div>
          <div class="form-group" style="margin-top:12px;">
            <label class="form-label">Author Role / Title</label>
            <input v-model="form.authorRole" type="text" class="form-input" placeholder="e.g. Senior Correspondent..." />
          </div>
        </div>

        <div class="form-card">
          <div class="form-card-title">Metadata</div>
          <div class="form-group">
            <label class="form-label">Read Time (minutes)</label>
            <input v-model.number="form.readTimeMin" type="number" min="1" max="60" class="form-input" />
          </div>
        </div>

        <div class="save-btns">
          <button class="btn btn-primary btn-full" @click="saveArticle(true)" :disabled="saving || uploading">
            {{ saving ? 'Saving...' : (isEdit ? 'Update Article' : 'Publish Article') }}
          </button>
          <router-link to="/admin/news" class="btn btn-outline btn-full" style="justify-content:center;">
            Cancel
          </router-link>
        </div>

        <div v-if="saveMsg" class="save-msg" :class="saveMsg.type">{{ saveMsg.text }}</div>
      </div>
    </div>
  </AdminLayout>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import AdminLayout from './AdminLayout.vue'
import { newsAPI } from '../../services/api.js'
import { categories } from '../../store/newsData.js'
import { supabase } from '../../services/supabase.js'

const route = useRoute()
const router = useRouter()
const isEdit = computed(() => !!route.params.id)
const saving = ref(false)
const imgError = ref(false)
const saveMsg = ref(null)

// Image state
const imgMode = ref('upload')       // 'upload' | 'url'
const fileInput = ref(null)
const uploading = ref(false)
const uploadError = ref('')
const uploadProgress = ref('')
const isDragging = ref(false)

// ⚠️  Make sure this bucket exists in your Supabase project → Storage → New bucket
const BUCKET = 'news-images'

const defaultForm = () => ({
  title: '', excerpt: '', body: '', imageUrl: '', imageCaption: '',
  source: '', sourceUrl: '', author: '', authorRole: '',
  category: 'world', isActive: true, isTrending: false, isFeatured: false,
  readTimeMin: 4,
})
const form = ref(defaultForm())

onMounted(async () => {
  if (isEdit.value) {
    try {
      const data = await newsAPI.getById(route.params.id)
      if (data) Object.assign(form.value, data)
    } catch { /* use defaults */ }
  }
})

function triggerFileInput() {
  fileInput.value?.click()
}

function onFileChange(e) {
  const file = e.target.files?.[0]
  if (file) uploadImage(file)
}

function onDrop(e) {
  isDragging.value = false
  const file = e.dataTransfer.files?.[0]
  if (file && file.type.startsWith('image/')) {
    uploadImage(file)
  } else {
    uploadError.value = 'Please drop an image file (JPG, PNG, WebP, GIF).'
  }
}

async function uploadImage(file) {
  if (file.size > 5 * 1024 * 1024) {
    uploadError.value = 'File is too large. Maximum size is 5MB.'
    return
  }
  if (!file.type.startsWith('image/')) {
    uploadError.value = 'Only image files are allowed.'
    return
  }

  uploading.value = true
  uploadError.value = ''
  uploadProgress.value = 'Preparing...'

  try {
    const ext = file.name.split('.').pop().toLowerCase()
    const fileName = `${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`
    const filePath = `uploads/${fileName}`

    uploadProgress.value = 'Uploading...'

    const { error: uploadErr } = await supabase.storage
      .from(BUCKET)
      .upload(filePath, file, {
        cacheControl: '3600',
        upsert: false,
        contentType: file.type,
      })

    if (uploadErr) throw uploadErr

    uploadProgress.value = 'Getting URL...'

    const { data: urlData } = supabase.storage
      .from(BUCKET)
      .getPublicUrl(filePath)

    if (!urlData?.publicUrl) throw new Error('Could not get public URL.')

    form.value.imageUrl = urlData.publicUrl
    imgError.value = false
  } catch (err) {
    console.error('Upload error:', err)
    uploadError.value = err.message || 'Upload failed. Check your Supabase bucket settings.'
  } finally {
    uploading.value = false
    uploadProgress.value = ''
    if (fileInput.value) fileInput.value.value = ''
  }
}

async function saveArticle() {
  if (!form.value.title.trim() || !form.value.category) {
    saveMsg.value = { type: 'error', text: 'Title and Category are required.' }
    return
  }
  saving.value = true
  saveMsg.value = null
  try {
    if (isEdit.value) {
      await newsAPI.update(route.params.id, form.value)
      saveMsg.value = { type: 'success', text: '✅ Article updated successfully!' }
    } else {
      await newsAPI.create(form.value)
      saveMsg.value = { type: 'success', text: '✅ Article published successfully!' }
      setTimeout(() => router.push('/admin/news'), 1200)
    }
  } catch {
    saveMsg.value = { type: 'error', text: '❌ Error saving. Is the Quarkus API running on :8080?' }
  } finally { saving.value = false }
}
</script>

<style scoped>
.news-form { display: grid; grid-template-columns: 1fr 300px; gap: 24px; align-items: start; }
.form-main { display: flex; flex-direction: column; gap: 20px; }
.form-sidebar { display: flex; flex-direction: column; gap: 16px; position: sticky; top: 80px; }

.form-card { background: var(--bg-card); border: 1px solid var(--border); border-radius: var(--radius-lg); padding: 20px; }
.form-card-title { font-family: var(--font-mono); font-size: 11px; text-transform: uppercase; letter-spacing: 0.12em; color: var(--text-muted); margin-bottom: 16px; padding-bottom: 10px; border-bottom: 1px solid var(--border); }

.form-group { display: flex; flex-direction: column; gap: 7px; margin-top: 14px; }
.form-group:first-child { margin-top: 0; }
.form-label { font-family: var(--font-mono); font-size: 10px; text-transform: uppercase; letter-spacing: 0.1em; color: var(--text-muted); }
.form-input { background: var(--bg-secondary); border: 1px solid var(--border); border-radius: var(--radius); padding: 10px 14px; font-family: var(--font-body); font-size: 0.9rem; color: var(--text-primary); outline: none; transition: border-color 0.2s; width: 100%; resize: vertical; }
.form-input:focus { border-color: var(--accent-red); box-shadow: 0 0 0 2px var(--accent-red-glow); }
.form-input::placeholder { color: var(--text-muted); }
.form-input-lg { font-size: 1.05rem; font-weight: 500; padding: 12px 14px; }
.form-textarea-lg { min-height: 280px; font-family: var(--font-body); line-height: 1.7; }
.form-row-2 { display: grid; grid-template-columns: 1fr 1fr; gap: 14px; }

/* Tab Switch */
.img-tab-row { display: flex; gap: 8px; margin-bottom: 4px; }
.img-tab { flex: 1; padding: 8px 12px; font-family: var(--font-mono); font-size: 11px; text-transform: uppercase; letter-spacing: 0.08em; border: 1px solid var(--border); border-radius: var(--radius); background: var(--bg-secondary); color: var(--text-muted); cursor: pointer; transition: all 0.2s; }
.img-tab.active { background: var(--accent-red); border-color: var(--accent-red); color: #fff; }

/* Drop Zone */
.drop-zone { border: 2px dashed var(--border); border-radius: var(--radius-lg); min-height: 180px; display: flex; align-items: center; justify-content: center; cursor: pointer; transition: all 0.2s; position: relative; overflow: hidden; background: var(--bg-secondary); }
.drop-zone:hover, .drop-zone.dragging { border-color: var(--accent-red); background: color-mix(in srgb, var(--accent-red) 4%, var(--bg-secondary)); }
.drop-zone.uploading { cursor: wait; }
.drop-zone.has-image { border-style: solid; border-color: var(--border); min-height: 200px; }

.drop-placeholder { text-align: center; padding: 32px 20px; display: flex; flex-direction: column; align-items: center; gap: 8px; }
.drop-icon { font-size: 2.2rem; }
.drop-text { font-size: 0.9rem; color: var(--text-secondary); font-weight: 500; }
.drop-sub { font-size: 0.78rem; color: var(--text-muted); }

.drop-preview { width: 100%; height: 100%; min-height: 200px; position: relative; }
.drop-preview img { width: 100%; height: 100%; min-height: 200px; object-fit: cover; display: block; }
.drop-overlay { position: absolute; inset: 0; background: rgba(0,0,0,0.55); display: flex; align-items: center; justify-content: center; opacity: 0; transition: opacity 0.2s; color: #fff; font-size: 0.85rem; font-weight: 500; }
.drop-zone:hover .drop-overlay { opacity: 1; }

.upload-spinner { width: 36px; height: 36px; border: 3px solid var(--border); border-top-color: var(--accent-red); border-radius: 50%; animation: spin 0.7s linear infinite; margin-bottom: 4px; }
@keyframes spin { to { transform: rotate(360deg); } }

.upload-error { margin-top: 8px; padding: 8px 12px; border-radius: var(--radius); background: rgba(230,57,70,0.08); border: 1px solid rgba(230,57,70,0.25); color: var(--accent-red); font-size: 0.82rem; }

.uploaded-url-row { margin-top: 10px; display: flex; align-items: flex-start; gap: 8px; font-size: 0.78rem; color: var(--text-muted); word-break: break-all; }
.uploaded-url-label { flex-shrink: 0; font-family: var(--font-mono); text-transform: uppercase; font-size: 10px; letter-spacing: 0.08em; padding-top: 1px; }
.uploaded-url-link { color: var(--accent-red); text-decoration: underline; }

/* URL mode preview */
.img-preview { border-radius: var(--radius); overflow: hidden; border: 1px solid var(--border); }
.img-preview img { width: 100%; max-height: 200px; object-fit: cover; display: block; }
.img-preview img.error { display: none; }
.img-error { padding: 20px; text-align: center; color: var(--accent-amber); font-size: 0.85rem; }

/* Toggles */
.toggle-group { display: flex; flex-direction: column; gap: 12px; }
.toggle-row { display: flex; align-items: center; justify-content: space-between; cursor: pointer; }
.toggle-label { font-size: 0.9rem; font-weight: 500; }
.toggle-sub { font-size: 0.75rem; color: var(--text-muted); }
.toggle-switch { width: 40px; height: 22px; background: rgba(255,255,255,0.08); border-radius: 11px; position: relative; transition: background 0.2s; cursor: pointer; flex-shrink: 0; }
.toggle-switch.on { background: var(--accent-red); }
.toggle-knob { position: absolute; top: 3px; left: 3px; width: 16px; height: 16px; background: #fff; border-radius: 50%; transition: transform 0.2s; }
.toggle-switch.on .toggle-knob { transform: translateX(18px); }

/* Category radios */
.cat-radio-grid { display: flex; flex-wrap: wrap; gap: 8px; }
.cat-radio { padding: 6px 12px; border: 1px solid color-mix(in srgb, var(--cat-c) 30%, transparent); border-radius: 20px; font-family: var(--font-mono); font-size: 10px; text-transform: uppercase; cursor: pointer; color: var(--cat-c); background: color-mix(in srgb, var(--cat-c) 6%, transparent); transition: all 0.2s; }
.cat-radio.selected { background: var(--cat-c); color: #fff; border-color: var(--cat-c); }

/* Save */
.save-btns { display: flex; flex-direction: column; gap: 8px; }
.btn-full { width: 100%; justify-content: center; }
.save-msg { padding: 10px 14px; border-radius: var(--radius); font-size: 0.85rem; }
.save-msg.success { background: rgba(16,185,129,0.1); border: 1px solid rgba(16,185,129,0.3); color: #10b981; }
.save-msg.error { background: rgba(230,57,70,0.1); border: 1px solid rgba(230,57,70,0.3); color: var(--accent-red); }

.btn { display: inline-flex; align-items: center; gap: 8px; padding: 9px 20px; font-family: var(--font-mono); font-size: 12px; font-weight: 500; text-transform: uppercase; letter-spacing: 0.08em; border-radius: var(--radius); cursor: pointer; transition: all 0.2s; border: 1px solid transparent; text-decoration: none; }
.btn-primary { background: var(--accent-red); color: #fff; border-color: var(--accent-red); }
.btn-primary:hover:not(:disabled) { background: #c62b38; }
.btn-primary:disabled { opacity: 0.6; cursor: not-allowed; }
.btn-outline { background: transparent; color: var(--text-secondary); border-color: var(--border-bright); }
.btn-outline:hover { color: var(--text-primary); }

@media (max-width: 900px) { .news-form { grid-template-columns: 1fr; } .form-sidebar { position: static; } }
</style>
