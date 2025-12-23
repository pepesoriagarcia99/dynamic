import type { Column } from '../models/column/Column';
import type { TransformerValue } from '../models/transformer/TransformerReturnType';

export abstract class TransformerTemplate {
  column: Column;

  constructor(column: Column) {
    this.column = column;
  }

  protected getElementValue(element: any, k?: string): any {
    const key = k ?? this.column.key;
    let keys = key.split('.');

    if (keys.length > 1) {
      let currentValue = element;
      for (const key of keys) {
        const arrayIndexMatch = key.match(/\[(\d+)\]$/);

        if (arrayIndexMatch) {
          const index = parseInt(key.replaceAll(/[^\d]/g, ''));
          currentValue = currentValue[index];
        } else {
          currentValue = currentValue[key];
        }
      }

      return currentValue;
    } else {
      return element[key];
    }
  }

  abstract getValue(element: any): TransformerValue;
}
