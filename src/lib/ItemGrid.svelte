<script lang="ts">
  import { cart, addToCart, removeFromCart, clearCart } from './cart.svelte.js';

  type InventoryItem = { id: string; fields: Record<string, any> };
  let { items = [] }: { items?: InventoryItem[] } = $props();

  // Modal state
  let modalOpen = $state(false);
  let modalItem = $state<InventoryItem | null>(null);

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
          <button class="w-9 h-9 flex items-center justify-center bg-[#67A4CF] text-white rounded-full hover:bg-[#BCE9D5] hover:text-[#232323] transition-colors duration-200 text-2xl font-bold shadow" title="Add to My List" onclick={(e) => { e.stopPropagation(); addToCart(item); }}>
            +
          </button>
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
          <span>{item.fields.Name}</span>
          <button class="ml-4 px-2 py-1 bg-[#BCE9D5] text-[#232323] rounded hover:bg-[#67A4CF] hover:text-white transition-colors duration-200 text-xs font-bold" onclick={() => removeFromCart(item.id)}>
            Remove
          </button>
        </li>
      {/each}
    </ul>
    <button class="mt-4 w-full px-4 py-2 bg-[#67A4CF] text-white rounded hover:bg-[#BCE9D5] hover:text-[#232323] transition-colors duration-200 font-bold" onclick={clearCart}>
      Clear My List
    </button>
  {:else}
    <div class="text-center text-[#BCE9D5] py-8">Your list is empty.</div>
  {/if}
</div>

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