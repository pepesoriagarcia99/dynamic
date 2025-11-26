<script lang="ts">
  import type { Column } from '../../models/Column';
  // import type { StoreComponent, StoreComponentData } from '../../../core/models/StoreComponent';

  // import { filterStore } from '../../store/filter-store';
  import { loadingState } from '../../store/loading-state';
  import Skeleton from '../Skeleton.svelte';
  import BasicControl from '../../../controls/components/BasicControl.svelte';

  interface FilterProps {
    columns: Column[];
    filterValue?: string;
  }

  /** Inputs */
  let { columns }: FilterProps = $props();

  /** States */
  // const partNamesContainer: string = $derived(`filter-container filter-container-${column.key}`);
  // const partNamesInput: string = $derived(`filter-input filter-input-${column.key}`);
  let loading = $state(false);

  /** Values */
  // const filterStoreComponent: StoreComponent<string> = filterStore.add(column.key, filterValue);
  // filterStoreComponent.subscribe((change: StoreComponentData<string>) => {
  //   filterValue = change.value ?? '';
  // });

  loadingState.subscribe((state) => {
    loading = state;
  });

  /** Methods */
  // function keydownHandler(event: KeyboardEvent) {
  //   if (event.key === 'Enter') {
  //     onEnter();
  //   }
  // }

  // function onEnter() {
  //   filterStoreComponent?.setValue(filterValue);
  // }
</script>

<tr class="filter-thead-tr" part="filter-thead-tr">
  {#each columns as column}
    <th class="column-filter-th column-filter-th-{column.key}" part="column-filter-th column-filter-th-{column.key}">
      {#if loading === true}
        <Skeleton />
      {:else}
        <BasicControl />

        <!-- <input
      id="filter-input-{column.key}"
      class={partNamesInput}
      part={partNamesInput}
      type="text"
      placeholder="Enter key to search"
      bind:value={filterValue}
      onkeydown={keydownHandler}
      disabled={loading}
    /> -->
      {/if}
    </th>
  {/each}
</tr>

<style>
  .filter-thead-tr {
    height: var(--table-header-height);
    position: sticky;
    top: var(--table-header-height);
    z-index: 4;
    background: var(--table-header-background);
  }

  .column-filter-th {
    border-bottom: 1px solid var(--table-header-filter-border-bottom-color);
    border-top: 1px solid var(--table-header-filter-border-top-color);
    border-left: 1px solid var(--table-header-filter-border-left-color);
    border-right: 1px solid var(--table-header-filter-border-right-color);
  }
</style>
