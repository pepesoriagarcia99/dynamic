import type { Column } from '../../models/column/Column';
import { TransformerTemplate } from '../TransformerTemplate';

export class NativeTransformer extends TransformerTemplate {
  constructor(column: Column) {
    super(column);
  }

  getValue(element: any): any {
    return this.getElementValue(element);
  }
}
