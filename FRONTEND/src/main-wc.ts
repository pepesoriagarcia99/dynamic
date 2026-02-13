import Table from './modules/table/components/Table.svelte';

export { Table };

// Exportar tipos de modelos
export type { Column, ColumnType } from './modules/table/models/column/Column';
export type { RowData } from './modules/table/models/RowData';

// Exportar tipos de columnas específicas
export type { ColorConfiguration } from './modules/table/models/column/ColumnConfiguration';

// Exportar tipos de eventos
export type { RowEvent } from './modules/table/models/event/RowEvent';
export type { AdvanceFilter } from './modules/table/models/event/AdvanceFilterEvent';
export type { ContextMenuEvent } from './modules/table/models/event/ContextMenuEvent';

// Exportar API pública
export type { PublicApi } from './modules/table/models/public-api/PublicApi';
