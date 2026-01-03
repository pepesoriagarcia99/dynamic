import moment from 'moment';
import { TransformerTemplate } from '../TransformerTemplate';

import type { Column } from '../../models/column/Column';
import type { DateColumnConfiguration } from '../../models/column/ColumnConfiguration';

export class DateTransformer extends TransformerTemplate {
  private format: string | undefined;

  constructor(column: Column) {
    super(column);
    
    const configuration = this.column.configuration as DateColumnConfiguration;
    this.format = configuration?.format;
  }

  getValue(element: any): string | undefined {
    const rowValue = this.getElementValue(element);
    
    if (this.format) {
      return moment(rowValue).format(this.format);
    }
    
    return rowValue;
  }
}