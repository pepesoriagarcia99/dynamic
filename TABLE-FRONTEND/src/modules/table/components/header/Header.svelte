<script lang="ts">
  import { getContext } from 'svelte';

  import { LOADING_STATE, SORT_EVENT_NAME, TABLE_CONFIGURATION_STATE, TOOLTIP_DELAY } from '../../constant';

  import type { ColumnCompiled } from '../../models/column/Column';
  import type { SortEvent } from '../../models/event/TableEvent';
  import type { TableConfiguration } from '../../models/configuration/TableConfiguration';
  import type { FilterElement } from '../../../filter/models/Elements';

  import resizeIcon from '../../../../assets/svg/resize.svg';
  import advanceFilterIcon from '../../../../assets/svg/advance-filter.svg';
  import advanceFilterFillIcon from '../../../../assets/svg/advance-filter-fill.svg';

  import { tooltip } from '../../../tooltip/directives/tooltip';

  import SimpleFilter from './SimpleFilter.svelte';
  import SimpleMenu from '../../../core/components/SimpleMenu.svelte';
  import AdvanceFilter from '../../../filter/components/AdvanceFilter.svelte';
  import Sort from './Sort.svelte';
  import Skeleton from '../Skeleton.svelte';

  interface HeaderProps {
    columns: ColumnCompiled[];
  }

  /** Inputs */
  const { columns }: HeaderProps = $props();

  /** Values */
  let el: HTMLElement;

  /** Contexts */
  const loading: () => boolean = getContext(LOADING_STATE);
  const tableConfiguration: () => TableConfiguration = getContext(TABLE_CONFIGURATION_STATE);

  /** States */
  let sorts: SortEvent[] = $state([]);
  let isResizing: boolean = $state(false);
  let startX: number = $state(0);
  let startWidth: number = $state(0);
  let thElements: HTMLTableCellElement[] = $state([]);
  let simpleFilter: SimpleFilter | null = $state<SimpleFilter | null>(null);
  let advanceFilterMenu: SimpleMenu[] = $state([]);
  let advanceFilterValues: FilterElement[] = $state(
    columns.map(() => ({
      type: 'block',
      operator: 'AND',
      expanded: true,
      value: []
    }))
  );

  /** Values */
  let onMouseMove: ((e: MouseEvent) => void) | null = null;
  let onMouseUp: (() => void) | null = null;

  /** Methods */
  function handleResizeMouseDown(event: MouseEvent, index: number) {
    event.stopPropagation();
    event.preventDefault();

    const thElement = thElements[index];
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

    onMouseMove = (e: MouseEvent) => handleResizeMouseMove(e, thElement);
    onMouseUp = () => handleResizeMouseUp(thElement);

    document.addEventListener('mousemove', onMouseMove);
    document.addEventListener('mouseup', onMouseUp);
  }

  function handleResizeMouseMove(event: MouseEvent, thElement: HTMLTableCellElement) {
    if (!isResizing || !thElement) return;

    // Usar requestAnimationFrame para suavizar el movimiento
    requestAnimationFrame(() => {
      const diff = event.clientX - startX;
      const newWidth = Math.max(50, startWidth + diff);
      thElement!.style.width = `${newWidth}px`;
      thElement!.style.minWidth = `${newWidth}px`;
    });
  }

  function handleResizeMouseUp(thElement: HTMLTableCellElement) {
    isResizing = false;

    // Limpiar estilos temporales
    if (thElement) {
      thElement.style.willChange = 'auto';
    }
    document.body.style.cursor = '';
    document.body.style.userSelect = '';

    if (onMouseMove) {
      document.removeEventListener('mousemove', onMouseMove);
      onMouseMove = null;
    }
    if (onMouseUp) {
      document.removeEventListener('mouseup', onMouseUp);
      onMouseUp = null;
    }
  }

  function handleSort(key: string) {
    const index = sorts.findIndex((event) => event.key === key);
    if (index === -1) {
      sorts.push({ key, direction: 'asc' });
    } else {
      const currentDirection = sorts[index].direction;
      if (currentDirection === 'asc') {
        sorts[index].direction = 'desc';
      } else if (currentDirection === 'desc') {
        sorts.splice(index, 1);
      }
    }

    el.dispatchEvent(
      new CustomEvent(SORT_EVENT_NAME, {
        detail: $state.snapshot(sorts),
        bubbles: true,
        composed: true
      })
    );
  }

  function handlerOpenAdvanceFilter(currentIndex: number) {
    advanceFilterMenu.forEach((menu, index) => {
      if (index !== currentIndex && menu.menuState() === true) {
        menu.closeMenu();
      }
    });
  }

  // function onApplyAdvanceFilter(filter: FilterElement, index: number) {
  //   console.log('🚀 ~ onApplyAdvanceFilter ~ index:', index);
  //   console.log('🚀 ~ onApply ~ filter:', filter);

  //   advanceFilterValues[index] = filter;
  //   console.log('🚀 ~ onApplyAdvanceFilter ~ advanceFilterValues:', advanceFilterValues);
  // }

  export function deselectAllSorts() {
    sorts = [];
  }

  export function getSortState() {
    return $state.snapshot(sorts);
  }

  export function getSimpleFilter(): SimpleFilter | null {
    return simpleFilter;
  }
