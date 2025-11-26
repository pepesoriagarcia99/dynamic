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
  class="column"
  part="column"
  onclick={(event) => onCellClick(event, 'leftclick')}
  oncontextmenu={(event) => onCellClick(event, 'rightclick')}
  ondblclick={(event) => onCellClick(event, 'doubleclick')}
>
  <span class="column-value" part="column-value">{row[column.key]}</span>
</td>

<style>
  .column {
    border-bottom: 1px solid var(--row-border-bottom-color);
    border-top: 1px solid var(--row-border-top-color);
    border-left: 1px solid var(--row-border-left-color);
    border-right: 1px solid var(--row-border-right-color);
  }

  .column-value {
    margin-left: 6px;
  }
</style>
