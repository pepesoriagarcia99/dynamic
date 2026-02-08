import type { Style } from "./Style";

export interface ColorConfiguration<T> {
  range?: {
    min: T;
    max: T;
  };

  value?: T;
  style: Style | string;
}

export interface NumberColumnConfiguration {
  colorConfiguration?: ColorConfiguration<number>[];
}

export interface StringColumnConfiguration {
  colorConfiguration?: Omit<ColorConfiguration<string>, 'range'>[];
}

export interface DateColumnConfiguration {
  colorConfiguration?: ColorConfiguration<Date>[];
}

export interface BooleanColumnConfiguration {}

export interface SelectorColumnConfiguration {
  options: Array<string>,
  filterType: 'simple-selector' | 'search-selector' | 'multi-selector' | 'auto-complete';
  colorConfiguration?: Omit<ColorConfiguration<string>, 'range'>[];
}
