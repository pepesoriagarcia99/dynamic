import { QueryStrategy } from "../model/db-strategies/QueryStrategy";
import { Model } from "../model/Model";
import { Filter } from "./Filter";

/**
 * Factory para crear instancias de Filter
 * 
 * Utiliza una estrategia de consulta para mapear modelos específicos de base de datos a modelos genéricos
 */
export class FilterFactory {
  /**
   * La estrategia utilizada en la factoria es comun para toda la generacion de filtros
   * @private
   */
  private queryStrategy: QueryStrategy;

  constructor(queryStrategy: QueryStrategy) {
    this.queryStrategy = queryStrategy;
  }

  /**
   * Creador de Filter con modelo de datos
   * 
   * @param dbModel Modelo de datos segun estrategia elegida
   * @returns Filter
   */
  createWithModel(dbModel: any): Filter {
    const model: Model = this.queryStrategy.structureMapper(dbModel);
    return new Filter(this.queryStrategy, model);
  }
}