<script lang="ts">
  import type { Column } from '../models/Column';
  import type { RowEvent, RowEventType } from '../models/TableEvents';

  // Inputs
  export let column: Column;
  export let row: any;

  // Outputs
  export let onSelect: (event: RowEvent) => void;

  function onCellClick(event: MouseEvent, type: RowEventType) {
    event.stopPropagation();

    onSelect({
      type,
      row,
      column
    });
  }
</script>

<td
  on:click={(event) => onCellClick(event, 'leftclick')}
  on:contextmenu={(event) => onCellClick(event, 'rightclick')}
  on:dblclick={(event) => onCellClick(event, 'doubleclick')}>
  {row[column.key]}
</td>

<style>
</style>
