<script lang="ts">
  import { onMount } from 'svelte';
  import type { Column } from '../models/Column';
  // import { filterStore } from '../store/filter-store.svelte';

  interface FilterProps {
    column: Column;
    filterValue?: string;
  }

  /** Inputs */
  let { column, filterValue = $bindable<string>('') }: FilterProps = $props();

  $effect(() => {
    console.log('Filter change COLUMN:', column, 'VALUE:', filterValue);
  });

  /** Methods */
  onMount(() => {
    // filterStore.subscribe(column, (filters) => { });
  });
</script>

<div>
  <input type="text" placeholder="Filter..." bind:value={filterValue} />
</div>

<style>
</style>
