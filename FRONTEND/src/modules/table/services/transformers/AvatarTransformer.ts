import { TransformerTemplate } from '../TransformerTemplate';

import type { Column } from '../../models/column/Column';
import type { AvatarValue } from '../../models/transformer/TransformerReturnType';
import type { AvatarColumnConfiguration } from '../../models/column/ColumnConfiguration';

export class AvatarTransformer extends TransformerTemplate {
  private pictureUrl: string | undefined;
  private pictureColumn: string | undefined;
  private altText: string;

  constructor(column: Column) {
    super(column);
    
    const configuration = this.column.configuration as AvatarColumnConfiguration;
    this.pictureUrl = configuration?.pictureUrl;
    this.pictureColumn = configuration?.pictureColumn;
    this.altText = configuration?.altText ?? `Avatar value ${this.column.name}`;
  }

  getValue(element: any): AvatarValue {
    const rowValue = this.getElementValue(element);

    let picture = this.pictureUrl;
    if (this.pictureColumn) {
      picture = this.getElementValue(element, this.pictureColumn);
    }

    return {
      picture: picture,
      name: String(rowValue),
      alt: this.altText
    };
  }
}
