/**
 * Patron Facade para controlar todos los subsistemas de formularios
 */

import { Schema } from '../schema/Schema';
import { GlobalValueMediator } from '../value/GlobalValueMediator';
import { FormBuilder } from './FormBuilder';
import { FormState } from './FormState';
import { FormStateNotifier } from './FormStateNotifier';
import { FormStrategy, GeneralFormStrategy } from './FormStrategy';

interface FormFlags {
  strategy?: FormStrategy;
  editable?: boolean;
}

export class Form {
  public static FormBuilder: FormBuilder = new FormBuilder();

  /**
   * Estado de la configuracion del formulario
   */
  private readonly formState: FormState;

  private readonly formStateNotifier: FormStateNotifier;

  private readonly globalValueMediator: GlobalValueMediator;

  schemas: Schema[];

  constructor(schemas: Schema[], flags: FormFlags) {
    const strategy = flags.strategy ?? new GeneralFormStrategy();
    const editable = flags.editable ?? true;
    this.formState = new FormState(editable, strategy);

    this.formStateNotifier = new FormStateNotifier(this.formState.clone());
    this.globalValueMediator = new GlobalValueMediator();

    this.schemas = schemas;
    this.schemas.forEach(schema => schema.artifacts.forEach(artifact => {
      // artifact.setFormStateNotifier(this.stateNotifier);
      // artifact.setArtifactFormValueMediator(this.state.formValueMediator);
    }));
  }

  setEditable(value: boolean) {
    this.formState.setEditable(value);
    this.formStateNotifier.emit(this.formState.clone());
  }

  setRowId(value: string) {
    this.formState.setRowId(value);
    this.formStateNotifier.emit(this.formState.clone());
  }

  setTemplateId(value: number) {
    this.formState.setTemplateId(value);
    this.formStateNotifier.emit(this.formState.clone());
  }
}
