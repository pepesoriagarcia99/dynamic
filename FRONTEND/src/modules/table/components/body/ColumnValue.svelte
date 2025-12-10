<script lang="ts">
  import type { Column } from '../../models/column/Column';
  import type { RowEvent, RowEventType } from '../../models/event/RowEvent';
  import type {
    AvatarColumnConfiguration,
    ColorConfiguration,
    DateColumnConfiguration,
    ImageColumnConfiguration,
    NumberColumnConfiguration,
    StringColumnConfiguration
  } from '../../models/column/ColumnConfiguration';

  import { styleTransformer } from '../../../../utils/style-transformer';
  import { valueTransformer } from '../../../../utils/value-transformer';

  import moment from 'moment';
  import { onMount } from 'svelte';
  import BooleanComponent from './value/Boolean.svelte';
  import Avatar from './value/Avatar.svelte';

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
  let style: string = $state<string>('');

  /** Methods */
  onMount(() => {
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

  function getColumnValueStyle(colorConfiguration: ColorConfiguration<any>[], columnValue: any): string {
    let styles: string[] = [];

    colorConfiguration.forEach((config) => {
      const color = config.color;

      if (config.range) {
        if (Number(columnValue) >= Number(config.range.min) && Number(columnValue) <= Number(config.range.max)) {
          if (color.text) {
            styles.push(`color: ${color.text}`);
          }
          if (color.background) {
            styles.push(`background-color: ${color.background}`);
          }
        }
      } else if (config.value !== undefined && String(columnValue) === String(config.value)) {
        if (color.text) {
          styles.push(`color: ${color.text}`);
        }
        if (color.background) {
          styles.push(`background-color: ${color.background}`);
        }
      }
    });

    if(styles.length > 0) {
      styles.push('font-weight: 600');
      styles.push('border-radius: 4px');
    }

    return styles.join('; ');
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

      if (configuration?.colorConfiguration && configuration?.colorConfiguration) {
        style = getColumnValueStyle(configuration.colorConfiguration, rowValue);
      }
    } else if (column.type === 'Number') {
      const configuration = column.configuration as NumberColumnConfiguration;
      let locale =
        configuration?.IntlNumberFormat?.locale && isLocaleCode(configuration.IntlNumberFormat.locale) === true
          ? configuration.IntlNumberFormat.locale
          : navigator.language;

      transformedValue = new Intl.NumberFormat(locale, configuration?.IntlNumberFormat?.options ?? {}).format(rowValue);
      if (configuration?.prefix) {
        transformedValue = configuration.prefix + transformedValue;
      }

      if (configuration?.suffix) {
        transformedValue = transformedValue + configuration.suffix;
      }

      if (configuration?.colorConfiguration && configuration?.colorConfiguration.length > 0) {
        style = getColumnValueStyle(configuration.colorConfiguration, rowValue);
      }
    } else if (column.type === 'Date') {
      const configuration = column.configuration as DateColumnConfiguration;

      if (configuration?.format) {
        transformedValue = moment(rowValue).format(configuration.format);
      }

      if (configuration?.colorConfiguration && configuration?.colorConfiguration.length > 0) {
        style = getColumnValueStyle(configuration.colorConfiguration, rowValue);
      }
    } else if (column.type === 'Boolean') {
      transformedValue = new Boolean(String(rowValue).toLocaleLowerCase() === 'true');
    } else if (column.type === 'Image') {
      const configuration = column.configuration as ImageColumnConfiguration;

      transformedValue = {
        src: String(rowValue),
        alt: configuration?.altText ?? `Image value ${column.name}`
      };
    } else if (column.type === 'Avatar') {
      const configuration = column.configuration as AvatarColumnConfiguration;

      let picture = configuration?.pictureUrl;
      if (configuration?.pictureColumn) {
        picture = valueTransformer.getValue(configuration.pictureColumn, row);
      }

      transformedValue = {
        picture: picture,
        name: String(rowValue),
        alt: configuration?.altText ?? `Avatar value ${column.name}`
      };
    }

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
      <div class={columnValuePartNames} part={columnValuePartNames} style={style}>{value}</div>
    {:else if column.type === 'Boolean'}
      <div class={columnValuePartNames} part={columnValuePartNames}>
        <BooleanComponent {value} />
      </div>
    {:else if column.type === 'Avatar'}
      <Avatar {value} />
    {:else if column.type === 'Image'}
      <img src={value.src} alt={value.alt} class={columnValuePartNames} part={columnValuePartNames} />
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
    padding-right: var(--table-column-margin-right);
    width: fit-content;
  }
</style>
