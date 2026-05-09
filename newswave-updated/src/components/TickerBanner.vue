<template>
  <div class="ticker-wrap" v-if="items.length">
    <div class="ticker-label">
      <span class="live-dot"></span>
      BREAKING
    </div>
    <div class="ticker-track">
      <div class="ticker-content" :style="{ animationDuration: duration + 's' }">
        <span v-for="(item, i) in doubledItems" :key="i" class="ticker-item">
          <span class="ticker-sep">◆</span>
          {{ item }}
        </span>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { tickerAPI } from '../services/api.js'

const items = ref([
  'Welcome to GlobalWatch News — Live. Bold. Now.',
])

onMounted(async () => {
  try {
    const tickers = await tickerAPI.getActive()
    if (tickers && tickers.length) {
      items.value = tickers.map(t => t.content)
    }
  } catch (e) {
    console.warn('Ticker API not available, using defaults')
  }
})

const doubledItems = computed(() => [...items.value, ...items.value])
const duration = computed(() => Math.max(items.value.length * 6, 50))
</script>

<style scoped>
.ticker-wrap {
  display: flex;
  align-items: center;
  background: var(--accent-red);
  overflow: hidden;
  height: 40px;
  position: relative;
  z-index: 999;
}
.ticker-label {
  display: flex;
  align-items: center;
  gap: 6px;
  flex-shrink: 0;
  background: #b91c1c;
  padding: 0 16px;
  height: 100%;
  font-family: var(--font-mono);
  font-size: 16px;
  font-weight: 500;
  letter-spacing: 0.12em;
  color: #fff;
  text-transform: uppercase;
  white-space: nowrap;
}
.live-dot {
  width: 6px; height: 6px;
  background: #fff;
  border-radius: 50%;
  animation: blink 1s ease-in-out infinite;
  flex-shrink: 0;
}
.ticker-track {
  flex: 1;
  overflow: hidden;
  mask: linear-gradient(to right, transparent, black 20px, black calc(100% - 20px), transparent);
}
.ticker-content {
  display: flex;
  align-items: center;
  white-space: nowrap;
  animation: tickerScroll linear infinite;
  will-change: transform;
}
.ticker-item {
  font-family: var(--font-mono);
  font-size: 16px;
  color: #fff;
  padding: 0 12px;
}
.ticker-sep {
  margin-right: 12px;
  opacity: 0.6;
  font-size: 8px;
}
@media (max-width: 767px) { .ticker-wrap { display: none; } }
</style>
