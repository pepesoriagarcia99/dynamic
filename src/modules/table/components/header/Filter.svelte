<script lang="ts">
  import type { Column } from '../../models/Column';
  import type { StoreComponent, StoreComponentData } from '../../../core/models/StoreComponent';

  import { filterStore } from '../../store/filter-store';
  import { loadingState } from '../../store/loading-state';
  import Skeleton from '../Skeleton.svelte';

  interface FilterProps {
    column: Column;
    filterValue?: string;
  }

  /** Inputs */
  let { column, filterValue = $bindable<string>('') }: FilterProps = $props();

  /** States */
  const partNamesContainer: string = $derived(`filter-container filter-container-${column.key}`);
  const partNamesInput: string = $derived(`filter-input filter-input-${column.key}`);
  let loading = $state(false);

  /** Values */
  const filterStoreComponent: StoreComponent<string> = filterStore.add(column.key, filterValue);
  filterStoreComponent.subscribe((change: StoreComponentData<string>) => {
    filterValue = change.value ?? '';
  });

  loadingState.subscribe((state) => {
    loading = state;
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

<div class={partNamesContainer} part={partNamesContainer}>
  {#if loading === true}
    <Skeleton />
  {:else}
    <input
      id="filter-input-{column.key}"
      class={partNamesInput}
      part={partNamesInput}
      type="text"
      bind:value={filterValue}
      onkeydown={keydownHandler}
      disabled={loading}
    />
  {/if}
</div>

<style>
  .header-filter-container {
    width: 100%;
    margin: 12px 12px 12px 12px;
    /* padding: 4px 4px 4px 4px; */
  }

  .header-filter-input {
    width: 100%;
  }

  .filter-input {
    width: 100%;
    /* margin: 4px 4px 4px 4px; */
    /* padding: 4px 4px 4px 4px; */
  }
</style>
