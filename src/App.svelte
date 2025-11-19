<script lang="ts">
  import './app.css';
  import type { Column } from './modules/table/models/Column';
  // @ts-ignore
  import Table from './modules/table/components/Table.svelte';

  import { onMount } from 'svelte';
  import type { RowEvent } from './modules/table/models/TableEvents';
  import type { SelectionEvent } from './modules/table/models/SelectionEvent';
  import type { FilterEvent } from './modules/table/models/FilterEvent';

  let columns: Column[] = [
    { key: 'name', name: 'Name', type: String, filterable: true },
    { key: 'url', name: 'URL', type: String }
  ];

  let data: any[] = [];

  let loading = true;

  function loadPokemon() {
    loading = true;
    fetch('https://pokeapi.co/api/v2/pokemon?limit=100000&offset=0')
      .then((res) => res.json())
      .then((res) => {
        data = res.results;
      })
      .catch(console.error)
      .finally(() => {
        loading = false;
      });
  }

  onMount(loadPokemon);

  function onRowClick(event: any & { detail: RowEvent }) {
    console.log('CLICKED: ', event.detail);
  }

  function onRowSelect(event: any & { detail: SelectionEvent }) {
    console.log('SELECTED: ', event.detail);
  }

  function onFilterChange(event: any & { detail: FilterEvent }) {
    console.log('FILTERED: ', event.detail);
  }
</script>

<main>
  <div class="content">
    <h1>🎨 Dynamic Table - Desarrollo</h1>

    <div class="table-container">
      <dyn-table {loading} {columns} {data} filterable={true} selectableType="multiple" on:rowClick={onRowClick} on:selection={onRowSelect} on:filterChange={onFilterChange}
      ></dyn-table>
    </div>
  </div>
</main>

<style>
  .content {
    margin: 2rem;
  }
  .table-container {
    max-height: 500px;
    overflow-x: auto;
    overflow-y: auto;
  }

  h1 {
    margin-bottom: 20px;
  }

  dyn-table::part(row) {
    cursor: pointer;
  }

  dyn-table::part(row):hover {
    background: rgb(196, 196, 196);
  }

  dyn-table::part(row-even) {
    background: #ffffff;
  }

  dyn-table::part(row-odd) {
    background: #b9ccffa2;
  }

  dyn-table::part(row-selected) {
    background: #d8e24a !important;
  }
</style>
