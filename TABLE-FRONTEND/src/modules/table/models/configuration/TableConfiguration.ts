import type { RowConfigurationCompiled } from "../row/RowConfiguration";

export type SelectableType = 'single' | 'multiple' | 'none';
export type SortableType = 'single' | 'multiple' | 'none';

/**
 * Tipos de filtros disponibles
 * * simple: Filtro basico con un solo campo de texto.
 * * advanced: Filtro avanzado segun el tipo decolumna y permite acciones logicas.
 * * none: Sin filtro
 */
export type FilterableType = 'simple' | 'advanced' | 'custom' | 'none';

export type PageableType = 'pagination' | 'infinite' | 'none';

export interface TableConfiguration {
    /** Rows actions */
    selectableType: SelectableType; // Si es diferente de none emite evento de seleccion de fila o filas
    filterableType: FilterableType;
    sortableType: SortableType; // Si es diferente de none muestra iconos de ordenacion en cabecera, emite evento de ordenacion
    pageableType: PageableType; 
    primaryKey?: string; // Clave primaria de la fila
    resizable: boolean; // Si esta activo permite redimensionar las columnas
    expansible: boolean; // Si esta activo permite expandir filas para mostrar contenido adicional
    configurationCompiled?: RowConfigurationCompiled; // Configuracion compilada de la tabla
}