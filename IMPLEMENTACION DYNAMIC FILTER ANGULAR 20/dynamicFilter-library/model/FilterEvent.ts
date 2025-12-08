export enum SortType {
    ASC = 'ASC',
    DESC = 'DESC',
}

export interface FilterItem {
    index: string;
    field: string;
    value: string;
}

export interface SortItem {
    index: string;
    field: string;
    type: SortType;
}

/**
 * Evento de filtro.
 * 
 * Recibido en formato query param y parseado por el middleware dynamicFilter
 */
export interface FilterEvent {
    page?: number;
    pageSize?: number;

    sorts?: SortItem[];
    filters?: FilterItem[];
}
