<script lang="ts">
  import type { Column } from '../../models/Column';
  import { filterStore } from '../../store/filter-store.svelte';
  import type { StoreComponent, StoreComponentData } from '../../../core/models/StoreComponent';

  interface FilterProps {
    column: Column;
    filterValue?: string;
  }

  /** Inputs */
  let { column, filterValue = $bindable<string>('') }: FilterProps = $props();

  /** Values */
  let filterStoreComponent: StoreComponent<string> = filterStore.add(column.key, filterValue);
  filterStoreComponent.subscribe((change: StoreComponentData<string>) => {
    filterValue = change.value ?? ''
  });

  /** Effects */
  const partNamesContainer: string = $derived(`filter-container filter-container-${column.key}`);
  const partNamesInput: string = $derived(`filter-input filter-input-${column.key}`);

  // $effect(() => {
  //   filterStoreComponent?.setValue(filterValue);
  // });

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

<div class={partNamesContainer} part={partNamesContainer}>
  <input
    class={partNamesInput}
    part={partNamesInput}
    type="text"
    placeholder="Filter..."
    bind:value={filterValue}
    onkeydown={keydownHandler}
  />
</div>

<style>
  .header-filter-container {
    width: 100%;
  }

  .header-filter-input {
    width: 100%;
  }
</style>
