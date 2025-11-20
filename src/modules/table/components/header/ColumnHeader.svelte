<script lang="ts">
  import Filter from './Filter.svelte';
  import type { Column } from '../../models/Column';

  interface ColumnHeaderProps {
    column: Column;
    filterable?: boolean;
  }

  /** Inputs */
  const { column, filterable = false }: ColumnHeaderProps = $props();

</script>

<th>
  {column?.name}
  {#if column.filterable && filterable}
    <Filter {column} />
  {/if}
</th>

<style>
  th {
    text-align: left;
  }


</style>
