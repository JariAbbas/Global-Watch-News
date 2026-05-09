<template>
  <AdminLayout :title="isEdit ? 'Edit Video' : 'Add Video'" :subtitle="isEdit ? `Editing: ${form.title || '...'}` : 'Upload a new video'">
    <template #actions>
      <router-link to="/admin/videos" class="btn btn-outline">← Back to Videos</router-link>
      <button class="btn btn-primary" @click="save" :disabled="saving || uploading">
        {{ saving ? 'Saving...' : (isEdit ? 'Update Video' : 'Publish Video') }}
      </button>
    </template>

    <div class="vf-grid">
      <div class="vf-main">

        <!-- Basic Info -->
        <div class="form-card">
          <div class="form-card-title">Video Info</div>
          <div class="form-group">
            <label class="form-label">Title *</label>
            <input v-model="form.title" type="text" class="form-input form-input-lg" placeholder="Video title..." />
          </div>
          <div class="form-group">
            <label class="form-label">Excerpt (shown on cards)</label>
            <textarea v-model="form.excerpt" class="form-input" rows="2" placeholder="Short summary..."></textarea>
          </div>
          <div class="form-group">
            <label class="form-label">Full Description *</label>
            <textarea v-model="form.description" class="form-input form-textarea-lg" rows="10" placeholder="Write full video description here. Use blank lines to separate paragraphs..."></textarea>
          </div>
        </div>

        <!-- Thumbnail Upload -->
        <div class="form-card">
          <div class="form-card-title">Thumbnail Image</div>
          <div class="img-tab-row">
            <button class="img-tab" :class="{ active: thumbMode === 'upload' }" @click="thumbMode = 'upload'" type="button">📁 Upload</button>
            <button class="img-tab" :class="{ active: thumbMode === 'url' }" @click="thumbMode = 'url'" type="button">🔗 URL</button>
          </div>
          <div v-if="thumbMode === 'upload'" class="form-group">
            <div class="drop-zone" :class="{ dragging: isDraggingThumb, uploading: uploadingThumb, 'has-image': !!form.thumbnailUrl }"
              @click="thumbInput?.click()" @dragover.prevent="isDraggingThumb=true" @dragleave.prevent="isDraggingThumb=false" @drop.prevent="onDropThumb">
              <input ref="thumbInput" type="file" accept="image/*" style="display:none" @change="e => uploadFile(e.target.files[0], 'thumb')" />
              <div v-if="form.thumbnailUrl && !uploadingThumb" class="drop-preview">
                <img :src="form.thumbnailUrl" alt="Thumbnail" />
                <div class="drop-overlay"><span>Click to replace</span></div>
              </div>
              <div v-else-if="uploadingThumb" class="drop-placeholder"><div class="upload-spinner"></div><div class="drop-text">Uploading...</div></div>
              <div v-else class="drop-placeholder"><div class="drop-icon">🖼️</div><div class="drop-text">Click or drag thumbnail image</div><div class="drop-sub">JPG, PNG, WebP — max 5MB</div></div>
            </div>
            <div v-if="thumbError" class="upload-error">⚠️ {{ thumbError }}</div>
          </div>
          <div v-else class="form-group">
            <input v-model="form.thumbnailUrl" type="url" class="form-input" placeholder="https://..." />
            <div v-if="form.thumbnailUrl" class="img-preview" style="margin-top:10px;"><img :src="form.thumbnailUrl" alt="preview" /></div>
          </div>
        </div>

        <!-- Video Upload -->
        <div class="form-card">
          <div class="form-card-title">Video File</div>
          <div class="img-tab-row">
            <button class="img-tab" :class="{ active: videoMode === 'upload' }" @click="videoMode = 'upload'" type="button">📁 Upload Video</button>
            <button class="img-tab" :class="{ active: videoMode === 'url' }" @click="videoMode = 'url'" type="button">🔗 YouTube / URL</button>
          </div>

          <div v-if="videoMode === 'upload'" class="form-group">
            <div class="drop-zone drop-zone-video" :class="{ dragging: isDraggingVideo, uploading: uploadingVideo, 'has-file': !!form.videoUrl }"
              @click="videoInput?.click()" @dragover.prevent="isDraggingVideo=true" @dragleave.prevent="isDraggingVideo=false" @drop.prevent="onDropVideo">
              <input ref="videoInput" type="file" accept="video/*" style="display:none" @change="e => uploadFile(e.target.files[0], 'video')" />
              <div v-if="form.videoUrl && !uploadingVideo" class="drop-placeholder">
                <div class="drop-icon">✅</div>
                <div class="drop-text">Video uploaded</div>
                <div class="drop-sub" style="word-break:break-all;font-size:10px;">{{ form.videoUrl }}</div>
                <div class="drop-sub" style="margin-top:6px;">Click to replace</div>
              </div>
              <div v-else-if="uploadingVideo" class="drop-placeholder">
                <div class="upload-spinner"></div>
                <div class="drop-text">Uploading video... {{ videoProgress }}</div>
              </div>
              <div v-else class="drop-placeholder">
                <div class="drop-icon">🎬</div>
                <div class="drop-text">Click or drag video file</div>
                <div class="drop-sub">MP4, WebM — max 500MB</div>
              </div>
            </div>
            <div v-if="videoError" class="upload-error">⚠️ {{ videoError }}</div>
          </div>

          <div v-else class="form-group">
            <label class="form-label">YouTube URL, Vimeo URL, or direct video URL</label>
            <input v-model="form.videoUrl" type="url" class="form-input" placeholder="https://youtube.com/watch?v=... or https://..." />
          </div>

          <div class="form-group" style="margin-top:12px;">
            <label class="form-label">Duration (e.g. 12:44)</label>
            <input v-model="form.duration" type="text" class="form-input" placeholder="00:00" style="max-width:140px;" />
          </div>
        </div>

        <!-- Source -->
        <div class="form-card">
          <div class="form-card-title">Source</div>
          <div class="form-row-2">
            <div class="form-group">
              <label class="form-label">Source Name</label>
              <input v-model="form.source" type="text" class="form-input" placeholder="Reuters, AP..." />
            </div>
            <div class="form-group">
              <label class="form-label">Source URL</label>
              <input v-model="form.sourceUrl" type="url" class="form-input" placeholder="https://..." />
            </div>
          </div>
          <div class="form-row-2" style="margin-top:12px;">
            <div class="form-group">
              <label class="form-label">Author Name</label>
              <input v-model="form.author" type="text" class="form-input" placeholder="Full name..." />
            </div>
            <div class="form-group">
              <label class="form-label">Author Role</label>
              <input v-model="form.authorRole" type="text" class="form-input" placeholder="Senior Correspondent..." />
            </div>
          </div>
        </div>

      </div>

      <!-- Sidebar -->
      <div class="vf-sidebar">
        <div class="form-card">
          <div class="form-card-title">Publish Settings</div>
          <div class="toggle-group">
            <label class="toggle-row">
              <div class="toggle-info"><div class="toggle-label">Active</div><div class="toggle-sub">Visible on site</div></div>
              <div class="toggle-switch" :class="{ on: form.isActive }" @click="form.isActive = !form.isActive"><div class="toggle-knob"></div></div>
            </label>
            <label class="toggle-row">
              <div class="toggle-info"><div class="toggle-label">⭐ Featured</div><div class="toggle-sub">Show as hero video</div></div>
              <div class="toggle-switch" :class="{ on: form.isFeatured }" @click="form.isFeatured = !form.isFeatured"><div class="toggle-knob"></div></div>
            </label>
          </div>
        </div>

        <div class="form-card">
          <div class="form-card-title">Category *</div>
          <div class="cat-radio-grid">
            <label v-for="cat in categories" :key="cat.slug" class="cat-radio" :class="{ selected: form.category === cat.slug }" :style="{ '--cat-c': cat.color }">
              <input type="radio" v-model="form.category" :value="cat.slug" hidden />{{ cat.label }}
            </label>
          </div>
        </div>

        <div class="save-btns">
          <button class="btn btn-primary btn-full" @click="save" :disabled="saving || uploading">
            {{ saving ? 'Saving...' : (isEdit ? 'Update Video' : 'Publish Video') }}
          </button>
          <router-link to="/admin/videos" class="btn btn-outline btn-full" style="justify-content:center;">Cancel</router-link>
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
import { videoAPI } from '../../services/api.js'
import { categories } from '../../store/newsData.js'
import { supabase } from '../../services/supabase.js'

