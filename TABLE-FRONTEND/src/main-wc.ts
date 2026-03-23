import Table from './modules/table/components/Table.svelte';

export { Table };

// Exportar tipos de modelos
export type { Column, ColumnType } from './modules/table/models/column/Column';
export type { RowData } from './modules/table/models/row/RowData';

// Exportar tipos de columnas específicas
export type { ColorConfiguration, ColumnConfiguration } from './modules/table/models/column/ColumnConfiguration';

// Exportar tipos de eventos
export type { RowEventType, EventContext, EventMouse, RowEvent } from './modules/table/models/event/RowEvent';
export type { ContextMenuEvent } from './modules/table/models/event/ContextMenuEvent';
export type { SelectionEvent, PaginationEvent, SortOrder, SortEvent, FilterEvent, TableReadyEvent } from './modules/table/models/event/TableEvent';

// Exportar API pública
export type { PublicApi } from './modules/table/models/public-api/PublicApi';


