<script lang="ts">
  import { cart, addToCart, removeFromCart, clearCart, getEstimatedTotal } from './cart.svelte.js';

  type InventoryItem = { id: string; fields: Record<string, any> };
  let { items = [] }: { items?: InventoryItem[] } = $props();

  // Modal state
  let modalOpen = $state(false);
  let modalItem = $state<InventoryItem | null>(null);
  let quantityModalOpen = $state(false);
  let quantityValue = $state(1);

  // Group items by first category (or 'Uncategorized')
  const grouped = $derived.by((): Record<string, InventoryItem[]> => {
    return items.reduce((acc, item) => {
      const cats = item.fields.Category || [];
      const cat = cats.length > 0 ? cats[0] : 'Uncategorized';
      if (!acc[cat]) acc[cat] = [];
      acc[cat].push(item);
      return acc;
    }, {} as Record<string, InventoryItem[]>);
  });

  function openModal(item: InventoryItem) {
    modalItem = item;
    modalOpen = true;
  }
  function closeModal() {
    modalOpen = false;
    modalItem = null;
  }

  function openQuantityModal(item: InventoryItem) {
    modalItem = item;
    quantityValue = 1;
    quantityModalOpen = true;
  }
  function closeQuantityModal() {
    quantityModalOpen = false;
    modalItem = null;
  }
  function confirmQuantity() {
    addToCart(modalItem, quantityValue, 'item');
    closeQuantityModal();
  }

  // Generate mailto link for cart using $derived
  const mailtoBody = $derived.by(() =>
    cart.length > 0
      ? encodeURIComponent(
          'Rental Request List:\n' +
          cart.map((item, idx) => {
            let price = 0;
            if (item.type === 'item') price = Number(item.fields.Price || 0);
            if (item.type === 'package') {
              if (item.rate === 'Day') price = Number(item.fields['Day Rate'] || 0);
              if (item.rate === '2-Day') price = Number(item.fields['2-Day Rate'] || 0);
              if (item.rate === 'Week') price = Number(item.fields['Weekly Rate'] || 0);
            }
            return `${idx + 1}. ${item.fields.Name || 'Unnamed'}${item.quantity ? ` (Qty: ${item.quantity})` : ''}${item.type === 'package' && item.rate ? ` [${item.rate}]` : ''}${price ? ` - $${price * (item.quantity || 1)}` : ''}`;
          }).join('\n') +
          `\n\nEstimated Total: $${getEstimatedTotal()}`
        )
      : ''
  );
  const mailtoHref = $derived.by(() =>
    `mailto:atd@registrytheatre.com,operations@registrytheatre.com?subject=Tech%20Rental%20Request&body=${mailtoBody}`
  );
</script>

