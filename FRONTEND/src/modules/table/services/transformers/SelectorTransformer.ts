import { TransformerTemplate } from '../TransformerTemplate';

import type { Column } from '../../models/column/Column';

export class SelectorTransformer extends TransformerTemplate {
  constructor(column: Column, element: any) {
    super(column, element);
  }

  getValue(): string | undefined {
    return this.getElementValue() as string | undefined;
  }
}
