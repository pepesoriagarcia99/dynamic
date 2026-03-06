import { ArtifactFactory } from '../artifact/ArtifactFactory';
import { FormArtifactBackend, FormBackend, FormSchemaBackend } from '../input/InputBuilder';
import { Schema } from '../schema/Schema';
import { Form } from './Form';
import { FormStrategy } from './FormStrategy';

/**
 * Patron Fluent Builder
 * 
 * Permitira construir el formulario de manera fluida
 */

export class FormBuilder {
  private form: FormBackend;

  private editable: boolean = true;

  private strategy: FormStrategy;

  constructor() {}

  setForm(form: FormBackend) {
    this.form = form;
    return this;
  }

  setEditable(editable: boolean) {
    this.editable = editable;
    return this;
  }

  setStrategy(strategy: FormStrategy) {
    this.strategy = strategy;
    return this;
  }

  build(): Form {
    const schemas = this.form.schemas.map((s: FormSchemaBackend) => {
      const artifacts = (s.artifacts || []).map((a: FormArtifactBackend) => {
        const artifact = ArtifactFactory.create(a);

        return artifact;
      });

      return new Schema(artifacts, this.strategy);
    });

    return new Form(schemas, {
      strategy: this.strategy,
      editable: this.editable
    });
  }
}
