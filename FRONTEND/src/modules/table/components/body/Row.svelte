<script lang="ts">
  import { onMount } from 'svelte';
  import type { Column } from '../../models/column/Column';
  import type { TableConfiguration } from '../../models/configuration/TableConfiguration';
  import type { RowEvent, RowEventType } from '../../models/event/RowEvent';
  import type { RowData } from '../../models/RowData';

  import { selectionStore } from '../../store/selection-store';
  import ColumnValue from './ColumnValue.svelte';

  interface RowProps {
    index?: number;
    columns?: Column[];
    row: RowData;
    tableConfiguration: TableConfiguration;
    contextMenu: boolean;
    onClick?: (event: RowEvent) => void;
  }

  /** Inputs */
  const {
    index = 0,
    columns = [],
    row,
    tableConfiguration,
    contextMenu = false,
    onClick = () => {}
  }: RowProps = $props();

  /** Values */
  let isSelected = $state<boolean>(false);

  /** Computed */
  let rowStaticStyle: string = `${index % 2 === 0 ? 'row-even' : 'row-odd'}`; 
  const rowStyle: string = $derived(
    [
      'row',
      isSelected ? 'row-selected' : tableConfiguration.selectableType !== 'none' ? 'row-selectable' : null
    ]
      .filter(Boolean)
      .join(' ')
  );

  /** Methods */
  onMount(() => {
    let subscribeId: string;
    const key = row[tableConfiguration.primaryKey!];
    let selectionComponent = selectionStore.get(key);

    if(selectionComponent) {
      isSelected = selectionComponent.value?.__ctx.isSelected ?? false;
      selectionComponent.subscribe((event) => {
        isSelected = event.value?.__ctx.isSelected ?? false;
      });
    } else {
      selectionComponent = selectionStore.add(key, row);
      subscribeId = selectionComponent.subscribe((event) => {
        isSelected = event.value?.__ctx.isSelected ?? false;
      });
    }

    return () => {
      selectionComponent.unsubscribe(subscribeId);
    };
  });

  function onRowClick(type: RowEventType, event?: MouseEvent) {
    if (contextMenu) {
      event?.preventDefault();
    }

    onClick({
      type,
      index,
      row,
      ctx: {
        CTRL: event ? event.ctrlKey || event.metaKey : false,
        SHIFT: event ? event.shiftKey : false
      },
      mouse: {
        x: event?.clientX,
        y: event?.clientY
      }
    });
  }

  function onCellClick(event: RowEvent) {
    event.index = index;
    onClick(event);
  }
</script>

<tr
  part={rowStyle + ' ' + rowStaticStyle}
  class={rowStyle + ' ' + rowStaticStyle}
  onclick={(e) => onRowClick('leftclick', e)}
  oncontextmenu={() => onRowClick('rightclick')}
  ondblclick={() => onRowClick('doubleclick')}
>
  {#each columns as column}
    <ColumnValue {column} {row} {contextMenu} onClick={onCellClick} />
  {/each}
</tr>

<style>
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
</style>
