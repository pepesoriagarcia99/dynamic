<svelte:options customElement="dyn-table" />

<script lang="ts">
  import '../../tooltip/styles/tooltip.css';

  import { onMount, setContext } from 'svelte';
  import {
    DEFAULT_FILTERABLE,
    DEFAULT_PAGE_SIZE_OPTIONS,
    DEFAULT_PAGEABLE,
    DEFAULT_SELECTABLE_TYPE,
    DEFAULT_SORTABLE,
    VALID_SELECTABLE_TYPES,
    DEFAULT_PAGE_SIZE,
    DEFAULT_RESIZABLE,
    VALID_SORTABLE_TYPES,
    VALID_FILTERABLE_TYPES,
    VALID_PAGEABLE_TYPES,
    READY_EVENT_NAME,
    LOADING_STATE,
    TABLE_CONFIGURATION
  } from '../constant';

  import type { Column } from '../models/column/Column';
  import type { RowEvent } from '../models/event/RowEvent';
  import type {
    FilterableType,
    PageableType,
    SelectableType,
    SortableType
  } from '../models/configuration/TableConfiguration';
  import type { TableReadyEvent } from '../models/event/TableEvent';

  import Header from './header/Header.svelte';
  import Pagination from './Pagination.svelte';
  import ContextMenu from './ContextMenu.svelte';
  import LoadingBody from './body/LoadingBody.svelte';
  import { columnCompiler } from '../services/column-compiler';
  import Body from './body/Body.svelte';

  interface TableProps {
    primaryKey: string;
    columns: Column[];

    loading?: boolean;
    count?: number;
    data?: any[];
    selectableType?: SelectableType;
    // selectAll?: boolean;
    filterableType?: FilterableType;
    sortableType?: SortableType;
    pageableType?: PageableType;
    pageSizeOptions?: number[];
    pageSize?: number;
    resizable?: boolean;
  }

  /** Inputs */
  let {
    columns,
    primaryKey,
    loading = false,
    count = undefined,
    data = [],
    selectableType = DEFAULT_SELECTABLE_TYPE,
    // selectAll = DEFAULT_SELECT_ALL,
    filterableType = DEFAULT_FILTERABLE,
    sortableType = DEFAULT_SORTABLE,
    pageableType = DEFAULT_PAGEABLE,

    pageSizeOptions = DEFAULT_PAGE_SIZE_OPTIONS,
    pageSize = DEFAULT_PAGE_SIZE,
    resizable = DEFAULT_RESIZABLE
  }: TableProps = $props();

  /** Values */
  let el: HTMLElement;
  // let wasAtBottom = false;
  // let scrollTimeout: number | undefined;

  /** States */
  let paginationRef: Pagination | null = $state<Pagination | null>(null);
  let contextMenuVisible = $state(false);
  let contextMenuEvent = $state<RowEvent | undefined>(undefined);

  let hasContextMenuSlot = $derived($$slots['context-menu']);
  const compiledColumns = $derived(columns.map(columnCompiler));

  /** Contexts */
  setContext(TABLE_CONFIGURATION, () => ({
    selectableType,
    filterableType,
    sortableType,
    pageableType,
    primaryKey,
    resizable
  }));
  setContext(LOADING_STATE, () => loading);

  /** Checks */
  // Validacion de configuracion requerida
  $effect(() => {
    if (!Array.isArray(columns) || columns.length === 0) {
      throw new Error('The "columns" property must be a non-empty array.');
    }

    // Valida que exista la prop primaryKey
    if (!primaryKey) {
      throw new Error('The "primaryKey" property must be defined and non-empty.');
    }
  });

  // validacion de configuracion de seleccion
  $effect(() => {
    // Valida que el selectableType sea valido
    if (selectableType && !VALID_SELECTABLE_TYPES.includes(selectableType)) {
      throw new Error(
        `The "selectableType" property must be one of the following values: ${VALID_SELECTABLE_TYPES.join(', ')}.`
      );
    }

    // // selectAll no puede ser true si selectableType es none
    // if (selectAll === true && selectableType === 'none') {
    //   throw new Error('The "selectAll" property cannot be true when "selectableType" is "none".');
    // }

    if (selectableType !== 'none' && !primaryKey) {
      throw new Error('The "primaryKey" property must be defined when "selectableType" is not "none".');
    }
  });

  // validacion de configuracion de paginacion
  $effect(() => {
    // valida los tipos de paginacion
    if (pageableType !== 'none' && !VALID_PAGEABLE_TYPES.includes(pageableType)) {
      throw new Error(
        `The "pageableType" property must be one of the following values: ${VALID_PAGEABLE_TYPES.join(', ')}.`
      );
    }

    // si se activa la paginacion, count debe ser un numero mayor a 0
    if (pageableType === 'pagination' && loading === false && count === undefined) {
      throw new Error('The "count" property must be a number greater than 0 when "pageable" is true.');
    }
  });

  // validacion de configuracion de ordenacion
  $effect(() => {
    // valida los tipos de ordenacion
    if (sortableType && !VALID_SORTABLE_TYPES.includes(sortableType)) {
      throw new Error(
        `The "sortableType" property must be one of the following values: ${VALID_SORTABLE_TYPES.join(', ')}.`
      );
    }
  });

  // validacion de configuracion de filtro
  $effect(() => {
    // Valida los tipos de estados del filtro
    if (filterableType && !VALID_FILTERABLE_TYPES.includes(filterableType)) {
      throw new Error(
        `The "filterable" property must be one of the following values: ${VALID_FILTERABLE_TYPES.join(', ')}.`
      );
    }
  });

  /** Methods */
  onMount(() => {
    // declarePublicApi(el, paginationRef as Pagination);

    window.addEventListener('keydown', handleKeyDown);

    emitReady();
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  });

  /**
   * TABLE HANDLERS
   */
  function handleClickOutside() {
    if (contextMenuVisible && hasContextMenuSlot) {
      requestAnimationFrame(() => {
        contextMenuVisible = false;
        contextMenuEvent = undefined;
      });
    }
  }

  function handleScroll(/*event: Event*/) {
    if (contextMenuVisible && hasContextMenuSlot) {
      contextMenuVisible = false;
      contextMenuEvent = undefined;
    }

    // if (pageableType === 'infinite') {
    //   // Throttle del evento de scroll
    //   if (scrollTimeout) return;

    //   scrollTimeout = window.setTimeout(() => {
    //     const target = event.target as HTMLElement;
    //     const scrollTop = target.scrollTop;
    //     const scrollHeight = target.scrollHeight;
    //     const clientHeight = target.clientHeight;

    //     const isAtBottom = scrollTop + clientHeight >= scrollHeight - 5;

    //     if (isAtBottom && !wasAtBottom) {
    //       el.dispatchEvent(
    //         new CustomEvent(SCROLL_END_EVENT_NAME, {
    //           bubbles: true,
    //           composed: true
    //         })
    //       );
    //     }

    //     wasAtBottom = isAtBottom;
    //     scrollTimeout = undefined;
    //   }, 100);
    // }
  }

  function handleKeyDown(event: KeyboardEvent) {
    if (event.key === 'Escape') {
      // selectionStore.clear();
      contextMenuVisible = false;
    }
  }

  function handleRowClick(event: RowEvent) {
    if(hasContextMenuSlot && event.type === 'rightclick') {
      event.mouse.preventDefault!();

      contextMenuVisible = true;
      contextMenuEvent = event;
    }
  }

  /**
   * EVENTS
   */
  function emitReady() {
    el.dispatchEvent(
      new CustomEvent(READY_EVENT_NAME, {
        detail: {
          pagination: paginationRef!.getState(),
          filter: [],
          sort: []
          // filter: mapColumnKey<FilterEvent>(filterStore.state().filter((e) => e.value) as FilterEvent[]),
          // sort: mapColumnKey<SortEvent>(sortStore.state().filter((e) => e.value))
        } as TableReadyEvent,
        bubbles: true,
        composed: true
      })
    );
  }

  // function mapColumnKey<T>(storeEvent: StoreComponentData<any>[]): T[] {
  //   return storeEvent.map((event) => {
  //     const { key, value } = event;

  //     const column = indexColumns.find((col) => String(col.index) === key);
  //     return {
  //       key: column?.key || key,
  //       value
  //     } as T;
  //   });
  // }
