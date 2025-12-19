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
  IntlNumberFormat?: {
    locale?: string;
    options?: Intl.NumberFormatOptions;
  };

  suffix?: string;
  prefix?: string;

  colorConfiguration?: ColorConfiguration<number>[];
}

export interface StringColumnConfiguration {
  representation?: 'uppercase' | 'lowercase' | 'capitalize' | 'trim';
  colorConfiguration?: Omit<ColorConfiguration<string>, 'range'>[];
}

export interface DateColumnConfiguration {
  format?: string; // Formato de fecha, por ejemplo 'dd/MM/yyyy'

  colorConfiguration?: ColorConfiguration<Date>[];
}

export interface BooleanColumnConfiguration {}

export interface AvatarColumnConfiguration {
  pictureUrl?: string; // URL de la imagen del avatar
  pictureColumn?: string; // Nombre de la columna que contiene la URL de la imagen
  altText?: string; // Texto alternativo para la imagen
}

export interface ImageColumnConfiguration {
  altText?: string; // Texto alternativo para la imagen
}

export interface SelectorColumnConfiguration {
  options: [],
  filterType: 'simple-selector' | 'search-selector' | 'multi-selector' | 'auto-complete';
  colorConfiguration?: Omit<ColorConfiguration<string>, 'range'>[];
}
