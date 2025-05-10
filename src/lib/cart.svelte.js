// Shared rental cart state for Svelte 5
export const cart = $state([]);

export function addToCart(item) {
  if (!cart.find(i => i.id === item.id)) {
    cart.push(item);
  }
}

export function removeFromCart(itemId) {
  const idx = cart.findIndex(i => i.id === itemId);
  if (idx !== -1) {
    cart.splice(idx, 1);
  }
}

export function clearCart() {
  cart.length = 0;
} 