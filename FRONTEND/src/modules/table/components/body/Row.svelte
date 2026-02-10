<script lang="ts">
  import { onMount } from 'svelte';

  import { ROW_CLICK_EVENT_NAME, TOOLTIP_DELAY } from '../../constant';

  import type { Column } from '../../models/column/Column';
  import type { RowData } from '../../models/RowData';
  import type { RowEvent, RowEventType } from '../../models/event/RowEvent';

  import Avatar from './value/Avatar.svelte';
  import BooleanComponent from './value/Boolean.svelte';
  import { tooltip } from '../../../tooltip/directives/tooltip';
  import { getTableConfigurationContext } from '../../context/table-configuration-state.svelte';

  interface RowProps {
    index?: number;
    columns?: Column[];
    row: RowData;
  }

  /** Inputs */
  const { index = 0, columns = [], row }: RowProps = $props();

  /** Values */
  // const key = row[tableConfiguration.primaryKey!];
  let el: HTMLElement;
  const simpleTypes = new Set(['string', 'number', 'date', 'selector']);
  const tableConfiguration = getTableConfigurationContext();

  /** State */
  let isSelected = $state<boolean>(false);

  /** Computed */
  let rowStaticStyle: string = `${index % 2 === 0 ? 'row-even' : 'row-odd'}`;
  const rowStyle: string = $derived(
    ['row', isSelected ? 'row-selected' : tableConfiguration().selectableType !== 'none' ? 'row-selectable' : null]
      .filter(Boolean)
      .join(' ')
  );

  /** Methods */
  onMount(() => {
    // isSelected = selectionStore.has(key)
    // let subscribeId: string;
    // selectionComponent = selectionStore.get(key);
    // isSelected = !!selectionComponent;
    // if (selectionComponent) {
    // isSelected = selectionComponent.value?.__ctx.isSelected ?? false;
    // selectionComponent.subscribe((event) => {
    //   isSelected = event.value?.__ctx.isSelected ?? false;
    // });
    // }
    // else {
    //   selectionComponent = selectionStore.add(key, row);
    //   subscribeId = selectionComponent.subscribe((event) => {
    //     isSelected = event.value?.__ctx.isSelected ?? false;
    //   });
    // }
    // return () => {
    //   selectionComponent.unsubscribe(subscribeId);
    // };
  });

  function onRowClick(event: MouseEvent, type: RowEventType, column?: Column) {
    event.stopPropagation();

    if (tableConfiguration().hasContextMenu) {
      event.preventDefault();
    }

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
    {@const value = column.valueGetter!(row)}

    {@const columnPartNames: string = `column column-${column.index}` }
    {@const columnValuePartNames: string = `column-value column-value-${column.index}` }

    <td
      class={columnPartNames}
      part={columnPartNames}
      style={column?.style as string}
      onclick={(event) => onRowClick(event, 'leftclick', column)}
      oncontextmenu={(event) => onRowClick(event, 'rightclick', column)}
      ondblclick={(event) => onRowClick(event, 'doubleclick', column)}
    >
      {#if simpleTypes.has(column.type)}
        {@const style = column.styleGetter!(value)}
        <div
          {@attach tooltip({ value, position: 'right', delay: TOOLTIP_DELAY })}
          class={columnValuePartNames}
          part={columnValuePartNames}
          {style}
        >
          {value}
        </div>
      {:else if column.type === 'boolean'}
        <div class={columnValuePartNames} part={columnValuePartNames}>
          <BooleanComponent {value} />
        </div>
      {:else if column.type === 'avatar'}
        <Avatar {value} />
      {:else if column.type === 'image'}
        <img
          {@attach tooltip({ value, position: 'right', delay: TOOLTIP_DELAY })}
          src={value}
          alt={column.key}
          class={columnValuePartNames}
          part={columnValuePartNames}
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
