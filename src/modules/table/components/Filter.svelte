<script lang="ts">
  import type { Column } from '../models/Column';
  import { filterStore } from '../store/filter-store.svelte';
  import type { StoreComponent } from '../../core/models/StoreComponent';

  interface FilterProps {
    column: Column;
    filterValue?: string;
  }

  /** Inputs */
  let { column, filterValue = $bindable<string>('') }: FilterProps = $props();

  /** Values */
  let filterStoreComponent: StoreComponent<string> = filterStore.add(column.key, filterValue);

  /** Effects */
  $effect(() => {
    filterStoreComponent?.setValue(filterValue);
  });
</script>

<div>
  <input type="text" placeholder="Filter..." bind:value={filterValue} />
</div>

<style>
  input {
    width: 100%;
    padding: 4px 4px 4px 4px;
  }
</style>
