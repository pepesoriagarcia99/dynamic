import { QueryStrategy } from './QueryStrategy';
import { FilterEvent } from '../FilterEvent';
import { Column, Model } from '../Model';
import { Model as MongooseModel } from 'mongoose';

/**
 * Implementacion de estrategia de consultas para MongoDB
 *
 * * Integrado con la libreria mongoose
 */
export class MongoDBQueryStrategy implements QueryStrategy {

  constructor() {}

  generate(model: Model, filter: FilterEvent): any {
    const query: any = {};

    // generacion de la query

    return query;
  }

  structureMapper(model: MongooseModel<any>): Model {
    const schemaPaths = model.schema.paths;
    const fields: Column[] = [];

    for (const path in schemaPaths) {
      fields.push({
        name: path,
        type: schemaPaths[path].instance || 'Mixed',
      });
    }

    return new Model(model.modelName, fields);
  }
}
