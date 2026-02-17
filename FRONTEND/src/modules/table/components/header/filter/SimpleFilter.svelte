<script lang="ts">
  import { getContext, onMount } from 'svelte';

  import { FILTER_EVENT_NAME, LOADING_STATE } from '../../../constant';

  import type { ColumnCompiled } from '../../../models/column/Column';

  import Skeleton from '../../Skeleton.svelte';
  import BasicControl from '../../../../controls/components/BasicControl.svelte';

  interface Control {
    column: ColumnCompiled;
    value: string;
  }

  interface FilterProps {
    columns: ColumnCompiled[];
  }

  /** Inputs */
  let { columns }: FilterProps = $props();

  /** Values */
  let el: HTMLElement;

  /** States */
  const loading: () => boolean = getContext(LOADING_STATE);
  let controls: Control[] = $state([]);
  let values: any[] = $state([]);

  /** Methods */
  onMount(() => {
    controls = columns.map((column) => ({
      column,
      value: ''
    }));
  });

  function _emit() {
    const event = controls
      .filter((control) => control.value !== '')
      .map((control) => ({
        key: control.column.key,
        value: control.value
      }));

    el?.dispatchEvent(
      new CustomEvent(FILTER_EVENT_NAME, {
        detail: event,
        bubbles: true,
        composed: true
      })
    );
  }

  function onChange(value: any, control: Control) {
    control.value = value;
    _emit();
  }

  export function reset() {
    controls.forEach((control) => (control.value = ''));
    values = [];
    _emit();
  }
</script>

<tr bind:this={el} class="filter-thead-tr" part="filter-thead-tr">
  {#each controls as control, index}
    {#if control.column.filterable === true}
      {@const partNamesTh = `column-filter-th column-filter-th-${index}`}

      <th class={partNamesTh} part={partNamesTh} style={control.column.compiled.style?.column}>
        {#if loading() === true}
          <div style="padding: 0 8px;">
            <Skeleton height="34px" />
          </div>
        {:else}
          <BasicControl
            id={control.column.key}
            value={values[index]}
            type="text"
            onChange={(v) => onChange(v, control)}
          />
        {/if}
      </th>
    {:else}
      {@const partNamesTh = `column-filter-th column-filter-th-${index} column-filter-th-spacer`}
      <th class={partNamesTh} part={partNamesTh} style={control.column.compiled.style?.column}>
        <!-- space -->
      </th>
    {/if}
  {/each}
</tr>

<style>
  .filter-thead-tr {
    height: var(--table-header-height);
    position: sticky;
    top: var(--table-header-height);
    z-index: 4;
    background: var(--table-header-background);
  }

  .column-filter-th {
    border-bottom: 1px solid var(--table-header-filter-border-bottom-color);
    border-top: 1px solid var(--table-header-filter-border-top-color);
    border-left: 1px solid var(--table-header-filter-border-left-color);
    border-right: 1px solid var(--table-header-filter-border-right-color);
    box-sizing: border-box;
    padding-left: var(--table-column-margin-left);
    padding-right: var(
      --table-column-margin-right
    ); /** El valor debe ser el mismo que padding-left para que quede centrado */
  }
</style>
