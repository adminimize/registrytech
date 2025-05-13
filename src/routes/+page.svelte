<script lang="ts">
  import { onMount } from 'svelte';
  import { marked } from 'marked';
  import ItemGrid from '../lib/ItemGrid.svelte';
  import { cart, addToCart, getEstimatedTotal } from '../lib/cart.svelte.js';
  
  type PageData = {
    sections: Array<{ id: string; name: string; fields: Record<string, any> }>;
    packages?: Array<{ id: string; fields: Record<string, any> }>;
    inventory?: Array<{ id: string; name: string; photo?: any; fields: Record<string, any> }>;
    error?: string;
  };
  
  let { data }: { data: PageData } = $props();
  
  let mounted = false;
  let sections = data.sections || [];
  let packages = data.packages || [];
  let inventory = data.inventory || [];
  let packageModalOpen = $state(false);
  let selectedPackage = $state<any | null>(null);
  let selectedRate = $state<string>('Day');
  let packageQuantity = $state(1);
  
  onMount(() => {
    mounted = true;
  });

  // Function to safely render markdown
  function renderMarkdown(text: string) {
    if (!text) return '';
    return marked(text);
  }

  function openPackageModal(pkg: any) {
    selectedPackage = pkg;
    selectedRate = 'Day';
    packageQuantity = 1;
    packageModalOpen = true;
  }
  function closePackageModal() {
    packageModalOpen = false;
    selectedPackage = null;
  }
  function confirmPackage() {
    addToCart(selectedPackage, packageQuantity, 'package', selectedRate as any);
    closePackageModal();
  }
</script>

