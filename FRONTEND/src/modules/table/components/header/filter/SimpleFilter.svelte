<script lang="ts">
  import { getContext, onMount } from 'svelte';

  import type { Column } from '../../../models/column/Column';


  import Skeleton from '../../Skeleton.svelte';
  import BasicControl from '../../../../controls/components/BasicControl.svelte';
  import SelectorControl from '../../../../controls/components/SelectorControl.svelte';
  import CheckControl from '../../../../controls/components/CheckControl.svelte';
  import DateControl from '../../../../controls/components/DateControl.svelte';
  // import MultipleSelectorControl from '../../../../controls/components/MultipleSelectorControl.svelte';
  import AutoCompleteControl from '../../../../controls/components/AutoCompleteControl.svelte';
  import { LOADING_STATE } from '../../../constant';

  interface FilterProps {
    columns: Column[];
    filterValue?: string;
  }

  /** Inputs */
  let { columns }: FilterProps = $props();

  /** States */
  const loading: () => boolean = getContext(LOADING_STATE);

  /** Methods */
  onMount(() => {
    // columns.forEach((column) => {
    // console.log("🚀 ~ column:", column)
    // const filterStoreComponent: StoreComponent<string> = filterStore.add(column.key, value);
    // filterStoreComponent.subscribe((change: StoreComponentData<string>) => {
    //   value = change.value ?? '';
    // });
    // });
  });

  function onChange(value: any) {
    console.log('🚀 ~ onChange ~ value:', value);
  }
</script>

<tr class="filter-thead-tr" part="filter-thead-tr">
  {#each columns as column}
    {@const configuration: any = column.configuration}
    {#if column.filterable === true}
      <th
        class="column-filter-th column-filter-th-{column.index}"
        part="column-filter-th column-filter-th-{column.index}"
        style={column?.style as string}
      >
        {#if loading() === true}
          <div style="padding: 0 8px;">
            <Skeleton height="34px" />
          </div>
        {:else if column.type === 'selector' && configuration?.options }
          {#if !configuration.filterType || configuration.filterType === 'simple-selector'}
            <SelectorControl options={configuration.options!} {onChange} />
          {:else if configuration.filterType === 'auto-complete'}
            <AutoCompleteControl options={configuration.options!} {onChange} />
            <!-- {:else if configuration.filterType === 'multi-selector'}
            <MultipleSelectorControl options={configuration.options!} {onChange} /> -->
          {/if}
        {:else if column.type === 'boolean'}
          <CheckControl id={column.key} {onChange} triState={true} />
        {:else if column.type === 'date'}
          <DateControl id={column.key} {onChange} />
        {:else}
          <BasicControl id={column.key} type={column.type === 'number' ? 'number' : 'text'} {onChange} />
        {/if}
      </th>
    {:else}
      <th
        class="column-filter-th column-filter-th-{column.index} column-filter-th-spacer"
        part="column-filter-th column-filter-th-{column.index}"
        style={column?.style as string}
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
