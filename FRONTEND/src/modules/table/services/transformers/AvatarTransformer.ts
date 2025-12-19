import { TransformerTemplate } from '../TransformerTemplate';

import type { Column } from '../../models/column/Column';
import type { AvatarValue } from '../../models/transformer/TransformerReturnType';
import type { AvatarColumnConfiguration } from '../../models/column/ColumnConfiguration';

export class AvatarTransformer extends TransformerTemplate {
  constructor(column: Column, element: any) {
    super(column, element);
  }

  getValue(): AvatarValue {
    const configuration = this.column.configuration as AvatarColumnConfiguration;
    const rowValue = this.getElementValue();

    let picture = configuration?.pictureUrl;
    if (configuration?.pictureColumn) {
      picture = this.getElementValue(configuration.pictureColumn);
    }

    return {
      picture: picture,
      name: String(rowValue),
      alt: configuration?.altText ?? `Avatar value ${this.column.name}`
    };
  }
}
