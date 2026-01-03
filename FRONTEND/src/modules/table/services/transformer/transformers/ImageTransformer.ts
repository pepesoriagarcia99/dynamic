import { TransformerTemplate } from '../TransformerTemplate';

import type { Column } from '../../models/column/Column';
import type { ImageValue } from '../../models/transformer/TransformerReturnType';
import type { ImageColumnConfiguration } from '../../models/column/ColumnConfiguration';

export class ImageTransformer extends TransformerTemplate {
  private altText: string;

  constructor(column: Column) {
    super(column);
    
    const configuration = this.column.configuration as ImageColumnConfiguration;
    this.altText = configuration?.altText ?? `Image value ${this.column.name}`;
  }

  getValue(element: any): ImageValue {
    const rowValue = this.getElementValue(element);

    return {
      src: String(rowValue),
      alt: this.altText
    };
  }
}
