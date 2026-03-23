<script lang="ts">
  import { getContext } from 'svelte';

  import { CONTEXT_MENU_VISIBLE_STATE, SELECTION_EVENT_NAME, TABLE_CONFIGURATION_STATE } from '../../constant';

  import type { ColumnCompiled } from '../../models/column/Column';
  import type { TableConfiguration } from '../../models/configuration/TableConfiguration';
  import type { RowEvent } from '../../models/event/RowEvent';
  import type { ContextMenuConfiguration } from '../../models/configuration/ContextMenuConfiguration';
  import type { RowData } from '../../models/row/RowData';

  import Row from './Row.svelte';

  interface BodyProps {
    primaryKey: string;
    columns: ColumnCompiled[];
    data: RowData[];
    dispatchEvent: (event: CustomEvent) => void;
    ontoggle: (event: RowEvent, selectedIds: any[]) => void;
  }

  /** Inputs */
  const { primaryKey, columns, data, dispatchEvent, ontoggle }: BodyProps = $props();

  /** Context */
  const tableConfiguration: () => TableConfiguration = getContext(TABLE_CONFIGURATION_STATE);
  const contextMenuVisibleState: () => ContextMenuConfiguration = getContext(CONTEXT_MENU_VISIBLE_STATE);

  /** States */
  let selectedIds: any[] = $state([]);
  let expandedRow: any = $state(null);

  /** Variables */
  let initRangeSelection: number | undefined;

  /** Effects */
  $effect(() => {
    if (!!dispatchEvent) {
      dispatchEvent(
        new CustomEvent(SELECTION_EVENT_NAME, {
          detail: $state.snapshot(selectedIds),
          bubbles: true,
          composed: true
        })
      );
    }
  });

  /** Methods */
  export function onRowClick(event: RowEvent) {
    const key = event.row[primaryKey];

    // Reseteo de selección por rango si no se mantiene presionada la tecla SHIFT
    if (!event.ctx.SHIFT) {
      initRangeSelection = undefined;
    }

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
          if (!initRangeSelection) {
            initRangeSelection = event.index!;
          }

          if (initRangeSelection !== undefined) {
            const start = Math.min(initRangeSelection, event.index!);
            const end = Math.max(initRangeSelection, event.index!);

            for (let i = start; i <= end; i++) {
              selectedIds.push(data[i][primaryKey]);
            }
          }
        } else if (selectedIds.length === 1 && selectedIds.includes(key)) {
          selectedIds = [];
        } else {
          selectedIds = [key];
        }
      } else if (event.type === 'rightclick') {
        if (!selectedIds.includes(key)) {
          selectedIds = [key];
        }
      }
    }

    ontoggle(event, $state.snapshot(selectedIds));

    /**
     * Row expansion logic:
     * - No se mostrara si existen varias filas seleccionadas.
     * - No se mostrara si el evento es por CTRL o SHIFT.
     * - No se mostrara si el evento es por click derecho.
    */
    if (
      tableConfiguration().expansible === true &&
      selectedIds.length === 1 &&
      !event.ctx.SHIFT &&
      !event.ctx.CTRL &&
      event.type !== 'rightclick'
    ) {
      expandedRow = selectedIds[0];
    } else {
      expandedRow = null;
    }
  }

  export function selectAll() {
    data.forEach((row) => {
      const key = row[primaryKey];
      if (!selectedIds.includes(key)) {
        selectedIds.push(key);
      }
    });
  }

  export function deselectAll() {
    selectedIds = [];
  }

  export function getSelectedIds() {
    return $state.snapshot(selectedIds);
  }
</script>

{#each data as row, index (row[primaryKey])}
  <Row
    {index}
    {columns}
    {row}
    selectableType={tableConfiguration().selectableType}
    selected={selectedIds.includes(row[primaryKey] as any)}
    expanded={expandedRow === row[primaryKey]}
    rowConfiguration={tableConfiguration().configurationCompiled}
    ontoggle={onRowClick}
  >
    <slot name="row-expansion" slot="expansion" />
  </Row>
{/each}

<style>
</style>
