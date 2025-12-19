import { TransformerTemplate } from '../TransformerTemplate';

import type { Column } from '../../models/column/Column';
import type { NumberColumnConfiguration } from '../../models/column/ColumnConfiguration';

export class NumberTransformer extends TransformerTemplate {
  constructor(column: Column, element: any) {
    super(column, element);
  }

  private isLocaleCode(locale: string): boolean {
    try {
      Intl.getCanonicalLocales(locale);
      return true;
    } catch {
      return false;
    }
  }

  getValue(): string | undefined {
    let value;
    let rowValue = this.getElementValue();
    const configuration = this.column.configuration as NumberColumnConfiguration;

    let locale =
      configuration?.IntlNumberFormat?.locale && this.isLocaleCode(configuration.IntlNumberFormat.locale) === true
        ? configuration.IntlNumberFormat.locale
        : navigator.language;

    value = new Intl.NumberFormat(locale, configuration?.IntlNumberFormat?.options ?? {}).format(rowValue);

    if (configuration?.prefix) {
      value = configuration.prefix + value;
    }

    if (configuration?.suffix) {
      value = value + configuration.suffix;
    }

    return value;
  }
}
