<script lang="ts">
  import type { Column } from '../../models/column/Column';
  import type { RowEvent, RowEventType } from '../../models/event/RowEvent';

  import { TOOLTIP_DELAY } from '../../constant';
  import { tooltip, tooltipDelay, tooltipPosition } from '../../../tooltip/directives/tooltip';

  import BooleanComponent from './value/Boolean.svelte';
  import Avatar from './value/Avatar.svelte';
  import { TransformerFactory } from '../../services/TransformerFactory';

  interface ColumnValueProps {
    column: Column;
    row: any;
    contextMenu: boolean;
    onClick: (event: RowEvent) => void;
  }

  /** Inputs */
  const { column, row, contextMenu = false, onClick = () => {} }: ColumnValueProps = $props();

  const simpleTypes = new Set(['string', 'number', 'date', 'selector']);
  const columnPartNames: string = `column column-${column.index}`;
  const columnValuePartNames: string = `column-value column-value-${column.index}`;

  /** Methods */
  const transformer = TransformerFactory.createTransformer(column);
  let value: any = $state<any>(transformer.getValue(row));

  function onCellClick(event: MouseEvent, type: RowEventType) {
    event.stopPropagation();
    if (contextMenu) {
      event?.preventDefault();
    }

    onClick({
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
    });
  }
</script>

<td
  class={columnPartNames}
  part={columnPartNames}
  style={column?.style as string}
  onclick={(event) => onCellClick(event, 'leftclick')}
  oncontextmenu={(event) => onCellClick(event, 'rightclick')}
  ondblclick={(event) => onCellClick(event, 'doubleclick')}
>
  {#if simpleTypes.has(column.type)}
    <div
      class={columnValuePartNames}
      part={columnValuePartNames}
      style={(column.configuration as any)?.colorConfiguration?.style }
      use:tooltip={value}
      use:tooltipPosition={'right'}
      use:tooltipDelay={TOOLTIP_DELAY}
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
      src={value?.src}
      alt={value?.alt}
      class={columnValuePartNames}
      part={columnValuePartNames}
      use:tooltip={value?.alt}
      use:tooltipPosition={'right'}
      use:tooltipDelay={TOOLTIP_DELAY}
    />
  {:else if column.type === 'relative-date'}
    <relative-time datetime={value}></relative-time>
  {/if}
</td>

<style>
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
