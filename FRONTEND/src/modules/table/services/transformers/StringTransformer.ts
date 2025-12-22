import { TransformerTemplate } from '../TransformerTemplate';

import type { Column } from '../../models/column/Column';

export class StringTransformer extends TransformerTemplate {
  constructor(column: Column, element: any) {
    super(column, element);
  }

  getValue(): string | undefined {
    let rowValue = this.getElementValue();

    return rowValue;
  }
}
