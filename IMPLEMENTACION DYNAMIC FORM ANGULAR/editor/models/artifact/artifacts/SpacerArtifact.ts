import { Artifact, ArtifactType } from '../Artifact';

export class SpacerArtifact extends Artifact {
  readonly id: string;

  readonly type: ArtifactType = 'SPACER';

  constructor(id: string) {
    super();
    this.id = id;
  }
}
