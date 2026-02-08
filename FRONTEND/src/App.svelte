<script lang="ts">
  import './app.css';
  import type { Column } from './modules/table/models/column/Column';
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
  import type { ContextMenuEvent } from './modules/table/models/event/ContextMenuEvent';

  let columns: Column[] = [
    { key: 'flags.png', name: 'Bandera', type: 'image', style: { width: '80px' } },
    {
      key: 'avatar',
      name: 'Nombre nombre de columna my largo para probar que se ve correctamente jajjajajaja mortal',
      type: 'avatar',
      style: { 'max-width': '200px' },
      filterable: true
    },
    { key: 'continents.[0]', name: 'Continente', type: 'string', sortable: true },
    { key: 'region', name: 'Region', type: 'string', sortable: true },
    { key: 'subregion', name: 'Subregion', type: 'string', filterable: true },
    { key: 'capital.[0]', name: 'Capital', type: 'string', filterable: true },
    {
      key: 'population',
      name: 'Poblacion',
      type: 'number',
      filterable: true,
      sortable: true
    },
    { key: 'unMember', name: 'ONU', type: 'boolean', filterable: true, sortable: true },
    {
      key: 'foundation',
      name: 'Fundacion',
      type: 'date',
      filterable: true,
      sortable: true
    },
    {
      key: 'foundation',
      name: 'Fundacion',
      type: 'date'
    },
    {
      key: 'pib',
      name: 'PIB (USD)',
      type: 'number',
      filterable: true,
      sortable: true
    },
    {
      key: 'area',
      name: 'Area',
      type: 'number',
      configuration: {
        colorConfiguration: [
          {
            range: { min: 0, max: 10000 },
            style: {
              color: 'green'
            }
          },
          {
            range: { min: 10001, max: 100000 },
            style: {
              color: 'orange'
            }
          },
          {
            range: { min: 100001, max: Infinity },
            style: {
              color: 'red'
            }
          }
        ]
      },
      filterable: true,
      sortable: true
    },
    {
      key: 'density',
      name: 'Densidad de poblacion',
      type: 'selector',
      configuration: {
        colorConfiguration: [
          {
            value: 'Low',
            style: {
              color: '#065F46',
              'background-color': '#D1FAE5',
              'border-radius': '4px',
              'font-weight': '600'
            }
          },
          {
            value: 'Medium',
            style: {
              color: '#854D0E',
              'background-color': '#FEF9C3',
              'border-radius': '4px',
              'font-weight': '600'
            }
          },
          {
            value: 'High',
            style: {
              color: '#7F1D1D',
              'background-color': '#FECACA',
              'border-radius': '4px',
              'font-weight': '600'
            }
          }
        ],
        options: ['Low', 'Medium', 'High']
      },
      filterable: true,
      sortable: true
    },
    {
      key: 'region',
      name: 'Region',
      type: 'selector',
      filterable: true,
      sortable: false,
      configuration: {
        filterType: 'auto-complete',
        options: ['Africa', 'Antarctica', 'Asia', 'Europe', 'North America', 'Oceania', 'South America']
      }
    },
    {
      key: 'region',
      name: 'Region',
      type: 'selector',
      filterable: true,
      sortable: false,
      configuration: {
        filterType: 'multi-selector',
        options: ['Africa', 'Antarctica', 'Asia', 'Europe', 'North America', 'Oceania', 'South America']
      }
    },
    { key: 'region', name: 'Region', type: 'string' },
    { key: 'region', name: 'Region', type: 'string' },
    { key: 'region', name: 'Region', type: 'string' },
    { key: 'region', name: 'Region', type: 'string' },
    { key: 'region', name: 'Region', type: 'string' },
    { key: 'region', name: 'Region', type: 'string' },
    { key: 'region', name: 'Region', type: 'string' },
    { key: 'region', name: 'Region', type: 'string' },
    { key: 'region', name: 'Region', type: 'string' },
    { key: 'region', name: 'Region', type: 'string' },
    { key: 'region', name: 'Region', type: 'string' },
    { key: 'region', name: 'Region', type: 'string' },
    { key: 'region', name: 'Region', type: 'string' }
  ];

  let loading: boolean = $state(false);
  let count: number | undefined = $state<number | undefined>(0);
  let data: any[] = $state<any[]>([]);
  let filteredData: any[] = $state<any[]>([]);

  let tableEl: (HTMLElement & PublicApi) | null;

  let tableFilter: TableEvent;

  function hashString(str: string): string {
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
      const char = str.charCodeAt(i);
      hash = (hash << 5) - hash + char;
      hash = hash & hash; // Convert to 32bit integer
    }
    return Math.abs(hash).toString(16);
  }

  function getCountries() {
    loading = true;
    return fetch('https://restcountries.com/v3.1/independent?status=true')
      .then((res) => res.json())
      .then((res) => {
        count = res.length * 4;
        data = [...res, ...res, ...res, ...res].map((item: any, index: number) => {
          const densityValue = item.population / item.area;
          const hash = hashString(item.name.common);
          return {
            ...item,
            key: index.toString(),
            foundation: new Date().toISOString(),
            pib: Math.floor(Math.random() * 100000),
            density: densityValue > 1000 ? 'High' : densityValue > 100 ? 'Medium' : 'Low',
            avatar: {
              picture: `https://gravatar.com/avatar/${hash}?d=identicon`,
              alt: `Flag of ${item.name.common}`,
              name: item.name.common
            }
          };
        });

        transform();
      })
      .catch(console.error)
      .finally(() => {
        loading = false;
        setTimeout(() => {
          loading = false;
        }, 2000);
      });
  }

  function transform() {
    let dataFrame = data;

    //filter
    const filters = tableFilter.filter;
    if (filters.length > 0) {
      dataFrame = dataFrame.filter((row: any) => {
        return filters.every(({ key, value }) => {
          const cellValue = key
            .split('.')
            .reduce((obj, k) => (obj && obj[k] !== 'undefined' ? obj[k] : undefined), row);
          if (cellValue === undefined || cellValue === null) return false;
          if (!value) return true;

          return cellValue.toString().toLowerCase().includes(value.toString().toLowerCase());
        });
      });
    }

    // paginacion
    const page = tableFilter.page;
    const start = (page.page - 1) * page.pageSize;
    const end = start + page.pageSize;

    filteredData = dataFrame.slice(start, end);
  }

  onMount(() => {
    tableEl = document.getElementById('main-table') as HTMLElement & PublicApi;
  });

  function onScrollEndEvent(event: any & { detail: any }) {
    console.log('SCROLL END EVENT: ', event.detail);
  }

  function onRowClick(event: any & { detail: RowEvent }) {
    console.log('CLICKED: ', event.detail);
  }

  function onSelection(event: any & { detail: SelectionEvent }) {
    console.log('SELECTED: ', event.detail);
  }

  function onFilterChange(event: any & { detail: FilterEvent }) {
    console.log('FILTERED: ', event.detail);

    // tableEl?.pagination.resetPage();
    // tableFilter.page.page = 1;
    // tableFilter.filter = event.detail;

    // transform();
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
    console.log('PUBLIC API: ', tableEl?.pagination);

    tableFilter = event.detail;
    getCountries();
  }

  function onContextMenuEvent(event: any & { detail: ContextMenuEvent }) {
    console.log('CONTEXT MENU EVENT: ', event.detail);
  }
