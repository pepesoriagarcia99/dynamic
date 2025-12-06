<script lang="ts">
  import type { Column } from '../../models/Column';
  import type { TableConfiguration } from '../../models/configuration/TableConfiguration';
  import ColumnHeader from './ColumnHeader.svelte';
  import InputFilter from './InputFilter.svelte';

  interface HeaderProps {
    columns: Column[];
    tableConfiguration: TableConfiguration;
  }

  /** Inputs */
  const { columns = [], tableConfiguration }: HeaderProps = $props();
</script>

<thead class="thead" part="thead">
  <tr class="thead-tr" part="thead-tr">
    {#each columns as column}
      <ColumnHeader
        {column}
        {tableConfiguration}
      />
    {/each}
  </tr>

  {#if tableConfiguration.filterable}
    <InputFilter {columns} />
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
