<svelte:options customElement="dyn-table" />

<script lang="ts">
  import '../../tooltip/styles/tooltip.css';

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
    // SORT_EVENT_NAME,
    DEFAULT_RESIZABLE,
    VALID_SORTABLE_TYPES,
    VALID_FILTERABLE_TYPES,
    SCROLL_END_EVENT_NAME,
    VALID_PAGEABLE_TYPES,
    READY_EVENT_NAME
  } from '../constant';
  import type { Column } from '../models/column/Column';
  import type { RowEvent } from '../models/event/RowEvent';
  import type {
    FilterableType,
    PageableType,
    SelectableType,
    SortableType,
    TableConfiguration
  } from '../models/configuration/TableConfiguration';
  import type { StoreComponentData } from '../../core/models/StoreComponent';
  import type { FilterEvent, SortEvent, /*SortOrder,*/ TableReadyEvent } from '../models/event/TableEvent';

  import { selectionStore } from '../store/selection-store';
  import { filterStore } from '../store/filter-store';
  import { sortStore } from '../store/sort-store';
  import { styleTransformer } from '../../../utils/style-transformer';

  import Header from './header/Header.svelte';
  import Row from './body/Row.svelte';
  import Pagination from './Pagination.svelte';
  import ContextMenu from './ContextMenu.svelte';
  import LoadingBody from './body/LoadingBody.svelte';
  import { declarePublicApi } from '../services/public-api/declare';
  import { buildStyleGetter } from '../services/Style';
  import { buildValueGetter } from '../services/Value';
  import { initLoadingContext } from '../context/loading-state.svelte';

  interface TableProps {
    columns?: Column[];
    loading?: boolean;
    count?: number;
    primaryKey?: string;
    data?: any[];
    selectableType?: SelectableType;
    selectAll?: boolean;
    filterable?: FilterableType;
    sortableType?: SortableType;
    pageableType?: PageableType;
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
    pageableType = DEFAULT_PAGEABLE,
    pageSizeOptions = DEFAULT_PAGE_SIZE_OPTIONS,
    pageSize = DEFAULT_PAGE_SIZE,
    resizable = DEFAULT_RESIZABLE
  }: TableProps = $props();

  initLoadingContext(() => loading);

  /** Values */
  let el: HTMLElement;
  let paginationRef: Pagination | null = $state<Pagination | null>(null);
  let contextMenuVisible = $state(false);
  let contextMenuEvent = $state<RowEvent | undefined>(undefined);
  let wasAtBottom = false;
  let scrollTimeout: number | undefined;

  /** Checks */
  // Validacion de configuracion de columnas
  $effect(() => {
    if (!Array.isArray(columns) || columns.length === 0) {
      throw new Error('The "columns" property must be a non-empty array.');
    }

    // Valida que no se use la columna reservada "__ctx"
    if (columns.findIndex((col) => col.key === '__ctx') !== -1) {
      throw new Error('The column "__ctx" is reserved for internal functionality and cannot be used.');
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

    // selectAll no puede ser true si selectableType es none
    if (selectAll === true && selectableType === 'none') {
      throw new Error('The "selectAll" property cannot be true when "selectableType" is "none".');
    }

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
    if (filterable && !VALID_FILTERABLE_TYPES.includes(filterable)) {
      throw new Error(
        `The "filterable" property must be one of the following values: ${VALID_FILTERABLE_TYPES.join(', ')}.`
      );
    }
  });

  /** States */
  let hasContextMenuSlot = $derived($$slots['context-menu']);
  const indexColumns: Column[] = $derived(
    /**
     * TODO: Revisar tipado Typescript
     * TODO: Revisar rendimiento de esto
     */
    columns.map((column, index) => {
      if (typeof column.style === 'object') {
        column.style = styleTransformer.toString(column.style);
      }

      // @ts-ignore
      if (column.configuration?.colorConfiguration) {
        // @ts-ignore
        column.configuration?.colorConfiguration.forEach((colorConfig: any) => {
          if (typeof colorConfig.style === 'object') {
            colorConfig.style = styleTransformer.toString(colorConfig.style);
          }
        });
      }

      return {
        ...column,
        index,
        // si la tabla es resizable, la columna tambien lo es por omision
        resizable: column.resizable ?? true,

        valueGetter: buildValueGetter(column),
        styleGetter: buildStyleGetter(column)
      };
    })
  );

  const tableConfiguration: TableConfiguration = $derived({
    selectableType,
    selectAll,
    filterable,
    sortableType,
    pageableType,
    primaryKey,
    resizable,

    hasContextMenu: hasContextMenuSlot
  });

  /** Methods */
  onMount(() => {
    declarePublicApi(el, paginationRef as Pagination);

    // selectionStore.init(tableConfiguration);
    // selectionStore.subscribe((selection: StoreComponentData<RowData>[]) => {
    //   el.dispatchEvent(
    //     new CustomEvent(SELECTION_EVENT_NAME, {
    //       // .filter((el) => el.value?.__ctx.isSelected === true)
    //       detail: selection as SelectionEvent[],
    //       bubbles: true,
    //       composed: true
    //     })
    //   );
    // });

    // filterStore.subscribe((filters: StoreComponentData<string>[]) => {
    //   const eventDetail = mapColumnKey<FilterEvent>(filters);
    //   el.dispatchEvent(
    //     new CustomEvent(FILTER_EVENT_NAME, {
    //       detail: eventDetail as FilterEvent[],
    //       bubbles: true,
    //       composed: true
    //     })
    //   );
    // });

    // sortStore.init(tableConfiguration);
    // sortStore.subscribe((sorts: StoreComponentData<SortOrder>[]) => {
    //   const eventDetail = mapColumnKey<SortEvent>(sorts);
    //   el.dispatchEvent(
    //     new CustomEvent(SORT_EVENT_NAME, {
    //       detail: eventDetail as SortEvent[],
    //       bubbles: true,
    //       composed: true
    //     })
    //   );
    // });

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

  /**
   * TODO: Posible necesidad de optimizacion.
   */
  function handleScroll(event: Event) {
    if (contextMenuVisible && hasContextMenuSlot) {
      contextMenuVisible = false;
      contextMenuEvent = undefined;
    }

    if (pageableType === 'infinite') {
      // Throttle del evento de scroll
      if (scrollTimeout) return;

      scrollTimeout = window.setTimeout(() => {
        const target = event.target as HTMLElement;
        const scrollTop = target.scrollTop;
        const scrollHeight = target.scrollHeight;
        const clientHeight = target.clientHeight;

        const isAtBottom = scrollTop + clientHeight >= scrollHeight - 5;

        if (isAtBottom && !wasAtBottom) {
          el.dispatchEvent(
            new CustomEvent(SCROLL_END_EVENT_NAME, {
              bubbles: true,
              composed: true
            })
          );
        }

        wasAtBottom = isAtBottom;
        scrollTimeout = undefined;
      }, 100);
    }
  }

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

  // function onRowClick(event: RowEvent) {
  //   console.log('-----> ', event);

  // contextMenuVisible = false;

  // if (selectableType !== 'none') {
  //   if (event.type === 'leftclick') {
  //     selectionStore.onSelectToggle(event);
  //   } else if (event.type === 'rightclick' && hasContextMenuSlot === true) {
  //     /**
  //      * Se procesa estado de la seleccion con el menucontextual activo
  //      */
  //     const selectionState = selectionStore.state().filter((el) => el.value?.__ctx.isSelected === true);
  //     const selectionCount = selectionState.length;

  //     const isRightclickHoverSelection = Boolean(selectionState.find((el) => el.key === event.row[primaryKey!]));
  //     if (selectionCount === 0) {
  //       selectionStore.onSelectToggle(event);
  //     } else if (isRightclickHoverSelection === false) {
  //       selectionStore.onSelectToggle(event);
  //     }

  //     // se muestra el menu contextual del usuario
  //     contextMenuVisible = true;
  //     contextMenuEvent = event; // este event es el concreto, usado calcular x e y del contextmenu
  //   }
  // }

  // el.dispatchEvent(
  //   new CustomEvent(ROW_CLICK_EVENT_NAME, {
  //     detail: event as RowEvent,
  //     bubbles: true,
  //     composed: true
  //   })
  // );
  // }

  function emitReady() {
    const event: TableReadyEvent = {
      filter: mapColumnKey<FilterEvent>(filterStore.state().filter((e) => e.value) as FilterEvent[]),
      page: paginationRef?.getState()!,
      sort: mapColumnKey<SortEvent>(sortStore.state().filter((e) => e.value))
    };

    el.dispatchEvent(new CustomEvent(READY_EVENT_NAME, { detail: event, bubbles: true, composed: true }));
  }

  function handleKeyDown(event: KeyboardEvent) {
    if (event.key === 'Escape') {
      selectionStore.clear();
      contextMenuVisible = false;
    }
  }
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
        <Header columns={indexColumns} {tableConfiguration} >
          <slot name="filter" />
        </Header>

        <tbody class="tbody" part="tbody">
          {#if loading === true}
            <LoadingBody columns={indexColumns} {pageSize} />
          {:else if data.length === 0 && loading === false}
            <tr>
              <td colspan={indexColumns.length} class="table-no-data" part="table-no-data"> No data available. </td>
            </tr>
          {:else}
            {#each data as row, index (row[primaryKey!])}
              <Row {index} columns={indexColumns} {row} {tableConfiguration} />
            {/each}
          {/if}
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

  .pagination-root {
    flex-shrink: 0;
    background: var(--pagination-background);
    margin-top: 12px;
    height: var(--pagination-height);
  }
</style>
