<script lang="ts">
  import type { Column } from '../models/Column';
  import ColumnHeader from './ColumnHeader.svelte';

  // Inputs
  export let columns: Column[] = [];
</script>

<thead>
  <tr part="header">
    {#each columns as column}
      <ColumnHeader {column} />
    {/each}
  </tr>
</thead>

<style>
</style>