{#if items.length > 0}
  {#each Object.entries(grouped) as [cat, group]}
    <h3 class="text-2xl font-bold mb-4 mt-12 text-white">{cat}</h3>
    <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
      {#each group as item}
        <div class="bg-[#232323] border border-[#444] rounded-xl p-4 min-w-[220px] flex flex-col items-center shadow hover:border-white transition-colors duration-300 cursor-pointer" onclick={() => openModal(item)}>
          {#if item.fields.Photo && item.fields.Photo.length > 0}
            <img src={item.fields.Photo[0].url} alt={item.fields.Name} class="w-full h-40 object-cover rounded-lg mb-4 bg-[#111]" />
          {:else}
            <div class="w-full h-40 flex items-center justify-center rounded-lg mb-4 bg-[#111] text-white text-2xl">No Photo</div>
          {/if}
          <div class="text-lg font-semibold text-white text-center mb-2">{item.fields.Name}</div>
          {#if item.fields.Price}
            <div class="text-white text-xs mb-2">${item.fields.Price} each</div>
          {/if}
          {#if item.fields.Quantity && item.fields.Quantity > 1}
            <button class="w-9 h-9 flex items-center justify-center bg-[#67A4CF] text-white rounded-full hover:bg-[#BCE9D5] hover:text-[#232323] transition-colors duration-200 text-2xl font-bold shadow" title="Add to My List" onclick={(e) => { e.stopPropagation(); openQuantityModal(item); }}>
              +
            </button>
          {:else}
            <button class="w-9 h-9 flex items-center justify-center bg-[#67A4CF] text-white rounded-full hover:bg-[#BCE9D5] hover:text-[#232323] transition-colors duration-200 text-2xl font-bold shadow" title="Add to My List" onclick={(e) => { e.stopPropagation(); addToCart(item, 1, 'item'); }}>
              +
            </button>
          {/if}
        </div>
      {/each}
    </div>
  {/each}
{:else}
  <div class="text-center text-white">No items found.</div>
{/if}

<!-- Floating Cart (My List) -->
<div class="fixed bottom-6 right-6 z-50 w-80 max-w-[90vw] bg-[#232323] border border-[#444] rounded-2xl shadow-2xl p-6">
  <h3 class="text-2xl font-bold mb-4 text-[#BCE9D5]">My List</h3>
  {#if cart.length > 0}
    <ul class="max-h-64 overflow-y-auto pr-2">
      {#each cart as item}
        <li class="mb-2 text-white flex items-center justify-between">
          <span>{item.fields.Name} {item.quantity > 1 ? `(x${item.quantity})` : ''} {item.type === 'package' && item.rate ? `[${item.rate}]` : ''}
            {#if item.type === 'item' && item.fields.Price}
              <span class="ml-2 text-xs text-[#BCE9D5]">${item.fields.Price * (item.quantity || 1)}</span>
            {/if}
            {#if item.type === 'package'}
              <span class="ml-2 text-xs text-[#BCE9D5]">
                {item.rate === 'Day' ? `$${item.fields['Day Rate'] * (item.quantity || 1)}` : ''}
                {item.rate === '2-Day' ? `$${item.fields['2-Day Rate'] * (item.quantity || 1)}` : ''}
                {item.rate === 'Week' ? `$${item.fields['Weekly Rate'] * (item.quantity || 1)}` : ''}
              </span>
            {/if}
          </span>
          <button class="ml-4 px-2 py-1 bg-[#BCE9D5] text-[#232323] rounded hover:bg-[#67A4CF] hover:text-white transition-colors duration-200 text-xs font-bold" onclick={() => removeFromCart(item.id, item.type, item.rate)}>
            Remove
          </button>
        </li>
      {/each}
    </ul>
    <div class="mt-2 text-right text-[#BCE9D5] font-bold">Estimated Total: ${getEstimatedTotal()}</div>
    <a class="mt-4 w-full px-4 py-2 bg-[#67A4CF] text-white rounded hover:bg-[#BCE9D5] hover:text-[#232323] transition-colors duration-200 font-bold flex items-center justify-center text-center" href={mailtoHref} target="_blank" rel="noopener noreferrer">
      Send My List
    </a>
    <button class="mt-2 w-full px-4 py-2 bg-[#232323] border border-[#BCE9D5] text-[#BCE9D5] rounded hover:bg-[#BCE9D5] hover:text-[#232323] transition-colors duration-200 font-bold" onclick={clearCart}>
      Clear My List
    </button>
  {:else}
    <div class="text-center text-[#BCE9D5] py-8">Your list is empty.</div>
  {/if}
</div>

<!-- Quantity Modal -->
{#if quantityModalOpen && modalItem}
  <div class="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
    <div class="bg-[#232323] border border-[#BCE9D5] rounded-xl shadow-xl p-6 w-72 flex flex-col items-center">
      <div class="text-lg font-bold text-[#BCE9D5] mb-2">Select Quantity</div>
      <div class="mb-4 text-white">{modalItem.fields.Name}</div>
      <input type="number" min="1" max={modalItem.fields.Quantity} class="w-20 px-2 py-1 rounded border border-[#BCE9D5] text-center mb-4" bind:value={quantityValue} />
      <div class="flex gap-2 w-full">
        <button class="flex-1 px-3 py-1 bg-[#67A4CF] text-white rounded hover:bg-[#BCE9D5] hover:text-[#232323] font-bold" onclick={confirmQuantity}>Add</button>
        <button class="flex-1 px-3 py-1 bg-[#232323] border border-[#BCE9D5] text-[#BCE9D5] rounded hover:bg-[#BCE9D5] hover:text-[#232323] font-bold" onclick={closeQuantityModal}>Cancel</button>
      </div>
    </div>
  </div>
{/if}

<!-- Modal for item details -->
{#if modalOpen && modalItem}
  <div class="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-60">
    <div class="bg-[#232323] border border-[#444] rounded-2xl shadow-2xl p-8 max-w-lg w-full relative">
      <button class="absolute top-4 right-4 text-2xl text-[#BCE9D5] hover:text-[#67A4CF]" onclick={closeModal} title="Close">&times;</button>
      <div class="flex flex-col items-center">
        {#if modalItem.fields.Photo && modalItem.fields.Photo.length > 0}
          <img src={modalItem.fields.Photo[0].url} alt={modalItem.fields.Name} class="w-full max-w-xs h-48 object-cover rounded-lg mb-4 bg-[#111]" />
        {/if}
        <h2 class="text-2xl font-bold text-[#BCE9D5] mb-2">{modalItem.fields.Name}</h2>
        <div class="text-[#BCE9D5] mb-2 text-sm">{(modalItem.fields.Category || []).join(', ')}</div>
        <div class="text-white mb-2 text-sm">Make: {modalItem.fields.Make || '-'}</div>
        <div class="text-white mb-2 text-sm">Model: {modalItem.fields.Model || '-'}</div>
        <div class="text-white mb-2 text-sm">Serial #: {modalItem.fields['Serial Number'] || '-'}</div>
        {#if modalItem.fields.Description}
          <div class="text-white mt-4 whitespace-pre-line">{modalItem.fields.Description}</div>
        {/if}
      </div>
    </div>
  </div>
{/if} 