const route = useRoute()
const router = useRouter()
const isEdit = computed(() => !!route.params.id)
const saving = ref(false)
const saveMsg = ref(null)

const thumbMode = ref('upload')
const videoMode = ref('url')
const thumbInput = ref(null)
const videoInput = ref(null)
const uploadingThumb = ref(false)
const uploadingVideo = ref(false)
const isDraggingThumb = ref(false)
const isDraggingVideo = ref(false)
const thumbError = ref('')
const videoError = ref('')
const videoProgress = ref('')
const uploading = computed(() => uploadingThumb.value || uploadingVideo.value)

const BUCKET_IMG = 'news-images'
const BUCKET_VID = 'videos'

const defaultForm = () => ({
  title: '', excerpt: '', description: '', thumbnailUrl: '', videoUrl: '',
  duration: '', source: '', sourceUrl: '', author: '', authorRole: '',
  category: 'world', isActive: true, isFeatured: false,
})
const form = ref(defaultForm())

onMounted(async () => {
  if (isEdit.value) {
    try {
      const data = await videoAPI.getById(route.params.id)
      if (data) Object.assign(form.value, data)
    } catch {}
  }
})

function onDropThumb(e) {
  isDraggingThumb.value = false
  const f = e.dataTransfer.files?.[0]
  if (f?.type.startsWith('image/')) uploadFile(f, 'thumb')
  else thumbError.value = 'Please drop an image file.'
}

