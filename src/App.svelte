<script lang="ts">
  import './app.css';
  import type { Column } from './modules/table/models/Column';
  // @ts-ignore
  import Table from './modules/table/components/Table.svelte';

  import { onMount } from 'svelte';
  import type { RowEvent } from './modules/table/models/event/RowEvent';
  import type { SelectionEvent } from './modules/table/models/event/SelectionEvent';
  import type { FilterEvent } from './modules/table/models/event/FilterEvent';
  import type { SortEvent } from './modules/table/models/event/SortEvent';
  import type { PageEvent } from './modules/table/models/event/PageEvent';
  import type { PublicApi } from './modules/table/models/public-api/PublicApi';
  import type { TableEvent } from './modules/table/models/event/TableEvent';

  let columns: Column[] = [
    { key: 'name', name: 'Name', type: String, filterable: true, sortable: true },
    { key: 'url', name: 'URL', type: String, filterable: true, sortable: true }
  ];

  let loading = $state(false);
  let count = $state<number | undefined>(undefined);
  let data = $state<any[]>([]);

  let tableEl: (HTMLElement & PublicApi) | null;

  function loadPokemon(page: number, pageSize: number) {
    loading = true;

    const offset = (page - 1) * pageSize;
    fetch(`https://pokeapi.co/api/v2/pokemon?limit=${pageSize}&offset=${offset}`)
      .then((res) => res.json())
      .then((res) => {
        // setTimeout(() => {
        //   count = res.count;
        //   data = res.results;
        // }, 2000);
      })
      .catch(console.error)
      .finally(() => {
        // setTimeout(() => {
        //   loading = false;
        // }, 2000);
      });
  }

  onMount(() => {
    tableEl = document.getElementById('main-table') as HTMLElement & PublicApi;
  });

  function onRowClick(event: any & { detail: RowEvent }) {
    console.log('CLICKED: ', event.detail);
  }

  function onRowSelect(event: any & { detail: SelectionEvent }) {
    console.log('SELECTED: ', event.detail);
  }

  function onFilterChange(event: any & { detail: FilterEvent }) {
    console.log('FILTERED: ', event.detail);

    tableEl?.pagination.resetPage();
  }

  function onSortChange(event: any & { detail: SortEvent }) {
    console.log('SORTED: ', event.detail);
  }

  function onPageChange(event: any & { detail: PageEvent }) {
    console.log('PAGE: ', event.detail);
    const { page, pageSize } = event.detail.page;
    loadPokemon(page, pageSize);
  }

  function onReady(event: any & { detail: TableEvent }) {
    console.log('READY: ', event.detail);
    const { page, pageSize } = event.detail.page;
    loadPokemon(page, pageSize);
  }
</script>

<main>
  <div class="content">
    <h1>🎨 Dynamic Table - Desarrollo</h1>

    <div class="table-container">
      <dyn-table
        id="main-table"
        {loading}
        {columns}
        {count}
        {data}
        filterable={true}
        pageable={true}
        selectableType="multiple"
        sortableType="single"
        pageSizeOptions={[25, 50, 100, 200]}
        pageSize={50}
        onready={onReady}
        onrowClick={onRowClick}
        onselection={onRowSelect}
        onfilterChange={onFilterChange}
        onsortChange={onSortChange}
        onpageChange={onPageChange}
      ></dyn-table>
    </div>
  </div>
</main>

<style>
  .content {
    margin: 2rem;
  }
  .table-container {
    height: 500px;
    overflow-x: auto;
    overflow-y: auto;
    display: flex;
    flex-direction: column;
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
