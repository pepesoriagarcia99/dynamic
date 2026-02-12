import type { RowData } from "../RowData";


/**
 * Evento emitido por la selleccion
 */
export interface SelectionEvent {
    key: string;
    value: RowData;
}

/**
 * Evento emitido por la paginacion
 */
export interface PaginationEvent {
    page: number;
    pageSize: number;
}

/**
 * Evento emitido por el sort
 */
export type SortOrder = 'asc' | 'desc';
export interface SortEvent {
    key: string;
    value: SortOrder | null;
}



/**
 * Evento emitido por el filtro basic y simple
 */

export interface FilterEvent {
    key: string;
    value: string | null;
}

/**
 * Evento emitido cuando la tabla esta ready
 */
export interface TableReadyEvent {
    filter: FilterEvent[],
    pagination: PaginationEvent,
    sort: SortEvent[]
}