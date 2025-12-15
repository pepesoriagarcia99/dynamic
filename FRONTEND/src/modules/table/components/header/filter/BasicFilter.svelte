<script lang="ts">
  import { onMount } from 'svelte';

  // import type { StoreComponent, StoreComponentData } from '../../../core/models/StoreComponent';
  import type { Column } from '../../../models/column/Column';
  // import { filterStore } from '../../store/filter-store';

  import { styleTransformer } from '../../../../../utils/style-transformer';
  import { loadingState } from '../../../store/loading-state.svelte';

  import Skeleton from '../../Skeleton.svelte';
  import BasicControl from '../../../../controls/components/BasicControl.svelte';
  // import SelectorControl from '../../../controls/components/SelectorControl.svelte';
//   import CheckControl from '../../../controls/components/CheckControl.svelte';

  interface FilterProps {
    columns: Column[];
    filterValue?: string;
  }

  /** Inputs */
  let { columns }: FilterProps = $props();

  /** Methods */
  onMount(() => {
    columns.forEach((column) => {
      console.log("🚀 ~ column:", column)
      // const filterStoreComponent: StoreComponent<string> = filterStore.add(column.key, value);
      // filterStoreComponent.subscribe((change: StoreComponentData<string>) => {
      //   value = change.value ?? '';
      // });
    });
  });

  function onChange(value: any) {
    console.log("🚀 ~ onChange ~ value:", value)
  }
</script>

<tr class="filter-thead-tr" part="filter-thead-tr">
  {#each columns as column}
    {#if column.filterable === true}
      <th
        class="column-filter-th column-filter-th-{column.index}"
        part="column-filter-th column-filter-th-{column.index}"
        style={styleTransformer.toString(column?.style)}
      >
        {#if loadingState() === true}
          <div style="padding: 0 8px;">
            <Skeleton height="34px" />
          </div>
        {:else}
          <BasicControl id={column.key} type="text" {onChange} />
        {/if}
      </th>
    {:else}
      <th
        class="column-filter-th column-filter-th-{column.index} column-filter-th-spacer"
        part="column-filter-th column-filter-th-{column.index}"
        style={styleTransformer.toString(column?.style)}
      >
        <!-- space -->
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
    box-sizing: border-box;
    padding-left: var(--table-column-margin-left);
    padding-right: var(--table-column-margin-right); /** El valor debe ser el mismo para que quede centrado */
    /* TODO: Usado para genera espacios al no exitir filtro */
    /* width: 1%; */
    /* white-space: nowrap; */
  }
</style>
