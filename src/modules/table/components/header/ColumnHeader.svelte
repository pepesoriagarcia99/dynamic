<script lang="ts">
  import type { Column } from '../../models/Column';
  import type { SortableType } from '../../models/configuration/TableConfiguration';

  import Filter from './Filter.svelte';
  import Sort from './Sort.svelte';

  interface ColumnHeaderProps {
    column: Column;
    filterable?: boolean;
    sortableType?: SortableType;
  }

  /** Inputs */
  const { column, filterable = false, sortableType = 'none' }: ColumnHeaderProps = $props();
</script>

<th>
  <div class="header">
    <span>{column?.name}</span>
    {#if column.sortable && sortableType !== 'none'}
      <Sort {column} />
    {/if}
  </div>

  {#if column.filterable && filterable}
    <Filter {column} />
  {/if}
</th>

<style>
  th {
    text-align: left;
  }

  .header {
    display: flex;
    align-items: center;
    gap: 0.5rem;
  }
</style>
