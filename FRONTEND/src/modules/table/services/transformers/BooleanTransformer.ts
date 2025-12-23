import { TransformerTemplate } from '../TransformerTemplate';

import type { Column } from '../../models/column/Column';

export class BooleanTransformer extends TransformerTemplate {
  constructor(column: Column) {
    super(column);
  }

  getValue(element: any): boolean {
    return Boolean(String(this.getElementValue(element)).toLocaleLowerCase() === 'true');
  }
}
