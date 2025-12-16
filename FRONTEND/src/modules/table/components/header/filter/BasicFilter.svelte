<script lang="ts">
  import { CONTROL_EVENT_NAME } from '../../../constant';

  import type { Column } from '../../../models/column/Column';
  import type { BasicControlEvent } from '../../../models/event/ControlEvent';
  import type { StoreComponent, StoreComponentData } from '../../../../core/models/StoreComponent';

  import { filterStore } from '../../../store/filter-store';
  import { styleTransformer } from '../../../../../utils/style-transformer';
  import { loadingState } from '../../../store/loading-state.svelte';

  import Skeleton from '../../Skeleton.svelte';
  import BasicControl from '../../../../controls/components/BasicControl.svelte';

  interface Control {
    column: Column;
    storeComponent: StoreComponent<string>;
    subscribeId?: string;
    value: string;
  }

  interface FilterProps {
    columns: Column[];
    filterValue?: string;
  }

  /** Inputs */
  let { columns }: FilterProps = $props();
  let trElement: HTMLTableRowElement | undefined = $state();
  let controls: Control[] = $state([]);

  /** Methods */
  $effect(() => {
    controls = columns.map((column) => {
      const control: Control = {
        column,
        storeComponent: filterStore.add(column.key, ''),
        value: ''
      };

      const subscribeId = control.storeComponent.subscribe((change: StoreComponentData<string>) => {
        control.value = change.value ?? '';
      });
      control.subscribeId = subscribeId;

      return control;
    });
  });

  function onChange(control: Control, value: any) {
    control.storeComponent.setValue(value);

    if (trElement) {
      trElement.dispatchEvent(
        new CustomEvent(`${CONTROL_EVENT_NAME}_${control.column.index}`, {
          detail: {
            column: control.column,
            value
          } as BasicControlEvent,
          bubbles: true,
          composed: true
        })
      );
    }
  }
</script>

<tr bind:this={trElement} class="filter-thead-tr" part="filter-thead-tr">
  {#each controls as control}
    {#if control.column.filterable === true}
      <th
        class="column-filter-th column-filter-th-{control.column.index}"
        part="column-filter-th column-filter-th-{control.column.index}"
        style={styleTransformer.toString(control.column?.style)}
      >
        {#if loadingState() === true}
          <div style="padding: 0 8px;">
            <Skeleton height="34px" />
          </div>
        {:else}
          <BasicControl id={control.column.key} type="text" onChange={(value) => onChange(control, value)} />
        {/if}
      </th>
    {:else}
      <th
        class="column-filter-th column-filter-th-{control.column.index} column-filter-th-spacer"
        part="column-filter-th column-filter-th-{control.column.index}"
        style={styleTransformer.toString(control.column?.style)}
      >
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
    padding-right: var(--table-column-margin-right); /** El valor debe ser el mismo para que quede centrado */
  }
</style>
