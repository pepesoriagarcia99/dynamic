<script lang="ts">
  import type { Column } from '../../models/Column';
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
  let loading = $state(false);

  /** Values */
  loadingState.subscribe((state) => {
    loading = state;
  });
</script>

<tr class="filter-thead-tr" part="filter-thead-tr">
  {#each columns as column}
    <th class="column-filter-th column-filter-th-{column.key}" part="column-filter-th column-filter-th-{column.key}">
      {#if loading === true}
        <Skeleton />
      {:else}
        <BasicControl />
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
