<template>
  <AdminLayout title="Add New Article" subtitle="Create a fresh news story">
    <template #actions>
      <button class="btn btn-secondary" @click="$router.go(-1)">Cancel</button>
      <button class="btn btn-primary" :disabled="isSaving || isUploading" @click="saveArticle">
        {{ isSaving ? 'Saving...' : 'Publish Article' }}
      </button>
    </template>

    <div class="add-news-container">
      <div class="form-grid">
        <!-- Left Side: Content -->
        <div class="main-fields">
          <div class="field-group">
            <label>Article Title</label>
            <input v-model="article.title" type="text" placeholder="Enter a catchy headline..." class="form-input title-input" />
          </div>

          <div class="field-group">
            <label>Excerpt (Short Summary)</label>
            <textarea v-model="article.excerpt" rows="3" placeholder="Briefly describe the story..." class="form-input"></textarea>
          </div>

          <div class="field-group">
            <label>Body Content</label>
            <textarea v-model="article.body" rows="12" placeholder="Write the full story here..." class="form-input"></textarea>
          </div>
        </div>

        <!-- Right Side: Sidebar Meta -->
        <div class="sidebar-fields">
          <div class="field-group">
            <label>Cover Image</label>
            <div class="upload-zone" :class="{ 'has-image': article.imageUrl }" @click="$refs.fileInput.click()">
              <img v-if="article.imageUrl" :src="article.imageUrl" class="preview-img" />
              <div v-else class="placeholder">
                <span v-if="isUploading">Uploading...</span>
                <span v-else>+ Select Image from Device</span>
              </div>
            </div>
            <input type="file" ref="fileInput" hidden accept="image/*" @change="handleFileUpload" />
            <input v-model="article.imageUrl" type="text" placeholder="Or paste external URL" class="form-input url-input" />
          </div>

          <div class="field-group">
            <label>Category</label>
            <select v-model="article.category" class="form-input">
              <option value="">Select Category</option>
              <option v-for="c in categories" :key="c.slug" :value="c.slug">{{ c.label }}</option>
            </select>
          </div>

          <div class="field-group inline">
            <label class="checkbox-label">
              <input type="checkbox" v-model="article.isTrending" /> Trending 🔥
            </label>
            <label class="checkbox-label">
              <input type="checkbox" v-model="article.isFeatured" /> Featured ⭐
            </label>
          </div>

          <div class="field-group">
            <label>Author Name</label>
            <input v-model="article.author" type="text" class="form-input" />
          </div>
        </div>
      </div>
    </div>
  </AdminLayout>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import AdminLayout from './AdminLayout.vue'
import { newsAPI } from '../../services/api.js'
import { categories } from '../../store/newsData.js'
import { supabase } from '../../services/supabase.js' // Import your client

const router = useRouter()
const fileInput = ref(null)
const isUploading = ref(false)
const isSaving = ref(false)

const article = ref({
  title: '',
  excerpt: '',
  body: '',
  imageUrl: '',
  category: '',
  author: 'Admin',
  authorRole: 'Editor',
  isTrending: false,
  isFeatured: false,
  isActive: true
})

async function handleFileUpload(event) {
  const file = event.target.files[0]
  if (!file) return

  try {
    isUploading.value = true
    
    // 1. Create a unique path (folder name / timestamp-name)
    const fileExt = file.name.split('.').pop()
    const fileName = `${Date.now()}-${Math.floor(Math.random() * 1000)}.${fileExt}`
    const filePath = `news-covers/${fileName}`

    // 2. Upload to your Supabase Bucket (Make sure bucket is "Public")
    const { data, error } = await supabase.storage
      .from('news_images')
      .upload(filePath, file)

    if (error) throw error

    // 3. Generate the Public URL
    const { data: { publicUrl } } = supabase.storage
      .from('news_images')
      .getPublicUrl(filePath)

    // 4. Update the model
    article.value.imageUrl = publicUrl
  } catch (err) {
    alert('Upload failed: ' + err.message)
  } finally {
    isUploading.value = false
  }
}

async function saveArticle() {
  if (!article.value.title) return alert('Title is required')
  
  try {
    isSaving.value = true
    await newsAPI.create(article.value) // Sends to your Quarkus Backend
    router.push('/admin/news') // Go back to list
  } catch (err) {
    alert('Error saving article: ' + err.message)
  } finally {
    isSaving.value = false
  }
}
</script>

<style scoped>
.add-news-container { padding: 20px; }
.form-grid { display: grid; grid-template-columns: 1fr 320px; gap: 30px; }
.field-group { margin-bottom: 20px; display: flex; flex-direction: column; gap: 8px; }
.field-group label { font-family: var(--font-mono); font-size: 11px; text-transform: uppercase; color: var(--text-muted); }
.form-input { background: var(--bg-secondary); border: 1px solid var(--border); border-radius: var(--radius); padding: 12px; color: var(--text-primary); font-family: inherit; outline: none; }
.form-input:focus { border-color: var(--accent-red); }
.title-input { font-size: 1.5rem; font-weight: 700; }

.upload-zone { 
  height: 180px; background: var(--bg-secondary); border: 2px dashed var(--border); 
  border-radius: var(--radius); display: flex; align-items: center; justify-content: center; 
  cursor: pointer; overflow: hidden; position: relative;
}
.preview-img { width: 100%; height: 100%; object-fit: cover; }
.placeholder { color: var(--text-muted); font-size: 0.85rem; }
.url-input { margin-top: 8px; font-size: 0.75rem; }

.inline { flex-direction: row; gap: 20px; padding: 10px 0; }
.checkbox-label { display: flex; align-items: center; gap: 8px; font-size: 0.9rem; cursor: pointer; text-transform: none !important; color: var(--text-primary) !important; }

.btn-secondary { background: transparent; border: 1px solid var(--border); color: var(--text-primary); }
</style>