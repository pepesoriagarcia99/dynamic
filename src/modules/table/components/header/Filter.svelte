<script lang="ts">
  import type { Column } from '../../models/Column';
  import { loadingState } from '../../store/loading-state';
  import Skeleton from '../Skeleton.svelte';
  import BasicControl from '../../../controls/components/BasicControl.svelte';
  import { styleTransformer } from '../../../../utils/style-transformer';

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
    {#if column.filterable === true}
      <th
        class="column-filter-th column-filter-th-{column.index}"
        part="column-filter-th column-filter-th-{column.index}"
        style={styleTransformer.toString(column?.style)}
      >
        {#if loading === true}
          <Skeleton />
        {:else}
          <BasicControl id={column.key} />
        {/if}
      </th>
    {:else}
      <th
        class="column-filter-th column-filter-th-{column.index} column-filter-th-spacer"
        part="column-filter-th column-filter-th-{column.index}"
        style={styleTransformer.toString(column?.style)}
      >
        <div></div>
      </th>
    {/if}
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
    width: 1%;
    white-space: nowrap;
  }

  .column-filter-th-spacer {
    width: auto;
  }
</style>
