<script lang="ts">
  import type { Column } from '../../models/column/Column';
  import type { RowEvent, RowEventType } from '../../models/event/RowEvent';

  import { ROW_CLICK_EVENT_NAME, TOOLTIP_DELAY } from '../../constant';
  import { tooltip, tooltipDelay, tooltipPosition } from '../../../tooltip/directives/tooltip';

  import BooleanComponent from './value/Boolean.svelte';
  import Avatar from './value/Avatar.svelte';
  import type { ColorConfiguration } from '../../models/column/ColumnConfiguration';

  interface ColumnValueProps {
    column: Column;
    row: any;
    contextMenu: boolean;
  }

  /** Inputs */
  const { column, row, contextMenu = false }: ColumnValueProps = $props();

  let el: HTMLElement;
  const simpleTypes = new Set(['string', 'number', 'date', 'selector']);
  const isSimpleType = simpleTypes.has(column.type);
  const columnPartNames: string = `column column-${column.index}`;
  const columnValuePartNames: string = `column-value column-value-${column.index}`;
  const value = $state<any>(getElementValue());
  const style = $state<string>(getStyle());

  /** Methods */
  function getElementValue(): any {
    let value: any;
    const key = column.key;
    let keys = key.split('.');

    if (keys.length > 1) {
      let currentValue = row;
      for (const key of keys) {
        const arrayIndexMatch = key.match(/\[(\d+)\]$/);

        if (arrayIndexMatch) {
          const index = parseInt(key.replaceAll(/[^\d]/g, ''));
          currentValue = currentValue[index];
        } else {
          currentValue = currentValue[key];
        }
      }

      value = currentValue;
    } else {
      value = row[key];
    }

    return value;
  }

  function getStyle(): string {
    const configStyle: ColorConfiguration<any>[] = (column.configuration as any)?.colorConfiguration ?? [];
    let style: string = '';

    configStyle.forEach((config) => {
      if (config.range) {
        if (Number(value) >= Number(config.range.min) && Number(value) <= Number(config.range.max)) {
          style = config.style as string;
        }
      } else if (config.value !== undefined && String(value) === String(config.value)) {
        style = config.style as string;
      }
    });

    return style;
  }

  function onCellClick(event: MouseEvent, type: RowEventType) {
    event.stopPropagation();
    if (contextMenu) {
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

<td
  bind:this={el}
  class={columnPartNames}
  part={columnPartNames}
  style={column?.style as string}
  onclick={(event) => onCellClick(event, 'leftclick')}
  oncontextmenu={(event) => onCellClick(event, 'rightclick')}
  ondblclick={(event) => onCellClick(event, 'doubleclick')}
>
  {#if isSimpleType}
    <div
      class={columnValuePartNames}
      part={columnValuePartNames}
      {style}
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
      src={value}
      alt={column.key}
      class={columnValuePartNames}
      part={columnValuePartNames}
      use:tooltip={value?.alt}
      use:tooltipPosition={'right'}
      use:tooltipDelay={TOOLTIP_DELAY}
    />
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
