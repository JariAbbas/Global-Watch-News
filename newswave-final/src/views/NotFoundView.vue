<template>
  <div class="notfound-page">
    <div class="container notfound-content">
      <div class="notfound-code">404</div>
      <h1 class="notfound-title">Page Not Found</h1>
      <p class="notfound-desc">This page has been retracted, moved, or never existed. Our editors are as puzzled as you are.</p>
      <div class="notfound-actions">
        <router-link to="/" class="btn btn-primary">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="16"><path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>
          Back to Home
        </router-link>
        <router-link to="/search" class="btn btn-outline">🔍 Search News</router-link>
      </div>
    </div>
  </div>
</template>

<style scoped>
.notfound-page {
  min-height: 80vh;
  display: flex;
  align-items: center;
  justify-content: center;
}
.notfound-content { text-align: center; }
.notfound-code {
  font-family: var(--font-display);
  font-size: clamp(6rem, 15vw, 12rem);
  line-height: 1;
  color: var(--accent-red);
  opacity: 0.15;
  letter-spacing: 0.04em;
  margin-bottom: -20px;
}
.notfound-title {
  font-family: var(--font-headline);
  font-size: clamp(1.8rem, 4vw, 3rem);
  font-weight: 900;
  margin-bottom: 16px;
}
.notfound-desc {
  font-size: 1rem;
  color: var(--text-secondary);
  max-width: 440px;
  margin: 0 auto 32px;
  line-height: 1.7;
}
.notfound-actions { display: flex; gap: 14px; justify-content: center; flex-wrap: wrap; }
</style>
