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

  const partNamesTh: string = $derived(`column-header-th column-header-th-${column.key}`);
  const partNamesContent: string = $derived(`column-header-content column-header-content-${column.key}`);
  const partNamesName: string = $derived(`header-column-name header-column-name-${column.key}`);
</script>

<th class={partNamesTh} part={partNamesTh}>
  <div class={partNamesContent} part={partNamesContent}>
    <span class={partNamesName} part={partNamesName}>{column?.name}</span>
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

  .column-header-content {
    display: flex;
    align-items: center;
    gap: 0.5rem;
  }
</style>
