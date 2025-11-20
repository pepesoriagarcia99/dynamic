<script lang="ts">
  import type { Column } from '../../models/Column';
  import { filterStore } from '../../store/filter-store.svelte';
  import type { StoreComponent } from '../../../core/models/StoreComponent';

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

  /** Methods */
  function keydownHandler(event: KeyboardEvent) {
    if (event.key === 'Enter') {
      onEnter();
    }
  }

  function onEnter() {
    filterStoreComponent?.setValue(filterValue);
  }
</script>

<div class="filter-container" part="filter-container">
  <input class="filter-input" part="filter-input" type="text" placeholder="Filter..." bind:value={filterValue} onkeydown={keydownHandler} />
</div>

<style>
  .filter-container {
    width: 100%;
  }

  .filter-input {
    width: 100%;
  }
</style>
