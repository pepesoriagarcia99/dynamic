<script lang="ts">
  import type { Column } from '../models/Column';
  import ColumnHeader from './ColumnHeader.svelte';

  // Inputs
  export let columns: Column[] = [];
</script>

<thead>
  <tr>
    {#each columns as column}
      <ColumnHeader {column} />
    {/each}
  </tr>
</thead>

<style>
</style>
