
export type SelectableType = 'single' | 'multiple' | 'none';
export type SortableType = 'single' | 'multiple' | 'none';

/**
 * Tipos de filtros disponibles
 * * basic: Filtro basico con un solo campo de texto.
 * * simple: Filtro simple se asigna el input segun el tipo de columna.
 * * advanced: Filtro avanzado segun el tipo decolumna y permite acciones logicas.
 * * none: Sin filtro
 */
export type FilterableType = 'basic' | 'simple' | 'advanced' | 'custom' | 'none';

export type PageableType = 'pagination' | 'infinite' | 'none';

export interface TableConfiguration {
    /** Rows actions */
    selectableType: SelectableType; // Si es diferente de none emite evento de seleccion de fila o filas
    selectAll: boolean; // Si esta activo muestra checkbox en cabecera para seleccionar todas las filas y muestra checkbox en cada fila. REQUIERE selectableType: 'multiple'
    filterableType: FilterableType;
    sortableType: SortableType; // Si es diferente de none muestra iconos de ordenacion en cabecera, emite evento de ordenacion
    pageableType: PageableType; 
    primaryKey?: string; // Clave primaria de la fila
    resizable: boolean; // Si esta activo permite redimensionar las columnas
}