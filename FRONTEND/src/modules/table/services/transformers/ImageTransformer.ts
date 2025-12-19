import { TransformerTemplate } from '../TransformerTemplate';

import type { Column } from '../../models/column/Column';
import type { ImageValue } from '../../models/transformer/TransformerReturnType';
import type { ImageColumnConfiguration } from '../../models/column/ColumnConfiguration';

export class ImageTransformer extends TransformerTemplate {
  constructor(column: Column, element: any) {
    super(column, element);
  }

  getValue(): ImageValue {
    const rowValue = this.getElementValue();
    const configuration = this.column.configuration as ImageColumnConfiguration;

    return {
      src: String(rowValue),
      alt: configuration?.altText ?? `Image value ${this.column.name}`
    };
  }
}
