import { TransformerTemplate } from '../TransformerTemplate';

import type { Column } from '../../models/column/Column';
import type { NumberColumnConfiguration } from '../../models/column/ColumnConfiguration';

export class NumberTransformer extends TransformerTemplate {
  private formatter: Intl.NumberFormat;
  private prefix: string;
  private suffix: string;

  constructor(column: Column) {
    super(column);

    const configuration = this.column.configuration as NumberColumnConfiguration;

    const locale =
      configuration?.IntlNumberFormat?.locale && this.isLocaleCode(configuration.IntlNumberFormat.locale)
        ? configuration.IntlNumberFormat.locale
        : navigator.language;

    this.formatter = new Intl.NumberFormat(locale, configuration?.IntlNumberFormat?.options ?? {});
    this.prefix = configuration?.prefix ?? '';
    this.suffix = configuration?.suffix ?? '';
  }

  private isLocaleCode(locale: string): boolean {
    try {
      Intl.getCanonicalLocales(locale);
      return true;
    } catch {
      return false;
    }
  }

  getValue(element: any): string | undefined {
    const rowValue = this.getElementValue(element);
    const formattedValue = this.formatter.format(rowValue);
    
    return this.prefix + formattedValue + this.suffix;
  }
}
