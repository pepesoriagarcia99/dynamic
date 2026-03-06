import { FormState } from '../../form/FormState';
import { FormStateNotifier } from '../../form/FormStateNotifier';

import {
  Artifact,
  ArtifactEditableListener,
  ArtifactEditableListenerFun,
  ArtifactType,
  
} from '../Artifact';

export class AutoArtifact extends Artifact {
  readonly id: string;

  readonly type: ArtifactType = 'AUTO';

  readonly columnType: string;

  readonly columnName: string;

  // readonly required: boolean;

  // editable: boolean;

  // isValid: boolean;

  // oldValue: any;

  // private _value: any;

  // editableListener: ArtifactEditableListenerFun;

  constructor(id: string, columnType: string, columnName: string, required: boolean) {
    super();

    this.id = id;
  }

  // setFormStateNotifier(notifier: FormStateNotifier): void {
  //   // this.stateNotifier = notifier;
  //   notifier.subscribe((state: FormState) => {
  //     this.editable = state.editable;
  //     if (this.editableListener) {
  //       this.editableListener(this.editable);
  //     }
  //   });
  // }

  // setArtifactFormValueMediator(formValueMediator: ArtifactMediator): void {
  //   // this.formValueMediator = formValueMediator;
  //   formValueMediator.subscribe((value: any) => {});
  // }

  // setValue(value: any): void {
  //   this.oldValue = this._value;
  //   this._value = value;
  // }

  // getValue(): any {
  //   return this._value;
  // }

  // subscribeOnEditableChange(callback: ArtifactEditableListenerFun): void {
  //   this.editableListener = callback;
  // }

    // subscribeOnValueChange(callback: ArtifactEditableListenerFun): void {
  //   this.editableListener = callback;
  // }
}
