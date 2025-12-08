import { FilterEvent } from "../FilterEvent";
import { Column, Model } from "../Model";
import { QueryStrategy } from "./QueryStrategy";

export class PostgreSQLStrategy implements QueryStrategy {
  private tableSchema?: any;

  constructor() {}

  setModel(schema: any): void {
    this.tableSchema = schema;
  }

  structureMapper(schema: any): Model {
    const fields: Column[] = [];

    // mapeo de columnas y tipos

    return new Model(schema.tableName, fields);
  }

  generate(model: Model, filter: FilterEvent): string {
    let query = `SELECT * FROM ${model.name}`;

    // generacion de la query

    return query;
  }
}