</script>

<main>
  <div class="content">
    <dyn-table
      id="main-table"
      primaryKey="key"
      {loading}
      {columns}
      {count}
      data={filteredData}
      filterable="basic"
      pageableType="pagination"
      resizable={true}
      selectableType="multiple"
      sortableType="multiple"
      pageSizeOptions={[5, 50, 100, 200]}
      pageSize={100}
      {onReady}
      {onRowClick}
      {onSelection}
      {onFilterChange}
      {onSortChange}
      {onPageChange}
      {onContextMenuEvent}
      {onScrollEndEvent}
      
    >
      <div slot="context-menu" class="context-menu">
        <button class="context-menu-btn"> Editar </button>
        <button class="context-menu-btn"> Eliminar </button>
      </div>
    </dyn-table>
  </div>
</main>

<style>
  .content {
    margin: 1rem;
    height: calc(100vh - 2rem);
    width: calc(100vw - 2rem);
  }

  dyn-table {
    display: block;
    height: 100%;
    width: 100%;
  }

  dyn-table::part(column-value-0) {
    width: 40px;
    height: auto;
  }

  dyn-table::part(column-value-2) {
    font-weight: 700;
  }

  .context-menu {
    padding: 4px 0;
  }

  .context-menu-btn {
    width: 100%;
    padding: 8px 16px;
    border: none;
    background: none;
    cursor: pointer;
    text-align: left;
  }

  .context-menu-btn:hover {
    background: gainsboro;
  }
</style>
