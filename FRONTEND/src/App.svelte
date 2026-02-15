<script lang="ts">
  import './app.css';
  import type { Column } from './modules/table/models/column/Column';
  // @ts-ignore
  import Table from './modules/table/components/Table.svelte';

  import { onMount } from 'svelte';
  import type { RowEvent } from './modules/table/models/event/RowEvent';
  import type {
    FilterEvent,
    PaginationEvent,
    SelectionEvent,
    SortEvent,
    TableReadyEvent
  } from './modules/table/models/event/TableEvent';
  import type { ContextMenuEvent } from './modules/table/models/event/ContextMenuEvent';
  // import BasicControl from './modules/controls/components/BasicControl.svelte';
  // import SelectorControl from './modules/controls/components/SelectorControl.svelte';
  // import CheckControl from './modules/controls/components/CheckControl.svelte';
  import type { PublicApi } from './main-wc';

  let showTable: boolean = $state(true);

  // 26 columnas
  let columns: Column[] = [
    {
      key: 'avatar',
      name: 'Avatar',
      type: 'avatar',
      filterable: true,
      sortable: false
    },
    {
      key: 'firstName',
      name: 'Nombre',
      type: 'string',
      filterable: true,
      sortable: true
    },
    {
      key: 'lastName',
      name: 'Apellido',
      type: 'string',
      filterable: true,
      sortable: true
    },
    {
      key: 'email',
      name: 'Email',
      type: 'string',
      filterable: true,
      sortable: true
    },
    {
      key: 'phone',
      name: 'Telefono',
      type: 'string',
      filterable: true,
      sortable: true
    },
    {
      key: 'username',
      name: 'Nombre de usuario',
      type: 'string',
      filterable: true,
      sortable: true
    },
    {
      key: 'dateOfBirth',
      name: 'Fecha de nacimiento',
      type: 'string',
      filterable: true,
      sortable: true
    },
    {
      key: 'gender',
      name: 'Género',
      type: 'string',
      filterable: true,
      sortable: true,
      configuration: {
        colorConfiguration: [
          {
            value: 'female',
            style: {
              color: '#000000',
              'background-color': '#FF00C8',
              'border-radius': '4px',
              'font-weight': '600'
            }
          },
          {
            value: 'male',
            style: {
              color: '#FFFFFF',
              'background-color': '#0059FF',
              'border-radius': '4px',
              'font-weight': '600'
            }
          }
        ]
      }
    },
    {
      key: 'address.street',
      name: 'Calle',
      type: 'string',
      filterable: true,
      sortable: true
    },
    {
      key: 'address.city',
      name: 'Ciudad',
      type: 'string',
      filterable: true,
      sortable: true
    },
    {
      key: 'address.state',
      name: 'Estado',
      type: 'string',
      filterable: true,
      sortable: true
    },
    {
      key: 'address.zipCode',
      name: 'Código Postal',
      type: 'string',
      filterable: true,
      sortable: true
    },
    {
      key: 'address.country',
      name: 'País',
      type: 'string',
      filterable: true,
      sortable: true
    },
    {
      key: 'preferences.timezone',
      name: 'Zona horaria',
      type: 'string',
      filterable: true,
      sortable: true
    },
    {
      key: 'preferences.language',
      name: 'Idioma',
      type: 'string',
      filterable: true,
      sortable: true
    },
    {
      key: 'employment.company',
      name: 'Compañia empleadora',
      type: 'string',
      filterable: true,
      sortable: true
    },
    {
      key: 'employment.position',
      name: 'Puesto de empleo',
      type: 'string',
      filterable: true,
      sortable: true
    },
    {
      key: 'status',
      name: 'Estado',
      type: 'string',
      filterable: true,
      sortable: true,
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
            value: 'High',
            style: {
              color: '#7F1D1D',
              'background-color': '#FECACA',
              'border-radius': '4px',
              'font-weight': '600'
            }
          }
        ]
      }
    },
    {
      key: 'isVerified',
      name: 'Verificado',
      type: 'boolean',
      filterable: true,
      sortable: true
    },
    {
      key: 'subscription.plan',
      name: 'Plan de suscripción',
      type: 'string',
      filterable: true,
      sortable: true,
      configuration: {
        colorConfiguration: [
          {
            value: 'pro',
            style: {
              color: '#065F46',
              'background-color': '#D1FAE5',
              'border-radius': '4px',
              'font-weight': '600'
            }
          },
          {
            value: 'basic',
            style: {
              color: '#854D0E',
              'background-color': '#FEF9C3',
              'border-radius': '4px',
              'font-weight': '600'
            }
          }
        ]
      }
    },
    {
      key: 'rating',
      name: 'Calificación',
      type: 'string',
      filterable: true,
      sortable: true,
      configuration: {
        colorConfiguration: [
          {
            range: { min: 7, max: 10 },
            style: {
              color: 'green'
            }
          },
          {
            range: { min: 5, max: 6.99 },
            style: {
              color: 'orange'
            }
          },
          {
            range: { min: 0, max: 4.99 },
            style: {
              color: 'red'
            }
          }
        ]
      }
    },
    {
      key: 'lastLoginAt',
      name: 'Último inicio de sesión',
      type: 'string',
      filterable: true,
      sortable: true
    },
    {
      key: 'createdAt',
      name: 'Fecha de creación',
      type: 'string',
      filterable: true,
      sortable: true
    },
    {
      key: 'emergencyContact.name',
      name: 'Contacto de emergencia',
      type: 'string',
      filterable: true,
      sortable: true
    },
    {
      key: 'emergencyContact.relationship',
      name: 'Relación de contacto de emergencia',
      type: 'string',
      filterable: true,
      sortable: true
    },
    {
      key: 'emergencyContact.phone',
      name: 'Teléfono de contacto de emergencia',
      type: 'string',
      filterable: true,
      sortable: true
    }
  ];

  let loading: boolean = $state(false);
  let count: number | undefined = $state<number | undefined>(0);
  let data: any[] = $state([]);

  let tableEl: (HTMLElement & PublicApi) | null;

  let tableFilter: TableReadyEvent;

  function getUsers() {
    loading = true;

    const url = new URL('http://localhost:3001/api/users');
    if (tableFilter.pagination) {
      url.searchParams.set('page', String(tableFilter.pagination.page));
      url.searchParams.set('limit', String(tableFilter.pagination.pageSize));
    }

    // Filtros como header en formato JSON string
    const headers: HeadersInit = {
      'Content-Type': 'application/json'
    };

    if (tableFilter.filter) {
      headers['X-Filters'] = JSON.stringify(tableFilter.filter);
    }

    if (tableFilter.sort) {
      headers['X-Sorts'] = JSON.stringify(tableFilter.sort);
    }

    return fetch(url)
      .then((res) => res.json())
      .then((res) => {
        count = res.count;
        data = res.data;
      })
      .catch(() => {
        console.error('Error fetching users');
      })
      .finally(() => {
        loading = false;
      });
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

  function onSelectionChange(event: any & { detail: SelectionEvent }) {
    console.log('SELECTED: ', event.detail);
  }

  function onFilterChange(event: any & { detail: FilterEvent }) {
    console.log('FILTERED: ', event.detail);
  }

  function onSortChange(event: any & { detail: SortEvent }) {
    console.log('SORTED: ', event.detail);

    tableFilter.sort = event.detail;
    getUsers();
  }

  function onPageChange(event: any & { detail: PaginationEvent }) {
    console.log('PAGE: ', event.detail);

    tableFilter.pagination = event.detail;
    getUsers();
  }

  function onReady(event: any & { detail: TableReadyEvent }) {
    console.log('READY: ', event.detail);
    tableFilter = event.detail;
    getUsers();
  }

  function onContextMenuEvent(event: any & { detail: ContextMenuEvent }) {
    console.log('CONTEXT MENU EVENT: ', event.detail);
  }
</script>

<main>
  <div class="toolbar">
    <label class="toggle-label" for="toggle-table">
      <input type="checkbox" id="toggle-table" checked={showTable} onchange={() => (showTable = !showTable)} />
      Mostrar tabla
    </label>
    <button onclick={() => tableEl?.pagination.reset()} disabled={loading}> Resetear paginación </button>
    <!-- <button onclick={() => tableEl?.filter.reset()} disabled={loading}>
      Resetear Filtros
    </button>
    <button onclick={() => tableEl?.selection.reset()} disabled={loading}>
      Resetear Selección
    </button> -->
  </div>
  <div class="content">
    <dyn-table
      class:hidden={!showTable}
      id="main-table"
      primaryKey="id"
      {loading}
      {columns}
      {count}
      {data}
      filterableType="none"
      pageableType="pagination"
      resizable={true}
      selectableType="multiple"
      sortableType="multiple"
      pageSizeOptions={[5, 50, 100, 200]}
      pageSize={100}
      {onReady}
      {onRowClick}
      {onSelectionChange}
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

    <!-- <div class:hidden={showTable}>
      <h3>Basico tipo text</h3>
      <BasicControl
        label="Control externo de prueba"
        placeholder="Escribe algo y presiona enter"
        value={'valor test'}
        type="text"
        tooltip="Este es un tooltip de explicacion para el control externo"
        onChange={(value: any) => alert(`Valor ingresado: ${value}`)}
      />

      <h3>Basico tipo number</h3>
      <BasicControl
        label="Control externo de prueba"
        placeholder="Escribe algo y presiona enter"
        value={'valor test'}
        type="number"
        tooltip="Este es un tooltip de explicacion para el control externo"
        onChange={(value: any) => alert(`Valor ingresado: ${value}`)}
      />

      <h3>Selector</h3>
      <SelectorControl
        label="Selector externo de prueba"
        placeholder="Selecciona una opcion"
        options={['option1', 'option2', 'option3']}
        value={'option1'}
        tooltip="Este es un tooltip de explicacion para el selector externo"
        onChange={(value: any) => alert(`Valor seleccionado: ${value}`)}
      />

      <h3>Check 3 estados</h3>
      <CheckControl
        label="Check externo de prueba"
        value={true}
        tooltip="Este es un tooltip de explicacion para el check externo"
        triState={true}
        onChange={(value: any) => alert(`Valor seleccionado: ${value}`)}
      />

      <h3>Check 2 estados</h3>
      <CheckControl
        label="Check externo de prueba"
        value={true}
        tooltip="Este es un tooltip de explicacion para el check externo"
        triState={false}
        onChange={(value: any) => alert(`Valor seleccionado: ${value}`)}
      />
    </div> -->
  </div>
</main>

<style>
  .toolbar {
    display: flex;
    align-items: center;
    gap: 12px;
    padding: 8px 16px;
    background: #f9fafb;
    border-bottom: 1px solid #e5e7eb;
  }

  .toggle-label {
    display: flex;
    align-items: center;
    gap: 6px;
    font-size: 0.875rem;
    color: #374151;
    cursor: pointer;
    user-select: none;
  }

  .content {
    margin: 1rem;
    height: calc(100vh - 6rem);
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

  dyn-table::part(column-value-1) {
    font-weight: 700;
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

  button {
    padding: 8px 16px;
    border: 1px solid #d1d5db;
    border-radius: 6px;
    background: linear-gradient(to bottom, #ffffff, #f3f4f6);
    color: #374151;
    font-size: 0.875rem;
    font-weight: 500;
    cursor: pointer;
    transition: all 0.15s ease;
    box-shadow: 0 1px 2px rgba(0, 0, 0, 0.05);
  }

  button:hover {
    background: linear-gradient(to bottom, #f9fafb, #e5e7eb);
    border-color: #9ca3af;
  }

  button:active {
    background: #e5e7eb;
    box-shadow: inset 0 1px 2px rgba(0, 0, 0, 0.1);
  }

  button:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }

  .hidden {
    display: none;
  }
</style>
