<script lang="ts">
  import type { Column } from '../models/Column';
  import type { TableConfiguration } from '../models/configuration/TableConfiguration';
  import ColumnHeader from './ColumnHeader.svelte';

  // Inputs
  export let columns: Column[] = [];
  export let tableConfiguration: TableConfiguration;
</script>

<thead>
  <tr part="header">
    {#each columns as column}
      <ColumnHeader {column} filterable={tableConfiguration.filterable} />
    {/each}
  </tr>
</thead>

<style>
</style>
