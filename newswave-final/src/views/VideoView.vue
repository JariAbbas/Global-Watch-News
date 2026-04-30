<template>
  <div class="video-page">
    <!-- Hero -->
    <div class="video-hero">
      <div class="container">
        <h1 class="video-hero-title">Video Reports</h1>
        <p class="video-hero-sub">Watch our latest news videos, documentaries, and live coverage</p>
        <!-- Filter Tabs -->
        <div class="video-filters">
          <button
            v-for="f in filters"
            :key="f"
            class="filter-btn"
            :class="{ active: activeFilter === f }"
            @click="activeFilter = f"
          >{{ f }}</button>
        </div>
      </div>
    </div>

    <div class="container video-body">
      <!-- Featured Video -->
      <div class="featured-video card">
        <div class="feat-vid-player">
          <div class="feat-vid-thumb">
            <img :src="featuredVideo.thumb" :alt="featuredVideo.title" style="width:100%;height:100%;object-fit:cover;" />
            <div class="feat-vid-overlay"></div>
            <button class="feat-play-btn">
              <svg viewBox="0 0 24 24" fill="currentColor" width="28"><path d="M8 5v14l11-7z"/></svg>
            </button>
            <div class="feat-vid-badge">
              <span class="tag live">{{ featuredVideo.duration }}</span>
            </div>
          </div>
        </div>
        <div class="feat-vid-info card-body">
          <span class="tag" :class="featuredVideo.category">{{ featuredVideo.category }}</span>
          <h2 class="feat-vid-title">{{ featuredVideo.title }}</h2>
          <p class="card-excerpt">{{ featuredVideo.desc }}</p>
          <div class="card-meta">
            <span>{{ featuredVideo.views }} views</span>
            <span>·</span>
            <span>{{ featuredVideo.date }}</span>
          </div>
        </div>
      </div>

      <!-- Video Grid -->
      <div class="section-header" style="margin-top:48px;">
        <h2 class="section-title">{{ activeFilter === 'All' ? 'All Videos' : activeFilter }}</h2>
        <span class="tag">{{ filteredVideos.length }} videos</span>
      </div>
      <div class="video-grid">
        <div
          v-for="video in filteredVideos"
          :key="video.id"
          class="video-card card"
        >
          <div class="vid-thumb-wrap">
            <img :src="video.thumb" :alt="video.title" class="vid-thumb card-img" loading="lazy" />
            <div class="vid-overlay"></div>
            <button class="vid-play">
              <svg viewBox="0 0 24 24" fill="currentColor" width="20"><path d="M8 5v14l11-7z"/></svg>
            </button>
            <span class="vid-duration">{{ video.duration }}</span>
          </div>
          <div class="vid-body card-body">
            <span class="tag" :class="video.category" style="font-size:9px;padding:2px 7px;">{{ video.category }}</span>
            <h3 class="vid-title card-title">{{ video.title }}</h3>
            <div class="card-meta">
              <span>{{ video.views }} views</span>
              <span>·</span>
              <span>{{ video.date }}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'

const filters = ['All', 'Breaking News', 'World', 'Tech', 'Business', 'Sports', 'Documentary']
const activeFilter = ref('All')

const featuredVideo = {
  id: 0,
  title: 'FULL COVERAGE: Geneva Climate Summit — Historic Carbon Neutrality Agreement Signed',
  desc: 'Watch our complete 3-hour live broadcast of the Geneva Climate Summit, including the historic signing ceremony and press conferences from world leaders.',
  category: 'world',
  thumb: 'https://images.unsplash.com/photo-1504711434969-e33886168f5c?w=1200&q=80',
  duration: '3:14:22',
  views: '4.2M',
  date: 'March 28, 2026',
}

const videos = [
  { id: 1, title: 'MIT Quantum Breakthrough: What It Means for Cybersecurity', category: 'tech', thumb: 'https://images.unsplash.com/photo-1518770660439-4636190af475?w=600&q=80', duration: '12:44', views: '1.8M', date: 'Mar 28', type: 'Tech' },
  { id: 2, title: 'Champions League Shock: Braga\'s Stunning 4-1 Victory', category: 'sports', thumb: 'https://images.unsplash.com/photo-1574629810360-7efbbe195018?w=600&q=80', duration: '8:31', views: '5.1M', date: 'Mar 27', type: 'Sports' },
  { id: 3, title: 'Inside Mars Colony Alpha: One Year on the Red Planet', category: 'science', thumb: 'https://images.unsplash.com/photo-1614726365952-510103b1bdb8?w=600&q=80', duration: '22:10', views: '3.2M', date: 'Mar 27', type: 'Documentary' },
  { id: 4, title: 'S&P 500 Hits 7,200 — Market Analysis & Outlook', category: 'business', thumb: 'https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?w=600&q=80', duration: '9:05', views: '780K', date: 'Mar 27', type: 'Business' },
  { id: 5, title: 'WHO Emergency: The Antibiotic Resistance Crisis Explained', category: 'health', thumb: 'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=600&q=80', duration: '15:22', views: '1.1M', date: 'Mar 22', type: 'World' },
  { id: 6, title: 'SpaceX Starship Lunar Mission: Complete Highlights', category: 'science', thumb: 'https://images.unsplash.com/photo-1541185934-01b600ea069c?w=600&q=80', duration: '18:50', views: '2.9M', date: 'Mar 23', type: 'Documentary' },
  { id: 7, title: 'US Senate AI Regulation Act: What It Means for Big Tech', category: 'politics', thumb: 'https://images.unsplash.com/photo-1555848962-6e79363ec58f?w=600&q=80', duration: '11:16', views: '620K', date: 'Mar 25', type: 'Breaking News' },
  { id: 8, title: 'Pakistan Solar Revolution: The Thar Desert Transformation', category: 'world', thumb: 'https://images.unsplash.com/photo-1509391366360-2e959784a276?w=600&q=80', duration: '14:38', views: '410K', date: 'Mar 24', type: 'World' },
]

