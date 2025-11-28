<script lang="ts">
  import { styleTransformer } from '../../../../utils/style-transformer';
  import { valueTransformer } from '../../../../utils/value-transformer';
  import type { Column } from '../../models/Column';
  import Image from '../../models/column-types/Image';
  import type { RowEvent, RowEventType } from '../../models/event/RowEvent';

  interface ColumnValueProps {
    column: Column;
    row: any;
    onClick: (event: RowEvent) => void;
  }

  /** Inputs */
  const { column, row, onClick = () => {} }: ColumnValueProps = $props();
  const columnPartNames: string = $derived(`column column-${column.index}`);
  const columnValuePartNames: string = $derived(`column-value column-value-${column.index}`);

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

  function getValue() {
    return valueTransformer.getValue(column.key, row);
  }
</script>

<td
  class={columnPartNames}
  part={columnPartNames}
  style={styleTransformer.toString(column?.style)}
  onclick={(event) => onCellClick(event, 'leftclick')}
  oncontextmenu={(event) => onCellClick(event, 'rightclick')}
  ondblclick={(event) => onCellClick(event, 'doubleclick')}
>
  {#if column.type === Image}
    <img src={getValue()} alt={`Image value ${column.name}`} class={columnValuePartNames} part={columnValuePartNames} />
  {:else}
    <span class={columnValuePartNames} part={columnValuePartNames}>{getValue()}</span>
  {/if}
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
