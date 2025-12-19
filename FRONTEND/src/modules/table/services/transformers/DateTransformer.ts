import moment from 'moment';
import { TransformerTemplate } from '../TransformerTemplate';

import type { Column } from '../../models/column/Column';
import type { DateColumnConfiguration } from '../../models/column/ColumnConfiguration';

export class DateTransformer extends TransformerTemplate {

  constructor(column: Column, element: any) {
    super(column, element);
  }

  getValue(): string | undefined {
    let rowValue = this.getElementValue();
    const configuration = this.column.configuration as DateColumnConfiguration;

    if (configuration?.format) {
      return moment(rowValue).format(configuration.format);
    } else {
      return rowValue;
    }
  }
}
