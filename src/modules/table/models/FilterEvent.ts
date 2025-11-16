export enum SortType {
    ASC = 'ASC',
    DESC = 'DESC',
}

export interface FilterItem {
    field: string;
    value: string;
}

export interface SortItem {
    field: string;
    type: SortType;
}

/**
 * Evento de filtro.
 * 
 * Es disparado por el componente MainTable cuando se aplica un filtro, ordenamiento o paginacion.
 */
export interface FilterEvent {
    page?: number;
    pageSize?: number;
    sorts?: SortItem[];
    filters?: FilterItem[];
}