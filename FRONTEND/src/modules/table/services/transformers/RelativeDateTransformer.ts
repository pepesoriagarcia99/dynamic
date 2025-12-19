import { TransformerTemplate } from '../TransformerTemplate';
import moment from 'moment';

import type { Column } from '../../models/column/Column';

export class RelativeDateTransformer extends TransformerTemplate {
  constructor(column: Column, element: any) {
    super(column, element);
  }

  getValue(): string {
    return moment(this.getElementValue()).toISOString();
  }
}
