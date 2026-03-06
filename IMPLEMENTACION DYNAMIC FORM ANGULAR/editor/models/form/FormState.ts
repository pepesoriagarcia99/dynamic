
/**
 * Patron State Holder
 * 
 * El estado de la configuracion del formulario, esta formulario tiene la posibilidad de cambiar de estado
 */

import { FormStrategy } from "./FormStrategy";

export class FormState {

  private readonly formStrategy: FormStrategy;

  private _editable: boolean;

  private _rowId?: string;

  private _templateId?: number;

  constructor(editable: boolean, formStrategy: FormStrategy, rowId?: string, templateId?: number) {
    this._editable = editable;
    this.formStrategy = formStrategy;
    this._rowId = rowId;
    this._templateId = templateId;
  }

  get editable() {
    return this._editable;
  }

  setEditable(value: boolean) {
    this._editable = value;
  }

  setRowId(value: string) {
    this._rowId = value;
  }

  setTemplateId(value: number) {
    this._templateId = value;
  }

  clone(): FormState {
    return new FormState(this._editable, this.formStrategy);
  }
}
