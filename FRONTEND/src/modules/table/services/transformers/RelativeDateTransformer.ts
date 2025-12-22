import { TransformerTemplate } from '../TransformerTemplate';

import type { Column } from '../../models/column/Column';

export class RelativeDateTransformer extends TransformerTemplate {
  constructor(column: Column, element: any) {
    super(column, element);
  }

  getValue(): string {
    return this.getElementValue();
  }
}
