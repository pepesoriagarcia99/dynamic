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
    DEFAULT_PAGE_SIZE,
    ROW_CLICK_EVENT_NAME,
    PAGE_CHANGE_EVENT_NAME,
    SORT_EVENT_NAME,
    FILTER_EVENT_NAME,
    SELECTION_EVENT_NAME,
    DEFAULT_RESIZABLE
  } from '../constant';
  import type { Column } from '../models/Column';
  import type { RowEvent } from '../models/event/RowEvent';
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
  import ContextMenu from './ContextMenu.svelte';
  import type { RowData } from '../models/RowData';

  interface TableProps {
    columns?: Column[];
    loading?: boolean;
    count?: number;
    primaryKey?: string;
    data?: any[];
    selectableType?: SelectableType;
    selectAll?: boolean;
    filterable?: boolean;
    sortableType?: SortableType;
    pageable?: boolean;
    pageSizeOptions?: number[];
    pageSize?: number;
    resizable?: boolean;
  }

  /** Inputs */
  let {
    columns = [],
    loading = false,
    count,
    primaryKey,
    data = [],
    selectableType = DEFAULT_SELECTABLE_TYPE,
    selectAll = DEFAULT_SELECT_ALL,
    filterable = DEFAULT_FILTERABLE,
    sortableType = DEFAULT_SORTABLE,
    pageable = DEFAULT_PAGEABLE,
    pageSizeOptions = DEFAULT_PAGE_SIZE_OPTIONS,
    pageSize = DEFAULT_PAGE_SIZE,
    resizable = DEFAULT_RESIZABLE
  }: TableProps = $props();

  /** Values */
  let el: HTMLElement;
  let paginationRef: Pagination | null = $state<Pagination | null>(null);
  let skeletonData = Array.from({ length: 200 }, (_, i) => i);
  let contextMenuVisible = $state(false);
  let contextMenuEvent = $state<RowEvent | undefined>(undefined);

  /** Checks */
  // Static checks
  if (!Array.isArray(columns) || columns.length === 0) {
    throw new Error('The "columns" property must be a non-empty array.');
  }

  // Reactive checks
  $effect(() => {
    // Valida que no se use la columna reservada "__ctx"
    if (columns.findIndex((col) => col.key === '__ctx') !== -1) {
      throw new Error('The column "__ctx" is reserved for internal functionality and cannot be used.');
    }

    // Valida que el selectableType sea valido
    if (selectableType && !VALID_SELECTABLE_TYPES.includes(selectableType)) {
      throw new Error(
        `The "selectableType" property must be one of the following values: ${VALID_SELECTABLE_TYPES.join(', ')}.`
      );
    }

    // selectAll no puede ser true si selectableType es none
    if (selectAll === true && selectableType === 'none') {
      throw new Error('The "selectAll" property cannot be true when "selectableType" is "none".');
    }

    if (selectableType !== 'none' && !primaryKey) {
      throw new Error('The "primaryKey" property must be defined when "selectableType" is not "none".');
    }

    // si se activa la paginacion, count debe ser un numero mayor a 0
    if (pageable === true && loading === false && count === undefined) {
      throw new Error('The "count" property must be a number greater than 0 when "pageable" is true.');
    }
  });

  /** States */
  let hasContextMenuSlot = $derived($$slots.contextMenu);
  const indexColumns: Column[] = $derived(
    columns.map((c, index) => ({
      ...c,
      index,
      resizable: c.resizable ?? true // por defecto las columnas son resizables a menos que se indique lo contrario; Esta config se activa si la tabla es resizable
    }))
  );
  const parameterizedData: RowData[] = $derived(
    data.map((r) => ({
      ...r,
      __ctx: {
        isSelected: false
      }
      /**
       * TODO: podria hacer un acceso dinamico al valor de la key primaria
       */
      // getPrimaryKeyValue() {
      //   return this[tableConfiguration.primaryKey!]
      // }
    }))
  );

  const tableConfiguration: TableConfiguration = $derived({
    selectableType,
    selectAll,
    filterable,
    sortableType,
    pageable,
    primaryKey,
    resizable
  });

  $effect(() => {
    loadingState.emit(loading);
  });

  /**
   * TODO: PAGINACION AUTOMATICA
   * * Si el usuario activa la paginacion pero no la quiere gestionar el con los eventos
   */
  // $effect(() => {
  //   if (pageable === true && parameterizedData.length > pageSize) {
  //     transformedData = parameterizedData.slice((page - 1) * pageSize, page * pageSize);
  //     console.log('PAGE CHANGE');

  //   } else {
  //     transformedData = parameterizedData;
  //   }
  // });

  /** Methods */
  onMount(() => {
    publicApi();

    selectionStore.init(tableConfiguration);
    selectionStore.subscribe((selection: StoreComponentData<RowData>[]) => {
      el.dispatchEvent(
        new CustomEvent(SELECTION_EVENT_NAME, {
          detail: selection.filter((el) => el.value?.__ctx.isSelected === true) as SelectionEvent[],
          bubbles: true,
          composed: true
        })
      );
    });

    filterStore.subscribe((filters: StoreComponentData<string>[]) => {
      const eventDetail = mapColumnKey<FilterEvent>(filters);
      el.dispatchEvent(
        new CustomEvent(FILTER_EVENT_NAME, {
          detail: eventDetail as FilterEvent[],
          bubbles: true,
          composed: true
        })
      );
    });

    sortStore.init(tableConfiguration);
    sortStore.subscribe((sorts: StoreComponentData<SortOrder>[]) => {
      const eventDetail = mapColumnKey<SortEvent>(sorts);
      el.dispatchEvent(
        new CustomEvent(SORT_EVENT_NAME, {
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
  function mapColumnKey<T>(storeEvent: StoreComponentData<any>[]): T[] {
    return storeEvent.map((event) => {
      const { key, value } = event;

      const column = indexColumns.find((col) => String(col.index) === key);
      return {
        key: column?.key || key,
        value
      } as T;
    });
  }

  function onRowClick(event: RowEvent) {
    contextMenuVisible = false;

    if (selectableType !== 'none') {
      if (event.type === 'leftclick') {
        selectionStore.onSelectToggle(event);
      } else if (event.type === 'rightclick' && hasContextMenuSlot === true) {
        /**
         * Se procesa estado de la seleccion con el menucontextual activo
         */
        const selectionState = selectionStore.state().filter((el) => el.value?.__ctx.isSelected === true);
        const selectionCount = selectionState.length;

        const isRightclickHoverSelection = Boolean(selectionState.find((el) => el.key === event.row[primaryKey!]));
        if (selectionCount === 0) {
          selectionStore.onSelectToggle(event);
        } else if (isRightclickHoverSelection === false) {
          selectionStore.onSelectToggle(event);
        }

        // se muestra el menu contextual del usuario
        contextMenuVisible = true;
        contextMenuEvent = event; // este event es el concreto, usado calcular x e y del contextmenu
      }
    }

    el.dispatchEvent(
      new CustomEvent(ROW_CLICK_EVENT_NAME, {
        detail: event as RowEvent,
        bubbles: true,
        composed: true
      })
    );
  }

  function onPageChange(event: PageEvent) {
    el.dispatchEvent(
      new CustomEvent(PAGE_CHANGE_EVENT_NAME, {
        detail: event as PageEvent,
        bubbles: true,
        composed: true
      })
    );
  }

  function emitReady() {
    const event: TableEvent = {
      filter: mapColumnKey<FilterEvent>(filterStore.state().filter((e) => e.value) as FilterEvent[]),
      page: paginationRef?.getState()!,
      sort: mapColumnKey<SortEvent>(sortStore.state().filter((e) => e.value))
    };

    el.dispatchEvent(new CustomEvent('ready', { detail: event, bubbles: true, composed: true }));
  }

  function handleKeyDown(event: KeyboardEvent) {
    if (event.key === 'Escape') {
      selectionStore.clear();
      contextMenuVisible = false;
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
      <Header columns={indexColumns} {tableConfiguration} />

      <tbody class="tbody" part="tbody">
        {#if loading === true}
          {#each skeletonData as row}
            <tr id={row.toString()} style="height: 50px;">
              {#each indexColumns}
                <td>
                  <Skeleton />
                </td>
              {/each}
            </tr>
          {/each}
        {:else if data.length === 0 && loading === false}
          <tr>
            <td colspan={indexColumns.length} style="text-align: left; padding: 16px; vertical-align: top;">
              No data available.
            </td>
          </tr>
        {:else}
          {#each parameterizedData as row, i (row[primaryKey!])}
            <Row
              index={i}
              columns={indexColumns}
              {row}
              {tableConfiguration}
              contextMenu={hasContextMenuSlot}
              onClick={(event) => onRowClick(event)}
            />
          {/each}
        {/if}
      </tbody>
    </table>
  </div>
  <div class="pagination" part="pagination">
    {#if pageable === true && count !== undefined}
      <Pagination bind:this={paginationRef} {count} {pageSizeOptions} {pageSize} onChange={onPageChange} />
    {/if}
  </div>

  {#if hasContextMenuSlot}
    <ContextMenu bind:visible={contextMenuVisible} bind:event={contextMenuEvent}>
      <slot name="contextMenu" event={contextMenuEvent} />
    </ContextMenu>
  {/if}
</div>

<style>
  :host {
    display: block;
    width: 100%;
    height: 100%;

    /** TABLE*/
    --hover: #e2e8f0;
    --selected: #020617;
    --selected-text: #ffffff;
    --border: #d1d1d1;

    --table-border-color: var(--dyn-table-border-color, #e2e8f0);
    --table-header-background: var(--dyn-table-header-background, #ffffff);

    --table-header-height: var(--dyn-table-header-height, 56px);
    --table-row-height: var(--dyn-table-row-height, 50px);
    --table-row-value-color: var(--dyn-table-row-value-color, #495057);

    --table-header-border-top-color: var(--dyn-table-header-border-top-color);
    --table-header-border-left-color: var(--dyn-table-header-border-left-color);
    --table-header-border-right-color: var(--dyn-table-header-border-right-color);
    --table-header-border-bottom-color: var(--dyn-table-header-border-bottom-color, var(--border));

    --table-header-sortable-hover-background: var(--dyn-table-sortable-hover-background, var(--hover));
    --table-header-sorted-background: var(--dyn-table-header-sorted-background, var(--selected));
    --table-header-sorted-text-color: var(--dyn-table-header-sorted-text-color, var(--selected-text));
    --table-header-sorted-icon-color: var(--dyn-table-header-sorted-icon-color, var(--selected-text));

    --table-header-resized-icon-color: var(--dyn-table-header-resized-icon-color, var(--selected-text));

    --table-header-filter-border-top-color: var(--dyn-table-header-filter-border-top-color);
    --table-header-filter-border-left-color: var(--dyn-table-header-filter-border-left-color);
    --table-header-filter-border-right-color: var(--dyn-table-header-filter-border-right-color);
    --table-header-filter-border-bottom-color: var(--dyn-table-header-filter-border-bottom-color, var(--border));

    --select-color: var(--dyn-table-select-color, var(--selected));
    --select-text-color: var(--dyn-table-select-text-color, var(--selected-text));
    --select-hover-color: var(--dyn-table-select-hover-color, var(--hover));

    --row-border-top-color: var(--dyn-table-border-top-color);
    --row-border-left-color: var(--dyn-table-border-left-color);
    --row-border-right-color: var(--dyn-table-border-right-color);
    --row-border-bottom-color: var(--dyn-table-border-bottom-color, var(--border));

    --pagination-background: var(--dyn-table-pagination-background, #ffffff);
    --pagination-height: var(--dyn-table-pagination-height, 50px);
    --pagination-page-num-btn-selected: var(--dyn-table-pagination-page-num-btn-selected, var(--selected));
    --pagination-page-num-text-selected: var(--dyn-table-pagination-page-num-text-selected, var(--selected-text));
    --pagination-page-num-btn-hover: var(--dyn-table-pagination-page-num-btn-hover, var(--hover));
    --pagination-action-btn-hover: var(--dyn-table-pagination-action-btn-hover, var(--hover));

    /** Context menu */
    --context-menu-border-color: var(--dyn-table-context-menu-border-color, var(--table-border-color));
    --context-menu-background: var(--dyn-table-context-menu-background, #ffffff);

    /** Controls */
    --control-text-color: var(--dyn-table-control-color, #495057);
    --control-background-color: var(--dyn-table-control-background, #ffffff);
    --control-background-disabled-color: var(--dyn-table-control-disabled-background-color, #e9ecef);
    --control-border-color: var(--dyn-table-control-border-color, #cbd5e1);
    --control-border-hover-color: var(--dyn-table-control-border-hover-color, #94a3b8);
    --control-border-focus-color: var(--dyn-table-control-border-hover-color, #020617);
    --control-height: var(--dyn-table-control-height, 34px);
    --control-border-radius: var(--dyn-table-control-border-radius, 6px);
  }

  .table-root {
    width: 100%;
    height: 100%;
    display: flex;
    flex-direction: column;
    box-sizing: border-box;

    border-color: var(--table-border-color);
    border-width: 1px;
    border-style: solid;
    border-radius: 12px;
  }

  .table-scroll {
    flex: 1 1 auto;
    overflow-x: auto;
    overflow-y: auto;

    margin: 22px 22px 12px 22px;
  }

  .table {
    border-collapse: separate;
    border-spacing: 0;
    table-layout: fixed;
    width: max-content;
    min-width: 100%;
  }

  .pagination {
    position: sticky;
    bottom: 0;
    background: #ffffff;
    margin-bottom: 22px;
  }
</style>
