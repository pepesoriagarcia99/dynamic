<script lang="ts">
  import type { Column } from '../../models/column/Column';
  import type { RowEvent, RowEventType } from '../../models/event/RowEvent';
  import type {
    DateColumnConfiguration,
    NumberColumnConfiguration,
    StringColumnConfiguration
  } from '../../models/column/ColumnConfiguration';

  import { styleTransformer } from '../../../../utils/style-transformer';
  import { valueTransformer } from '../../../../utils/value-transformer';

  import moment from 'moment';
  import { onMount } from 'svelte';
  import BooleanComponent from './value/Boolean.svelte';

  interface ColumnValueProps {
    column: Column;
    row: any;
    contextMenu: boolean;
    onClick: (event: RowEvent) => void;
  }

  /** Inputs */
  const { column, row, contextMenu = false, onClick = () => {} }: ColumnValueProps = $props();
  const columnPartNames: string = $derived(`column column-${column.index}`);
  const columnValuePartNames: string = $derived(`column-value column-value-${column.index}`);
  let value: any = $state<any>();

  /** Methods */
  onMount(() => {
    // console.log(column);
    // console.log(row);

    getValue();
  });

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

  function isLocaleCode(locale: string): boolean {
    try {
      Intl.getCanonicalLocales(locale);
      return true;
    } catch {
      return false;
    }
  }

  function getValue() {
    const rowValue = valueTransformer.getValue(column.key, row);
    let transformedValue;

    if (column.type === 'String') {
      const configuration = column.configuration as StringColumnConfiguration;

      if (configuration?.representation && configuration.representation !== 'none') {
        if (configuration.representation === 'uppercase') {
          transformedValue = String(rowValue).toUpperCase();
        } else if (configuration.representation === 'lowercase') {
          transformedValue = String(rowValue).toLowerCase();
        } else if (configuration.representation === 'capitalize') {
          transformedValue = String(rowValue).replace(/\b\w/g, (char) => char.toUpperCase());
        } else if (configuration.representation === 'trim') {
          transformedValue = String(rowValue).trim();
        }
      }
    } else if (column.type === 'Number') {
      const configuration = column.configuration as NumberColumnConfiguration;
      let locale =
        configuration?.locale && isLocaleCode(configuration.locale) === true
          ? configuration.locale
          : navigator.language;

      transformedValue = new Intl.NumberFormat(locale, configuration?.options ?? {}).format(rowValue);

      if (configuration?.prefix) {
        transformedValue = configuration.prefix + transformedValue;
      }

      if (configuration?.suffix) {
        transformedValue = transformedValue + configuration.suffix;
      }
    } else if (column.type === 'Date') {
      const configuration = column.configuration as DateColumnConfiguration;

      if (configuration?.format) {
        transformedValue = moment(rowValue).format(configuration.format);
      }
    } else if (column.type === 'Boolean') {
      transformedValue = new Boolean(String(rowValue).toLocaleLowerCase() === 'true');
    } else if (column.type === 'Image') {
      transformedValue = String(rowValue);
    } else if (column.type === 'Avatar') {
      // return valueTransformer.toTagString(rowValue);
    }
    // else if (column.type === 'Tag') {
    //   // return valueTransformer.toTagString(rowValue);
    // }

    value = transformedValue ?? rowValue;
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
  {#if value !== null && value !== undefined}
    {#if column.type === 'String' || column.type === 'Number' || column.type === 'Date'}
      <span class={columnValuePartNames} part={columnValuePartNames}>{value}</span>
    {:else if column.type === 'Boolean'}
      <div class={columnValuePartNames} part={columnValuePartNames}>
        <BooleanComponent {value} />
      </div>
    {:else if column.type === 'Avatar'}
      <!-- <Avatar src={getValue()} alt={`Avatar value ${column.name}`} class={columnValuePartNames} part={columnValuePartNames} /> -->
    {:else if column.type === 'Image'}
      <img src={value} alt={`Image value ${column.name}`} class={columnValuePartNames} part={columnValuePartNames} />
    {/if}
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
    padding-left: var(--table-column-margin-left);
  }
</style>
