<template>
  <div id="app-root">
    <AppNav />
    <TickerBanner />
    <main>
      <router-view v-slot="{ Component }">
        <transition name="page" mode="out-in">
          <component :is="Component" />
        </transition>
      </router-view>
    </main>
    <AppFooter />
    <ScrollTop />
  </div>
</template>

<script setup>
import AppNav from './components/AppNav.vue'
import TickerBanner from './components/TickerBanner.vue'
import AppFooter from './components/AppFooter.vue'
import ScrollTop from './components/ScrollTop.vue'
</script>

<style>
#app-root {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
}
main { flex: 1; }
</style>
