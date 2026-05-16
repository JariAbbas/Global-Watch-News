import { ref } from 'vue'

export const isGlobalLoading = ref(false)

export function setGlobalLoading(status) {
  isGlobalLoading.value = status
}