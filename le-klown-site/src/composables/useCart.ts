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

export function useCart() {
  const items = computed(() => state.items)

  function addItem(item: CartItem) {
    // si même produit+taille déjà présent, on incrémente la quantité
    const existing = state.items.find(
      i => i.productId === item.productId && i.size === item.size
    )
    if (existing) {
      existing.quantity += item.quantity
    } else {
      state.items.push({ ...item })
    }
  }

  function removeItem(index: number) {
    state.items.splice(index, 1)
  }

  function clearCart() {
    state.items = []
  }

  const total = computed(() =>
    state.items.reduce((sum, i) => sum + i.price * i.quantity, 0)
  )

  return {
    items,
    total,
    addItem,
    removeItem,
    clearCart,
  }
}
