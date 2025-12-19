import { TransformerTemplate } from '../TransformerTemplate';

import type { Column } from '../../models/column/Column';

export class BooleanTransformer extends TransformerTemplate {
  constructor(column: Column, element: any) {
    super(column, element);
  }

  getValue(): boolean {
    return Boolean(String(this.getElementValue()).toLocaleLowerCase() === 'true');
  }
}
