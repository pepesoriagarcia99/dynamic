import Table from './modules/table/components/Table.svelte';

export { Table };


// Exportar tipos de modelos
export type { Column } from './modules/table/models/column/Column';
export type { RowData } from './modules/table/models/RowData';

// Exportar tipos de columnas específicas
export type { ColumnType } from './modules/table/models/column/column-types/ColumnType';
// export type { BigNumber } from './modules/table/models/column-types/BigNumber';
// export type { Enum } from './modules/table/models/column-types/Enum';
// export type { Image } from './modules/table/models/column-types/Image';

// Exportar tipos de eventos
export type { FilterEvent } from './modules/table/models/event/FilterEvent';
export type { SortEvent } from './modules/table/models/event/SortEvent';
export type { PageEvent } from './modules/table/models/event/PageEvent';
export type { RowEvent } from './modules/table/models/event/RowEvent';
export type { SelectionEvent } from './modules/table/models/event/SelectionEvent';
export type { AdvanceFilter } from './modules/table/models/event/AdvanceFilter';
export type { ContextMenuEvent } from './modules/table/models/event/ContextMenuEvent';

// Exportar API pública
export type { PublicApi } from './modules/table/models/public-api/PublicApi';
export type { FilterApi } from './modules/table/models/public-api/FilterApi';
export type { PaginationApi } from './modules/table/models/public-api/PaginationApi';
export type { SelectionApi } from './modules/table/models/public-api/SelectionApi';