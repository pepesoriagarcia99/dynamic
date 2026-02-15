<script lang="ts">
  interface MenuItem {
    key: string;
    label: string;
  }

  interface Props {
    items?: MenuItem[];
    onSelect?: (element: any) => void;
  }

  let { items = [], onSelect }: Props = $props();
  let activeKey = $state('');

  function handleClick(item: any) {
    activeKey = item.key;
    onSelect?.(item);
  }
</script>

<aside
  class="fixed left-0 top-0 h-screen w-28 bg-gray-100 text-gray-700 flex flex-col shadow-md z-50 border-r border-gray-200"
>
  <nav class="flex-1 overflow-y-auto flex flex-col gap-1 py-2 px-1.5">
    {#each items as item (item.key)}
      <button
        class="w-full py-1.5 px-2 rounded text-xs font-medium text-left transition-colors cursor-pointer
          {activeKey === item.key ? 'bg-blue-500 text-white' : 'text-gray-600 hover:bg-gray-200 hover:text-gray-900'}"
        onclick={() => handleClick(item)}
      >
        {item.label}
      </button>
    {/each}
  </nav>
</aside>

<style>
</style>
