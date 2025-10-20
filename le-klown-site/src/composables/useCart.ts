// src/composables/useCart.ts
import { reactive, computed } from 'vue'

export interface CartPackSelection {
  productId: string
  productName: string
  size?: string | null
  color?: string | null
  quantity: number
}

export interface CartItem {
  type?: 'product' | 'pack'
  productId?: string
  packId?: string
  variantId: string
  name: string
  price: number
  quantity: number
  image?: string
  selectedOptions?: CartOption[]
  packItems?: CartPackSelection[]
  stockStatus?: 'inStock' | 'lowStock' | 'outOfStock'
}

export interface CartOption {
  optionId: string
  optionLabel: string
  valueLabel: string
}

const state = reactive<{ items: CartItem[] }>({ items: [] })

function findIndex(variantId: string) {
  return state.items.findIndex(i => i.variantId === variantId)
}

export function useCart() {
  const items = computed(() => state.items)

  function addItem(item: CartItem) {
    const idx = findIndex(item.variantId)
    if (idx >= 0) {
      state.items[idx].quantity += item.quantity
    } else {
      state.items.push({ ...item })
    }
  }

  function removeItem(variantId: string) {
    const idx = findIndex(variantId)
    if (idx >= 0) state.items.splice(idx, 1)
  }

  function updateQuantity(variantId: string, quantity: number) {
    const idx = findIndex(variantId)
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
