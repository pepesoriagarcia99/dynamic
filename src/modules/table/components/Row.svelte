<script lang="ts">
  import type { Column } from '../models/Column';
  import type { RowEvent, RowEventType } from '../models/TableEvents';
  import ColumnValue from './ColumnValue.svelte';

  // Inputs
  export let index: number = 0;
  export let columns: Column[] = [];
  export let row: any;
  export let selected: boolean = false;

  // Outputs
  export let onSelect: (event: RowEvent) => void;

  function onRowClick(type: RowEventType) {
    onSelect({
      type,
      index,
      row
    });
  }

  function onCellClick(event: RowEvent) {
    event.index = index;
    onSelect(event);
  }
</script>

<tr
  part={`row ${index % 2 === 0 ? 'row-even' : 'row-odd'} ${selected ? 'row-selected' : ''}`}
  on:click={() => onRowClick('leftclick')}
  on:contextmenu={() => onRowClick('rightclick')}
  on:dblclick={() => onRowClick('doubleclick')}
  >
  {#each columns as column}
    <ColumnValue {column} {row} onSelect={(event) => onCellClick(event)} />
  {/each}
</tr>

<style>
</style>
