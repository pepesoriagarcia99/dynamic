import type {
  BooleanColumnConfiguration,
  DateColumnConfiguration,
  NumberColumnConfiguration,
  SelectorColumnConfiguration,
  StringColumnConfiguration,
} from './ColumnConfiguration';
import type { Style } from './Style';

export type ColumnType = 'string' | 'number' | 'boolean' | 'date' | 'image' | 'avatar' | 'selector';

/**
 * Modelo de Columna de tabla.
 *
 * Define las propiedades y configuraciones de una columna en una tabla.
 */
export interface Column {
  /**
   * Identificador numerico de la columna.
   */
  index?: number;

  /**
   * Clave unica de la columna.
   * Debe ser el nombre real de la columna o un valor mapeado en back con el valor de la columna para generar la query.
   *
   * * Permite acceder a propiedades anidadas utilizando notación de puntos. (ejemplo: "direccion.ciudad")
   */
  key: string;

  /**
   * Nombre visible de la columna
   * Debe ser el valor traducido que se mostrara en el encabezado de la tabla.
   */
  name: string;

  /**
   * Tipo de dato de la columna.
   * Se usa para renderizar el valor y crear el input correcto en los filtros.
   */
  type: ColumnType;

  /**
   * Estilo personalizado para la columna.
   */
  style?: Style | string;

  /**
   * Indica si la columna es ordenable.
   */
  sortable?: boolean;

  /**
   * Indica si la columna es filtrable.
   */
  filterable?: boolean;

  /**
   * Indica si la columna es redimensionable.
   */
  resizable?: boolean;

  /**
   * Configuracion dinamica para las columnas
   */
  configuration?:
  | StringColumnConfiguration
  | NumberColumnConfiguration
  | BooleanColumnConfiguration
  | DateColumnConfiguration
  | SelectorColumnConfiguration;

  /**
   * Función personalizada para obtener el valor de la columna a partir de una fila.
   */
  valueGetter?: (row: any) => any;
  /**
   * Función personalizada para obtener el estilo de la columna a partir de su valor.
   */
  styleGetter?: (value: any) => string;
}
