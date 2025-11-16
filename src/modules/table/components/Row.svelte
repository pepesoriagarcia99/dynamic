<script lang="ts">
  import type { Column } from '../models/Column';
  import ColumnValue from './ColumnValue.svelte';

  // Inputs
  export let columns: Column[] = [];
  export let row: any;
</script>

<tr>
  {#each columns as column}
    <ColumnValue {column} {row} />
  {/each}
</tr>

<style>
</style>
