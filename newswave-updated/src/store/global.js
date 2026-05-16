// src/stores/global.js
import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useGlobalStore = defineStore('global', () => {
  const isGlobalLoading = ref(false)
  
  function setLoading(status) {
    isGlobalLoading.value = status
  }

  return { isGlobalLoading, setLoading }
})