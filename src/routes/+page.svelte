<script>
  import { onMount } from 'svelte';
  
  let mounted = false;
  
  onMount(() => mounted = true);
</script>

<div class="min-h-screen w-full bg-white flex items-center justify-center">
  <div class="w-full max-w-2xl mx-auto px-4 py-8 text-center {mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-5'} transition-all duration-700 ease-out">
    <img 
      src="/reglogo.jpg" 
      alt="Registry Theatre Logo" 
      class="w-full max-w-[300px] mx-auto mb-6"
    />
    <h2 class="text-3xl font-semibold text-gray-900 mb-8">Virtual Tech Sheet</h2>
    <div class="flex justify-center space-x-1 text-4xl font-bold text-gray-900">
      <span class="animate-bounce" style="animation-delay: 0ms;">C</span>
      <span class="animate-bounce" style="animation-delay: 100ms;">o</span>
      <span class="animate-bounce" style="animation-delay: 200ms;">m</span>
      <span class="animate-bounce" style="animation-delay: 300ms;">i</span>
      <span class="animate-bounce" style="animation-delay: 400ms;">n</span>
      <span class="animate-bounce" style="animation-delay: 500ms;">g</span>
      <span class="animate-bounce" style="animation-delay: 600ms;">&nbsp;</span>
      <span class="animate-bounce" style="animation-delay: 700ms;">S</span>
      <span class="animate-bounce" style="animation-delay: 800ms;">o</span>
      <span class="animate-bounce" style="animation-delay: 900ms;">o</span>
      <span class="animate-bounce" style="animation-delay: 1000ms;">n</span>
    </div>
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
</style>
