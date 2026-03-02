<script lang="ts">
  import { ROW_CLICK_EVENT_NAME, TOOLTIP_DELAY } from '../../constant';

  import type { Column, ColumnCompiled } from '../../models/column/Column';
  import type { RowData } from '../../models/RowData';
  import type { RowEvent, RowEventType } from '../../models/event/RowEvent';
  import type { SelectableType } from '../../models/configuration/TableConfiguration';

  import { tooltip } from '../../../tooltip/directives/tooltip';

  import Avatar from './value/Avatar.svelte';
  import BooleanComponent from './value/Boolean.svelte';

  interface RowProps {
    index: number;
    columns: ColumnCompiled[];
    row: RowData;
    selected: boolean;
    selectableType: SelectableType;
    ontoggle: (event: RowEvent) => void;
  }
  /** Inputs */
  const { index, columns, row, selected, selectableType, ontoggle }: RowProps = $props();

  /** Values */
  let tr: HTMLElement;
  const simpleTypes = new Set(['string', 'number', 'date', 'selector']);

  /** States */
  const rowStyle = $derived(
    `row ${index % 2 === 0 ? 'row-even' : 'row-odd'} ${selected ? 'row-selected' : selectableType !== 'none' ? 'row-selectable' : ''}`
  );

  /** Methods */
  function onRowClick(event: MouseEvent, type: RowEventType, column?: Column) {
    event.stopPropagation();

    const customEventDetail: RowEvent = {
      type,
      row,
      column,
      ctx: {
        CTRL: event.ctrlKey || event.metaKey,
        SHIFT: event.shiftKey
      },
      mouse: {
        x: event?.clientX,
        y: event?.clientY
      }
    };

    tr.dispatchEvent(
      new CustomEvent(ROW_CLICK_EVENT_NAME, {
        detail: customEventDetail,
        bubbles: true,
        composed: true
      })
    );

    customEventDetail.mouse.preventDefault = () => event.preventDefault();
    ontoggle(customEventDetail);
  }

  function resolveColumnFromEvent(event: MouseEvent): Column | undefined {
    const td = (event.target as HTMLElement | null)?.closest('td[data-col-index]') as HTMLTableCellElement | null;
    if (!td) return undefined;

    const index = Number(td.dataset.colIndex);
    if (Number.isNaN(index)) return undefined;

    return columns[index] as unknown as Column;
  }

  function onLeftClick(event: MouseEvent) {
    onRowClick(event, 'leftclick', resolveColumnFromEvent(event));
  }

  function onRightClick(event: MouseEvent) {
    onRowClick(event, 'rightclick', resolveColumnFromEvent(event));
  }

  function onDoubleClick(event: MouseEvent) {
    onRowClick(event, 'doubleclick', resolveColumnFromEvent(event));
  }
</script>

<tr
  bind:this={tr}
  part={rowStyle}
  class={rowStyle}
  onclick={onLeftClick}
  oncontextmenu={onRightClick}
  ondblclick={onDoubleClick}
>
  {#each columns as column, colIndex}
    {@const value = column.compiled.valueGetter(row)}
    <td
      data-col-index={colIndex}
      style={column.compiled.style?.column}
      class={column.compiled.class.column}
      part={column.compiled.class.column}
    >
      {#if simpleTypes.has(column.type)}
        <div
          {@attach tooltip({ value, position: 'right', delay: TOOLTIP_DELAY })}
          class={column.compiled.class.columnValue}
          part={column.compiled.class.columnValue}
          style={column.compiled.styleGetter(value)}
        >
          {value}
        </div>
      {:else if column.type === 'boolean'}
        <div class={column.compiled.class.columnValue} part={column.compiled.class.columnValue}>
          <BooleanComponent {value} />
        </div>
      {:else if column.type === 'avatar'}
        <Avatar {value} />
      {:else if column.type === 'image'}
        <img
          src={value.src}
          alt={value?.alt}
          class={column.compiled.class.columnValue}
          part={column.compiled.class.columnValue}
        />
      {/if}
    </td>
  {/each}
</tr>

<style>
  /* ROW */

  .row {
    height: var(--table-row-height);
  }

  .row:not(.row-selected) {
    color: var(--table-row-text-color);
  }

  .row-selected {
    background: var(--select-color);
    color: var(--select-text-color);
    cursor: pointer;
  }

  .row-selectable:hover {
    cursor: pointer;
    background: var(--select-hover-color);
  }

  /* COLUMNA  */

  td {
    white-space: nowrap;
    overflow: hidden;
  }

  .column {
    border-bottom: 1px solid var(--row-border-bottom-color);
    border-top: 1px solid var(--row-border-top-color);
    border-left: 1px solid var(--row-border-left-color);
    border-right: 1px solid var(--row-border-right-color);
  }

  .column-value {
    padding-left: var(--table-column-margin-left);
    padding-right: var(--table-column-margin-right);
    width: fit-content;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }
</style>
