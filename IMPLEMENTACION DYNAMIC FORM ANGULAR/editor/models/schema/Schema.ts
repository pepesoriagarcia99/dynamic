import { Artifact } from '../artifact/Artifact';
import { FormStrategy } from '../form/FormStrategy';


export class Schema {
  private readonly formStrategy: FormStrategy;

  artifacts: Artifact[];

  private isActive: boolean = false;

// saber si es valido
// controla los cambios del esquema

  constructor(artifacts: Artifact[], formStrategy: FormStrategy) {
    this.artifacts = artifacts;
    this.formStrategy = formStrategy;
  }

  public getIsActive(): boolean {
    return this.isActive;
  }

  // public getIsValid(): boolean {
  //   return this.artifacts.every(artifact => artifact.isValid());
  // }
}
