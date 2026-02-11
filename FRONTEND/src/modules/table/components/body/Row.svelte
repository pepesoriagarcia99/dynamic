<script lang="ts">
  import { getContext } from 'svelte';

  import { ROW_CLICK_EVENT_NAME, TABLE_CONFIGURATION, TOOLTIP_DELAY } from '../../constant';

  import type { Column, ColumnCompiled } from '../../models/column/Column';
  import type { RowData } from '../../models/RowData';
  import type { RowEvent, RowEventType } from '../../models/event/RowEvent';
  import type { TableConfiguration } from '../../models/configuration/TableConfiguration';
  import type { ContextMenuConfiguration } from '../../models/configuration/ContextMenuConfiguration';

  import { tooltip } from '../../../tooltip/directives/tooltip';

  import Avatar from './value/Avatar.svelte';
  import BooleanComponent from './value/Boolean.svelte';

  interface RowProps {
    index?: number;
    columns?: ColumnCompiled[];
    row: RowData;
  }

  /** Inputs */
  const { index = 0, columns = [], row }: RowProps = $props();

  /** Values */
  let el: HTMLElement;
  const simpleTypes = new Set(['string', 'number', 'date', 'selector']);
  const tableConfiguration: () => TableConfiguration = getContext(TABLE_CONFIGURATION);

  /** States */
  const contextMenuConfiguration: () => ContextMenuConfiguration = getContext(TABLE_CONFIGURATION);

  const isSelected = $state(false);

  let rowStaticStyle: string = `${index % 2 === 0 ? 'row-even' : 'row-odd'}`;
  const rowStyle: string = $derived(
    ['row', isSelected ? 'row-selected' : tableConfiguration().selectableType !== 'none' ? 'row-selectable' : null]
      .filter(Boolean)
      .join(' ')
  );

  /** Methods */

  function onRowClick(event: MouseEvent, type: RowEventType, column?: Column) {
    event.stopPropagation();

    if (contextMenuConfiguration().has) {
      event.preventDefault();
    }

    // if (tableConfiguration.selectableType !== 'none' && type === 'leftclick') {
    //   toggle(key);
    // }

    el.dispatchEvent(
      new CustomEvent(ROW_CLICK_EVENT_NAME, {
        detail: {
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
        } as RowEvent,
        bubbles: true,
        composed: true
      })
    );
  }
</script>

<tr bind:this={el} part={rowStyle + ' ' + rowStaticStyle} class={rowStyle + ' ' + rowStaticStyle}>
  {#each columns as column}
    {@const value = column.compiled.valueGetter(row)}

    <td
      style={column.compiled.style?.column}
      class={column.compiled.class.column}
      part={column.compiled.class.column}
      onclick={(event) => onRowClick(event, 'leftclick', column)}
      oncontextmenu={(event) => onRowClick(event, 'rightclick', column)}
      ondblclick={(event) => onRowClick(event, 'doubleclick', column)}
    >
      {#if simpleTypes.has(column.type)}
        <!-- {@const style = column.compiled.styleGetter!(value)} -->

        <!-- {style} -->
        <div
          {@attach tooltip({ value, position: 'right', delay: TOOLTIP_DELAY })}
          class={column.compiled.class.columnValue}
          part={column.compiled.class.columnValue}
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
          {@attach tooltip({ value, position: 'right', delay: TOOLTIP_DELAY })}
          src={value}
          alt={column.key}
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
