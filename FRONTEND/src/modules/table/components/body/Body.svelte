<script lang="ts">
  import { getContext } from 'svelte';
  import type { ColumnCompiled } from '../../models/column/Column';
  import type { TableConfiguration } from '../../models/configuration/TableConfiguration';
  import type { RowEvent } from '../../models/event/RowEvent';
  import Row from './Row.svelte';
  import { CONTEXT_MENU_VISIBLE_STATE, SELECTION_EVENT_NAME, TABLE_CONFIGURATION_STATE } from '../../constant';
  import type { ContextConfiguration } from '../../models/configuration/ContextConfiguration';

  interface BodyProps {
    primaryKey: string;
    columns: ColumnCompiled[];
    data: any[];
    dispatchEvent: (event: CustomEvent) => void;
    ontoggle: (event: RowEvent, selectedIds: any[]) => void;
  }

  /** Inputs */
  const { primaryKey, columns, data, dispatchEvent, ontoggle }: BodyProps = $props();

  /** Context */
  const tableConfiguration: () => TableConfiguration = getContext(TABLE_CONFIGURATION_STATE);
  const contextMenuVisibleState: () => ContextConfiguration = getContext(CONTEXT_MENU_VISIBLE_STATE);

  /** States */
  let selectedIds: any[] = $state([]);

  /** Methods */
  function _emitSelection() {
    dispatchEvent(
      new CustomEvent(SELECTION_EVENT_NAME, {
        detail: $state.snapshot(selectedIds),
        bubbles: true,
        composed: true
      })
    );
  }

  function onRowClick(event: RowEvent) {
    const key = event.row[primaryKey];

    if (tableConfiguration().selectableType === 'single') {
      if (event.type === 'leftclick') {
        const index = selectedIds.indexOf(key);
        if (index !== -1) {
          selectedIds.splice(index, 1);
        } else {
          selectedIds = [key];
        }
      } else if (event.type === 'rightclick' && contextMenuVisibleState().has === true) {
        selectedIds = [key];
      }

      _emitSelection();
    } else if (tableConfiguration().selectableType === 'multiple') {
      if (event.type === 'leftclick') {
        if (event.ctx.CTRL) {
          const index = selectedIds.indexOf(key);
          if (index !== -1) {
            selectedIds.splice(index, 1);
          } else {
            selectedIds.push(key);
          }
        } else if (event.ctx.SHIFT) {
          // Lógica para selección múltiple con SHIFT
          // Aquí podrías implementar la lógica para seleccionar un rango de filas
        } else {
          selectedIds = [key];
        }
      } else if (event.type === 'rightclick') {
        if (!selectedIds.includes(key)) {
          selectedIds = [key];
        }
      }

      _emitSelection();
    }

    ontoggle(event, $state.snapshot(selectedIds));
  }

  export function selectAll() {
    // const allIds = data.map((row) => row[primaryKey]);
    // selectedIds = allIds;
  }

  export function deselectAll() {
    selectedIds = [];
  }
</script>

{#each data as row, index (row[primaryKey])}
  <Row {index} {columns} {row} selected={selectedIds.includes(row[primaryKey] as any)} ontoggle={onRowClick} />
{/each}

<style>
</style>
