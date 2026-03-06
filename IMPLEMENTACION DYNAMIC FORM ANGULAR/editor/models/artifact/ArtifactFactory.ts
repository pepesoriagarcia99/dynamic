import { FormArtifactBackend } from '../input/InputBuilder';
import { Artifact } from './Artifact';
import { AutoArtifact } from './artifacts/AutoArtifact';
import { SpacerArtifact } from './artifacts/SpacerArtifact';

type Constructor<T> = (config: any) => T;

export class ArtifactFactory {
  private static registry: Map<string, Constructor<Artifact>> = new Map();

  static register(type: string, ctor: Constructor<Artifact>) {
    this.registry.set(type, ctor);
  }

  static create(artifact: FormArtifactBackend): Artifact {
    const ctor = this.registry.get(artifact.type);
    if (!ctor) throw new Error(`Type of artifact unknown: ${artifact.type}`);
    return ctor(artifact);
  }
}

// Registro
ArtifactFactory.register('AUTO', ({ id }: FormArtifactBackend) => new AutoArtifact(id));
ArtifactFactory.register('SPACER', ({ id }: FormArtifactBackend) => new SpacerArtifact(id));
