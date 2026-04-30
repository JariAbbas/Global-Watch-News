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
          <div class="form-group">
            <label class="form-label">Image URL</label>
            <input v-model="form.imageUrl" type="url" class="form-input" placeholder="https://example.com/image.jpg" />
          </div>
          <div v-if="form.imageUrl" class="img-preview">
            <img :src="form.imageUrl" alt="Preview" @error="imgError = true" :class="{ error: imgError }" />
            <div v-if="imgError" class="img-error">⚠️ Image URL could not be loaded</div>
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
        <!-- Publish Settings -->
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

        <!-- Category -->
        <div class="form-card">
          <div class="form-card-title">Category *</div>
          <div class="cat-radio-grid">
            <label v-for="cat in categories" :key="cat.slug" class="cat-radio" :class="{ selected: form.category === cat.slug }" :style="{ '--cat-c': cat.color }">
              <input type="radio" v-model="form.category" :value="cat.slug" hidden />
              {{ cat.label }}
            </label>
          </div>
        </div>

        <!-- Author -->
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

        <!-- Read Time -->
        <div class="form-card">
          <div class="form-card-title">Metadata</div>
          <div class="form-group">
            <label class="form-label">Read Time (minutes)</label>
            <input v-model.number="form.readTimeMin" type="number" min="1" max="60" class="form-input" />
          </div>
        </div>

        <!-- Save buttons -->
        <div class="save-btns">
          <button class="btn btn-primary btn-full" @click="saveArticle(true)" :disabled="saving">
            {{ saving ? 'Saving...' : (isEdit ? 'Update Article' : 'Publish Article') }}
          </button>
          <router-link to="/admin/news" class="btn btn-outline btn-full" style="justify-content:center;">
            Cancel
          </router-link>
        </div>

        <!-- Error / Success -->
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

const route = useRoute()
const router = useRouter()
const isEdit = computed(() => !!route.params.id)
const saving = ref(false)
const imgError = ref(false)
const saveMsg = ref(null)

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

/* IMG PREVIEW */
.img-preview { margin-top: 12px; border-radius: var(--radius); overflow: hidden; border: 1px solid var(--border); }
.img-preview img { width: 100%; max-height: 200px; object-fit: cover; display: block; }
.img-preview img.error { display: none; }
.img-error { padding: 20px; text-align: center; color: var(--accent-amber); font-size: 0.85rem; }

/* TOGGLES */
.toggle-group { display: flex; flex-direction: column; gap: 12px; }
.toggle-row { display: flex; align-items: center; justify-content: space-between; cursor: pointer; }
.toggle-label { font-size: 0.9rem; font-weight: 500; }
.toggle-sub { font-size: 0.75rem; color: var(--text-muted); }
.toggle-switch { width: 40px; height: 22px; background: rgba(255,255,255,0.08); border-radius: 11px; position: relative; transition: background 0.2s; cursor: pointer; flex-shrink: 0; }
.toggle-switch.on { background: var(--accent-red); }
.toggle-knob { position: absolute; top: 3px; left: 3px; width: 16px; height: 16px; background: #fff; border-radius: 50%; transition: transform 0.2s; }
.toggle-switch.on .toggle-knob { transform: translateX(18px); }

/* CATEGORY RADIOS */
.cat-radio-grid { display: flex; flex-wrap: wrap; gap: 8px; }
.cat-radio { padding: 6px 12px; border: 1px solid color-mix(in srgb, var(--cat-c) 30%, transparent); border-radius: 20px; font-family: var(--font-mono); font-size: 10px; text-transform: uppercase; cursor: pointer; color: var(--cat-c); background: color-mix(in srgb, var(--cat-c) 6%, transparent); transition: all 0.2s; }
.cat-radio.selected { background: var(--cat-c); color: #fff; border-color: var(--cat-c); }

/* SAVE BTNS */
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
