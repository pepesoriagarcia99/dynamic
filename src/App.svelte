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
  import Image from './modules/table/models/column-types/Image';
  import type { ContextMenuEvent } from './modules/table/models/event/ContextMenuEvent';

  let columns: Column[] = [
    { key: 'flags.png', name: 'Bandera', type: Image, style: { width: '50px' } },
    { key: 'name.common', name: 'Nombre nombre de columna my largo para probar que se ve correctamente jajjajajaja mortal', type: String, filterable: true },
    { key: 'region', name: 'Region', type: String, sortable: true },
    { key: 'subregion', name: 'Subregion', type: String, filterable: true },
    { key: 'capital.[0]', name: 'Capital', type: String, filterable: true },
    { key: 'population', name: 'Poblacion', type: String, sortable: true }
  ];

  let loading: boolean = $state(false);
  let count: number | undefined = $state<number | undefined>(0);
  let data: any[] = $state<any[]>([]);
  let filteredData: any[] = $state<any[]>([]);

  let tableEl: (HTMLElement & PublicApi) | null;

  let tableFilter: TableEvent;

  function getCountries() {
    loading = true;
    return fetch('https://restcountries.com/v3.1/independent?status=true')
      .then((res) => res.json())
      .then((res) => {
        count = res.length;
        data = res.map((item: any, index: number) => ({
          ...item,
          key: index.toString()
        }));

        transform();
      })
      .catch(console.error)
      .finally(() => {
        loading = false;
      });
  }

  function transform() {
    // paginacion
    const page = tableFilter.page;
    const start = (page.page - 1) * page.pageSize;
    const end = start + page.pageSize;

    filteredData = data.slice(start, end);
  }

  // function filterValues() {
  //   const filters = tableFilter.filter;

  //   if (filters.length === 0) {
  //     filteredData = data;
  //     return;
  //   }

  //   filteredData = data.filter((row: any) => {
  //     return filters.every(({ key, value }) => {
  //       const cellValue = key.split('.').reduce((obj, k) => (obj && obj[k] !== 'undefined' ? obj[k] : undefined), row);
  //       if (cellValue === undefined || cellValue === null) return false;
  //       if (!value) return true;

  //       return cellValue.toString().toLowerCase().includes(value.toString().toLowerCase());
  //     });
  //   });
  // }

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

    // filterValues();
  }

  function onSortChange(event: any & { detail: SortEvent }) {
    console.log('SORTED: ', event.detail);

    tableFilter.sort = event.detail;
  }

  function onPageChange(event: any & { detail: PageEvent }) {
    console.log('PAGE: ', event.detail);

    tableFilter.page = event.detail;
    transform();
  }

  function onReady(event: any & { detail: TableEvent }) {
    console.log('READY: ', event.detail);

    tableFilter = event.detail;
    getCountries();
  }

  function onContextMenuEvent(event: any & { detail: ContextMenuEvent }) {
    console.log('CONTEXT MENU EVENT: ', event.detail);
  }
</script>

<main>
  <div class="content">
    <h1>🎨 Dynamic Table - Desarrollo</h1>

    <div class="table-container">
      <dyn-table
        id="main-table"
        primaryKey="key"
        {loading}
        {columns}
        {count}
        data={filteredData}
        filterable={true}
        pageable={true}
        resizable={true}
        selectableType="multiple"
        sortableType="multiple"
        pageSizeOptions={[5, 50, 100, 200]}
        pageSize={5}
        onready={onReady}
        onrowClick={onRowClick}
        onselection={onRowSelect}
        onfilterChange={onFilterChange}
        onsortChange={onSortChange}
        onpageChange={onPageChange}
        oncontextMenuEvent={onContextMenuEvent}
      >
        <div slot="contextMenu" class="contextmenu">
          <button class="contextmenu-btn"> Editar </button>
          <button class="contextmenu-btn"> Eliminar </button>
        </div>
      </dyn-table>
    </div>
  </div>
</main>

<style>
  .content {
    margin: 2rem;
  }
  .table-container {
    height: 800px;
    overflow-x: auto;
    overflow-y: auto;
    display: flex;
    flex-direction: column;
  }

  h1 {
    margin-bottom: 20px;
  }

  dyn-table::part(column-value-0) {
    width: 40px;
    height: auto;
  }

  .contextmenu {
    padding: 4px 0;
  }

  .contextmenu-btn {
    width: 100%;
    padding: 8px 16px;
    border: none;
    background: none;
    cursor: pointer;
    text-align: left;
  }

  .contextmenu-btn:hover {
    background: gainsboro;
  }
</style>
