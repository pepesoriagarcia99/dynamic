<svelte:options customElement="dyn-table" />

<script lang="ts">
  import type { Column } from '../models/Column';
  import Header from './Header.svelte';
  import Row from './Row.svelte';
  import type { RowEvent } from '../models/TableEvents';

  let el: HTMLElement;

  // Inputs
  export let columns: Column[] = [];
  export let data: any[] = [];

  export let selectable: boolean = false;
  export let filterable: boolean = false;

  // Computed
  $: tableConfiguration = {
    selectable,
    filterable
  };

  console.log('dyn-table component initialized with columns:', columns, 'and data:', data);

  function onRowClick(event: RowEvent) {
    console.log('Row event received in dyn-table:', event);

    el.dispatchEvent(
      new CustomEvent('selected', {
        detail: event,
        bubbles: true
      })
    );
  }
</script>

<table bind:this={el} class="table" part="table">
  <Header {columns} {tableConfiguration}/>

  <tbody>
    {#each data as row, i}
      <Row index={i} {columns} {row} {tableConfiguration} onSelect={(event) => onRowClick(event)} />
    {/each}
  </tbody>
</table>

<style>
  .table {
    width: 100%;
  }
</style>
