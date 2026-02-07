<script lang="ts">
  import { onMount } from 'svelte';
  import type { Column } from '../../models/column/Column';
  import type { TableConfiguration } from '../../models/configuration/TableConfiguration';
  import type { RowEvent } from '../../models/event/RowEvent';
  import type { RowData } from '../../models/RowData';

  // import { selectionStore } from '../../store/selection-store';
  import ColumnValue from './ColumnValue.svelte';
  import { ROW_CLICK_EVENT_NAME } from '../../constant';
  import { selectionStore } from '../../store/selection-store';

  interface RowProps {
    index?: number;
    columns?: Column[];
    row: RowData;
    tableConfiguration: TableConfiguration;
    contextMenu: boolean;
    onClick?: (event: RowEvent) => void;
  }

  /** Inputs */
  const {
    index = 0,
    columns = [],
    row,
    tableConfiguration,
    contextMenu = false,
    onClick = () => {}
  }: RowProps = $props();

  /** Values */
  let el: HTMLElement;
  const key = row[tableConfiguration.primaryKey!];

  let isSelected = $state<boolean>(false);

  /** Computed */
  let rowStaticStyle: string = `${index % 2 === 0 ? 'row-even' : 'row-odd'}`;
  const rowStyle: string = $derived(
    ['row', isSelected ? 'row-selected' : tableConfiguration.selectableType !== 'none' ? 'row-selectable' : null]
      .filter(Boolean)
      .join(' ')
  );

  /** Methods */
  /**
   * TODO: IDEA DE REFACTORING
   * En vez de regenerar los comoponentes Row, lo que hago es mutarlos
   */
  // $effect(() => {
  //   let subscribeId: string;

  //   if (row) {
  //     const key = row[tableConfiguration.primaryKey!];
  //     let selectionComponent = selectionStore.get(key);

  //     if (selectionComponent) {
  //       isSelected = selectionComponent.value?.__ctx.isSelected ?? false;
  //       selectionComponent.subscribe((event) => {
  //         isSelected = event.value?.__ctx.isSelected ?? false;
  //       });
  //     } else {
  //       selectionComponent = selectionStore.add(key, row);
  //       subscribeId = selectionComponent.subscribe((event) => {
  //         isSelected = event.value?.__ctx.isSelected ?? false;
  //       });
  //     }

  //     return () => {
  //       selectionComponent.unsubscribe(subscribeId);
  //     };
  //   }
  // });

  onMount(() => {
    isSelected = selectionStore.has(key)

    // let subscribeId: string;
    // selectionComponent = selectionStore.get(key);
    // isSelected = !!selectionComponent;

    // if (selectionComponent) {
    // isSelected = selectionComponent.value?.__ctx.isSelected ?? false;
    // selectionComponent.subscribe((event) => {
    //   isSelected = event.value?.__ctx.isSelected ?? false;
    // });
    // }

    // else {
    //   selectionComponent = selectionStore.add(key, row);
    //   subscribeId = selectionComponent.subscribe((event) => {
    //     isSelected = event.value?.__ctx.isSelected ?? false;
    //   });
    // }

    // return () => {
    //   selectionComponent.unsubscribe(subscribeId);
    // };
  });

  // function onRowClick(type: RowEventType, event?: MouseEvent) {
  //   if (contextMenu) {
  //     event?.preventDefault();
  //   }

  //   onClick({
  //     type,
  //     index,
  //     row,
  //     ctx: {
  //       CTRL: event ? event.ctrlKey || event.metaKey : false,
  //       SHIFT: event ? event.shiftKey : false
  //     },
  //     mouse: {
  //       x: event?.clientX,
  //       y: event?.clientY
  //     }
  //   });
  // }

  function onCellClick(event: RowEvent) {
    event.index = index;
    onClick(event);

    selectionStore.add(key, row);
    isSelected = true;

    // selectionComponent = selectionStore.get(key);

    // if (!selectionComponent) {
    //   selectionComponent = selectionStore.add(key, row);
    //   // selectionComponent.subscribe((event) => {
    //   //   isSelected = event.value?.__ctx.isSelected ?? false;
    //   // });
    // }



    el.dispatchEvent(
      new CustomEvent(ROW_CLICK_EVENT_NAME, {
        detail: event as RowEvent,
        bubbles: true,
        composed: true
      })
    );
  }
</script>

<!-- TODO: IDEA DE REFACTORING -->
<!-- En vez de regenerar los comoponentes Row, lo que hago es mutarlos -->
<!-- style:display={!!row ? 'hidden' : 'none'} -->

<!-- onclick={(e) => onRowClick('leftclick', e)}
  oncontextmenu={() => onRowClick('rightclick')}
  ondblclick={() => onRowClick('doubleclick')} -->
<tr bind:this={el} part={rowStyle + ' ' + rowStaticStyle} class={rowStyle + ' ' + rowStaticStyle}>
  {#each columns as column}
    <ColumnValue {column} {row} {contextMenu} onClick={onCellClick} />
  {/each}
</tr>

<style>
  .row {
    height: var(--table-row-height);
  }

  .row:not(.row-selected) {
    color: var(--table-row-text-color);
  }

  .row-selected {
    background: var(--select-color);
    color: var(--select-text-color);
    cursor: pointer;
  }

  .row-selectable:hover {
    cursor: pointer;
    background: var(--select-hover-color);
  }
</style>
