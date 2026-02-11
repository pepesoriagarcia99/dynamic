<script lang="ts">
  import { getContext } from 'svelte';
  import { TABLE_CONFIGURATION } from '../../constant';
  import type { ColumnCompiled } from '../../models/column/Column';
  import ColumnHeader from './ColumnHeader.svelte';
  import BasicFilter from './filter/BasicFilter.svelte';
  import SimpleFilter from './filter/SimpleFilter.svelte';
  import type { TableConfiguration } from '../../models/configuration/TableConfiguration';

  interface HeaderProps {
    columns: ColumnCompiled[];
  }

  /** Inputs */
  const { columns }: HeaderProps = $props();

  /** States */
  const tableConfiguration: () => TableConfiguration = getContext(TABLE_CONFIGURATION);

</script>

<thead class="thead" part="thead" >
  <tr class="thead-tr" part="thead-tr">
    {#each columns as column, index}
      <ColumnHeader
        {index}
        {column}
      />
    {/each}
  </tr>

  {#if tableConfiguration().filterable === 'basic'}
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
