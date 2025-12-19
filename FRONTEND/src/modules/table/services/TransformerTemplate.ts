import type { Column } from '../models/column/Column';
import type { TransformerValue } from '../models/transformer/TransformerReturnType';

export abstract class TransformerTemplate {
  column: Column;

  element: any;

  constructor(column: Column, element: any) {
    this.column = column;
    this.element = element;
  }

  protected getElementValue(k?: string): any {
    const key = k ?? this.column.key;
    let keys = key.split('.');

    if (keys.length > 1) {
      let currentValue = this.element;
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
      return this.element[key];
    }
  }

  abstract getValue(): TransformerValue;
}
