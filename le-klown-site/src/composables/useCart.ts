// src/composables/useCart.ts
import { reactive, computed } from 'vue'

export interface CartItem {
  productId: string
  name: string
  price: number
  size?: string
  quantity: number
  image?: string
}

const state = reactive<{ items: CartItem[] }>({ items: [] })

function findIndex(productId: string, size?: string) {
  return state.items.findIndex(i => i.productId === productId && i.size === size)
}

export function useCart() {
  const items = computed(() => state.items)

  function addItem(item: CartItem) {
    const idx = findIndex(item.productId, item.size)
    if (idx >= 0) {
      state.items[idx].quantity += item.quantity
    } else {
      state.items.push({ ...item })
    }
  }

  function removeItem(productId: string, size?: string) {
    const idx = findIndex(productId, size)
    if (idx >= 0) state.items.splice(idx, 1)
  }

  function updateQuantity(productId: string, size: string | undefined, quantity: number) {
    const idx = findIndex(productId, size)
    if (idx >= 0) state.items[idx].quantity = quantity
  }

  function clearCart() {
    state.items.splice(0)
  }

  const total = computed(() =>
    state.items.reduce((sum, i) => sum + i.price * i.quantity, 0)
  )

  return { items, total, addItem, removeItem, clearCart, updateQuantity }
}
