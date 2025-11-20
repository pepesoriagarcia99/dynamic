<script lang="ts">
  import { onMount } from 'svelte';
  import type { Column } from '../../models/Column';
  import { sortStore, type SortOrder } from '../../store/sort-store.svelte';
  import type { StoreComponent } from '../../../core/models/StoreComponent';

  interface FilterProps {
    column: Column;
  }

  /** Inputs */
  let { column }: FilterProps = $props();
  console.log(column);

  /** Values */
  let sortDirection = $state<SortOrder | null>(null);
  let sortStoreComponent: StoreComponent<SortOrder> = sortStore.add(column.key, null);

  /** Methods */
  onMount(() => {
    sortStoreComponent.subscribe((event) => {
      sortDirection = event.value ?? null;
    });
  });

  function toggleSort() {
    sortStore.onSortToggle(column.key);
  }
</script>

<button
  onclick={toggleSort}
  style="display:flex;align-items:center;gap:4px;background:none;border:none;cursor:pointer;padding:2px;"
>
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
    {#if sortDirection === 'asc'}
      <path d="M12 5l-7 7h14l-7-7Z" />
    {:else if sortDirection === 'desc'}
      <path d="M12 19l7-7H5l7 7Z" />
    {:else}
      <path d="M12 5l-7 7h14l-7-7Z" opacity="0.4" />
      <path d="M12 19l7-7H5l7 7Z" opacity="0.4" />
    {/if}
  </svg>
</button>

<style>
  button:hover svg {
    color: var(--accent, #555);
  }
</style>
