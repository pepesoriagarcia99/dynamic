<script lang="ts">
  import type { Column } from '../../models/Column';
  import type { SortableType } from '../../models/configuration/TableConfiguration';

  // import Filter from './Filter.svelte';
  import Sort from './Sort.svelte';

  interface ColumnHeaderProps {
    column: Column;
    filterable?: boolean;
    sortableType?: SortableType;
  }

  /** Inputs */
  const { column, sortableType = 'none' }: ColumnHeaderProps = $props();

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

  .column-header-th {
    border-bottom: 1px solid var(--table-header-border-bottom-color);
    border-top: 1px solid var(--table-header-border-top-color);
    border-left: 1px solid var(--table-header-border-left-color);
    border-right: 1px solid var(--table-header-border-right-color);
    background: var(--table-header-background);
  }
</style>
