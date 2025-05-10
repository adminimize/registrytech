<script lang="ts">
  import { onMount } from 'svelte';
  import { marked } from 'marked';
  import ItemGrid from '../lib/ItemGrid.svelte';
  
  // Define the type for the data prop
  type PageData = {
    sections: Array<{
      id: string;
      name: string;
      fields: Record<string, any>;
    }>;
    inventory?: Array<{
      id: string;
      name: string;
      photo?: any;
      fields: Record<string, any>;
    }>;
    error?: string;
  };
  
  export let data: PageData = { sections: [] };
  
  let mounted = false;
  let sections = data.sections || [];
  let inventory = data.inventory || [];
  
  onMount(() => {
    mounted = true;
  });

  // Function to safely render markdown
  function renderMarkdown(text: string) {
    if (!text) return '';
    return marked(text);
  }
</script>

<div class="min-h-screen w-full flex items-center justify-center">
  <div class="w-full transition-all duration-700 ease-out {mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-5'}">
    <div class="text-center mb-12">
      <img 
        src="/registry_logo.png" 
        alt="Registry Theatre Logo" 
        class="w-full max-w-[300px] mx-auto mb-6 rounded-2xl"
      />
      <h1 class="text-4xl md:text-5xl font-bold bg-gradient-to-r from-[#BCE9D5] to-[#67A4CF] bg-clip-text text-transparent">
        Virtual Tech Sheet
      </h1>
    </div>
    
    {#if sections.length > 0}
      <div class="space-y-6">
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
  </div>
</div>

<!-- Inventory Product Grid -->
{#if inventory.length > 0}
  <div class="mt-16">
    <h2 class="text-3xl font-bold mb-8 text-center text-[#BCE9D5]">Inventory</h2>
    <ItemGrid items={inventory} />
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
