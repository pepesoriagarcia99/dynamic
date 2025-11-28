import { ColumnType } from './column-types/ColumnType';

export interface ColumnStyle {
  [key: string]: string | number;
}

// export interface ColumnConfiguration {

//   /**
//    * Configuración para mostrar un valor con color según un rango definido.
//    * 
//    * Ejemplo:
//    * showValueInRangeColor: [
//    *  { range: { min: 0, max: 50 }, color: 'danger' },
//    *  { range: { min: 51, max: 80 }, color: 'warn' },
//    *  { range: { min: 81, max: 100 }, color: 'success' }
//    *  ]
//    * 
//    * Esto aplicaría un color 'danger' para valores entre 0 y 50, 'warn' para valores entre 51 y 80, y 'success' para valores entre 81 y 100.
//    * 
//    * Tambien se puede asignar por valor especifico:
//    * showValueInRangeColor: [
//    *  { value: 'active', color: 'success' },
//    *  { value: 'inactive', color: 'danger' }
//    * ]
//    */
//   showValueInRangeColor?: {
//     range?: {
//       min: number;
//       max: number;
//     }
//     value?: string;
//     severity: 'success' | 'secondary' | 'info' | 'warn' | 'danger' | 'contrast';
//   }[]
// }

// export interface ColumnBooleanConfiguration extends ColumnConfiguration {
//   /**
//    * Configuración para mostrar un icono en lugar de texto para valores booleanos (true/false).
//    * 
//    * * Si no se configura, se mostrará "true" o "false" como texto.
//    */
//   showValueInIconMode?: {
//     trueValue: string;
//     falseValue: string;
//   };
// }

// export interface ColumnDateConfiguration extends ColumnConfiguration {
//   format?: string; // Formato de fecha, por ejemplo 'dd/MM/yyyy'
// }

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
  type: Function | ColumnType;

  /**
   * Estilo personalizado para la columna.
   */
  style?: ColumnStyle;

  /**
   * Indica si la columna es ordenable.
   */
  sortable?: boolean;

  /**
   * Indica si la columna es filtrable.
   */
  filterable?: boolean;

  /**
   * Configuracion dinamica para las columnas
   * TODO: tengo dudas de sobreesto, quizas este mejor dentro de un FIlterStrategy dentro del ColumnType
   */
  // configuration?: ColumnDateConfiguration | ColumnBooleanConfiguration;

  // TODO: pensar----------------------------------------------------------
  // ejemplo:
  // boolean con showtype icon -> mostraria un icono de check o no
  //
  // showType?: 'default' | 'text' | 'icon' | 'input';
}
