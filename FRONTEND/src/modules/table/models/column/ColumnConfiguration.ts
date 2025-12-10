// export interface ColumnConfiguration {

//   /**
//    * Configuración para mostrar un valor con color según un rango definido.
//    *
//    * Ejemplo:
//    * showValueInRangeColor: [
//    *  { range: { min: 0, max: 50 }, color: 'danger' },
//    *  { range: { min: 51, max: 80 }, color: 'warn' },
//    *  { range: { min: 81, max: 100 }, color: 'success' }
//    *  ]
//    *
//    * Esto aplicaría un color 'danger' para valores entre 0 y 50, 'warn' para valores entre 51 y 80, y 'success' para valores entre 81 y 100.
//    *
//    * Tambien se puede asignar por valor especifico:
//    * showValueInRangeColor: [
//    *  { value: 'active', color: 'success' },
//    *  { value: 'inactive', color: 'danger' }
//    * ]
//    */
//   showValueInRangeColor?: {
//     range?: {
//       min: number;
//       max: number;
//     }
//     value?: string;
//     severity: 'success' | 'secondary' | 'info' | 'warn' | 'danger' | 'contrast';
//   }[]
// }

// export interface ColumnBooleanConfiguration extends ColumnConfiguration {
//   /**
//    * Configuración para mostrar un icono en lugar de texto para valores booleanos (true/false).
//    *
//    * * Si no se configura, se mostrará "true" o "false" como texto.
//    */
//   showValueInIconMode?: {
//     trueValue: string;
//     falseValue: string;
//   };
// }

interface Color {
  text: string; // Color del texto
  background: string; // Color de fondo
}

export interface ColorConfiguration<T> {
  range?: {
    min: T;
    max: T;
  };

  value?: T;

  color: Color;
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
  representation?: 'uppercase' | 'lowercase' | 'capitalize' | 'trim' | 'none';
  colorConfiguration?: Omit<ColorConfiguration<string>, 'range'>[];
  options?: string[]; // Opciones predefinidas para filtrar o seleccionar
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
