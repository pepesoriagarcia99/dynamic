
export type SelectableType = 'single' | 'multiple' | 'none';
export type SortableType = 'single' | 'multiple' | 'none';

export interface TableConfiguration {
    /** Rows actions */
    selectableType: SelectableType; // Si es diferente de none emite evento de seleccion de fila o filas
    selectAll: boolean; // Si esta activo muestra checkbox en cabecera para seleccionar todas las filas y muestra checkbox en cada fila. REQUIERE selectableType: 'multiple'
    filterable: boolean; // Si esta activo muestra filtro en cabecera, emite evento de filtrado
    sortableType: SortableType; // Si es diferente de none muestra iconos de ordenacion en cabecera, emite evento de ordenacion
    pageable: boolean; // Si esta activo muestra paginacion en la parte inferior de la tabla, emite evento de cambio de pagina
}