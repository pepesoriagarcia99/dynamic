<script lang="ts">
  import type { Column } from '../../models/column/Column';
  import ColumnHeader from './ColumnHeader.svelte';
  import BasicFilter from './filter/BasicFilter.svelte';
  import SimpleFilter from './filter/SimpleFilter.svelte';
  import { getTableConfigurationContext } from '../../context/table-configuration-state.svelte';

  interface HeaderProps {
    columns: Column[];
  }

  /** Inputs */
  const { columns }: HeaderProps = $props();

  /** States */
  let hasDefaultSlot: boolean = $derived($$slots['default']);
  const tableConfiguration = getTableConfigurationContext();

</script>

<thead class="thead" part="thead" >
  <tr class="thead-tr" part="thead-tr">
    {#each columns as column}
      <ColumnHeader
        {column}
      />
    {/each}
  </tr>

  {#if hasDefaultSlot}
    <slot />
  {:else if tableConfiguration().filterable === 'basic'}
    <BasicFilter {columns} />
  {:else if tableConfiguration().filterable === 'simple'}
    <SimpleFilter {columns} />
  {/if}
</thead>

<style>
  .thead {
    background: var(--table-header-background);
  }

  .thead-tr {
    height: var(--table-header-height);
    position: sticky;
    top: 0;
    z-index: 5;
    background: var(--table-header-background);
  }
</style>
