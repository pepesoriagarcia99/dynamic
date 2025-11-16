<script lang="ts">
  import Filter from './Filter.svelte';
  import type { Column } from '../models/Column';

  // Inputs
  export let column: Column;
</script>

<th>
  {column?.name}
  <Filter {column} />
</th>

<style>
</style>
