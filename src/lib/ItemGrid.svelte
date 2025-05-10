<script lang="ts">
  export let items: Array<{
    id: string;
    name: string;
    photo?: any;
    fields: Record<string, any>;
  }> = [];
</script>

{#if items.length > 0}
  <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
    {#each items as item}
      <div class="bg-[#232323] border border-[#333] rounded-xl p-4 flex flex-col items-center shadow hover:border-[#67A4CF] transition-colors duration-300">
        {#if item.photo && item.photo.length > 0}
          <img src={item.photo[0].url} alt={item.name} class="w-full h-40 object-cover rounded-lg mb-4 bg-[#111]" />
        {:else}
          <div class="w-full h-40 flex items-center justify-center rounded-lg mb-4 bg-[#111] text-[#BCE9D5] text-2xl">No Photo</div>
        {/if}
        <div class="text-lg font-semibold text-[#BCE9D5] text-center">{item.name}</div>
      </div>
    {/each}
  </div>
{:else}
  <div class="text-center text-[#BCE9D5]">No items found.</div>
{/if} 