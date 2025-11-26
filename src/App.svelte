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
    { key: 'name', name: 'Name', type: String, filterable: true, sortable: true },
    { key: 'name', name: 'Name', type: String, filterable: true, sortable: true },
    { key: 'name', name: 'Name', type: String, filterable: true, sortable: true },
    { key: 'name', name: 'Name', type: String, filterable: true, sortable: true },
    { key: 'name', name: 'Name', type: String, filterable: true, sortable: true },
    { key: 'name', name: 'Name', type: String, filterable: true, sortable: true },
    { key: 'name', name: 'Name', type: String, filterable: true, sortable: true },
    { key: 'name', name: 'Name', type: String, filterable: true, sortable: true },
    { key: 'name', name: 'Name', type: String, filterable: true, sortable: true },
    { key: 'name', name: 'Name', type: String, filterable: true, sortable: true },
    { key: 'name', name: 'Name', type: String, filterable: true, sortable: true },
    { key: 'name', name: 'Name', type: String, filterable: true, sortable: true },
    { key: 'name', name: 'Name', type: String, filterable: true, sortable: true },
    { key: 'name', name: 'Name', type: String, filterable: true, sortable: true },
    { key: 'name', name: 'Name', type: String, filterable: true, sortable: true },
    { key: 'name', name: 'Name', type: String, filterable: true, sortable: true },
    { key: 'name', name: 'Name', type: String, filterable: true, sortable: true },
    { key: 'name', name: 'Name', type: String, filterable: true, sortable: true },
    { key: 'url', name: 'URL', type: String, filterable: true, sortable: true }
  ];

  let loading = $state(false);
  let count = $state<number | undefined>(undefined);
  let data = $state<any[]>([]);

  let tableEl: (HTMLElement & PublicApi) | null;

  let tableFilter: TableEvent;

  function loadPokemon() {
    loading = true;

    // page: number, pageSize: number
    // const offset = (page - 1) * pageSize;
    // ?limit=${pageSize}&offset=${offset}

    fetch(`https://pokeapi.co/api/v2/pokemon?limit=1000000000&offset=0`)
      .then((res) => res.json())
      .then((res) => {
        setTimeout(() => {
          const page = tableFilter?.page?.page || 1;
          const pageSize = tableFilter?.page?.pageSize || 50;
          const offset = (page - 1) * pageSize;

          let prevData = res.results.slice(offset, offset + pageSize);

          tableFilter.filter.forEach((filter) => {
            prevData = prevData.filter((item: any) =>
              item[filter.key]?.toLowerCase().includes(filter.value?.toLocaleLowerCase())
            );
          });

          prevData = prevData.sort((a: any, b: any) => {
            for (const sortItem of tableFilter.sort) {
              const aValue = a[sortItem.key];
              const bValue = b[sortItem.key];

              if (aValue < bValue) return sortItem.value === 'asc' ? -1 : 1;
              if (aValue > bValue) return sortItem.value === 'asc' ? 1 : -1;
            }
            return 0;
          });

          if (tableFilter.sort.length > 0 || tableFilter.filter.length > 0) {
            count = prevData.length;
          } else {
            count = res.count;
          }

          data = prevData;
        }, 1);
      })
      .catch(console.error)
      .finally(() => {
        setTimeout(() => {
          loading = false;
        }, 1);
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
    tableFilter.filter = event.detail;
    loadPokemon();
  }

  function onSortChange(event: any & { detail: SortEvent }) {
    console.log('SORTED: ', event.detail);

    tableFilter.sort = event.detail;
    loadPokemon();
  }

  function onPageChange(event: any & { detail: PageEvent }) {
    console.log('PAGE: ', event.detail);

    tableFilter.page = event.detail;
    loadPokemon();
  }

  function onReady(event: any & { detail: TableEvent }) {
    console.log('READY: ', event.detail);

    tableFilter = event.detail;
    loadPokemon();
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

  /* dyn-table::part(row) {
    cursor: pointer;
  } */

  /* dyn-table::part(row):hover {
    background: rgb(196, 196, 196);
  } */

  /* dyn-table::part(row-even) {
    background: #ffffff;
  }

  dyn-table::part(row-odd) {
    background: #b9ccffa2;
  } */

  /* dyn-table::part(row-selected) {
    background: #d8e24a !important;
  } */
</style>
