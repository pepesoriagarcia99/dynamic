<svelte:options customElement="dyn-table" />

<script lang="ts">
  import { onMount } from 'svelte';
  import {
    DEFAULT_FILTERABLE,
    DEFAULT_PAGE_SIZE_OPTIONS,
    DEFAULT_PAGINABLE,
    DEFAULT_SELECT_ALL,
    DEFAULT_SELECTABLE_TYPE,
    DEFAULT_SORTABLE,
    VALID_SELECTABLE_TYPES
  } from '../constant';
  import type { Column } from '../models/Column';
  import type { RowData, RowEvent } from '../models/TableEvents';
  import type { SelectableType, SortableType, TableConfiguration } from '../models/configuration/TableConfiguration';
  import type { FilterEvent } from '../models/FilterEvent';
  import type { StoreComponentData } from '../../core/models/StoreComponent';
  import type { SelectionEvent } from '../models/SelectionEvent';
  import { sortStore, type SortOrder } from '../store/sort-store.svelte';

  import { selectionStore } from '../store/selection-store.svelte';
  import { filterStore } from '../store/filter-store.svelte';

  import Header from './header/Header.svelte';
  import Row from './body/Row.svelte';

  import Pagination from './Pagination.svelte';
  import type { SortEvent } from '../models/SortEvent';

  interface TableProps {
    columns?: Column[];
    loading?: boolean;
    count?: number;
    data?: any[];
    selectableType?: SelectableType;
    selectAll?: boolean;
    filterable?: boolean;
    sortableType?: SortableType;
    paginable?: boolean;
    pageSizeOptions?: number[];
  }

  let el: HTMLElement;

  /** Inputs */
  let {
    columns = [],
    loading = false,
    count = 0,
    data = [],
    selectableType = DEFAULT_SELECTABLE_TYPE,
    selectAll = DEFAULT_SELECT_ALL,
    filterable = DEFAULT_FILTERABLE,
    sortableType = DEFAULT_SORTABLE,
    paginable = DEFAULT_PAGINABLE,
    pageSizeOptions = DEFAULT_PAGE_SIZE_OPTIONS
  }: TableProps = $props();

  /** Checks */
  // Static checks
  if (!Array.isArray(columns) || columns.length === 0) {
    throw new Error('The "columns" property must be a non-empty array.');
  }

  // Reactive checks
  $effect(() => {
    // Valida que el selectableType sea valido
    if (selectableType && !VALID_SELECTABLE_TYPES.includes(selectableType)) {
      throw new Error(
        `The "selectableType" property must be one of the following values: ${VALID_SELECTABLE_TYPES.join(', ')}.`
      );
    }

    // la columna __key no puede ser usada por el usuario si la tabla es seleccionable
    if (selectableType !== 'none' && columns.findIndex((col) => col.key === '__key') !== -1) {
      throw new Error('The column "__key" is reserved for selection functionality and cannot be used.');
    }

    // selectAll no puede ser true si selectableType es none
    if (selectAll === true && selectableType === 'none') {
      throw new Error('The "selectAll" property cannot be true when "selectableType" is "none".');
    }

    // si se activa la paginacion, count debe ser un numero mayor a 0
    if (paginable === true && count !== undefined && count <= 0) {
      throw new Error('The "count" property must be a number greater than 0 when "paginable" is true.');
    }
  });

  /** Computed */
  const keyedData: RowData[] = $derived(data.map((r) => (r.__key ? r : { ...r, __key: crypto.randomUUID() })));
  const tableConfiguration: TableConfiguration = $derived({
    selectableType,
    selectAll,
    filterable,
    sortableType,
    paginable
  });

  /** Methods */
  onMount(() => {
    selectionStore.init(tableConfiguration);
    selectionStore.subscribe((selection: StoreComponentData<boolean>[]) => {
      el.dispatchEvent(
        new CustomEvent('selection', {
          detail: selection as SelectionEvent[],
          bubbles: true,
          composed: true
        })
      );
    });

    filterStore.subscribe((filters: StoreComponentData<string>[]) => {
      el.dispatchEvent(
        new CustomEvent('filterChange', {
          detail: filters as FilterEvent[],
          bubbles: true,
          composed: true
        })
      );
    });

    sortStore.init(tableConfiguration);
    sortStore.subscribe((sorts: StoreComponentData<SortOrder>[]) => {
      el.dispatchEvent(
        new CustomEvent('sortChange', {
          detail: sorts as SortEvent[],
          bubbles: true,
          composed: true
        })
      );
    });
  });

  function onRowClick(event: RowEvent) {
    if (selectableType !== 'none') {
      selectionStore.onSelectToggle(event);
    }

    el.dispatchEvent(
      new CustomEvent('rowClick', {
        detail: event,
        bubbles: true,
        composed: true
      })
    );
  }
</script>

<!-- TODO: CREAR LOS SLOTS -->
<!-- slot de loading -->
<!-- slot de not data -->
<!-- slot: menu contextual -->
<!-- slot: paginacion -->
<!-- slot: filter -->

<div class="table-root" part="table-root" bind:this={el}>
  <table class="table" part="table">
    <Header {columns} {tableConfiguration} />

    <tbody class="tbody" part="tbody">
      {#if loading === true}
        <tr>
          <td colspan={columns.length} style="text-align: center; padding: 16px;"> Loading... </td>
        </tr>
      {:else if data.length === 0 && loading === false}
        <tr>
          <td colspan={columns.length} style="text-align: center; padding: 16px;"> No data available. </td>
        </tr>
      {:else}
        {#each keyedData as row, i}
          <Row index={i} {columns} {row} {tableConfiguration} onClick={(event) => onRowClick(event)} />
        {/each}
      {/if}
    </tbody>
  </table>
  <div class="pagination" part="pagination">
    {#if paginable === true}
      <Pagination {count} {pageSizeOptions} />
    {/if}
  </div>
</div>

<style>
  .table-root {
    width: 100%;
  }

  .table {
    width: 100%;
    border-collapse: collapse;
    table-layout: fixed;
  }

  .pagination {
    position: sticky;
    bottom: 0;
    background: #ffffff;
    padding: 4px 0;
  }
</style>
