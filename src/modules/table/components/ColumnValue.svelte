<script lang="ts">
  import type { Column } from '../models/Column';

  // Inputs
  export let column: Column;
  export let row: any;
</script>

<td>{row[column.key]}</td>

<style>
</style>
