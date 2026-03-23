import type { ColorConfiguration } from '../common/ColorConfiguration';

/**
 * Configuracion de color par ala fila de la tabla.
 * * Se asigna igual que la de la columna pero sele pone un key de columna que comprobar
 */
export interface RowColorConfiguration {
  column: string;
  colorConfiguration: ColorConfiguration[];
}

/**
 * Configuracion de la tabla fila par ala tabla
 */
export interface RowConfiguration {
  rowColorConfiguration?: RowColorConfiguration[];
}

/**
 * Configuracion compilada
 */
export interface RowConfigurationCompiled extends RowConfiguration {
  compiled: {
    styleGetters?: Record<string, (value: any) => string>;
    valueGetters?: Record<string, (row: any) => any>;
  };
}
