<script lang="ts">
  import type { ColumnCompiled } from '../../models/column/Column';
  import type { RowEvent } from '../../models/event/RowEvent';
  import Row from './Row.svelte';

  interface BodyProps {
    primaryKey: string;
    columns: ColumnCompiled[];
    data: any[];
    ontoggle: (event: RowEvent) => void;
  }

  const { primaryKey, columns, data, ontoggle }: BodyProps = $props();

  let selectedIds: any[] = $state([]);
  function onRowClick(event: RowEvent) {
    const key = event.row[primaryKey];
    selectedIds.push(key);

    ontoggle(event);
  }

    // function onRowClick(event: RowEvent) {
  //   console.log('-----> ', event);

  // contextMenuVisible = false;

  // if (selectableType !== 'none') {
  //   if (event.type === 'leftclick') {
  //     selectionStore.onSelectToggle(event);
  //   } else if (event.type === 'rightclick' && hasContextMenuSlot === true) {
  //     /**
  //      * Se procesa estado de la seleccion con el menucontextual activo
  //      */
  //     const selectionState = selectionStore.state().filter((el) => el.value?.__ctx.isSelected === true);
  //     const selectionCount = selectionState.length;

  //     const isRightclickHoverSelection = Boolean(selectionState.find((el) => el.key === event.row[primaryKey!]));
  //     if (selectionCount === 0) {
  //       selectionStore.onSelectToggle(event);
  //     } else if (isRightclickHoverSelection === false) {
  //       selectionStore.onSelectToggle(event);
  //     }

  //     // se muestra el menu contextual del usuario
  //     contextMenuVisible = true;
  //     contextMenuEvent = event; // este event es el concreto, usado calcular x e y del contextmenu
  //   }
  // }

  // el.dispatchEvent(
  //   new CustomEvent(ROW_CLICK_EVENT_NAME, {
  //     detail: event as RowEvent,
  //     bubbles: true,
  //     composed: true
  //   })
  // );
  // }
</script>

{#each data as row, index (row[primaryKey])}
  <Row {index} {columns} {row} selected={selectedIds.includes(row[primaryKey] as any)} ontoggle={onRowClick} />
{/each}

<style>
</style>