</script>

<thead bind:this={el} class="thead" part="thead">
  <tr class="thead-tr" part="thead-tr">
    {#each columns as column, index}
      {@const partNamesTh = `column-header-th column-header-th-${index}`}
      {@const partNamesContent = `column-header-content column-header-content-${index}`}
      {@const partNamesName = `column-header-name column-header-name-${index}`}

      <th bind:this={thElements[index]} class={partNamesTh} part={partNamesTh} style={column.compiled.style?.column}>
        <div class={partNamesContent} part={partNamesContent}>
          <span
            class={partNamesName}
            part={partNamesName}
            {@attach tooltip({ value: column?.name, position: 'top', delay: TOOLTIP_DELAY })}>{column?.name}</span
          >
          {#if tableConfiguration().sortableType !== 'none' && column.sortable === true}
            <Sort {index} {column} sort={sorts.find((e) => e.key === column.key) || null} {handleSort} />
          {/if}

          {#if $$slots['advanced'] && tableConfiguration().filterableType === 'custom'}
            <slot name="advanced" {index} {column} />
          {:else if tableConfiguration().filterableType === 'advanced' && column.filterable === true}
            {#if loading() === true}
              <Skeleton width="26px" height="26px" />
            {:else}
              <SimpleMenu
                bind:this={advanceFilterMenu[index]}
                width={330}
                height="auto"
                onOpen={() => handlerOpenAdvanceFilter(index)}
              >
                <div slot="icon">
                  {#if advanceFilterMenu[index]?.menuState() || advanceFilterValues[index].value.length > 0}
                    <img src={advanceFilterFillIcon} alt="Advance filter" />
                  {:else}
                    <img src={advanceFilterIcon} alt="Advance filter" />
                  {/if}
                </div>

                <div slot="body">
                  <AdvanceFilter bind:value={advanceFilterValues[index]} columnField={column.key} />
                </div>
              </SimpleMenu>
            {/if}
          {/if}
        </div>
        <!-- svelte-ignore a11y_no_static_element_interactions -->
        <!-- svelte-ignore a11y_no_noninteractive_element_interactions -->
        {#if loading() === false && tableConfiguration().resizable === true && (column.resizable === true || column.resizable === undefined)}
          {@const partNamesResize = `column-header-resize column-header-resize-${index}`}
          {@const partNamesResizeIcon = `column-header-resize-icon column-header-resize-icon-${index}`}

          <div
            class={partNamesResize}
            part={partNamesResize}
            onmousedown={(e) => handleResizeMouseDown(e, index)}
            role="separator"
          >
            <img src={resizeIcon} class={partNamesResizeIcon} part={partNamesResizeIcon} alt="resize" />
          </div>
        {/if}
      </th>
    {/each}
  </tr>

  {#if tableConfiguration().filterableType === 'simple'}
    <SimpleFilter bind:this={simpleFilter} {columns} />
  {:else if $$slots['simple'] && tableConfiguration().filterableType === 'custom'}
    <slot name="simple" />
  {/if}
</thead>

<style>
  .thead {
    background: var(--table-header-background);
  }

  .thead-tr {
    height: var(--table-header-height);
    position: sticky;
    top: 0;
    z-index: 5;
    background: var(--table-header-background);
  }

  th {
    text-align: left;
    box-sizing: border-box;
    position: relative;

    width: auto;
    min-width: max-content;
    white-space: nowrap;
  }

  .column-header-content {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    margin-left: var(--table-column-margin-left);
    margin-right: 20px; /* Espacio para el ícono de resize */
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
    cursor: default;

    width: 100%;
    height: var(--table-header-height);
    padding: 0 16px 0 0;

    font-weight: 600;
    font-size: 16px;
  }

  .column-header-name {
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    max-width: 100%;
    cursor: default;
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
</style>
