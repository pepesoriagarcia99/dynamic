<script lang="ts">
  import { onMount } from 'svelte';
  import type { Column } from '../../models/Column';
  import type { TableConfiguration } from '../../models/configuration/TableConfiguration';
  import type { RowData, RowEvent, RowEventType } from '../../models/event/RowEvent';
  import { selectionStore } from '../../store/selection-store';
  import ColumnValue from './ColumnValue.svelte';

  interface RowProps {
    index?: number;
    columns?: Column[];
    row: RowData;
    tableConfiguration: TableConfiguration;
    onClick?: (event: RowEvent) => void;
  }

  /** Inputs */
  const { index = 0, columns = [], row, tableConfiguration, onClick = () => {} }: RowProps = $props();

  /** Values */
  let isSelected = $state<boolean>(false);
  let isSelectableRow = $derived<boolean>(tableConfiguration.selectableType !== 'none');

  /** Computed */
  const partNames: string = $derived(
    [
      'row',
      index % 2 === 0 ? 'row-even' : 'row-odd',
      isSelected ? 'row-selected' : null,
      isSelectableRow ? 'row-selectable' : null
    ]
      .filter(Boolean)
      .join(' ')
  );

  /** Methods */
  onMount(() => {
    const selectionComponent = selectionStore.add(row.__key, false);
    selectionComponent.subscribe((event) => {
      isSelected = event.value ?? false;
    });
  });

  function onRowClick(type: RowEventType, event?: MouseEvent) {
    onClick({
      type,
      index,
      row,
      ctx: {
        CTRL: event ? event.ctrlKey || event.metaKey : false,
        SHIFT: event ? event.shiftKey : false
      }
    });
  }

  function onCellClick(event: RowEvent) {
    event.index = index;
    onClick(event);
  }
</script>

<tr
  part={partNames}
  class={partNames}
  onclick={(e) => onRowClick('leftclick', e)}
  oncontextmenu={() => onRowClick('rightclick')}
  ondblclick={() => onRowClick('doubleclick')}
>
  {#each columns as column}
    <ColumnValue {column} {row} onClick={(event) => onCellClick(event)} />
  {/each}
</tr>

<style>
  .row {
    height: 50px;
  }

  /* SOLO SI ES SELECTABLE */
  .row-selectable:hover {
    cursor: pointer;
    background: var(--gray-light-5);
  }
</style>