function onDropVideo(e) {
  isDraggingVideo.value = false
  const f = e.dataTransfer.files?.[0]
  if (f?.type.startsWith('video/')) uploadFile(f, 'video')
  else videoError.value = 'Please drop a video file.'
}

async function uploadFile(file, type) {
  if (!file) return
  const isThumb = type === 'thumb'
  const maxSize = isThumb ? 5 * 1024 * 1024 : 500 * 1024 * 1024
  const bucket = isThumb ? BUCKET_IMG : BUCKET_VID

  if (file.size > maxSize) {
    if (isThumb) thumbError.value = 'Max 5MB for thumbnail.'
    else videoError.value = 'Max 500MB for video.'
    return
  }

  if (isThumb) { uploadingThumb.value = true; thumbError.value = '' }
  else { uploadingVideo.value = true; videoError.value = ''; videoProgress.value = '' }

  try {
    const ext = file.name.split('.').pop().toLowerCase()
    const path = `uploads/${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`

    const { error } = await supabase.storage.from(bucket).upload(path, file, {
      cacheControl: '3600', upsert: false, contentType: file.type,
    })
    if (error) throw error

    const { data: urlData } = supabase.storage.from(bucket).getPublicUrl(path)
    if (!urlData?.publicUrl) throw new Error('Could not get public URL.')

    if (isThumb) form.value.thumbnailUrl = urlData.publicUrl
    else form.value.videoUrl = urlData.publicUrl
  } catch (err) {
    if (isThumb) thumbError.value = err.message || 'Upload failed.'
    else videoError.value = err.message || 'Upload failed.'
  } finally {
    if (isThumb) { uploadingThumb.value = false; if (thumbInput.value) thumbInput.value.value = '' }
    else { uploadingVideo.value = false; videoProgress.value = ''; if (videoInput.value) videoInput.value.value = '' }
  }
}

async function save() {
  if (!form.value.title.trim() || !form.value.category) {
    saveMsg.value = { type: 'error', text: 'Title and Category are required.' }
    return
  }
  saving.value = true
  saveMsg.value = null
  try {
    if (isEdit.value) {
      await videoAPI.update(route.params.id, form.value)
      saveMsg.value = { type: 'success', text: '✅ Video updated!' }
    } else {
      await videoAPI.create(form.value)
      saveMsg.value = { type: 'success', text: '✅ Video published!' }
      setTimeout(() => router.push('/admin/videos'), 1200)
    }
  } catch {
    saveMsg.value = { type: 'error', text: '❌ Error saving. Is the API running?' }
  } finally { saving.value = false }
}
</script>

