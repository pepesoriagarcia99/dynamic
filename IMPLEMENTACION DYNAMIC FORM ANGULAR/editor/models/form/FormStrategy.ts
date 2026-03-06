
/**
 * Patron strategy para formularios
 * 
 * La estrategia del formulario debe aplicar a la emision de eventos
 */

import { Form } from "./Form";

export interface FormStrategy {
  isValid(form: Form): boolean;
  getChanges(form: Form): Record<string, any>;
  // changeSchema(form: Form): void;
}

export class GeneralFormStrategy implements FormStrategy {
  isValid(form: Form): boolean {
    // return form.getSchemas().every(s =>
    //   s.artifacts.every(a => a.value !== null && a.value !== undefined)
    // );
  }

  getChanges(form: Form): Record<string, any> {
    // return Object.fromEntries(form["changes"]);
  }

  // changeSchema(form: Form) {

  // }
}

export class SpecificFormStrategy implements FormStrategy {



  isValid(form: Form): boolean {
    // const schema = form.getActiveSchema();
    // if (!schema) return false;
    // return schema.artifacts.every(a => a.value !== null && a.value !== undefined);
  }

  getChanges(form: Form): Record<string, any> {
    // const schema = form.getActiveSchema();
    // if (!schema) return {};
    // return Object.fromEntries(
    //   Array.from(form["changes"]).filter(([col]) =>
    //     schema.artifacts.some(a => a.column === col)
    //   )
    // );
  }

  // changeSchema(form: Form) {

  // }
}

class DependentSchemaFormStrategy implements FormStrategy {
  constructor(private dependencies: string[]) {}

  isValid(form: Form): boolean {
    // return form.getSchemas()
    //   .filter(s => this.dependencies.includes(s.id))
    //   .every(s => s.artifacts.every(a => a.value !== null && a.value !== undefined));
  }

  getChanges(form: Form): Record<string, any> {
    // return Object.fromEntries(
    //   Array.from(form["changes"]).filter(([col]) =>
    //     form.getSchemas()
    //       .filter(s => this.dependencies.includes(s.id))
    //       .some(s => s.artifacts.some(a => a.column === col))
    //   )
    // );
  }
}