const filteredVideos = computed(() => {
  if (activeFilter.value === 'All') return videos
  return videos.filter(v => v.type === activeFilter.value)
})
</script>

<style scoped>
/* HERO */
.video-hero {
  background: var(--bg-secondary);
  border-bottom: 1px solid var(--border);
  padding: 60px 0 0;
}
.video-hero-title {
  font-family: var(--font-display);
  font-size: clamp(2.5rem, 5vw, 4.5rem);
  letter-spacing: 0.04em;
  margin-bottom: 10px;
}
.video-hero-sub {
  font-size: 1rem;
  color: var(--text-secondary);
  margin-bottom: 28px;
}
.video-filters {
  display: flex;
  gap: 6px;
  flex-wrap: wrap;
}
.filter-btn {
  padding: 8px 18px;
  font-family: var(--font-mono);
  font-size: 11px;
  font-weight: 500;
  text-transform: uppercase;
  letter-spacing: 0.08em;
  border: 1px solid var(--border);
  border-radius: 2px;
  color: var(--text-secondary);
  background: transparent;
  cursor: pointer;
  transition: all 0.2s;
  margin-bottom: 1px;
}
.filter-btn:hover { border-color: var(--border-bright); color: var(--text-primary); }
.filter-btn.active { background: var(--accent-red); border-color: var(--accent-red); color: #fff; }

/* BODY */
.video-body { padding: 50px 0 80px; }

/* FEATURED */
.featured-video {
  display: grid;
  grid-template-columns: 1.6fr 1fr;
}
.feat-vid-player {}
.feat-vid-thumb {
  position: relative;
  aspect-ratio: 16/9;
  overflow: hidden;
  background: #000;
  cursor: pointer;
}
.feat-vid-overlay {
  position: absolute;
  inset: 0;
  background: rgba(0,0,0,0.3);
  transition: background 0.2s;
}
.feat-vid-thumb:hover .feat-vid-overlay { background: rgba(0,0,0,0.15); }
.feat-play-btn {
  position: absolute;
  top: 50%; left: 50%;
  transform: translate(-50%, -50%);
  width: 64px; height: 64px;
  background: rgba(230,57,70,0.9);
  border-radius: 50%;
  border: none;
  color: #fff;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.2s;
  padding-left: 4px;
}
.feat-play-btn:hover { transform: translate(-50%, -50%) scale(1.1); background: var(--accent-red); }
.feat-vid-badge { position: absolute; bottom: 12px; right: 12px; }
.feat-vid-title {
  font-family: var(--font-headline);
  font-size: 1.3rem;
  font-weight: 900;
  line-height: 1.35;
  margin: 10px 0 12px;
}

/* VIDEO GRID */
.video-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 20px;
}
.vid-thumb-wrap {
  position: relative;
  overflow: hidden;
  aspect-ratio: 16/9;
}
.vid-thumb { object-fit: cover; height: 100%; }
.vid-overlay {
  position: absolute;
  inset: 0;
  background: rgba(0,0,0,0.35);
  transition: background 0.2s;
}
.video-card:hover .vid-overlay { background: rgba(0,0,0,0.15); }
.vid-play {
  position: absolute;
  top: 50%; left: 50%;
  transform: translate(-50%, -50%);
  width: 44px; height: 44px;
  background: rgba(230,57,70,0.85);
  border-radius: 50%;
  border: none;
  color: #fff;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  padding-left: 3px;
  transition: all 0.2s;
  opacity: 0;
}
.video-card:hover .vid-play { opacity: 1; }
.vid-duration {
  position: absolute;
  bottom: 8px; right: 8px;
  background: rgba(0,0,0,0.8);
  padding: 2px 7px;
  font-family: var(--font-mono);
  font-size: 10px;
  color: #fff;
  border-radius: 2px;
}
.vid-title { font-size: 0.88rem; }
.vid-body { padding: 12px; display: flex; flex-direction: column; gap: 6px; }

@media (max-width: 1100px) {
  .video-grid { grid-template-columns: repeat(2, 1fr); }
}
@media (max-width: 800px) {
  .featured-video { grid-template-columns: 1fr; }
}
@media (max-width: 540px) {
  .video-grid { grid-template-columns: 1fr; }
}
</style>
