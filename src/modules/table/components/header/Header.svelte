<script lang="ts">
  import type { Column } from '../../models/Column';
  import type { TableConfiguration } from '../../models/configuration/TableConfiguration';
  import ColumnHeader from './ColumnHeader.svelte';

  interface HeaderProps {
    columns: Column[];
    tableConfiguration: TableConfiguration;
  }

  /** Inputs */
  const { columns = [], tableConfiguration }: HeaderProps = $props();
</script>

<thead class="header" part="header">
  <tr class="header-tr" part="header-tr">
    {#each columns as column}
      <ColumnHeader {column} filterable={tableConfiguration.filterable} sortableType={tableConfiguration.sortableType} />
    {/each}
  </tr>
</thead>

<style>
</style>
