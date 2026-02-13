

/**
 * Evento emitido por la seleccion
 */
export type SelectionEvent = any[];

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