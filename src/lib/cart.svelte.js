// Shared rental cart state for Svelte 5
export const cart = $state([]);

// Cart item type: { id, fields, quantity, type, rate }

export function addToCart(item, quantity = 1, type = 'item', rate = null) {
  const existing = cart.find(i => i.id === item.id && i.type === type && (type === 'package' ? i.rate === rate : true));
  if (!existing) {
    cart.push({ ...item, quantity, type, rate });
  } else {
    existing.quantity += quantity;
  }
}

export function removeFromCart(itemId, type = 'item', rate = null) {
  const idx = cart.findIndex(i => i.id === itemId && i.type === type && (type === 'package' ? i.rate === rate : true));
  if (idx !== -1) {
    cart.splice(idx, 1);
  }
}

export function clearCart() {
  cart.length = 0;
}

// Estimated total (derived)
// export const estimatedTotal = $derived.by(() => {
//   return cart.reduce((total, item) => {
//     let price = 0;
//     if (item.type === 'item') {
//       price = Number(item.fields.Price || 0);
//     } else if (item.type === 'package') {
//       if (item.rate === 'Day') price = Number(item.fields['Day Rate'] || 0);
//       if (item.rate === '2-Day') price = Number(item.fields['2-Day Rate'] || 0);
//       if (item.rate === 'Week') price = Number(item.fields['Weekly Rate'] || 0);
//     }
//     return total + price * (item.quantity || 1);
//   }, 0);
// });

export function getEstimatedTotal() {
  return cart.reduce((total, item) => {
    let price = 0;
    if (item.type === 'item') {
      price = Number(item.fields.Price || 0);
    } else if (item.type === 'package') {
      if (item.rate === 'Day') price = Number(item.fields['Day Rate'] || 0);
      if (item.rate === '2-Day') price = Number(item.fields['2-Day Rate'] || 0);
      if (item.rate === 'Week') price = Number(item.fields['Weekly Rate'] || 0);
    }
    return total + price * (item.quantity || 1);
  }, 0);
} 