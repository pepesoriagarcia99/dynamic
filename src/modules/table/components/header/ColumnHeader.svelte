<script lang="ts">
  import { styleTransformer } from '../../../../utils/style-transformer';
  import type { Column } from '../../models/Column';
  import type { SortableType } from '../../models/configuration/TableConfiguration';
  import Sort from './Sort.svelte';

  interface ColumnHeaderProps {
    column: Column;
    filterable?: boolean;
    sortableType?: SortableType;
  }

  /** Inputs */
  const { column, sortableType = 'none' }: ColumnHeaderProps = $props();

  /** States */
  let sortRef: Sort | null = $state<Sort | null>(null);
  const isSortable: boolean = $derived(column.sortable === true && sortableType !== 'none');
  const isSorted: boolean = $derived(sortRef?.getSortDirection() !== null && isSortable);

  const partNamesTh: string = $derived(
    [
      'column-header-th',
      `column-header-th-${column.index}`,
      isSorted ? 'column-header-th-sorted' : isSortable ? 'column-header-th-sortable' : null
    ]
      .filter(Boolean)
      .join(' ')
  );
  const partNamesContent: string = $derived(`column-header-content column-header-content-${column.index}`);
  const partNamesName: string = $derived(
    ['header-column-name', isSorted ? 'header-column-name-sorted' : null, `header-column-name-${column.index}`]
      .filter(Boolean)
      .join(' ')
  );

  /** Methods */
  function handleHeaderClick(event: MouseEvent) {
    event.stopPropagation();
    sortRef?.toggleSort();
  }
</script>

<th class={partNamesTh} part={partNamesTh} style={styleTransformer.toString(column?.style)}>
  <button class="column-header-btn" onclick={(e) => handleHeaderClick(e)}>
    <div class={partNamesContent} part={partNamesContent}>
      <span class={partNamesName} part={partNamesName}>{column?.name}</span>
      {#if isSortable}
        <Sort bind:this={sortRef} {column} />
      {/if}
    </div>
  </button>
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

  .column-header-btn {
    background: none;
    border: none;
    cursor: pointer;

    width: 100%;
    height: var(--table-header-height);
  }

  .column-header-btn {
    font-weight: 600;
    font-size: 16px;
  }

  .column-header-th-sortable:hover {
    cursor: pointer;
    background: var(--table-header-sortable-hover-background);
  }

  .column-header-th-sorted {
    background: var(--table-header-sorted-background);
  }

  .header-column-name-sorted {
    color: var(--table-header-sorted-text-color);
  }
</style>
