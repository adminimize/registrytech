<script lang="ts">
  import { onMount } from 'svelte';
  import { marked } from 'marked';
  
  // Define the type for the data prop
  type PageData = {
    sections: Array<{
      id: string;
      name: string;
      fields: Record<string, any>;
    }>;
    error?: string;
  };
  
  export let data: PageData = { sections: [] };
  
  let mounted = false;
  let sections = data.sections || [];
  
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
    {:else}
      <div class="flex justify-center space-x-1 text-4xl font-bold">
        <span class="animate-bounce text-[#BCE9D5]" style="animation-delay: 0ms;">C</span>
        <span class="animate-bounce text-[#67A4CF]" style="animation-delay: 100ms;">o</span>
        <span class="animate-bounce text-[#BCE9D5]" style="animation-delay: 200ms;">m</span>
        <span class="animate-bounce text-[#67A4CF]" style="animation-delay: 300ms;">i</span>
        <span class="animate-bounce text-[#BCE9D5]" style="animation-delay: 400ms;">n</span>
        <span class="animate-bounce text-[#67A4CF]" style="animation-delay: 500ms;">g</span>
        <span class="animate-bounce" style="animation-delay: 600ms;">&nbsp;</span>
        <span class="animate-bounce text-[#BCE9D5]" style="animation-delay: 700ms;">S</span>
        <span class="animate-bounce text-[#67A4CF]" style="animation-delay: 800ms;">o</span>
        <span class="animate-bounce text-[#BCE9D5]" style="animation-delay: 900ms;">o</span>
        <span class="animate-bounce text-[#67A4CF]" style="animation-delay: 1000ms;">n</span>
      </div>
    {/if}
  </div>
</div>

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

  .container {
    min-height: 100vh;
    width: 100vw;
    display: flex;
    align-items: center;
    justify-content: center;
    background: white;
    color: #1a1a1a;
    font-family: system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
  }

  .content {
    text-align: center;
    opacity: 0;
    transform: translateY(20px);
    transition: all 0.8s cubic-bezier(0.16, 1, 0.3, 1);
    width: 100%;
    max-width: 800px;
    padding: 2rem;
  }

  .mounted {
    opacity: 1;
    transform: translateY(0);
  }

  .logo {
    width: 100%;
    max-width: 400px;
    height: auto;
    margin-bottom: 1.5rem;
  }

  .subtitle {
    font-size: 2rem;
    font-weight: 600;
    margin: 0 0 2rem;
    color: #1a1a1a;
  }

  .coming-soon {
    font-size: 3rem;
    font-weight: 700;
    display: flex;
    gap: 0.2rem;
    justify-content: center;
    margin-top: 2rem;
    color: #1a1a1a;
  }

  .coming-soon span {
    display: inline-block;
    animation: bounce 1s infinite;
    animation-delay: calc(var(--i) * 0.1s);
  }

  @keyframes bounce {
    0%, 100% {
      transform: translateY(0);
    }
    50% {
      transform: translateY(-10px);
    }
  }

  @media (max-width: 768px) {
    .logo {
      max-width: 80%;
    }
    
    .subtitle {
      font-size: 1.5rem;
    }
    
    .coming-soon {
      font-size: 2rem;
    }
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
