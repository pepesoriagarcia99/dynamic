<svelte:options customElement="dyn-table" />

<script lang="ts">
  import { onMount } from 'svelte';
  import {
    DEFAULT_FILTERABLE,
    DEFAULT_SELECT_ALL,
    DEFAULT_SELECTABLE_TYPE,
    DEFAULT_SORTABLE,
    VALID_SELECTABLE_TYPES
  } from '../constant';
  import type { Column } from '../models/Column';
  import type { RowData, RowEvent } from '../models/TableEvents';
  import type { SelectableType, SortableType, TableConfiguration } from '../models/configuration/TableConfiguration';
  import { selectionStore } from '../store/selection-store.svelte';

  import Header from './Header.svelte';
  import Row from './Row.svelte';

  interface TableProps {
    columns?: Column[];
    loading?: boolean;
    data?: any[];
    selectableType?: SelectableType;
    selectAll?: boolean;
    filterable?: boolean;
    sortableType?: SortableType;
  }

  let el: HTMLElement;

  /** Inputs */
  let {
    columns = [],
    loading = false,
    data = [],
    selectableType = DEFAULT_SELECTABLE_TYPE,
    selectAll = DEFAULT_SELECT_ALL,
    filterable = DEFAULT_FILTERABLE,
    sortableType = DEFAULT_SORTABLE
  }: TableProps = $props();

  console.log('🚀 ~ loading:', loading);

  /** Checks */

  // Static checks
  if (!Array.isArray(columns) || columns.length === 0) {
    throw new Error('The "columns" property must be a non-empty array.');
  }

  // Reactive checks
  $effect(() => {
    // Valida que el selectableType sea valido
    if (selectableType && !VALID_SELECTABLE_TYPES.includes(selectableType)) {
      throw new Error(
        `The "selectableType" property must be one of the following values: ${VALID_SELECTABLE_TYPES.join(', ')}.`
      );
    }

    // la columna __key no puede ser usada por el usuario si la tabla es seleccionable
    if (selectableType !== 'none' && columns.findIndex((col) => col.key === '__key') !== -1) {
      throw new Error('The column "__key" is reserved for selection functionality and cannot be used.');
    }

    // selectAll no puede ser true si selectableType es none
    if (selectAll === true && selectableType === 'none') {
      throw new Error('The "selectAll" property cannot be true when "selectableType" is "none".');
    }
  });

  /** Computed */
  const keyedData: RowData[] = $derived(data.map((r) => (r.__key ? r : { ...r, __key: crypto.randomUUID() })));
  const tableConfiguration: TableConfiguration = $derived({
    selectableType,
    selectAll,
    filterable,
    sortableType
  });

  /** Methods */
  onMount(() => {
    selectionStore.init(tableConfiguration);
    selectionStore.subscribe((selection) => {
      el.dispatchEvent(
        new CustomEvent('selection', {
          detail: selection,
          bubbles: true,
          composed: true
        })
      );
    });
  });

  function onRowClick(event: RowEvent) {
    if (selectableType !== 'none') {
      selectionStore.onSelectToggle(event);
    }

    el.dispatchEvent(
      new CustomEvent('rowClick', {
        detail: event,
        bubbles: true,
        composed: true
      })
    );
  }

  // function onSelectChange() {

  // }
</script>

<!-- TODO: CREAR LOS SLOTS -->
<!-- slot de loading -->
<!-- slot de not data -->
<!-- slot: menu contextual -->

<table bind:this={el} class="table" part="table">
  <Header {columns} {tableConfiguration} />

  <tbody class="tbody" part="tbody">
    {#each keyedData as row, i}
      <Row index={i} {columns} {row} {tableConfiguration} onClick={(event) => onRowClick(event)} />
    {/each}
  </tbody>
</table>

<style>
  .table {
    width: 100%;
  }
</style>
