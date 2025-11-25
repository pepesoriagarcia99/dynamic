<script lang="ts">
  import type { Column } from '../../models/Column';
  import type { RowEvent, RowEventType } from '../../models/event/RowEvent';

  interface ColumnValueProps {
    column: Column;
    row: any;
    onClick: (event: RowEvent) => void;
  }

  /** Inputs */
  const { column, row, onClick = () => {} }: ColumnValueProps = $props();

  /** Methods */
  function onCellClick(event: MouseEvent, type: RowEventType) {
    event.stopPropagation();

    onClick({
      type,
      row,
      column,
      ctx: {
        CTRL: event.ctrlKey || event.metaKey,
        SHIFT: event.shiftKey
      }
    });
  }
</script>

<td
  onclick={(event) => onCellClick(event, 'leftclick')}
  oncontextmenu={(event) => onCellClick(event, 'rightclick')}
  ondblclick={(event) => onCellClick(event, 'doubleclick')}
>
  {row[column.key]}
</td>

<style>
  td {
    border-bottom: 1px solid #ddd;
  }
</style>
