<svelte:options customElement="dyn-table" />

<script lang="ts">
  import { onMount } from 'svelte';
  import {
    DEFAULT_FILTERABLE,
    DEFAULT_PAGE_SIZE_OPTIONS,
    DEFAULT_PAGEABLE,
    DEFAULT_SELECT_ALL,
    DEFAULT_SELECTABLE_TYPE,
    DEFAULT_SORTABLE,
    VALID_SELECTABLE_TYPES,
    DEFAULT_PAGE_SIZE
  } from '../constant';
  import type { Column } from '../models/Column';
  import type { RowData, RowEvent } from '../models/event/RowEvent';
  import type { SelectableType, SortableType, TableConfiguration } from '../models/configuration/TableConfiguration';
  import type { FilterEvent } from '../models/event/FilterEvent';
  import type { SortEvent, SortOrder } from '../models/event/SortEvent';
  import type { PageEvent } from '../models/event/PageEvent';
  import type { StoreComponentData } from '../../core/models/StoreComponent';
  import type { SelectionEvent } from '../models/event/SelectionEvent';
  import type { PaginationApi } from '../models/public-api/PaginationApi';
  import type { SelectionApi } from '../models/public-api/SelectionApi';
  import type { FilterApi } from '../models/public-api/FilterApi';
  import type { TableEvent } from '../models/event/TableEvent';

  import { selectionStore } from '../store/selection-store';
  import { filterStore } from '../store/filter-store';
  import { loadingState } from '../store/loading-state';
  import { sortStore } from '../store/sort-store';

  import Header from './header/Header.svelte';
  import Row from './body/Row.svelte';
  import Pagination from './Pagination.svelte';
  import Skeleton from './Skeleton.svelte';

  interface TableProps {
    columns?: Column[];
    loading?: boolean;
    count?: number;
    data?: any[];
    selectableType?: SelectableType;
    selectAll?: boolean;
    filterable?: boolean;
    sortableType?: SortableType;
    pageable?: boolean;
    pageSizeOptions?: number[];
    pageSize?: number;
  }

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
    pageable = DEFAULT_PAGEABLE,
    pageSizeOptions = DEFAULT_PAGE_SIZE_OPTIONS,
    pageSize = DEFAULT_PAGE_SIZE
  }: TableProps = $props();

  /** Values */
  let el: HTMLElement;
  let paginationRef: Pagination | null = $state(null);
  let skeletonData = Array.from({ length: 200 }, (_, i) => i);

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
    if (pageable === true && loading === false && count !== undefined && count <= 0) {
      throw new Error('The "count" property must be a number greater than 0 when "pageable" is true.');
    }
  });

  /** States */
  const identifierColumns: Column[] = $derived(columns.map((c) => (c.id ? c : { ...c, id: crypto.randomUUID() })));
  const keyedData: RowData[] = $derived(data.map((r) => (r.__key ? r : { ...r, __key: crypto.randomUUID() })));
  const tableConfiguration: TableConfiguration = $derived({
    selectableType,
    selectAll,
    filterable,
    sortableType,
    pageable
  });

  $effect(() => {
    loadingState.emit(loading);
  });

  /** Methods */
  onMount(() => {
    publicApi();

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
      const eventDetail = sorts.map((sort) => {
        const { key, value } = sort;

        const column = columns.find((col) => col.id === key);
        return {
          key: column?.key || key,
          value
        } as SortEvent;
      });

      el.dispatchEvent(
        new CustomEvent('sortChange', {
          detail: eventDetail as SortEvent[],
          bubbles: true,
          composed: true
        })
      );
    });

    window.addEventListener('keydown', handleKeyDown);

    emitReady();
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  });

  /**
   * EVENTS
   */
  function onRowClick(event: RowEvent) {
    if (selectableType !== 'none' && event.type === 'leftclick') {
      selectionStore.onSelectToggle(event);
    }

    el.dispatchEvent(
      new CustomEvent('rowClick', {
        detail: event as RowEvent,
        bubbles: true,
        composed: true
      })
    );
  }

  function onPageChange(event: PageEvent) {
    el.dispatchEvent(
      new CustomEvent('pageChange', {
        detail: event as PageEvent,
        bubbles: true,
        composed: true
      })
    );
  }

  function emitReady() {
    const event: TableEvent = {
      filter: filterStore.state().filter((e) => e.value) as FilterEvent[],
      page: paginationRef?.getState()!,
      sort: sortStore.state().filter((e) => e.value) as SortEvent[]
    };

    el.dispatchEvent(new CustomEvent('ready', { detail: event, bubbles: true, composed: true }));
  }

  function handleKeyDown(event: KeyboardEvent) {
    if (event.key === 'Escape') {
      selectionStore.clear();
    }
  }

  /**
   * PUBLIC API
   */
  function paginationApi(): PaginationApi {
    return {
      setPage: (n: number) => paginationRef?.setPage(n),
      resetPage: () => paginationRef?.resetPage()
    };
  }

  function selectionApi(): SelectionApi {
    return {
      reset: () => selectionStore.clear()
    };
  }

  function filterApi(): FilterApi {
    return {
      reset: () => filterStore.clear()
    };
  }

  function publicApi() {
    if (!el) return;

    const host = (el?.getRootNode() as ShadowRoot)?.host;
    if (!host) return;

    (host as any).pagination = paginationApi();
    (host as any).selection = selectionApi();
    (host as any).filter = filterApi();
  }
</script>

<!-- TODO: CREAR LOS SLOTS -->
<!-- slot de loading -->
<!-- slot de not data -->
<!-- slot: menu contextual -->
<!-- slot: paginacion -->
<!-- slot: filter -->

<div class="table-root" part="table-root" bind:this={el}>
  <div class="table-scroll" part="table-scroll">
    <table class="table" part="table">
      <Header columns={identifierColumns} {tableConfiguration} />

      <tbody class="tbody" part="tbody">
        {#if loading === true}
          {#each skeletonData as row}
            <tr id={row.toString()} style="height: 50px;">
              {#each identifierColumns}
                <td>
                  <Skeleton />
                </td>
              {/each}
            </tr>
          {/each}
        {:else if data.length === 0 && loading === false}
          <tr>
            <td colspan={identifierColumns.length} style="text-align: center; padding: 16px; vertical-align: top;">
              No data available.
            </td>
          </tr>
        {:else}
          {#each keyedData as row, i}
            <Row
              index={i}
              columns={identifierColumns}
              {row}
              {tableConfiguration}
              onClick={(event) => onRowClick(event)}
            />
          {/each}
        {/if}
      </tbody>
    </table>
  </div>
  <div class="pagination" part="pagination">
    {#if pageable === true}
      <Pagination bind:this={paginationRef} {count} {pageSizeOptions} {pageSize} onChange={onPageChange} />
    {/if}
  </div>
</div>

<style>
  :host {
    display: block;
    width: 100%;
    height: 100%;

    --select-color: var(--dyn-table-select-color, #020617);
    --select-hover-color: var(--dyn-table-select-hover-color, #e2e8f0);
    --border-bottom-color: var(--dyn-table-border-color, #e5e7eb);
  }

  .table-root {
    width: 100%;
    height: 100%;
    display: flex;
    flex-direction: column;
    box-sizing: border-box;
  }

  .table-scroll {
    flex: 1 1 auto;
    overflow-x: auto;
    overflow-y: auto;
  }

  .table {
    border-collapse: collapse;
    table-layout: fixed;
    width: max-content;
    min-width: 100%;
  }

  .pagination {
    position: sticky;
    bottom: 0;
    background: #ffffff;
    padding: 4px 0;
  }
</style>
