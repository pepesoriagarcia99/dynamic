import { FilterEvent } from '../FilterEvent';
import { Model } from '../Model';

/**
 * Interfaz de implementacion de estrategia para consultas
 *
 * Patron de diseño Strategy
 */
export interface QueryStrategy {
  // Método para generar la consulta a partir del modelo y el evento de filtro
  generate(model: Model, filter: FilterEvent): string | any;

  // Método para mapear desde el modelo específico de DB al modelo genérico
  structureMapper(model: any): Model;
}
