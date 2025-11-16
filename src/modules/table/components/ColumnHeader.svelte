<script lang="ts">
  import Filter from './Filter.svelte';
  import type { Column } from '../models/Column';

  // Inputs
  export let column: Column;
</script>

<th>
  {column?.name}
  {#if column.filterable}
    <Filter {column} />
  {/if}
</th>

<style>
  th {
    text-align: left;
  }
</style>
