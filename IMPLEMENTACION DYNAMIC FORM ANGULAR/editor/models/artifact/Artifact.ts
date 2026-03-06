/**
 * Patrones implementados:
 *
 * Composite -> Artifact sera la clase padre de todos los artefactos, algunos aplicaran ChangeEvent otros no
 */

import { FormStateNotifier } from '../form/FormStateNotifier';
import { GlobalValueListener } from '../value/GlobalValueMediator';

export type ArtifactEditableListenerFun = (editable: boolean) => void;

export interface ArtifactEditableListener {
  editableListener: ArtifactEditableListenerFun;

  subscribeOnEditableChange(callback: ArtifactEditableListenerFun): void;
}

export interface ArtifactFormStateNotifier {
  // stateNotifier: FormStateNotifier;

  setFormStateNotifier(notifier: FormStateNotifier): void;
}

export interface GlobalValueMediator {
  setGlobalValueMediator(mediator: GlobalValueListener): void;
}

// export interface ArtifactValue {
//   readonly columnName: string;

//   readonly required: boolean;

//   editable: boolean;

//   isValid: boolean;

//   oldValue: any;

//   _value: any;

//   setValue(value: any): void;

//   getValue(): any;
// }

// export interface ArtifactVisibility {
//   visible: boolean;
// }

export type ArtifactType =
  | 'SPACER'
  | 'AUTO'
  | 'BOOLEAN'
  | 'DATE'
  | 'SELECTOR'
  | 'HEADER'
  | 'ATTACHMENTS'
  | 'GROUP'
  | 'BUTTON'
  | 'HISTORY'
  | 'FILE'
  | 'PARAGRAPH'
  | 'TEXTAREA'
  | 'MULTI-SELECTOR';

export abstract class Artifact {
  abstract id: string;

  abstract type: ArtifactType;

  

  /**
   * Todos los artifacts observan los cambios por que todos los artifacts implementan visibilidad
   */
  // setGlobalValueMediator(mediator: GlobalValueListener): void {
  //   mediator.subscribe((value: any) => {});
  // }
}