</script>

<!-- TODO: CREAR LOS SLOTS -->
<!-- slot de loading -->
<!-- slot de not data -->
<!-- slot: menu contextual -->
<!-- slot: paginacion -->
<!-- slot: filter -->

<svelte:window onmousedown={handleClickOutside} />

<div class="table-root" part="table-root" bind:this={el}>
  <div class="table-container" part="table-container">
    <div class="table-scroll" part="table-scroll" onscroll={handleScroll}>
      <table class="table" part="table">
        <Header columns={compiledColumns}></Header>

        <!-- tbody de carga -->
        <tbody class="tbody" part="tbody" class:tbody-hidden={!loading}>
          <LoadingBody {columns} {pageSize} />
        </tbody>

        <!-- tbody cuando no hay datos -->
        <tbody class="tbody" part="tbody" class:tbody-hidden={loading || data.length > 0}>
          <tr>
            <td colspan={columns.length} class="table-no-data" part="table-no-data"> No data available. </td>
          </tr>
        </tbody>

        <!-- tbody de datos -->
        <tbody class="tbody" part="tbody" class:tbody-hidden={loading || data.length === 0}>
          <Body {primaryKey} columns={compiledColumns} {data} ontoggle={handleRowClick} />
        </tbody>
      </table>
    </div>

    <div class="pagination-root" part="pagination-root">
      {#if pageableType === 'pagination' && count !== undefined}
        <Pagination bind:this={paginationRef} {count} {pageSizeOptions} {pageSize} />
      {/if}
    </div>
  </div>

  {#if hasContextMenuSlot}
    <ContextMenu bind:visible={contextMenuVisible} bind:event={contextMenuEvent}>
      <slot name="context-menu" event={contextMenuEvent} />
    </ContextMenu>
  {/if}
</div>

<style>
  :host {
    display: block;
    width: 100%;
    height: 100%;

    /** TABLE */
    --hover: #e2e8f0;
    --selected: #020617;
    --selected-text: #ffffff;
    --border: #d1d1d1;

    /** Table column */
    --table-column-margin-left: var(--dyn-table-column-margin-left, 12px);
    --table-column-margin-right: var(--dyn-table-column-margin-right, 12px);

    /** Table border*/
    --table-border-color: var(--dyn-table-border-color, #e2e8f0);

    /** Table header */
    --table-header-height: var(--dyn-table-header-height, 56px);
    --table-header-background: var(--dyn-table-header-background, #ffffff);

    /** Table header borders */
    --table-header-border-top-color: var(--dyn-table-header-border-top-color);
    --table-header-border-left-color: var(--dyn-table-header-border-left-color);
    --table-header-border-right-color: var(--dyn-table-header-border-right-color);
    --table-header-border-bottom-color: var(--dyn-table-header-border-bottom-color, var(--border));

    /** Table header sortable*/
    --table-header-sortable-hover-background: var(--dyn-table-sortable-hover-background, var(--hover));
    --table-header-sorted-background: var(--dyn-table-header-sorted-background, var(--selected));
    --table-header-sorted-text-color: var(--dyn-table-header-sorted-text-color, var(--selected-text));
    --table-header-sorted-icon-color: var(--dyn-table-header-sorted-icon-color, var(--selected-text));

    /** Table header resized */
    --table-header-resized-icon-color: var(--dyn-table-header-resized-icon-color, var(--selected-text));

    /** Table header filter */
    --table-header-filter-border-top-color: var(--dyn-table-header-filter-border-top-color);
    --table-header-filter-border-left-color: var(--dyn-table-header-filter-border-left-color);
    --table-header-filter-border-right-color: var(--dyn-table-header-filter-border-right-color);
    --table-header-filter-border-bottom-color: var(--dyn-table-header-filter-border-bottom-color, var(--border));

    /** Table selection */
    --select-color: var(--dyn-table-select-color, var(--selected));
    --select-text-color: var(--dyn-table-select-text-color, var(--selected-text));
    --select-hover-color: var(--dyn-table-select-hover-color, var(--hover));

    /** Table rows*/
    --table-row-height: var(--dyn-table-row-height, 50px);
    --table-row-text-color: var(--dyn-table-row-text-color, #495057);

    --row-border-top-color: var(--dyn-table-border-top-color);
    --row-border-left-color: var(--dyn-table-border-left-color);
    --row-border-right-color: var(--dyn-table-border-right-color);
    --row-border-bottom-color: var(--dyn-table-border-bottom-color, var(--border));

    /** Pagination */
    --pagination-background: var(--dyn-table-pagination-background, #ffffff);
    --pagination-height: var(--dyn-table-pagination-height, 50px);
    --pagination-page-num-btn-selected: var(--dyn-table-pagination-page-num-btn-selected, var(--selected));
    --pagination-page-num-text-selected: var(--dyn-table-pagination-page-num-text-selected, var(--selected-text));
    --pagination-page-num-btn-hover: var(--dyn-table-pagination-page-num-btn-hover, var(--hover));
    --pagination-action-btn-hover: var(--dyn-table-pagination-action-btn-hover, var(--hover));

    /** Context menu */
    --context-menu-border-color: var(--dyn-table-context-menu-border-color, var(--table-border-color));
    --context-menu-background: var(--dyn-table-context-menu-background, #ffffff);

    /** CONTROLS */
    --control-text-color: var(--dyn-table-control-color, #495057);
    --control-background-color: var(--dyn-table-control-background, #ffffff);
    --control-background-disabled-color: var(--dyn-table-control-disabled-background-color, #e9ecef);
    --control-border-color: var(--dyn-table-control-border-color, #cbd5e1);
    --control-border-hover-color: var(--dyn-table-control-border-hover-color, #94a3b8);
    --control-border-focus-color: var(--dyn-table-control-border-hover-color, #020617);
    --control-height: var(--dyn-table-control-height, 34px);
    --control-border-radius: var(--dyn-table-control-border-radius, 6px);

    /** TOOLTIP */
    /** ESTO NO SE USA, EL MAPEO ESTA EN tooltip.css */
    --tooltip-background-color: var(--dyn-tooltip-background-color, #020617);
    --tooltip-text-color: var(--dyn-tooltip-text-color, #ffffff);
    --tooltip-font-size: var(--dyn-tooltip-font-size, 14px);
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

    overflow: hidden;
  }

  .table-container {
    flex: 1 1 auto;
    display: flex;
    flex-direction: column;
    margin: 22px;
    min-height: 0;
    overflow: auto;
  }

  .table-scroll {
    flex: 1 1 auto;
    overflow-x: auto;
    overflow-y: auto;
    position: relative;
    min-height: 0;
  }

  .table {
    border-collapse: separate;
    border-spacing: 0;
    width: 100%;
    table-layout: auto;
    min-width: 100%;
  }

  .table-no-data {
    padding: 16px;
    text-align: left;
    vertical-align: top;
  }

  .tbody-hidden {
    display: none;
  }

  .pagination-root {
    flex-shrink: 0;
    background: var(--pagination-background);
    margin-top: 12px;
    height: var(--pagination-height);
  }
</style>