<div class="w-full flex flex-col items-start justify-start">
  <div class="flex items-center w-full mb-8">
    <img 
      src="/registry_logo.png" 
      alt="Registry Theatre Logo" 
      class="w-20 h-20 object-contain mr-4 ml-2 rounded-xl"
    />
    <h1 class="text-3xl md:text-4xl font-bold bg-gradient-to-r from-[#BCE9D5] to-[#67A4CF] bg-clip-text text-transparent">
      Virtual Tech Sheet
    </h1>
  </div>
  
  {#if sections.length > 0}
    <div class="grid grid-cols-1 md:grid-cols-2 gap-6 w-full mb-8">
      {#each sections as section}
        {#if section.fields.Name}
          <div class="bg-[#1B1919] border border-[#333] rounded-[1.5rem] p-6 hover:border-[#BCE9D5] transition-colors duration-300">
            <h2 class="text-2xl md:text-3xl font-bold mb-4 text-[#BCE9D5]">
              {section.fields.Name}
            </h2>
            {#if section.fields.Text}
              <div 
                class="prose prose-invert max-w-none prose-p:text-[#F6F6F6] prose-headings:text-[#BCE9D5]">
                {@html renderMarkdown(section.fields.Text)}
              </div>
            {/if}
          </div>
        {/if}
      {/each}
    </div>
  {/if}

  {#if packages.length > 0}
    <h2 class="text-3xl font-bold mb-6 text-[#BCE9D5]">Packages</h2>
    <div class="grid grid-cols-1 md:grid-cols-2 gap-6 w-full mb-8">
      {#each packages as pkg}
        <div class="bg-[#232323] border border-[#444] rounded-2xl p-6 flex flex-col shadow hover:border-[#BCE9D5] transition-colors duration-300">
          <div class="flex items-center justify-between mb-2">
            <h3 class="text-xl font-bold text-[#BCE9D5]">{pkg.fields.Name}</h3>
            <div class="text-sm text-[#BCE9D5]">{(pkg.fields.Category || []).join(', ')}</div>
          </div>
          <div class="flex flex-wrap gap-4 mb-2">
            {#if pkg.fields['Day Rate']}
              <span class="bg-[#BCE9D5] text-[#232323] rounded px-2 py-1 text-xs font-bold">Day: ${pkg.fields['Day Rate']}</span>
            {/if}
            {#if pkg.fields['2-Day Rate']}
              <span class="bg-[#BCE9D5] text-[#232323] rounded px-2 py-1 text-xs font-bold">2-Day: ${pkg.fields['2-Day Rate']}</span>
            {/if}
            {#if pkg.fields['Weekly Rate']}
              <span class="bg-[#BCE9D5] text-[#232323] rounded px-2 py-1 text-xs font-bold">Week: ${pkg.fields['Weekly Rate']}</span>
            {/if}
          </div>
          {#if pkg.fields.Description}
            <div class="text-white text-sm mb-2 whitespace-pre-line">{pkg.fields.Description}</div>
          {/if}
          {#if pkg.fields.Notes}
            <div class="text-[#BCE9D5] text-xs italic whitespace-pre-line">{pkg.fields.Notes}</div>
          {/if}
          <button class="mt-4 px-4 py-2 bg-[#67A4CF] text-white rounded hover:bg-[#BCE9D5] hover:text-[#232323] transition-colors duration-200 font-bold" onclick={() => openPackageModal(pkg)}>
            Add to My List
          </button>
        </div>
      {/each}
    </div>
  {/if}

  {#if inventory.length > 0}
    <div class="mt-6">
      <h2 class="text-3xl font-bold mb-8 text-center text-[#BCE9D5]">Inventory</h2>
      <ItemGrid items={inventory} />
    </div>
  {/if}
</div>

<!-- Floating Help Button -->
<a href="mailto:atd@registrytheatre.com,operations@registrytheatre.com?subject=Tech%20Question" target="_blank"
  class="fixed bottom-6 left-6 z-50 bg-[#67A4CF] text-white rounded-full shadow-lg w-14 h-14 flex items-center justify-center text-2xl font-bold hover:bg-[#BCE9D5] hover:text-[#232323] transition-colors duration-200"
  title="Email for Tech Help">
  ?
</a>

<!-- Package Modal -->
{#if packageModalOpen && selectedPackage}
  <div class="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
    <div class="bg-[#232323] border border-[#BCE9D5] rounded-xl shadow-xl p-6 w-80 flex flex-col items-center">
      <div class="text-lg font-bold text-[#BCE9D5] mb-2">Select Rate & Quantity</div>
      <div class="mb-2 text-white">{selectedPackage && selectedPackage.fields ? selectedPackage.fields.Name : ''}</div>
      <div class="mb-4 flex gap-2">
        <button class={`px-3 py-1 rounded border font-bold text-xs transition-colors duration-200 ${selectedRate === 'Day' ? 'bg-[#67A4CF] text-white border-[#67A4CF]' : 'bg-[#232323] text-[#BCE9D5] border-[#BCE9D5]'}`} onclick={() => selectedRate = 'Day'}>Day</button>
        <button class={`px-3 py-1 rounded border font-bold text-xs transition-colors duration-200 ${selectedRate === '2-Day' ? 'bg-[#67A4CF] text-white border-[#67A4CF]' : 'bg-[#232323] text-[#BCE9D5] border-[#BCE9D5]'}`} onclick={() => selectedRate = '2-Day'}>2-Day</button>
        <button class={`px-3 py-1 rounded border font-bold text-xs transition-colors duration-200 ${selectedRate === 'Week' ? 'bg-[#67A4CF] text-white border-[#67A4CF]' : 'bg-[#232323] text-[#BCE9D5] border-[#BCE9D5]'}`} onclick={() => selectedRate = 'Week'}>Week</button>
      </div>
      <input type="number" min="1" class="w-20 px-2 py-1 rounded border border-[#BCE9D5] text-center mb-4" bind:value={packageQuantity} />
      <div class="flex gap-2 w-full">
        <button class="flex-1 px-3 py-1 bg-[#67A4CF] text-white rounded hover:bg-[#BCE9D5] hover:text-[#232323] font-bold" onclick={confirmPackage}>Add</button>
        <button class="flex-1 px-3 py-1 bg-[#232323] border border-[#BCE9D5] text-[#BCE9D5] rounded hover:bg-[#BCE9D5] hover:text-[#232323] font-bold" onclick={closePackageModal}>Cancel</button>
      </div>
    </div>
  </div>
{/if}

<style>
  :global(body) {
    margin: 0;
    padding: 0;
    width: 100%;
    overflow-x: hidden;
  }

  :global(html) {
    overflow-x: hidden;
  }

  @media (max-width: 768px) {
    /* No unused selectors here */
  }

  :global(.prose) {
    @apply text-[#F6F6F6];
  }
  
  :global(.prose strong) {
    @apply text-[#BCE9D5];
  }
  
  :global(.prose a) {
    @apply text-[#67A4CF] hover:text-[#BCE9D5] transition-colors duration-300;
  }
</style>
