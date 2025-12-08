// Tengo que crear un servicio de lectura y sanetizacion de parametros http sigulendo mi patron y que despues traduzca eso a una query ya sea mongo o postgres o mysql.....

import { FilterEvent } from '../model/FilterEvent';
import { Model } from '../model/Model';
import { QueryStrategy } from '../model/db-strategies/QueryStrategy';

/**
 * Servicio de filtrado dinamico
 * 
 * Utiliza una estrategia de consulta para generar queries segun el motor de base de datos
 */
export class Filter {
  private model: Model;
  private queryStrategy: QueryStrategy;

  constructor(queryStrategy: QueryStrategy, model: Model) {
    this.queryStrategy = queryStrategy;
    this.model = model;
  }

  public getQuery(filter: FilterEvent): string | any {
    return this.queryStrategy.generate(this.model, filter);
  }

  public getModelInfo(): Model | undefined {
    return this.model;
  }
}