<style scoped>
.vf-grid { display: grid; grid-template-columns: 1fr 300px; gap: 24px; align-items: start; }
.vf-main { display: flex; flex-direction: column; gap: 20px; }
.vf-sidebar { display: flex; flex-direction: column; gap: 16px; position: sticky; top: 80px; }
.form-card { background: var(--bg-card); border: 1px solid var(--border); border-radius: var(--radius-lg); padding: 20px; }
.form-card-title { font-family: var(--font-mono); font-size: 11px; text-transform: uppercase; letter-spacing: 0.12em; color: var(--text-muted); margin-bottom: 16px; padding-bottom: 10px; border-bottom: 1px solid var(--border); }
.form-group { display: flex; flex-direction: column; gap: 7px; margin-top: 14px; }
.form-group:first-child { margin-top: 0; }
.form-label { font-family: var(--font-mono); font-size: 10px; text-transform: uppercase; letter-spacing: 0.1em; color: var(--text-muted); }
.form-input { background: var(--bg-secondary); border: 1px solid var(--border); border-radius: var(--radius); padding: 10px 14px; font-family: var(--font-body); font-size: 0.9rem; color: var(--text-primary); outline: none; transition: border-color 0.2s; width: 100%; resize: vertical; }
.form-input:focus { border-color: var(--accent-red); box-shadow: 0 0 0 2px var(--accent-red-glow); }
.form-input::placeholder { color: var(--text-muted); }
.form-input-lg { font-size: 1.05rem; font-weight: 500; padding: 12px 14px; }
.form-textarea-lg { min-height: 220px; line-height: 1.7; }
.form-row-2 { display: grid; grid-template-columns: 1fr 1fr; gap: 14px; }
.img-tab-row { display: flex; gap: 8px; margin-bottom: 4px; }
.img-tab { flex: 1; padding: 8px 12px; font-family: var(--font-mono); font-size: 11px; text-transform: uppercase; letter-spacing: 0.08em; border: 1px solid var(--border); border-radius: var(--radius); background: var(--bg-secondary); color: var(--text-muted); cursor: pointer; transition: all 0.2s; }
.img-tab.active { background: var(--accent-red); border-color: var(--accent-red); color: #fff; }
.drop-zone { border: 2px dashed var(--border); border-radius: var(--radius-lg); min-height: 160px; display: flex; align-items: center; justify-content: center; cursor: pointer; transition: all 0.2s; position: relative; overflow: hidden; background: var(--bg-secondary); }
.drop-zone-video { min-height: 130px; }
.drop-zone:hover, .drop-zone.dragging { border-color: var(--accent-red); }
.drop-placeholder { text-align: center; padding: 24px 20px; display: flex; flex-direction: column; align-items: center; gap: 8px; }
.drop-icon { font-size: 2rem; }
.drop-text { font-size: 0.88rem; color: var(--text-secondary); font-weight: 500; }
.drop-sub { font-size: 0.76rem; color: var(--text-muted); }
.drop-preview { width: 100%; height: 100%; min-height: 160px; position: relative; }
.drop-preview img { width: 100%; height: 100%; min-height: 160px; object-fit: cover; display: block; }
.drop-overlay { position: absolute; inset: 0; background: rgba(0,0,0,0.5); display: flex; align-items: center; justify-content: center; opacity: 0; transition: opacity 0.2s; color: #fff; font-size: 0.85rem; }
.drop-zone:hover .drop-overlay { opacity: 1; }
.upload-spinner { width: 32px; height: 32px; border: 3px solid var(--border); border-top-color: var(--accent-red); border-radius: 50%; animation: spin 0.7s linear infinite; }
@keyframes spin { to { transform: rotate(360deg); } }
.upload-error { margin-top: 8px; padding: 8px 12px; border-radius: var(--radius); background: rgba(230,57,70,0.08); border: 1px solid rgba(230,57,70,0.25); color: var(--accent-red); font-size: 0.82rem; }
.img-preview img { width: 100%; max-height: 160px; object-fit: cover; border-radius: var(--radius); border: 1px solid var(--border); }
.toggle-group { display: flex; flex-direction: column; gap: 12px; }
.toggle-row { display: flex; align-items: center; justify-content: space-between; cursor: pointer; }
.toggle-label { font-size: 0.9rem; font-weight: 500; }
.toggle-sub { font-size: 0.75rem; color: var(--text-muted); }
.toggle-switch { width: 40px; height: 22px; background: rgba(255,255,255,0.08); border-radius: 11px; position: relative; transition: background 0.2s; cursor: pointer; flex-shrink: 0; }
.toggle-switch.on { background: var(--accent-red); }
.toggle-knob { position: absolute; top: 3px; left: 3px; width: 16px; height: 16px; background: #fff; border-radius: 50%; transition: transform 0.2s; }
.toggle-switch.on .toggle-knob { transform: translateX(18px); }
.cat-radio-grid { display: flex; flex-wrap: wrap; gap: 8px; }
.cat-radio { padding: 6px 12px; border: 1px solid color-mix(in srgb, var(--cat-c) 30%, transparent); border-radius: 20px; font-family: var(--font-mono); font-size: 10px; text-transform: uppercase; cursor: pointer; color: var(--cat-c); background: color-mix(in srgb, var(--cat-c) 6%, transparent); transition: all 0.2s; }
.cat-radio.selected { background: var(--cat-c); color: #fff; border-color: var(--cat-c); }
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
@media (max-width: 900px) { .vf-grid { grid-template-columns: 1fr; } .vf-sidebar { position: static; } }
</style>