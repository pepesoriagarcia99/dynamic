import { TransformerTemplate } from '../TransformerTemplate';

import type { Column } from '../../models/column/Column';
import type { StringColumnConfiguration } from '../../models/column/ColumnConfiguration';

export class StringTransformer extends TransformerTemplate {
  constructor(column: Column, element: any) {
    super(column, element);
  }

  getValue(): string | undefined {
    let rowValue = this.getElementValue();
    const configuration = this.column.configuration as StringColumnConfiguration;

    if (configuration?.representation) {
      if (configuration.representation === 'uppercase') {
        return String(rowValue).toUpperCase();
      } else if (configuration.representation === 'lowercase') {
        return String(rowValue).toLowerCase();
      } else if (configuration.representation === 'capitalize') {
        return String(rowValue).replace(/\b\w/g, (char) => char.toUpperCase());
      } else if (configuration.representation === 'trim') {
        return String(rowValue).trim();
      } else {
        throw new Error(`Unknown representation type: ${configuration.representation}`);
      }
    } else {
      return rowValue;
    }
  }
}
