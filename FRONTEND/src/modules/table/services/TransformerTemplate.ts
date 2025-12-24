import type { Column } from '../models/column/Column';
import type { ColorConfiguration } from '../models/column/ColumnConfiguration';
import type { TransformerValue } from '../models/transformer/TransformerReturnType';

export abstract class TransformerTemplate {
  protected column: Column;

  private baseValue: any;

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

      this.baseValue = currentValue;
    } else {
      this.baseValue = element[key];
    }

    return this.baseValue
  }

  /**
   * TODO: Revisart tipado typescript
   * TODO: Revisar rendimiento
   */
  public getStyle(): string {
    const configStyle: ColorConfiguration<any>[] = (this.column.configuration as any)?.colorConfiguration ?? [];
    let style: string = '';

    configStyle.forEach((config) => {
      if (config.range) {
        if (Number(this.baseValue) >= Number(config.range.min) && Number(this.baseValue) <= Number(config.range.max)) {
          style = config.style as string;
        }
      } else if (config.value !== undefined && String(this.baseValue) === String(config.value)) {
        style = config.style as string;
      }
    });

    return style;
  }

  abstract getValue(element: any): TransformerValue;
}
