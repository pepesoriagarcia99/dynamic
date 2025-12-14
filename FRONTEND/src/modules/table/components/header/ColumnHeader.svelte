<script lang="ts">
  import type { Column } from '../../models/column/Column';
  import type { TableConfiguration } from '../../models/configuration/TableConfiguration';

  import { styleTransformer } from '../../../../utils/style-transformer';
  import Sort from './Sort.svelte';

  import resizeIcon from '../../../../assets/svg/resize.svg';
  import { loadingState } from '../../store/loading-state.svelte';
  import AdvanceFilter from './AdvanceFilter.svelte';

  interface ColumnHeaderProps {
    column: Column;
    tableConfiguration: TableConfiguration;
  }

  /** Inputs */
  const { column, tableConfiguration }: ColumnHeaderProps = $props();
  /** States */
  let sortRef: Sort | null = $state<Sort | null>(null);
  let isResizing: boolean = $state(false);
  let startX: number = $state(0);
  let startWidth: number = $state(0);
  let thElement: HTMLTableCellElement | null = $state(null);

  const isSortable: boolean = $derived(column.sortable === true && tableConfiguration.sortableType !== 'none');
  const isAdvanceFilterable: boolean = $derived(
    column.filterable === true && tableConfiguration.filterable === 'advanced'
  );
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
  const partNamesBtn: string = $derived(`column-header-btn column-header-btn-${column.index}`);
  const partNamesContent: string = $derived(`column-header-content column-header-content-${column.index}`);
  const partNamesName: string = $derived(
    ['column-header-name', isSorted ? 'column-header-name-sorted' : null, `column-header-name-${column.index}`]
      .filter(Boolean)
      .join(' ')
  );
  const partNamesResize: string = $derived(`column-header-resize column-header-resize-${column.index}`);
  const partNamesResizeIcon: string = $derived(
    [
      'column-header-resize-icon',
      `column-header-resize-icon-${column.index}`,
      isSorted ? 'column-header-resize-icon-sorted' : null
    ]
      .filter(Boolean)
      .join(' ')
  );

  /** Methods */
  function handleResizeMouseDown(event: MouseEvent) {
    event.stopPropagation();
    event.preventDefault();

    if (!thElement) return;

    isResizing = true;
    startX = event.clientX;
    startWidth = thElement.getBoundingClientRect().width;

    thElement.style.width = `${startWidth}px`;
    thElement.style.minWidth = `${startWidth}px`;

    // Agregar clase para mejorar el rendering durante resize
    thElement.style.willChange = 'width';
    document.body.style.cursor = 'ew-resize';
    document.body.style.userSelect = 'none';

    document.addEventListener('mousemove', handleResizeMouseMove);
    document.addEventListener('mouseup', handleResizeMouseUp);
  }

  function handleResizeMouseMove(event: MouseEvent) {
    if (!isResizing || !thElement) return;

    // Usar requestAnimationFrame para suavizar el movimiento
    requestAnimationFrame(() => {
      const diff = event.clientX - startX;
      const newWidth = Math.max(50, startWidth + diff);
      thElement!.style.width = `${newWidth}px`;
      thElement!.style.minWidth = `${newWidth}px`;
    });
  }

  function handleResizeMouseUp() {
    isResizing = false;

    // Limpiar estilos temporales
    if (thElement) {
      thElement.style.willChange = 'auto';
    }
    document.body.style.cursor = '';
    document.body.style.userSelect = '';

    document.removeEventListener('mousemove', handleResizeMouseMove);
    document.removeEventListener('mouseup', handleResizeMouseUp);
  }

  function handleHeaderClick(event: MouseEvent) {
    if (tableConfiguration.filterable !== 'advanced') {
      event.stopPropagation();
      sortRef?.toggleSort();
    }
  }
</script>

<th bind:this={thElement} class={partNamesTh} part={partNamesTh} style={styleTransformer.toString(column?.style)}>
  <button class={partNamesBtn} part={partNamesBtn} onclick={(e) => handleHeaderClick(e)}>
    <div class={partNamesContent} part={partNamesContent}>
      <span class={partNamesName} part={partNamesName}>{column?.name}</span>
      {#if isSortable}
        <Sort bind:this={sortRef} {column} />
      {/if}

      {#if isAdvanceFilterable}
        <AdvanceFilter {column} />
      {/if}
    </div>
  </button>
  <!-- svelte-ignore a11y_no_static_element_interactions -->
  <!-- svelte-ignore a11y_no_noninteractive_element_interactions -->
  {#if tableConfiguration.resizable === true && column.resizable === true && loadingState() === false}
    <div class={partNamesResize} part={partNamesResize} onmousedown={handleResizeMouseDown} role="separator">
      <img src={resizeIcon} class={partNamesResizeIcon} part={partNamesResizeIcon} alt="resize" />
    </div>
  {/if}
</th>

<style>
  th {
    text-align: left;
    box-sizing: border-box;
    position: relative;

    min-width: max-content;
    white-space: nowrap;
  }

  .column-header-content {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    margin-left: var(--table-column-margin-left);
  }

  .column-header-th {
    border-bottom: 1px solid var(--table-header-border-bottom-color);
    border-top: 1px solid var(--table-header-border-top-color);
    border-left: 1px solid var(--table-header-border-left-color);
    border-right: 1px solid var(--table-header-border-right-color);
    background: var(--table-header-background);
    position: relative;
  }

  .column-header-btn {
    background: none;
    border: none;
    cursor: pointer;

    width: 100%;
    height: var(--table-header-height);
    padding: 0 16px 0 0;

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

  .column-header-name-sorted {
    color: var(--table-header-sorted-text-color);
  }

  .resize-handle {
    position: absolute;
    right: 0;
    top: 0;
    bottom: 0;
    width: 8px;
    cursor: col-resize;
    display: flex;
    align-items: center;
    justify-content: center;
    opacity: 0;
    transition: opacity 0.2s;
    user-select: none;
  }

  .column-header-resize {
    cursor: ew-resize;
    position: absolute;
    right: 0.5px;
    top: 0;
    bottom: 0;
    width: 8px;
    display: flex;
    align-items: end;
    justify-content: end;
  }

  .column-header-resize-icon {
    width: 22px;
    height: 22px;
    pointer-events: none;
  }

  .column-header-resize-icon-sorted {
    filter: invert(1) drop-shadow(0 0 0 var(--table-header-resized-icon-color))
      drop-shadow(0 0 0 var(--table-header-resized-icon-color));
  }
</style>
